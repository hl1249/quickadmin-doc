# WebSocket

项目基于 `@nestjs/websockets` 和 `socket.io` 封装了两套实时通信通道：

- `admin-socket`：后台管理端连接，命名空间为 `/admin`。
- `client-socket`：客户端连接，命名空间为 `/client`。

连接时需要携带登录 token。前端会通过 `auth.token` 传入 `Bearer token`，后端在握手阶段完成鉴权，并把用户信息挂载到 `socket.data.userInfo`。

## admin-socket

`admin-socket` 面向后台管理端，适合系统通知、订单变更、连接池刷新等后台实时消息。

### 主题注册

后台命名空间定义在 `src/websocket/constants/socket.constants.ts` 

```typescript
export const SOCKET_NAMESPACES = {
  admin: '/admin',
  client: '/client',
} as const;
```

事件主题统一注册在 `src/websocket/constants/socket.constants.ts` 

```typescript
export const SOCKET_EVENTS = {
  ping: 'ping',
  pong: 'pong',
  roomJoin: 'room:join',
  roomLeave: 'room:leave',
  notify: 'notify',
  pondUpdate: 'pond:update',
  orderUpdated: 'order:updated',
  chatSend: 'chat:send',
  chatMessage: 'chat:message',
  cartSync: 'cart:sync',
} as const;
```

后台用户连接成功后，会自动加入 `user:{userId}` 房间，后端可通过该房间向指定 `userId` 的用户推送消息。源码位置：

- `src/websocket/gateways/admin.gateway.ts` 

```typescript
authClient.join(buildUserRoom(authClient.data.userInfo._id));
```

作用：后端可以通过 `user:{userId}` 房间向指定用户单播消息。

后台用户单播示例：

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { AdminSocketService } from '@/websocket/services/admin-socket.service';

@Controller('api/admin/task')
export class TaskController {
  constructor(
    private readonly adminSocketService: AdminSocketService,
  ) {}

  @Post('/notify')
  notify(@Body() data: { userId: string; taskId: string }) {
    this.adminSocketService.emitNotifyToUser(data.userId, {
      title: '待办提醒',
      message: '你有一条新的审批任务',
      taskId: data.taskId,
    });

    return { sent: true };
  }
}
```

后台订单定向推送示例：

```typescript
this.adminSocketService.emitOrderUpdatedToUser(userId, {
  orderId,
  title: '订单更新',
  message: '订单状态已变更',
  level: 'info',
});
```

客户端用户单播示例：

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { ClientSocketService } from '@/websocket/services/client-socket.service';

@Controller('api/client/goods')
export class GoodsController {
  constructor(
    private readonly clientSocketService: ClientSocketService,
  ) {}

  @Post('/price-notify')
  priceNotify(@Body() data: { userId: string; goodsId: string }) {
    this.clientSocketService.emitNotifyToUser(data.userId, {
      title: '优惠提醒',
      message: '你关注的商品降价了',
      goodsId: data.goodsId,
    });

    return { sent: true };
  }
}
```

业务房间通过 `room:join` 注册，房间名规则为：

```typescript
buildBizRoom(bizType, bizId); // biz:{bizType}:{bizId}
```

例如订单房间：

```typescript
await joinRoom({
  bizType: 'order',
  bizId: '订单ID',
});
```

新增后台主题时，先在 `SOCKET_EVENTS` 中注册事件名：

```typescript
export const SOCKET_EVENTS = {
  // ... existing events
  taskUpdated: 'task:updated',
} as const;
```

如果该主题需要按业务维度推送，前端先加入业务房间：

```typescript
await adminSocket.joinRoom({
  bizType: 'task',
  bizId: taskId,
});
```

后端推送时使用同样的 `bizType` 和 `bizId`：

```typescript
this.adminSocketService.emitNotifyToBizRoom('task', taskId, {
  title: '任务更新',
  message: '任务状态已变更',
});
```

### 后端 emit、on

Gateway 通过 `@SubscribeMessage` 监听前端事件：

```typescript
@SubscribeMessage(SOCKET_EVENTS.ping)
handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
  client.emit(SOCKET_EVENTS.pong, {
    ts: Date.now(),
    namespace: SOCKET_NAMESPACES.admin,
  });
}
```

加入和退出业务房间：

```typescript
@SubscribeMessage(SOCKET_EVENTS.roomJoin)
handleJoinRoom(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() payload: JoinBizRoomPayload,
) {
  const room = buildBizRoom(payload.bizType, payload.bizId);
  client.join(room);
  return { room, joined: true };
}
```

业务模块需要主动推送后台消息时，注入 `AdminSocketService`：

```typescript
constructor(
  private readonly adminSocketService: AdminSocketService,
) {}
```

全量广播通知：

```typescript
this.adminSocketService.emitNotify({
  title: '系统通知',
  message: '后台广播消息',
});
```

按用户推送：

```typescript
this.adminSocketService.emitNotifyToUser(userId, {
  title: '系统通知',
  message: '只推给指定后台用户',
});
```

按业务房间推送：

```typescript
this.adminSocketService.emitNotifyToBizRoom('order', orderId, {
  title: '订单通知',
  message: '订单状态发生变化',
});
```

订单变更推送：

```typescript
this.adminSocketService.emitOrderUpdated({
  orderId,
  title: '订单更新',
  message: '订单已支付',
  level: 'info',
});
```

连接池变化会由服务端自动广播 `pond:update`，后台连接池页面监听后刷新列表。

后端监听前端自定义事件示例：

```typescript
@SubscribeMessage('task:read')
handleTaskRead(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() payload: { taskId: string },
) {
  return {
    taskId: payload.taskId,
    userId: client.data.userInfo._id,
    read: true,
  };
}
```

后端主动 emit 自定义事件示例：

```typescript
this.adminSocketService.emitNotifyToUser(userId, {
  event: 'task:updated',
  taskId,
  title: '任务提醒',
  message: '你负责的任务有新进展',
});
```

### 前端 emit、on

后台前端优先使用全局单例：

```typescript
import {
  SOCKET_EVENTS,
  useAdminSocket,
} from '@/composables/useSocket';

const adminSocket = useAdminSocket();
```

发送心跳：

```typescript
const pong = await adminSocket.ping();
```

加入业务房间：

```typescript
await adminSocket.joinRoom({
  bizType: 'order',
  bizId: orderId,
});
```

退出业务房间：

```typescript
await adminSocket.leaveRoom({
  bizType: 'order',
  bizId: orderId,
});
```

监听后台通知：

```typescript
const stopNotifyListener = adminSocket.on(SOCKET_EVENTS.notify, payload => {
  console.log('收到后台通知', payload);
});

onBeforeUnmount(() => {
  stopNotifyListener();
});
```

监听订单更新：

```typescript
const stopOrderListener = adminSocket.on(SOCKET_EVENTS.orderUpdated, payload => {
  console.log('订单更新', payload);
});
```

自定义事件也可以直接使用 `emitWithAck`：

```typescript
const result = await adminSocket.emitWithAck('room:join', {
  bizType: 'custom',
  bizId: 'group-id',
});
```

前端 emit 自定义事件并等待后端返回：

```typescript
const result = await adminSocket.emitWithAck('task:read', {
  taskId,
});
```

前端监听自定义通知：

```typescript
const stopTaskListener = adminSocket.on('task:updated', payload => {
  console.log('任务更新', payload);
});

onBeforeUnmount(() => {
  stopTaskListener();
});
```

## client-socket

`client-socket` 面向客户端，适合用户通知、聊天消息、购物车同步等前台实时场景。

### 主题注册

客户端命名空间定义在 `SOCKET_NAMESPACES.client`：

```typescript
export const SOCKET_NAMESPACES = {
  admin: '/admin',
  client: '/client',
} as const;
```

客户端可用事件包括：

| 事件 | 方向 | 说明 |
|------|------|------|
| `ping` | 前端 -> 后端 | 心跳检测 |
| `pong` | 后端 -> 前端 | 心跳响应 |
| `room:join` | 前端 -> 后端 | 加入业务房间 |
| `room:leave` | 前端 -> 后端 | 退出业务房间 |
| `chat:send` | 前端 -> 后端 | 发送聊天消息 |
| `chat:message` | 后端 -> 前端 | 广播聊天消息 |
| `cart:sync` | 双向 | 前端发送购物车同步，后端转发给房间内其他连接 |
| `notify` | 后端 -> 前端 | 用户通知 |

客户端连接成功后同样会自动加入用户房间：

```typescript
authClient.join(buildUserRoom(authClient.data.userInfo._id));
```

业务房间仍使用统一规则：

```typescript
buildBizRoom(bizType, bizId); // biz:{bizType}:{bizId}
```

发送聊天或同步购物车前，前端需要先加入对应业务房间，否则后端会返回 `请先加入业务房间`。

新增客户端主题示例：

```typescript
export const SOCKET_EVENTS = {
  // ... existing events
  liveLike: 'live:like',
  liveLikeUpdated: 'live:like:updated',
} as const;
```

直播间这类业务可以使用统一业务房间：

```typescript
await clientSocket.joinRoom({
  bizType: 'live',
  bizId: liveRoomId,
});
```

### 后端 emit、on

Gateway 监听客户端发来的事件：

```typescript
@SubscribeMessage(SOCKET_EVENTS.chatSend)
handleChatMessage(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() payload: ClientChatPayload,
) {
  const room = buildBizRoom(payload.bizType, payload.bizId);
  this.clientSocketService.emitChatMessage(client, payload);
  return { room, sent: true };
}
```

购物车同步：

```typescript
@SubscribeMessage(SOCKET_EVENTS.cartSync)
handleCartSync(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() payload: ClientCartSyncPayload,
) {
  const room = buildBizRoom(payload.bizType, payload.bizId);
  this.clientSocketService.syncCart(client, payload);
  return { room, synced: true };
}
```

业务模块主动给客户端用户推送通知时，注入 `ClientSocketService`：

```typescript
constructor(
  private readonly clientSocketService: ClientSocketService,
) {}
```

按用户推送：

```typescript
this.clientSocketService.emitNotifyToUser(userId, {
  title: '消息提醒',
  message: '你有一条新的客户端通知',
});
```

聊天消息由 `emitChatMessage` 推送到业务房间：

```typescript
this.namespace.to(room).emit(SOCKET_EVENTS.chatMessage, {
  bizType: payload.bizType,
  bizId: payload.bizId,
  message: payload.message,
  sender: sender.data.userInfo,
  ts: Date.now(),
});
```

购物车同步使用 `sender.to(room).emit`，不会再发给发送者自己：

```typescript
sender.to(room).emit(SOCKET_EVENTS.cartSync, {
  bizType: payload.bizType,
  bizId: payload.bizId,
  cart: payload.cart,
  sender: sender.data.userInfo,
  ts: Date.now(),
});
```

后端监听客户端自定义事件示例：

```typescript
@SubscribeMessage('live:like')
handleLiveLike(
  @ConnectedSocket() client: AuthenticatedSocket,
  @MessageBody() payload: { bizType: string; bizId: string },
) {
  const room = buildBizRoom(payload.bizType, payload.bizId);

  this.server.to(room).emit('live:like:updated', {
    bizType: payload.bizType,
    bizId: payload.bizId,
    user: client.data.userInfo,
    ts: Date.now(),
  });

  return {
    room,
    liked: true,
  };
}
```

后端主动给客户端用户 emit 示例：

```typescript
this.clientSocketService.emitNotifyToUser(userId, {
  title: '优惠提醒',
  message: '你关注的商品降价了',
  goodsId,
});
```

### 前端 emit、on

客户端连接使用通用 `useSocket`，命名空间传 `client`：

```typescript
import {
  SOCKET_EVENTS,
  useSocket,
} from '@/composables/useSocket';

const clientSocket = useSocket({
  namespace: 'client',
});
```

加入业务房间：

```typescript
await clientSocket.joinRoom({
  bizType: 'chat',
  bizId: roomId,
});
```

发送聊天消息：

```typescript
await clientSocket.sendChat({
  bizType: 'chat',
  bizId: roomId,
  message: '你好',
});
```

监听聊天广播：

```typescript
const stopChatListener = clientSocket.on(SOCKET_EVENTS.chatMessage, payload => {
  console.log('收到聊天消息', payload);
});
```

同步购物车：

```typescript
await clientSocket.syncCart({
  bizType: 'cart',
  bizId: cartId,
  cart: {
    goodsId: '10001',
    count: 2,
  },
});
```

监听其他端同步过来的购物车变化：

```typescript
const stopCartListener = clientSocket.on(SOCKET_EVENTS.cartSync, payload => {
  console.log('购物车同步', payload);
});
```

监听客户端通知：

```typescript
const stopNotifyListener = clientSocket.on(SOCKET_EVENTS.notify, payload => {
  console.log('收到客户端通知', payload);
});
```

前端 emit 自定义点赞事件：

```typescript
const result = await clientSocket.emitWithAck('live:like', {
  bizType: 'live',
  bizId: liveRoomId,
});
```

前端监听点赞广播：

```typescript
const stopLikeListener = clientSocket.on('live:like:updated', payload => {
  console.log('点赞变化', payload);
});
```

组件销毁时取消监听：

```typescript
onBeforeUnmount(() => {
  stopChatListener();
  stopCartListener();
  stopNotifyListener();
  stopLikeListener();
});
```

## 鉴权与连接地址

前端默认从环境变量读取 Socket 服务地址：

```typescript
VITE_SOCKET_BASE_URL=http://localhost:3000
```

如果没有配置 `VITE_SOCKET_BASE_URL`，会根据 `VITE_AXIOS_BASE_URL` 推导；仍无法推导时使用当前页面域名。

连接时前端会自动把登录 token 写入握手参数：

```typescript
io(namespaceUrl.value, {
  auth: {
    token: `Bearer ${authStore.token}`,
  },
});
```

后端鉴权顺序：

1. 优先读取 `client.handshake.auth.token`。
2. 其次读取配置中的认证请求头。
3. 校验 JWT，并确认 token 仍存在于用户记录中。
4. 过滤 `password`、`token` 后把用户信息写入 `socket.data.userInfo`。

## 常用约定

- 用户单播房间：`user:{userId}`。
- 业务分组房间：`biz:{bizType}:{bizId}`。
- 需要前端主动发送并等待结果的事件，使用 `emitWithAck`。
- 需要持续监听服务端推送的事件，使用 `on`，并在组件卸载时调用返回的停止函数。
- 后端主动推送后台消息使用 `AdminSocketService`。
- 后端主动推送客户端消息使用 `ClientSocketService`。

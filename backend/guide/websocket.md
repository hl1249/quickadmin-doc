
# WebSocket

项目基于 `@nestjs/websockets` 和 `socket.io` 封装了两套实时通信通道：

- `admin-socket`：后台管理端连接，命名空间为 `/admin`。
- `client-socket`：客户端连接，命名空间为 `/client`。

连接时需要携带登录 token。前端会通过 `auth.token` 传入 `Bearer token`，后端在握手阶段完成鉴权，并把用户信息挂载到 `socket.data.userInfo`。

## admin-socket

`admin-socket` 面向后台管理端，适合系统通知、订单变更、连接池刷新等后台实时消息。


#### 命名空间

后台命名空间定义在 `src/websocket/constants/socket.constants.ts`。

```typescript
export const SOCKET_NAMESPACES = {
  admin: '/admin',
  client: '/client',
} as const;
```

#### 事件主题

事件主题统一注册在 `src/websocket/constants/socket.constants.ts`。

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

#### 首次连接

连接处理流程：

1. 调用 `this.wsAuthService.authenticate(client, 'admin')` 校验前端携带的 token。
2. 鉴权成功后调用 `authClient.join(buildUserRoom(...))` 加入 `user:{userId}` 房间。
3. 调用 `this.adminSocketService.registerConnection(authClient)` 写入后台连接池，并触发 `pond:update`。
4. 调用 `this.logger.log(...)` 记录连接成功日志。
5. 鉴权失败时触发 `exception` 事件，把失败原因返回给前端。
6. 调用 `client.disconnect()` 主动断开未通过鉴权的连接。

```typescript
async handleConnection(client: Socket) {
  try {
    const authClient = await this.wsAuthService.authenticate(client, 'admin');

    authClient.join(buildUserRoom(authClient.data.userInfo._id));
    this.adminSocketService.registerConnection(authClient);
    this.logger.log(`admin socket connected: ${authClient.id}`);
  } catch (error: any) {
    client.emit('exception', {
      message: error?.message || '连接鉴权失败',
    });
    client.disconnect();
  }
}
```

#### 后端推送给前端

##### 指定用户单播消息

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



##### 主动断开在线连接

```typescript
@Post('/disconnect')
disconnect(@Body() data: { socketId: string }) {
  return this.adminSocketService.disconnectConnection(data.socketId);
}
```

##### 广播所有在线用户

```typescript
this.adminSocketService.emitNotify({
  title: '系统通知',
  message: '后台广播消息',
});
```

#####  `emitOrderUpdated`：广播订单更新，并同时推送到 `biz:order:{orderId}` 房间。

```typescript
this.adminSocketService.emitOrderUpdated({
  orderId,
  title: '订单更新',
  message: '订单已支付',
  level: 'info',
});
```

#####  `emitOrderUpdatedToUser`：只给指定后台用户推送订单更新。

```typescript
this.adminSocketService.emitOrderUpdatedToUser(userId, {
  orderId,
  title: '订单更新',
  message: '订单状态已变更',
  level: 'warning',
});
```

`emitNotifyToUser`：只给指定后台用户推送通知。

```typescript
this.adminSocketService.emitNotifyToUser(userId, {
  title: '待办提醒',
  message: '你有一条新的审批任务',
  taskId,
});
```

`emitNotifyToBizRoom`：向指定业务房间推送通知。

```typescript
this.adminSocketService.emitNotifyToBizRoom('task', taskId, {
  title: '任务更新',
  message: '任务状态已变更',
});
```

示例：后台订单定向推送。

```typescript
this.adminSocketService.emitOrderUpdatedToUser(userId, {
  orderId,
  title: '订单更新',
  message: '订单状态已变更',
  level: 'info',
});
```

示例：客户端用户单播。

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

#### 业务房间

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

#### 新增主题示例

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

#### 后端 on：监听前端事件

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

示例：加入业务房间。

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

#### 后端 emit：主动推送消息

业务模块需要主动推送后台消息时，注入 `AdminSocketService`：

```typescript
constructor(
  private readonly adminSocketService: AdminSocketService,
) {}
```

`AdminSocketService` 方法列表，源码位置：`src/websocket/services/admin-socket.service.ts`。

```typescript
// 注册后台命名空间，Gateway 初始化时调用
registerNamespace(namespace: Namespace)

// 注册后台连接，连接成功时写入连接池
registerConnection(client: AuthenticatedSocket)

// 移除后台连接，连接断开时从连接池删除
unregisterConnection(socketId: string)

// 获取后台连接池列表
getConnectionList(query?: AdminSocketConnectionQuery)

// 主动断开指定后台 Socket 连接
disconnectConnection(socketId: string)

// 广播连接池变化事件 pond:update
emitPondUpdate(extra?: Record<string, any>)

// 向后台所有在线连接广播 notify
emitNotify(payload: Record<string, any>)

// 广播订单更新，推给全局和订单业务房间
emitOrderUpdated(payload: AdminOrderUpdatePayload)

// 向指定后台用户推送订单更新
emitOrderUpdatedToUser(userId: string, payload: AdminOrderUpdatePayload)

// 向指定后台用户推送 notify
emitNotifyToUser(userId: string, payload: Record<string, any>)

// 向指定业务房间推送 notify
emitNotifyToBizRoom(bizType: string, bizId: string, payload: Record<string, any>)
```

内部辅助方法：

```typescript
toConnectionItem(record: AdminSocketConnectionRecord)
getSocketRooms(socket: Socket)
formatDateTime(timestamp: number)
formatDuration(durationMs: number)
```

示例：全量广播通知。

```typescript
this.adminSocketService.emitNotify({
  title: '系统通知',
  message: '后台广播消息',
});
```

示例：按用户推送。

```typescript
this.adminSocketService.emitNotifyToUser(userId, {
  title: '系统通知',
  message: '只推给指定后台用户',
});
```

示例：按业务房间推送。

```typescript
this.adminSocketService.emitNotifyToBizRoom('order', orderId, {
  title: '订单通知',
  message: '订单状态发生变化',
});
```

示例：订单变更推送。

```typescript
this.adminSocketService.emitOrderUpdated({
  orderId,
  title: '订单更新',
  message: '订单已支付',
  level: 'info',
});
```

连接池变化会由服务端自动广播 `pond:update`，后台连接池页面监听后刷新列表。

#### 自定义事件示例

示例：后端监听前端自定义事件。

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

示例：后端主动 emit 自定义事件。

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

# WebSocket 模块

基于 Socket.IO 实现实时通信，用于管理后台的实时数据推送。

## 使用

```typescript
// 发送消息到指定 socket
socket.emit('eventName', data);

// 广播给所有连接
io.emit('eventName', data);

// 广播给指定房间
io.to('roomId').emit('eventName', data);
```

## 连接池管理

`src/app/admin/system/sysSocketPool/` 管理所有 WebSocket 连接：

- 连接/断开事件监听
- 在线用户列表
- 连接统计

## 应用场景

- 实时日志推送
- 系统通知
- 数据看板刷新
- 在线用户监控

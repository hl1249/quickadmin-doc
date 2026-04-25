# 缓存模块

支持 **内存缓存** 和 **Redis 缓存** 两种模式，通过环境变量 `CACHE_TYPE` 切换。

## 配置

```bash
# .env
CACHE_TYPE=memory     # memory | redis
CACHE_TTL=604800      # 默认过期时间（秒）
REDIS_HOST=127.0.0.1  # Redis 地址
REDIS_PORT=6379       # Redis 端口
REDIS_PASSWORD=       # Redis 密码
```

## 使用

```typescript
// 注入 CacheManager
constructor(private cacheManager: CacheManager) {}

// 获取缓存
const value = await this.cacheManager.get('key');

// 设置缓存
await this.cacheManager.set('key', value, ttl);

// 删除缓存
await this.cacheManager.del('key');

// 清空所有缓存
await this.cacheManager.reset();
```

## 缓存存储

位于 `src/common/cache/stores/`：

| 文件 | 说明 |
|------|------|
| `memory-cache.store.ts` | 基于 `cache-manager` 的内存存储 |
| `redis-cache.store.ts` | 基于 ioredis 的 Redis 存储 |

# 对象存储模块

支持多种云存储服务，通过适配器模式统一调用接口。

## 支持的存储服务

| 服务 | SDK | 说明 |
|------|-----|------|
| 阿里云 OSS | ali-oss | 阿里云对象存储 |
| 腾讯云 COS | cos-nodejs-sdk-v5 | 腾讯云对象存储 |
| 七牛云 Kodo | qiniu | 七牛云对象存储 |
| 本地存储 | fs | 上传到 `uploads/` 目录 |

## 使用

```typescript
// 注入 OSS 服务
constructor(private readonly ossService: OssService) {}

// 上传文件
const url = await this.ossService.upload(file, 'path/to/file');

// 删除文件
await this.ossService.delete('path/to/file');

// 获取文件访问 URL
const url = await this.ossService.getUrl('path/to/file');
```

## 存储提供者

位于 `src/common/oss/providers/`：

| 文件 | 说明 |
|------|------|
| `aliyun-oss.provider.ts` | 阿里云 OSS 实现 |
| `tencent-cos.provider.ts` | 腾讯云 COS 实现 |
| `qiniu-oss.provider.ts` | 七牛云实现 |
| `local-oss.provider.ts` | 本地文件存储 |

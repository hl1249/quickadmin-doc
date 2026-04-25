# 部署

## 生产构建

```bash
# 构建
npm run build:prod

# 启动生产服务
node dist/main
```

## 使用 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 启动
pm2 start dist/main.js --name quick-admin

# 查看状态
pm2 status

# 查看日志
pm2 logs quick-admin

# 重启
pm2 restart quick-admin
```

## Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 支持
    location /socket.io/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

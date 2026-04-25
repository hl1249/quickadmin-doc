# DbService 使用指南

`DbService` 是框架的核心数据库封装类，注入即用，无需操作 MongoDB 原生驱动。

## 注入

```typescript
import { DbService } from '@/common/db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}
}
```

## 新增

### 新增单条

```typescript
const result = await this.db.add({
  dbName: 'user',
  dataJson: {
    name: '张三',
    age: 25,
    role: 'admin',
    status: 1,
  },
});
// result.insertedId 为新文档 _id
```

自动附加 `_add_time`（时间戳）和 `_add_time_str`（格式化字符串）字段。

### 批量新增

```typescript
const result = await this.db.adds({
  dbName: 'product',
  dataJson: [
    { name: '苹果手机', price: 5999, stock: 100 },
    { name: '华为平板', price: 3299, stock: 50 },
  ],
});
```

## 删除

### 按 ID 删除

```typescript
const result = await this.db.deleteById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
});
```

### 按条件删除

```typescript
const result = await this.db.del({
  dbName: 'user',
  whereJson: { status: 0 },
});
```

## 修改

### 按 ID 更新

```typescript
const result = await this.db.updateById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: { '$set': { name: '李四', age: 30 } },
});
```

### 按条件批量更新

```typescript
const result = await this.db.update({
  dbName: 'product',
  whereJson: { stock: 0 },
  dataJson: { '$set': { status: 2 } },
});
```

### 更新并返回

```typescript
const doc = await this.db.updateAndReturn({
  dbName: 'user',
  whereJson: { _id: ObjectId(id) },
  dataJson: { '$set': { lastLoginTime: Date.now() } },
});
```

## 查询

### 分页查询

```typescript
const result = await this.db.select({
  dbName: 'user',
  whereJson: { status: 1 },
  pageIndex: 1,
  pageSize: 10,
  getCount: true,
  sortArr: [{ name: '_add_time', type: 'desc' }],
  fieldJson: { password: 0 }, // 排除密码字段
});
// result.rows    → 当前页数据
// result.total   → 总记录数
// result.hasMore → 是否有下一页
```

### 联表查询（聚合）

```typescript
const result = await this.db.selects({
  dbName: 'order',
  whereJson: { userId },
  foreignDB: [
    {
      '$lookup': {
        from: 'product',
        localField: 'productId',
        foreignField: '_id',
        as: 'productInfo',
      },
    },
    { '$unwind': { path: 'productInfo', preserveNullAndEmptyArrays: true } },
  ],
  pageIndex: 1,
  pageSize: 10,
  getCount: true,
});
```

### 列表查询（自动带总数）

```typescript
const result = await this.db.getTableData({
  dbName: 'user',
  whereJson: { status: { '$ne': -1 } },
  pageIndex: 1,
  pageSize: 15,
  sortArr: [{ name: '_add_time', type: 'desc' }],
});
```

### 单条查询

```typescript
// 按 ID
const user = await this.db.findById({ dbName: 'user', id });

// 按条件
const user = await this.db.findByWhereJson({
  dbName: 'user',
  whereJson: { username: 'admin' },
});
```

## 统计与聚合

| 方法 | 说明 | 示例 |
|------|------|------|
| `count()` | 统计数量 | `{ dbName: 'user', whereJson: { status: 1 } }` |
| `sum()` | 字段求和 | `{ dbName: 'order', fieldName: 'amount' }` |
| `max()` | 字段最大值 | `{ dbName: 'product', fieldName: 'price' }` |
| `min()` | 字段最小值 | `{ dbName: 'product', fieldName: 'price' }` |
| `avg()` | 字段平均值 | `{ dbName: 'order', fieldName: 'amount' }` |
| `sample()` | 随机抽样 | `{ dbName: 'product', size: 5 }` |

## API 一览

| 方法 | 说明 |
|------|------|
| `add()` | 新增单条文档 |
| `adds()` | 批量新增文档 |
| `del()` | 按条件批量删除 |
| `deleteById()` | 按 `_id` 删除 |
| `update()` | 按条件批量更新 |
| `updateById()` | 按 `_id` 更新 |
| `updateAndReturn()` | 更新并返回更新后文档 |
| `setById()` | 按 `_id` 更新（不存在则插入） |
| `select()` | 普通分页查询 |
| `selects()` | 聚合分页查询（支持联表） |
| `getTableData()` | 列表查询（默认携带总数） |
| `findById()` | 按 `_id` 查询单条 |
| `findByWhereJson()` | 按条件查询单条 |
| `count()` | 统计数量 |
| `sum()` | 字段求和 |
| `max()` | 字段最大值 |
| `min()` | 字段最小值 |
| `avg()` | 字段平均值 |
| `sample()` | 随机抽样 |

---
outline: deep
---

# DbService 使用指南

`DbService` 是框架的核心数据库封装类，注入即用，无需直接操作 MongoDB 原生驱动。

## 注入

```typescript
import { Injectable } from '@nestjs/common';
import { DbService } from '@/common/db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DbService) {}
}
```

如果需要使用条件工具函数，额外引入 `_`：

```typescript
import { _ } from '@/common/db/field-query';
```

## 增

### add(单条记录增加)

新增单条文档。

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

默认会自动附加 `_add_time` 和 `_add_time_str` 字段。需要关闭时传入 `cancelAddTime` 或 `cancelAddTimeStr`。

```typescript
await this.db.add({
  dbName: 'user',
  dataJson: { name: '张三' },
  cancelAddTime: true,
});
```

### adds(批量增加)

批量新增文档。

```typescript
const result = await this.db.adds({
  dbName: 'product',
  dataJson: [
    { name: '苹果手机', price: 5999, stock: 100 },
    { name: '华为平板', price: 3299, stock: 50 },
  ],
});

// result.insertedIds 为批量插入后的 _id 列表
```

## 删

### del(条件删除)

按条件批量删除。`whereJson` 不能为空，避免误删整表。

```typescript
const result = await this.db.del({
  dbName: 'user',
  whereJson: {
    status: 0,
  },
});

// result.deletedCount 为删除数量
```

### deleteById(按ID删除)

按 `_id` 删除。源码方法名是 `deleteById()`，不是 `delById()`。

```typescript
const result = await this.db.deleteById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
});
```

## 改

### update(条件更新)

按条件批量更新。

```typescript
const result = await this.db.update({
  dbName: 'product',
  whereJson: {
    stock: 0,
  },
  dataJson: {
    status: 2,
  },
});

// dataJson 会自动转换为 MongoDB 的 $set
```

### updateById(按ID更新)

按 `_id` 更新。

```typescript
const result = await this.db.updateById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: {
    name: '李四',
    age: 30,
  },
});
```

### updateAndReturn(更新并返回)

更新后返回最新文档。

```typescript
const user = await this.db.updateAndReturn({
  dbName: 'user',
  whereJson: {
    username: 'admin',
  },
  dataJson: {
    lastLoginTime: Date.now(),
  },
});
```

### setById(按ID更新或新增)

按 `_id` 更新，找不到时插入新文档。

```typescript
const result = await this.db.setById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: {
    name: '新用户',
    status: 1,
  },
});
```

## 查

### findById(按ID查询)

按 `_id` 查询单条文档。

```typescript
const user = await this.db.findById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  fieldJson: {
    password: false,
  },
});
```

### findByWhereJson(条件查询单条)

按条件查询单条文档。

```typescript
const user = await this.db.findByWhereJson({
  dbName: 'user',
  whereJson: {
    username: 'admin',
  },
  fieldJson: {
    password: false,
  },
});
```

### select(分页查询)

普通分页查询。

```typescript
const result = await this.db.select({
  dbName: 'user',
  whereJson: {
    status: 1,
  },
  pageIndex: 1,
  pageSize: 10,
  getCount: true,
  sortArr: [{ name: '_add_time', type: 'desc' }],
  fieldJson: {
    password: false,
  },
});

// result.rows    当前页数据
// result.total   总记录数
// result.hasMore 是否有下一页
```

### selects(聚合分页查询)

聚合分页查询，支持关联表、分组、追加字段、二次过滤等能力。

```typescript
const result = await this.db.selects({
  dbName: 'order',
  whereJson: {
    status: 1,
  },
  foreignDB: [
    {
      dbName: 'user',
      localKey: 'userId',
      foreignKey: '_id',
      as: 'userInfo',
      limit: 1,
      fieldJson: {
        password: false,
      },
    },
  ],
  pageIndex: 1,
  pageSize: 10,
  getCount: true,
});
```

### getTableData(表格查询)

列表查询，默认携带总数，适合表格页面直接传入 `data`、`columns`、`sortRule`。

```typescript
const result = await this.db.getTableData({
  dbName: 'user',
  data: {
    pageIndex: 1,
    pageSize: 15,
    formData: {
      name: '张',
    },
    columns: [
      { key: 'name', title: '昵称', mode: '%%' },
    ],
    sortRule: [{ name: '_add_time', type: 'desc' }],
  },
});
```

### count(统计数量)

统计数量。

```typescript
const total = await this.db.count({
  dbName: 'user',
  whereJson: {
    status: 1,
  },
});
```

### sum(字段求和)

字段求和。

```typescript
const amount = await this.db.sum({
  dbName: 'order',
  whereJson: {
    status: 1,
  },
  fieldName: 'amount',
});
```

### max(字段最大值)

查询字段最大值。

```typescript
const maxPrice = await this.db.max({
  dbName: 'product',
  fieldName: 'price',
});
```

### min(字段最小值)

查询字段最小值。

```typescript
const minPrice = await this.db.min({
  dbName: 'product',
  fieldName: 'price',
});
```

### avg(字段平均值)

查询字段平均值。

```typescript
const avgAmount = await this.db.avg({
  dbName: 'order',
  whereJson: {
    status: 1,
  },
  fieldName: 'amount',
});
```

### sample(随机抽样)

随机抽样。

```typescript
const products = await this.db.sample({
  dbName: 'product',
  whereJson: {
    status: 1,
  },
  size: 5,
});
```

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
| `setById()` | 按 `_id` 更新，找不到时插入 |
| `findById()` | 按 `_id` 查询单条 |
| `findByWhereJson()` | 按条件查询单条 |
| `select()` | 普通分页查询 |
| `selects()` | 聚合分页查询，支持关联 |
| `getTableData()` | 表格列表查询，默认带总数 |
| `count()` | 统计数量 |
| `sum()` | 字段求和 |
| `max()` | 字段最大值 |
| `min()` | 字段最小值 |
| `avg()` | 字段平均值 |
| `sample()` | 随机抽样 |

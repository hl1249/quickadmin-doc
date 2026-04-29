---
outline: deep
---

# 工具函数的使用

`_` 是后端数据库查询和更新的工具函数，来自 `@/common/db/field-query`。它用来生成常用 MongoDB 操作符，写法比直接写 `$gt`、`$in`、`$unset` 更统一。

```typescript
import { _ } from '@/common/db/field-query';
```

## 比较条件

在 `whereJson` 中使用 `_` 可以生成比较条件。

```typescript
const result = await this.db.select({
  dbName: 'user',
  whereJson: {
    age: _.gte(18),
    status: _.eq(1),
  },
});
```

### _.eq(等于)

等于，转换为 MongoDB 的 `$eq`。

```typescript
whereJson: {
  status: _.eq(1),
}
```

### _.neq(不等于)

不等于，转换为 MongoDB 的 `$ne`。

```typescript
whereJson: {
  status: _.neq(0),
}
```

### _.gt(大于)

大于，转换为 MongoDB 的 `$gt`。

```typescript
whereJson: {
  age: _.gt(18),
}
```

### _.gte(大于等于)

大于等于，转换为 MongoDB 的 `$gte`。

```typescript
whereJson: {
  age: _.gte(18),
}
```

### _.lt(小于)

小于，转换为 MongoDB 的 `$lt`。

```typescript
whereJson: {
  age: _.lt(60),
}
```

### _.lte(小于等于)

小于等于，转换为 MongoDB 的 `$lte`。

```typescript
whereJson: {
  age: _.lte(60),
}
```

### _.in(包含于)

匹配数组中的任意值，转换为 MongoDB 的 `$in`。

```typescript
whereJson: {
  role: _.in(['admin', 'editor']),
}
```

### _.nin(不包含于)

排除数组中的值，转换为 MongoDB 的 `$nin`。

```typescript
whereJson: {
  role: _.nin(['guest']),
}
```

### _.exists(字段存在)

判断字段是否存在，转换为 MongoDB 的 `$exists`。

```typescript
whereJson: {
  phone: _.exists(true),
}
```

## 组合条件

### _.and(并且)

`_.and()` 用于同一个字段的多个条件合并。比如 `num >= 0 and num <= 10`，可以用下面三种写法。

流式简写法：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.gte(0).lte(10),
  },
});
```

流式完整写法：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.gte(0).and(_.lte(10)),
  },
});
```

前置写法：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.and(_.gte(0), _.lte(10)),
  },
});
```

### _.or(或者)

`_.or()` 用于同一个字段的多个条件分支。比如 `num <= 0 or num >= 10`，可以用前置写法或流式写法。

前置写法：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.or(_.lte(0), _.gte(10)),
  },
});
```

流式写法：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.lte(0).or(_.gte(10)),
  },
});
```

### _.and(并且) + _.or(或者)

`_.and()` 和 `_.or()` 可以组合使用。比如 `num <= 0 or (num > 10 and num < 20)`：

```typescript
const result = await this.db.select({
  dbName: 'demo',
  whereJson: {
    num: _.lte(0).or(_.gt(10).and(_.lt(20))),
  },
});
```

## 更新字段

`dataJson` 中普通字段会自动转成 `$set`，特殊更新可以使用 `_.remove()` 和 `_.push()`。

### _.remove()

删除指定字段，转换为 MongoDB 的 `$unset`。

```typescript
await this.db.updateById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: {
    oldField: _.remove(),
  },
});
```

上面的 `dataJson` 会转换为类似结构：

```typescript
{
  $unset: { oldField: '' },
}
```

### _.push()

向数组字段追加数据，转换为 MongoDB 的 `$push`。

```typescript
await this.db.updateById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: {
    tags: _.push('vip'),
  },
});
```

上面的 `dataJson` 会转换为类似结构：

```typescript
{
  $push: { tags: 'vip' },
}
```

### 混合更新

普通字段会自动转成 `$set`，可以和 `_.remove()`、`_.push()` 一起使用。

```typescript
await this.db.updateById({
  dbName: 'user',
  id: '665f1a2b3c4d5e6f7a8b9c0d',
  dataJson: {
    nickname: '新昵称',
    oldField: _.remove(),
    tags: _.push('vip'),
  },
});
```

上面的 `dataJson` 会转换为类似结构：

```typescript
{
  $set: { nickname: '新昵称' },
  $unset: { oldField: '' },
  $push: { tags: 'vip' },
}
```

## 表达式条件

需要比较两个字段时，可以使用 `_.expr()`。

```typescript
const result = await this.db.select({
  dbName: 'user',
  whereJson: {
    age: _.expr({
      $eq: ['$age', '$targetAge'],
    }),
  },
});
```

## 常见写法

查询 `_id` 集合时可以直接使用字符串数组，框架会把合法的 `_id` 字符串转换成 `ObjectId`。

```typescript
const users = await this.db.select({
  dbName: 'user',
  whereJson: {
    _id: _.in([
      '665f1a2b3c4d5e6f7a8b9c0d',
      '665f1a2b3c4d5e6f7a8b9c0e',
    ]),
  },
});
```

判断字段存在：

```typescript
const users = await this.db.select({
  dbName: 'user',
  whereJson: {
    phone: _.exists(true),
  },
});
```

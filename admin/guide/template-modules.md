# QA 组件使用

后台通过 **QA 组件**（如 `qa-table`、`qa-form`）支持**可视化配置**，用于快速搭建列表页与表单页。

## qa-table

`qa-table` 用于快速构建管理后台列表页，支持查询、分页、选择、行操作、详情展开等能力。

### props 配置属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `action` | 后端接口标识（用于获取表格数据） | `string` | `-` |
| `columns` | 列配置（核心） | `Columns[]` | `[]` |
| `queryFormParam` | 查询附加参数 | `Record<string, any>` | `{}` |
| `rightBtns` | 行内右侧操作按钮 | `RightBtn[]` | `[]` |
| `rightBtnsMore` | 行内更多操作菜单 | `RightBtnMoreItem[]` | `[]` |
| `customRightBtns` | 自定义右侧操作渲染 | `CustomRightBtn[]` | `[]` |
| `rowNo` | 是否显示序号列 | `boolean` | `false` |
| `rowKey` | 行唯一键 | `string` | `_id` |
| `selection` | 是否开启选择 | `boolean` | `false` |
| `multiple` | 是否多选 | `boolean` | `true` |
| `selectionData` | 默认选中项（回显） | `TableRow[] \| TableRow \| id[] \| id \| null` | `null` |
| `renderNode` | 渲染位置（行内/详情） | `'row' \| 'detail'` | `'row'` |
| `height` | 表格高度 | `string \| number` | `'100%'` |
| `border` | 是否显示边框 | `boolean` | `false` |
| `highlightCurrentRow` | 是否高亮当前行 | `boolean` | `false` |
| `size` | 尺寸 | `'' \| 'large' \| 'default' \| 'small'` | `''` |
| `selectable` | 多选可选函数 | `(row, index) => boolean` | `-` |
| `stripe` | 是否斑马纹 | `boolean` | `false` |

### type 有哪些类型

> 规范：每个 `type` 都包含两部分 —— **组件属性**、**使用方式**。

#### text(文本)(文本)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'text'`
- 可选：`width`、`minWidth`、`align`、`sortable`、`show`、`formatter`
- 说明：按普通文本展示字段值；配置 `formatter` 后可自定义展示内容。

**使用方式**

```ts
{ title: '用户名', key: 'username', type: 'text', minWidth: 140 }
```

#### json(JSON)(JSON)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'json'`
- 可选：`width`、`minWidth`、`show`
- 说明：将对象或数组通过 `JSON.stringify(value, null, 2)` 格式化展示。

**使用方式**

```ts
{ title: '配置', key: 'config', type: 'json', width: 220 }
```

#### image(图片)

**组件属性**

- 必填：`title`（列标题）、`key`（图片地址字段）、`type: 'image'`
- 可选：`imageWidth`、`width`、`minWidth`、`show`
- 说明：使用图片组件展示，支持预览；字段值一般为图片 URL。

**使用方式**

```ts
{ title: '封面', key: 'cover', type: 'image', imageWidth: 60 }
```

#### avatar(头像)

**组件属性**

- 必填：`title`（列标题）、`key`（头像地址字段）、`type: 'avatar'`
- 可选：`shape`（`'circle' | 'square'`）、`width`、`show`
- 说明：用于展示用户头像，字段值一般为头像 URL。

**使用方式**

```ts
{ title: '头像', key: 'avatar', type: 'avatar', shape: 'circle', width: 80 }
```

#### rate(评分)(评分)

**组件属性**

- 必填：`title`（列标题）、`key`（评分字段）、`type: 'rate'`
- 可选：`width`、`minWidth`、`show`
- 说明：以只读评分组件展示数值。

**使用方式**

```ts
{ title: '评分', key: 'score', type: 'rate', width: 180 }
```

#### switch(开关)(开关)

**组件属性**

- 必填：`title`（列标题）、`key`（状态字段）、`type: 'switch'`
- 可选：`activeValue`、`inactiveValue`、`watch`、`width`、`show`
- 说明：以开关形式展示布尔状态；可通过 `watch` 监听变更并回写。

**使用方式**

```ts
{ title: '允许登录', key: 'is_login', type: 'switch', activeValue: true, inactiveValue: false }
```

#### icon(图标选择)(图标)

**组件属性**

- 必填：`title`（列标题）、`key`（图标字段）、`type: 'icon'`
- 可选：`data`（图标映射，支持 `value`、`icon`）、`width`、`show`
- 说明：字段值可直接为 Element Plus 图标名，也可通过 `data` 映射为图标名。

**使用方式**

```ts
{ title: '图标', key: 'icon', type: 'icon', data: [{ value: 'add', icon: 'Plus' }] }
```

#### tag(标签)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'tag'`
- 必填/常用：`data`（映射字典，支持 `value`、`label`、`tagType`）
- 可选：`width`、`minWidth`、`show`
- 说明：根据字段值匹配 `data.value`，展示对应标签文本和标签类型。

**使用方式**

```ts
{ title: '状态', key: 'status', type: 'tag', data: [{ value: 1, label: '启用', tagType: 'success' }, { value: 0, label: '禁用', tagType: 'danger' }] }
```

#### time(时间)(时间)

**组件属性**

- 必填：`title`（列标题）、`key`（时间字段）、`type: 'time'`
- 可选：`valueFormat`（格式化规则）、`width`、`minWidth`、`show`
- 说明：将时间戳或时间值格式化展示。

**使用方式**

```ts
{ title: '创建时间', key: '_add_time', type: 'time', valueFormat: 'yyyy-MM-dd hh:mm:ss', minWidth: 170 }
```

#### money(金额)

**组件属性**

- 必填：`title`（列标题）、`key`（金额字段）、`type: 'money'`
- 可选：`width`、`minWidth`、`show`
- 说明：默认将数值按“分”转“元”展示，即 `value / 100` 并保留两位小数。

**使用方式**

```ts
{ title: '金额', key: 'amount', type: 'money', width: 120 }
```

#### percentage(百分比)

**组件属性**

- 必填：`title`（列标题）、`key`（比例字段）、`type: 'percentage'`
- 可选：`width`、`minWidth`、`show`
- 说明：默认将小数比例转为百分比展示，例如 `0.8` 展示为 `80%`。

**使用方式**

```ts
{ title: '完成度', key: 'progress', type: 'percentage', width: 120 }
```

#### address(地址)

**组件属性**

- 必填：`title`（列标题）、`key`（地址对象字段）、`type: 'address'`
- 可选：`width`、`minWidth`、`show`
- 说明：适用于地区对象，默认读取每一级的 `name` 并用 `/` 拼接。

**使用方式**

```ts
{ title: '地址', key: 'address', type: 'address', minWidth: 220 }
```

#### object(对象)

**组件属性**

- 必填：`title`（列标题）、`key`（对象字段）、`type: 'object'`
- 必填/常用：`columns`（对象内部字段配置）
- 可选：`width`、`minWidth`、`show`、`nameKey`、`idKey`
- 说明：适用于字段值为对象的场景，通过 `columns` 指定对象内字段展示。

**使用方式**

```ts
{ title: '部门', key: 'dept', type: 'object', columns: [{ title: '部门名称', key: 'name', type: 'text' }] }
```

#### userInfo(用户信息)

**组件属性**

- 必填：`title`（列标题）、`key`（用户对象字段）、`type: 'userInfo'`
- 可选：`width`、`minWidth`、`show`
- 说明：用于展示用户信息，默认读取对象中的 `avatar` 和 `nickname`。

**使用方式**

```ts
{ title: '用户信息', key: 'userInfo', type: 'userInfo', width: 200 }
```

#### html(HTML)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'html'`
- 常用：`formatter`（返回 HTML 字符串）
- 可选：`width`、`minWidth`、`show`
- 说明：当传入 `formatter` 时，通过 `v-html` 渲染返回内容。

**使用方式**

```ts
{ title: '详情', key: 'content', type: 'html', formatter: (value) => '<span>' + value + '</span>' }
```

#### table(表格)

**组件属性**

- 必填：`title`（列标题）、`key`（数组字段）、`type: 'table'`
- 常用：`columns`（子表列配置）
- 可选：`width`、`minWidth`、`show`
- 说明：适用于行内字段为数组表格数据的场景，通常配合详情或自定义渲染使用。

**使用方式**

```ts
{ title: '子表', key: 'items', type: 'table', columns: [{ title: '名称', key: 'name', type: 'text' }] }
```

#### group(分组)

**组件属性**

- 必填：`title`（分组标题）、`type: 'group'`、`columns`（分组下的字段配置）
- 可选：`width`、`minWidth`、`show`
- 说明：用于把多个列配置组合展示，`columns` 内可继续嵌套 `group`。

**使用方式**

```ts
{ title: '基础信息', type: 'group', columns: [{ title: '用户名', key: 'username', type: 'text' }] }
```

#### radio(单选)(单选)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'radio'`
- 必填/常用：`data`（映射选项，支持 `value`、`label`）
- 可选：`width`、`minWidth`、`show`
- 说明：表格中按 `data` 映射展示单选值对应的文本。

**使用方式**

```ts
{ title: '性别', key: 'gender', type: 'radio', data: [{ value: 1, label: '男' }, { value: 2, label: '女' }] }
```

#### select(下拉选择)(下拉选择)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'select'`
- 必填/常用：`data`（下拉映射选项，支持 `value`、`label`）
- 可选：`width`、`minWidth`、`show`
- 说明：表格中按 `data` 映射展示下拉选项文本。

**使用方式**

```ts
{ title: '类型', key: 'type', type: 'select', data: [{ value: 1, label: '类型A' }] }
```

#### checkbox(复选)(复选)

**组件属性**

- 必填：`title`（列标题）、`key`（字段名）、`type: 'checkbox'`
- 必填/常用：`data`（复选映射选项，支持 `value`、`label`）
- 可选：`width`、`minWidth`、`show`
- 说明：表格中按 `data` 映射展示复选值对应文本。

**使用方式**

```ts
{ title: '标签', key: 'tags', type: 'checkbox', data: [{ value: 'a', label: 'A' }] }
```

### 用法示例（@index.vue）

```ts
const columns = [
  {
    title: '用户ID',
    key: '_id',
    type: 'text',
    show: ['row']
  },
  {
    title: '头像',
    key: 'avatar',
    type: 'avatar',
    width: 70,
    show: ['row']
  },
  {
    title: '昵称',
    key: 'nickname',
    type: 'text',
    minWidth: 140,
    show: ['row', 'detail']
  },
  {
    title: '状态',
    key: 'status',
    type: 'tag',
    show: ['row', 'detail'],
    data: [
      { value: 1, label: '启用', tagType: 'success' },
      { value: 0, label: '禁用', tagType: 'danger' }
    ]
  },
  {
    title: '创建时间',
    key: '_add_time_str',
    type: 'time',
    minWidth: 170,
    show: ['row']
  }
]

const queryColumns = [
  { title: '昵称', key: 'nickname', type: 'text', show: ['query'] },
  {
    title: '状态',
    key: 'status',
    type: 'select',
    show: ['query'],
    data: [
      { value: '', label: '全部' },
      { value: 1, label: '启用' },
      { value: 0, label: '禁用' }
    ]
  }
]
```

```vue
<qa-table
  action="admin/user/page"
  :columns="columns"
  :query-columns="queryColumns"
  :query-form-param="{ status: 1 }"
  :row-no="true"
  row-key="_id"
  selection
  :multiple="true"
  border
  stripe
  @selection-change="onSelectionChange"
/>
```

---

## qa-form

> 注：你原消息写的是 `qa-from`，组件实际名称是 `qa-form`。

`qa-form` 用于快速构建新增/编辑/查询表单，支持动态字段配置、联动显示、校验和复杂组件。

### props 配置属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `formData` | 表单数据对象（双向绑定） | `Record<string, any>` | `{}` |
| `columns` | 表单项配置（核心） | `FormColumn[]` | `[]` |
| `formType` | 表单类型（新增/编辑/查询等） | `string` | `'add'` |
| `labelWidth` | 标签宽度 | `string \| number` | `100` |
| `inline` | 是否行内表单 | `boolean` | `false` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `rules` | 全局校验规则 | `FormRules` | `{}` |
| `showBtn` | 是否显示底部操作按钮 | `boolean` | `true` |
| `loading` | 提交中状态 | `boolean` | `false` |

### type 类型举例

> 规范：每个 `type` 都包含两部分 —— **组件属性**、**使用方式**。
> 说明：表单字段通常使用 `title` + `key`；如果你的项目版本使用 `label` + `itemKey`，含义分别等同于 `title` + `key`。
> 注释约定：以下示例统一在关键字段后添加行内注释（如 `// 字段名`、`// 组件类型`），用于快速理解含义；复制到项目中可按需删除注释。

### type 类型总览（带注释）

```ts
const formTypeExamples = [
  { title: '用户名', key: 'username', type: 'text' }, // 文本输入
  { title: '密码', key: 'password', type: 'password', show: ['add'] }, // 密码输入（仅新增显示）
  { title: '备注', key: 'remark', type: 'textarea', rows: 4 }, // 多行文本
  { title: '年龄', key: 'age', type: 'number', min: 0, max: 120 }, // 数字输入
  { title: '状态', key: 'status', type: 'radio', data: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }, // 单选
  { title: '标签', key: 'tags', type: 'checkbox', data: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }, // 复选
  { title: '类型', key: 'type', type: 'select', data: [{ label: '系统', value: 1 }] }, // 本地下拉
  { title: '部门', key: 'deptId', type: 'remote-select', action: 'admin/dept/list', nameKey: 'name', idKey: '_id' }, // 远程下拉
  { title: '生日', key: 'birthday', type: 'date', dateType: 'date', valueFormat: 'YYYY-MM-DD' }, // 日期
  { title: '时间范围', key: 'timeRange', type: 'datetimerange', valueFormat: 'x' }, // 日期时间范围
  { title: '提醒时间', key: 'noticeTime', type: 'time', valueFormat: 'HH:mm:ss' }, // 时间
  { title: '启用', key: 'enable', type: 'switch', activeValue: true, inactiveValue: false }, // 开关
  { title: '评分', key: 'score', type: 'rate', max: 5 }, // 评分
  { title: '进度', key: 'progress', type: 'slider', min: 0, max: 100, step: 1 }, // 滑块
  { title: '主题色', key: 'themeColor', type: 'color', showAlpha: true }, // 颜色
  { title: '内容', key: 'content', type: 'editor', height: 400 }, // 富文本
  { title: '配置JSON', key: 'configJson', type: 'json', width: 500 }, // JSON 编辑
  { title: '附件', key: 'files', type: 'file', multiple: true, limit: 5 }, // 文件上传
  { title: '头像', key: 'avatar', type: 'file-select', fileType: 'image' }, // 文件库选择
  { title: '菜单图标', key: 'icon', type: 'icon' }, // 图标选择
  { title: '分类', key: 'category', type: 'cascader', data: [{ label: '一级', value: 1, children: [] }] }, // 级联选择
  { title: '上级部门', key: 'parentId', type: 'tree-select', action: 'admin/dept/tree', nameKey: 'name', idKey: '_id' }, // 树选择
  { title: '角色', key: 'roleIds', type: 'table-select', action: 'admin/role/page', multiple: true }, // 表格选择
  { title: '地址', key: 'address', type: 'address' }, // 地址
  { title: '地区', key: 'area', type: 'area-cascader' }, // 地区级联
  { title: '关键词', key: 'keywords', type: 'tag' }, // 标签输入
  { title: '定位', key: 'location', type: 'map', height: 300 }, // 地图选点
  { title: '标签列表', key: 'tagList', type: 'array<string>' }, // 字符串数组
  { title: '分值列表', key: 'scoreList', type: 'array<number>', min: 0, step: 1 }, // 数字数组
  { title: '规格项', key: 'specs', type: 'array<object>', columns: [{ title: '规格名', key: 'name', type: 'text' }] } // 对象数组
]
```

#### text

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'text'`
- 可选：`placeholder`、`width`、`show`、`rules`、`disabled`、`clearable`
- 说明：普通单行文本输入框。

**使用方式**

```ts
{ title: '用户名', key: 'username', type: 'text', width: 250, placeholder: '请输入用户名' }
```

#### password(密码)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'password'`
- 可选：`placeholder`、`width`、`show`、`rules`、`disabled`
- 说明：密码输入框，适用于新增/修改密码等场景。

**使用方式**

```ts
{ title: '密码', key: 'password', type: 'password', show: ['add'], placeholder: '请输入密码' }
```

#### textarea(多行文本)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'textarea'`
- 可选：`placeholder`、`width`、`rows`、`maxlength`、`showWordLimit`、`rules`
- 说明：多行文本输入，适用于备注、描述等长文本。

**使用方式**

```ts
{ title: '备注', key: 'remark', type: 'textarea', rows: 4, placeholder: '请输入备注' }
```

#### number(数字)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'number'`
- 可选：`min`、`max`、`step`、`precision`、`placeholder`、`width`、`rules`
- 说明：数字输入框，字段值为数字。

**使用方式**

```ts
{ title: '年龄', key: 'age', type: 'number', min: 0, max: 120, width: 250 }
```

#### radio

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'radio'`
- 必填/常用：`data`（单选项，支持 `label`、`value`）
- 可选：`width`、`show`、`rules`、`disabled`
- 说明：单选组件，适用于状态、类型等单值枚举。

**使用方式**

```ts
{ title: '状态', key: 'status', type: 'radio', data: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] }
```

#### checkbox

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'checkbox'`
- 必填/常用：`data`（复选项，支持 `label`、`value`）
- 可选：`width`、`show`、`rules`、`disabled`
- 说明：复选组件，字段值通常为数组。

**使用方式**

```ts
{ title: '标签', key: 'tags', type: 'checkbox', data: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] }
```

#### select

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'select'`
- 必填/常用：`data`（下拉选项，支持 `label`、`value`）
- 可选：`multiple`、`filterable`、`clearable`、`placeholder`、`width`、`rules`
- 说明：本地下拉选择组件。

**使用方式**

```ts
{ title: '类型', key: 'type', type: 'select', data: [{ label: '系统', value: 1 }], clearable: true }
```

#### remote-select(远程下拉)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'remote-select'`、`action`（远程数据接口）
- 可选：`multiple`、`filterable`、`clearable`、`nameKey`、`idKey`、`placeholder`、`width`
- 说明：通过接口远程加载选项数据。

**使用方式**

```ts
{ title: '部门', key: 'deptId', type: 'remote-select', action: 'admin/dept/list', nameKey: 'name', idKey: '_id' }
```

#### date(日期)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'date'`
- 可选：`dateType`、`format`、`valueFormat`、`placeholder`、`width`、`rules`
- 说明：日期/时间选择，`dateType` 可用于指定 `date`、`datetime` 等类型。

**使用方式**

```ts
{ title: '生日', key: 'birthday', type: 'date', dateType: 'date', valueFormat: 'YYYY-MM-DD' }
```

#### datetimerange(日期时间范围)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'datetimerange'`
- 可选：`format`、`valueFormat`、`startPlaceholder`、`endPlaceholder`、`width`、`rules`
- 说明：日期时间范围选择，字段值通常为开始时间和结束时间数组。

**使用方式**

```ts
{ title: '时间范围', key: 'timeRange', type: 'datetimerange', valueFormat: 'x', width: 360 }
```

#### time

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'time'`
- 可选：`format`、`valueFormat`、`placeholder`、`width`、`rules`
- 说明：时间选择组件。

**使用方式**

```ts
{ title: '提醒时间', key: 'noticeTime', type: 'time', valueFormat: 'HH:mm:ss' }
```

#### switch

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'switch'`
- 可选：`activeValue`、`inactiveValue`、`activeText`、`inactiveText`、`width`、`show`
- 说明：开关组件，适用于启用/禁用、是否展示等布尔或枚举状态。

**使用方式**

```ts
{ title: '启用', key: 'enable', type: 'switch', activeValue: true, inactiveValue: false }
```

#### rate

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'rate'`
- 可选：`max`、`allowHalf`、`disabled`、`width`、`show`
- 说明：评分组件。

**使用方式**

```ts
{ title: '评分', key: 'score', type: 'rate', max: 5 }
```

#### slider(滑块)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'slider'`
- 可选：`min`、`max`、`step`、`showInput`、`width`、`show`
- 说明：滑块组件，适用于进度、比例等数值输入。

**使用方式**

```ts
{ title: '进度', key: 'progress', type: 'slider', min: 0, max: 100, step: 1 }
```

#### color(颜色选择)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'color'`
- 可选：`showAlpha`、`predefine`、`width`、`show`
- 说明：颜色选择器。

**使用方式**

```ts
{ title: '主题色', key: 'themeColor', type: 'color', showAlpha: true }
```

#### editor(富文本)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'editor'`
- 可选：`height`、`placeholder`、`width`、`show`、`rules`
- 说明：富文本编辑器，适用于文章内容、详情说明等。

**使用方式**

```ts
{ title: '内容', key: 'content', type: 'editor', height: 400 }
```

#### json

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'json'`
- 可选：`height`、`placeholder`、`width`、`show`、`rules`
- 说明：JSON 编辑/输入组件，适用于配置对象。

**使用方式**

```ts
{ title: '配置JSON', key: 'configJson', type: 'json', width: 500 }
```

#### file(文件上传)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'file'`
- 可选：`multiple`（是否多文件）、`limit`、`accept`、`fileType`、`width`、`rules`
- 说明：文件上传组件。

**使用方式**

```ts
{ title: '附件', key: 'files', type: 'file', multiple: true, limit: 5 }
```

#### file-select(文件库选择)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'file-select'`
- 可选：`fileType`（文件选择类型）、`multiple`、`limit`、`width`、`placeholder`
- 说明：从文件库中选择文件；图片场景可设置 `fileType: 'image'`。

**使用方式**

```ts
{ title: '头像', key: 'avatar', type: 'file-select', fileType: 'image', placeholder: '请选择图片' }
```

#### icon

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'icon'`
- 可选：`placeholder`、`width`、`show`、`rules`
- 说明：图标选择组件，字段值一般为图标名称。

**使用方式**

```ts
{ title: '菜单图标', key: 'icon', type: 'icon', placeholder: '请选择图标' }
```

#### cascader(级联选择)

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'cascader'`
- 必填/常用：`data`（级联选项）
- 可选：`props`、`clearable`、`filterable`、`placeholder`、`width`
- 说明：普通级联选择组件。

**使用方式**

```ts
{ title: '分类', key: 'category', type: 'cascader', data: [{ label: '一级', value: 1, children: [] }] }
```

#### tree-select

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'tree-select'`、`action`（树数据接口）
- 可选：`nameKey`、`idKey`、`multiple`、`checkStrictly`、`clearable`、`width`
- 说明：远程树形选择组件，适用于上级部门、菜单、分类等。

**使用方式**

```ts
{ title: '上级部门', key: 'parentId', type: 'tree-select', action: 'admin/dept/tree', nameKey: 'name', idKey: '_id' }
```

#### table-select

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'table-select'`、`action`（弹窗表格接口）
- 可选：`multiple`（是否多选）、`columns`（弹窗表格列）、`nameKey`、`idKey`、`width`
- 说明：通过弹窗表格选择数据，适用于角色、用户、商品等关联数据选择。

**使用方式**

```ts
{ title: '角色', key: 'roleIds', type: 'table-select', action: 'admin/role/page', multiple: true, columns: [{ title: '角色名', key: 'name', type: 'text' }] }
```

#### address

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'address'`
- 可选：`placeholder`、`width`、`show`、`rules`
- 说明：地址输入/选择组件，适用于详细地址信息。

**使用方式**

```ts
{ title: '地址', key: 'address', type: 'address', placeholder: '请输入地址' }
```

#### area-cascader

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'area-cascader'`
- 可选：`level`、`placeholder`、`width`、`show`、`rules`
- 说明：省市区地区级联选择组件。

**使用方式**

```ts
{ title: '地区', key: 'area', type: 'area-cascader', placeholder: '请选择地区' }
```

#### tag

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'tag'`
- 可选：`placeholder`、`width`、`show`、`rules`
- 说明：标签输入组件，字段值通常为字符串数组。

**使用方式**

```ts
{ title: '关键词', key: 'keywords', type: 'tag', placeholder: '请输入关键词后回车' }
```

#### map

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'map'`
- 可选：`placeholder`、`width`、`height`、`show`、`rules`
- 说明：地图选点组件，字段值通常包含经纬度信息。

**使用方式**

```ts
{ title: '定位', key: 'location', type: 'map', height: 300 }
```

#### `array&lt;string&gt;`

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'array&lt;string&gt;'`
- 可选：`placeholder`、`width`、`show`、`rules`
- 说明：字符串数组编辑组件，适用于标签列表、关键词列表等。

**使用方式**

```ts
{ title: '标签列表', key: 'tagList', type: 'array&lt;string&gt;', placeholder: '请输入标签' }
```

#### `array&lt;number&gt;`

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'array&lt;number&gt;'`
- 可选：`min`、`max`、`step`、`width`、`show`、`rules`
- 说明：数字数组编辑组件，适用于分值、价格阶梯等。

**使用方式**

```ts
{ title: '分值列表', key: 'scoreList', type: 'array&lt;number&gt;', min: 0, step: 1 }
```

#### `array&lt;object&gt;`

**组件属性**

- 必填：`title`（表单项标题）、`key`（字段名）、`type: 'array&lt;object&gt;'`、`columns`（子项字段配置）
- 可选：`width`、`show`、`rules`
- 说明：对象数组编辑组件，适用于规格项、明细行等可增删的结构化数据。

**使用方式**

```ts
{ title: '规格项', key: 'specs', type: 'array&lt;object&gt;', columns: [{ title: '规格名', key: 'name', type: 'text' }, { title: '价格', key: 'price', type: 'number' }] }
```

### 类型示例（@index.vue）

```ts
const formColumns = [
  {
    title: '用户名',
    key: 'username',
    type: 'text',
    rules: [{ required: true, message: '请输入用户名' }]
  },
  {
    title: '密码',
    key: 'password',
    type: 'password',
    show: ['add'],
    placeholder: '请输入密码'
  },
  {
    title: '年龄',
    key: 'age',
    type: 'number',
    min: 0,
    max: 120
  },
  {
    title: '状态',
    key: 'status',
    type: 'radio',
    data: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  {
    title: '角色',
    key: 'roleIds',
    type: 'table-select',
    action: 'admin/role/page',
    multiple: true
  },
  {
    title: '头像',
    key: 'avatar',
    type: 'file-select',
    fileType: 'image'
  },
  {
    title: '擅长标签',
    key: 'tags',
    type: 'array<string>'
  },
  {
    title: '地址',
    key: 'address',
    type: 'address'
  }
]
```

```vue
<qa-form
  v-model:formData="formData"
  :columns="formColumns"
  form-type="add"
  :label-width="110"
/>
```

以上配置可直接作为 QA 组件的使用说明，也可按业务字段继续扩展。

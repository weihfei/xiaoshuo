# DBOMS 项目核心规范

本文档整合了 DBOMS 项目的核心开发规范，所有项目成员必须严格遵守。

## 📋 目录

1. [组件命名规范](#1-组件命名规范)
2. [代码组织规范](#2-代码组织规范)
3. [样式规范](#3-样式规范)
4. [目录结构规范](#4-目录结构规范)
5. [Vue组件开发规范](#5-vue-组件开发规范)
6. [TypeScript使用规范](#6-typescript使用规范)
7. [API请求规范](#7-api-请求规范)
8. [Git提交规范](#8-git提交规范)

---

## 1. 组件命名规范

### 1.1 业务组件（仅限 business 目录）

**格式**: `Db` + 大驼峰命名法

**位置**: `src/components/business/*/*.vue`

**示例**:
```vue
<!-- ✅ 正确 -->
DbApprovalFlowOverview.vue
DbContractDetail.vue

<!-- ❌ 错误 -->
approval-flow-overview.vue
db_approval_flow.vue
```

### 1.2 基础组件

**格式**: `E` + 大驼峰命名法

**位置**: `src/components/bases/*/*.vue`

**示例**:
```vue
<!-- ✅ 正确 -->
EButton.vue
EInput.vue
ETable.vue

<!-- ❌ 错误 -->
base-button.vue
e_button.vue
```

### 1.3 其他组件

**格式**: 大驼峰命名法

**位置**: 除 business、bases 目录及特殊业务模块目录外的其他组件目录

**特殊情况**: 仅在 `src/views/*/components/*` 目录结构下的直接子组件可使用 `index.vue` 命名

**示例**:
```vue
<!-- ✅ 正确 -->
ContractList.vue
UserProfile.vue
src/views/purchaseOrderAmendment/components/formPurchaseOrderAmendment/index.vue

<!-- ❌ 错误 -->
contract-list.vue
user_profile.vue
src/views/purchaseOrderAmendment/components/formPurchaseOrderAmendment/formPurchaseOrder/components/MaterialInfo.vue (应使用大驼峰)
```

### 1.4 组件使用命名规范

**规则**: 在模板中使用封装的组件时，必须采用 kebab-case（烤串式）命名法

**适用组件**:
- `src/components/bases/*` 目录下的基础组件（如 `EButton.vue`）
- `src/components/business/*` 目录下的业务组件（如 `DbApprovalFlowOverview.vue`）
- 其他自定义公共组件

**示例**:
```vue
<!-- ✅ 正确 -->
<template>
  <e-button type="primary">提交</e-button>
  <db-approval-flow-overview :data="flowData" />
  <file-upload :multiple="true" />
</template>

<!-- ❌ 错误 -->
<template>
  <EButton type="primary">提交</EButton>
  <DbApprovalFlowOverview :data="flowData" />
  <FileUpload :multiple="true" />
</template>
```

---

## 2. 代码组织规范

### 2.1 TypeScript 接口定义

**规则**: 所有接口定义应放在 `src/interface` 目录下，使用时通过 import 引入

**示例**:
```typescript
// ✅ 正确
import { IContract } from '@/interface/contract'
import { IUser } from '@/interface/user'

// ❌ 错误
interface IContract {
  id: number
  name: string
}
```

### 2.2 API模块化

**规则**: API请求按业务模块组织在 `src/api/urls/modules` 目录下

**示例**:
```typescript
// ✅ 正确
import { getContractList } from '@/api/urls/modules/contract'
import { updateUser } from '@/api/urls/modules/user'

// ❌ 错误
axios.get('/api/contract/list')
axios.post('/api/user/update', data)
```

### 2.3 Pinia状态管理

**规则**: Pinia store按功能模块组织在 `src/store/modules` 目录下

**示例**:
```typescript
// ✅ 正确
import { useContractStore } from '@/store/modules/contract'
import { useUserStore } from '@/store/modules/user'

const contractStore = useContractStore()

// ❌ 错误
const state = reactive({
  contracts: []
})
```

---

## 3. 样式规范

### 3.1 SCSS 样式组织

**规则**: 
- 样式文件应放在组件同级目录或 `src/styles` 目录下
- 避免在组件中内联大量样式代码

**示例**:
```
✅ 正确结构
src/components/fileUpload/
  ├── index.vue
  └── index.scss
  
src/styles/
  ├── glob.scss
  └── variables.scss

❌ 错误做法
<template>...</template>
<script>...</script>
<style scoped lang="scss">
  /* 内联大量样式 */
</style>
```

### 3.2 CSS 类名命名（BEM）

**格式**: `Block__Element--Modifier`

**示例**:
```scss
// ✅ 正确
.form__input--disabled {
  opacity: 0.5;
}

.button--primary {
  background-color: blue;
}

// ❌ 错误
.form-input-disabled { }
.primary-button { }
```

### 3.3 样式作用域

**规则**:
- 组件样式使用 `scoped` 属性避免样式污染
- 全局样式放在 `src/styles` 目录下统一管理
- 合理使用 CSS 变量定义主题色

---

## 4. 目录结构规范

### 4.1 业务视图组织

**规则**: 业务视图按功能模块组织在 `src/views` 目录下，每个业务模块应包含完整的子目录结构

**标准结构**:
```
src/views/contract/
├── api/              # API请求
├── components/       # 组件（直接子组件可用 index.vue）
│   └── formContract/
│       └── index.vue
├── config/          # 配置文件
├── contractDetail/  # 合同详情
├── contractEdit/    # 合同编辑
├── contractList/    # 合同列表
├── enums/           # 枚举定义
└── interface/       # 接口定义
```

**示例**:
```
✅ 正确
src/views/contract/
  ├── api/
  ├── components/
  ├── config/
  ├── contractDetail/
  ├── contractEdit/
  ├── contractList/
  ├── enums/
  └── interface/

❌ 错误
src/views/
  ├── contractDetail.vue
  ├── contractEdit.vue
  ├── contractList.vue
```

---

## 5. Vue组件开发规范

### 5.1 组件结构

**规则**:
- 使用 `<script setup lang="ts">` 语法
- 模板 (template)、脚本 (script)、样式 (style) 按顺序排列
- 合理使用组件的生命周期钩子

**示例**:
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 脚本内容
</script>

<style scoped lang="scss">
// 样式内容
</style>
```

### 5.2 响应式数据

**规则**:
- 使用 `ref` 和 `reactive` 进行数据响应式处理
- 合理使用 `computed` 计算属性
- 正确使用 `watch` 监听数据变化

### 5.3 组件通信

**规则**:
- 父子组件通信使用 `props` 和 `emit`
- 跨层级组件通信使用 `provide/inject`
- 全局状态管理使用 Pinia

---

## 6. TypeScript 使用规范

### 6.1 类型定义

**规则**:
- 所有变量、函数参数、返回值应有明确的类型定义
- 复杂类型应在 `src/interface` 目录中定义
- 合理使用泛型提高代码复用性

**示例**:
```typescript
// ✅ 正确
interface IUser {
  id: number
  name: string
  age: number
}

function getUser(id: number): IUser {
  // ...
}

// ❌ 错误
function getUser(id: any): any {
  // ...
}
```

### 6.2 函数定义

**规则**:
- 函数应有明确的输入输出类型
- 合理使用可选参数和默认参数
- 复杂业务逻辑应拆分为多个小函数

**示例**:
```typescript
// ✅ 正确
const calculateTotal = (price: number, quantity: number, discount: number = 0): number => {
  return price * quantity * (1 - discount)
}

// ❌ 错误
const calc = (p, q, d) => p * q * (1 - d)
```

---

## 7. API请求规范

### 7.1 请求封装

**规则**:
- 所有请求应通过封装的 axios 实例发送
- 请求和响应应有统一的拦截处理
- 错误处理应统一且友好

**示例**:
```typescript
// ✅ 正确
import { request } from '@/api/axios'

export const getContractList = (params: IContractParams) => {
  return request<IContractListResponse>({
    url: '/api/contract/list',
    method: 'get',
    params
  })
}

// ❌ 错误
axios.get('/api/contract/list')
```

### 7.2 请求组织

**规则**:
- 按业务模块组织 API请求函数
- 请求参数和返回值应有明确的类型定义
- 合理使用请求缓存和防重复提交

---

## 8. Git 提交规范

### 8.1 Conventional Commits

**格式**: `<type>: <description>`

**Type 类型**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链

**示例**:
```bash
# ✅ 正确
git commit -m "feat: 新增用户管理功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "refactor: 重构订单处理逻辑"

# ❌ 错误
git commit -m "update"
git commit -m "fix bug"
git commit -m "修改了一些代码"
```

### 8.2 提交原则

- 每次提交应只包含一个功能或修复
- 提交信息应清晰描述变更内容
- 遵循 conventional commits 规范

---

## 9. 注释规范

### 9.1 代码注释

**规则**:
- 复杂业务逻辑应有详细注释
- 函数应有 JSDoc 格式注释说明用途、参数和返回值
- 组件应有注释说明用途和使用方法

**示例**:
```typescript
/**
 * 获取用户信息
 * @param userId - 用户 ID
 * @returns 用户信息对象
 */
async function getUserInfo(userId: number): Promise<IUser> {
  // 从 API 获取用户信息
  const user = await fetchUser(userId)
  return user
}
```

### 9.2 特殊注释标签

- `TODO`: 待完成的功能
- `FIXME`: 需要修复的问题
- `HACK`: 临时解决方案
- `OPTIMIZE`: 优化建议
- `NOTE`: 重要说明
- `DEPRECATED`: 废弃标记

---

## 10. 测试规范

### 10.1 单元测试

**规则**:
- 关键业务逻辑应有单元测试覆盖
- 使用 Vitest 进行单元测试
- 测试代码应放在 `__tests__` 目录下

### 10.2 E2E 测试

**规则**:
- 关键用户流程应有端到端测试覆盖
- 使用 Playwright 进行 E2E 测试
- 测试应覆盖主要用户场景

---

**版本**: v1.0  
**更新日期**: 2026-03-09  
**维护者**: DBOMS 团队

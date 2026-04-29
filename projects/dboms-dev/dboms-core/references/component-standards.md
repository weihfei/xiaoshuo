# DBOMS 组件开发规范

本文档详细描述了 DBOMS 项目中组件的开发规范、使用规则和最佳实践。

## 📋 目录

1. [ELESUI组件库](#1-elesui-组件库)
2. [组件分类与使用](#2-组件分类与使用)
3. [组件命名规范](#3-组件命名规范)
4. [组件开发标准](#4-组件开发标准)
5. [Props 定义规范](#5-props定义规范)
6. [组件事件规范](#6-组件事件规范)
7. [插槽使用规范](#7-插槽使用规范)
8. [组件测试规范](#8-组件测试规范)

---

## 1. ELESUI组件库

### 1.1 已封装的 ELESUI组件

项目已封装以下 Element Plus 组件，**必须优先使用**：

| 组件名 | 用途 | 文件路径 |
|-------|------|---------|
| EAutoComplete | 自动完成输入框 | src/components/ELESUI/EAutoComplete.vue |
| EButton | 按钮 | src/components/ELESUI/EButton.vue |
| EButtonTabs | 按钮标签页 | src/components/ELESUI/EButtonTabs.vue |
| ECheckboxGroup | 复选框组 | src/components/ELESUI/ECheckboxGroup.vue |
| EDateTimeRange | 日期时间范围选择器 | src/components/ELESUI/EDateTimeRange.vue |
| EDialog | 对话框 | src/components/ELESUI/EDialog.vue |
| EDialogButton | 对话框按钮 | src/components/ELESUI/EDialogButton.vue |
| EEditor | 富文本编辑器 | src/components/ELESUI/EEditor.vue |
| EInput | 输入框 | src/components/ELESUI/EInput.vue |
| ETable | 表格 | src/components/ELESUI/ETable.vue |
| EPagination | 分页器 | src/components/ELESUI/EPagination.vue |
| EProgress | 进度条 | src/components/ELESUI/EProgress.vue |
| ERadioGroup | 单选框组 | src/components/ELESUI/ERadioGroup.vue |
| ESelect | 选择器 | src/components/ELESUI/ESelect.vue |
| ESteps | 步骤条 | src/components/ELESUI/ESteps.vue |
| ESwitch | 开关 | src/components/ELESUI/ESwitch.vue |
| ETabs | 标签页 | src/components/ELESUI/ETabs.vue |
| ETooltip | 文字提示 | src/components/ELESUI/ETooltip.vue |

### 1.2 使用规则

**强制规则**:
- ✅ 所有 UI组件必须使用 `src/components/ELESUI/` 下的封装组件
- ✅ 当其他UI组件不在"已封装ELESUI组件"中时，才可以使用Element Plus原生组件
- ✅ 组件文件名使用PascalCase（如 `EInput.vue`）
- ✅ 模板中使用 kebab-case（如 `<e-input>`）

**示例**:
```vue
<!-- ✅ 正确 -->
<template>
  <e-button type="primary">提交</e-button>
  <e-input v-model="value" placeholder="请输入" />
  <e-table :data="list" :columns="columns" />
</template>

<!-- ❌ 错误：使用了原生 Element Plus 组件 -->
<template>
  <el-button type="primary">提交</el-button>
  <el-input v-model="value" placeholder="请输入" />
</template>
```

### 1.3 自动导入配置

项目已配置 `unplugin-vue-components` 自动导入：
- ELESUI组件无需手动导入
- Element Plus 组件无需手动导入

**示例**:
```vue
<script setup lang="ts">
// ✅ 正确：无需导入 ELESUI组件
// ❌ 错误：不要添加如下导入
// import { EButton, EInput } from '@/components/ELESUI'
</script>
```

---

## 2. 组件分类与使用

### 2.1 业务组件

**位置**: `src/components/business/`  
**命名**: `Db` + 大驼峰  
**用途**: 包含特定业务逻辑的组件

**示例**:
```vue
<!-- DbApprovalFlowOverview.vue -->
<script setup lang="ts">
import { useApprovalStore } from '@/store/modules/approval'

const approvalStore = useApprovalStore()
// 业务逻辑...
</script>
```

### 2.2 基础组件

**位置**: `src/components/bases/`  
**命名**: `E` + 大驼峰  
**用途**: 通用 UI组件，无业务逻辑

**示例**:
```vue
<!-- EButton.vue -->
<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

defineProps<Props>()
</script>
```

### 2.3 功能组件

**位置**: `src/components/fileUpload/`, `src/components/imgUpload/` 等  
**命名**: 描述性名称 + 大驼峰  
**用途**: 提供特定功能的组件

**示例**:
```vue
<!-- FileSigle.vue -->
<script setup lang="ts">
// 文件上传逻辑
</script>
```

### 2.4 页面级组件

**位置**: `src/views/*/components/`  
**命名**: 
- 直接子组件可用 `index.vue`
- 嵌套子组件用大驼峰

**示例**:
```
src/views/contract/components/
├── formContract/
│   └── index.vue          # ✅ 直接子组件
├── contractDetail/
│   ├── index.vue          # ✅ 直接子组件
│   └── components/
│       └── MaterialInfo.vue  # ✅ 嵌套子组件用大驼峰
```

---

## 3. 组件命名规范

### 3.1 文件命名

**规则总结**:
```
业务组件：Db + PascalCase
基础组件：E + PascalCase
功能组件：DescriptiveName + PascalCase
页面组件：PascalCase 或 index.vue
```

**详细示例**:
```vue
✅ 正确
DbApprovalFlowOverview.vue    // 业务组件
EButton.vue                   // 基础组件
FileUpload.vue                // 功能组件
ContractList.vue              // 页面组件
index.vue                     // 页面直接子组件

❌ 错误
approval-flow-overview.vue    // 不应使用 kebab-case
db_approval_flow.vue          // 不应使用下划线
e-button.vue                  // 基础组件需要 E 前缀
```

### 3.2 组件使用命名

**模板中的命名规则**:
- 所有封装组件使用 kebab-case
- 保持语义清晰

**示例**:
```vue
<template>
  <!-- ✅ 正确 -->
  <e-button type="primary">提交</e-button>
  <db-approval-flow-overview :data="flowData" />
  <file-upload :multiple="true" />
  
  <!-- ❌ 错误 -->
  <EButton type="primary">提交</EButton>
  <DbApprovalFlowOverview :data="flowData" />
  <FileUpload :multiple="true" />
</template>
```

---

## 4. 组件开发标准

### 4.1 组件结构

**标准顺序**:
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

### 4.2 Script 内部代码顺序

`<script setup>` 内部代码需按以下顺序组织，各组之间用空行分隔：

```typescript
// 1. Vue 核心库导入
import { ref, reactive, computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'

// 2. 第三方库导入
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 3. 项目配置和工具导入
import config from '@/config'
import { formatDate } from '@/utils/format'

// 4. Store 和 Hooks 导入
import { useUserStore } from '@/store/modules/user'
import { useForm } from '@/hooks/useForm'

// 5. 组件导入（通常不需要，已自动导入）

// 6. API接口导入
import { getUserList } from '@/api/urls/modules/user'

// 7. 类型导入（放在最后）
import type { IUser } from '@/interface/user'

// 8. Props 和 Emits 定义
interface Props {
  userId?: number
  showDetail?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  userId: 0,
  showDetail: false
})

const emit = defineEmits<{
  submit: [data: IUser]
  cancel: []
}>()

// 9. 响应式数据
const loading = ref(false)
const formData = reactive({
  name: '',
  age: 0
})

// 10. 计算属性
const userName = computed(() => {
  return formData.name.toUpperCase()
})

// 11. 方法定义
const handleSubmit = async () => {
  loading.value = true
  try {
    await api.submit(formData)
    emit('submit', formData)
  } finally {
    loading.value = false
  }
}

// 12. 生命周期钩子
onMounted(() => {
  loadData()
})

onUnmounted(() => {
  cleanup()
})

// 13. 监听器
watch(
  () => props.userId,
  (newVal) => {
    if (newVal) {
      loadUserDetail(newVal)
    }
  }
)

// 14. 暴露组件方法/属性
defineExpose({
  formData,
  handleSubmit
})
```

### 4.3 组件大小控制

**规则**:
- 单个组件不超过 **500 行**
- 超过 500 行需拆分为多个子组件
- 复杂逻辑应提取到 hooks 中

**拆分策略**:
```
大组件 (>500 行)
    ↓
├── 主组件（协调各子组件）
├── SubComponent1.vue (<500 行)
├── SubComponent2.vue (<500 行)
└── useComponentLogic.ts (提取逻辑到 hook)
```

---

## 5. Props 定义规范

### 5.1 基本规则

**必须详细定义**:
- 类型声明
- 是否必填
- 默认值
- 验证器（复杂场景）

### 5.2 TypeScript 定义方式

**推荐方式**（Vue 3.3+）:
```typescript
<script setup lang="ts">
interface Props {
  status?: 'active' | 'inactive' | 'pending'
  count?: number
  user?: IUser
  items?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  status: 'active',
  count: 0,
  items: () => []
})
</script>
```

**传统方式**（兼容旧版）:
```typescript
<script setup lang="ts">
const props = defineProps({
  status: {
    type: String as PropType<'active' | 'inactive' | 'pending'>,
    default: 'active',
    validator: (value: string) => {
      return ['active', 'inactive', 'pending'].includes(value)
    }
  },
  count: {
    type: Number,
    default: 0
  },
  user: {
    type: Object as PropType<IUser>,
    required: true
  }
})
</script>
```

### 5.3 Props 命名

**规则**:
- 使用 camelCase（小驼峰）
- 布尔值使用 is/has/can/should 前缀
- 避免与 HTML 属性冲突

**示例**:
```typescript
interface Props {
  // ✅ 正确
  userId: number
  userName: string
  isActive: boolean
  hasPermission: boolean
  canEdit: boolean
  
  // ❌ 错误
  user_id: number      // 不使用下划线
  user-name: string    // 不使用中横线
  class: string        // 避免与 HTML 属性冲突
}
```

---

## 6. 组件事件规范

### 6.1 Emits 定义

**TypeScript 定义**:
```typescript
<script setup lang="ts">
const emit = defineEmits<{
  submit: [data: FormData]
  change: [value: string, label: string]
  delete: [id: number]
  update: [key: string, value: any]
}>()

// 触发事件
emit('submit', formData)
emit('change', value, label)
```

### 6.2 v-model 支持

**单 v-model**:
```typescript
<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input :value="modelValue" @input="handleChange" />
</template>
```

**多 v-model**:
```typescript
<script setup lang="ts">
interface Props {
  firstName: string
  lastName: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
</script>
```

**使用**:
```vue
<db-user-form
  v-model:first-name="formData.firstName"
  v-model:last-name="formData.lastName"
/>
```

---

## 7. 插槽使用规范

### 7.1 默认插槽

```vue
<!-- 子组件 -->
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<!-- 父组件 -->
<db-card>
  <p>这是内容</p>
</db-card>
```

### 7.2 具名插槽

```vue
<!-- 子组件 -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件 -->
<db-layout>
  <template #header>
    <h1>标题</h1>
  </template>
  
  <p>主要内容</p>
  
  <template #footer>
    <p>页脚</p>
  </template>
</db-layout>
```

### 7.3 作用域插槽

```vue
<!-- 子组件 -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="item.index">
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件 -->
<db-list :items="userList">
  <template #default="{ item, index }">
    <div class="user-item">
      <span>{{ index + 1 }}</span>
      <span>{{ item.name }} - {{ item.email }}</span>
    </div>
  </template>
</db-list>
```

---

## 8. 组件测试规范

### 8.1 单元测试

**测试内容**:
- Props 传递
- 事件触发
- 插槽渲染
- 计算属性
- 方法调用

**示例**（Vitest + Vue Test Utils）:
```typescript
// __tests__/EButton.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EButton from '../EButton.vue'

describe('EButton', () => {
  it('渲染正确的文本', () => {
    const wrapper = mount(EButton, {
      slots: { default: '点击我' }
    })
    expect(wrapper.text()).toBe('点击我')
  })

  it('处理点击事件', async () => {
    const wrapper = mount(EButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('应用正确的类型类名', () => {
    const wrapper = mount(EButton, {
      props: { type: 'primary' }
    })
    expect(wrapper.classes()).toContain('e-button--primary')
  })
})
```

### 8.2 组件行数检查

**自动化检查**:
```typescript
// scripts/check-component-size.ts
import { readFileSync } from 'fs'
import { globSync } from 'glob'

const MAX_LINES = 500

const vueFiles = globSync('src/**/*.vue')

vueFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n').length
  
  if (lines > MAX_LINES) {
    console.error(`❌ ${file} 超过${MAX_LINES}行 (${lines}行)`)
    console.error('请拆分为多个子组件')
    process.exit(1)
  }
})

console.log('✅ 所有组件大小检查通过')
```

---

## 9. 组件性能优化

### 9.1 响应式优化

```typescript
// ✅ 正确：常量不需要 ref
const API_URL = '/api/users'

// ✅ 正确：使用computed 缓存
const filteredList = computed(() => {
  return list.value.filter(item => item.active)
})

// ❌ 错误：不必要的响应式
const constantValue = ref(100) // 常量不需要
```

### 9.2 列表渲染优化

```vue
<template>
  <!-- ✅ 正确：使用唯一 key -->
  <div v-for="item in list" :key="item.id">
    {{ item.name }}
  </div>
  
  <!-- ❌ 错误：使用index作为key -->
  <div v-for="(item, index) in list" :key="index">
    {{ item.name }}
  </div>
  
  <!-- ❌ 错误：没有 key -->
  <div v-for="item in list">{{ item.name }}</div>
</template>
```

### 9.3 事件处理优化

```typescript
// ✅ 正确：使用防抖
import { debounce } from 'lodash-es'

const handleSearch = debounce((keyword: string) => {
  searchApi(keyword)
}, 300)

// ✅ 正确：组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

---

## 10. 常见问题

### Q1: 何时使用业务组件 vs 基础组件？

**A**: 
- **基础组件**: 纯 UI组件，无业务逻辑（如按钮、输入框）
- **业务组件**: 包含特定业务逻辑（如审批流程、订单处理）

### Q2: 组件什么时候需要拆分？

**A**: 
- 超过 500 行
- 职责不单一
- 可复用性强
- 测试困难

### Q3: Props 和 Emits 如何设计？

**A**: 
- Props: 单向数据流，只读
- Emits: 向父组件通信
- 复杂对象使用interface 定义类型

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队

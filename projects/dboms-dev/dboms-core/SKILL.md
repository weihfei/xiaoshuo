---
name: dboms-core
description: "DBOMS 项目核心规范与工作流程集成，包含项目规则、智能体工作流、代码审查标准、测试规范等核心知识"
license: MIT
metadata:
  author: DBOMS 团队
  version: "1.0"
  project: dboms
  tech-stack: "Vue 3.2 + TypeScript 5.x + Vite 6.x + Element Plus"
  reference-docs:
    - references/project-rules.md (项目核心规范)
    - references/agent-workflow.md (智能体工作流)
    - references/component-standards.md (组件规范)
    - references/api-standards.md (API 规范)
    - references/testing-standards.md (测试规范)
  tools:
    - OpenSkills
    - ESLint 9.x
    - Prettier 3.x
    - Stylelint 14.x
    - Vitest
    - Playwright
allowed-tools: "Bash(*) Read Write"
---

# 📖 技能说明

本技能为 DBOMS 项目核心规范与工作流程的集中化封装，整合了项目开发中的核心知识、最佳实践和标准化流程。

## 核心功能

- 📋 **项目规范集成** - 包含命名规范、代码组织、样式规范等核心规则
- 🤖 **智能体工作流** - 项目经理/程序员/测试员角色职责与自动化流程
- 🔍 **代码审查标准** - 8 维度审查体系（风格、TS、Vue、CSS、工程化、性能、安全、项目特有）
- ✅ **测试规范** - 单元测试、E2E 测试、测试用例设计方法
- 🏗️ **架构指南** - 目录结构、模块化设计、状态管理
- 🔄 **开发工作流** - Git 提交规范、依赖管理、环境配置

## 使用场景

- **新成员入职** - 快速了解项目规范和开发流程
- **日常开发** - 遵循标准化的编码规范和工作流程
- **代码审查** - 依据统一的审查标准进行质量检查
- **问题排查** - 参考最佳实践解决常见问题
- **流程优化** - 持续改进开发效率和代码质量

---

# 🚀 快速开始

## 最常用的方式

### 场景 1: 查询项目规范

```
请查看 dboms-core skill，告诉我项目中组件的命名规范是什么？
```

### 场景 2: 遵循开发流程

```
我要开发一个新功能，应该遵循什么流程？
```

### 场景 3: 代码审查参考

```
请根据 dboms-core 规范审查这段代码
```

### 场景 4: 了解智能体协作

```
项目中有哪些智能体角色？各自职责是什么？
```

---

# 📚 核心内容

## 1. 项目规范体系

### 1.1 组件命名规范

#### 业务组件（src/components/business/*）
- **格式**: `Db` + 大驼峰命名法
- **示例**: 
  - ✅ `DbApprovalFlowOverview.vue`
  - ❌ `approval-flow-overview.vue`

#### 基础组件（src/components/bases/*）
- **格式**: `E` + 大驼峰命名法
- **示例**:
  - ✅ `EButton.vue`
  - ❌ `base-button.vue`

#### 其他组件
- **格式**: 大驼峰命名法
- **特殊情况**: `src/views/*/components/*` 下的直接子组件可使用 `index.vue`

#### 组件使用规范
- **模板中**: 必须使用 kebab-case（烤串式）
- **示例**:
  ```vue
  <!-- 正确 -->
  <e-button type="primary">提交</e-button>
  <db-approval-flow-overview :data="flowData" />
  
  <!-- 错误 -->
  <EButton type="primary">提交</EButton>
  <DbApprovalFlowOverview :data="flowData" />
  ```

### 1.2 代码组织规范

#### TypeScript 接口定义
- **位置**: `src/interface/` 目录
- **使用**: 通过 import 引入
- **示例**:
  ```typescript
  // ✅ 正确
  import { IContract } from '@/interface/contract'
  
  // ❌ 错误
  interface IContract {...}
  ```

#### API模块化
- **位置**: `src/api/urls/modules/` 目录
- **使用**: 统一导入管理
- **示例**:
  ```typescript
  // ✅ 正确
  import { getContractList } from '@/api/urls/modules/contract'
  
  // ❌ 错误
  axios.get('/api/contract/list')
  ```

#### Pinia状态管理
- **位置**: `src/store/modules/` 目录
- **使用**: 模块化 store
- **示例**:
  ```typescript
  // ✅ 正确
  import { useContractStore } from '@/store/modules/contract'
  
  // ❌ 错误
  const state = reactive({...})
  ```

### 1.3 样式规范

- **预处理器**: SCSS
- **位置**: 组件同级目录或 `src/styles/`
- **命名**: BEM 命名法（Block__Element--Modifier）
- **作用域**: 组件样式使用 scoped 属性
- **示例**:
  ```
  ✅ src/components/fileUpload/index.scss
  ✅ src/styles/glob.scss
  ❌ <style scoped lang="scss">/* 内联大量样式 */</style>
  ```

### 1.4 目录结构规范

#### 业务视图组织
```
src/views/contract/
├── api/              # API请求
├── components/       # 组件（直接子组件可用 index.vue）
├── config/          # 配置文件
├── contractDetail/  # 合同详情
├── contractEdit/    # 合同编辑
├── contractList/    # 合同列表
├── enums/           # 枚举定义
└── interface/       # 接口定义
```

---

## 2. 智能体工作流

### 2.1 角色职责划分

#### 项目经理（Project Manager）
- **职责**: 需求分析、任务拆分、进度跟踪
- **技能**: project-manager
- **工作流**:
  1. 接收用户需求
  2. 分析功能点
  3. 拆分为可执行任务
  4. 分配给对应角色
  5. 跟踪完成情况

#### 程序员（Developer）
- **职责**: 代码实现、规范遵循、单元测试
- **技能**: developer
- **工作流**:
  1. 接收任务
  2. 设计方案
  3. 编写代码（遵循规范）
  4. 自测
  5. 提交审查

#### 测试员（Tester）
- **职责**: 测试用例、执行测试、缺陷管理
- **技能**: tester
- **工作流**:
  1. 审查需求文档
  2. 设计测试用例
  3. 执行测试（Vitest/Playwright）
  4. 提交缺陷报告
  5. 验证修复

### 2.2 自动化工作流

基于 OpenSkills 框架的自动化调度：
```
用户请求
    ↓
项目经理分析（需求拆解）
    ↓
程序员实现（代码开发）
    ↓
测试员验证（质量保证）
    ↓
交付成果
```

---

## 3. 代码审查标准

### 8 维度审查体系

#### 维度 1: 代码风格规范
- 命名规范（camelCase/PascalCase/UPPER_SNAKE_CASE）
- 注释密度（10-20%）
- 代码格式（2 空格缩进、单引号、分号）
- CSS BEM 命名

#### 维度 2: 语法/TS类型规范
- ES6+ 语法
- TypeScript 严格模式
- 接口定义（I 前缀）
- 类型别名（T 前缀）
- 静态导入

#### 维度 3: Vue3 组件规范
- `<script setup>` 语法
- Props 详细定义
- 组件大小（<500 行）
- v-for key 唯一性
- 模板组件 kebab-case

#### 维度 4: CSS/SCSS 规范
- 属性书写顺序
- 选择器嵌套（≤3 层）
- SCSS 变量和混入

#### 维度 5: 工程化/项目规范
- ESLint/Prettier/Stylelint
- console.log 限制（≤3 个）
- API 封装
- Git 提交规范

#### 维度 6: 性能规范
- 列表渲染优化
- 响应式优化
- 内存管理
- 防抖/节流

#### 维度 7: 安全规范
- XSS防护
- CSRF 防护
- 敏感数据处理

#### 维度 8: 项目特有规范
- ELESUI组件强制使用
- Hooks 规范
- 路由配置
- Pinia Store 规范

### 问题分级

- 🔴 **严重（Critical）** - 必须修复才能合并
- 🟡 **重要（Important）** - 强烈建议修复
- 🔵 **建议（Suggestion）** - 可选修复

---

## 4. 测试规范

### 4.1 测试分层策略

#### 单元测试（Vitest）
- **覆盖范围**: 工具函数、组件逻辑、Store actions
- **位置**: `__tests__/` 目录
- **要求**: 关键业务逻辑必须有单元测试

#### E2E 测试（Playwright）
- **覆盖范围**: 关键用户流程
- **位置**: `e2e/` 目录
- **要求**: 核心业务流程必须有 E2E 测试

### 4.2 测试用例设计方法

- **等价类划分**: 有效/无效输入分类
- **边界值分析**: 极限值测试
- **场景法**: 用户操作流程模拟

### 4.3 测试工作流

```
需求分析
    ↓
测试用例设计
    ↓
执行测试
    ↓
缺陷管理
    ↓
回归测试
    ↓
测试报告
```

---

## 5. 开发工作流

### 5.1 Git 提交规范

遵循 Conventional Commits:
```
<type>: <description>

[optional body]

[optional footer]
```

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
feat: 新增用户管理功能
fix: 修复登录页面样式问题
refactor: 重构订单处理逻辑
```

### 5.2 依赖管理

- **包管理器**: pnpm（禁止 npm/yarn）
- **依赖分类**: 生产依赖 vs 开发依赖
- **安全检查**: 定期审计漏洞

### 5.3 环境配置

```bash
# 开发环境
pnpm install
pnpm dev

# 测试环境
pnpm test

# 生产构建
pnpm build
```

---

## 6. 技术栈

### 核心技术
- **框架**: Vue 3.2 + TypeScript 5.x
- **构建**: Vite 6.x
- **UI 库**: Element Plus（封装为 ELESUI）
- **状态管理**: Pinia 2.x
- **HTTP**: Axios 0.27.x
- **路由**: Vue Router 4.x

### 开发工具
- **代码检查**: ESLint 9.x + Prettier 3.x
- **样式检查**: Stylelint 14.x
- **单元测试**: Vitest
- **E2E 测试**: Playwright
- **技能管理**: OpenSkills

---

# ⚠️ 注意事项

1. **最小化修改原则** - 保持原有结构稳定，避免大规模调整
2. **拼音命名例外** - 仅在后端接口字段、第三方库字段等特殊情况允许
3. **组件行数限制** - 单个组件不超过 500 行，超出需拆分
4. **console.log 限制** - 单文件不超过 3 个
5. **动态导入限制** - 仅在路由懒加载时允许使用

---

# 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 代码检查
pnpm lint

# 运行测试
pnpm test

# 生产构建
pnpm build

# 读取 skill
npx openskills read dboms-core
```

---

# 📖 参考资源

- **项目规则**: `.comate/rules/project-rules-enhanced.mdr`
- **前端规范**: `.lingma/skills/ebvue3-frontend-code-review/references/`
- **智能体技能**: `.claude/skills/` 目录
- **技术文档**: `src/` 源码中的注释和 README

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队  
**更新日志**: 初始版本，整合项目核心规范与工作流

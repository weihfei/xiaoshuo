# DBOMS Core Skill - 项目核心规范与工作流程

本 skill 封装了 DBOMS 项目的核心开发规范、工作流程和最佳实践。

## 📚 文档目录

### 核心文档
- **[SKILL.md](./SKILL.md)** - Skill 主文档，快速了解技能功能和使用方法
- **[project-rules.md](./references/project-rules.md)** - 项目核心规范（命名、组织、样式等）
- **[agent-workflow.md](./references/agent-workflow.md)** - 智能体工作流与角色职责
- **[component-standards.md](./references/component-standards.md)** - 组件开发规范
- **[api-standards.md](./references/api-standards.md)** - API接口规范
- **[testing-standards.md](./references/testing-standards.md)** - 测试规范

### 外部规范引用
本项目同时遵循以下规范文档：
- [前端基础规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/basic.md)
- [TypeScript规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/ts.md)
- [Vue组件规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/vueComponent.md)
- [工程化规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/engineering.md)
- [性能规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/performance.md)
- [安全规范](../../.lingma/skills/ebvue3-frontend-code-review/references/frontend-development-standards/safety.md)

---

## 🚀 快速开始

### 使用方式 1: 查询项目规范

```bash
# 读取完整 skill
npx openskills read dboms-core
```

**适用场景**:
- 新成员入职学习
- 查阅特定规范
- 了解工作流程

### 使用方式 2: 向 AI 提问

```
请根据 dboms-core 规范，告诉我组件的命名规则是什么？

项目中有哪些智能体角色？各自职责是什么？

我要开发一个新功能，应该遵循什么流程？
```

**适用场景**:
- 快速查询具体规范
- 解决开发中的疑问
- 学习最佳实践

### 使用方式 3: 代码审查参考

```
请根据 dboms-core 规范审查这段代码

这个组件是否符合项目规范？有哪些需要改进的地方？
```

**适用场景**:
- 代码自查
- PR 审查
- 质量保证

---

## 📖 核心内容概览

### 1. 项目规范体系

#### 组件命名规范
```
业务组件：Db + PascalCase     → DbApprovalFlowOverview.vue
基础组件：E + PascalCase       → EButton.vue
其他组件：PascalCase          → ContractList.vue
模板使用：kebab-case          → <e-button>
```

#### 代码组织规范
```
接口定义：src/interface/
API模块：src/api/urls/modules/
Pinia Store: src/store/modules/
样式文件：组件同级或 src/styles/
```

#### 目录结构规范
```
src/views/contract/
├── api/              # API请求
├── components/       # 组件
├── config/          # 配置
├── contractDetail/  # 合同详情
├── contractEdit/    # 合同编辑
├── contractList/    # 合同列表
├── enums/           # 枚举
└── interface/       # 接口
```

### 2. 智能体工作流

#### 角色职责
- **项目经理**: 需求分析、任务拆分、进度跟踪
- **程序员**: 代码实现、规范遵循、单元测试
- **测试员**: 测试用例、执行测试、缺陷管理

#### 自动化流程
```
用户请求 → 项目经理分析 → 程序员实现 → 测试员验证 → 交付成果
```

### 3. 代码审查标准

#### 8 维度审查体系
1. 代码风格规范
2. 语法/TS类型规范
3. Vue3 组件规范
4. CSS/SCSS 规范
5. 工程化/项目规范
6. 性能规范
7. 安全规范
8. 项目特有规范

#### 问题分级
- 🔴 **严重**: 必须修复才能合并
- 🟡 **重要**: 强烈建议修复
- 🔵 **建议**: 可选修复

### 4. 测试规范

#### 测试分层
- **单元测试 (70%)**: Vitest，覆盖工具函数、组件逻辑
- **集成测试 (20%)**: 模块间交互测试
- **E2E 测试 (10%)**: Playwright，关键用户流程

#### 测试用例设计方法
- 等价类划分
- 边界值分析
- 场景法
- 错误推测

### 5. 开发工作流

#### Git 提交规范
```bash
feat: 新增用户管理功能
fix: 修复登录页面样式问题
refactor: 重构订单处理逻辑
```

#### 依赖管理
```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
pnpm lint         # 代码检查
pnpm test         # 运行测试
pnpm build        # 生产构建
```

---

## 🎯 常见使用场景

### 场景 1: 新成员入职

**学习路径**:
1. 阅读 `SKILL.md` 了解整体
2. 学习 `project-rules.md` 掌握基础规范
3. 查看 `component-standards.md` 学习组件开发
4. 参考 `api-standards.md` 了解 API 调用
5. 学习 `testing-standards.md` 编写测试

### 场景 2: 开发新功能

**工作流程**:
1. 项目经理分析需求，拆分任务
2. 程序员遵循规范开发代码
3. 编写单元测试和集成测试
4. 使用代码审查工具检查规范
5. 测试员执行测试验证功能

### 场景 3: 代码审查

**检查要点**:
1. 组件命名是否符合规范
2. 代码组织是否合理
3. TypeScript 类型是否完整
4. 注释密度是否适当（10-20%）
5. console.log 是否≤3 个
6. 组件行数是否<500
7. 是否通过 ESLint/Prettier
8. 测试覆盖率是否达标

### 场景 4: 问题解决

**查询方式**:
```
Q: 组件超过 500 行怎么办？
A: 拆分为多个子组件，或将逻辑提取到 hooks

Q: Props 如何定义类型？
A: 使用interface，放在 src/interface/目录

Q: 如何发起 API请求？
A: 在 src/api/urls/modules/创建对应模块文件，使用 request 方法
```

---

## ⚠️ 重要规则

### 强制规则（必须遵守）

1. **组件命名**: 业务组件必须用 Db 前缀，基础组件必须用 E 前缀
2. **模板组件名**: 必须使用 kebab-case（如 `<e-button>`）
3. **接口定义**: 必须在 `src/interface/` 目录下
4. **API 调用**: 必须使用封装的 request 方法，禁止直接使用 axios
5. **Store 使用**: 必须通过 Pinia 管理全局状态
6. **组件大小**: 单个组件不超过 500 行
7. **console.log**: 单文件不超过 3 个
8. **TypeScript**: 禁止使用 any 类型（特殊情况需注释）

### 推荐实践（强烈建议）

1. 使用拼音命名仅限于后端接口字段等特殊情况
2. 优先使用组合式 API（`<script setup>`）
3. Props 详细定义类型和验证器
4. v-for必须配合唯一的key
5. 组件样式使用 scoped 属性
6. 遵循 AAA 测试模式（Arrange-Act-Assert）

---

## 🔧 工具集成

### ESLint/Prettier/Stylelint

项目已配置完整的代码检查工具链：

```bash
# 检查代码
pnpm lint

# 自动格式化
pnpm format

# 检查样式
pnpm lint:style
```

### 测试工具

```bash
# 单元测试
pnpm test:unit

# E2E 测试
pnpm test:e2e

# 生成覆盖率报告
pnpm test:coverage
```

### 代码审查工具

使用 `ebvue3-frontend-code-review` skill 进行代码审查：

```
请对这个文件进行代码审查，检查是否符合 ebvue3 项目规范
```

---

## 📊 质量指标

### 代码规范要求

- **ESLint**: 0 errors, 0 warnings
- **Prettier**: 100% 格式化
- **Stylelint**: 0 errors
- **测试覆盖率**: ≥80%
- **组件行数**: <500 行/组件
- **console.log**: ≤3 个/文件

### 审查通过率要求

- **严重问题**: 0 个（必须全部修复）
- **重要问题**: <5 个（强烈建议修复）
- **优化建议**: 不限（可选修复）

---

## 🤝 团队协作

### 角色分工

| 角色 | 职责 | 主要技能 |
|-----|------|---------|
| 项目经理 | 需求分析、任务拆分 | project-manager |
| 程序员 | 代码实现、自测 | developer |
| 测试员 | 测试用例、执行测试 | tester |
| 审查者 | 代码审查、质量把控 | ebvue3-frontend-code-review |

### 沟通机制

- **任务分配**: 通过项目经理 skill 自动分配
- **进度跟踪**: 使用任务系统记录
- **问题反馈**: 及时提出并记录
- **知识共享**: 更新本文档和示例

---

## 📝 更新日志

### v1.0 (2026-03-09)
- ✨ 初始版本发布
- 📚 整合项目核心规范
- 🤖 定义智能体工作流
- ✅ 建立代码审查标准
- 🧪 制定测试规范

---

## 📞 支持与反馈

如有问题或建议，请：
1. 查阅相关文档
2. 向 AI 助手提问
3. 联系项目维护者
4. 提交 Issue 或 PR

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队  
**许可证**: MIT

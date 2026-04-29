# DBOMS Core Skill 使用指南

本文档提供详细的使用说明和示例，帮助你充分利用 `dboms-core` skill。

---

## 📖 目录

1. [Skill 结构](#1-skill-结构)
2. [读取 Skill](#2-读取-skill)
3. [常用查询场景](#3-常用查询场景)
4. [与其他 Skill 协作](#4-与其他-skill 协作)
5. [最佳实践](#5-最佳实践)
6. [故障排查](#6-故障排查)

---

## 1. Skill 结构

```
.lingma/skills/dboms-core/
├── README.md                    # 总览文档（你正在看的）
├── SKILL.md                     # Skill 主定义文件
└── references/                  # 参考文档目录
    ├── project-rules.md         # 项目核心规范
    ├── agent-workflow.md        # 智能体工作流
    ├── component-standards.md   # 组件开发规范
    ├── api-standards.md         # API接口规范
    └── testing-standards.md     # 测试规范
```

### 文档用途

| 文档 | 用途 | 何时查阅 |
|-----|------|---------|
| **README.md** | 快速了解 skill 功能和使用方法 | 初次使用、查找概览信息 |
| **SKILL.md** | Skill 的元数据和功能定义 | AI 自动读取，用户一般不需要 |
| **project-rules.md** | 命名规范、代码组织等基础规则 | 开发时查阅具体规范 |
| **agent-workflow.md** | 智能体角色和协作流程 | 了解工作流、任务分配 |
| **component-standards.md** | 组件开发和 ELESUI 使用规范 | 开发组件时参考 |
| **api-standards.md** | API接口设计和调用规范 | 编写 API 代码时参考 |
| **testing-standards.md** | 测试方法和用例设计规范 | 编写测试时参考 |

---

## 2. 读取 Skill

### 方式 1: 命令行读取

```bash
# 读取整个 skill
npx openskills read dboms-core
```

**输出**: 将显示 SKILL.md 的内容，包含 skill 的功能介绍和使用方法。

### 方式 2: 在对话中引用

向 AI 提问时，AI 会自动参考 skill 中的内容：

```
请根据 dboms-core 规范，告诉我组件应该如何命名？

项目中有哪些智能体角色？各自职责是什么？

我要开发合同管理功能，应该遵循什么流程？
```

### 方式 3: 直接阅读文档

直接在编辑器中打开文档：

```bash
# 打开总览文档
code .lingma/skills/dboms-core/README.md

# 打开具体规范文档
code .lingma/skills/dboms-core/references/project-rules.md
```

---

## 3. 常用查询场景

### 场景 1: 查询命名规范

**问题**: "组件应该如何命名？"

**查阅文档**: `project-rules.md` 或 `component-standards.md`

**AI 回答示例**:
```
DBOMS 项目的组件命名规范如下：

1. 业务组件（src/components/business/）
   格式：Db + 大驼峰
   示例：DbApprovalFlowOverview.vue

2. 基础组件（src/components/bases/）
   格式：E + 大驼峰
   示例：EButton.vue

3. 其他组件
   格式：大驼峰
   示例：ContractList.vue

4. 模板中使用
   格式：kebab-case（短横线）
   示例：<e-button> <db-approval-flow-overview>
```

### 场景 2: 了解开发流程

**问题**: "我要开发一个新功能，应该遵循什么流程？"

**查阅文档**: `agent-workflow.md`

**AI 回答示例**:
```
新功能开发的标准流程：

1. 需求分析阶段（项目经理）
   - 理解用户需求
   - 识别关键功能点
   - 创建任务列表

2. 代码实现阶段（程序员）
   - 技术方案设计
   - 编写代码（遵循规范）
   - 自测

3. 测试验证阶段（测试员）
   - 编写测试用例
   - 执行测试
   - 提交测试报告

4. 代码审查阶段
   - 使用 ebvue3-frontend-code-review 审查
   - 修复发现的问题
   - 合并代码
```

### 场景 3: 查询 API 规范

**问题**: "如何正确发起 API请求？"

**查阅文档**: `api-standards.md`

**AI 回答示例**:
```
正确的 API 调用方式：

1. 在 src/api/urls/modules/ 下创建业务模块文件
   例如：contract.ts

2. 导入封装的 request 方法
   import { request } from '@/api/axios'

3. 定义类型化的 API 函数
   export function getContractList(params: IContractParams) {
     return request<IContractListResponse>({
       url: '/contract/list',
       method: 'get',
       params
     })
   }

4. 在组件中使用
   const list = await getContractList({ pageNum: 1, pageSize: 20 })

❌ 错误做法：
   - 直接使用 axios
   - 在组件中直接写 URL
   - 没有类型定义
```

### 场景 4: 查询测试规范

**问题**: "单元测试应该覆盖哪些内容？"

**查阅文档**: `testing-standards.md`

**AI 回答示例**:
```
单元测试应优先覆盖：

1. 工具函数（70% 覆盖率目标）
   - formatDate、formatNumber 等格式化函数
   - validateForm、checkPermission 等验证函数

2. 组件逻辑
   - Props 传递和验证
   - 事件触发
   - 计算属性
   - 方法调用

3. Store actions
   - 状态修改
   - 异步操作
   - Getter 计算

4. Composables/Hooks
   - 自定义 Hooks 的逻辑
   - 响应式数据处理

不需要的测试：
- 纯 UI 渲染（交给 E2E）
- 第三方库的功能
- 简单的 getter/setter
```

### 场景 5: 代码审查参考

**问题**: "请帮我检查这个组件是否符合规范"

**使用方式**:
```
1. 打开组件代码
2. 向 AI 提问：
   "请根据 dboms-core 规范审查这个组件"
3. AI 会检查：
   - 命名是否规范
   - 代码组织是否合理
   - TypeScript 类型是否完整
   - 注释密度是否适当
   - 组件大小是否超标
   - 等等...
```

---

## 4. 与其他 Skill 协作

### Skill 关系图

```
┌─────────────────────┐
│   dboms-core        │ ← 核心规范（本 skill）
│   (规范和标准)      │
└──────────┬──────────┘
           │ 提供规范依据
           ▼
┌─────────────────────┐
│ ebvue3-frontend-    │ ← 前端代码审查
│ code-review         │
│ (8 维度审查)         │
└─────────────────────┘

同时配合：
- project-manager: 任务拆分和管理
- developer: 代码实现
- tester: 测试验证
```

### 协作示例

#### 示例 1: 完整开发流程

```
用户：我想新增一个合同导出功能

1. project-manager 技能
   - 分析需求
   - 拆分任务：
     * 创建导出 API
     * 开发导出按钮组件
     * 编写单元测试
     * 编写 E2E 测试

2. developer 技能
   - 查看 dboms-core 规范
   - 按规范编写代码：
     * 组件命名：DbExportButton.vue
     * API 位置：src/api/urls/modules/contract.ts
     * 接口定义：src/interface/contract.ts
   - 遵循代码组织规范

3. ebvue3-frontend-code-review 技能
   - 审查代码是否符合规范
   - 检查 8 个维度
   - 生成审查报告

4. tester 技能
   - 查看 testing-standards.md
   - 设计测试用例
   - 编写测试代码
```

#### 示例 2: 代码审查流程

```
开发者：请审查这个组件

ebvue3-frontend-code-review:
  使用 dboms-core 作为规范依据
  
  检查项：
  ✅ 组件命名：DbContractList.vue (符合)
  ✅ 代码组织：按规范顺序 (符合)
  ⚠️ TypeScript: 第 35 行使用了 any (不符合)
  ❌ 组件大小：620 行 > 500 行 (严重问题)
  
  建议：
  1. 替换 any 为具体类型
  2. 拆分为多个子组件
```

---

## 5. 最佳实践

### 实践 1: 新成员入职学习路径

**第 1 天**: 
- 阅读 `README.md` 了解整体
- 安装开发环境和依赖

**第 2 天**:
- 学习 `project-rules.md` 掌握基础规范
- 练习组件命名和代码组织

**第 3 天**:
- 学习 `component-standards.md`
- 开发一个简单的测试组件

**第 4 天**:
- 学习 `api-standards.md`
- 练习 API 调用

**第 5 天**:
- 学习 `testing-standards.md`
- 为测试组件编写单元测试

**第 2 周**:
- 参与实际功能开发
- 使用代码审查工具
- 遵循完整工作流程

### 实践 2: 日常开发自查清单

开发前:
- [ ] 明确需求和设计规范
- [ ] 了解相关规范文档

开发中:
- [ ] 遵循命名规范
- [ ] 按规范组织代码
- [ ] 编写类型定义
- [ ] 添加必要注释
- [ ] 控制组件大小（<500 行）

开发后:
- [ ] 运行 ESLint/Prettier
- [ ] 编写单元测试
- [ ] 使用审查工具检查
- [ ] 修复所有严重问题
- [ ] 更新相关文档

### 实践 3: 团队协作规范

**代码审查**:
```
审查者：
1. 使用 ebvue3-frontend-code-review 审查
2. 重点关注严重问题
3. 提出建设性意见

开发者：
1. 及时响应审查意见
2. 修复所有严重问题
3. 解释特殊场景的处理
```

**知识共享**:
```
- 发现好的实践 → 更新到示例代码
- 遇到常见问题 → 添加到 FAQ
- 规范不明确 → 讨论并更新文档
```

### 实践 4: 持续改进

**定期 Review**:
- 每月检查一次规范执行情况
- 每季度更新一次文档
- 收集反馈并优化

**质量指标跟踪**:
- 测试覆盖率趋势
- 代码审查通过率
- 缺陷数量和分布

---

## 6. 故障排查

### 问题 1: 找不到 skill

**症状**: `npx openskills read dboms-core` 提示找不到 skill

**解决方案**:
```bash
# 1. 确认 skill 目录存在
ls .lingma/skills/dboms-core/

# 2. 确认 SKILL.md 文件存在
cat .lingma/skills/dboms-core/SKILL.md

# 3. 如果不存在，重新创建
# （已创建则跳过）

# 4. 尝试重新读取
npx openskills read dboms-core
```

### 问题 2: AI 没有参考规范

**症状**: AI 的回答与规范不符

**解决方案**:
```
1. 明确提及 skill 名称
   "请根据 dboms-core 规范..."

2. 提供具体的规范文档
   "参考 component-standards.md 中的..."

3. 指出具体的规范条目
   "根据命名规范，业务组件应该..."
```

### 问题 3: 规范冲突

**症状**: 不同文档之间的规范不一致

**解决方案**:
```
优先级原则：
1. SKILL.md > 其他文档
2. 最新更新的文档 > 旧文档
3. 具体规范 > 通用规范

处理方式：
1. 记录冲突内容
2. 联系文档维护者
3. 提交 Issue 或 PR
4. 等待官方更新
```

### 问题 4: 文档内容过多

**症状**: 文档太长，难以快速找到需要的信息

**解决方案**:
```
1. 使用搜索功能
   - VSCode: Ctrl+F / Cmd+F
   - 搜索关键词

2. 查看文档目录
   - 每个文档开头都有目录
   - 直接跳转到相关章节

3. 使用 AI 助手
   - 直接提问获取特定信息
   - "组件命名的规范是什么？"
```

---

## 7. 高级用法

### 技巧 1: 组合查询

```
同时参考多个文档：
"根据 project-rules.md 的命名规范和 component-standards.md 的组件开发标准，
我应该如何设计和命名一个新的业务组件？"
```

### 技巧 2: 对比学习

```
对比好和坏的示例：
"请举例说明符合规范和不符合规范的代码有什么区别？"
```

### 技巧 3: 场景化学习

```
结合实际场景：
"如果我要开发一个合同审批流程，需要遵循哪些规范？"
```

### 技巧 4: 渐进式学习

```
由浅入深：
1. 先看 README.md 了解概览
2. 再看具体规范文档
3. 最后看外部引用文档
```

---

## 8. 贡献指南

### 如何更新规范

1. **发现问题**: 记录不规范或有争议的地方
2. **提出建议**: 在 Issue 中描述问题和改进方案
3. **讨论确认**: 团队讨论达成一致
4. **更新文档**: 修改相应的 markdown 文件
5. **通知团队**: 在团队内同步更新内容

### 文档格式规范

```markdown
# 标题

## 二级标题

### 三级标题

- 列表项
- 列表项

**粗体**: 强调重点
*斜体*: 次要信息

```typescript
// 代码示例
const example = true
```

✅ 正确示例
❌ 错误示例
```

---

## 9. 资源链接

### 内部资源
- [项目规则](./references/project-rules.md)
- [智能体工作流](./references/agent-workflow.md)
- [组件规范](./references/component-standards.md)
- [API 规范](./references/api-standards.md)
- [测试规范](./references/testing-standards.md)

### 外部资源
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vitest 文档](https://vitest.dev/)
- [Playwright 文档](https://playwright.dev/)

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队  
**最后更新**: 2026-03-09

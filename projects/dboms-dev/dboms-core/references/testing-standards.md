# DBOMS 测试规范

本文档描述了 DBOMS 项目的测试策略、测试方法和测试工作流程。

## 📋 目录

1. [测试分层策略](#1-测试分层策略)
2. [单元测试规范](#2-单元测试规范)
3. [E2E 测试规范](#3-e2e-测试规范)
4. [测试用例设计方法](#4-测试用例设计方法)
5. [测试工作流程](#5-测试工作流程)
6. [缺陷管理](#6-缺陷管理)
7. [最佳实践](#7-最佳实践)

---

## 1. 测试分层策略

### 1.1 测试金字塔

```
        /\
       /  \      E2E 测试 (10%)
      /____\     关键用户流程
     /      \    
    /________\   集成测试 (20%)
   /          \  模块间交互
  /____________\ 
 /              \单元测试 (70%)
/________________\工具函数、组件逻辑
```

### 1.2 各层测试范围

#### 单元测试（70%）
**工具**: Vitest  
**覆盖范围**:
- 工具函数（utils）
- 组件逻辑（components）
- Store actions
- Composables/hooks
- 纯函数

**示例**:
```typescript
// __tests__/formatDate.spec.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '@/utils/format'

describe('formatDate', () => {
  it('格式化日期字符串', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024-01-01')
  })

  it('处理空值', () => {
    expect(formatDate(null)).toBe('')
  })
})
```

#### 集成测试（20%）
**工具**: Vitest + Mock  
**覆盖范围**:
- API调用
- 组件交互
- Store与组件交互
- 路由跳转

**示例**:
```typescript
// __tests__/ContractList.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ContractList from '@/views/contract/contractList/index.vue'
import * as api from '@/api/urls/modules/contract'

vi.mock('@/api/urls/modules/contract')

describe('ContractList', () => {
  it('加载合同列表', async () => {
    vi.mocked(api.getContractList).mockResolvedValue({
      list: [{ id: 1, name: '合同 1' }],
      total: 1
    })

    const wrapper = mount(ContractList)
    await wrapper.vm.loadData()
    
    expect(wrapper.findAll('.contract-item')).toHaveLength(1)
  })
})
```

#### E2E 测试（10%）
**工具**: Playwright  
**覆盖范围**:
- 登录流程
- 核心业务流程
- 关键用户场景
- 跨模块功能

**示例**:
```typescript
// e2e/contract-flow.spec.ts
import { test, expect } from '@playwright/test'

test.describe('合同管理流程', () => {
  test('完整的合同创建和审批流程', async ({ page }) => {
    // 1. 登录
    await page.goto('/login')
    await page.fill('[name="username"]', 'admin')
    await page.fill('[name="password"]', '123456')
    await page.click('button[type="submit"]')
    
    // 2. 创建合同
    await page.click('text=合同管理')
    await page.click('text=新建合同')
    await page.fill('[name="contractName"]', '测试合同')
    await page.click('button:has-text("提交")')
    
    // 3. 验证创建成功
    await expect(page.locator('.el-message--success')).toBeVisible()
  })
})
```

---

## 2. 单元测试规范

### 2.1 测试文件组织

**目录结构**:
```
src/
├── utils/
│   ├── format.ts
│   └── __tests__/
│       └── format.spec.ts
├── components/
│   ├── EButton.vue
│   └── __tests__/
│       └── EButton.spec.ts
└── store/
    ├── modules/
    │   └── user.ts
    └── __tests__/
        └── user.spec.ts
```

**文件命名**:
- 测试文件：`*.spec.ts` 或 `*.test.ts`
- 与被测试文件同名，放在 `__tests__` 目录

### 2.2 测试用例编写规范

#### 基本结构
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('被测模块/函数名', () => {
  // 前置处理
  beforeEach(() => {
    // 每个测试前执行
  })

  afterEach(() => {
    // 每个测试后执行
  })

  it('应该完成某个功能', () => {
    // 测试代码
  })

  it('应该处理边界情况', () => {
    // 测试代码
  })
})
```

#### 测试命名
```typescript
// ✅ 正确：清晰描述测试内容
it('应该返回格式化后的日期字符串', () => {})
it('应该在参数为空时返回空字符串', () => {})
it('应该在数据加载时显示 loading 状态', () => {})

// ❌ 错误：描述不清晰
it('测试 1', () => {})
it('正常情况', () => {})
```

### 2.3 工具函数测试

```typescript
// __tests__/format.spec.ts
import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, formatCurrency } from '@/utils/format'

describe('formatDate', () => {
  it('格式化标准日期', () => {
    const date = new Date('2024-01-15 10:30:00')
    expect(formatDate(date)).toBe('2024-01-15')
  })

  it('处理 null 值', () => {
    expect(formatDate(null)).toBe('')
  })

  it('处理 undefined', () => {
    expect(formatDate(undefined)).toBe('')
  })

  it('支持自定义格式', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date, 'YYYY/MM/DD')).toBe('2024/01/15')
  })
})

describe('formatCurrency', () => {
  it('格式化货币', () => {
    expect(formatCurrency(1234.5)).toBe('¥1,234.50')
  })

  it('处理负数', () => {
    expect(formatCurrency(-1234.5)).toBe('-¥1,234.50')
  })

  it('处理零值', () => {
    expect(formatCurrency(0)).toBe('¥0.00')
  })
})
```

### 2.4 组件测试

```typescript
// __tests__/EButton.spec.ts
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EButton from '../EButton.vue'

describe('EButton', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(EButton)
  })

  it('渲染默认按钮', () => {
    expect(wrapper.classes()).toContain('e-button')
  })

  it('应用正确的类型类名', () => {
    await wrapper.setProps({ type: 'primary' })
    expect(wrapper.classes()).toContain('e-button--primary')
  })

  it('处理点击事件', async () => {
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('禁用状态下不触发点击', async () => {
    await wrapper.setProps({ disabled: true })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('显示加载状态', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.e-button__loading').exists()).toBe(true)
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('传递插槽内容', () => {
    const wrapperWithSlot = mount(EButton, {
      slots: { default: '点击我' }
    })
    expect(wrapperWithSlot.text()).toBe('点击我')
  })
})
```

### 2.5 Store 测试

```typescript
// __tests__/user.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '@/store/modules/user'

describe('useUserStore', () => {
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
  })

  it('初始化默认状态', () => {
    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLoggedIn).toBe(false)
  })

  it('设置用户信息', async () => {
    const userInfo = {
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com'
    }

    await userStore.setUserInfo(userInfo)
    
    expect(userStore.userInfo).toEqual(userInfo)
    expect(userStore.isLoggedIn).toBe(true)
  })

  it('清除用户信息', async () => {
    await userStore.setUserInfo({ id: 1, name: '张三' })
    await userStore.clearUserInfo()
    
    expect(userStore.userInfo).toBeNull()
    expect(userStore.isLoggedIn).toBe(false)
  })

  it('更新用户资料', async () => {
    await userStore.setUserInfo({ id: 1, name: '张三' })
    await userStore.updateProfile({ name: '李四' })
    
    expect(userStore.userInfo?.name).toBe('李四')
  })
})
```

### 2.6 Mock 使用规范

```typescript
// __tests__/ContractAPI.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getContractList } from '@/api/urls/modules/contract'
import { request } from '@/api/axios'

// Mock request 函数
vi.mock('@/api/axios', () => ({
  request: vi.fn()
}))

describe('Contract API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('获取合同列表', async () => {
    const mockData = {
      list: [{ id: 1, name: '合同 1' }],
      total: 1
    }

    vi.mocked(request).mockResolvedValue(mockData)

    const result = await getContractList({ pageNum: 1, pageSize: 20 })
    
    expect(request).toHaveBeenCalledWith({
      url: '/contract/list',
      method: 'get',
      params: { pageNum: 1, pageSize: 20 }
    })
    expect(result).toEqual(mockData)
  })

  it('处理请求错误', async () => {
    vi.mocked(request).mockRejectedValue(new Error('网络错误'))

    await expect(getContractList({ pageNum: 1, pageSize: 20 }))
      .rejects
      .toThrow('网络错误')
  })
})
```

---

## 3. E2E 测试规范

### 3.1 测试目录结构

```
e2e/
├── fixtures/           # 测试数据
│   └── users.json
├── pages/             # 页面对象模型
│   ├── LoginPage.ts
│   └── ContractPage.ts
├── tests/             # 测试用例
│   ├── auth/
│   │   └── login.spec.ts
│   ├── contract/
│   │   ├── create.spec.ts
│   │   └── approve.spec.ts
│   └── settings/
│       └── profile.spec.ts
└── playwright.config.ts
```

### 3.2 页面对象模式（POM）

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly usernameInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    this.page = page
    this.usernameInput = page.locator('[name="username"]')
    this.passwordInput = page.locator('[name="password"]')
    this.submitButton = page.locator('button[type="submit"]')
    this.errorMessage = page.locator('.el-message--error')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async getErrorMessage() {
    return this.errorMessage.textContent()
  }
}
```

### 3.3 E2E 测试用例

```typescript
// e2e/tests/auth/login.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.describe('登录功能', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('使用有效凭据登录成功', async ({ page }) => {
    await loginPage.login('admin', '123456')
    
    // 验证跳转到首页
    await expect(page).toHaveURL('/home')
    
    // 验证显示用户名
    await expect(page.locator('.user-name')).toHaveText('管理员')
  })

  test('使用无效凭据登录失败', async () => {
    await loginPage.login('admin', 'wrong')
    
    // 验证显示错误消息
    await expect(loginPage.errorMessage).toBeVisible()
    await expect(loginPage.errorMessage).toContainText('密码错误')
  })

  test('空用户名提示', async () => {
    await loginPage.login('', '123456')
    
    await expect(loginPage.errorMessage).toContainText('请输入用户名')
  })

  test('空密码提示', async () => {
    await loginPage.login('admin', '')
    
    await expect(loginPage.errorMessage).toContainText('请输入密码')
  })
})
```

### 3.4 业务流程测试

```typescript
// e2e/tests/contract/create-and-approve.spec.ts
import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'
import { ContractListPage } from '../../pages/ContractPage'

test.describe('合同创建和审批完整流程', () => {
  test('从创建到审批通过', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const contractPage = new ContractListPage(page)
    
    // 1. 登录
    await loginPage.goto()
    await loginPage.login('admin', '123456')
    await expect(page).toHaveURL('/home')
    
    // 2. 创建合同
    await contractPage.goto()
    await contractPage.clickCreateButton()
    await contractPage.fillContractForm({
      contractName: '测试合同-' + Date.now(),
      partyA: '甲方公司',
      partyB: '乙方公司',
      amount: '100000'
    })
    await contractPage.submitForm()
    
    // 3. 验证创建成功
    await expect(page.locator('.el-message--success')).toBeVisible()
    
    // 4. 提交审批
    await contractPage.submitForApproval()
    
    // 5. 切换到审批账号
    await loginPage.logout()
    await loginPage.login('manager', '123456')
    
    // 6. 审批通过
    await contractPage.goto()
    await contractPage.approveContract()
    
    // 7. 验证审批成功
    await expect(page.locator('.status-approved')).toBeVisible()
  })
})
```

---

## 4. 测试用例设计方法

### 4.1 等价类划分

将输入数据分为有效等价类和无效等价类：

```typescript
// 测试用例：搜索功能
describe('搜索功能', () => {
  // 有效等价类
  it('正常关键词搜索', () => {
    search('合同')
  })

  // 无效等价类
  it('空字符串搜索', () => {
    search('')
  })

  it('超长字符串搜索', () => {
    search('a'.repeat(1000))
  })

  it('特殊字符搜索', () => {
    search('<script>alert(1)</script>')
  })
})
```

### 4.2 边界值分析

测试边界条件：

```typescript
describe('分页功能', () => {
  it('第一页', () => {
    loadPage(1)
  })

  it('最后一页', () => {
    loadPage(totalPages)
  })

  it('页码为 0', () => {
    loadPage(0) // 应处理为 1 或报错
  })

  it('页码超出范围', () => {
    loadPage(totalPages + 1) // 应返回空或报错
  })

  it('每页条数为最小值', () => {
    loadPage(1, 1)
  })

  it('每页条数为最大值', () => {
    loadPage(1, 100)
  })
})
```

### 4.3 场景法

模拟真实用户操作流程：

```typescript
describe('用户注册流程', () => {
  it('完整的注册流程', async () => {
    // 1. 打开注册页面
    await goToRegister()
    
    // 2. 填写表单
    await fillUsername('testuser')
    await fillEmail('test@example.com')
    await fillPassword('Test123!')
    await fillConfirmPassword('Test123!')
    
    // 3. 同意协议
    await checkAgreement()
    
    // 4. 提交
    await submitForm()
    
    // 5. 验证注册成功
    await expectSuccessMessage()
    
    // 6. 验证跳转到登录页
    await expectRedirectToLogin()
  })
})
```

### 4.4 错误推测

基于经验预测可能出现的问题：

```typescript
describe('文件上传功能 - 异常情况', () => {
  it('上传空文件', async () => {
    await uploadFile(new File([], 'empty.txt'))
    await expectErrorMessage('文件不能为空')
  })

  it('上传超大文件', async () => {
    await uploadFile(createLargeFile(100 * 1024 * 1024)) // 100MB
    await expectErrorMessage('文件大小不能超过 50MB')
  })

  it('上传不支持的文件格式', async () => {
    await uploadFile(new File(['content'], 'test.exe'), 'application/octet-stream')
    await expectErrorMessage('不支持的文件格式')
  })

  it('网络中断后重试', async () => {
    mockNetworkFailure()
    await uploadFile(testFile)
    await expectRetryButton()
  })
})
```

---

## 5. 测试工作流程

### 5.1 测试驱动开发（TDD）

```
1. 编写失败的测试（红）
   ↓
2. 编写刚好通过测试的代码（绿）
   ↓
3. 重构代码（重构）
   ↓
4. 回到步骤 1
```

**示例**:
```typescript
// 1. 先写测试
it('两数相加', () => {
  expect(add(1, 2)).toBe(3)
})

// 2. 运行测试（失败）
// 3. 实现函数
function add(a: number, b: number): number {
  return a + b
}

// 4. 运行测试（通过）
// 5. 添加更多测试
it('处理负数', () => {
  expect(add(-1, -2)).toBe(-3)
})
```

### 5.2 测试覆盖率要求

**最低覆盖率要求**:
- 语句覆盖率：≥ 80%
- 分支覆盖率：≥ 70%
- 函数覆盖率：≥ 90%
- 行覆盖率：≥ 80%

**检查命令**:
```bash
# 运行测试并生成覆盖率报告
pnpm test --coverage

# 查看覆盖率报告
open coverage/index.html
```

### 5.3 CI/CD集成

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:unit
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 6. 缺陷管理

### 6.1 缺陷分级

| 级别 | 描述 | 响应时间 |
|-----|------|---------|
| P0 | 致命缺陷，系统崩溃，数据丢失 | 立即修复 |
| P1 | 严重缺陷，主要功能失效 | 24 小时内 |
| P2 | 一般缺陷，次要功能问题 | 3 天内 |
| P3 | 轻微缺陷，UI/体验问题 | 下个迭代 |

### 6.2 缺陷报告模板

```markdown
## 缺陷标题
[简明扼要地描述问题]

## 缺陷级别
P0/P1/P2/P3

## 重现步骤
1. 打开...
2. 点击...
3. 输入...
4. 出现...

## 预期结果
[描述应该发生什么]

## 实际结果
[描述实际发生了什么]

## 环境信息
- 操作系统：Windows 11
- 浏览器：Chrome 120.0.6099.109
- 版本号：v2.3.1

## 附件
- 截图/录屏
- 日志文件
- 相关数据

## 影响范围
- 受影响的功能模块
- 受影响的用户群体
```

### 6.3 缺陷跟踪流程

```
发现缺陷
    ↓
记录缺陷（JIRA/禅道）
    ↓
分配给开发人员
    ↓
修复缺陷
    ↓
验证修复
    ↓
关闭缺陷
```

---

## 7. 最佳实践

### 7.1 测试命名约定

```typescript
// ✅ 好的命名
it('应该在用户名已存在时显示错误提示', () => {})
it('应该保留两位小数', () => {})
it('应该在网络错误时显示重试按钮', () => {})

// ❌ 差的命名
it('测试一下', () => {})
it('正常情况', () => {})
it('bug fix', () => {})
```

### 7.2 AAA 模式

```typescript
// Arrange（准备）- Act（执行）- Assert（断言）
it('计算总价', () => {
  // Arrange
  const cart = new ShoppingCart()
  cart.addItem({ price: 100, quantity: 2 })
  
  // Act
  const total = cart.getTotal()
  
  // Assert
  expect(total).toBe(200)
})
```

### 7.3 测试隔离

```typescript
// ✅ 正确：每个测试独立
describe('Calculator', () => {
  let calc: Calculator

  beforeEach(() => {
    calc = new Calculator() // 每个测试新建实例
  })

  it('加法测试', () => {
    expect(calc.add(1, 2)).toBe(3)
  })

  it('减法测试', () => {
    expect(calc.subtract(5, 3)).toBe(2)
  })
})

// ❌ 错误：测试之间有依赖
let calc = new Calculator()

it('第一次加法', () => {
  calc.add(1, 2) // 改变了 calc 状态
})

it('第二次加法', () => {
  // 依赖于上一个测试的状态
  expect(calc.result).toBe(3)
})
```

### 7.4 避免测试副作用

```typescript
// ✅ 正确：不修改外部状态
it('格式化字符串', () => {
  const result = formatString('hello')
  expect(result).toBe('Hello')
})

// ❌ 错误：修改了全局状态
it('设置主题', () => {
  setTheme('dark') // 修改了全局主题
  expect(getTheme()).toBe('dark')
})
```

### 7.5 测试数据管理

```typescript
// 使用工厂函数创建测试数据
function createUser(overrides = {}) {
  return {
    id: 1,
    name: '测试用户',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }
}

// 使用
const adminUser = createUser({
  role: 'admin',
  name: '管理员'
})
```

### 7.6 快照测试

```typescript
// 适合测试 UI组件的结构
it('渲染正确的结构', () => {
  const { container } = render(UserCard)
  expect(container).toMatchSnapshot()
})

// 更新快照
// pnpm test -u
```

### 7.7 异步测试

```typescript
// async/await
it('异步加载数据', async () => {
  const data = await loadData()
  expect(data).toHaveLength(10)
})

// Promise
it('返回 Promise', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined()
  })
})

// 回调函数
it('使用回调', (done) => {
  setTimeout(() => {
    expect(value).toBe(10)
    done()
  }, 1000)
})
```

---

## 8. 常见问题

### Q1: 测试应该覆盖哪些场景？

**A**: 优先覆盖：
1. 核心业务逻辑
2. 边界条件和异常情况
3. 用户常用操作
4. 容易出错的代码
5. 公共工具和组件

### Q2: 如何处理测试中的随机性？

**A**: 使用固定种子：

```typescript
// 固定随机数生成器
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0.5)
})
```

### Q3: 测试运行太慢怎么办？

**A**: 
- 并行运行测试
- 只运行变更相关的测试
- 使用更快的 Mock
- 减少 E2E 测试数量

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队

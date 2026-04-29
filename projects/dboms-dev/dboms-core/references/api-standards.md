# DBOMS API接口规范

本文档描述了 DBOMS 项目中 API接口的设计、组织和使用规范。

## 📋 目录

1. [API 分层架构](#1-api-分层架构)
2. [目录结构](#2-目录结构)
3. [请求封装](#3-请求封装)
4. [接口定义规范](#4-接口定义规范)
5. [参数和响应类型](#5-参数和响应类型)
6. [错误处理](#6-错误处理)
7. [最佳实践](#7-最佳实践)

---

## 1. API 分层架构

### 1.1 三层架构

```
┌─────────────────────┐
│   组件层 (Views)     │  调用业务 API
├─────────────────────┤
│   业务 API 层        │  组织业务请求
│ (api/urls/modules)  │
├─────────────────────┤
│   基础 API 层        │  统一请求封装
│  (api/axios)        │
└─────────────────────┘
```

### 1.2 各层职责

**组件层**:
- 调用业务 API 函数
- 不直接使用 axios
- 处理业务逻辑

**业务 API 层**:
- 按业务模块组织
- 定义请求函数
- 管理 URL 路径

**基础 API 层**:
- 封装 axios 实例
- 统一拦截器
- 错误处理

---

## 2. 目录结构

### 2.1 标准结构

```
src/api/
├── axios/                    # axios 封装
│   ├── index.ts             # 导出 request 方法
│   └── interceptors.ts      # 拦截器配置
├── urls/                     # URL 管理
│   └── modules/             # 按业务模块组织
│       ├── contract.ts      # 合同相关 API
│       ├── user.ts          # 用户相关 API
│       └── order.ts         # 订单相关 API
└── services/                 # 业务服务（可选）
    ├── contractService.ts   # 合同业务服务
    └── userService.ts       # 用户业务服务
```

### 2.2 文件组织原则

**按业务模块划分**:
```
✅ 正确
src/api/urls/modules/
├── contract.ts      // 所有合同相关 API
├── user.ts          // 所有用户相关 API
├── order.ts         // 所有订单相关 API
└── approval.ts      // 所有审批相关 API

❌ 错误
src/api/
├── contractList.ts  // 不应该按功能细分
├── contractDetail.ts
├── userList.ts
└── userDetail.ts
```

---

## 3. 请求封装

### 3.1 Axios 实例配置

```typescript
// src/api/axios/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { IApiResponse } from '@/interface/api'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<IApiResponse>) => {
    const res = response.data
    
    // 业务错误处理
    if (res.code !== 200) {
      // 显示错误提示
      ElMessage.error(res.message || '请求失败')
      
      // 特殊错误码处理（如 401 未登录）
      if (res.code === 401) {
        // 跳转登录
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  (error) => {
    // HTTP 错误处理
    let message = '网络错误'
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = error.response.data?.message || message
      }
    } else if (error.request) {
      message = '网络超时，请重试'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

/**
 * 统一请求方法
 */
export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    service.request(config)
      .then((res) => {
        resolve(res.data as T)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default service
```

### 3.2 使用示例

```typescript
// ❌ 错误：直接在组件中使用 axios
import axios from 'axios'

const getUserList = () => {
  return axios.get('/api/user/list')
}

// ✅ 正确：使用封装的 request 方法
import { request } from '@/api/axios'

export const getUserList = (params: IUserParams) => {
  return request<IUserListResponse>({
    url: '/user/list',
    method: 'get',
    params
  })
}
```

---

## 4. 接口定义规范

### 4.1 模块化组织

```typescript
// src/api/urls/modules/contract.ts
import { request } from '@/api/axios'
import type { 
  IContract, 
  IContractParams, 
  IContractListResponse 
} from '@/interface/contract'

/**
 * 获取合同列表
 */
export function getContractList(params: IContractParams) {
  return request<IContractListResponse>({
    url: '/contract/list',
    method: 'get',
    params
  })
}

/**
 * 获取合同详情
 * @param id - 合同 ID
 */
export function getContractDetail(id: number) {
  return request<IContract>({
    url: `/contract/detail/${id}`,
    method: 'get'
  })
}

/**
 * 创建合同
 * @param data - 合同数据
 */
export function createContract(data: IContractCreateParams) {
  return request<IContract>({
    url: '/contract/create',
    method: 'post',
    data
  })
}

/**
 * 更新合同
 * @param id - 合同 ID
 * @param data - 合同数据
 */
export function updateContract(id: number, data: IContractUpdateParams) {
  return request<IContract>({
    url: `/contract/update/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除合同
 * @param id - 合同 ID
 */
export function deleteContract(id: number) {
  return request<void>({
    url: `/contract/delete/${id}`,
    method: 'delete'
  })
}
```

### 4.2 URL 管理

**方式一：集中管理**
```typescript
// src/api/urls/modules/contract.ts
const CONTRACT_URLS = {
  LIST: '/contract/list',
  DETAIL: '/contract/detail',
  CREATE: '/contract/create',
  UPDATE: '/contract/update',
  DELETE: '/contract/delete'
} as const

export function getContractList(params: IContractParams) {
  return request<IContractListResponse>({
    url: CONTRACT_URLS.LIST,
    method: 'get',
    params
  })
}
```

**方式二：直接使用字符串**
```typescript
// 简单场景可直接写 URL 字符串
export function getContractDetail(id: number) {
  return request<IContract>({
    url: `/contract/detail/${id}`,
    method: 'get'
  })
}
```

---

## 5. 参数和响应类型

### 5.1 接口定义位置

**所有类型定义在 `src/interface/` 目录下**:

```typescript
// src/interface/contract.ts
import type { IPageParams, IPageResponse } from './common'

/**
 * 合同接口
 */
export interface IContract {
  id: number
  contractNo: string
  contractName: string
  partyA: string
  partyB: string
  amount: number
  signDate: string
  status: 'draft' | 'active' | 'expired' | 'terminated'
  createTime: string
  updateTime: string
}

/**
 * 合同列表查询参数
 */
export interface IContractParams extends IPageParams {
  contractNo?: string
  contractName?: string
  status?: string
  startDate?: string
  endDate?: string
}

/**
 * 合同列表响应
 */
export interface IContractListResponse extends IPageResponse<IContract> {
  list: IContract[]
  total: number
}

/**
 * 合同创建参数
 */
export interface IContractCreateParams {
  contractNo: string
  contractName: string
  partyA: string
  partyB: string
  amount: number
  signDate: string
}

/**
 * 合同更新参数
 */
export interface IContractUpdateParams extends Partial<IContractCreateParams> {
  id: number
  status?: 'draft' | 'active' | 'expired' | 'terminated'
}
```

### 5.2 通用类型

```typescript
// src/interface/common.ts

/**
 * 分页参数
 */
export interface IPageParams {
  pageNum: number
  pageSize: number
}

/**
 * 分页响应
 */
export interface IPageResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

/**
 * API 响应基础结构
 */
export interface IApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 上传文件响应
 */
export interface IUploadResponse {
  url: string
  fileName: string
  fileSize: number
}
```

### 5.3 在组件中使用

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContractList } from '@/api/urls/modules/contract'
import type { IContract, IContractParams } from '@/interface/contract'

const loading = ref(false)
const contractList = ref<IContract[]>([])
const queryParams = ref<IContractParams>({
  pageNum: 1,
  pageSize: 20,
  contractName: ''
})

const loadContractList = async () => {
  loading.value = true
  try {
    const res = await getContractList(queryParams.value)
    contractList.value = res.list
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadContractList()
})
</script>
```

---

## 6. 错误处理

### 6.1 统一错误处理

**在 axios 拦截器中统一处理**:

```typescript
// src/api/axios/interceptors.ts

// 响应拦截器已统一处理错误
// 组件中只需捕获具体业务需要的错误

try {
  await createContract(formData)
  ElMessage.success('创建成功')
} catch (error) {
  // 错误已在拦截器显示
  // 这里可以处理特殊业务逻辑
  console.error('创建失败:', error)
}
```

### 6.2 自定义错误处理

**特殊场景需要单独处理**:

```typescript
export async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const res = await request<IUploadResponse>({
      url: '/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return res
  } catch (error) {
    // 自定义错误处理
    ElMessage.error('文件上传失败，请检查文件大小和格式')
    throw error
  }
}
```

### 6.3 取消请求

```typescript
import { CancelTokenSource } from 'axios'

let cancelTokenSource: CancelTokenSource | null = null

export function searchContract(keyword: string) {
  // 取消上一个请求
  if (cancelTokenSource) {
    cancelTokenSource.cancel('重复请求，取消上一个请求')
  }
  
  // 创建新的 cancel token
  cancelTokenSource = axios.CancelToken.source()
  
  return request<IContract[]>({
    url: '/contract/search',
    method: 'get',
    params: { keyword },
    cancelToken: cancelTokenSource.token
  })
}

// 组件卸载时取消所有请求
onUnmounted(() => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('组件卸载，取消请求')
  }
})
```

---

## 7. 最佳实践

### 7.1 防重复提交

```typescript
// 使用请求锁
const submitLock = ref(false)

export async function submitContract(data: IContractCreateParams) {
  if (submitLock.value) {
    ElMessage.warning('请勿重复提交')
    return
  }
  
  submitLock.value = true
  try {
    const res = await createContract(data)
    return res
  } finally {
    submitLock.value = false
  }
}
```

### 7.2 请求缓存

```typescript
// 简单缓存策略
const cache = new Map<string, any>()
const CACHE_TIME = 5 * 60 * 1000 // 5 分钟

export async function getContractDetail(id: number) {
  const cacheKey = `contract:${id}`
  const cached = cache.get(cacheKey)
  
  // 检查缓存是否有效
  if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
    return cached.data
  }
  
  // 请求新数据
  const data = await request<IContract>({
    url: `/contract/detail/${id}`,
    method: 'get'
  })
  
  // 更新缓存
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  })
  
  return data
}
```

### 7.3 批量请求

```typescript
import { all } from 'axios'

export async function getContractDashboard() {
  const [contractList, statistics, notifications] = await Promise.all([
    getContractList({ pageNum: 1, pageSize: 10 }),
    getStatistics(),
    getNotifications()
  ])
  
  return {
    contractList,
    statistics,
    notifications
  }
}
```

### 7.4 轮询请求

```typescript
let pollingTimer: ReturnType<typeof setTimeout> | null = null

export function startPolling(callback: () => void, interval = 5000) {
  const poll = async () => {
    try {
      await callback()
    } finally {
      pollingTimer = setTimeout(poll, interval)
    }
  }
  
  poll()
}

export function stopPolling() {
  if (pollingTimer) {
    clearTimeout(pollingTimer)
    pollingTimer = null
  }
}

// 使用
onMounted(() => {
  startPolling(loadStatus, 5000)
})

onUnmounted(() => {
  stopPolling()
})
```

### 7.5 下载文件

```typescript
export async function downloadContract(id: number) {
  const blob = await request<Blob>({
    url: `/contract/download/${id}`,
    method: 'get',
    responseType: 'blob'
  })
  
  // 创建下载链接
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `合同_${id}.pdf`
  link.click()
  
  // 释放 URL
  window.URL.revokeObjectURL(url)
}
```

---

## 8. 安全规范

### 8.1 Token 管理

```typescript
// 请求拦截器自动添加 token
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    // 检查 token 是否过期
    const expiry = localStorage.getItem('token_expiry')
    if (expiry && Date.now() > Number(expiry)) {
      // Token 过期，清除并跳转登录
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
      window.location.href = '/login'
      return Promise.reject(new Error('Token 已过期'))
    }
    
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})
```

### 8.2 敏感数据处理

```typescript
// ❌ 错误：硬编码敏感信息
const API_KEY = 'sk-1234567890abcdef'

// ✅ 正确：使用环境变量
const API_KEY = import.meta.env.VITE_API_KEY

// ✅ 正确：后端获取，不在前端存储
```

### 8.3 XSS防护

```typescript
// 对用户输入进行转义
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// API请求前过滤
export function searchUser(keyword: string) {
  const safeKeyword = escapeHtml(keyword)
  return request({
    url: '/user/search',
    params: { keyword: safeKeyword }
  })
}
```

---

## 9. 性能优化

### 9.1 请求合并

```typescript
// 将多个小请求合并为一个大请求
export async function getDashboardData() {
  return request<IDashboardData>({
    url: '/dashboard/data',
    method: 'post',
    data: {
      includeContracts: true,
      includeStatistics: true,
      includeNotifications: true
    }
  })
}
```

### 9.2 懒加载

```typescript
// 路由懒加载
const routes = [
  {
    path: '/contract',
    component: () => import('@/views/contract/index.vue'),
    children: [
      {
        path: 'list',
        component: () => import('@/views/contract/contractList/index.vue')
      }
    ]
  }
]
```

### 9.3 预加载

```typescript
// 空闲时预加载数据
export function preloadContractList() {
  // 使用 requestIdleCallback
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      getContractList({ pageNum: 1, pageSize: 20 })
    })
  } else {
    // 降级处理
    setTimeout(() => {
      getContractList({ pageNum: 1, pageSize: 20 })
    }, 1000)
  }
}
```

---

## 10. 常见问题

### Q1: 什么时候使用 services 层？

**A**: 当业务逻辑复杂，需要组合多个 API 调用时使用 services 层：

```typescript
// src/api/services/contractService.ts
export class ContractService {
  async createAndNotify(data: IContractCreateParams) {
    // 1. 创建合同
    const contract = await createContract(data)
    
    // 2. 发送通知
    await sendNotification({
      userId: data.partyAId,
      type: 'CONTRACT_CREATED',
      contractId: contract.id
    })
    
    // 3. 记录日志
    await logAction('CREATE_CONTRACT', contract.id)
    
    return contract
  }
}
```

### Q2: 如何处理大文件上传？

**A**: 使用分片上传：

```typescript
export async function uploadLargeFile(file: File, chunkSize = 5 * 1024 * 1024) {
  const chunks = Math.ceil(file.size / chunkSize)
  const fileId = generateFileId()
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    await request({
      url: '/upload/chunk',
      method: 'post',
      data: {
        fileId,
        chunk,
        index: i,
        chunks
      }
    })
  }
  
  // 合并分片
  await request({
    url: '/upload/merge',
    method: 'post',
    data: { fileId, chunks }
  })
}
```

### Q3: 如何调试 API请求？

**A**: 使用 axios 日志：

```typescript
// 开发环境开启日志
if (import.meta.env.DEV) {
  service.interceptors.request.use((config) => {
    console.log('[Request]', config.method, config.url, config.params || config.data)
    return config
  })
  
  service.interceptors.response.use((response) => {
    console.log('[Response]', response.config.url, response.data)
    return response
  }, (error) => {
    console.error('[Error]', error.config.url, error)
    return Promise.reject(error)
  })
}
```

---

**版本**: v1.0  
**创建日期**: 2026-03-09  
**维护者**: DBOMS 团队

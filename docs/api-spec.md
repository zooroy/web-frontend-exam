# API Specification

> **Framework**: Next.js (App Router)
> **資料來源**: 靜態 mock 資料，放置於 `app/api/` 對應的 Route Handlers
> **實作位置**：Next.js Route Handlers，對應路徑在 `app/api/` 目錄下  
> **回應格式**：`application/json`  
> **Base Path**: `/api/v1`

---

## 目錄

- [專案結構](#專案結構)
- [資料來源說明](#資料來源說明)
- [API 端點](#api-端點)
  - [GET /api/v1/jobs](#1-get-apiv1jobs)
  - [GET /api/v1/jobs/:id](#2-get-apiv1jobsid)
  - [GET /api/v1/educationLevelList](#3-get-apiv1educationlevellist)
  - [GET /api/v1/salaryLevelList](#4-get-apiv1salarylevellist)
- [共用型別定義](#共用型別定義)
- [錯誤處理規範](#錯誤處理規範)

---

## 專案結構

```
app/
└── api/
    └── v1/
        ├── jobs/
        │   ├── route.ts                  ← GET /api/v1/jobs
        │   └── [id]/
        │       └── route.ts              ← GET /api/v1/jobs/:id
        ├── educationLevelList/
        │   └── route.ts                  ← GET /api/v1/educationLevelList
        └── salaryLevelList/
            └── route.ts                  ← GET /api/v1/salaryLevelList

data/
├── jobList.js                            ← 工作 mock 資料
├── educationList.js                      ← 教育程度 mock 資料
└── salaryList.js                         ← 薪資範圍 mock 資料
```

> **注意**：`data/` 資料夾放在專案根目錄（與 `app/` 同層），不放進 `app/` 內，避免被 Next.js Router 誤判為路由。

---

## 資料來源說明

### jobList.js

每筆工作資料的原始欄位：

| 欄位           | 型別       | 說明                         |
| -------------- | ---------- | ---------------------------- |
| `companyName`  | `string`   | 公司名稱                     |
| `jobTitle`     | `string`   | 職位名稱                     |
| `educationId`  | `number`   | 對應 educationList 的 id     |
| `salaryId`     | `number`   | 對應 salaryList 的 id        |
| `preview`      | `string`   | 職缺摘要（一行文字）         |
| `companyPhoto` | `string[]` | 公司圖片 URL 陣列，固定 5 張 |
| `description`  | `string`   | 職缺完整描述（HTML 格式）    |

> ⚠️ 原始資料**無 `id` 欄位**，Route Handler 需在讀取時動態注入 `id`（以陣列 index + 1 為準，型別為 `number`）。

---

## API 端點

---

### 1. GET /api/v1/jobs

**描述**：取得工作列表，支援分頁與篩選。

**Route Handler 路徑**：`app/api/v1/jobs/route.ts`

#### Query Parameters

| 參數              | 型別     | 必填 | 說明                                       |
| ----------------- | -------- | ---- | ------------------------------------------ |
| `per_page`        | `number` | 否   | 每頁筆數，預設 `10`                        |
| `page`            | `number` | 否   | 當前頁數，從 `1` 開始，預設 `1`            |
| `company_name`    | `string` | 否   | 依公司名稱模糊搜尋（contains，不分大小寫） |
| `education_level` | `number` | 否   | 依教育程度 id 精確篩選                     |
| `salary_level`    | `number` | 否   | 依薪資範圍 id 精確篩選                     |

#### 篩選邏輯（實作規範）

```
1. 從 jobList 取出全部資料，並注入 id（index + 1）
2. 若有 company_name → 過濾 companyName.includes(company_name)（不分大小寫）
3. 若有 education_level → 過濾 educationId === Number(education_level)
4. 若有 salary_level → 過濾 salaryId === Number(salary_level)
5. 計算 total（過濾後總筆數）
6. 依 page / per_page 切割分頁後回傳
```

#### Response

**HTTP Status**: `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "companyName": "立刻科技",
      "jobTitle": "資深前端工程師",
      "educationId": 4,
      "salaryId": 3,
      "preview": "招募經驗豐富的前端工程師，共創卓越網頁體驗！"
    }
  ],
  "total": 1
}
```

> ⚠️ 列表回應**不包含** `companyPhoto` 與 `description`，這兩個欄位僅在單一工作 API 回傳。

#### Response Schema

```typescript
{
  data: {
    id: number;
    companyName: string;
    jobTitle: string;
    educationId: number;
    salaryId: number;
    preview: string;
  }
  [];
  total: number;
}
```

---

### 2. GET /api/v1/jobs/:id

**描述**：取得單一工作的完整資訊。

**Route Handler 路徑**：`app/api/v1/jobs/[id]/route.ts`

#### Path Parameters

| 參數 | 型別     | 必填 | 說明                              |
| ---- | -------- | ---- | --------------------------------- |
| `id` | `number` | 是   | 工作 id（對應 jobList index + 1） |

#### 實作規範

```
1. 將 params.id 轉為 Number，以 (id - 1) 取得 jobList 陣列對應項目
2. 若超出範圍或 NaN → 回傳 404
3. 回傳完整資料，包含注入的 id
```

#### Response

**HTTP Status**: `200 OK`

```json
{
  "id": 6,
  "companyName": "餐飲樂活",
  "jobTitle": "廚師助手",
  "educationId": 1,
  "salaryId": 2,
  "preview": "招募熱愛烹飪的廚師助手，共同營造美味料理的魔法！",
  "companyPhoto": [
    "https://picsum.photos/250/150",
    "https://picsum.photos/250/150",
    "https://picsum.photos/250/150",
    "https://picsum.photos/250/150",
    "https://picsum.photos/250/150"
  ],
  "description": "<h1>貨運操作員</h1>..."
}
```

#### Response Schema

```typescript
{
  id: number;
  companyName: string;
  jobTitle: string;
  educationId: number;
  salaryId: number;
  preview: string;
  companyPhoto: string[];   // 固定 5 張圖片 URL
  description: string;      // HTML 字串
}
```

#### Error Response（id 不存在）

**HTTP Status**: `404 Not Found`

```json
{
  "message": "Job not found"
}
```

---

### 3. GET /api/v1/educationLevelList

**描述**：取得教育程度選項清單。

**Route Handler 路徑**：`app/api/v1/educationLevelList/route.ts`

#### Query Parameters

無

#### 實作規範

```
直接回傳 educationList 全部資料，無分頁、無篩選。
```

#### Response

**HTTP Status**: `200 OK`

```json
[
  { "id": 1, "label": "國小" },
  { "id": 2, "label": "國中" },
  { "id": 3, "label": "高中" },
  { "id": 4, "label": "大學" },
  { "id": 5, "label": "碩士" },
  { "id": 6, "label": "博士" }
]
```

#### Response Schema

```typescript
{
  id: number;
  label: string;
}
[];
```

---

### 4. GET /api/v1/salaryLevelList

**描述**：取得薪資範圍選項清單。

**Route Handler 路徑**：`app/api/v1/salaryLevelList/route.ts`

#### Query Parameters

無

#### 實作規範

```
直接回傳 salaryList 全部資料，無分頁、無篩選。
```

#### Response

**HTTP Status**: `200 OK`

```json
[
  { "id": 1, "label": "待遇面議" },
  { "id": 2, "label": "月薪 40,000 ~ 60,000 元" },
  { "id": 3, "label": "月薪 70,000 ~ 100,000 元" },
  { "id": 4, "label": "年薪 800,000 ~ 1,000,000 元" },
  { "id": 5, "label": "年薪 800,000 ~ 1,500,000 元" },
  { "id": 6, "label": "年薪 1,500,000 ~ 2,000,000 元" },
  { "id": 7, "label": "年薪 2,000,000 ~ 2,500,000 元" }
]
```

#### Response Schema

```typescript
{
  id: number;
  label: string;
}
[];
```

---

## 共用型別定義

建議統一放在 `types/api.ts`：

```typescript
// types/api.ts

export interface EducationItem {
  id: number;
  label: string;
}

export interface SalaryItem {
  id: number;
  label: string;
}

export interface JobListItem {
  id: number;
  companyName: string;
  jobTitle: string;
  educationId: number;
  salaryId: number;
  preview: string;
}

export interface JobDetail extends JobListItem {
  companyPhoto: string[];
  description: string;
}

export interface JobListResponse {
  data: JobListItem[];
  total: number;
}
```

---

## 錯誤處理規範

所有 Route Handler 皆須包在 `try/catch` 內，錯誤統一格式如下：

| HTTP Status                 | 使用時機                                 | Response Body                               |
| --------------------------- | ---------------------------------------- | ------------------------------------------- |
| `200 OK`                    | 請求成功                                 | 各端點定義的 schema                         |
| `400 Bad Request`           | Query 參數格式錯誤（如 page 傳入非數字） | `{ "message": "Invalid query parameters" }` |
| `404 Not Found`             | 找不到指定資源                           | `{ "message": "Job not found" }`            |
| `500 Internal Server Error` | 未預期錯誤                               | `{ "message": "Internal server error" }`    |

### Route Handler 模板

```typescript
// app/api/v1/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // 實作邏輯
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

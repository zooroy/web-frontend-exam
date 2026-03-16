# web-exam-v2

以 Next.js 16 App Router 建構的前端職缺展示網站。此專案採用 Server Components 優先策略，首頁透過 URL state 驅動條件查詢、分頁與職缺詳細資訊彈窗，資料來源目前為專案內的 mock data 與 Route Handlers。

## 技術棧

- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Framer Motion
- Vitest
- Playwright

## 如何執行此專案

### 1. 安裝依賴

本專案目前有 `pnpm-lock.yaml`，建議使用 `pnpm`。

```bash
pnpm install
```

### 2. 啟動開發環境

```bash
pnpm dev
```

預設會啟動在 [http://localhost:3000](http://localhost:3000)。

### 3. 建置正式版本

```bash
pnpm build
pnpm start
```

### 4. 常用檢查指令

```bash
pnpm lint
pnpm test
pnpm test:e2e
```

## 專案架構

```text
.
├── app/                      # App Router 頁面與 API routes
│   ├── api/v1/               # mock API
│   ├── layout.tsx            # Root layout、字體與 metadata
│   ├── page.tsx              # 首頁 Server Component 入口
│   ├── loading.tsx           # route loading UI
│   └── error.tsx             # route error boundary
├── components/
│   ├── common/               # 可跨頁共用元件
│   ├── home/                 # 首頁專用元件
│   ├── icons/                # icon primitives
│   └── ui/                   # shadcn/ui 元件
├── data/                     # mock 資料來源
├── lib/
│   ├── api/                  # server fetch helpers 與 API access
│   └── utils/                # 純函式與 URL state 解析
├── tests/
│   ├── e2e/                  # Playwright
│   └── unit/                 # Vitest
├── types/                    # 全域型別
└── public/                   # 靜態資源
```

## 核心邏輯說明

### 1. 首頁資料流

首頁入口在 `app/page.tsx`，是 Server Component。

處理流程如下：

1. 透過 `headers()` 取得 request headers。
2. 透過 `searchParams` 解析目前查詢條件。
3. 使用 `getHomePageRequestModel()` 判斷目前是 `desktop` 或 `mobile`，並整理出 `searchState`。
4. 平行取得：
   - 學歷列表 `getEducationList()`
   - 薪資列表 `getSalaryList()`
   - 若 URL 帶有 `detail`，則取職缺詳細資料 `getJobDetail()`
5. 將資料交給 `HomePageShell` 組裝畫面。

### 2. 查詢條件與 URL state

專案以 URL query string 作為主要互動狀態來源，邏輯集中在 `lib/utils/jobSearchParams.ts`。

目前使用的查詢參數：

- `company_name`: 公司名稱搜尋
- `education_level`: 學歷篩選
- `salary_level`: 薪資篩選
- `page`: 分頁
- `detail`: 要開啟的職缺詳細頁 id

這樣的設計有幾個效果：

- 條件搜尋、分頁、開啟詳細資訊都可被分享與重整保留
- 首頁主要資料仍由 Server Component 驅動
- Client Component 只負責互動與更新 URL，不直接重建主要資料流

### 3. Server Component 與 Client Component 分工

#### Server Components

- `app/page.tsx`
- `components/home/HomePageShell.tsx`
- `components/home/JobResultsSection.tsx`

職責：

- 解析 request 與 URL state
- 呼叫 server-side API helper
- 決定首屏資料與列表內容
- 透過 `Suspense` 包住職缺列表區塊

#### Client Components

- `components/home/JobFilters.tsx`
- `components/home/DetailDialogController.tsx`
- `components/home/DetailDialog.tsx`
- `components/home/DetailCarousel.tsx`

職責：

- 處理輸入、點擊、彈窗開關、動畫
- 使用 `router.push()` 或其他 client-side navigation 更新 URL
- 接收 Server Component 傳入的初始資料，不在 client 端重抓主要列表

### 4. 職缺列表渲染邏輯

`components/home/JobResultsSection.tsx` 是 async Server Component，負責：

1. 根據裝置模式決定每頁筆數
   - desktop: 6 筆
   - mobile: 4 筆
2. 呼叫 `getJobList()` 取得目前頁面的職缺清單
3. 將學歷與薪資清單轉成 label map，供卡片顯示
4. 產生每張卡片的詳細資訊連結與分頁連結
5. 無資料時顯示 empty state

`HomePageShell` 會用查詢條件組成 `Suspense key`，讓使用者調整篩選條件或切頁時，列表區塊能正確顯示 skeleton 並重新取資料。

### 5. API 與 mock data 關係

目前專案沒有外部 API，資料都來自 `data/`。

- `data/jobList.js`: 職缺原始資料
- `data/educationList.js`: 學歷選項
- `data/salaryList.js`: 薪資選項

App Router API routes 負責將 mock data 包成正式 API 介面：

- `app/api/v1/jobs/route.ts`
  - 支援公司名稱、學歷、薪資、分頁查詢
- `app/api/v1/jobs/[id]/route.ts`
  - 回傳單筆職缺詳細資訊
- `app/api/v1/educationLevelList/route.ts`
- `app/api/v1/salaryLevelList/route.ts`

Server Component 不直接讀 `data/*`，而是透過 `lib/api/jobs.server.ts` 呼叫上述 API route，維持資料存取邊界一致。

### 6. `lib/api` 的角色

`lib/api/server.ts`

- `buildServerApiUrl()`: 根據 request headers 組出完整 API URL
- `fetchServerJson()`: 統一 server-side fetch 與錯誤處理

`lib/api/jobs.server.ts`

- `getJobList()`: 取得職缺列表
- `getJobDetail()`: 取得單筆職缺
- `getEducationList()`: 取得學歷參考資料
- `getSalaryList()`: 取得薪資參考資料

其中學歷與薪資列表透過 `unstable_cache` 搭配 `revalidate` 做快取，避免靜態參考資料重複抓取。

## 主要頁面互動流程

### 條件搜尋

1. 使用者在 `JobFilters` 輸入條件
2. `JobFilters` 使用 `createJobSearchParams()` 產生新的 query string
3. 透過 `router.push()` 更新 URL
4. Next.js 重新觸發 Server Component render
5. `JobResultsSection` 依新條件重新取得資料

### 查看詳細資訊

1. 使用者點擊職缺卡片上的「查看細節」
2. URL 帶入 `detail=<jobId>`
3. `app/page.tsx` 偵測到 `detailId` 後呼叫 `getJobDetail()`
4. `DetailDialogController` 依據 `open` 與 `detailJob` 顯示彈窗

### 分頁

1. `JobResultsSection` 依 `jobs.total` 計算總頁數
2. `Pagination` 接收每一頁對應的 href
3. 使用者切頁後，URL 中的 `page` 更新
4. Server Component 重新抓取對應頁面的資料

## 測試

目前專案已配置：

- `tests/unit/`: 純函式與 API route 單元測試
- `tests/e2e/`: 首頁 smoke test 與對話框互動流程

執行方式：

```bash
pnpm test
pnpm test:e2e
```

## 補充

- 字體於 `app/layout.tsx` 使用 `next/font/local` 載入
- 首頁 metadata 目前設定為 `HeeLoo Jobs`
- 若後續改為串接真實 API，建議優先保留現有 `app/api/v1/*` 與 `lib/api/*.ts` 的分層方式

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

本專案使用 `pnpm`。

```bash
pnpm install
```

### 2. 啟動開發環境

```bash
pnpm dev
```

預設開發網址為 [http://localhost:3000](http://localhost:3000)。

### 3. 建置與啟動正式版本

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

補充說明：

- `pnpm test` 會執行 Vitest 單元測試
- `pnpm test:e2e` 會執行 Playwright E2E，並依 `playwright.config.ts` 先建置再啟動正式 server

## 專案架構、邏輯說明

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
- `JobFilters` 會在條件與目前 URL 完全一致時直接略過 `router.push()`，避免不必要的重新查詢

### 3. Server Component 與 Client Component 分工

#### Server Components

- `app/page.tsx`
- `components/home/HomePageShell.tsx`
- `components/home/JobResultsSection.tsx`

職責：

- 解析 request 與 URL state
- 呼叫 server-side API helper
- 決定首屏資料與列表內容
- 透過 `Suspense` 為職缺列表區塊提供 fallback

#### Client Components

- `components/home/JobFilters.tsx`
- `components/home/DetailTriggerLink.tsx`
- `components/home/DetailDialogController.tsx`
- `components/home/DetailDialog.tsx`
- `components/home/DetailCarousel.tsx`
- `components/home/HeroSection.tsx`

職責：

- 處理輸入、點擊、彈窗開關、動畫
- 使用 `router.push()` 或其他 client-side navigation 更新 URL
- 在必要處補上 client-side 體驗優化，例如 detail 預抓與 modal loading 過渡
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

`HomePageShell` 目前保留 `Suspense fallback`，但不再額外用查詢條件強制重建整個結果區塊，以減少切頁時的視覺跳動。

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

`lib/api/jobs.client.ts`

- `preloadJobDetail()`: 在 client 端預抓單筆職缺詳細資料
- `getCachedJobDetail()` / `setCachedJobDetail()`: 管理記憶體中的 detail cache

這一層只服務於 detail modal 的體感優化，不取代 Server Component 的主資料流。

## 主要頁面互動流程

### 條件搜尋

1. 使用者在 `JobFilters` 輸入條件
2. `JobFilters` 使用 `createJobSearchParams()` 產生新的 query string
3. 若目標 URL 與目前 URL 相同，直接略過，不做新的 navigation
4. 否則透過 `router.push()` 更新 URL
5. Next.js 重新觸發 Server Component render
6. `JobResultsSection` 依新條件重新取得資料

### 查看詳細資訊

1. 使用者點擊職缺卡片上的「查看細節」
2. `DetailTriggerLink` 會先送出 pending open 事件，讓 modal 立即打開 loading UI
3. URL 帶入 `detail=<jobId>`
4. `app/page.tsx` 偵測到 `detailId` 後呼叫 `getJobDetail()`
5. `DetailDialogController` 會優先使用 server 傳入的 detail，必要時可搭配 client cache / preload 縮短等待
6. `DetailDialog` 內部使用 skeleton 與分區進場動畫處理內容過渡

補充：

- 點擊 modal 外部區域不會關閉 dialog
- 關閉流程以明確的關閉按鈕為主

### 分頁

1. `JobResultsSection` 依 `jobs.total` 計算總頁數
2. `Pagination` 接收每一頁對應的 href
3. 使用者切頁後，URL 中的 `page` 更新
4. Server Component 重新抓取對應頁面的資料
5. `scroll: false` 會避免 Next.js 主動將頁面捲到頂部

### 7. 首屏 Hero 視覺邏輯

`components/home/HeroSection.tsx` 為 client component，負責首頁視覺與互動動畫：

- 背景圖先顯示
- `character-white`、`character`、左右眼圖片載入完成後，人物層再一起淡入
- logo 具有一次性進場動畫，之後維持輕微循環縮放
- 左右眼會依滑鼠移動做小幅跟隨
- 若使用者偏好 reduced motion，動畫會降級或停用

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

## 專案遇到的困難、問題及解決方法

本專案在實作過程中，最大的挑戰不是單一功能，而是如何在同一套網站佈局策略下，同時兼顧：

- 良好的 Core Web Vitals
- 不破壞 SEO 的資料流
- 保持互動操作時的使用者體感

### 1. 困難：Server-driven 架構下，互動容易影響體感

首頁採用 Next.js App Router 與 Server Components，主要資料流由 URL state 驅動。這樣的好處是：

- 首頁內容可由 server 直接輸出，對 SEO 較友善
- URL 可分享、可重整、可還原狀態
- 查詢條件、分頁與詳細資訊彈窗都能保持一致的狀態來源

但同時也帶來一個實際困難：

- 只要 query string 改變，就可能重新觸發 Server Component render
- 若處理不慎，容易造成 loading 過重、畫面跳動、動畫重播或互動延遲

### 2. 問題：如何讓 Web Vitals 維持良好

在版面與互動設計上，主要關注的是 LCP、CLS 與操作體感：

- Hero 圖片使用 `next/image`
- 人物圖層統一在資源 ready 後再一起進場，避免一張一張出現造成視覺不穩
- modal 與列表 loading 改用一致的 skeleton，避免多層 loading UI
- 搜尋條件未變時不再重送 navigation，避免無意義的重新查詢與重新渲染

這些調整的目的，是避免為了「有 loading 效果」而犧牲實際穩定度。

### 3. 解決方法：以「Server 真值 + Client 過渡層」作為佈局策略

本專案最後採取的核心解法是：

#### Server 端負責

- 首頁首屏內容與列表資料
- URL state 對應的查詢與 detail 狀態
- 可被搜尋引擎穩定取得的 HTML 結果

#### Client 端負責

- 條件輸入、分頁點擊、彈窗開關
- loading skeleton 與細節動畫
- detail 預抓與 cache，改善 modal 體感
- 避免無效 navigation 與重複請求，例如：點擊重複的篩選條件

這樣的分工讓專案可以在不放棄 SEO 的情況下，把互動體驗補到可接受甚至不錯的程度。

### 4. 目前的取捨結論

本專案的佈局與資料策略，不是單純追求「每次互動都完全 client-side」，而是明確做出以下取捨：

- 主要內容維持 server render，確保 SEO 與資料一致性
- 互動過渡由 client 補強，降低等待感
- 優先避免整塊畫面重建，而不是強行讓每次切換都顯示大型 loading
- 在 Web Vitals、SEO、互動流暢度之間，以整體穩定為優先

這也是目前整個網站版面策略的核心方向。

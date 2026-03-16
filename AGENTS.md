# AGENTS.md

> 本文件為 Codex（AI coding agent）的行為規範與專案指引。
> 所有 AI agent 在操作本專案時，**必須完整閱讀並嚴格遵守**本文件的所有規範。

---

## 目錄

1. [專案概覽](#1-專案概覽)
2. [技術棧](#2-技術棧)
3. [專案結構](#3-專案結構)
4. [Code Style 規範](#4-code-style-規範)
5. [元件撰寫規範](#5-元件撰寫規範)
6. [資料獲取規範](#6-資料獲取規範)
7. [樣式規範](#7-樣式規範)
8. [動畫規範](#8-動畫規範)
9. [Web Vitals 規範](#9-web-vitals-規範)
10. [測試規範](#10-測試規範)
11. [TypeScript 規範](#11-typescript-規範)
12. [禁止事項](#12-禁止事項)
13. [Git 規範](#13-git-規範)

---

## 1. 專案概覽

本專案為 Next.js App Router 架構，採用 Server Components 優先策略，僅在必要時降級為 Client Components。目標是在保持高開發體驗的前提下，確保所有頁面的 Core Web Vitals 達到 Google「Good」門檻。

---

## 2. 技術棧

| 層級                | 技術                      | 版本              |
| ------------------- | ------------------------- | ----------------- |
| Framework           | Next.js                   | 16.x (App Router) |
| Language            | TypeScript                | 5.x (strict mode) |
| Styling             | Tailwind CSS              | 4.x               |
| UI Components       | shadcn/ui                 | latest            |
| Server/Client State | Next.js fetch + URL state | built-in          |
| Animation           | Framer Motion             | latest            |
| Testing             | 尚未建立測試工具鏈        | —                 |
| Linter              | ESLint (Airbnb config)    | latest            |
| Formatter           | Prettier                  | latest            |

---

## 3. 專案結構

```
├── app/                          # Next.js App Router 根目錄
│   ├── api/
│   │   └── v1/                   # Route Handlers
│   │       ├── educationLevelList/
│   │       ├── jobs/
│   │       └── salaryLevelList/
│   ├── error.tsx                 # Route error boundary（'use client'）
│   ├── globals.css               # 全域樣式、design tokens、typography utilities
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Route-level loading fallback
│   └── page.tsx                  # 首頁 Server Component
│
├── components/
│   ├── ui/                       # shadcn/ui 原始元件（禁止直接修改）
│   ├── common/                   # 跨頁共用元件
│   │   ├── BrandButton.tsx
│   │   ├── FilterSelect.tsx
│   │   └── FilterTextField.tsx
│   ├── home/                     # 首頁專用元件
│   │   ├── HeroSection.tsx
│   │   ├── HomePageShell.tsx
│   │   ├── JobFilters.tsx
│   │   ├── JobResultsSection.tsx
│   │   ├── JobCard.tsx
│   │   ├── Pagination.tsx
│   │   ├── DetailDialog.tsx
│   │   ├── DetailDialogController.tsx
│   │   ├── DetailCarousel.tsx
│   │   └── JobDescription.tsx
│   └── icons/                    # 可跨元件重用的 icon primitives
│
├── data/                         # Mock data source，提供 Route Handlers 使用
│   ├── educationList.js
│   ├── jobList.js
│   └── salaryList.js
│
├── docs/                         # 規格文件
│   ├── api-spec.md
│   └── design-spec.md
│
├── lib/
│   ├── api/                      # API client、fetch helpers
│   ├── utils/                    # 純函式工具
│   └── validations/              # 預留給 schema / validation 擴充
│
├── types/                        # 全域 TypeScript 型別定義
│
└── public/                       # 靜態資源
    └── hero-section/
```

**規則：**

- 每個目錄只做一件事，不跨層混放邏輯
- `components/ui/` 的 shadcn 元件透過 CLI 產生後只封裝，不直接修改原始碼
- 在目前專案規模下，共用元件放在 `components/common/`，首頁專用元件放在 `components/home/`
- `data/` 為 mock data source，`app/api/v1/*` 直接讀取，不額外繞經中介層

---

## 4. Code Style 規範

### 4.1 基礎原則

- **Linter**：ESLint Airbnb config，所有規則必須通過，禁止使用 `// eslint-disable`（除非有文件化的理由）
- **Formatter**：Prettier，儲存時自動格式化
- **Import 順序**（由 `eslint-plugin-import` 強制）：
  1. Node built-ins
  2. External packages
  3. Internal aliases（`@/`）
  4. Relative imports
  5. Type imports（最後）

```typescript
// ✅ 正確的 import 順序
import { cache } from 'react';

import { z } from 'zod';

import { BrandButton } from '@/components/common/BrandButton';
import { getJobList } from '@/lib/api/jobs.server';

import { UserCard } from './UserCard';

import type { User } from '@/types/user';
```

### 4.2 命名規範

| 對象                  | 規範                     | 範例               |
| --------------------- | ------------------------ | ------------------ |
| 元件檔案              | PascalCase               | `UserProfile.tsx`  |
| Hook 檔案             | camelCase，以 `use` 開頭 | `useUserData.ts`   |
| Utility 檔案          | camelCase                | `formatDate.ts`    |
| 型別/介面             | PascalCase               | `type UserProfile` |
| 常數                  | SCREAMING_SNAKE_CASE     | `MAX_RETRY_COUNT`  |
| CSS class（Tailwind） | 遵循 Tailwind 慣例       | —                  |

### 4.3 函式風格

- **優先使用具名函式**（Arrow function 用於 inline callback）
- **元件一律使用 `function` 宣告**，不用 `const Component = () =>`
- 函式長度超過 50 行時應拆分

```typescript
// ✅ 正確
export default function UserProfile({ userId }: UserProfileProps) {
  return <div>...</div>;
}

// ❌ 錯誤
export const UserProfile = ({ userId }: UserProfileProps) => {
  return <div>...</div>;
};
```

---

## 5. 元件撰寫規範

### 5.1 Server Component vs Client Component 決策樹

```
是否需要以下任一項？
  - useState / useReducer
  - useEffect / lifecycle
  - 瀏覽器 API（window、document）
  - 事件處理（onClick 等互動）
  - Framer Motion 動畫
        │
       YES → 加上 'use client'，設計為 Client Component
        │
        NO → 保持為 Server Component（預設，不加任何指令）
```

**原則：將 `'use client'` 邊界盡量推到葉節點（leaf components）。**

### 5.2 Server Component 規範

```typescript
// app/page.tsx
import { Suspense } from 'react';
import { headers } from 'next/headers';

import { HomePageShell } from '@/components/home/HomePageShell';
import { getEducationList, getSalaryList } from '@/lib/api/jobs.server';
import { getHomePageRequestModel } from '@/lib/utils/homePageModel';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const requestHeaders = await headers();
  const resolvedSearchParams = await searchParams;
  const userAgentValue = requestHeaders.get('user-agent') ?? '';
  const { mode, searchState } = getHomePageRequestModel(
    userAgentValue,
    resolvedSearchParams,
  );
  const [educationLevels, salaryLevels] = await Promise.all([
    getEducationList(requestHeaders),
    getSalaryList(requestHeaders),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageShell
        detailJob={null}
        educationLevels={educationLevels}
        headers={requestHeaders}
        initialMode={mode}
        salaryLevels={salaryLevels}
        searchState={searchState}
      />
    </Suspense>
  );
}
```

### 5.3 Client Component 規範

```typescript
'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { BrandButton } from '@/components/common/BrandButton';
import { createJobSearchParams } from '@/lib/utils/jobSearchParams';

interface JobFiltersProps {
  initialCompanyName: string;
}

export function JobFilters({ initialCompanyName }: JobFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialCompanyName);

  function handleSearch() {
    const searchParams = createJobSearchParams({
      companyName,
      page: 1,
    });
    const search = searchParams.toString();

    router.push(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }

  return (
    <BrandButton onClick={handleSearch}>條件搜尋</BrandButton>
  );
}
```

### 5.4 元件 Props 規範

- **一律使用 `interface`** 定義 Props，不用 `type`（除非需要 union）
- Props interface 命名為 `{ComponentName}Props`
- 避免 prop drilling 超過 2 層，改用 Context 或 URL state

---

## 6. 資料獲取規範

### 6.1 Server Component 資料獲取

Server Component 優先透過 `lib/api/*.server.ts` 提供的 `get***` helper 取資料。不要在頁面內重複拼接 API URL。

```typescript
// lib/api/jobs.server.ts
import { unstable_cache } from 'next/cache';

import { buildServerApiUrl, fetchServerJson } from '@/lib/api/server-fetch';

import type { EducationItem, SalaryItem } from '@/types/api';

const getCachedEducationList = unstable_cache(
  async (requestHeaders: Headers) =>
    fetchServerJson<EducationItem[]>(
      buildServerApiUrl(requestHeaders, '/api/v1/educationLevelList'),
      {
        cache: 'force-cache',
        revalidate: 3600,
      },
    ),
  ['education-level-list'],
  { revalidate: 3600 },
);

export function getEducationList(requestHeaders: Headers) {
  return getCachedEducationList(requestHeaders);
}
```

### 6.2 Route Handlers 規範

`app/api/v1/*` 為 mock API 層，直接讀取 `data/*`，不額外建立 repository / query layer。

```typescript
// app/api/v1/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';

import jobList from '@/data/jobList';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? '1');
  const perPage = Number(searchParams.get('per_page') ?? '6');

  const paginatedJobs = jobList.slice((page - 1) * perPage, page * perPage);

  return NextResponse.json({
    data: paginatedJobs,
    total: jobList.length,
  });
}
```

**規則：**

- Route Handler 直接讀 `data/*`
- `page.tsx` 與其他 RSC 透過 `get***` helper 呼叫 API，不直接讀 `data/*`
- 需要快取的靜態參考資料，統一在 `lib/api/*.server.ts` 處理 `cache` / `revalidate`

### 6.3 Client 互動資料規範

Client Component 若需要互動導頁，優先使用 URL state（`searchParams`）與 `router.push/replace`，避免在 client 端自行重建主要列表資料流。

---

## 7. 樣式規範

### 7.1 Tailwind CSS 原則

- **禁止使用 inline style**（除非是動態數值且無法用 Tailwind 表達）
- **禁止一次性、自行命名的 custom CSS class**（使用 Tailwind utility，需要複用時用 `cn()` 組合）
- **允許設計系統層級的全域 utility class**，例如 `body1 ~ body9` 這類 typography utilities
- Class 排序使用 `prettier-plugin-tailwindcss` 自動排序

```typescript
// ✅ 正確：使用 cn() 組合條件 class
import { cn } from '@/lib/utils';

function Badge({ variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-green-100 text-green-800': variant === 'success',
          'bg-red-100 text-red-800': variant === 'error',
        },
        className,
      )}
    />
  );
}
```

### 7.2 響應式設計

- Mobile-first：先寫手機版，再用 `sm:` 以上覆寫 Desktop 差異
- 本專案規則為 `sm` 以下視為 Mobile，`sm` 以上視為 Desktop
- Breakpoints 嚴格遵循 Tailwind 預設（sm/md/lg/xl/2xl）

### 7.3 shadcn/ui 使用規範

- 透過 `npx shadcn@latest add <component>` 安裝，不手動複製
- 需要客製化時，**封裝一層**而非直接修改 `components/ui/`
- 使用 `asChild` prop 處理多型元件，不重新包 DOM

---

## 8. 動畫規範

### 8.1 Framer Motion 原則

- **所有使用 Framer Motion 的元件必須標記 `'use client'`**
- 動畫不能阻塞 LCP：頁面主要內容（above the fold）禁止使用 `initial={{ opacity: 0 }}` 配合延遲出現
- 動畫時長：微互動 150-200ms，頁面轉場 300-400ms，不超過 500ms

```typescript
'use client';

// ✅ 正確：列表進場動畫
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 每個子項間隔 50ms
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function AnimatedList({ items }: AnimatedListProps) {
  return (
    <motion.ul variants={listVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### 8.2 Reduced Motion

**必須**尊重使用者的 `prefers-reduced-motion` 設定：

```typescript
import { useReducedMotion } from 'framer-motion';

export function FadeIn({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: shouldReduce ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduce ? 0 : 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 9. Web Vitals 規範

所有頁面必須達到 Google Core Web Vitals **"Good"** 門檻：

| 指標 | Good 門檻 | 強制措施   |
| ---- | --------- | ---------- |
| LCP  | < 2.5s    | 見下方規則 |
| INP  | < 200ms   | 見下方規則 |
| CLS  | < 0.1     | 見下方規則 |

### 9.1 LCP 規範

- **頁面主圖（hero image）必須使用 `next/image` 並加上 `priority` prop**
- 禁止在 LCP 候選元素上使用 lazy loading
- 字體使用 `next/font` 載入，禁止 `@import` 外部字體
- 避免 render-blocking resources：CSS/JS 非同步載入

```typescript
// ✅ 正確
import Image from 'next/image';

export function HeroBanner() {
  return (
    <Image
      src="/hero.webp"
      alt="Hero banner"
      width={1200}
      height={600}
      priority          // 必須：LCP 主圖
      sizes="100vw"
    />
  );
}
```

### 9.2 INP 規範

- **長時間運算（> 50ms）必須用 `startTransition` 或移至 Web Worker**
- 事件 handler 不做同步 I/O
- 使用 `useOptimistic` 做樂觀更新，避免使用者等待

```typescript
'use client';

import { startTransition, useOptimistic } from 'react';

export function LikeButton({ count, onLike }: LikeButtonProps) {
  const [optimisticCount, addOptimistic] = useOptimistic(count);

  function handleClick() {
    startTransition(() => {
      addOptimistic(optimisticCount + 1);
      onLike();
    });
  }

  return <button onClick={handleClick}>{optimisticCount} Likes</button>;
}
```

### 9.3 CLS 規範

- **所有圖片和媒體元素必須明確設定 `width` 和 `height`**
- 禁止在初始渲染後插入會推移版面的元素（廣告、banner 等需預留空間）
- 字體使用 `font-display: optional` 或 `next/font` 的 `display: 'swap'` 搭配 `adjustFontFallback`
- Skeleton loader 尺寸必須與實際內容一致

```typescript
// ✅ 正確：預留 skeleton 空間與實際內容一致
function UserCardSkeleton() {
  return (
    <div className="h-[120px] w-full animate-pulse rounded-lg bg-muted" />
  );
}

// 實際元件高度也必須是 120px
function UserCard({ user }: UserCardProps) {
  return (
    <div className="h-[120px] w-full rounded-lg border p-4">
      ...
    </div>
  );
}
```

### 9.4 動態 Import（Code Splitting）

非首屏元件使用 `dynamic` import：

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/common/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // 僅在需要時才關閉 SSR
});
```

---

## 10. 測試規範

### 10.1 測試分層策略

本專案目前尚未建立 `tests/` 與對應測試工具鏈。後續若補測試，建議採以下分層：

```
┌─────────────────────────────────────────┐
│  Playwright (E2E)                        │
│  - 首頁完整流程                          │
│  - API Route Handlers                    │
│  - Server Components SSR 驗證            │
├─────────────────────────────────────────┤
│  Vitest + RTL (Integration)             │
│  - Client Components 互動               │
│  - Dialog / Carousel / Filter 行為      │
├─────────────────────────────────────────┤
│  Vitest (Unit)                          │
│  - 純函式（utils、formatters）           │
│  - search params helpers                │
└─────────────────────────────────────────┘
```

### 10.2 Vitest + RTL 規範（Client 端）

**適用對象**：Client Components、純函式

```typescript
// tests/integration/JobFilters.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

// ✅ 使用專案統一的 render wrapper
import { renderWithProviders } from '@/tests/utils/renderWithProviders';
import { JobFilters } from '@/components/home/JobFilters';

describe('JobFilters', () => {
  it('should trigger search on button click', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <JobFilters
        educationLevels={[]}
        initialCompanyName=""
        salaryLevels={[]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /條件搜尋/i }));

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
```

**測試工具函式（必須建立）：**

```typescript
// tests/utils/renderWithProviders.tsx
import { ReactNode } from 'react';
import { render } from '@testing-library/react';

interface RenderWithProvidersOptions {
  wrapper?: ({ children }: { children: ReactNode }) => ReactNode;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {},
) {
  return render(ui, options);
}
```

**規則：**

- 使用 `userEvent` 模擬使用者互動，**禁止使用 `fireEvent`**
- 查詢元素優先順序：`getByRole` > `getByLabelText` > `getByText` > `getByTestId`
- Mock 使用 `vi.mock()`，且必須在測試結束後 `vi.clearAllMocks()`
- 每個測試檔案只測試一個元件或函式

### 10.3 Playwright 規範（Server Components & E2E）

**適用對象**：完整頁面流程、Server Component 輸出、API Routes、SEO meta tags

```typescript
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test('should render job list from server', async ({ page }) => {
    await page.goto('/');

    // 驗證 Server Component 渲染的靜態內容
    await expect(
      page.getByRole('heading', { name: /適合前端工程師的好工作/i }),
    ).toBeVisible();

    // 驗證 SSR：確認 HTML 在 JS 執行前已包含內容
    const content = await page.content();
    expect(content).toContain('查看細節');
  });

  test('should open detail dialog', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('button', { name: /查看細節/i })
      .first()
      .click();

    await expect(
      page.getByRole('heading', { name: /詳細資訊/i }),
    ).toBeVisible();
  });

  test('should have correct meta tags for SEO', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    expect(title).toMatch(/web-exam-v2/i);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /.+/);
  });
});
```

**規則：**

- 每個 E2E 測試必須獨立，使用 `test.beforeEach` 重置狀態
- 使用 `page.getByRole()` 等語義選擇器，**禁止使用 CSS selector 或 XPath**
- API Mock 使用 `page.route()` 或搭配 MSW
- Server Component 測試必須驗證 HTML source（`page.content()`），不依賴 JS hydration
- 測試執行前使用 `page.goto()` 等待完整 load

### 10.4 測試覆蓋率要求

| 層級       | 最低覆蓋率 |
| ---------- | ---------- |
| Statements | 80%        |
| Branches   | 75%        |
| Functions  | 80%        |
| Lines      | 80%        |

CI pipeline 中，覆蓋率低於門檻時**禁止 merge**。

---

## 11. TypeScript 規範

- **`strict: true`** 必須開啟，所有 strict 子選項皆不得關閉
- **禁止使用 `any`**；不確定型別時使用 `unknown` 並做型別守衛
- **禁止使用 non-null assertion `!`**；改用 optional chaining 或明確的 null check
- 型別定義優先順序：`interface` > `type`（需要 union/intersection 時才用 `type`）
- 善用 `satisfies` operator 做型別驗證而不失去推斷

```typescript
// ✅ 正確：使用 unknown + type guard
function processData(data: unknown): string {
  if (typeof data !== 'string') {
    throw new TypeError('Expected string');
  }
  return data.trim();
}

// ✅ 正確：使用 satisfies
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
} satisfies Record<string, string | number | undefined>;
```

---

## 12. 禁止事項

以下行為在 Code Review 中**一律拒絕 merge**：

| #   | 禁止行為                                              | 原因                 |
| --- | ----------------------------------------------------- | -------------------- |
| 1   | 在 Server Component 使用 `useState` / `useEffect`     | 破壞 RSC 架構        |
| 2   | 在 Client Component 直接 `fetch` 主要列表資料         | 破壞 RSC 資料流      |
| 3   | 使用 `any` 型別                                       | 破壞型別安全         |
| 4   | Inline style（動態值除外）                            | 違反 Tailwind 規範   |
| 5   | 直接修改 `components/ui/` 原始檔                      | 破壞 shadcn 升級路徑 |
| 6   | 在 LCP 元素上省略 `priority` prop                     | 破壞 LCP 指標        |
| 7   | 圖片省略 `width` / `height`                           | 造成 CLS             |
| 8   | 不尊重 `prefers-reduced-motion` 的動畫                | 可及性違規           |
| 9   | 測試中使用 `fireEvent`                                | 不符合真實使用者行為 |
| 10  | 測試中使用 CSS selector 或 `data-testid` 作為主要查詢 | 脆弱測試             |

---

## 13. Git 規範

### 13.1 Commit Message（Conventional Commits）

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Type 列表：**

- `feat`：新功能
- `fix`：Bug 修復
- `perf`：效能改進
- `refactor`：重構（不改變行為）
- `test`：新增或修改測試
- `docs`：文件更新
- `chore`：建置工具、依賴更新

**範例：**

```
feat(users): add follow button with optimistic update

Implements useOptimistic hook to provide immediate feedback
before server confirmation.

Closes #42
```

### 13.2 Branch 命名

```
feat/<ticket-id>-short-description
fix/<ticket-id>-short-description
refactor/<ticket-id>-short-description
```

### 13.3 PR 規則

- PR 標題遵循 Conventional Commits 格式
- 每個 PR 必須包含對應測試
- CI 全綠（lint + type-check + test + coverage）才能 merge
- 禁止 force push 到 `main` / `develop`

---

_最後更新：2026-03-12_
_本文件由工程團隊維護，任何技術棧或規範變更須更新此文件後方可實施。_

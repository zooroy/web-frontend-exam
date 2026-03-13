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

| 層級                        | 技術                           | 版本              |
| --------------------------- | ------------------------------ | ----------------- |
| Framework                   | Next.js                        | 16.x (App Router) |
| Language                    | TypeScript                     | 5.x (strict mode) |
| Styling                     | Tailwind CSS                   | 4.x               |
| UI Components               | shadcn/ui                      | latest            |
| Server/Client State         | TanStack Query                 | v5                |
| Animation                   | Framer Motion                  | latest            |
| Unit/Integration Test       | Vitest + React Testing Library | latest            |
| E2E / Server Component Test | Playwright                     | latest            |
| Linter                      | ESLint (Airbnb config)         | latest            |
| Formatter                   | Prettier                       | latest            |

---

## 3. 專案結構

```
├── app/                          # Next.js App Router 根目錄
│   ├── (routes)/                 # 路由群組（不影響 URL）
│   │   └── [feature]/
│   │       ├── page.tsx          # Server Component（預設）
│   │       ├── layout.tsx        # Layout（Server Component）
│   │       ├── loading.tsx       # Suspense fallback
│   │       ├── error.tsx         # Error boundary（'use client'）
│   │       └── not-found.tsx     # 404
│   ├── api/                      # Route Handlers
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui 原始元件（禁止直接修改）
│   └── common/                   # 專案共用元件與頁面組裝元件
│
├── hooks/                    # 自定義 React hooks（Client 端）
│
├── lib/
│   ├── api/                      # API client、fetch helpers
│   ├── queries/                  # TanStack Query queryOptions / mutations
│   ├── utils/                    # 純函式工具
│   └── validations/              # Zod schemas
│
├── types/                        # 全域 TypeScript 型別定義
│
├── tests/
│   ├── unit/                     # Vitest 單元測試
│   ├── integration/              # Vitest + RTL 整合測試（Client 端）
│   └── e2e/                      # Playwright 測試
│
└── public/                       # 靜態資源
```

**規則：**

- 每個目錄只做一件事，不跨層混放邏輯
- `components/ui/` 的 shadcn 元件透過 CLI 產生後只封裝，不直接修改原始碼
- 在目前專案規模下，元件統一放在 `components/common/`，暫不建立 `components/features/`
- `lib/queries/` 統一管理所有 TanStack Query 的 `queryOptions`、`infiniteQueryOptions`、`mutationOptions`

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
import { cache } from "react";

import { dehydrate } from "@tanstack/react-query";
import { z } from "zod";

import { QueryProvider } from "@/components/common/QueryProvider";
import { getUserById } from "@/lib/api/users";

import { UserCard } from "./UserCard";

import type { User } from "@/types/user";
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
  - TanStack Query（client-side fetching）
        │
       YES → 加上 'use client'，設計為 Client Component
        │
        NO → 保持為 Server Component（預設，不加任何指令）
```

**原則：將 `'use client'` 邊界盡量推到葉節點（leaf components）。**

### 5.2 Server Component 規範

```typescript
// app/users/[id]/page.tsx
import { Suspense } from 'react';

import { getUserById } from '@/lib/api/users';
import { UserProfileSkeleton } from '@/components/common/users/UserProfileSkeleton';
import { UserProfile } from '@/components/common/users/UserProfile';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  return (
    <Suspense fallback={<UserProfileSkeleton />}>
      <UserProfile user={user} />
    </Suspense>
  );
}
```

### 5.3 Client Component 規範

```typescript
'use client';

// components/common/users/UserActions.tsx
import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { userMutations } from '@/lib/queries/users';

import type { User } from '@/types/user';

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation(userMutations.follow(queryClient));

  return (
    <Button
      onClick={() => mutate(user.id)}
      disabled={isPending}
      aria-busy={isPending}
    >
      Follow
    </Button>
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

使用 Next.js 原生 `fetch` 並配合 `cache()`：

```typescript
// lib/api/users.ts
import { cache } from "react";

export const getUserById = cache(async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/users/${id}`, {
    next: { revalidate: 60 }, // ISR：60 秒重新驗證
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json() as Promise<User>;
});
```

### 6.2 TanStack Query 規範（Client 端）

所有 query 設定集中在 `lib/queries/`，使用 `queryOptions()` factory：

```typescript
// lib/queries/users.ts
import { queryOptions, mutationOptions } from "@tanstack/react-query";

import { fetchUsers, followUser } from "@/lib/api/users";

import type { QueryClient } from "@tanstack/react-query";

export const userQueries = {
  all: () =>
    queryOptions({
      queryKey: ["users"],
      queryFn: fetchUsers,
      staleTime: 1000 * 60 * 5, // 5 分鐘
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: ["users", id],
      queryFn: () => fetchUserById(id),
      staleTime: 1000 * 60 * 2,
    }),
};

export const userMutations = {
  follow: (queryClient: QueryClient) =>
    mutationOptions({
      mutationFn: (userId: string) => followUser(userId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    }),
};
```

**規則：**

- `staleTime` 必須明確設定，禁止依賴預設值（0）
- Query key 遵循陣列層級結構，從最寬泛到最具體
- Mutation 的 `onSuccess` / `onError` 邏輯放在 `queryOptions` 定義處，不在元件內

### 6.3 Hydration（Server → Client 資料橋接）

```typescript
// app/users/page.tsx（Server Component）
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queries/queryClient';
import { userQueries } from '@/lib/queries/users';
import { UserList } from '@/components/common/users/UserList';

export default async function UsersPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(userQueries.all());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserList />
    </HydrationBoundary>
  );
}
```

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

```
┌─────────────────────────────────────────┐
│  Playwright (E2E)                        │
│  - 完整使用者流程                         │
│  - Server Components 渲染驗證             │
│  - API Route Handlers                    │
├─────────────────────────────────────────┤
│  Vitest + RTL (Integration)             │
│  - Client Components 互動               │
│  - Custom Hooks                         │
│  - TanStack Query 整合                  │
├─────────────────────────────────────────┤
│  Vitest (Unit)                          │
│  - 純函式（utils、formatters）           │
│  - Zod schemas                          │
│  - Query key factories                  │
└─────────────────────────────────────────┘
```

### 10.2 Vitest + RTL 規範（Client 端）

**適用對象**：Client Components、自定義 Hooks、純函式

```typescript
// tests/integration/UserActions.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { createTestQueryClient } from '@/tests/utils/queryClient';
import { UserActions } from '@/components/common/users/UserActions';

// ✅ 使用專案統一的 render wrapper
import { renderWithProviders } from '@/tests/utils/renderWithProviders';

describe('UserActions', () => {
  it('should call follow mutation on button click', async () => {
    const user = userEvent.setup();
    const mockUser = { id: '1', name: 'Test User' };

    renderWithProviders(<UserActions user={mockUser} />);

    await user.click(screen.getByRole('button', { name: /follow/i }));

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });
});
```

**測試工具函式（必須建立）：**

```typescript
// tests/utils/renderWithProviders.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

export function renderWithProviders(
  ui: React.ReactElement,
  { queryClient = createTestQueryClient() } = {},
) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
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
// tests/e2e/users.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Users page", () => {
  test("should render user list from server", async ({ page }) => {
    await page.goto("/users");

    // 驗證 Server Component 渲染的靜態內容
    await expect(page.getByRole("heading", { name: /users/i })).toBeVisible();

    // 驗證 SSR：確認 HTML 在 JS 執行前已包含內容
    const content = await page.content();
    expect(content).toContain("user-list");
  });

  test("should complete follow user flow", async ({ page }) => {
    await page.goto("/users/1");
    await page.getByRole("button", { name: /follow/i }).click();

    await expect(
      page.getByRole("button", { name: /following/i }),
    ).toBeVisible();
  });

  test("should have correct meta tags for SEO", async ({ page }) => {
    await page.goto("/users/1");

    const title = await page.title();
    expect(title).toMatch(/user profile/i);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute("content", /.+/);
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
  if (typeof data !== "string") {
    throw new TypeError("Expected string");
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

| #   | 禁止行為                                                | 原因                 |
| --- | ------------------------------------------------------- | -------------------- |
| 1   | 在 Server Component 使用 `useState` / `useEffect`       | 破壞 RSC 架構        |
| 2   | 在 Client Component 直接 `fetch`（繞過 TanStack Query） | 破壞快取一致性       |
| 3   | 使用 `any` 型別                                         | 破壞型別安全         |
| 4   | Inline style（動態值除外）                              | 違反 Tailwind 規範   |
| 5   | 直接修改 `components/ui/` 原始檔                        | 破壞 shadcn 升級路徑 |
| 6   | 在 LCP 元素上省略 `priority` prop                       | 破壞 LCP 指標        |
| 7   | 圖片省略 `width` / `height`                             | 造成 CLS             |
| 8   | 不尊重 `prefers-reduced-motion` 的動畫                  | 可及性違規           |
| 9   | 測試中使用 `fireEvent`                                  | 不符合真實使用者行為 |
| 10  | 測試中使用 CSS selector 或 `data-testid` 作為主要查詢   | 脆弱測試             |
| 11  | `queryKey` 使用字串而非陣列                             | TanStack Query 規範  |
| 12  | `staleTime` 未明確設定                                  | 效能問題             |

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

# Design Spec

## 1. 文件目的

本文件定義 `web-exam-v2` 的 UI 設計與前端實作規格，作為設計、開發與後續擴充的單一基準。

專案技術基底如下：

- Framework: Next.js `16.x` + App Router
- Language: TypeScript `5.x`
- Styling: Tailwind CSS `4.x`
- UI Library: shadcn/ui
- Rendering Strategy: Server Components 優先，互動區塊下放至 Client Components

本次設計範圍以 Pencil 設計稿為準，包含以下五個區塊：

- `Color`
- `Font`
- `Component`
- `Desktop`
- `Mobile`

交付順序必須遵守以下原則：

1. 先建立 Design Tokens 與標準元件
2. 再實作 Desktop 與 Mobile 畫面

不得跳過 `colors`、`typography`、`components` 直接製作頁面。

## 2. 設計目標

此介面屬於以資訊篩選、卡片瀏覽與詳細資訊彈窗為核心的工作列表型產品。從 Pencil 畫面判讀，主要由品牌形象 Header、工作列表區、篩選區與詳細資訊彈窗組成，且同時提供 Desktop 與 Mobile 版本。

設計與實作需達成以下目標：

- 建立可重複使用的色彩、字體、間距與元件系統
- 讓 `sm` 以下的 Mobile 與 `sm` 以上的 Desktop 共用同一套 token 與 component API
- UI 呈現需與 Pencil 畫面語意一致
- 導入後可直接支援真實資料串接與 shadcn/ui 擴充
- 符合 Next.js 16 與 Core Web Vitals 最佳實務

## 3. Pencil 畫面摘要

根據目前 Pencil 畫面，可確認以下結構：

### 3.1 Color

- 存在 `Red`、`Orange`、`Gray` 三組色票
- 每組皆為數個階層色階
- Gray 為主要中性色系，Red / Orange 為品牌或狀態色延伸

### 3.2 Font

- 主要內文示意字體為 `Noto Sans TC`
- 字級從 `12px` 到 `48px`
- 每個字級皆有 `regular` 與 `bold`
- 專案正式字體系統僅使用 `Noto Sans TC`

### 3.3 Component

目前 Pencil 的 `Component` 區已明確定義下列元件：

- `Card`
- `Select/Select`
- `Select/TextField`
- `Button`

其中可再辨識出以下結構特徵：

- `Card` 已分成 `Desktop` 與 `Mobile` 兩個 variant
- `sm` 以下使用 Mobile Card
- `sm` 以上使用 Desktop Card
- `Card` 皆包含：
  - `Company Name`
  - `Infomation`
  - `Content`
  - `Detail Button`
- `Button` 至少有主按鈕與 disabled 狀態兩種視覺
- `Select/Select` 與 `Select/TextField` 皆採浮動標籤結構，包含：
  - `Container`
  - `Label Container`

### 3.4 Desktop

- 設計稿基準畫布寬度為 `1440px`
- 前端實作以 Tailwind breakpoint 為準：`sm` 以上視為 Desktop
- 上半部為品牌視覺區，含背景、角色、Logo 與眼睛裝飾素材
- 下半部為白底主內容卡 `Top Work`
- `Top Work` 內包含：
  - `Title`
  - `Filter`
  - `Job Container`

### 3.5 Mobile

- 設計稿基準畫布寬度為 `375px`
- 前端 breakpoint 定義為 `sm` 以下
- 上半部保留品牌視覺區，但裁切為手機比例
- 下半部主內容區為 `Top Work`
- `Top Work` 內包含：
  - `Title`
  - `Job Container`

### 3.5.1 Breakpoint 規範

- `sm` 以下視為 Mobile
- `sm` 以上全部視為 Desktop
- 不另外定義 tablet 專屬版型

### 3.6 Detail Information

Desktop 與 Mobile 均存在 detail version：

- `Desktop（Detail Information)`
- `Mobile（Detail Information)`

此版本在原頁面上增加 `Popup Window`

- 含半透明遮罩
- 含白底 `<Paper>` 容器

## 4. 資訊架構與實作優先級

整體開發順序必須固定為以下四階段：

### Phase 1. Design Tokens

建立全站共用的：

- Colors
- Typography
- Radius
- Shadow
- Spacing
- Layout width / breakpoint

### Phase 2. Foundation Components

以 shadcn/ui 為基礎封裝以下元件：

- Button
- Select
- TextField
- Card
- Carousel
- Dialog

### Phase 3. Screen Composition

使用已定義的 tokens 與 components 組出：

- Desktop
- Mobile

### Phase 4. Detail Interaction

補上詳細資訊的互動層：

- Desktop Dialog
- Mobile Dialog

## 5. Design Tokens 規格

## 5.1 Color Tokens

色彩系統以 Pencil 現有色票命名邏輯為主，但前端命名必須轉成可維護的 semantic tokens。

### 5.1.1 原始色票來源

- `gray/*`
- `red/*`
- `orange/*`

### 5.1.2 前端 token 分層

以目前專案規模，色彩系統採用輕量策略：

1. 以 `gray / red / orange` 作為主要 raw palette
2. 只建立少量核心 semantic tokens

本專案現階段不要求完整的 semantic color system。

Raw palette 範例：

```css
--color-gray-100: #ffffff;
--color-gray-300: #e6e6e6;
--color-gray-500: #cccccc;
--color-gray-700: #999999;
--color-gray-1000: #4d4d4d;
--color-gray-1500: #000000;

--color-red-500: #e89d8f;
--color-red-700: #d85b45;
--color-red-900: #8c3a2b;

--color-orange-500: #f4b273;
--color-orange-700: #ee8927;
--color-orange-900: #aa6119;
```

核心 semantic tokens 範例：

```css
--background: var(--color-gray-100);
--foreground: var(--color-gray-1000);
--border-default: var(--color-gray-500);
--overlay: rgb(77 77 77 / 50%);

--primary: var(--color-orange-700);
--accent: var(--color-red-700);
--muted-foreground: var(--color-gray-900);
```

### 5.1.3 使用原則

- `gray` 作為文字、邊框、背景、遮罩主體
- `orange` 作為主要 CTA、選中狀態、品牌強調色
- `red` 作為提示、狀態標記、輔助高亮色
- 日常開發可優先使用 raw palette，例如 `gray-*`、`orange-*`、`red-*`
- 全站共用角色僅保留少量 semantic tokens：
  - `background`
  - `foreground`
  - `border-default`
  - `primary`
  - `accent`
  - `muted-foreground`
  - `overlay`
- 畫面內不得直接硬編十六進位色碼，必須透過 palette token 或核心 semantic token 使用

## 5.2 Typography Tokens

### 5.2.1 Font Family

依 Pencil 判讀，字體系統如下：

- Primary UI font: `Noto Sans TC`

Next.js 實作原則：

- 以 `next/font` 載入字體
- `Noto Sans TC` 為主要 `--font-sans`
- 不使用 `@import` 載入第三方字體

### 5.2.2 Type Scale

根據 Pencil，字級以 `body1 ~ body9` utility class 定義，不將字重綁入 token。

| Utility | Size | Line Height | Weight |
| --- | --- | --- | --- |
| `body1` | 12px | 1.25 | 另行指定 |
| `body2` | 14px | 1.25 | 另行指定 |
| `body3` | 16px | 1.25 | 另行指定 |
| `body4` | 20px | 1.25 | 另行指定 |
| `body5` | 24px | 1.25 | 另行指定 |
| `body6` | 28px | 1.25 | 另行指定 |
| `body7` | 34px | 1.25 | 另行指定 |
| `body8` | 40px | 1.25 | 另行指定 |
| `body9` | 48px | 1.25 | 另行指定 |

Typography utility 使用原則：

- `body1 ~ body9` 只負責字級與行高
- 字重必須獨立搭配 `font-normal` 或 `font-bold`
- 支援直接以 Tailwind breakpoint 組合，例如 `body3 sm:body5`
- 不在元件內散落 `text-[16px]`、`text-[24px]` 等一次性字級

建議實作方式：

- 在 `app/globals.css` 內定義 `body1 ~ body9` typography utilities
- 讓元件直接使用 `className="body3 sm:body5 font-bold"` 這種寫法
- 若同一個字級在多處重複使用，可再補充少量語意化 class，但不取代 `body1 ~ body9`

### 5.2.3 Typography Roles

畫面角色建議如下：

- `display`: Hero 或大型視覺區標題，可使用 `body8` 或 `body9`
- `heading-1`: 區塊主標題，可使用 `body7`
- `heading-2`: 子區塊標題，可使用 `body4` 或 `body5`
- `body`: 標準內容文字，可使用 `body3`
- `body-sm`: 次要說明文字，可使用 `body2`
- `caption`: 補充說明、提示、標籤，可使用 `body1`

元件使用範例如下：

- Desktop Card `Company Name`: `body5 font-bold`
- Mobile Card `Company Name`: `body3 font-bold`
- 可在同一個元件中直接寫成 `body3 sm:body5 font-bold`
- Card `Infomation`: `body2 font-normal`
- Card `Content`: `body2 font-normal`
- Card `Detail Button`: `body2 font-bold`

## 5.3 Spacing / Radius / Shadow

### 5.3.1 Spacing

建議採 4px base scale：

- `4`
- `8`
- `12`
- `16`
- `20`
- `24`
- `32`
- `40`
- `48`

目前 Pencil 中常見間距為：

- `12`
- `16`
- `20`
- `24`

### 5.3.2 Radius

根據 Pencil：

- Small: `4px`
- Medium: `8px`
- Large: `12px`

### 5.3.3 Shadow

至少建立兩種陰影：

- `shadow-card`: 一般卡片容器
- `shadow-modal`: 詳細資訊彈窗

陰影語意需對應 Pencil 中：

- 白底主卡片的外陰影
- Popup `<Paper>` 的多層陰影

## 6. 元件系統規格

所有元件以 `shadcn/ui` 為底，不直接修改 `components/ui/` 原始檔，並統一封裝在 `components/common/`。

## 6.1 Card

用途：

- Job item
- 區塊容器
- Detail summary

需求：

- 需對齊 Pencil 內既有的兩個 variant：
  - `Desktop Card`
  - `Mobile Card`
- Tailwind breakpoint 規則固定為：
  - `sm` 以下渲染 Mobile Card
  - `sm` 以上渲染 Desktop Card
- 需包含固定欄位：
  - `Company Name`
  - `Infomation`
  - `Content`
  - `Detail Button`
- 支援 `selected` 狀態
- Desktop Card 需支援 hover 狀態
- Mobile Card 不要求 hover 狀態
- 支援桌機與手機共用資料模型，但視覺需分別對應 Desktop / Mobile variant
- `Company Name` 建議直接使用 `body3 sm:body5 font-bold`
- `Infomation` 區內的 icon + text row 結構需保持一致
- `Infomation` 文字建議使用 `body2 font-normal`
- `Content` 文字區需維持固定高度，避免列表高度不穩定
- `Content` 最多顯示兩行，超過內容以省略號 `...` 截斷
- `Content` 文字建議使用 `body2 font-normal`
- `Detail Button` 為卡片內固定位於底部的操作區
- `Detail Button` 文字建議使用 `body2 font-bold`

建議封裝：

- `components/common/cards/JobCard.tsx`

## 6.2 Select

用途：

- Desktop filter 區塊

需求：

- 使用 shadcn `Select`
- 外觀需對齊 Pencil 的 `Select/Select`
- 採白底、灰框、`4px` 圓角
- 需支援 placeholder、default value、disabled
- 需保留 label 區域，對應 `Label Container`

## 6.3 TextField

用途：

- 關鍵字搜尋
- 條件輸入
- Desktop filter 補充欄位

需求：

- 使用 shadcn `Input` 再封裝
- 外觀需對齊 Pencil 的 `Select/TextField`
- 採白底、灰框、`4px` 圓角
- 需保留 label 區域，對應 `Label Container`
- 與 Select 高度統一為 `56px`

## 6.4 Button

用途：

- `條件搜尋`
- `查看更多`
- `開啟詳細資訊`

需求：

- 以 shadcn `Button` 為基礎封裝品牌樣式
- 至少定義兩種狀態：
  - Primary: `orange-700`
  - Disabled: `gray-700`
- 高度對齊 Pencil 為 `56px`
- 圓角為 `4px`
- 文案預設使用 `16px`

## 6.5 Dialog

用途：

- Detail Information 顯示層

需求：

- 預設以 `shadcn/ui` 的 `Dialog` component 為基底封裝
- Desktop 使用 Dialog / Modal
- Mobile 亦使用 Dialog / Modal，不使用 Drawer
- 遮罩透明度與白底 Paper 層級需對齊 Pencil
- Dialog / Modal 最大寬度限制為 `750px`
- Dialog / Modal 與 webview 左右至少保留 `22px` 邊界
- Mobile `Popup Window` 為置中式白底 `Paper`，非 bottom sheet
- Dialog 需包含以下區塊：
  - `DialogTitle`
  - `DialogContent`
  - `DialogActions`
- 必須支援 keyboard close 與 focus trap

## 6.6 Carousel

用途：

- Detail Information 內的圖片瀏覽區

需求：

- Carousel 必須視為獨立元件納入 component system，不可直接寫死在單一 dialog 內
- 需支援上一張 / 下一張控制
- 需支援 pagination dots 或等價的頁碼指示
- 需支援鍵盤操作與觸控滑動
- 圖片容器需維持固定比例與明確尺寸，避免 CLS
- 圖片使用 `next/image`

Breakpoint 規格：

- Desktop 與 Mobile 的單次可見圖片數量不同
- `sm` 以下使用 Mobile carousel 配置
- `sm` 以上使用 Desktop carousel 配置
- 不得以同一個固定 `slidesPerView` 套用所有裝置
- 顯示張數需做成可配置參數，例如 `desktopSlidesPerView` 與 `mobileSlidesPerView`

實作原則：

- Carousel 應作為 `JobDetail` 或 `DetailDialog` 的子元件
- 不將圖片數量差異寫死在頁面層
- 以元件 props 或設定檔管理不同 breakpoint 的顯示數量

## 7. 畫面規格

## 7.1 Desktop Screen

### 7.1.1 Layout

- 設計稿基準畫布寬度：`1440px`
- 前端實作範圍：`sm` 以上
- 上方 Hero 視覺區固定存在
- 下方主內容區為 `Top Work`
- `Top Work` 為主要內容容器，白底、圓角、陰影、24px padding

### 7.1.2 Hero 區

包含以下視覺資產：

- Background
- Character
- CharacterWhite
- Logo
- LeftEye
- RightEye

實作要求：

- Hero 圖像使用 `next/image`
- 若 Logo 或角色區屬於首屏 LCP 候選，需正確配置 `priority`
- Desktop 視覺可使用絕對定位，但不可破壞 responsive layout
- Desktop Hero 需加入互動效果：眼球圖層隨滑鼠位置做微幅位移
- 互動目標為 `LeftEye` 與 `RightEye`
- 位移幅度需克制，僅作為視覺細節，不可影響版面或造成內容晃動
- `Logo` 需加入循環縮放動畫
- 動畫效果為放大縮小播放
- 動畫週期為 `1.5s` 一個 cycle，持續循環
- 縮放幅度需克制，避免破壞 Logo 可讀性或影響 LCP 感知
- 需尊重 `prefers-reduced-motion`，在 reduced motion 下停用此互動效果

### 7.1.3 Top Work 區塊

由三部分構成：

- `Title`
- `Filter`
- `Job Container`

要求：

- `Title` 為區塊標題與簡短說明
- `Filter` 放置 Select 類元件與篩選控制
- `Filter` 可由 `Select`、`TextField`、`Button` 組成
- `Job Container` 為列表容器，內含多個 JobCard
- Desktop `Job Container` 顯示 `6` 筆資料

### 7.1.4 Detail Information

開啟 JobCard 後顯示 Popup：

- 背景加上半透明 overlay
- 中央顯示白底 Paper
- Paper 最大寬度為 `750px`
- Paper 與 viewport 左右至少保留 `22px` 邊界
- Paper 需支援標題、內容、關閉操作與可滾動區域
- 內容區需包含 carousel 圖片瀏覽模組
- Desktop 版本的 carousel 顯示圖片數量需依 Desktop 規格配置

## 7.2 Mobile Screen

### 7.2.1 Layout

- 設計稿基準畫布寬度：`375px`
- Tailwind breakpoint: `< sm`
- Hero 壓縮為手機版比例
- 主內容區 `Top Work` 緊接於 hero 下方
- 主內容區為單欄排列

### 7.2.2 Top Work 區塊

包含：

- `Title`
- `Job Container`

規格如下：

- Mobile 不顯示 `Filter` 區塊
- Mobile `Top Work` 僅呈現 `Title` 與 `Job Container`
- Mobile `Job Container` 顯示 `4` 筆資料

### 7.2.3 Detail Information

建議作法：

- 使用置中的 Dialog / Modal
- 保持白底內容容器，最大寬度為 `750px`
- Modal 與 webview 左右至少保留 `22px` 邊界
- 遮罩與內容層次對齊 Desktop 視覺語言
- Dialog 結構需包含：
  - `DialogTitle`
  - `DialogContent`
  - `DialogActions`
- `DialogContent` 需包含：
  - `Job Title`
  - `Job LightBox`
  - `Job Content`
- 內容區需包含 carousel 圖片瀏覽模組
- Mobile 版本的 carousel 顯示圖片數量需依 Mobile 規格配置
- Mobile 顯示張數不得直接沿用 Desktop 設定

## 8. 前端落地規範

## 8.1 檔案結構建議

由於目前專案規模小，檔案結構以扁平化為原則，不先過度分層。

```txt
app/
  page.tsx
  layout.tsx
  globals.css

components/
  ui/
  common/
    JobCard.tsx
    FilterSelect.tsx
    FilterTextField.tsx
    BrandButton.tsx
    DetailDialog.tsx
    DetailCarousel.tsx
    JobList.tsx
    JobDetail.tsx
    JobsDesktopView.tsx
    JobsMobileView.tsx

lib/
  api/
  utils/
  constants/

types/
```

## 8.2 樣式實作

### 必做事項

- 將 `gray / red / orange` palette 與少量核心 color tokens 寫入 `app/globals.css`
- 將 `Noto Sans TC` 透過 `next/font` 注入 `app/layout.tsx`
- 將 `body1 ~ body9` typography utilities 寫入 `app/globals.css`
- Tailwind class 不直接散落十六進位色碼，優先使用 palette token 或核心 color token
- 元件間距與圓角優先沿用設計稿已定義的固定尺度

### 禁止事項

- 不在頁面層直接寫大量一次性樣式
- 不在 component 內硬編品牌色
- 不直接修改 `components/ui/`

## 8.3 響應式策略

- 採 mobile-first
- `Desktop` 與 `Mobile` 應盡量共用資料模型與子元件
- `sm` 以下套用 Mobile layout
- `sm` 以上套用 Desktop layout
- 差異放在 layout 組裝，而非複製整套元件

## 8.4 資料模型

即使目前先做靜態畫面，資料結構也需先標準化，建議至少包含：

```ts
interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  tags: string[];
  summary: string;
  description?: string;
}
```

如此可避免後續從靜態切換到 API 時重寫元件。

## 9. 驗收標準

## 9.1 Design Tokens

- 已建立 `color`、`typography`、`spacing`、`radius`、`shadow` tokens
- `globals.css` 已能提供語意化 CSS variables
- 字體透過 `next/font` 正式掛載

## 9.2 Components

- 已完成 `Card`、`Select`、`TextField`、`Button`
- 已完成 `Carousel`
- 元件皆可獨立重用
- 元件 API 命名清楚，無直接依賴單一頁面結構
- Carousel 已可依 breakpoint 套用不同圖片顯示數量

## 9.3 Desktop / Mobile

- 已完成 Desktop 與 Mobile 主畫面
- 已完成 Desktop 與 Mobile 的 Detail Information 版本
- 兩種版型皆使用同一套設計 token

## 9.4 品質要求

- 首屏圖片使用 `next/image`
- 無 inline style
- 無硬編 `any`
- Server / Client 邊界清楚
- 可通過 lint 與 type-check

## 10. 建議實作順序

1. 在 `app/layout.tsx` 導入 `Noto Sans TC`
2. 在 `app/globals.css` 建立 raw palette 與 semantic tokens
3. 建立 `Card`、`Select`、`TextField`、`Button`、`Carousel` 基礎元件
4. 建立 Job 資料 mock 與 `JobCard`
5. 完成 Desktop 主畫面
6. 完成 Mobile 主畫面
7. 補上 Detail Dialog
8. 最後調整細節、無障礙與互動狀態

## 11. 結論

此專案不應從單一畫面切入，而應先以 Pencil 中的 `Color`、`Font`、`Component` 三塊建立設計系統基礎，再使用這些標準化產物去組裝 `Desktop` 與 `Mobile`。這樣可以確保後續實作具備一致性、可維護性與可擴充性，也符合 Next.js 16、Tailwind CSS v4 與 shadcn/ui 的主流前端實務。

# 建筑灵感日报 - 项目设计规格文档

> **模板版本**: v2.0
> **适用场景**: 📱 小型应用 - 单页数据聚合展示

---

## 0. 项目元信息

**本项目类型**: `📱 小型应用`
**本项目规模**: `规模:S` (1页，<10组件，个人)
**本项目开发模式**: `⚡ 快速原型`

---

## 1. 产品北极星

### 1.1 愿景

**愿景**: 每天自动聚合全球顶级建筑设计案例，一页看完今日最佳灵感。

### 1.2 核心价值主张

**价值主张**: 建筑师和设计爱好者不必每天逐一打开古德建筑网和 ArchDaily 浏览，打开一个页面即可看到两大平台近6天的精选设计案例。

### 1.3 目标用户

| 用户类型 | 描述 | 核心需求 |
|----------|------|----------|
| 建筑设计师 | 日常寻找设计灵感 | 快速浏览高质量案例，节省时间 |
| 设计爱好者 | 对建筑设计感兴趣 | 发现好设计，拓宽视野 |

### 1.4 边界与约束

**非目标**:
- 不做案例详情页（点击跳转原站）
- 不做用户系统/收藏功能
- 不做搜索/筛选功能
- 不做 ArchDaily 内容翻译（UI 全中文，案例标题保持原文或取中文版）

**硬约束**:
- 数据来源: 古德建筑网 (gooood.cn) + ArchDaily (archdaily.cn 中文版)
- 人气定义: 优先获取浏览量/评论数等真实数据；不可用时以首页推荐位置为依据
- 更新频率: 每日 00:00 UTC+8 定时抓取
- 展示范围: 当天 + 往前5天 = 共6天数据
- 每天每站: 5个案例
- 内容语言: 全中文展示

---

## 2. 信息架构

### 2.0 导航结构

单页应用，无多级导航。

```
建筑灵感日报
├── 顶部: 网站标题 + 数据源标识 + 最后更新时间
├── 日期标签栏: [今天] [昨天] [前天] [3天前] [4天前] [5天前]
└── 内容区: 瀑布流卡片 (古德 + ArchDaily 混合展示，带来源标签)
```

### 2.1 路由结构

| 路径 | 页面/组件 | 说明 |
|------|-----------|------|
| `/` | 首页 | 展示所有日期的设计案例 |
| `/api/scrape` | API Route | Cron Job 触发的抓取接口 |
| `/api/cases` | API Route | 前端获取案例数据 |

---

## 3. 逐页功能卡片

### 3.1 首页（唯一页面）

**用户目标**: 快速浏览近6天两大建筑网站的精选设计案例

**功能清单**:

| 功能 | 优先级 | 状态 | 说明 |
|------|--------|------|------|
| 日期标签切换 | P0 | 🔄 需实现 | 点击日期标签切换显示对应日期的案例 |
| 瀑布流卡片展示 | P0 | 🔄 需实现 | Pinterest 风格瀑布流，自适应列数 |
| 案例卡片 | P0 | 🔄 需实现 | 封面图 + 标题 + 来源标签 + 人气指标 |
| 点击跳转原站 | P0 | 🔄 需实现 | 新窗口打开原文链接 |
| 来源标签区分 | P1 | 🔄 需实现 | 古德/ArchDaily 用不同颜色标签区分 |
| 加载状态 | P1 | 🔄 需实现 | 骨架屏或加载动画 |
| 空状态 | P1 | 🔄 需实现 | 当天无数据时的提示 |
| 最后更新时间 | P2 | 🔄 需实现 | 显示数据最后抓取时间 |

**关键文案**:
| 元素 | 文案 |
|------|------|
| 网站标题 | 建筑灵感日报 |
| 副标题 | 每日精选全球建筑设计案例 |
| 日期标签 | 今天 / 1天前 / 2天前 / 3天前 / 4天前 / 5天前 |
| 来源标签 | 古德建筑 / ArchDaily |
| 空状态 | 今日数据正在收集中，请稍后查看 |
| 更新提示 | 数据更新于 YYYY-MM-DD HH:mm |

**布局与交互备注**:
- 瀑布流布局：桌面端 3-4 列，平板 2 列，手机 1 列
- 日期标签栏固定在内容区顶部，横向滚动
- 卡片 hover 时轻微上浮 + 阴影增强
- 图片懒加载，渐入动画
- 默认选中"今天"标签

**边界条件**:
- ⚠️ 抓取失败时显示缓存数据 + "数据可能不是最新"提示
- ⚠️ 新站点（刚部署）无历史数据时，只显示可用天数
- ⚠️ 图片加载失败时显示占位图
- ⚠️ ArchDaily 中文版内容不足时 fallback 到英文版

---

## 4. 设计令牌

### 4.1 色彩系统

```css
/* 背景 */
--bg-primary: #F5F5F0;       /* 页面背景 - 暖灰白 */
--bg-card: #FFFFFF;           /* 卡片背景 */

/* 文字 */
--text-primary: #1A1A1A;      /* 主标题 */
--text-secondary: #666666;    /* 副文字 */
--text-muted: #999999;        /* 辅助信息 */

/* 来源标签 */
--tag-gooood: #2D5016;        /* 古德建筑 - 深绿 */
--tag-gooood-bg: #E8F5E0;     /* 古德建筑背景 */
--tag-archdaily: #D32F2F;     /* ArchDaily - 红色(品牌色) */
--tag-archdaily-bg: #FFEBEE;  /* ArchDaily 背景 */

/* 强调 */
--accent: #1A1A1A;            /* 选中态 */
--border: rgba(0,0,0,0.08);   /* 边框 */

/* 状态 */
--skeleton: #E0E0E0;          /* 骨架屏 */
```

### 4.2 字体系统

```css
--font-sans: "Inter", "Noto Sans SC", -apple-system, sans-serif;
--text-xs: 0.75rem;    /* 12px - 标签 */
--text-sm: 0.875rem;   /* 14px - 辅助 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 卡片标题 */
--text-xl: 1.5rem;     /* 24px - 页面标题 */
--text-2xl: 2rem;      /* 32px - 大标题 */
```

### 4.3 间距与圆角

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
```

### 4.4 动效

```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--duration-fast: 150ms;
--duration-normal: 250ms;
```

---

## 5. 组件清单

| 组件 | 用途 | 优先级 |
|------|------|--------|
| `Header` | 网站标题 + 副标题 + 更新时间 | P0 |
| `DateTabs` | 日期标签切换栏 | P0 |
| `MasonryGrid` | 瀑布流容器 | P0 |
| `CaseCard` | 单个案例卡片 | P0 |
| `SourceTag` | 来源标签（古德/ArchDaily） | P0 |
| `Skeleton` | 骨架屏加载态 | P1 |
| `EmptyState` | 空数据状态 | P1 |
| `ErrorBanner` | 数据异常提示条 | P2 |

---

## 6. 技术实现要点

### 6.1 技术栈

| 类别 | 选择 | 理由 |
|------|------|------|
| **框架** | Next.js 15 (App Router) | SSR + API Routes + Cron |
| **部署** | Vercel | 免费 Cron Jobs + Edge |
| **样式** | Tailwind CSS 4 | 快速开发 + 响应式 |
| **抓取** | cheerio + node-fetch | 服务端 HTML 解析 |
| **存储** | Vercel KV (Redis) | 持久化每日抓取数据 |
| **瀑布流** | CSS columns 或 react-masonry-css | 原生方案优先 |
| **语言** | TypeScript | 类型安全 |

### 6.2 数据模型

```typescript
type DesignCase = {
  id: string;              // 唯一标识 (source-date-index)
  title: string;           // 案例标题（中文）
  imageUrl: string;        // 封面图 URL
  sourceUrl: string;       // 原文链接
  source: "gooood" | "archdaily";  // 数据来源
  date: string;            // 抓取日期 YYYY-MM-DD
  popularity?: number;     // 人气指标（如有）
  architect?: string;      // 设计事务所（如有）
  category?: string;       // 分类（如有）
};

type DailyData = {
  date: string;            // YYYY-MM-DD
  lastUpdated: string;     // ISO timestamp
  gooood: DesignCase[];    // 古德案例 (max 5)
  archdaily: DesignCase[]; // ArchDaily 案例 (max 5)
};
```

### 6.3 抓取策略

**古德建筑网 (gooood.cn)**:
- 抓取首页文章列表，取前 5 条推荐
- 解析: 标题、封面图、链接、分类
- 尝试获取评论数/分享数作为人气指标

**ArchDaily (archdaily.cn 中文版)**:
- 抓取中文版首页项目列表，取前 5 条
- 解析: 标题（中文）、封面图、链接、建筑师、分类
- 尝试获取社交分享数作为人气指标
- 如中文版数据不足，fallback 到 archdaily.com

**容错**:
- 抓取超时: 30s
- 失败重试: 最多 3 次，间隔 5s
- 异常时保留上次成功数据

### 6.4 Cron Job

```
// vercel.json
{
  "crons": [{
    "path": "/api/scrape",
    "schedule": "0 16 * * *"  // UTC 16:00 = UTC+8 00:00
  }]
}
```

### 6.5 项目结构

```
arch-daily-digest/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式
│   └── api/
│       ├── scrape/route.ts # 抓取 API (Cron)
│       └── cases/route.ts  # 数据查询 API
├── components/
│   ├── Header.tsx
│   ├── DateTabs.tsx
│   ├── MasonryGrid.tsx
│   ├── CaseCard.tsx
│   ├── SourceTag.tsx
│   ├── Skeleton.tsx
│   └── EmptyState.tsx
├── lib/
│   ├── scraper/
│   │   ├── gooood.ts       # 古德抓取逻辑
│   │   └── archdaily.ts    # ArchDaily 抓取逻辑
│   ├── storage.ts          # KV 存取封装
│   └── types.ts            # 类型定义
├── public/
│   └── placeholder.svg     # 图片占位符
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json             # Cron 配置
```

### 6.6 响应式断点

| 断点 | 宽度 | 瀑布流列数 |
|------|------|-----------|
| 手机 | <640px | 1列 |
| 平板 | 640-1024px | 2列 |
| 桌面 | 1024-1440px | 3列 |
| 大屏 | >1440px | 4列 |

### 6.7 实现顺序

**Phase 1 (MVP)**:
- 项目初始化 (Next.js + Tailwind)
- 抓取逻辑 (gooood + archdaily)
- 数据存储 (Vercel KV)
- 首页展示 (瀑布流 + 卡片)
- 日期切换

**Phase 2 (增强)**:
- 骨架屏加载态
- 图片懒加载
- 错误处理 + 提示
- Cron Job 配置

**Phase 3 (优化)**:
- 图片代理/优化
- SEO meta tags
- PWA 支持

---

## 7. 附录

### 7.1 参考文档

| 文档 | 用途 |
|------|------|
| gooood.cn | 古德建筑网 - 数据源 |
| archdaily.cn | ArchDaily 中文版 - 数据源 |
| Vercel Cron Docs | 定时任务配置参考 |
| Vercel KV Docs | KV 存储 API 参考 |

### 7.2 变更日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-04-24 | v1.0 | 初始设计规格 |

---

*建筑灵感日报 Design Spec v1.0 | 2026-04-24*

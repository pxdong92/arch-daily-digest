# 建筑灵感日报

每日自动抓取 gooood.cn 和 archdaily.cn 的最新建筑设计案例，以瀑布流卡片形式展示。

## 技术栈

- 前端：Vite + React + TypeScript + Tailwind CSS
- 抓取：Node.js + Cheerio（`scraper/`）
- 部署：Vercel + GitHub Actions

## 本地开发

```bash
npm install
npm run dev
```

## 运行抓取

```bash
cd scraper
npm install
node scraper.js          # 立即执行一次
node scraper.js --test   # 预览模式（不写文件）
node scraper.js --daemon # 常驻，每天 00:00 CST 自动执行
```

## 部署到 Vercel

### 方式一：通过 GitHub 导入（推荐）

1. 将代码推送到 GitHub 仓库
2. 打开 [vercel.com/new](https://vercel.com/new)
3. 导入该 GitHub 仓库，Vercel 会自动检测 Vite 项目配置
4. 点击 Deploy，等待构建完成

后续每次 push 到 main 分支都会自动触发重新部署。

### 方式二：CLI 手动部署

```bash
npx vercel login
npx vercel deploy --prod --yes
```

## GitHub Actions 自动抓取

已配置 `.github/workflows/daily-scrape.yml`：
- 每天 00:00 CST（UTC 16:00）自动运行 scraper
- 将生成的 JSON 数据提交到仓库
- 提交触发 Vercel 自动重新部署

需要确保 GitHub Actions 有仓库写入权限（默认已开启）。

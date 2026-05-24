/**
 * 建筑灵感日报 - 每日抓取脚本
 *
 * 用法:
 *   node scraper.js           -- 立即抓取今天的数据
 *   node scraper.js --daemon  -- 持续运行，每天 00:00 (Asia/Shanghai) 自动抓取
 *   node scraper.js --test    -- 测试模式：打印结果但不写文件
 */

import cron from "node-cron";
import { scrapeGooood } from "./lib/gooood.js";
import { scrapeArchdaily } from "./lib/archdaily.js";
import { saveDaily, formatDate, loadDaily } from "./lib/storage.js";

const LIMIT = 5; // 每个来源取前 5 条
const isDaemon = process.argv.includes("--daemon");
const isTest = process.argv.includes("--test");

async function runScrape(daysAgo = 0) {
  const date = formatDate(daysAgo);
  console.log(`\n${"=".repeat(50)}`);
  console.log(`[scraper] 开始抓取 ${date}`);
  console.log(`${"=".repeat(50)}`);

  const [gooood, archdaily] = await Promise.allSettled([
    scrapeGooood(LIMIT),
    scrapeArchdaily(LIMIT),
  ]);

  const goooodData = gooood.status === "fulfilled" ? gooood.value : [];
  const archdailyData = archdaily.status === "fulfilled" ? archdaily.value : [];

  if (gooood.status === "rejected") {
    console.error("[scraper] gooood failed:", gooood.reason);
  }
  if (archdaily.status === "rejected") {
    console.error("[scraper] archdaily failed:", archdaily.reason);
  }

  const payload = {
    date,
    lastUpdated: new Date().toISOString(),
    gooood: goooodData,
    archdaily: archdailyData,
  };

  if (isTest) {
    console.log("\n[test mode] 结果预览:");
    console.log("古德建筑:", JSON.stringify(goooodData, null, 2));
    console.log("ArchDaily:", JSON.stringify(archdailyData, null, 2));
    return payload;
  }

  saveDaily(date, payload);
  console.log(`[scraper] ✓ 完成 | 古德 ${goooodData.length} 条 | ArchDaily ${archdailyData.length} 条`);
  return payload;
}

// ─── 入口 ─────────────────────────────────────────────
if (isDaemon) {
  // 守护进程模式：每天 00:00 CST (UTC+8) 自动执行
  console.log("[scraper] 守护模式启动，将在每天 00:00 (CST) 抓取…");
  cron.schedule(
    "0 0 * * *",
    () => {
      runScrape(0).catch(console.error);
    },
    { timezone: "Asia/Shanghai" }
  );
  // 启动时也立即抓一次（如果今日数据不存在）
  const today = formatDate(0);
  if (!loadDaily(today)) {
    console.log("[scraper] 今日数据不存在，立即执行首次抓取…");
    runScrape(0).catch(console.error);
  }
} else {
  // 单次执行
  runScrape(0)
    .then(() => {
      if (!isTest) process.exit(0);
    })
    .catch((err) => {
      console.error("[scraper] fatal:", err);
      process.exit(1);
    });
}

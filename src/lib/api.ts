import type { DesignCase } from "./mock-data";
import { getMockCasesForDate } from "./mock-data";

// ——— 图片兜底池（imageUrl 为 null 时使用，与 mock-data 保持一致） ———
const FALLBACK_IMAGES = [
  { url: "/images/arch-01.png", ratio: "3/2" },
  { url: "/images/arch-02.png", ratio: "2/3" },
  { url: "/images/arch-03.png", ratio: "3/2" },
  { url: "/images/arch-04.png", ratio: "2/3" },
  { url: "/images/arch-05.png", ratio: "3/2" },
  { url: "/images/arch-06.png", ratio: "4/5" },
  { url: "/images/arch-07.png", ratio: "4/3" },
  { url: "/images/arch-08.png", ratio: "4/3" },
  { url: "/images/arch-09.png", ratio: "3/2" },
  { url: "/images/arch-10.png", ratio: "4/5" },
];

function pickFallbackImage(
  caseIndex: number,
  daysAgo: number,
  source: "gooood" | "archdaily"
) {
  const pool = FALLBACK_IMAGES.length;
  const half = pool / 2;
  const dayShift = daysAgo * 7;
  const srcOffset = source === "gooood" ? 0 : half;
  return FALLBACK_IMAGES[(dayShift + srcOffset + caseIndex) % pool];
}

export function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ——— 与 scraper/lib/storage.js 保持一致的 JSON 格式 ———
interface RawItem {
  id: string;
  title: string;
  imageUrl: string | null;
  sourceUrl: string;
  source: "gooood" | "archdaily";
  architect: string | null;
  category: string | null;
}

interface DailyPayload {
  date: string;
  lastUpdated: string;
  gooood: RawItem[];
  archdaily: RawItem[];
}

function transformPayload(data: DailyPayload, daysAgo: number): DesignCase[] {
  const toCase = (item: RawItem, i: number): DesignCase => {
    const fb = item.imageUrl ? null : pickFallbackImage(i, daysAgo, item.source);
    return {
      id: item.id,
      title: item.title,
      imageUrl: item.imageUrl ?? fb!.url,
      sourceUrl: item.sourceUrl,
      source: item.source,
      date: data.date,
      architect: item.architect ?? undefined,
      category: item.category ?? undefined,
      // 真实图片统一用 4/3；兜底图使用预设比例
      aspectRatio: item.imageUrl ? "4/3" : fb!.ratio,
    };
  };

  const gCases = data.gooood.map((item, i) => toCase(item, i));
  const aCases = data.archdaily.map((item, i) => toCase(item, i));

  // 交错排列：gooood / archdaily 各一条穿插
  const interleaved: DesignCase[] = [];
  const max = Math.max(gCases.length, aCases.length);
  for (let i = 0; i < max; i++) {
    if (gCases[i]) interleaved.push(gCases[i]);
    if (aCases[i]) interleaved.push(aCases[i]);
  }
  return interleaved;
}

export interface DailyResult {
  cases: DesignCase[];
  lastUpdated: string;
  isReal: boolean; // true = 真实抓取数据；false = mock 兜底
}

/**
 * 优先从 /data/YYYY-MM-DD.json 加载真实抓取数据；
 * 若文件不存在或解析失败，退回 mock 数据。
 */
export async function getCasesForDate(daysAgo: number): Promise<DailyResult> {
  const date = formatDate(daysAgo);
  try {
    const res = await fetch(`/data/${date}.json`, {
      cache: "no-cache",
      signal: AbortSignal.timeout(8_000),
    });
    if (res.ok) {
      const data: DailyPayload = await res.json();
      // 基本校验：必须有 date 和至少一个来源有数据
      if (data.date && (data.gooood?.length || data.archdaily?.length)) {
        return {
          cases: transformPayload(data, daysAgo),
          lastUpdated: new Date(data.lastUpdated).toLocaleString("zh-CN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isReal: true,
        };
      }
    }
  } catch {
    // 网络失败 / 超时 → 使用 mock
  }

  return {
    cases: getMockCasesForDate(daysAgo),
    lastUpdated: date + " 00:00",
    isReal: false,
  };
}

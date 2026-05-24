import * as cheerio from "cheerio";

const URLS = [
  "https://www.archdaily.cn/cn",
  "https://www.archdaily.com",
];
const FETCH_OPTS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
  },
  signal: AbortSignal.timeout(30_000),
};

function resolveUrl(href, base) {
  if (!href) return null;
  if (href.startsWith("http")) return href;
  const origin = new URL(base).origin;
  if (href.startsWith("/")) return origin + href;
  return origin + "/" + href;
}

/**
 * 找到第一个真实图片 URL（跳过 base64 占位图）。
 * archdaily 结构：picture > source[srcset] 优先，再找非 base64 img[src]。
 * 需要传入 cheerio 的 $ 以包装原生 DOM 元素。
 */
function extractRealImage($, $el) {
  const srcset = $el.find("picture source").first().attr("srcset");
  if (srcset && !srcset.startsWith("data:")) return srcset.split(" ")[0];

  let found = null;
  $el.find("img").each((_, img) => {
    const src = $(img).attr("src") || "";
    if (src && !src.startsWith("data:")) {
      found = src;
      return false;
    }
  });
  return found;
}

async function scrapeUrl(url, limit) {
  console.log(`[archdaily] fetching ${url}…`);
  let html;
  try {
    const res = await fetch(url, FETCH_OPTS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error(`[archdaily] fetch error (${url}):`, err.message);
    return null;
  }

  const $ = cheerio.load(html);
  const results = [];

  /**
   * 策略1: archdaily.cn 专属结构
   *   <div class="afd-post-stream">
   *     <h3><a class="afd-title--black-link" href="/cn/...">
   *       <span itemprop="name">中文标题</span>
   *     </a></h3>
   *     <div class="afd-post-content">
   *       <picture><source srcset="https://images.adsttc.com/...">
   *         <img src="https://images.adsttc.com/..." ...>
   */
  $(".afd-post-stream").each((i, el) => {
    if (results.length >= limit) return false;
    const $el = $(el);

    const $titleLink = $el.find("a.afd-title--black-link").first();
    const title = $titleLink.find("span[itemprop='name']").text().trim()
      || $titleLink.text().trim();
    const href = resolveUrl($titleLink.attr("href"), url);
    if (!title || !href) return;

    // 跳过招聘/活动等非项目内容
    if (/招聘|实习|职位|竞赛报名/.test(title)) return;

    const imageUrl = extractRealImage($, $el);

    results.push({
      id: `archdaily-${i}`,
      title,
      imageUrl,
      sourceUrl: href,
      source: "archdaily",
      architect: null,
      category: null,
    });
  });

  // 策略2: 通用 article 结构（archdaily.com fallback）
  if (results.length === 0) {
    console.log(`[archdaily] afd-post-stream strategy failed on ${url}, trying article fallback…`);
    $("article").each((i, el) => {
      if (results.length >= limit) return false;
      const $el = $(el);
      const $titleLink = $el.find("h2 a, h3 a").first();
      const title = $titleLink.text().trim();
      const href = resolveUrl($titleLink.attr("href"), url);
      if (!title || !href || title.length < 5) return;
      const imageUrl = extractRealImage($, $el);
      results.push({
        id: `archdaily-fb-${i}`,
        title,
        imageUrl,
        sourceUrl: href,
        source: "archdaily",
        architect: null,
        category: null,
      });
    });
  }

  return results.length > 0 ? results : null;
}

export async function scrapeArchdaily(limit = 5) {
  for (const url of URLS) {
    const results = await scrapeUrl(url, limit);
    if (results && results.length > 0) {
      console.log(`[archdaily] found ${results.length} items from ${url}`);
      return results;
    }
  }
  console.warn("[archdaily] all URLs failed, returning empty");
  return [];
}

import * as cheerio from "cheerio";

const BASE_URL = "https://www.gooood.cn";
const FETCH_OPTS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Cache-Control": "no-cache",
    "Referer": "https://www.gooood.cn/",
  },
  signal: AbortSignal.timeout(30_000),
};

function resolveUrl(href) {
  if (!href) return null;
  if (href.startsWith("http")) return href;
  if (href.startsWith("/")) return BASE_URL + href;
  return BASE_URL + "/" + href;
}

/**
 * gooood.cn 文章列表结构（服务端渲染）：
 *   <article class="item ... sg-article-item">
 *     <div class="item-thumbnail">
 *       <a href="/slug.htm" title="副标题">
 *         <img src="https://oss.gooood.cn/..." alt="中文标题|English Title">
 *       </a>
 *     </div>
 *   </article>
 */
export async function scrapeGooood(limit = 5) {
  console.log("[gooood] fetching homepage…");
  let html;
  try {
    const res = await fetch(BASE_URL, FETCH_OPTS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    console.error("[gooood] fetch error:", err.message);
    return [];
  }

  const $ = cheerio.load(html);
  const results = [];

  $("article.sg-article-item").each((i, el) => {
    if (results.length >= limit) return false;
    const $el = $(el);

    const $a = $el.find("a").first();
    const href = resolveUrl($a.attr("href"));
    if (!href) return;

    const $img = $el.find("img").first();
    const imageUrl = $img.attr("src") || null;

    // alt 格式: "中文标题|English Title"，取竖线前的中文部分
    const altText = $img.attr("alt") || "";
    const title = (altText.includes("|")
      ? altText.split("|")[0]
      : altText
    ).trim();

    if (!title) return;

    results.push({
      id: `gooood-${i}`,
      title,
      imageUrl,
      sourceUrl: href,
      source: "gooood",
      architect: null,
      category: null,
    });
  });

  console.log(`[gooood] found ${results.length} items`);
  return results;
}

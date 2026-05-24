export type DesignCase = {
  id: string;
  title: string;
  imageUrl: string;
  sourceUrl: string;
  source: "gooood" | "archdaily";
  date: string;
  architect?: string;
  category?: string;
  aspectRatio: string;
};

const images = [
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

const goooodCases = [
  { title: "山间云庭 · 悬崖上的度假住宅", architect: "隈研吾建筑都市设计事务所", category: "住宅" },
  { title: "光之容器 · 苏州当代美术馆", architect: "MAD建筑事务所", category: "文化" },
  { title: "竹林深处 · 安吉精品民宿", architect: "张雷联合建筑事务所", category: "酒店" },
  { title: "城市绿洲 · 深圳社区公园改造", architect: "MVRDV", category: "景观" },
  { title: "浮光掠影 · 杭州西湖边的茶室", architect: "大舍建筑设计事务所", category: "公共" },
  { title: "折叠山谷 · 成都天府科学城展览馆", architect: "Zaha Hadid Architects", category: "文化" },
  { title: "水岸重生 · 上海滨江工业遗址更新", architect: "同济原作设计工作室", category: "改造" },
  { title: "白色迷宫 · 景德镇陶瓷艺术中心", architect: "如恩设计研究室", category: "文化" },
  { title: "墨韵书阁 · 南京浦口图书馆", architect: "非常建筑", category: "公共" },
  { title: "风之走廊 · 海南万宁湾海滨步道", architect: "迹·建筑事务所", category: "景观" },
  { title: "云端之境 · 贵阳观山湖美术馆", architect: "OPEN建筑事务所", category: "文化" },
  { title: "叠石居 · 黄山脚下的山地酒店", architect: "直向建筑", category: "酒店" },
  { title: "编织之桥 · 成都锦江人行桥", architect: "NEXT architects", category: "基础设施" },
  { title: "光影剧场 · 乌镇互联网会议中心", architect: "王澍/业余建筑工作室", category: "公共" },
  { title: "漂浮花园 · 武汉东湖湿地公园", architect: "土人设计", category: "景观" },
];

const archdailyCases = [
  { title: "蛇形画廊2026临时展亭", architect: "Francis Kéré", category: "展览" },
  { title: "哥本哈根海滨公寓综合体", architect: "BIG", category: "住宅" },
  { title: "墨西哥城垂直森林住宅塔楼", architect: "Stefano Boeri Architetti", category: "住宅" },
  { title: "东京新国立竞技场改造计划", architect: "伊东丰雄建筑设计事务所", category: "体育" },
  { title: "巴塞罗那智慧城市创新中心", architect: "OMA", category: "办公" },
  { title: "悉尼歌剧院景观更新", architect: "Snøhetta", category: "景观" },
  { title: "米兰设计博物馆扩建", architect: "David Chipperfield Architects", category: "文化" },
  { title: "纽约曼哈顿高线公园二期延伸段", architect: "Diller Scofidio + Renfro", category: "景观" },
  { title: "新加坡滨海湾花园穹顶改造", architect: "Heatherwick Studio", category: "公共" },
  { title: "巴黎大皇宫修复与当代艺术空间", architect: "Jean Nouvel", category: "文化" },
  { title: "赫尔辛基中央图书馆扩建", architect: "ALA Architects", category: "公共" },
  { title: "迪拜未来博物馆二期", architect: "Killa Design", category: "文化" },
  { title: "伦敦泰晤士河南岸步行桥", architect: "Thomas Heatherwick", category: "基础设施" },
  { title: "首尔汉南洞社区文化中心", architect: "Mass Studies", category: "公共" },
  { title: "苏黎世湖畔温泉度假酒店", architect: "Peter Zumthor", category: "酒店" },
];

function formatDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 图片池 10 张，每天 gooood 取前 5 个槽、archdaily 取后 5 个槽，完全无重复
// 步长 7（与 10 互质）确保跨天也尽量不重复
function pickImage(caseIndex: number, daysAgo: number, source: "gooood" | "archdaily") {
  const pool = images.length; // 10
  const half = pool / 2;      // 5
  const dayShift = daysAgo * 7; // 7 与 10 互质，6 天全不重复
  const srcOffset = source === "gooood" ? 0 : half;
  return images[(dayShift + srcOffset + caseIndex) % pool];
}

export function getMockCasesForDate(daysAgo: number): DesignCase[] {
  const date = formatDate(daysAgo);
  const offset = daysAgo * 5;
  const cases: DesignCase[] = [];

  for (let i = 0; i < 5; i++) {
    const gIdx = (offset + i) % goooodCases.length;
    const g = goooodCases[gIdx];
    const gImg = pickImage(i, daysAgo, "gooood");
    cases.push({
      id: `gooood-${date}-${i}`,
      title: g.title,
      imageUrl: gImg.url,
      sourceUrl: "https://www.gooood.cn",
      source: "gooood",
      date,
      architect: g.architect,
      category: g.category,
      aspectRatio: gImg.ratio,
    });
  }

  for (let i = 0; i < 5; i++) {
    const aIdx = (offset + i) % archdailyCases.length;
    const a = archdailyCases[aIdx];
    const aImg = pickImage(i, daysAgo, "archdaily");
    cases.push({
      id: `archdaily-${date}-${i}`,
      title: a.title,
      imageUrl: aImg.url,
      sourceUrl: "https://www.archdaily.cn",
      source: "archdaily",
      date,
      architect: a.architect,
      category: a.category,
      aspectRatio: aImg.ratio,
    });
  }

  // Interleave sources for visual variety
  const interleaved: DesignCase[] = [];
  const gCases = cases.filter((c) => c.source === "gooood");
  const aCases = cases.filter((c) => c.source === "archdaily");
  const max = Math.max(gCases.length, aCases.length);
  for (let i = 0; i < max; i++) {
    if (gCases[i]) interleaved.push(gCases[i]);
    if (aCases[i]) interleaved.push(aCases[i]);
  }

  return interleaved;
}

export function getDateLabels(): { label: string; sublabel: string; daysAgo: number }[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return {
      label: i === 0 ? "今天" : `${month}月${day}日`,
      sublabel: i === 0 ? `${month}月${day}日` : "",
      daysAgo: i,
    };
  });
}

export function getLastUpdated(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} 00:00`;
}

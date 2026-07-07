const state = {
  heroes: [],
  filtered: [],
  selectedId: "",
  selectedRelatedId: "",
  expandedAbilityId: "",
  view: "heroes",
  language: "zhCN",
  languages: [
    { id: "source", label: "原文" },
    { id: "zhCN", label: "中文" },
  ],
  ratingOverrides: {},
  ratingMessage: "",
  exportedRatingText: "",
  communityShares: [],
  communityMessage: "",
  draggingHeroId: "",
  suppressNextTierClick: false,
  pointerDrag: null,
};

const els = {
  heading: document.querySelector(".topbar h1"),
  summary: document.querySelector("#summary"),
  search: document.querySelector("#search"),
  viewTabs: document.querySelector("#viewTabs"),
  languageSwitch: document.querySelector("#languageSwitch"),
  sidebarTitle: document.querySelector(".sectionTitle"),
  heroList: document.querySelector("#heroList"),
  detail: document.querySelector("#detail"),
};

const views = [
  { id: "heroes", labelKey: "viewHeroes" },
  { id: "ranking", labelKey: "viewRanking" },
  { id: "community", labelKey: "viewCommunity" },
];

const standAxes = [
  { key: "support" },
  { key: "burst" },
  { key: "control" },
  { key: "pressure" },
  { key: "toughness" },
  { key: "aoe" },
];

const uiText = {
  source: {
    pageTitle: "FBT 캐릭터 자료",
    loading: "지도 데이터를 읽는 중...",
    viewTabsLabel: "페이지 전환",
    languageSwitchLabel: "언어 전환",
    searchPlaceholder: "캐릭터, 칭호, 스킬, 설명 검색",
    heroList: "캐릭터 목록",
    selectHero: "캐릭터를 선택하세요",
    viewHeroes: "캐릭터 자료",
    viewRanking: "T등급 랭킹",
    viewCommunity: "커뮤니티 공유",
    unnamedHero: "이름 없는 캐릭터",
    unknownPlayer: "알 수 없는 플레이어",
    noTitle: "칭호 없음",
    noMatchingHero: "일치하는 캐릭터가 없습니다",
    noAbilities: "스킬 그룹을 찾지 못했습니다.",
    radarAriaLabel: "능력치 레이더 차트",
    tierRank: "T등급",
    scoreLabel: "{axis} 점수",
    standTitle: "능력치",
    hexScore: "육각형 {score}/30",
    attributes: "속성",
    vitals: "자원",
    combat: "공격",
    missing: "없음",
    primaryTitle: "{name}, 주 속성",
    primaryBadge: "주",
    exclusiveItem: "전용 아이템",
    exclusiveButton: "전용",
    exclusiveSkill: "전용 스킬",
    baseForm: "기본",
    formFallback: "형태",
    formSwitchAria: "캐릭터 형태",
    hotkey: "단축키",
    position: "위치",
    from: "출처",
    inheritedFrom: "상속",
    abilityHint: "스킬 아이콘을 클릭하면 설명을 볼 수 있습니다",
    summonHotkey: "소환 단축키",
    source: "출처",
    descriptionTitle: "캐릭터 설명",
    statsTitle: "기본 데이터",
    skillsTitle: "스킬",
    rankingTitle: "T등급 랭킹",
    rankingHint: "T등급과 육각형 점수는 직접 수정할 수 있습니다. 캐릭터에 마우스를 올리면 6개 항목이 표시됩니다.",
    communityTitle: "커뮤니티 공유",
    communityHint: "관리자가 승인한 플레이어 설정입니다.",
    communityEmpty: "아직 승인된 공유 데이터가 없습니다.",
    communityPlayer: "플레이어",
    communityReview: "관리자 평가",
    communityApply: "적용",
    communityCopy: "복사",
    communityCount: "{count}개 공유",
    communityRatingMeta: "{count}명 설정 · {length}자",
    communityApplied: "{name} 설정을 적용했습니다.",
    communityCopied: "{name} 설정을 복사했습니다.",
    communityInvalid: "공유 데이터 오류: {message}",
    communityLoadFailed: "공유 데이터를 읽지 못했습니다: {message}",
    communityScoreLabel: "관리자 점수 {score}/10",
    communityShareMine: "나도 공유하기",
    communityShareEmpty: "먼저 T등급이나 육각형 점수를 수정한 뒤 공유하세요.",
    communityShareCopied: "현재 설정을 복사했습니다. GitHub Issue 페이지로 이동합니다.",
    communityIssueTitle: "커뮤니티 공유: {name}",
    communityIssueBody:
      "플레이어 이름:\n\n관리자 평가:\n\n공유 데이터:\n{rating}\n",
    export: "내보내기",
    import: "가져오기",
    heroCount: "{count}명",
    dragTierAria: "{name} 드래그해 T등급 수정",
    emptyTier: "없음",
    summary: "총 {total}명, 현재 {shown}명 표시",
    copyPrompt: "아래 설정을 복사하세요",
    pastePrompt: "점수 설정을 붙여넣으세요",
    exportedRating: "base64 설정을 클립보드에 내보냈습니다. 길이 {length}.",
    importedRating: "{count}명의 T등급과 점수를 가져왔습니다.",
    urlImportedRating: "URL에서 {count}명의 T등급과 점수를 가져왔습니다.",
    importExportFailed: "가져오기/내보내기 실패: {message}",
    fetchFailed: "data/heroes.json을 읽지 못했습니다",
    invalidBase64: "유효한 base64 점수 설정이 아닙니다",
    unsupportedVersion: "지원하지 않는 설정 버전 {version}",
    incompleteConfig: "base64 설정이 완전하지 않습니다",
    languageLabels: {
      source: "한국어",
      zhCN: "중국어",
    },
    statLabels: {
      hp: "체력",
      mana: "마나",
    },
    combatStatLabels: {
      attackBase: "기본",
      cooldown: "간격",
      range: "사거리",
    },
    primaryStatNames: {
      STR: "힘",
      AGI: "민첩",
      INT: "지능",
    },
    standAxes: {
      support: "지원",
      burst: "버스트",
      control: "제어",
      pressure: "영격 봉쇄",
      toughness: "탱킹",
      aoe: "AOE",
    },
  },
  zhCN: {
    pageTitle: "FBT 角色资料",
    loading: "正在读取地图数据...",
    viewTabsLabel: "页面切换",
    languageSwitchLabel: "语言切换",
    searchPlaceholder: "搜索角色、称号、技能、说明",
    heroList: "角色列表",
    selectHero: "请选择一个角色",
    viewHeroes: "角色资料",
    viewRanking: "T度排行",
    viewCommunity: "社区分享",
    unnamedHero: "未命名角色",
    unknownPlayer: "未命名玩家",
    noTitle: "无称号",
    noMatchingHero: "没有匹配的角色",
    noAbilities: "没有解析到技能分组。",
    radarAriaLabel: "能力参数雷达图",
    tierRank: "T度",
    scoreLabel: "{axis}评分",
    standTitle: "能力参数",
    hexScore: "六边形 {score}/30",
    attributes: "属性",
    vitals: "资源",
    combat: "攻击",
    missing: "缺失",
    primaryTitle: "{name}，主属性",
    primaryBadge: "主",
    exclusiveItem: "专属物品",
    exclusiveButton: "专属",
    exclusiveSkill: "专属技能",
    baseForm: "基础",
    formFallback: "形态",
    formSwitchAria: "角色形态",
    hotkey: "热键",
    position: "位置",
    from: "来自",
    inheritedFrom: "继承自",
    abilityHint: "点击技能图标查看说明",
    summonHotkey: "召唤热键",
    source: "来源",
    descriptionTitle: "角色说明",
    statsTitle: "基础数据",
    skillsTitle: "技能",
    rankingTitle: "T度排行",
    rankingHint: "T度与六边形评分均可手动修改；悬停角色查看具体六项。",
    communityTitle: "社区分享",
    communityHint: "这里展示管理员审核通过的玩家配置。",
    communityEmpty: "暂无已审核的社区分享。",
    communityPlayer: "玩家名字",
    communityReview: "管理员评价",
    communityApply: "应用配置",
    communityCopy: "复制数据",
    communityCount: "{count} 个分享",
    communityRatingMeta: "{count} 位角色配置 · {length} 字符",
    communityApplied: "已应用 {name} 的分享配置。",
    communityCopied: "已复制 {name} 的分享数据。",
    communityInvalid: "分享数据错误：{message}",
    communityLoadFailed: "读取社区分享失败：{message}",
    communityScoreLabel: "管理员评分 {score}/10",
    communityShareMine: "我要分享",
    communityShareEmpty: "请先修改 T度或六边形评分后再分享。",
    communityShareCopied: "已复制当前配置，即将跳转到 GitHub 新 Issue 页面。",
    communityIssueTitle: "社区分享：{name}",
    communityIssueBody:
      "玩家名字：\n\n管理员评价：\n\n分享数据：\n{rating}\n",
    export: "导出",
    import: "导入",
    heroCount: "{count} 位角色",
    dragTierAria: "拖动 {name} 修改T度",
    emptyTier: "暂无",
    summary: "共 {total} 个角色，当前显示 {shown} 个",
    copyPrompt: "复制以下配置",
    pastePrompt: "粘贴评分配置",
    exportedRating: "已导出 base64 配置到剪贴板，长度 {length}。",
    importedRating: "已导入 {count} 位角色的 T度与评分。",
    urlImportedRating: "已从 URL 导入 {count} 位角色的 T度与评分。",
    importExportFailed: "导入/导出失败：{message}",
    fetchFailed: "读取 data/heroes.json 失败",
    invalidBase64: "不是有效的 base64 评分配置",
    unsupportedVersion: "不支持的配置版本 {version}",
    incompleteConfig: "base64 配置不完整",
    languageLabels: {
      source: "韩文",
      zhCN: "中文",
    },
    statLabels: {
      hp: "生命",
      mana: "魔法",
    },
    combatStatLabels: {
      attackBase: "基础",
      cooldown: "间隔",
      range: "射程",
    },
    primaryStatNames: {
      STR: "力量",
      AGI: "敏捷",
      INT: "智力",
    },
    standAxes: {
      support: "支援",
      burst: "爆发",
      control: "控制",
      pressure: "压灵",
      toughness: "生存能力",
      aoe: "AOE",
    },
  },
};

const standGrades = ["", "E", "D", "C", "B", "A"];
const tierLevels = [0, 1, 2, 3, 4, 5];
const compactRatingVersion = 2;
const compactRatingMagic = [70, 66, 84, 82];
const shortRatingVersion = 1;
const shortRatingPrefix = ".";
const ratingIdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ratingShortIdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ratingUrlParamNames = ["rating", "ratings", "r", "fbt", "config"];
const ratingStorageKey = "fbt.ratingOverrides.v2";
const communityIssueUrl = "https://github.com/craftqwq/FBT-public/issues/new";
const excludedHeroIds = new Set(["E09H", "E05Y"]);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

function formatText(template, values = {}) {
  return String(template ?? "").replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

function t(path, values = {}) {
  const languageText = uiText[state.language] || uiText.source;
  const value = readPath(languageText, path) ?? readPath(uiText.source, path) ?? path;
  return formatText(value, values);
}

function axisLabel(axisOrKey) {
  const key = typeof axisOrKey === "string" ? axisOrKey : axisOrKey.key;
  return t(`standAxes.${key}`);
}

function languageLabel(language) {
  const languageText = uiText[state.language] || uiText.source;
  return readPath(languageText, `languageLabels.${language.id}`) || language.label || language.id;
}

function languageFlagClass(languageId) {
  return (
    {
      source: "flagKr",
      zhCN: "flagCn",
    }[languageId] || "flagFallback"
  );
}

function renderStaticChrome() {
  document.title = t("pageTitle");
  if (els.heading) els.heading.textContent = t("pageTitle");
  if (els.search) els.search.placeholder = t("searchPlaceholder");
  if (els.viewTabs) els.viewTabs.setAttribute("aria-label", t("viewTabsLabel"));
  if (els.languageSwitch) els.languageSwitch.setAttribute("aria-label", t("languageSwitchLabel"));
  if (els.sidebarTitle) els.sidebarTitle.textContent = t("heroList");
}

function playableHeroes(heroes = []) {
  return heroes
    .filter((hero) => !excludedHeroIds.has(hero.id))
    .map((hero) => ({
      ...hero,
      relatedHeroes: (hero.relatedHeroes || []).filter((relatedHero) => !excludedHeroIds.has(relatedHero.id)),
    }));
}

function initials(name, id) {
  const source = name || id;
  return Array.from(source).slice(0, 2).join("");
}

function renderIcon(asset, fallback, className, alt = "") {
  const label = escapeHtml(fallback || "");
  if (!asset) {
    return `<div class="${className}">${label}</div>`;
  }

  return `
    <div class="${className}">
      <img src="${escapeHtml(asset)}" alt="${escapeHtml(alt)}" loading="lazy" />
    </div>
  `;
}

function localized(entity, key, language = state.language) {
  return entity?.translations?.[language]?.[key] || entity?.[key] || "";
}

function localizedEntity(entity, language = state.language) {
  if (!entity) return {};
  const translation = entity.translations?.[language] || {};
  return { ...entity, ...translation };
}

function localizedHero(hero, language = state.language) {
  const result = localizedEntity(hero, language);
  result.abilities = (hero.abilities || []).map((ability) => localizedEntity(ability, language));
  result.relatedHeroes = (hero.relatedHeroes || []).map((relatedHero) => localizedHero(relatedHero, language));
  if (hero.exclusiveWeapon) {
    result.exclusiveWeapon = localizedEntity(hero.exclusiveWeapon, language);
    if (hero.exclusiveWeapon.grantedSkill) {
      result.exclusiveWeapon.grantedSkill = localizedEntity(hero.exclusiveWeapon.grantedSkill, language);
    }
  }
  return result;
}

function translationText(entity) {
  return Object.values(entity?.translations || {})
    .map((translation) => Object.values(translation).join(" "))
    .join(" ");
}

function heroTextForSearch(hero) {
  return [
    hero.id,
    hero.name,
    hero.title,
    hero.description,
    hero.summonTip,
    translationText(hero),
    (hero.abilities || []).map((ability) => `${ability.name} ${ability.description}`).join(" "),
    (hero.abilities || []).map((ability) => translationText(ability)).join(" "),
    hero.exclusiveWeapon
      ? `${hero.exclusiveWeapon.name} ${hero.exclusiveWeapon.description} ${translationText(hero.exclusiveWeapon)} ${hero.exclusiveWeapon.grantedSkill?.name || ""} ${hero.exclusiveWeapon.grantedSkill?.description || ""} ${translationText(hero.exclusiveWeapon.grantedSkill)}`
      : "",
  ].join(" ");
}

function searchable(hero) {
  const localizedSearchHero = localizedHero(hero);
  return [
    heroTextForSearch(hero),
    heroTextForSearch(localizedSearchHero),
    (hero.relatedHeroes || []).map((relatedHero) => heroTextForSearch(relatedHero)).join(" "),
    (localizedSearchHero.relatedHeroes || []).map((relatedHero) => heroTextForSearch(relatedHero)).join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function renderList() {
  els.heroList.innerHTML = state.filtered
    .map((hero) => {
      const displayHero = localizedHero(hero);
      const name = displayHero.name || t("unnamedHero");
      const title = displayHero.title || t("noTitle");
      return `
        <button class="heroButton ${hero.id === state.selectedId ? "active" : ""}" data-id="${escapeHtml(hero.id)}">
          ${renderIcon(hero.iconAsset, initials(name, hero.id), "heroIcon", name || hero.id)}
          <div>
            <div class="heroName">${escapeHtml(name)}</div>
            <div class="heroTitle">${escapeHtml(title)}</div>
          </div>
          <div class="heroId">${escapeHtml(hero.id)}</div>
        </button>
      `;
    })
    .join("");
}

function renderViewTabs() {
  if (!els.viewTabs) return;

  els.viewTabs.innerHTML = views
    .map(
      (view) => `
        <button
          type="button"
          class="${view.id === state.view ? "active" : ""}"
          data-view="${escapeHtml(view.id)}"
          aria-pressed="${view.id === state.view ? "true" : "false"}"
        >
          ${escapeHtml(t(view.labelKey))}
        </button>
      `,
    )
    .join("");
}

function renderLanguageSwitch() {
  if (!els.languageSwitch) return;

  els.languageSwitch.innerHTML = state.languages
    .map(
      (language) => `
        <button
          type="button"
          class="${language.id === state.language ? "active" : ""}"
          data-language="${escapeHtml(language.id)}"
          aria-pressed="${language.id === state.language ? "true" : "false"}"
        >
          <span class="languageFlag ${languageFlagClass(language.id)}" aria-hidden="true"></span>
          <span>${escapeHtml(languageLabel(language))}</span>
        </button>
      `,
    )
    .join("");
  document.documentElement.lang = state.language === "zhCN" ? "zh-CN" : "ko";
  renderStaticChrome();
}

function numericStat(stats, key) {
  const value = Number.parseFloat(stats?.[key]);
  return Number.isFinite(value) ? value : 0;
}

function weightedCount(text, rules) {
  return rules.reduce((total, [pattern, weight, cap = Infinity]) => {
    const hits = text.match(pattern)?.length || 0;
    return total + Math.min(hits * weight, cap);
  }, 0);
}

function multiplierScore(text) {
  const values = [...text.matchAll(/(?:x|X|×|\*)\s*(\d+(?:\.\d+)?)/g)].map((match) => Number.parseFloat(match[1]));
  const score = values.reduce((total, value) => {
    if (!Number.isFinite(value)) return total;
    if (value >= 25) return total + 0.8;
    if (value >= 15) return total + 0.55;
    if (value >= 8) return total + 0.35;
    if (value >= 5) return total + 0.2;
    return total;
  }, 0);

  return Math.min(score, 2.4);
}

function gradeScore(value) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function normalizeTier(value) {
  const tier = Number.parseInt(value, 10);
  return Number.isFinite(tier) ? Math.max(0, Math.min(5, tier)) : 3;
}

function normalizeScore(value) {
  return gradeScore(Number.parseFloat(value));
}

function normalizeOrder(value) {
  const order = Number.parseFloat(value);
  return Number.isFinite(order) ? Math.max(0, order) : null;
}

function defaultTierFromScore(score) {
  if (score >= 29) return 0;
  if (score >= 26) return 1;
  if (score >= 23) return 2;
  if (score >= 20) return 3;
  if (score >= 17) return 4;
  return 5;
}

function heroOverride(id) {
  return state.ratingOverrides[id] || {};
}

function baseStandStats(hero) {
  const stats = hero.stats || {};
  const scoringLanguage = hero.translations?.zhCN ? "zhCN" : state.language;
  const displayHero = localizedHero(hero, scoringLanguage);
  const text = [
    displayHero.description,
    ...layoutEntriesForHero(displayHero).map((entry) => `${entry.name || ""} ${entry.description || ""}`),
  ].join("\n");
  const hp = numericStat(stats, "hp");
  const str = numericStat(stats, "str");
  const attackBase = numericStat(stats, "attackBase");
  const range = numericStat(stats, "range");
  const armor = numericStat(stats, "armor");

  const rawScores = {
    support:
      1 +
      weightedCount(text, [
        [/治疗|回复|恢复|回血|生命恢复|再生/g, 0.8, 1.8],
        [/友军|队友|盟友|全体友方|周围友军|召唤物/g, 0.7, 1.4],
        [/护盾|吸收伤害|净化|驱散|解除|清除.*负面|免疫.*控制/g, 0.55, 1.4],
        [/加速|移动速度|冷却.*减少|强化|增益|充能|刷新/g, 0.35, 1.0],
      ]),
    burst:
      1 +
      multiplierScore(text) +
      weightedCount(text, [
        [/爆炸|爆发|终式|斩杀|秒杀|暴击|巨额|蓄力|追加.*伤害/g, 0.45, 1.4],
        [/造成/g, 0.12, 0.8],
      ]) +
      (attackBase >= 450 ? 0.7 : attackBase >= 350 ? 0.35 : 0),
    control:
      1 +
      weightedCount(text, [
        [/眩晕|昏迷|定身|禁锢|束缚|沉默|禁魔|缴械|无法.*使用/g, 0.45, 2.2],
        [/击退|击飞|浮空|拉向|牵引|减速|恐惧|嘲讽/g, 0.35, 1.6],
        [/无法选中|无法打断|打断|清除.*投射物/g, 0.25, 0.9],
      ]),
    pressure:
      1 +
      weightedCount(text, [
        [/灵压|压制|破防|降低.*防御|减少.*护甲|无视.*防御|无视.*护甲/g, 0.65, 1.8],
        [/魔法等级|物理等级|防御等级|LV[3-9]/g, 0.3, 1.2],
        [/无限制|刷新|重置|持续|标记|穿透|追踪/g, 0.35, 1.4],
        [/每秒|持续.*伤害|灼烧|中毒|流血/g, 0.35, 1.0],
      ]) +
      (stats.primary === "INT" ? 0.25 : 0),
    toughness:
      1 +
      weightedCount(text, [
        [/无敌|免疫|无法选中|护盾|吸收伤害|减伤|防御|护甲/g, 0.55, 1.8],
        [/恢复|回复|治疗|回血|复活|生命/g, 0.35, 1.2],
        [/清除.*投射物|期间仅可移动|无法打断/g, 0.25, 0.8],
      ]) +
      (hp >= 12000 ? 0.45 : hp >= 10000 ? 0.25 : 0) +
      (str >= 90 ? 0.45 : str >= 75 ? 0.25 : 0) +
      (armor >= 5 ? 0.2 : 0),
    aoe:
      1 +
      weightedCount(text, [
        [/范围|影响范围|周围|区域|圆形|扇形|路径|爆炸|扩散/g, 0.45, 2.3],
        [/所有敌人|敌人们|范围内敌人|范围内的敌人|群体/g, 0.45, 1.4],
        [/弹射|分裂|冲击波|风暴|领域/g, 0.45, 1.2],
      ]) +
      (range >= 800 ? 0.45 : range >= 500 ? 0.25 : 0),
  };

  return standAxes.map((axis) => {
    const score = gradeScore(rawScores[axis.key]);
    return { ...axis, label: axisLabel(axis), score, grade: standGrades[score] };
  });
}

function calculateStandStats(hero) {
  const baseRatings = baseStandStats(hero);
  const scores = heroOverride(hero.id).scores || {};

  return baseRatings.map((axis) => {
    const score = scores[axis.key] == null ? axis.score : normalizeScore(scores[axis.key]);
    return { ...axis, score, grade: standGrades[score] };
  });
}

function tierForHero(hero) {
  const override = heroOverride(hero.id);
  if (override.tier != null) return normalizeTier(override.tier);
  return defaultTierFromScore(sumStandScores(baseStandStats(hero)));
}

function orderForHero(hero) {
  return normalizeOrder(heroOverride(hero.id).order);
}

function tierLabel(tier) {
  return `T${normalizeTier(tier)}`;
}

function setRatingMessage(message) {
  state.ratingMessage = message;
  renderCurrentView();
}

function heroIdToNumber(id) {
  if (!/^[0-9A-Za-z]{4}$/.test(id)) return null;
  let value = 0;
  for (const char of id) {
    const index = ratingIdAlphabet.indexOf(char);
    if (index < 0) return null;
    value = value * ratingIdAlphabet.length + index;
  }
  return value;
}

function numberToHeroId(value) {
  if (!Number.isInteger(value) || value < 0) return "";
  const base = ratingIdAlphabet.length;
  let remaining = value;
  const chars = [];
  for (let i = 0; i < 4; i += 1) {
    chars.unshift(ratingIdAlphabet[remaining % base]);
    remaining = Math.floor(remaining / base);
  }
  return remaining === 0 ? chars.join("") : "";
}

function shortIdValue(text) {
  let value = 0;
  for (const char of text) {
    const index = ratingShortIdAlphabet.indexOf(char);
    if (index < 0) return null;
    value = value * ratingShortIdAlphabet.length + index;
  }
  return value;
}

function shortIdText(value, length) {
  if (!Number.isInteger(value) || value < 0) return "";
  let remaining = value;
  const chars = [];
  for (let index = 0; index < length; index += 1) {
    chars.unshift(ratingShortIdAlphabet[remaining % ratingShortIdAlphabet.length]);
    remaining = Math.floor(remaining / ratingShortIdAlphabet.length);
  }
  return remaining === 0 ? chars.join("") : "";
}

function canEncodeShortHeroId(id) {
  return /^E[0-9A-Z]{3}$/.test(id) || /^HH[0-9A-Z]{2}$/.test(id) || /^[0-9A-Z]{4}$/.test(id);
}

function writeShortHeroId(writer, id) {
  if (/^E[0-9A-Z]{3}$/.test(id)) {
    writer.write(0, 1);
    writer.write(shortIdValue(id.slice(1)), 16);
    return;
  }

  writer.write(1, 1);
  if (/^HH[0-9A-Z]{2}$/.test(id)) {
    writer.write(0, 1);
    writer.write(shortIdValue(id.slice(2)), 11);
    return;
  }

  writer.write(1, 1);
  writer.write(shortIdValue(id), 21);
}

function readShortHeroId(reader) {
  if (reader.read(1) === 0) {
    return `E${shortIdText(reader.read(16), 3)}`;
  }

  if (reader.read(1) === 0) {
    return `HH${shortIdText(reader.read(11), 2)}`;
  }

  return shortIdText(reader.read(21), 4);
}

function base64UrlFromBytes(bytes) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function bytesFromBase64Url(text) {
  const normalized = text.trim().replace(/^FBTR:/i, "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

class BitWriter {
  constructor() {
    this.bytes = [];
    this.current = 0;
    this.bitCount = 0;
  }

  write(value, bits) {
    let remaining = Number(value) || 0;
    for (let index = 0; index < bits; index += 1) {
      this.current |= ((remaining >> index) & 1) << this.bitCount;
      this.bitCount += 1;
      if (this.bitCount === 8) {
        this.bytes.push(this.current);
        this.current = 0;
        this.bitCount = 0;
      }
    }
  }

  toBytes() {
    if (this.bitCount) {
      this.bytes.push(this.current);
      this.current = 0;
      this.bitCount = 0;
    }
    return this.bytes;
  }
}

class BitReader {
  constructor(bytes) {
    this.bytes = bytes;
    this.bitIndex = 0;
  }

  read(bits) {
    let value = 0;
    for (let index = 0; index < bits; index += 1) {
      if (this.bitIndex >= this.bytes.length * 8) {
        throw new Error(t("incompleteConfig"));
      }
      const byte = this.bytes[Math.floor(this.bitIndex / 8)];
      value |= ((byte >> (this.bitIndex % 8)) & 1) << index;
      this.bitIndex += 1;
    }
    return value;
  }
}

function pushUint24(bytes, value) {
  bytes.push((value >> 16) & 255, (value >> 8) & 255, value & 255);
}

function readUint24(bytes, offset) {
  return (bytes[offset] << 16) | (bytes[offset + 1] << 8) | bytes[offset + 2];
}

function scoreMaskFor(scores = {}) {
  return standAxes.reduce((mask, axis, index) => (scores[axis.key] == null ? mask : mask | (1 << index)), 0);
}

function compactScoreBytes(scores = {}, scoreMask = 0) {
  const bytes = [];
  let bits = 0;
  let bitCount = 0;

  standAxes.forEach((axis, index) => {
    if ((scoreMask & (1 << index)) === 0) return;

    bits |= (normalizeScore(scores[axis.key]) - 1) << bitCount;
    bitCount += 3;
    while (bitCount >= 8) {
      bytes.push(bits & 255);
      bits >>= 8;
      bitCount -= 8;
    }
  });

  if (bitCount) {
    bytes.push(bits & 255);
  }

  return bytes;
}

function readCompactScores(bytes, offset, scoreMask = 0) {
  const scores = {};
  let cursor = offset;
  let bits = 0;
  let bitCount = 0;

  standAxes.forEach((axis, index) => {
    if ((scoreMask & (1 << index)) === 0) return;

    while (bitCount < 3) {
      if (cursor >= bytes.length) throw new Error(t("incompleteConfig"));
      bits |= bytes[cursor] << bitCount;
      cursor += 1;
      bitCount += 8;
    }

    scores[axis.key] = normalizeScore((bits & 7) + 1);
    bits >>= 3;
    bitCount -= 3;
  });

  return { scores, offset: cursor };
}

function normalizedRatingOverrides(input) {
  const source = input?.heroes || input?.ratings || input || {};
  const result = {};
  const heroIds = new Set(state.heroes.map((hero) => hero.id));

  for (const [id, value] of Object.entries(source)) {
    if (!heroIds.has(id)) continue;

    const entry = {};
    if (value?.tier != null) {
      entry.tier = normalizeTier(value.tier);
    }
    const order = normalizeOrder(value?.order);
    if (order != null) {
      entry.order = order;
    }

    const sourceScores = value?.scores || value?.stand || value?.ratings || {};
    const scores = {};
    for (const axis of standAxes) {
      if (sourceScores[axis.key] != null) {
        scores[axis.key] = normalizeScore(sourceScores[axis.key]);
      }
    }
    if (Object.keys(scores).length) {
      entry.scores = scores;
    }

    if (Object.keys(entry).length) {
      result[id] = entry;
    }
  }

  return result;
}

function ratingEntries() {
  const heroOrder = new Map(state.heroes.map((hero, index) => [hero.id, index]));
  return Object.entries(normalizedRatingOverrides(state.ratingOverrides))
    .map(([id, value]) => ({
      id,
      idValue: heroIdToNumber(id),
      tier: value.tier,
      order: normalizeOrder(value.order),
      scores: value.scores || {},
    }))
    .sort((a, b) => (heroOrder.get(a.id) ?? 9999) - (heroOrder.get(b.id) ?? 9999));
}

function encodeLegacyRatingPayload() {
  const bytes = [...compactRatingMagic, compactRatingVersion];
  const entries = ratingEntries().filter((entry) => entry.idValue != null);

  bytes.push((entries.length >> 8) & 255, entries.length & 255);

  for (const entry of entries) {
    const hasTier = entry.tier != null;
    const hasOrder = entry.order != null;
    const scoreMask = scoreMaskFor(entry.scores);
    const flags = scoreMask | (hasTier ? 64 : 0) | (hasOrder ? 128 : 0);

    pushUint24(bytes, entry.idValue);
    bytes.push(flags);

    if (hasTier && hasOrder) {
      const tierOrder = (normalizeTier(entry.tier) & 7) | (Math.max(0, Math.min(255, Math.round(entry.order))) << 3);
      bytes.push(tierOrder & 255, (tierOrder >> 8) & 255);
    } else if (hasTier) {
      bytes.push(normalizeTier(entry.tier) & 7);
    } else if (hasOrder) {
      bytes.push(Math.max(0, Math.min(255, Math.round(entry.order))));
    }

    bytes.push(...compactScoreBytes(entry.scores, scoreMask));
  }

  return base64UrlFromBytes(bytes);
}

function encodeShortRatingPayload() {
  const allEntries = ratingEntries();
  const entries = allEntries.filter((entry) => canEncodeShortHeroId(entry.id));
  if (entries.length > 255 || entries.length !== allEntries.length) return "";

  const writer = new BitWriter();
  writer.write(shortRatingVersion, 3);
  writer.write(entries.length, 8);

  for (const entry of entries) {
    const hasTier = entry.tier != null;
    const hasOrder = entry.order != null;
    const scoreMask = scoreMaskFor(entry.scores);

    writeShortHeroId(writer, entry.id);
    writer.write(scoreMask, 6);
    writer.write(hasTier ? 1 : 0, 1);
    writer.write(hasOrder ? 1 : 0, 1);

    if (hasTier) {
      writer.write(normalizeTier(entry.tier), 3);
    }
    if (hasOrder) {
      writer.write(Math.max(0, Math.min(255, Math.round(entry.order))), 8);
    }

    standAxes.forEach((axis, index) => {
      if ((scoreMask & (1 << index)) !== 0) {
        writer.write(normalizeScore(entry.scores[axis.key]) - 1, 3);
      }
    });
  }

  return `${shortRatingPrefix}${base64UrlFromBytes(writer.toBytes())}`;
}

function encodeRatingPayload() {
  const legacy = encodeLegacyRatingPayload();
  const short = encodeShortRatingPayload();
  return short && short.length < legacy.length ? short : legacy;
}

function decodeCompactRatingPayload(text) {
  const bytes = bytesFromBase64Url(text);
  if (bytes.length < 7 || compactRatingMagic.some((byte, index) => bytes[index] !== byte)) {
    throw new Error(t("invalidBase64"));
  }
  if (bytes[4] !== compactRatingVersion) {
    throw new Error(t("unsupportedVersion", { version: bytes[4] }));
  }

  const heroIds = new Set(state.heroes.map((hero) => hero.id));
  const count = (bytes[5] << 8) | bytes[6];
  const result = {};
  let offset = 7;

  for (let index = 0; index < count; index += 1) {
    if (offset + 4 > bytes.length) throw new Error(t("incompleteConfig"));
    const id = numberToHeroId(readUint24(bytes, offset));
    offset += 3;
    const flags = bytes[offset++];
    const scoreMask = flags & 63;
    const hasTier = Boolean(flags & 64);
    const hasOrder = Boolean(flags & 128);
    const entry = {};

    if (hasTier && hasOrder) {
      if (offset + 2 > bytes.length) throw new Error(t("incompleteConfig"));
      const tierOrder = bytes[offset++] | (bytes[offset++] << 8);
      entry.tier = normalizeTier(tierOrder & 7);
      entry.order = normalizeOrder(tierOrder >> 3);
    } else if (hasTier) {
      if (offset + 1 > bytes.length) throw new Error(t("incompleteConfig"));
      entry.tier = normalizeTier(bytes[offset++]);
    } else if (hasOrder) {
      if (offset + 1 > bytes.length) throw new Error(t("incompleteConfig"));
      entry.order = normalizeOrder(bytes[offset++]);
    }

    if (scoreMask) {
      const decoded = readCompactScores(bytes, offset, scoreMask);
      entry.scores = decoded.scores;
      offset = decoded.offset;
    }

    if (heroIds.has(id) && Object.keys(entry).length) {
      result[id] = entry;
    }
  }

  return result;
}

function decodeShortRatingPayload(text) {
  const bytes = bytesFromBase64Url(text.slice(shortRatingPrefix.length));
  const reader = new BitReader(bytes);
  const version = reader.read(3);
  if (version !== shortRatingVersion) {
    throw new Error(t("unsupportedVersion", { version }));
  }

  const heroIds = new Set(state.heroes.map((hero) => hero.id));
  const count = reader.read(8);
  const result = {};

  for (let index = 0; index < count; index += 1) {
    const id = readShortHeroId(reader);
    const scoreMask = reader.read(6);
    const hasTier = Boolean(reader.read(1));
    const hasOrder = Boolean(reader.read(1));
    const entry = {};

    if (hasTier) {
      entry.tier = normalizeTier(reader.read(3));
    }
    if (hasOrder) {
      entry.order = normalizeOrder(reader.read(8));
    }

    if (scoreMask) {
      const scores = {};
      standAxes.forEach((axis, axisIndex) => {
        if ((scoreMask & (1 << axisIndex)) !== 0) {
          scores[axis.key] = normalizeScore(reader.read(3) + 1);
        }
      });
      entry.scores = scores;
    }

    if (heroIds.has(id) && Object.keys(entry).length) {
      result[id] = entry;
    }
  }

  return result;
}

function ratingTextFromUrl(value, options = {}) {
  const { allowHashPayload = true } = options;
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed, window.location.href);
    const searchParams = url.searchParams;
    const hashText = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    const hashQueryText = hashText.includes("?") ? hashText.slice(hashText.indexOf("?") + 1) : hashText;
    const hashParams = new URLSearchParams(hashQueryText);

    for (const name of ratingUrlParamNames) {
      const fromSearch = searchParams.get(name);
      if (fromSearch) return fromSearch.trim();

      const fromHash = hashParams.get(name);
      if (fromHash) return fromHash.trim();
    }

    if (!allowHashPayload || !hashText || hashText.includes("=")) return "";
    return decodeURIComponent(hashText).trim();
  } catch {
    return "";
  }
}

function ratingImportText(value) {
  const trimmed = value.trim();
  return ratingTextFromUrl(trimmed) || trimmed;
}

function parseRatingImport(text) {
  const trimmed = ratingImportText(text);
  if (!trimmed) return {};
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return normalizedRatingOverrides(JSON.parse(trimmed));
  }
  if (trimmed.startsWith(shortRatingPrefix)) {
    return decodeShortRatingPayload(trimmed);
  }
  return decodeCompactRatingPayload(trimmed);
}

function currentRatingPayload() {
  return Object.keys(normalizedRatingOverrides(state.ratingOverrides)).length ? encodeRatingPayload() : "";
}

function removeRatingParamsFromHash(url) {
  const hashText = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
  if (!hashText || !hashText.includes("=")) return;

  const queryIndex = hashText.indexOf("?");
  const hashPrefix = queryIndex === -1 ? "" : hashText.slice(0, queryIndex);
  const queryText = queryIndex === -1 ? hashText : hashText.slice(queryIndex + 1);
  const params = new URLSearchParams(queryText);
  let changed = false;

  for (const name of ratingUrlParamNames) {
    if (!params.has(name)) continue;
    params.delete(name);
    changed = true;
  }

  if (!changed) return;

  const nextQuery = params.toString();
  const nextHash = hashPrefix ? `${hashPrefix}${nextQuery ? `?${nextQuery}` : ""}` : nextQuery;
  url.hash = nextHash ? `#${nextHash}` : "";
}

function syncRatingUrl(payload = currentRatingPayload()) {
  try {
    if (!window.history?.replaceState) return;

    const url = new URL(window.location.href);
    for (const name of ratingUrlParamNames) {
      url.searchParams.delete(name);
    }
    removeRatingParamsFromHash(url);

    if (payload) {
      url.searchParams.set(ratingUrlParamNames[0], payload);
    }

    window.history.replaceState(window.history.state, "", url);
  } catch (error) {
    console.warn("Failed to sync rating URL", error);
  }
}

function saveRatingCache() {
  let payload = "";
  try {
    payload = currentRatingPayload();
    if (!payload) {
      localStorage.removeItem(ratingStorageKey);
    } else {
      localStorage.setItem(ratingStorageKey, payload);
    }
  } catch (error) {
    console.warn("Failed to save rating cache", error);
    try {
      payload = currentRatingPayload();
    } catch {}
  }
  syncRatingUrl(payload);
}

function loadRatingCache() {
  try {
    const text = localStorage.getItem(ratingStorageKey);
    if (!text) return 0;

    state.ratingOverrides = parseRatingImport(text);
    return Object.keys(state.ratingOverrides).length;
  } catch (error) {
    console.warn("Failed to load rating cache", error);
    return 0;
  }
}

function applyRatingImportText(text, options = {}) {
  const { persist = true } = options;
  const nextOverrides = parseRatingImport(text);
  state.ratingOverrides = nextOverrides;
  state.exportedRatingText = "";
  if (persist) saveRatingCache();
  renderList();
  return Object.keys(nextOverrides).length;
}

function importRatingFromCurrentUrl() {
  const importText = ratingTextFromUrl(window.location.href, { allowHashPayload: false });
  if (!importText) return false;

  try {
    const importedCount = applyRatingImportText(importText, { persist: false });
    syncRatingUrl();
    state.view = "ranking";
    state.ratingMessage = t("urlImportedRating", { count: importedCount });
    return true;
  } catch (error) {
    state.ratingMessage = t("importExportFailed", { message: error.message });
    return false;
  }
}

function radarPoint(index, radius, center = 92) {
  const angle = (-90 + index * 60) * (Math.PI / 180);
  return {
    x: center + Math.cos(angle) * radius,
    y: center + Math.sin(angle) * radius,
  };
}

function pointList(points) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
}

function renderStandRadar(ratings) {
  const maxRadius = 58;
  const center = 92;
  const grid = [1, 2, 3, 4, 5]
    .map((level) => {
      const radius = (maxRadius * level) / 5;
      const points = standAxes.map((_, index) => radarPoint(index, radius, center));
      return `<polygon class="radarGrid" points="${pointList(points)}"></polygon>`;
    })
    .join("");
  const axes = standAxes
    .map((axis, index) => {
      const end = radarPoint(index, maxRadius, center);
      const label = radarPoint(index, maxRadius + 18, center);
      return `
        <line class="radarAxis" x1="${center}" y1="${center}" x2="${end.x.toFixed(1)}" y2="${end.y.toFixed(1)}"></line>
        <text class="radarLabel" x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}">${escapeHtml(axisLabel(axis))}</text>
      `;
    })
    .join("");
  const points = ratings.map((axis, index) => radarPoint(index, (maxRadius * axis.score) / 5, center));
  const dots = points
    .map((point) => `<circle class="radarDot" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="2.5"></circle>`)
    .join("");

  return `
    <svg class="standRadar" viewBox="0 0 184 184" role="img" aria-label="${escapeHtml(t("radarAriaLabel"))}">
      ${grid}
      ${axes}
      <polygon class="radarArea" points="${pointList(points)}"></polygon>
      ${dots}
    </svg>
  `;
}

function renderTierSelect(hero) {
  const currentTier = tierForHero(hero);
  return `
    <label class="tierEditor">
      <span>${escapeHtml(t("tierRank"))}</span>
      <select class="tierSelect" data-hero-id="${escapeHtml(hero.id)}" aria-label="${escapeHtml(t("tierRank"))}">
        ${tierLevels
          .map(
            (tier) => `
              <option value="${tier}" ${tier === currentTier ? "selected" : ""}>${tierLabel(tier)}</option>
            `,
          )
          .join("")}
      </select>
    </label>
  `;
}

function renderScoreSelect(hero, axis) {
  return `
    <select
      class="standScoreSelect"
      data-hero-id="${escapeHtml(hero.id)}"
      data-axis-key="${escapeHtml(axis.key)}"
      aria-label="${escapeHtml(t("scoreLabel", { axis: axisLabel(axis) }))}"
    >
      ${[1, 2, 3, 4, 5]
        .map(
          (score) => `
            <option value="${score}" ${score === axis.score ? "selected" : ""}>${standGrades[score]} ${score}</option>
          `,
        )
        .join("")}
    </select>
  `;
}

function renderStandPanel(hero, editable = true) {
  const ratings = calculateStandStats(hero);
  const ratingTotal = sumStandScores(ratings);

  return `
    <div class="standPanel">
      <div class="standHeader">
        <div class="standTitle">${escapeHtml(t("standTitle"))}</div>
        <div class="standHeaderControls">
          ${editable ? renderTierSelect(hero) : ""}
          <div class="standSignature">${escapeHtml(t("hexScore", { score: ratingTotal }))}</div>
        </div>
      </div>
      ${renderStandRadar(ratings)}
      <div class="standStats">
        ${ratings
          .map(
            (axis) => `
              <div class="standAxis" title="${escapeHtml(`${axisLabel(axis)}: ${axis.grade}`)}">
                <div class="standAxisHeader">
                  <span class="standLabel">${escapeHtml(axisLabel(axis))}</span>
                  <span class="standGrade">${escapeHtml(axis.grade)}</span>
                </div>
                <div class="standBar" aria-hidden="true">
                  <div class="standFill" style="width: ${axis.score * 20}%"></div>
                </div>
                ${editable ? renderScoreSelect(hero, axis) : ""}
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function sumStandScores(ratings) {
  return ratings.reduce((total, axis) => total + axis.score, 0);
}

function rankedHeroes(heroSource = state.filtered) {
  return heroSource
    .map((hero) => {
      const ratings = calculateStandStats(hero);
      const score = sumStandScores(ratings);
      const tier = tierForHero(hero);
      const order = orderForHero(hero);
      return { hero, ratings, score, tier, order };
    })
    .sort((left, right) => {
      if (left.tier !== right.tier) return left.tier - right.tier;
      if (left.order != null || right.order != null) {
        const orderDiff = (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
        if (orderDiff !== 0) return orderDiff;
      }
      if (right.score !== left.score) return right.score - left.score;
      return left.hero.id.localeCompare(right.hero.id);
    });
}

function renderStats(hero) {
  const stats = hero.stats || {};

  return `
    <div class="stat statAttributes">
      <div class="statLabel">${escapeHtml(t("attributes"))}</div>
      <div class="attributeRow">
        ${["str", "agi", "int"]
          .map((key) => {
            const code = key.toUpperCase();
            const isPrimary = stats.primary === code;
            const statName = t(`primaryStatNames.${code}`);
            const title = isPrimary ? t("primaryTitle", { name: statName }) : statName;
            return `
              <span class="attributePill ${isPrimary ? "primary" : ""}" title="${escapeHtml(title)}">
                <span class="attributePillValue">${escapeHtml(code)} ${escapeHtml(stats[key] || t("missing"))}</span>
                ${isPrimary ? `<span class="primaryBadge">${escapeHtml(t("primaryBadge"))}</span>` : ""}
              </span>
            `;
          })
          .join("")}
      </div>
    </div>
    <div class="stat statVitals">
      <div class="statLabel">${escapeHtml(t("vitals"))}</div>
      <div class="vitalRow">
        ${["hp", "mana"]
          .map(
            (key) => `
              <span class="vitalPill">
                <span class="vitalLabel">${escapeHtml(t(`statLabels.${key}`))}</span>
                <span class="vitalValue ${stats[key] ? "" : "missing"}">${escapeHtml(stats[key] || t("missing"))}</span>
              </span>
            `,
          )
          .join("")}
      </div>
    </div>
    <div class="stat statCombat">
      <div class="statLabel">${escapeHtml(t("combat"))}</div>
      <div class="combatRow">
        ${["attackBase", "cooldown", "range"]
          .map(
            (key) => `
              <span class="combatPill">
                <span class="combatLabel">${escapeHtml(t(`combatStatLabels.${key}`))}</span>
                <span class="combatValue">${escapeHtml(stats[key] || t("missing"))}</span>
              </span>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function groupAbilitiesByPosition(abilities) {
  const slots = Array.from({ length: 12 }, () => []);
  const loose = [];

  for (const ability of abilities) {
    const pos = ability.buttonPos;
    if (!pos || pos.x < 0 || pos.x > 3 || pos.y < 0 || pos.y > 2) {
      loose.push(ability);
      continue;
    }

    slots[pos.y * 4 + pos.x].push(ability);
  }

  return { slots, loose };
}

function exclusiveWeaponEntries(hero) {
  const weapon = hero.exclusiveWeapon;
  if (!weapon) return [];

  const entries = [
    {
      id: weapon.id,
      name: weapon.name || weapon.id,
      icon: weapon.icon,
      iconAsset: weapon.iconAsset,
      description: weapon.description,
      kind: "exclusiveItem",
      categoryKey: "exclusiveItem",
      buttonLabelKey: "exclusiveButton",
      inheritedFrom: weapon.inheritedFrom,
    },
  ];

  if (weapon.grantedSkill) {
    entries.push({
      ...weapon.grantedSkill,
      buttonPos: { x: 0, y: 1 },
      kind: "exclusiveSkill",
      categoryKey: "exclusiveSkill",
      buttonLabel: weapon.grantedSkill.hotkey || "G",
      sourceWeapon: weapon.name || weapon.id,
      inheritedFrom: weapon.inheritedFrom,
    });
  }

  return entries;
}

function layoutEntriesForHero(hero) {
  const entries = [...(hero.abilities || [])];

  for (const entry of exclusiveWeaponEntries(hero)) {
    const existingIndex = entries.findIndex((ability) => ability.id === entry.id);
    if (existingIndex === -1) {
      entries.push(entry);
    } else {
      entries[existingIndex] = { ...entries[existingIndex], ...entry };
    }
  }

  return entries;
}

function renderAbilityButton(ability) {
  const kindClass = ability.kind ? ` ${ability.kind}` : "";
  const name = localized(ability, "name") || ability.id;
  const buttonLabel = ability.buttonLabelKey ? t(ability.buttonLabelKey) : ability.buttonLabel || ability.hotkey || ability.id;

  return `
    <button
      class="abilityButton${kindClass} ${ability.id === state.expandedAbilityId ? "active" : ""}"
      data-entry-id="${escapeHtml(ability.id)}"
      title="${escapeHtml(name)}"
    >
      ${renderIcon(ability.iconAsset, ability.hotkey || ability.id.slice(-1), "abilityIcon", name)}
      <span>${escapeHtml(buttonLabel)}</span>
    </button>
  `;
}

function relatedHeroOptions(hero, activeHero) {
  return [
    {
      id: hero.id,
      label: t("baseForm"),
      hero,
      displayHero: localizedHero(hero),
    },
    ...(hero.relatedHeroes || []).map((relatedHero) => ({
      id: relatedHero.id,
      label: relatedHero.relationLabel || t("formFallback"),
      hero: relatedHero,
      displayHero: localizedHero(relatedHero),
    })),
  ].map((option) => ({ ...option, active: option.id === activeHero.id }));
}

function renderRelatedHeroSwitch(hero, activeHero) {
  const options = relatedHeroOptions(hero, activeHero);
  if (options.length <= 1) return "";

  return `
    <div class="formSwitch" role="group" aria-label="${escapeHtml(t("formSwitchAria"))}">
      ${options
        .map((option) => {
          const optionName = option.displayHero.name || option.id;
          const optionTitle = option.displayHero.title || "";
          return `
            <button
              type="button"
              class="formOption ${option.active ? "active" : ""}"
              data-related-id="${escapeHtml(option.id)}"
              aria-pressed="${option.active ? "true" : "false"}"
            >
              ${renderIcon(option.hero.iconAsset, initials(optionName, option.id), "formIcon", optionName)}
              <span class="formOptionText">
                <span class="formOptionName">${escapeHtml(optionName)}</span>
                <span class="formOptionMeta">${escapeHtml(`${option.label} · ${option.id}${optionTitle ? ` · ${optionTitle}` : ""}`)}</span>
              </span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAbilities(hero) {
  const entries = layoutEntriesForHero(localizedHero(hero));
  if (!entries.length) {
    return `<div class="muted">${escapeHtml(t("noAbilities"))}</div>`;
  }

  const expanded = entries.find((ability) => ability.id === state.expandedAbilityId);
  const { slots, loose } = groupAbilitiesByPosition(entries);

  return `
    <div class="abilityPanel">
      ${slots
        .map(
          (slot, index) => `
            <div class="abilitySlot ${slot.length > 1 ? "multi" : ""}" data-slot="${index}">
              ${slot.map((ability) => renderAbilityButton(ability)).join("")}
            </div>
          `,
        )
        .join("")}
    </div>
    ${
      loose.length
        ? `
          <div class="abilityLoose">
            ${loose.map((ability) => renderAbilityButton(ability)).join("")}
          </div>
        `
        : ""
    }
    ${
      expanded
        ? `
          <article class="abilityDetail">
            <div class="abilityDetailHeader">
              ${renderIcon(expanded.iconAsset, expanded.hotkey || expanded.id.slice(-1), "abilityIcon large", expanded.name || expanded.id)}
              <div>
                <div class="abilityName">${escapeHtml(expanded.name || expanded.id)}</div>
                <div class="profileMeta">
                  ${expanded.categoryKey || expanded.categoryLabel ? `<span class="pill">${escapeHtml(expanded.categoryKey ? t(expanded.categoryKey) : expanded.categoryLabel)}</span>` : ""}
                  <span class="pill">${escapeHtml(expanded.id)}</span>
                  ${expanded.hotkey ? `<span class="pill">${escapeHtml(t("hotkey"))} ${escapeHtml(expanded.hotkey)}</span>` : ""}
                  ${expanded.buttonPos ? `<span class="pill">${escapeHtml(t("position"))} ${escapeHtml(`${expanded.buttonPos.x},${expanded.buttonPos.y}`)}</span>` : ""}
                  ${expanded.sourceWeapon ? `<span class="pill">${escapeHtml(t("from"))} ${escapeHtml(expanded.sourceWeapon)}</span>` : ""}
                  ${expanded.inheritedFrom ? `<span class="pill">${escapeHtml(t("inheritedFrom"))} ${escapeHtml(expanded.inheritedFrom)}</span>` : ""}
                </div>
              </div>
            </div>
            ${expanded.description ? `<div class="abilityText">${escapeHtml(expanded.description)}</div>` : ""}
            ${expanded.icon ? `<div class="sourcePath">${escapeHtml(expanded.icon)}</div>` : ""}
          </article>
        `
        : `<div class="abilityHint">${escapeHtml(t("abilityHint"))}</div>`
    }
  `;
}

function renderDetail(hero) {
  if (!hero) {
    els.detail.innerHTML = `<div class="empty">${escapeHtml(t("noMatchingHero"))}</div>`;
    return;
  }

  const relatedHero = (hero.relatedHeroes || []).find((item) => item.id === state.selectedRelatedId);
  const activeHero = relatedHero || hero;
  if (state.selectedRelatedId && !relatedHero) {
    state.selectedRelatedId = "";
  }

  const displayHero = localizedHero(activeHero);
  const name = displayHero.name || t("unnamedHero");
  const title = displayHero.title || "";
  const description = (displayHero.description || "").trim();
  const relatedSwitch = renderRelatedHeroSwitch(hero, activeHero);
  const gridClasses = ["contentGrid"];
  if (!relatedSwitch) gridClasses.push("noForms");
  if (!description) gridClasses.push("noDescription");

  els.detail.innerHTML = `
    <div class="${gridClasses.join(" ")}">
      <div class="profileMain">
        <div class="profileHeader">
          ${renderIcon(activeHero.iconAsset, initials(name, activeHero.id), "heroIcon", name || activeHero.id)}
          <div>
            <h2 class="profileName">${escapeHtml(name)}</h2>
            <div class="profileMeta">
              <span class="pill">${escapeHtml(activeHero.id)}</span>
              ${title ? `<span class="pill">${escapeHtml(title)}</span>` : ""}
              ${activeHero.hotkey ? `<span class="pill">${escapeHtml(t("summonHotkey"))} ${escapeHtml(activeHero.hotkey)}</span>` : ""}
              ${activeHero.relationLabel ? `<span class="pill">${escapeHtml(activeHero.relationLabel)}</span>` : ""}
              ${activeHero.relationSourceSkillId ? `<span class="pill">${escapeHtml(t("source"))} ${escapeHtml(activeHero.relationSourceSkillId)}</span>` : ""}
            </div>
          </div>
        </div>

        ${relatedSwitch}

        ${
          description
            ? `<section class="panel descriptionPanel">
                <h2>${escapeHtml(t("descriptionTitle"))}</h2>
                <div class="panelBody">
                  <div class="description">${escapeHtml(description)}</div>
                </div>
              </section>`
            : ""
        }

        <section class="panel skillsPanel">
          <h2>${escapeHtml(t("skillsTitle"))}</h2>
          <div class="panelBody">${renderAbilities(activeHero)}</div>
        </section>
      </div>

      <section class="panel statsPanel">
        <h2>${escapeHtml(t("statsTitle"))}</h2>
        <div class="panelBody">
          <div class="stats">${renderStats(activeHero)}</div>
          ${renderStandPanel(activeHero, activeHero.id === hero.id)}
        </div>
      </section>
    </div>
  `;
}

function renderTierRanking() {
  const rows = rankedHeroes(state.filtered);

  if (!rows.length) {
    els.detail.innerHTML = `<div class="empty">${escapeHtml(t("noMatchingHero"))}</div>`;
    return;
  }

  const groups = tierLevels.map((tier) => ({
    tier,
    heroes: rows.filter((row) => row.tier === tier),
  }));

  els.detail.innerHTML = `
    <div class="rankingPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("rankingTitle"))}</h2>
          <p>${escapeHtml(t("rankingHint"))}</p>
        </div>
        <div class="ratingToolbar">
          <button class="ratingToolButton" type="button" data-rating-action="export">${escapeHtml(t("export"))}</button>
          <button class="ratingToolButton" type="button" data-rating-action="import">${escapeHtml(t("import"))}</button>
          <div class="rankingCount">${escapeHtml(t("heroCount", { count: rows.length }))}</div>
        </div>
      </div>
      ${state.ratingMessage ? `<div class="ratingMessage">${escapeHtml(state.ratingMessage)}</div>` : ""}
      ${
        state.exportedRatingText
          ? `<textarea class="ratingExportText" readonly>${escapeHtml(state.exportedRatingText)}</textarea>`
          : ""
      }
      <div class="tierPyramid">
        ${groups
          .map(
            (group) => `
              <section class="tierRow tierRow${group.tier}" data-tier="${group.tier}">
                <div class="tierLabel">${tierLabel(group.tier)}</div>
                <div class="tierHeroes">
                  ${
                    group.heroes.length
                      ? group.heroes
                          .map(({ hero, ratings, score }) => {
                            const displayHero = localizedHero(hero);
                            const name = displayHero.name || t("unnamedHero");
                            const title = displayHero.title || "";
                            return `
                              <button
                                class="tierHero ${hero.id === state.selectedId ? "active" : ""} ${hero.id === state.draggingHeroId ? "dragging" : ""}"
                                type="button"
                                data-id="${escapeHtml(hero.id)}"
                                aria-label="${escapeHtml(t("dragTierAria", { name }))}"
                              >
                                ${renderIcon(hero.iconAsset, initials(name, hero.id), "heroIcon", name || hero.id)}
                                <span class="tierHeroName">${escapeHtml(name)}</span>
                                <span class="tierTooltip" role="tooltip">
                                  <span class="tierTooltipHeader">
                                    <strong>${escapeHtml(name)}</strong>
                                    <span>${escapeHtml(hero.id)}${title ? ` · ${escapeHtml(title)}` : ""} · ${escapeHtml(t("hexScore", { score }))}</span>
                                  </span>
                                  ${renderStandRadar(ratings)}
                                  <span class="tierTooltipAxes">
                                    ${ratings
                                      .map(
                                        (axis) => `
                                          <span class="rankingAxis">
                                            <span>${escapeHtml(axisLabel(axis))}</span>
                                            <strong>${escapeHtml(axis.grade)} ${axis.score}</strong>
                                          </span>
                                        `,
                                      )
                                      .join("")}
                                  </span>
                                </span>
                              </button>
                            `;
                          })
                          .join("")
                      : `<span class="emptyTier">${escapeHtml(t("emptyTier"))}</span>`
                  }
                </div>
              </section>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function normalizeCommunityShares(data) {
  const source = Array.isArray(data) ? data : Array.isArray(data?.shares) ? data.shares : [];
  return source
    .map((item, index) => {
      const rating = String(item.rating || item.payload || item.data || "").trim();
      return {
        id: String(item.id || `share-${index + 1}`),
        playerName: String(item.playerName || item.player || item.name || "").trim(),
        adminReview: String(item.adminReview || item.review || item.comment || item.note || "").trim(),
        score: normalizeCommunityScore(item.score ?? item.ratingScore ?? item.adminScore ?? 0),
        rating,
      };
    })
    .filter((item) => item.rating);
}

function normalizeCommunityScore(value) {
  const score = Number.parseFloat(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(10, Math.round(score * 10) / 10)) : 0;
}

function communityShareName(share) {
  return share?.playerName || t("unknownPlayer");
}

function renderShareStars(score) {
  const normalizedScore = normalizeCommunityScore(score);
  const percentage = `${normalizedScore * 10}%`;
  return `
    <span class="shareStars" aria-label="${escapeHtml(t("communityScoreLabel", { score: normalizedScore }))}">
      <span class="shareStarsTrack" aria-hidden="true">★★★★★</span>
      <span class="shareStarsFill" style="width: ${escapeHtml(percentage)}" aria-hidden="true">★★★★★</span>
      <span class="shareScoreText">${escapeHtml(`${normalizedScore}/10`)}</span>
    </span>
  `;
}

function communityShareStats(share) {
  try {
    const parsed = parseRatingImport(share.rating);
    return {
      valid: true,
      count: Object.keys(parsed).length,
      length: share.rating.length,
    };
  } catch (error) {
    return {
      valid: false,
      count: 0,
      length: share.rating.length,
      message: error.message,
    };
  }
}

function renderCommunityShareCard(share) {
  const name = communityShareName(share);
  const stats = communityShareStats(share);
  const review = share.adminReview || t("missing");

  return `
    <article
      class="shareCard ${stats.valid ? "" : "invalid"}"
      role="button"
      tabindex="0"
      data-community-share-id="${escapeHtml(share.id)}"
      aria-label="${escapeHtml(name)}"
    >
      <div class="shareCardHeader">
        <div>
          <div class="shareLabel">${escapeHtml(t("communityPlayer"))}</div>
          <h3>${escapeHtml(name)}</h3>
          ${renderShareStars(share.score)}
        </div>
        <span class="shareMeta">${escapeHtml(
          stats.valid ? t("communityRatingMeta", { count: stats.count, length: stats.length }) : stats.message,
        )}</span>
      </div>
      <div class="shareReview">
        <div class="shareLabel">${escapeHtml(t("communityReview"))}</div>
        <p>${escapeHtml(review)}</p>
      </div>
      <div class="shareActions">
        <span class="shareApplyText">${escapeHtml(t("communityApply"))}</span>
        <button
          class="ratingToolButton shareCopyButton"
          type="button"
          data-community-copy-id="${escapeHtml(share.id)}"
        >
          ${escapeHtml(t("communityCopy"))}
        </button>
      </div>
    </article>
  `;
}

function renderCommunityShares() {
  els.detail.innerHTML = `
    <div class="communityPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("communityTitle"))}</h2>
          <p>${escapeHtml(t("communityHint"))}</p>
        </div>
        <div class="ratingToolbar">
          <button class="ratingToolButton" type="button" data-community-share-current="true">${escapeHtml(t("communityShareMine"))}</button>
          <div class="rankingCount">${escapeHtml(t("communityCount", { count: state.communityShares.length }))}</div>
        </div>
      </div>
      ${state.communityMessage ? `<div class="ratingMessage">${escapeHtml(state.communityMessage)}</div>` : ""}
      ${
        state.communityShares.length
          ? `<div class="shareGrid">${state.communityShares.map((share) => renderCommunityShareCard(share)).join("")}</div>`
          : `<div class="empty">${escapeHtml(t("communityEmpty"))}</div>`
      }
    </div>
  `;
}

function selectedHero() {
  return state.heroes.find((hero) => hero.id === state.selectedId);
}

function renderCurrentView() {
  if (state.view === "ranking") {
    renderTierRanking();
    return;
  }

  if (state.view === "community") {
    renderCommunityShares();
    return;
  }

  renderDetail(selectedHero());
}

function renderSummary() {
  els.summary.textContent = t("summary", { total: state.heroes.length, shown: state.filtered.length });
}

function orderedHeroIdsForTier(tier, heroSource = state.heroes) {
  return rankedHeroes(heroSource)
    .filter((row) => row.tier === normalizeTier(tier))
    .map((row) => row.hero.id);
}

function applyTierOrder(tier, ids) {
  const normalizedTier = normalizeTier(tier);
  ids.forEach((id, index) => {
    const current = heroOverride(id);
    state.ratingOverrides[id] = {
      ...current,
      tier: normalizedTier,
      order: index,
    };
  });
}

function moveHeroToTierPosition(id, tier, insertionIndex = null) {
  const hero = state.heroes.find((item) => item.id === id);
  if (!hero) return;

  const sourceTier = tierForHero(hero);
  const targetTier = normalizeTier(tier);
  const targetIds = orderedHeroIdsForTier(targetTier).filter((heroId) => heroId !== id);
  const visibleTargetIds = orderedHeroIdsForTier(targetTier, state.filtered).filter((heroId) => heroId !== id);
  let index = targetIds.length;

  if (insertionIndex != null) {
    const boundedIndex = Math.max(0, Math.min(visibleTargetIds.length, insertionIndex));
    const beforeVisibleId = visibleTargetIds[boundedIndex];
    const afterVisibleId = visibleTargetIds[boundedIndex - 1];

    if (beforeVisibleId) {
      index = targetIds.indexOf(beforeVisibleId);
    } else if (afterVisibleId) {
      index = targetIds.indexOf(afterVisibleId) + 1;
    } else {
      index = Math.max(0, Math.min(targetIds.length, boundedIndex));
    }
  }

  targetIds.splice(index, 0, id);

  if (sourceTier !== targetTier) {
    const sourceIds = orderedHeroIdsForTier(sourceTier).filter((heroId) => heroId !== id);
    applyTierOrder(sourceTier, sourceIds);
  }

  applyTierOrder(targetTier, targetIds);
  state.ratingMessage = "";
  saveRatingCache();
}

function updateHeroTier(id, value) {
  const hero = state.heroes.find((item) => item.id === id);
  if (hero && tierForHero(hero) !== normalizeTier(value)) {
    moveHeroToTierPosition(id, value);
    return;
  }

  const current = heroOverride(id);
  state.ratingOverrides[id] = {
    ...current,
    tier: normalizeTier(value),
  };
  state.ratingMessage = "";
  saveRatingCache();
}

function updateHeroScore(id, axisKey, value) {
  if (!standAxes.some((axis) => axis.key === axisKey)) return;

  const current = heroOverride(id);
  state.ratingOverrides[id] = {
    ...current,
    scores: {
      ...(current.scores || {}),
      [axisKey]: normalizeScore(value),
    },
  };
  state.ratingMessage = "";
  saveRatingCache();
}

function clearTierDropTargets() {
  els.detail.querySelectorAll(".tierRow.dragOver").forEach((row) => row.classList.remove("dragOver"));
  els.detail.querySelectorAll(".tierHero.insertBefore").forEach((hero) => hero.classList.remove("insertBefore"));
  els.detail.querySelectorAll(".tierHero.insertAfter").forEach((hero) => hero.classList.remove("insertAfter"));
  els.detail.querySelectorAll(".tierHeroes.insertEnd").forEach((heroes) => heroes.classList.remove("insertEnd"));
}

function tierHeroElements(tierRow, heroId) {
  return Array.from(tierRow.querySelectorAll(".tierHero")).filter((hero) => hero.dataset.id !== heroId);
}

function insertionIndexForPoint(tierRow, heroId, clientX, clientY) {
  const heroes = tierHeroElements(tierRow, heroId);
  if (!heroes.length) return 0;

  const items = heroes.map((hero, index) => ({
    hero,
    index,
    rect: hero.getBoundingClientRect(),
  }));
  const rowItems = items.filter((item) => clientY >= item.rect.top - 6 && clientY <= item.rect.bottom + 6);

  if (rowItems.length) {
    const before = rowItems.find((item) => clientX < item.rect.left + item.rect.width / 2);
    return before ? before.index : rowItems[rowItems.length - 1].index + 1;
  }

  const beforeRow = items.find((item) => clientY < item.rect.top);
  return beforeRow ? beforeRow.index : heroes.length;
}

function markTierInsertion(tierRow, heroId, clientX, clientY) {
  clearTierDropTargets();
  tierRow.classList.add("dragOver");

  const heroes = tierHeroElements(tierRow, heroId);
  const index = insertionIndexForPoint(tierRow, heroId, clientX, clientY);
  const targetHero = heroes[index];
  if (targetHero) {
    targetHero.classList.add("insertBefore");
  } else if (heroes.length) {
    heroes[heroes.length - 1].classList.add("insertAfter");
  } else {
    tierRow.querySelector(".tierHeroes")?.classList.add("insertEnd");
  }
  return index;
}

function handleTierDrop(heroId, tier, insertionIndex = null) {
  if (!heroId || !state.heroes.some((hero) => hero.id === heroId)) return;

  const normalizedTier = normalizeTier(tier);
  moveHeroToTierPosition(heroId, normalizedTier, insertionIndex);
  state.selectedId = heroId;
  state.draggingHeroId = "";
  suppressTierClickOnce();
  renderList();
  renderCurrentView();
}

function suppressTierClickOnce() {
  state.suppressNextTierClick = true;
  window.setTimeout(() => {
    state.suppressNextTierClick = false;
  }, 120);
}

function beginPointerDrag(event, tierHero) {
  state.pointerDrag = {
    heroId: tierHero.dataset.id,
    started: false,
    startX: event.clientX,
    startY: event.clientY,
  };
}

function updatePointerDrag(event) {
  const drag = state.pointerDrag;
  if (!drag) return;

  const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
  if (!drag.started && distance < 6) return;

  drag.started = true;
  state.draggingHeroId = drag.heroId;
  document.body.classList.add("tierDragging");
  els.detail.querySelector(`.tierHero[data-id="${CSS.escape(drag.heroId)}"]`)?.classList.add("dragging");

  const element = document.elementFromPoint(event.clientX, event.clientY);
  const tierRow = element?.closest(".tierRow[data-tier]");
  if (tierRow) {
    markTierInsertion(tierRow, drag.heroId, event.clientX, event.clientY);
  } else {
    clearTierDropTargets();
  }
}

function finishPointerDrag(event) {
  const drag = state.pointerDrag;
  if (!drag) return;

  state.pointerDrag = null;
  document.body.classList.remove("tierDragging");

  if (!drag.started) return;

  suppressTierClickOnce();
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const tierRow = element?.closest(".tierRow[data-tier]");
  const insertionIndex = tierRow ? insertionIndexForPoint(tierRow, drag.heroId, event.clientX, event.clientY) : null;
  clearTierDropTargets();
  els.detail.querySelectorAll(".tierHero.dragging").forEach((hero) => hero.classList.remove("dragging"));

  if (tierRow) {
    handleTierDrop(drag.heroId, tierRow.dataset.tier, insertionIndex);
    return;
  }

  state.draggingHeroId = "";
  renderCurrentView();
}

async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {}

  window.prompt(t("copyPrompt"), text);
}

async function readTextFromClipboard() {
  try {
    if (navigator.clipboard?.readText) {
      return navigator.clipboard.readText();
    }
  } catch {}

  return window.prompt(t("pastePrompt")) || "";
}

async function handleRatingAction(action) {
  try {
    if (action === "export") {
      const text = encodeRatingPayload();
      state.exportedRatingText = text;
      await copyTextToClipboard(text);
      setRatingMessage(t("exportedRating", { length: text.length }));
      return;
    }

    if (action === "import") {
      const text = await readTextFromClipboard();
      const importedCount = applyRatingImportText(text);
      setRatingMessage(t("importedRating", { count: importedCount }));
    }
  } catch (error) {
    setRatingMessage(t("importExportFailed", { message: error.message }));
  }
}

function communityShareById(id) {
  return state.communityShares.find((share) => share.id === id);
}

function applyCommunityShare(id) {
  const share = communityShareById(id);
  if (!share) return;

  try {
    applyRatingImportText(share.rating);
    state.view = "ranking";
    state.ratingMessage = t("communityApplied", { name: communityShareName(share) });
    state.communityMessage = "";
    renderViewTabs();
    renderList();
    renderCurrentView();
  } catch (error) {
    state.communityMessage = t("communityInvalid", { message: error.message });
    renderCurrentView();
  }
}

async function copyCommunityShare(id) {
  const share = communityShareById(id);
  if (!share) return;

  try {
    await copyTextToClipboard(share.rating);
    state.communityMessage = t("communityCopied", { name: communityShareName(share) });
  } catch (error) {
    state.communityMessage = t("communityInvalid", { message: error.message });
  }
  renderCurrentView();
}

async function shareCurrentRatingToIssue() {
  const rating = currentRatingPayload();
  if (!rating) {
    state.communityMessage = t("communityShareEmpty");
    renderCurrentView();
    return;
  }

  try {
    await copyTextToClipboard(rating);
    state.communityMessage = t("communityShareCopied");
    const params = new URLSearchParams({
      title: t("communityIssueTitle", { name: t("unknownPlayer") }),
      body: t("communityIssueBody", { rating }),
    });
    window.location.href = `${communityIssueUrl}?${params.toString()}`;
  } catch (error) {
    state.communityMessage = t("communityInvalid", { message: error.message });
    renderCurrentView();
  }
}

async function loadCommunityShares() {
  try {
    const response = await fetch("data/community-shares.json");
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    state.communityShares = normalizeCommunityShares(await response.json());
  } catch (error) {
    state.communityShares = [];
    state.communityMessage = t("communityLoadFailed", { message: error.message });
  }
}

function setView(view) {
  state.view = views.some((item) => item.id === view) ? view : "heroes";
  state.expandedAbilityId = "";
  renderViewTabs();
  renderList();
  renderCurrentView();
}

function selectHero(id) {
  state.selectedId = id;
  state.selectedRelatedId = "";
  state.expandedAbilityId = "";
  state.view = "heroes";
  renderViewTabs();
  renderList();
  renderCurrentView();
}

function applyFilter() {
  const query = els.search.value.trim().toLowerCase();
  state.filtered = query ? state.heroes.filter((hero) => searchable(hero).includes(query)) : [...state.heroes];

  if (!state.filtered.some((hero) => hero.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id || "";
    state.selectedRelatedId = "";
    state.expandedAbilityId = "";
  }

  renderList();
  renderCurrentView();
  renderSummary();
}

els.heroList.addEventListener("click", (event) => {
  const button = event.target.closest(".heroButton");
  if (button) selectHero(button.dataset.id);
});

els.detail.addEventListener("click", (event) => {
  const communityShareCurrent = event.target.closest("[data-community-share-current]");
  if (communityShareCurrent) {
    shareCurrentRatingToIssue();
    return;
  }

  const communityCopy = event.target.closest("[data-community-copy-id]");
  if (communityCopy) {
    copyCommunityShare(communityCopy.dataset.communityCopyId);
    return;
  }

  const communityShare = event.target.closest("[data-community-share-id]");
  if (communityShare) {
    applyCommunityShare(communityShare.dataset.communityShareId);
    return;
  }

  const ratingAction = event.target.closest("[data-rating-action]");
  if (ratingAction) {
    handleRatingAction(ratingAction.dataset.ratingAction);
    return;
  }

  const tierHero = event.target.closest(".tierHero");
  if (tierHero) {
    if (state.suppressNextTierClick) {
      state.suppressNextTierClick = false;
      return;
    }

    selectHero(tierHero.dataset.id);
    return;
  }

  const formOption = event.target.closest(".formOption[data-related-id]");
  if (formOption) {
    const relatedId = formOption.dataset.relatedId;
    state.selectedRelatedId = relatedId === state.selectedId ? "" : relatedId;
    state.expandedAbilityId = "";
    renderCurrentView();
    return;
  }

  const button = event.target.closest(".abilityButton");
  if (!button) return;

  state.expandedAbilityId = state.expandedAbilityId === button.dataset.entryId ? "" : button.dataset.entryId;
  renderCurrentView();
});

els.detail.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest("button")) return;

  const communityShare = event.target.closest("[data-community-share-id]");
  if (!communityShare) return;

  event.preventDefault();
  applyCommunityShare(communityShare.dataset.communityShareId);
});

els.detail.addEventListener("dragstart", (event) => {
  const tierHero = event.target.closest(".tierHero");
  if (!tierHero) return;

  state.draggingHeroId = tierHero.dataset.id;
  tierHero.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", tierHero.dataset.id);
});

els.detail.addEventListener("dragover", (event) => {
  const tierRow = event.target.closest(".tierRow[data-tier]");
  if (!tierRow || !state.draggingHeroId) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  markTierInsertion(tierRow, state.draggingHeroId, event.clientX, event.clientY);
});

els.detail.addEventListener("dragleave", (event) => {
  const tierRow = event.target.closest(".tierRow[data-tier]");
  if (!tierRow || tierRow.contains(event.relatedTarget)) return;

  clearTierDropTargets();
});

els.detail.addEventListener("drop", (event) => {
  const tierRow = event.target.closest(".tierRow[data-tier]");
  if (!tierRow) return;

  event.preventDefault();
  const heroId = event.dataTransfer.getData("text/plain") || state.draggingHeroId;
  const insertionIndex = insertionIndexForPoint(tierRow, heroId, event.clientX, event.clientY);
  clearTierDropTargets();
  handleTierDrop(heroId, tierRow.dataset.tier, insertionIndex);
});

els.detail.addEventListener("dragend", () => {
  state.draggingHeroId = "";
  clearTierDropTargets();
  els.detail.querySelectorAll(".tierHero.dragging").forEach((hero) => hero.classList.remove("dragging"));
});

els.detail.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  const tierHero = event.target.closest(".tierHero");
  if (!tierHero) return;

  beginPointerDrag(event, tierHero);
});

window.addEventListener("pointermove", (event) => {
  updatePointerDrag(event);
});

window.addEventListener("pointerup", (event) => {
  finishPointerDrag(event);
});

window.addEventListener("pointercancel", () => {
  state.pointerDrag = null;
  state.draggingHeroId = "";
  document.body.classList.remove("tierDragging");
  clearTierDropTargets();
  els.detail.querySelectorAll(".tierHero.dragging").forEach((hero) => hero.classList.remove("dragging"));
});

els.detail.addEventListener("change", (event) => {
  const tierSelect = event.target.closest(".tierSelect");
  if (tierSelect) {
    updateHeroTier(tierSelect.dataset.heroId, tierSelect.value);
    renderCurrentView();
    return;
  }

  const scoreSelect = event.target.closest(".standScoreSelect");
  if (scoreSelect) {
    updateHeroScore(scoreSelect.dataset.heroId, scoreSelect.dataset.axisKey, scoreSelect.value);
    renderCurrentView();
  }
});

els.search.addEventListener("input", applyFilter);

els.viewTabs?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button || button.dataset.view === state.view) return;

  setView(button.dataset.view);
});

els.languageSwitch?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-language]");
  if (!button || button.dataset.language === state.language) return;

  state.language = button.dataset.language;
  renderViewTabs();
  renderLanguageSwitch();
  applyFilter();
});

fetch("data/heroes.json")
  .then((response) => response.json())
  .then(async (data) => {
    state.heroes = playableHeroes(data.heroes || []);
    state.languages = Array.isArray(data.languages) && data.languages.length ? data.languages : [{ id: "source", label: "原文" }];
    state.language =
      data.defaultLanguage ||
      (state.languages.some((language) => language.id === "zhCN") ? "zhCN" : state.languages[0]?.id || "source");
    state.filtered = [...state.heroes];
    state.selectedId = state.heroes[0]?.id || "";
    const cachedRatingCount = loadRatingCache();
    const hasRatingUrl = Boolean(ratingTextFromUrl(window.location.href, { allowHashPayload: false }));
    const importedRatingFromUrl = importRatingFromCurrentUrl();
    if (!hasRatingUrl && !importedRatingFromUrl && cachedRatingCount) {
      syncRatingUrl();
    }
    await loadCommunityShares();
    renderViewTabs();
    renderLanguageSwitch();
    applyFilter();
  })
  .catch((error) => {
    els.summary.textContent = t("fetchFailed");
    els.detail.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  });

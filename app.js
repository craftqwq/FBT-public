const state = {
  heroes: [],
  filtered: [],
  items: [],
  filteredItems: [],
  selectedId: "",
  selectedItemId: "",
  selectedRelatedId: "",
  selectedChangelog: false,
  expandedAbilityId: "",
  view: "heroes",
  diffMode: false,
  diffCompareVersionId: "",
  diffCompareVersionLabel: "",
  diffCompareHeroes: [],
  diffCompareItems: [],
  diffHeroRows: [],
  diffFilteredHeroRows: [],
  diffItemRows: [],
  diffFilteredItemRows: [],
  versions: [],
  currentVersionId: "",
  currentVersionLabel: "",
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
  toolRouletteHeroId: "",
  toolRouletteHeroIds: [],
  toolRouletteMode: "single",
  toolRouletteSpinning: false,
  toolRouletteTimer: null,
};

const versionDataCache = new Map();

const els = {
  heading: document.querySelector(".topbar h1"),
  summary: document.querySelector("#summary"),
  search: document.querySelector("#search"),
  viewTabs: document.querySelector("#viewTabs"),
  versionSwitchLabel: document.querySelector("#versionSwitchLabel"),
  versionSelect: document.querySelector("#versionSelect"),
  diffToggle: document.querySelector("#diffToggle"),
  languageSwitch: document.querySelector("#languageSwitch"),
  sidebarTitle: document.querySelector(".sectionTitle"),
  heroList: document.querySelector("#heroList"),
  detail: document.querySelector("#detail"),
};

const views = [
  { id: "heroes", labelKey: "viewHeroes" },
  { id: "items", labelKey: "viewItems" },
  { id: "ranking", labelKey: "viewRanking" },
  { id: "tools", labelKey: "viewTools" },
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
    versionSwitchLabel: "버전 전환",
    versionLabel: "버전",
    diffToggle: "버전 차이",
    diffToggleLabel: "버전 차이",
    diffCompare: "{current} / {compare}",
    diffNoChanges: "차이가 없습니다",
    diffAdded: "추가",
    diffRemoved: "삭제",
    diffChanged: "변경",
    diffOld: "이전",
    diffNew: "현재",
    diffBasic: "기본 정보",
    diffStats: "기본 데이터",
    diffSkills: "스킬",
    diffForms: "형태 / 소환",
    diffFields: "변경 항목",
    diffItemFields: "아이템 데이터",
    searchPlaceholder: "캐릭터, 아이템, 스킬, 설명 검색",
    heroList: "캐릭터 목록",
    itemList: "아이템 목록",
    selectHero: "캐릭터를 선택하세요",
    viewHeroes: "캐릭터 자료",
    viewItems: "아이템 자료",
    viewRanking: "T등급 랭킹",
    viewTools: "미니 도구",
    viewCommunity: "커뮤니티 공유",
    toolsTitle: "미니 도구",
    toolsSummary: "{count}명 후보",
    toolRouletteTitle: "캐릭터 룰렛",
    toolRandom: "무지개 룰렛",
    toolTeamRandom: "3인 랜덤",
    toolMetaRandom: "빡겜 랜덤",
    toolRolling: "룰렛 회전 중",
    toolTeamRolling: "조합 중",
    toolMetaRolling: "최강 조합 계산 중",
    toolResult: "선택 결과",
    toolTeamResult: "3인 조합 결과",
    toolMetaResult: "최강 보완 조합",
    toolPending: "대기 중",
    unnamedHero: "이름 없는 캐릭터",
    unknownPlayer: "알 수 없는 플레이어",
    noTitle: "칭호 없음",
    noMatchingHero: "일치하는 캐릭터가 없습니다",
    noMatchingItem: "일치하는 아이템이 없습니다",
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
    temporarySkill: "\ucd94\uac00 \uc2a4\ud0ac",
    temporaryPanelTitle: "\ucd94\uac00",
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
    itemDescriptionTitle: "아이템 설명",
    itemDataTitle: "아이템 데이터",
    itemTip: "표시 문구",
    itemClass: "분류",
    itemLevel: "레벨",
    itemCost: "가격",
    itemStock: "상점",
    itemCooldown: "쿨다운",
    itemAbilities: "능력",
    itemModel: "모델",
    itemIconPath: "아이콘",
    itemNoDescription: "설명이 없습니다",
    rankingTitle: "T등급 랭킹",
    rankingHint: "T등급과 육각형 점수는 직접 수정할 수 있습니다. 캐릭터에 마우스를 올리면 6개 항목이 표시됩니다.",
    communityTitle: "커뮤니티 공유",
    communityHint: "관리자가 승인한 플레이어 설정입니다.",
    communityEmpty: "아직 승인된 공유 데이터가 없습니다.",
    communityPlayer: "플레이어",
    communityDescription: "자기 설명",
    communityAdminReview: "관리자 평가",
    communityVersion: "버전",
    communityUnknownVersion: "버전 미지정",
    communityApply: "적용",
    communityCopy: "복사",
    communityCount: "{count}개 공유",
    communityRatingMeta: "{count}명 설정 · {length}자",
    communityApplied: "{name} 설정을 적용했습니다.",
    communityCopied: "{name} 설정을 복사했습니다.",
    communityInvalid: "공유 데이터 오류: {message}",
    communityLoadFailed: "공유 데이터를 읽지 못했습니다: {message}",
    communityPending: "설정 데이터 대기 중",
    communityScoreLabel: "관리자 점수 {score}/10",
    communityShareMine: "나도 공유하기",
    communityShareEmpty: "먼저 T등급이나 육각형 점수를 수정한 뒤 공유하세요.",
    communityShareCopied: "현재 설정을 복사했습니다. GitHub Issue 페이지로 이동합니다.",
    communityIssueTitle: "커뮤니티 공유: {name}",
    communityIssueBody:
      "버전:\n{version}\n\n플레이어 이름:\n\n자기 설명:\n\n공유 데이터:\n{rating}\n",
    export: "내보내기",
    import: "가져오기",
    heroCount: "{count}명",
    itemCount: "{count}개 아이템",
    dragTierAria: "{name} 드래그해 T등급 수정",
    emptyTier: "없음",
    summary: "총 {total}명, 현재 {shown}명 표시",
    itemSummary: "총 {total}개 아이템, 현재 {shown}개 표시",
    copyPrompt: "아래 설정을 복사하세요",
    pastePrompt: "점수 설정을 붙여넣으세요",
    exportedRating: "base64 설정을 클립보드에 내보냈습니다. 길이 {length}.",
    importedRating: "{count}명의 T등급과 점수를 가져왔습니다.",
    urlImportedRating: "URL에서 {count}명의 T등급과 점수를 가져왔습니다.",
    importExportFailed: "가져오기/내보내기 실패: {message}",
    fetchFailed: "캐릭터 데이터를 읽지 못했습니다",
    versionFetchFailed: "{version} 데이터를 읽지 못했습니다",
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
    versionSwitchLabel: "版本切换",
    versionLabel: "版本",
    diffToggle: "版本差异",
    diffToggleLabel: "版本差异",
    diffCompare: "{current} / {compare}",
    diffNoChanges: "没有差异",
    diffAdded: "新增",
    diffRemoved: "移除",
    diffChanged: "变更",
    diffOld: "旧版",
    diffNew: "当前",
    diffBasic: "基础信息",
    diffStats: "基础数据",
    diffSkills: "技能",
    diffForms: "形态 / 召唤",
    diffFields: "变更字段",
    diffItemFields: "物品数据",
    searchPlaceholder: "搜索角色、物品、技能、说明",
    heroList: "角色列表",
    itemList: "物品列表",
    selectHero: "请选择一个角色",
    viewHeroes: "角色资料",
    viewItems: "物品资料",
    viewRanking: "T度排行",
    viewTools: "小工具",
    viewCommunity: "社区分享",
    toolsTitle: "小工具",
    toolsSummary: "{count} 个角色可供随机",
    toolRouletteTitle: "角色轮盘",
    toolRandom: "随机",
    toolTeamRandom: "3人随机",
    toolMetaRandom: "分奴随机",
    toolRolling: "轮盘转动中",
    toolTeamRolling: "组队随机中",
    toolMetaRolling: "计算最强组合中",
    toolResult: "本次选择",
    toolTeamResult: "3人互补组合",
    toolMetaResult: "最强互补组合",
    toolPending: "等待随机",
    unnamedHero: "未命名角色",
    unknownPlayer: "未命名玩家",
    noTitle: "无称号",
    noMatchingHero: "没有匹配的角色",
    noMatchingItem: "没有匹配的物品",
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
    temporarySkill: "\u8ffd\u52a0\u6280\u80fd",
    temporaryPanelTitle: "\u8ffd\u52a0",
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
    itemDescriptionTitle: "物品说明",
    itemDataTitle: "物品数据",
    itemTip: "提示文本",
    itemClass: "分类",
    itemLevel: "等级",
    itemCost: "价格",
    itemStock: "商店",
    itemCooldown: "冷却",
    itemAbilities: "技能",
    itemModel: "模型",
    itemIconPath: "图标",
    itemNoDescription: "暂无说明",
    rankingTitle: "T度排行",
    rankingHint: "T度与六边形评分均可手动修改；悬停角色查看具体六项。",
    communityTitle: "社区分享",
    communityHint: "这里展示管理员审核通过的玩家配置。",
    communityEmpty: "暂无已审核的社区分享。",
    communityPlayer: "玩家名字",
    communityDescription: "自己的说明",
    communityAdminReview: "管理员评价",
    communityVersion: "版本",
    communityUnknownVersion: "未标记版本",
    communityApply: "应用配置",
    communityCopy: "复制数据",
    communityCount: "{count} 个分享",
    communityRatingMeta: "{count} 位角色配置 · {length} 字符",
    communityApplied: "已应用 {name} 的分享配置。",
    communityCopied: "已复制 {name} 的分享数据。",
    communityInvalid: "分享数据错误：{message}",
    communityLoadFailed: "读取社区分享失败：{message}",
    communityPending: "配置数据待补",
    communityScoreLabel: "管理员评分 {score}/10",
    communityShareMine: "我要分享",
    communityShareEmpty: "请先修改 T度或六边形评分后再分享。",
    communityShareCopied: "已复制当前配置，即将跳转到 GitHub 新 Issue 页面。",
    communityIssueTitle: "社区分享：{name}",
    communityIssueBody:
      "版本：\n{version}\n\n玩家名字：\n\n自己的说明：\n\n分享数据：\n{rating}\n",
    export: "导出",
    import: "导入",
    heroCount: "{count} 位角色",
    itemCount: "{count} 个物品",
    dragTierAria: "拖动 {name} 修改T度",
    emptyTier: "暂无",
    summary: "共 {total} 个角色，当前显示 {shown} 个",
    itemSummary: "共 {total} 个物品，当前显示 {shown} 个",
    copyPrompt: "复制以下配置",
    pastePrompt: "粘贴评分配置",
    exportedRating: "已导出 base64 配置到剪贴板，长度 {length}。",
    importedRating: "已导入 {count} 位角色的 T度与评分。",
    urlImportedRating: "已从 URL 导入 {count} 位角色的 T度与评分。",
    importExportFailed: "导入/导出失败：{message}",
    fetchFailed: "读取角色数据失败",
    versionFetchFailed: "读取 {version} 数据失败",
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

const defaultStandScore = 0;
const defaultTier = 0;
const standGrades = ["0", "E", "D", "C", "B", "A"];
const scoreLevels = [0, 1, 2, 3, 4, 5];
const tierLevels = [0, 1, 2, 3, 4, 5];
const skinAbilityPanelBaseExceptionIds = new Set(["E00Y"]);
const legacyCompactRatingVersion = 2;
const compactRatingVersion = 3;
const compactRatingMagic = [70, 66, 84, 82];
const legacyShortRatingVersion = 1;
const shortRatingVersion = 2;
const shortRatingPrefix = ".";
const ratingIdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ratingShortIdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ratingUrlParamNames = ["rating", "ratings", "r", "fbt", "config"];
const versionManifestPath = "data/versions.json";
const versionUrlParamNames = ["version", "mapVersion"];
const fallbackVersions = [{ id: "KR47fix5", label: "KR47fix5", file: "data/heroes.json" }];
const legacyRatingStorageKey = "fbt.ratingOverrides.v2";
const ratingStorageKeyPrefix = "fbt.ratingOverrides.v2";
const communityIssueUrl = "https://github.com/craftqwq/FBT-public/issues/new";
const legacyCommunityShareVersion = "KR44fix";
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

function versionLabel(version) {
  return version?.label || version?.id || "";
}

function currentVersion() {
  return state.versions.find((version) => version.id === state.currentVersionId) || state.versions[0] || null;
}

function normalizeChangelogTranslation(value) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";
  return String(value.text || value.title || "").trim();
}

function normalizeChangelogEntry(entry, index) {
  const rawEntry = typeof entry === "string" ? { text: entry } : entry || {};
  const text = String(rawEntry.text || rawEntry.source || rawEntry.description || "").trim();
  if (!text) return null;

  return {
    id: String(rawEntry.id || `entry-${index + 1}`).trim(),
    text,
    translations: rawEntry.translations || {},
  };
}

function normalizeChangelogSection(section, index) {
  const rawSection = typeof section === "string" ? { title: "", entries: [section] } : section || {};
  const entries = (Array.isArray(rawSection.entries) ? rawSection.entries : rawSection.items || [])
    .map((entry, entryIndex) => normalizeChangelogEntry(entry, entryIndex))
    .filter(Boolean);
  if (!entries.length) return null;

  const title = String(rawSection.title || rawSection.name || "").trim();
  return {
    id: String(rawSection.id || `section-${index + 1}`).trim(),
    title,
    translations: rawSection.translations || {},
    entries,
  };
}

function normalizeChangelog(changelog) {
  if (!changelog) return [];
  const sections = Array.isArray(changelog)
    ? changelog
    : Array.isArray(changelog.sections)
      ? changelog.sections
      : Array.isArray(changelog.entries) || Array.isArray(changelog.items)
        ? [{ title: "", entries: changelog.entries || changelog.items }]
        : [];

  return sections
    .map((section, index) => normalizeChangelogSection(section, index))
    .filter(Boolean);
}

function normalizeVersionEntry(entry, index) {
  const rawId = String(entry?.id || entry?.version || entry?.name || "").trim();
  if (!rawId) return null;

  return {
    id: rawId,
    label: String(entry?.label || rawId).trim(),
    file: String(entry?.file || entry?.path || `data/heroes.${rawId}.json`).trim(),
    changelog: normalizeChangelog(entry?.changelog),
    sourceIndex: index,
  };
}

function normalizeVersionManifest(data) {
  const source = Array.isArray(data) ? data : Array.isArray(data?.versions) ? data.versions : [];
  const seen = new Set();
  const versions = source
    .map((entry, index) => normalizeVersionEntry(entry, index))
    .filter((entry) => {
      if (!entry || seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });

  const current = String(data?.current || data?.defaultVersion || versions[0]?.id || "").trim();
  return {
    versions: versions.length ? versions : fallbackVersions,
    current,
  };
}

function versionIdFromCurrentUrl() {
  try {
    const url = new URL(window.location.href);
    const hashText = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
    const hashQueryText = hashText.includes("?") ? hashText.slice(hashText.indexOf("?") + 1) : hashText;
    const hashParams = new URLSearchParams(hashQueryText);

    for (const name of versionUrlParamNames) {
      const fromSearch = url.searchParams.get(name);
      if (fromSearch) return fromSearch.trim();

      const fromHash = hashParams.get(name);
      if (fromHash) return fromHash.trim();
    }
  } catch {}

  return "";
}

function validVersionId(versionId) {
  return state.versions.some((version) => version.id === versionId) ? versionId : "";
}

function initialVersionId(manifestCurrent = "", requestedVersionId = versionIdFromCurrentUrl()) {
  return (
    validVersionId(requestedVersionId) ||
    validVersionId(manifestCurrent) ||
    state.versions[0]?.id ||
    ""
  );
}

function syncVersionUrl(versionId = state.currentVersionId) {
  try {
    if (!window.history?.replaceState || !versionId) return;

    const url = new URL(window.location.href);
    for (const name of versionUrlParamNames) {
      url.searchParams.delete(name);
    }
    url.searchParams.set(versionUrlParamNames[0], versionId);
    window.history.replaceState(window.history.state, "", url);
  } catch (error) {
    console.warn("Failed to sync version URL", error);
  }
}

function changelogTitle() {
  return state.language === "zhCN" ? "更新日志" : "업데이트 로그";
}

function changelogEntryCount(count) {
  return state.language === "zhCN" ? `${count} 条更新` : `${count}개 항목`;
}

function changelogEmptyText() {
  return state.language === "zhCN" ? "没有更新日志" : "업데이트 로그가 없습니다";
}

function currentChangelogSections() {
  const version = currentVersion();
  return Array.isArray(version?.changelog) ? version.changelog : [];
}

function hasCurrentChangelog() {
  return currentChangelogSections().length > 0;
}

function renderStaticChrome() {
  document.title = t("pageTitle");
  if (els.heading) els.heading.textContent = t("pageTitle");
  if (els.search) els.search.placeholder = t("searchPlaceholder");
  if (els.viewTabs) els.viewTabs.setAttribute("aria-label", t("viewTabsLabel"));
  if (els.versionSwitchLabel) els.versionSwitchLabel.textContent = t("versionLabel");
  if (els.versionSelect) els.versionSelect.setAttribute("aria-label", t("versionSwitchLabel"));
  if (els.diffToggle) {
    els.diffToggle.textContent = t("diffToggle");
    els.diffToggle.title = t("diffToggleLabel");
    els.diffToggle.setAttribute("aria-pressed", state.diffMode ? "true" : "false");
    els.diffToggle.classList.toggle("active", state.diffMode);
    els.diffToggle.disabled = state.versions.length <= 1;
  }
  if (els.languageSwitch) els.languageSwitch.setAttribute("aria-label", t("languageSwitchLabel"));
  if (els.sidebarTitle) els.sidebarTitle.textContent = state.view === "items" ? t("itemList") : t("heroList");
}

function playableHeroes(heroes = []) {
  return heroes
    .filter((hero) => !excludedHeroIds.has(hero.id))
    .map((hero) => ({
      ...hero,
      relatedHeroes: (hero.relatedHeroes || []).filter((relatedHero) => !excludedHeroIds.has(relatedHero.id)),
    }));
}

function playableItems(items = []) {
  return items.filter((item) => item?.id);
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

function exclusiveGrantedSkills(weapon) {
  if (!weapon) return [];

  const skills = Array.isArray(weapon.grantedSkills) ? weapon.grantedSkills.filter(Boolean) : [];
  if (weapon.grantedSkill && !skills.some((skill) => skill.id === weapon.grantedSkill.id)) {
    skills.unshift(weapon.grantedSkill);
  }

  return skills;
}

function localizedHero(hero, language = state.language) {
  const result = localizedEntity(hero, language);
  result.abilities = (hero.abilities || []).map((ability) => localizedEntity(ability, language));
  result.temporaryAbilityPanels = (hero.temporaryAbilityPanels || []).map((panel) => {
    const localizedPanel = localizedEntity(panel, language);
    localizedPanel.abilities = (panel.abilities || []).map((ability) => localizedEntity(ability, language));
    return localizedPanel;
  });
  result.relatedHeroes = (hero.relatedHeroes || []).map((relatedHero) => localizedHero(relatedHero, language));
  if (hero.exclusiveWeapon) {
    result.exclusiveWeapon = localizedEntity(hero.exclusiveWeapon, language);
    const grantedSkills = exclusiveGrantedSkills(hero.exclusiveWeapon).map((skill) => localizedEntity(skill, language));
    if (grantedSkills.length) {
      result.exclusiveWeapon.grantedSkills = grantedSkills;
      result.exclusiveWeapon.grantedSkill = grantedSkills[0];
    }
  }
  return result;
}

function localizedItem(item, language = state.language) {
  return localizedEntity(item, language);
}

function translationText(entity) {
  return Object.values(entity?.translations || {})
    .map((translation) => Object.values(translation).join(" "))
    .join(" ");
}

function heroTextForSearch(hero) {
  const grantedSkillText = exclusiveGrantedSkills(hero.exclusiveWeapon)
    .map((skill) => `${skill.name || ""} ${skill.description || ""} ${translationText(skill)}`)
    .join(" ");
  const temporaryAbilityText = (hero.temporaryAbilityPanels || [])
    .map((panel) =>
      [
        panel.sourceAbilityId,
        panel.sourceAbilityName,
        panel.sourceAbilityHotkey,
        translationText(panel),
        (panel.abilities || []).map((ability) => `${ability.name || ""} ${ability.description || ""}`).join(" "),
        (panel.abilities || []).map((ability) => translationText(ability)).join(" "),
      ].join(" "),
    )
    .join(" ");

  return [
    hero.id,
    hero.name,
    hero.title,
    hero.description,
    hero.summonTip,
    translationText(hero),
    (hero.abilities || []).map((ability) => `${ability.name} ${ability.description}`).join(" "),
    (hero.abilities || []).map((ability) => translationText(ability)).join(" "),
    temporaryAbilityText,
    hero.exclusiveWeapon
      ? `${hero.exclusiveWeapon.name} ${hero.exclusiveWeapon.description} ${translationText(hero.exclusiveWeapon)} ${grantedSkillText}`
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

function itemTextForSearch(item) {
  return [
    item.id,
    item.name,
    item.tip,
    item.description,
    item.class,
    item.level,
    item.goldCost,
    item.lumberCost,
    item.cooldownId,
    item.model,
    item.icon,
    (item.abilityIds || []).join(" "),
    translationText(item),
  ].join(" ");
}

function searchableItem(item) {
  const localizedSearchItem = localizedItem(item);
  return [itemTextForSearch(item), itemTextForSearch(localizedSearchItem)].join(" ").toLowerCase();
}

const heroBasicDiffFields = [
  "hotkey",
  "requirements",
  "model",
  "icon",
  "scoreIcon",
];
const heroLocalizedDiffFields = ["name", "title", "summonTip", "reviveTip", "awakenTip", "description"];
const heroStatDiffFields = ["primary", "str", "agi", "int", "hp", "mana", "attackBase", "cooldown", "range"];
const abilityDiffFields = [
  "hotkey",
  "icon",
  "buttonPos",
  "kind",
  "categoryKey",
  "buttonLabelKey",
  "sourceAbilityId",
  "sourceAbilityHotkey",
  "inheritedFrom",
];
const abilityDisplayDiffFields = ["categoryLabel", "buttonLabel", "sourceWeapon", "sourceAbilityName"];
const abilityLocalizedDiffFields = ["name", "description"];
const itemDiffFields = [
  "icon",
  "level",
  "goldCost",
  "lumberCost",
  "stockMax",
  "stockRegen",
  "cooldownId",
  "abilityIds",
  "model",
];
const itemLocalizedDiffFields = ["name", "tip", "description", "class"];

function diffStatusLabel(type) {
  return (
    {
      added: t("diffAdded"),
      removed: t("diffRemoved"),
      changed: t("diffChanged"),
    }[type] || type
  );
}

function diffCompareText() {
  return t("diffCompare", {
    current: state.currentVersionLabel || state.currentVersionId || t("versionLabel"),
    compare: state.diffCompareVersionLabel || state.diffCompareVersionId || t("missing"),
  });
}

function comparisonVersionForCurrent() {
  if (state.versions.length <= 1) return null;

  const currentIndex = Math.max(
    0,
    state.versions.findIndex((version) => version.id === state.currentVersionId),
  );
  const compareIndex = currentIndex === 0 ? 1 : currentIndex - 1;
  return state.versions[compareIndex] || null;
}

function versionDataCacheKey(version) {
  return `${version?.id || ""}:${version?.file || ""}`;
}

async function loadVersionData(version) {
  const key = versionDataCacheKey(version);
  if (versionDataCache.has(key)) return versionDataCache.get(key);

  const response = await fetch(version.file);
  if (!response.ok) {
    throw new Error(t("versionFetchFailed", { version: versionLabel(version) || version.id }));
  }

  const data = await response.json();
  versionDataCache.set(key, data);
  return data;
}

async function loadVersionDataForDiff(version) {
  return loadVersionData(version);
}

function normalizeComparable(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map((item) => normalizeComparable(item));
  if (typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        const normalized = normalizeComparable(value[key]);
        if (normalized !== "" && !(Array.isArray(normalized) && !normalized.length)) {
          result[key] = normalized;
        }
        return result;
      }, {});
  }
  return value;
}

function comparableText(value) {
  return JSON.stringify(normalizeComparable(value));
}

function valuesDifferent(currentValue, previousValue) {
  return comparableText(currentValue) !== comparableText(previousValue);
}

function hasDiffValue(value) {
  const normalized = normalizeComparable(value);
  if (normalized === "") return false;
  if (Array.isArray(normalized)) return normalized.length > 0;
  if (typeof normalized === "object") return Object.keys(normalized).length > 0;
  return true;
}

function formatDiffValue(value) {
  const normalized = normalizeComparable(value);
  if (!hasDiffValue(normalized)) return t("missing");
  if (Array.isArray(normalized)) {
    return normalized
      .map((item) => (typeof item === "object" ? JSON.stringify(item) : String(item)))
      .join(", ");
  }
  if (typeof normalized === "object") return JSON.stringify(normalized, null, 2);
  return String(normalized);
}

function collectFieldDiffs(currentEntity, previousEntity, fields) {
  return fields
    .map((field) => {
      const currentValue = readPath(currentEntity || {}, field);
      const previousValue = readPath(previousEntity || {}, field);
      if (!currentEntity && !hasDiffValue(previousValue)) return null;
      if (!previousEntity && !hasDiffValue(currentValue)) return null;
      if (!valuesDifferent(currentValue, previousValue)) return null;
      return { label: field, oldValue: previousValue, newValue: currentValue };
    })
    .filter(Boolean);
}

function collectDisplayedFieldDiffs(currentEntity, previousEntity, displayCurrentEntity, displayPreviousEntity, fields) {
  return fields
    .map((field) => {
      const currentSourceValue = readPath(currentEntity || {}, field);
      const previousSourceValue = readPath(previousEntity || {}, field);
      if (!currentEntity && !hasDiffValue(previousSourceValue)) return null;
      if (!previousEntity && !hasDiffValue(currentSourceValue)) return null;
      if (!valuesDifferent(currentSourceValue, previousSourceValue)) return null;
      return {
        label: field,
        oldValue: readPath(displayPreviousEntity || {}, field),
        newValue: readPath(displayCurrentEntity || {}, field),
      };
    })
    .filter(Boolean);
}

function collectSourceTextDiffs(currentEntity, previousEntity, fields, displayCurrentEntity = currentEntity, displayPreviousEntity = previousEntity) {
  return fields
    .map((field) => {
      const currentSourceValue = currentEntity ? localized(currentEntity, field, "source") : "";
      const previousSourceValue = previousEntity ? localized(previousEntity, field, "source") : "";
      if (!currentEntity && !hasDiffValue(previousSourceValue)) return null;
      if (!previousEntity && !hasDiffValue(currentSourceValue)) return null;
      if (!valuesDifferent(currentSourceValue, previousSourceValue)) return null;
      return {
        label: field,
        oldValue: displayPreviousEntity ? localized(displayPreviousEntity, field, state.language) : "",
        newValue: displayCurrentEntity ? localized(displayCurrentEntity, field, state.language) : "",
      };
    })
    .filter(Boolean);
}

function diffRowType(currentEntity, previousEntity) {
  if (currentEntity && !previousEntity) return "added";
  if (!currentEntity && previousEntity) return "removed";
  return "changed";
}

function orderedDiffIds(currentList, previousList, idForItem = (item) => item.id) {
  const seen = new Set();
  const ids = [];
  for (const item of currentList || []) {
    const id = idForItem(item);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  for (const item of previousList || []) {
    const id = idForItem(item);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
  }
  return ids;
}

function mapById(list = []) {
  return new Map(list.filter((item) => item?.id).map((item) => [item.id, item]));
}

function isSkinVariant(hero) {
  return hero?.relationType === "skin";
}

function diffHasChanges(diff) {
  return Object.values(diff || {}).some((value) => Array.isArray(value) && value.length > 0);
}

function abilityDiffKey(ability, index, seen) {
  const base = ability.entryKey || ability.id || `entry:${index}`;
  const count = seen.get(base) || 0;
  seen.set(base, count + 1);
  return count ? `${base}#${count}` : base;
}

function mapAbilitiesForDiff(abilities = []) {
  const seen = new Map();
  return new Map(abilities.map((ability, index) => [abilityDiffKey(ability, index, seen), ability]));
}

function orderedDiffKeys(currentMap, previousMap) {
  const seen = new Set();
  const keys = [];
  for (const key of currentMap.keys()) {
    if (seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  for (const key of previousMap.keys()) {
    if (seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }
  return keys;
}

function buildAbilityDiff(currentAbility, previousAbility, displayCurrentAbility = currentAbility, displayPreviousAbility = previousAbility) {
  return [
    ...collectFieldDiffs(currentAbility, previousAbility, abilityDiffFields),
    ...collectDisplayedFieldDiffs(
      currentAbility,
      previousAbility,
      displayCurrentAbility,
      displayPreviousAbility,
      abilityDisplayDiffFields,
    ),
    ...collectSourceTextDiffs(
      currentAbility,
      previousAbility,
      abilityLocalizedDiffFields,
      displayCurrentAbility,
      displayPreviousAbility,
    ),
  ];
}

function diffAbilityEntries(currentHero, previousHero) {
  const currentEntries = currentHero ? layoutEntriesForHero(currentHero) : [];
  const previousEntries = previousHero ? layoutEntriesForHero(previousHero) : [];
  const currentDisplayEntries = currentHero ? layoutEntriesForHero(localizedHero(currentHero)) : [];
  const previousDisplayEntries = previousHero ? layoutEntriesForHero(localizedHero(previousHero)) : [];
  const currentMap = mapAbilitiesForDiff(currentEntries);
  const previousMap = mapAbilitiesForDiff(previousEntries);
  const currentDisplayMap = mapAbilitiesForDiff(currentDisplayEntries);
  const previousDisplayMap = mapAbilitiesForDiff(previousDisplayEntries);

  return orderedDiffKeys(currentMap, previousMap)
    .map((key) => {
      const ability = currentMap.get(key);
      const previousAbility = previousMap.get(key);
      const displayAbility = currentDisplayMap.get(key) || ability;
      const displayPreviousAbility = previousDisplayMap.get(key) || previousAbility;
      const fields = buildAbilityDiff(ability, previousAbility, displayAbility, displayPreviousAbility);
      if (!fields.length) return null;
      return {
        id: key,
        type: diffRowType(ability, previousAbility),
        ability: displayAbility,
        previousAbility: displayPreviousAbility,
        fields,
      };
    })
    .filter(Boolean);
}

function buildRelatedHeroDiff(currentHero, previousHero) {
  return {
    basic: [
      ...collectFieldDiffs(currentHero, previousHero, heroBasicDiffFields),
      ...collectSourceTextDiffs(currentHero, previousHero, heroLocalizedDiffFields),
    ],
    stats: collectFieldDiffs(currentHero?.stats, previousHero?.stats, heroStatDiffFields),
    skills: diffAbilityEntries(currentHero, previousHero),
  };
}

function relatedHeroDiffHasChanges(diff) {
  return Boolean(diff.basic.length || diff.stats.length || diff.skills.length);
}

function diffRelatedHeroes(currentHero, previousHero) {
  const currentRelated = (currentHero?.relatedHeroes || []).filter((hero) => !isSkinVariant(hero));
  const previousRelated = (previousHero?.relatedHeroes || []).filter((hero) => !isSkinVariant(hero));
  const currentMap = mapById(currentRelated);
  const previousMap = mapById(previousRelated);

  return orderedDiffIds(currentRelated, previousRelated)
    .map((id) => {
      const hero = currentMap.get(id);
      const previous = previousMap.get(id);
      const diff = buildRelatedHeroDiff(hero, previous);
      if (!relatedHeroDiffHasChanges(diff)) return null;
      return {
        id,
        type: diffRowType(hero, previous),
        hero,
        previousHero: previous,
        diff,
      };
    })
    .filter(Boolean);
}

function buildHeroDiff(hero, previousHero) {
  return {
    basic: [
      ...collectFieldDiffs(hero, previousHero, heroBasicDiffFields),
      ...collectSourceTextDiffs(hero, previousHero, heroLocalizedDiffFields),
    ],
    stats: collectFieldDiffs(hero?.stats, previousHero?.stats, heroStatDiffFields),
    forms: diffRelatedHeroes(hero, previousHero),
    skills: diffAbilityEntries(hero, previousHero),
  };
}

function buildItemDiff(item, previousItem) {
  return {
    fields: [
      ...collectFieldDiffs(item, previousItem, itemDiffFields),
      ...collectSourceTextDiffs(item, previousItem, itemLocalizedDiffFields),
    ],
  };
}

function buildHeroDiffRows(currentHeroes, previousHeroes) {
  const currentMap = mapById(currentHeroes);
  const previousMap = mapById(previousHeroes);

  return orderedDiffIds(currentHeroes, previousHeroes)
    .map((id) => {
      const hero = currentMap.get(id);
      const previousHero = previousMap.get(id);
      const diff = buildHeroDiff(hero, previousHero);
      if (!diffHasChanges(diff)) return null;
      return {
        id,
        type: diffRowType(hero, previousHero),
        hero,
        previousHero,
        diff,
      };
    })
    .filter(Boolean);
}

function buildItemDiffRows(currentItems, previousItems) {
  const currentMap = mapById(currentItems);
  const previousMap = mapById(previousItems);

  return orderedDiffIds(currentItems, previousItems)
    .map((id) => {
      const item = currentMap.get(id);
      const previousItem = previousMap.get(id);
      const diff = buildItemDiff(item, previousItem);
      if (!diffHasChanges(diff)) return null;
      return {
        id,
        type: diffRowType(item, previousItem),
        item,
        previousItem,
        diff,
      };
    })
    .filter(Boolean);
}

function diffHeroEntity(row) {
  return row?.hero || row?.previousHero || null;
}

function diffItemEntity(row) {
  return row?.item || row?.previousItem || null;
}

function searchableHeroDiffRow(row) {
  return [row.id, row.type, row.hero ? searchable(row.hero) : "", row.previousHero ? searchable(row.previousHero) : ""]
    .join(" ")
    .toLowerCase();
}

function searchableItemDiffRow(row) {
  return [
    row.id,
    row.type,
    row.item ? searchableItem(row.item) : "",
    row.previousItem ? searchableItem(row.previousItem) : "",
  ]
    .join(" ")
    .toLowerCase();
}

function changelogTranslationText(entity) {
  return normalizeChangelogTranslation(entity?.translations?.[state.language]) || entity?.text || entity?.title || "";
}

function changelogSectionTitle(section) {
  return changelogTranslationText(section) || section?.id || "";
}

function changelogEntryText(entry) {
  return changelogTranslationText(entry);
}

function changelogEntryTotal(sections = currentChangelogSections()) {
  return sections.reduce((total, section) => total + (section.entries?.length || 0), 0);
}

function resetDiffState() {
  state.diffCompareVersionId = "";
  state.diffCompareVersionLabel = "";
  state.diffCompareHeroes = [];
  state.diffCompareItems = [];
  state.diffHeroRows = [];
  state.diffFilteredHeroRows = [];
  state.diffItemRows = [];
  state.diffFilteredItemRows = [];
}

async function refreshDiffMode() {
  const compareVersion = comparisonVersionForCurrent();
  if (!compareVersion) {
    resetDiffState();
    return;
  }

  const data = await loadVersionDataForDiff(compareVersion);
  const version = currentVersion();
  state.diffCompareVersionId = compareVersion.id;
  state.diffCompareVersionLabel = versionLabel(compareVersion);
  state.diffCompareHeroes = playableHeroes(data.heroes || []);
  state.diffCompareItems = playableItems(data.items || []);
  state.diffHeroRows = buildHeroDiffRows(state.heroes, state.diffCompareHeroes);
  state.diffItemRows = buildItemDiffRows(state.items, state.diffCompareItems);
}

function renderChangelogEntry() {
  if (!hasCurrentChangelog()) return "";

  const active = state.view === "heroes" && state.selectedChangelog;
  const title = changelogTitle();
  const versionLabelText = state.currentVersionLabel || state.currentVersionId || t("versionLabel");
  return `
    <button class="heroButton changelogEntryButton ${active ? "active" : ""}" data-changelog-entry="true">
      ${renderIcon("", "LOG", "heroIcon", title)}
      <div>
        <div class="heroName">${escapeHtml(title)}</div>
        <div class="heroTitle">${escapeHtml(versionLabelText)}</div>
      </div>
      <div class="heroId">${escapeHtml(changelogEntryCount(changelogEntryTotal(currentChangelogSections())))}</div>
    </button>
  `;
}

function renderHeroList() {
  const rows = state.filtered
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

  els.heroList.innerHTML = `${renderChangelogEntry()}${rows}`;
}

function renderItemList() {
  els.heroList.innerHTML = state.filteredItems
    .map((item) => {
      const displayItem = localizedItem(item);
      const name = displayItem.name || item.id;
      const title = displayItem.tip || displayItem.class || "";
      return `
        <button class="heroButton itemButton ${item.id === state.selectedItemId ? "active" : ""}" data-item-id="${escapeHtml(item.id)}">
          ${renderIcon(item.iconAsset, initials(name, item.id), "heroIcon", name || item.id)}
          <div>
            <div class="heroName">${escapeHtml(name)}</div>
            <div class="heroTitle">${escapeHtml(title || t("missing"))}</div>
          </div>
          <div class="heroId">${escapeHtml(item.id)}</div>
        </button>
      `;
    })
    .join("");
}

function renderDiffBadge(type) {
  return `<span class="diffBadge ${escapeHtml(type)}">${escapeHtml(diffStatusLabel(type))}</span>`;
}

function renderHeroDiffList() {
  const rows = state.diffFilteredHeroRows
    .map((row) => {
      const hero = diffHeroEntity(row);
      const displayHero = localizedHero(hero);
      const name = displayHero.name || t("unnamedHero");
      const title = displayHero.title || t("noTitle");
      return `
        <button class="heroButton diffHeroButton ${row.id === state.selectedId ? "active" : ""}" data-id="${escapeHtml(row.id)}">
          ${renderIcon(hero.iconAsset, initials(name, ""), "heroIcon", name)}
          <div>
            <div class="heroName">${escapeHtml(name)}</div>
            <div class="heroTitle">${escapeHtml(title)}</div>
          </div>
          <div class="heroDiffMeta">
            ${renderDiffBadge(row.type)}
          </div>
        </button>
      `;
    })
    .join("");

  els.heroList.innerHTML = `${renderChangelogEntry()}${rows}`;
}

function renderItemDiffList() {
  const rows = state.diffFilteredItemRows
    .map((row) => {
      const item = diffItemEntity(row);
      const displayItem = localizedItem(item);
      const name = displayItem.name || t("missing");
      const title = displayItem.tip || displayItem.class || "";
      return `
        <button class="heroButton itemButton diffHeroButton ${row.id === state.selectedItemId ? "active" : ""}" data-item-id="${escapeHtml(row.id)}">
          ${renderIcon(item.iconAsset, initials(name, ""), "heroIcon", name)}
          <div>
            <div class="heroName">${escapeHtml(name)}</div>
            <div class="heroTitle">${escapeHtml(title || t("missing"))}</div>
          </div>
          <div class="heroDiffMeta">
            ${renderDiffBadge(row.type)}
          </div>
        </button>
      `;
    })
    .join("");

  els.heroList.innerHTML = rows;
}

function renderList() {
  renderStaticChrome();
  if (state.diffMode && state.view === "items") {
    renderItemDiffList();
    return;
  }

  if (state.diffMode && state.view === "heroes") {
    renderHeroDiffList();
    return;
  }

  if (state.view === "items") {
    renderItemList();
    return;
  }

  renderHeroList();
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

function renderVersionSwitch() {
  if (!els.versionSelect) return;

  els.versionSelect.innerHTML = state.versions
    .map((version) => {
      const label = versionLabel(version);
      return `
        <option value="${escapeHtml(version.id)}" ${version.id === state.currentVersionId ? "selected" : ""}>
          ${escapeHtml(label)}
        </option>
      `;
    })
    .join("");
  els.versionSelect.disabled = state.versions.length <= 1;
  renderStaticChrome();
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
  const score = Number.parseFloat(value);
  return Number.isFinite(score) ? Math.max(0, Math.min(5, Math.round(score))) : defaultStandScore;
}

function normalizeTier(value) {
  const tier = Number.parseInt(value, 10);
  return Number.isFinite(tier) ? Math.max(0, Math.min(5, tier)) : defaultTier;
}

function normalizeScore(value) {
  return gradeScore(value);
}

function normalizeOrder(value) {
  const order = Number.parseFloat(value);
  return Number.isFinite(order) ? Math.max(0, order) : null;
}

function defaultTierFromScore(score) {
  return defaultTier;
}

function heroOverride(id) {
  return state.ratingOverrides[id] || {};
}

function visitRelatedHeroes(hero, callback, baseHero = hero) {
  for (const relatedHero of hero.relatedHeroes || []) {
    callback(relatedHero, baseHero);
    visitRelatedHeroes(relatedHero, callback, baseHero);
  }
}

function ratingIdentityForId(id) {
  for (const hero of state.heroes) {
    if (hero.id === id) {
      return { id: hero.id, hero, tierEditable: true, scoresEditable: true };
    }

    let found = null;
    visitRelatedHeroes(hero, (relatedHero, baseHero) => {
      if (found || relatedHero.id !== id) return;

      if (relatedHero.relationType === "skin") {
        found = { id: baseHero.id, hero: baseHero, tierEditable: true, scoresEditable: true, aliasId: relatedHero.id };
      } else {
        found = { id: relatedHero.id, hero: relatedHero, tierEditable: false, scoresEditable: true, sourceHeroId: baseHero.id };
      }
    });

    if (found) return found;
  }

  return null;
}

function ratingTargetOrderMap() {
  const order = new Map();
  let index = 0;

  for (const hero of state.heroes) {
    order.set(hero.id, index);
    index += 1;

    visitRelatedHeroes(hero, (relatedHero) => {
      if (relatedHero.relationType === "skin" || order.has(relatedHero.id)) return;
      order.set(relatedHero.id, index);
      index += 1;
    });
  }

  return order;
}

function baseStandStats(hero) {
  return standAxes.map((axis) => ({
    ...axis,
    label: axisLabel(axis),
    score: defaultStandScore,
    grade: standGrades[defaultStandScore],
  }));
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

    bits |= normalizeScore(scores[axis.key]) << bitCount;
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

function readCompactScores(bytes, offset, scoreMask = 0, version = compactRatingVersion) {
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

    const encodedScore = bits & 7;
    scores[axis.key] = normalizeScore(version === legacyCompactRatingVersion ? encodedScore + 1 : encodedScore);
    bits >>= 3;
    bitCount -= 3;
  });

  return { scores, offset: cursor };
}

function normalizedRatingOverrides(input) {
  const source = input?.heroes || input?.ratings || input || {};
  const result = {};

  for (const [id, value] of Object.entries(source)) {
    const target = ratingIdentityForId(id);
    if (!target) continue;

    const entry = { ...(result[target.id] || {}) };
    if (target.tierEditable && value?.tier != null) {
      entry.tier = normalizeTier(value.tier);
    }
    const order = normalizeOrder(value?.order);
    if (target.tierEditable && order != null) {
      entry.order = order;
    }

    const sourceScores = value?.scores || value?.stand || value?.ratings || {};
    const scores = { ...(entry.scores || {}) };
    for (const axis of standAxes) {
      if (sourceScores[axis.key] != null) {
        scores[axis.key] = normalizeScore(sourceScores[axis.key]);
      }
    }
    if (Object.keys(scores).length) {
      entry.scores = scores;
    }

    if (Object.keys(entry).length) {
      result[target.id] = entry;
    }
  }

  return result;
}

function ratingEntries() {
  const heroOrder = ratingTargetOrderMap();
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
        writer.write(normalizeScore(entry.scores[axis.key]), 3);
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
  if (![legacyCompactRatingVersion, compactRatingVersion].includes(bytes[4])) {
    throw new Error(t("unsupportedVersion", { version: bytes[4] }));
  }

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
      const decoded = readCompactScores(bytes, offset, scoreMask, bytes[4]);
      entry.scores = decoded.scores;
      offset = decoded.offset;
    }

    if (Object.keys(entry).length) {
      result[id] = entry;
    }
  }

  return normalizedRatingOverrides(result);
}

function decodeShortRatingPayload(text) {
  const bytes = bytesFromBase64Url(text.slice(shortRatingPrefix.length));
  const reader = new BitReader(bytes);
  const version = reader.read(3);
  if (![legacyShortRatingVersion, shortRatingVersion].includes(version)) {
    throw new Error(t("unsupportedVersion", { version }));
  }

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
          const encodedScore = reader.read(3);
          scores[axis.key] = normalizeScore(version === legacyShortRatingVersion ? encodedScore + 1 : encodedScore);
        }
      });
      entry.scores = scores;
    }

    if (Object.keys(entry).length) {
      result[id] = entry;
    }
  }

  return normalizedRatingOverrides(result);
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

function completeRatingSnapshotOverrides() {
  const sourceOverrides = normalizedRatingOverrides(state.ratingOverrides);
  const result = {};

  for (const row of rankedHeroes(state.heroes)) {
    const sourceOverride = sourceOverrides[row.hero.id] || {};
    const sourceScores = sourceOverride.scores || {};
    const tier = tierForHero(row.hero);
    const order = normalizeOrder(sourceOverride.order);
    const ratings = calculateStandStats(row.hero);
    const hasScoreOverride = Object.keys(sourceScores).length > 0;
    const hasNonDefaultScore = ratings.some((axis) => axis.score !== defaultStandScore);
    const hasNonDefaultTier = tier !== defaultTier;
    const scores = {};
    const entry = {};

    if (hasNonDefaultTier) {
      entry.tier = tier;
    }
    if (order != null) {
      entry.order = order;
    }
    if (hasScoreOverride && hasNonDefaultScore) {
      for (const axis of ratings) {
        scores[axis.key] = axis.score;
      }
      entry.scores = scores;
    }

    if (Object.keys(entry).length) {
      result[row.hero.id] = entry;
    }
  }

  return result;
}

function currentRatingPayload() {
  if (!Object.keys(normalizedRatingOverrides(state.ratingOverrides)).length) return "";

  const previousOverrides = state.ratingOverrides;
  state.ratingOverrides = completeRatingSnapshotOverrides();
  try {
    return Object.keys(state.ratingOverrides).length ? encodeRatingPayload() : "";
  } finally {
    state.ratingOverrides = previousOverrides;
  }
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

function ratingStorageKey() {
  return `${ratingStorageKeyPrefix}.${state.currentVersionId || "default"}`;
}

function saveRatingCache() {
  let payload = "";
  try {
    payload = currentRatingPayload();
    const storageKey = ratingStorageKey();
    if (!payload) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, payload);
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
    const storageKey = ratingStorageKey();
    const text =
      localStorage.getItem(storageKey) ||
      (state.currentVersionId === "KR47fix4" ? localStorage.getItem(legacyRatingStorageKey) : "");
    if (!text) return 0;

    state.ratingOverrides = parseRatingImport(text);
    if (storageKey !== legacyRatingStorageKey) {
      localStorage.setItem(storageKey, text);
    }
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
      ${scoreLevels
        .map(
          (score) => `
            <option value="${score}" ${score === axis.score ? "selected" : ""}>${score ? `${standGrades[score]} ${score}` : "0"}</option>
          `,
        )
        .join("")}
    </select>
  `;
}

function renderStandPanel(hero, options = true) {
  const settings =
    typeof options === "boolean"
      ? { scoresEditable: options, tierEditable: options }
      : {
          scoresEditable: Boolean(options?.scoresEditable),
          tierEditable: Boolean(options?.tierEditable),
        };
  const ratings = calculateStandStats(hero);
  const ratingTotal = sumStandScores(ratings);

  return `
    <div class="standPanel">
      <div class="standHeader">
        <div class="standTitle">${escapeHtml(t("standTitle"))}</div>
        <div class="standHeaderControls">
          ${settings.tierEditable ? renderTierSelect(hero) : ""}
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
                ${settings.scoresEditable ? renderScoreSelect(hero, axis) : ""}
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

  for (const grantedSkill of exclusiveGrantedSkills(weapon)) {
    entries.push({
      ...grantedSkill,
      buttonPos: { x: 0, y: 1 },
      kind: "exclusiveSkill",
      categoryKey: "exclusiveSkill",
      buttonLabel: grantedSkill.hotkey || "G",
      sourceWeapon: weapon.name || weapon.id,
      inheritedFrom: weapon.inheritedFrom,
    });
  }

  return entries;
}

function temporaryAbilityPanelsForHero(hero) {
  return (hero.temporaryAbilityPanels || [])
    .map((panel, panelIndex) => {
      const sourceAbilityId = panel.sourceAbilityId || `panel${panelIndex}`;
      const sourceAbilityName = panel.sourceAbilityName || panel.sourceAbilityId || "";
      const abilities = (panel.abilities || []).map((ability, abilityIndex) => ({
        ...ability,
        kind: "temporarySkill",
        categoryKey: "temporarySkill",
        buttonLabel: ability.hotkey || ability.buttonLabel || ability.id,
        entryKey: `temporary:${sourceAbilityId}:${ability.id || abilityIndex}:${abilityIndex}`,
        sourceAbilityId,
        sourceAbilityName,
        sourceAbilityHotkey: panel.sourceAbilityHotkey || "",
      }));

      return {
        ...panel,
        sourceAbilityId,
        sourceAbilityName,
        abilities,
      };
    })
    .filter((panel) => panel.abilities.length);
}

function temporaryAbilityPanelEntries(hero) {
  return temporaryAbilityPanelsForHero(hero).flatMap((panel) => panel.abilities);
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

  entries.push(...temporaryAbilityPanelEntries(hero));

  return entries;
}

function renderAbilityButton(ability) {
  const kindClass = ability.kind ? ` ${ability.kind}` : "";
  const name = localized(ability, "name") || ability.id;
  const buttonLabel = ability.buttonLabelKey ? t(ability.buttonLabelKey) : ability.buttonLabel || ability.hotkey || ability.id;
  const entryKey = ability.entryKey || ability.id;

  return `
    <button
      class="abilityButton${kindClass} ${entryKey === state.expandedAbilityId ? "active" : ""}"
      data-entry-id="${escapeHtml(entryKey)}"
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

function renderTemporaryAbilityPanel(panel) {
  const sourceLabel = panel.sourceAbilityName || panel.sourceAbilityId || t("temporarySkill");
  const columnCount = Math.max(1, Math.min(3, panel.abilities.length));

  return `
    <section class="temporaryPanel" style="--temporary-columns: ${columnCount}">
      <div class="temporaryPanelTitle">
        <span>${escapeHtml(t("temporaryPanelTitle"))}</span>
        <strong title="${escapeHtml(sourceLabel)}">${escapeHtml(sourceLabel)}</strong>
      </div>
      <div class="temporaryPanelButtons">
        ${panel.abilities.map((ability) => renderAbilityButton(ability)).join("")}
      </div>
    </section>
  `;
}

function renderAbilities(hero) {
  const displayHero = localizedHero(hero);
  const temporaryPanels = temporaryAbilityPanelsForHero(displayHero);
  const allEntries = layoutEntriesForHero(displayHero);
  if (!allEntries.length) {
    return `<div class="muted">${escapeHtml(t("noAbilities"))}</div>`;
  }

  const sideEntries = allEntries.filter((ability) => ability.kind === "exclusiveItem");
  const entries = allEntries.filter((ability) => ability.kind !== "exclusiveItem" && ability.kind !== "temporarySkill");
  const expanded = allEntries.find((ability) => (ability.entryKey || ability.id) === state.expandedAbilityId);
  const { slots, loose } = groupAbilitiesByPosition(entries);

  return `
    <div class="abilityGridRow">
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
        temporaryPanels.length
          ? `
            <div class="temporaryPanelRail" aria-label="${escapeHtml(t("temporarySkill"))}">
              ${temporaryPanels.map((panel) => renderTemporaryAbilityPanel(panel)).join("")}
            </div>
          `
          : ""
      }
      ${
        sideEntries.length
          ? `
            <div class="exclusiveItemRail">
              ${sideEntries.map((ability) => renderAbilityButton(ability)).join("")}
            </div>
          `
          : ""
      }
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
                  ${expanded.sourceAbilityName ? `<span class="pill">${escapeHtml(t("from"))} ${escapeHtml(expanded.sourceAbilityName)}</span>` : ""}
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

function abilityPanelHeroForDisplay(baseHero, activeHero) {
  const exceptionApplies =
    skinAbilityPanelBaseExceptionIds.has(baseHero.id) || skinAbilityPanelBaseExceptionIds.has(activeHero.id);
  if (activeHero.relationType === "skin" && !exceptionApplies) return baseHero;
  return activeHero;
}

function standPanelContext(baseHero, activeHero) {
  if (activeHero.relationType && activeHero.relationType !== "skin") {
    return null;
  }

  const identity = ratingIdentityForId(activeHero.id) || ratingIdentityForId(baseHero.id);
  const hero = identity?.hero || activeHero;

  return {
    hero,
    scoresEditable: Boolean(identity?.scoresEditable),
    tierEditable: Boolean(identity?.tierEditable),
  };
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
  const standContext = standPanelContext(hero, activeHero);
  const relatedSwitch = renderRelatedHeroSwitch(hero, activeHero);
  const abilityPanelHero = abilityPanelHeroForDisplay(hero, activeHero);
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
          <div class="panelBody">${renderAbilities(abilityPanelHero)}</div>
        </section>
      </div>

      <section class="panel statsPanel">
        <h2>${escapeHtml(t("statsTitle"))}</h2>
        <div class="panelBody">
          <div class="stats">${renderStats(activeHero)}</div>
          ${standContext ? renderStandPanel(standContext.hero, standContext) : ""}
        </div>
      </section>
    </div>
  `;
}

function itemCostText(item) {
  const parts = [];
  if (item.goldCost) parts.push(`${item.goldCost} G`);
  if (item.lumberCost) parts.push(`${item.lumberCost} L`);
  return parts.join(" / ");
}

function itemStockText(item) {
  const parts = [];
  if (item.stockMax) parts.push(item.stockMax);
  if (item.stockRegen) parts.push(`${item.stockRegen}s`);
  return parts.join(" / ");
}

function renderItemDataRow(label, value, className = "") {
  return `
    <div class="itemDataRow ${className}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || t("missing"))}</strong>
    </div>
  `;
}

function renderItemDetail(item) {
  if (!item) {
    els.detail.innerHTML = `<div class="empty">${escapeHtml(t("noMatchingItem"))}</div>`;
    return;
  }

  const displayItem = localizedItem(item);
  const name = displayItem.name || item.id;
  const tip = (displayItem.tip || "").trim();
  const description = (displayItem.description || "").trim();
  const costText = itemCostText(item);
  const stockText = itemStockText(item);
  const abilityText = (item.abilityIds || []).join(", ");

  els.detail.innerHTML = `
    <div class="itemPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("viewItems"))}</h2>
        </div>
        <div class="rankingCount">${escapeHtml(t("itemCount", { count: state.filteredItems.length }))}</div>
      </div>

      <section class="itemProfile">
        <div class="profileHeader">
          ${renderIcon(item.iconAsset, initials(name, item.id), "heroIcon", name || item.id)}
          <div>
            <h2 class="profileName">${escapeHtml(name)}</h2>
            <div class="profileMeta">
              <span class="pill">${escapeHtml(item.id)}</span>
              ${item.class ? `<span class="pill">${escapeHtml(item.class)}</span>` : ""}
              ${item.level ? `<span class="pill">${escapeHtml(`${t("itemLevel")} ${item.level}`)}</span>` : ""}
              ${costText ? `<span class="pill">${escapeHtml(costText)}</span>` : ""}
            </div>
          </div>
        </div>
      </section>

      <div class="itemContentGrid">
        <section class="panel">
          <h2>${escapeHtml(t("itemDescriptionTitle"))}</h2>
          <div class="panelBody">
            ${
              tip
                ? `<div class="itemTip">
                    <span>${escapeHtml(t("itemTip"))}</span>
                    <strong>${escapeHtml(tip)}</strong>
                  </div>`
                : ""
            }
            <div class="description">${escapeHtml(description || t("itemNoDescription"))}</div>
          </div>
        </section>

        <section class="panel itemDataPanel">
          <h2>${escapeHtml(t("itemDataTitle"))}</h2>
          <div class="panelBody itemDataGrid">
            ${renderItemDataRow(t("itemClass"), item.class)}
            ${renderItemDataRow(t("itemLevel"), item.level)}
            ${renderItemDataRow(t("itemCost"), costText)}
            ${renderItemDataRow(t("itemStock"), stockText)}
            ${renderItemDataRow(t("itemCooldown"), item.cooldownId)}
            ${renderItemDataRow(t("itemAbilities"), abilityText, "wide")}
            ${renderItemDataRow(t("itemModel"), item.model, "wide path")}
            ${renderItemDataRow(t("itemIconPath"), item.icon, "wide path")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderDiffEmpty() {
  return `<div class="empty">${escapeHtml(t("diffNoChanges"))}</div>`;
}

function renderDiffValue(label, value, className) {
  return `
    <div class="diffValue ${className}">
      <div class="diffValueLabel">${escapeHtml(label)}</div>
      <div class="diffValueText">${escapeHtml(formatDiffValue(value))}</div>
    </div>
  `;
}

const addedHiddenDiffFields = new Set(["hotkey", "icon", "buttonPos"]);

function visibleDiffChanges(changes = [], type = "") {
  if (type !== "added") return changes;
  return changes.filter((change) => !addedHiddenDiffFields.has(change.label));
}

function renderDiffChange(change, type = "") {
  const isAdded = type === "added";
  return `
    <div class="diffField">
      <div class="diffFieldLabel">${escapeHtml(change.label)}</div>
      <div class="diffValueGrid ${isAdded ? "single" : ""}">
        ${isAdded ? "" : renderDiffValue(t("diffOld"), change.oldValue, "old")}
        ${renderDiffValue(t("diffNew"), change.newValue, "new")}
      </div>
    </div>
  `;
}

function renderDiffChanges(changes = [], type = "") {
  const visibleChanges = visibleDiffChanges(changes, type);
  if (!visibleChanges.length) return "";
  return `<div class="diffFieldList">${visibleChanges.map((change) => renderDiffChange(change, type)).join("")}</div>`;
}

function renderDiffSection(title, content) {
  if (!content) return "";
  return `
    <section class="panel diffSection">
      <h2>${escapeHtml(title)}</h2>
      <div class="panelBody">${content}</div>
    </section>
  `;
}

function diffAbilityName(ability) {
  const displayAbility = localizedEntity(ability);
  return displayAbility.name || ability?.name || "";
}

function renderAbilityDiffs(rows = []) {
  if (!rows.length) return "";

  return `
    <div class="diffEntryList">
      ${rows
        .map((row) => {
          const ability = row.ability || row.previousAbility;
          const name = diffAbilityName(ability) || t("missing");
          return `
            <article class="diffEntry ${escapeHtml(row.type)}">
              <div class="diffEntryHeader">
                ${renderIcon(ability?.iconAsset, ability?.hotkey || initials(name, ""), "abilityIcon", name)}
                <div>
                  <div class="abilityName">${escapeHtml(name)}</div>
                  <div class="profileMeta">
                    ${renderDiffBadge(row.type)}
                  </div>
                </div>
              </div>
              ${renderDiffChanges(row.fields, row.type)}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderRelatedHeroDiffs(rows = []) {
  if (!rows.length) return "";

  return `
    <div class="diffEntryList">
      ${rows
        .map((row) => {
          const hero = row.hero || row.previousHero;
          const displayHero = localizedHero(hero);
          const name = displayHero.name || t("unnamedHero");
          const title = displayHero.title || "";
          const basic = renderDiffChanges(row.diff.basic, row.type);
          const stats = renderDiffChanges(row.diff.stats, row.type);
          const skills = renderAbilityDiffs(row.diff.skills);
          return `
            <article class="diffEntry ${escapeHtml(row.type)}">
              <div class="diffEntryHeader">
                ${renderIcon(hero?.iconAsset, initials(name, ""), "heroIcon", name)}
                <div>
                  <div class="abilityName">${escapeHtml(name)}</div>
                  <div class="profileMeta">
                    ${title ? `<span class="pill">${escapeHtml(title)}</span>` : ""}
                    ${renderDiffBadge(row.type)}
                  </div>
                </div>
              </div>
              ${basic ? `<div class="diffSubsection"><h3>${escapeHtml(t("diffBasic"))}</h3>${basic}</div>` : ""}
              ${stats ? `<div class="diffSubsection"><h3>${escapeHtml(t("diffStats"))}</h3>${stats}</div>` : ""}
              ${skills ? `<div class="diffSubsection"><h3>${escapeHtml(t("diffSkills"))}</h3>${skills}</div>` : ""}
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderHeroDiffDetail(row) {
  if (!row) {
    els.detail.innerHTML = renderDiffEmpty();
    return;
  }

  const hero = diffHeroEntity(row);
  const displayHero = localizedHero(hero);
  const name = displayHero.name || t("unnamedHero");
  const title = displayHero.title || "";
  const sections = [
    renderDiffSection(t("diffBasic"), renderDiffChanges(row.diff.basic, row.type)),
    renderDiffSection(t("diffStats"), renderDiffChanges(row.diff.stats, row.type)),
    renderDiffSection(t("diffForms"), renderRelatedHeroDiffs(row.diff.forms)),
    renderDiffSection(t("diffSkills"), renderAbilityDiffs(row.diff.skills)),
  ].join("");

  els.detail.innerHTML = `
    <div class="diffPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("diffToggleLabel"))}</h2>
          <p>${escapeHtml(diffCompareText())}</p>
        </div>
        ${renderDiffBadge(row.type)}
      </div>

      <section class="itemProfile">
        <div class="profileHeader">
          ${renderIcon(hero.iconAsset, initials(name, ""), "heroIcon", name)}
          <div>
            <h2 class="profileName">${escapeHtml(name)}</h2>
            <div class="profileMeta">
              ${title ? `<span class="pill">${escapeHtml(title)}</span>` : ""}
            </div>
          </div>
        </div>
      </section>

      ${sections || renderDiffEmpty()}
    </div>
  `;
}

function renderItemDiffDetail(row) {
  if (!row) {
    els.detail.innerHTML = renderDiffEmpty();
    return;
  }

  const item = diffItemEntity(row);
  const displayItem = localizedItem(item);
  const name = displayItem.name || t("missing");
  const tip = (displayItem.tip || "").trim();
  const fields = renderDiffChanges(row.diff.fields, row.type);

  els.detail.innerHTML = `
    <div class="itemPage diffPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("diffToggleLabel"))}</h2>
          <p>${escapeHtml(diffCompareText())}</p>
        </div>
        ${renderDiffBadge(row.type)}
      </div>

      <section class="itemProfile">
        <div class="profileHeader">
          ${renderIcon(item.iconAsset, initials(name, ""), "heroIcon", name)}
          <div>
            <h2 class="profileName">${escapeHtml(name)}</h2>
            <div class="profileMeta">
              ${tip ? `<span class="pill">${escapeHtml(tip)}</span>` : ""}
              ${item.class ? `<span class="pill">${escapeHtml(item.class)}</span>` : ""}
            </div>
          </div>
        </div>
      </section>

      ${renderDiffSection(t("diffItemFields"), fields) || renderDiffEmpty()}
    </div>
  `;
}

function renderChangelogDetail() {
  const sections = currentChangelogSections();
  if (!sections.length) {
    els.detail.innerHTML = `
      <div class="diffPage">
        <div class="rankingHeader">
          <div>
            <h2>${escapeHtml(changelogTitle())}</h2>
            <p>${escapeHtml(state.currentVersionLabel || state.currentVersionId || t("versionLabel"))}</p>
          </div>
        </div>
        ${renderDiffEmpty()}
      </div>
    `;
    return;
  }

  const content = sections
    .map((section) => {
      const title = changelogSectionTitle(section);
      const entries = (section.entries || [])
        .map(
          (entry, index) => `
            <li class="changelogEntry">
              <span class="changelogIndex">${escapeHtml(String(index + 1))}</span>
              <div class="changelogText">${escapeHtml(changelogEntryText(entry))}</div>
            </li>
          `,
        )
        .join("");

      return renderDiffSection(
        title,
        entries ? `<ol class="changelogEntries">${entries}</ol>` : `<div class="empty">${escapeHtml(changelogEmptyText())}</div>`,
      );
    })
    .join("");

  els.detail.innerHTML = `
    <div class="diffPage changelogPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(changelogTitle())}</h2>
          <p>${escapeHtml(state.currentVersionLabel || state.currentVersionId || t("versionLabel"))}</p>
        </div>
        <span class="diffBadge changed">${escapeHtml(changelogEntryCount(changelogEntryTotal(sections)))}</span>
      </div>

      ${content || renderDiffEmpty()}
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

function selectedToolHeroes() {
  const ids = state.toolRouletteHeroIds.length
    ? state.toolRouletteHeroIds
    : state.toolRouletteHeroId
      ? [state.toolRouletteHeroId]
      : [];
  const heroMap = new Map(state.heroes.map((hero) => [hero.id, hero]));
  return ids.map((id) => heroMap.get(id)).filter(Boolean);
}

function toolHeroRows() {
  return [...state.heroes].sort((left, right) => {
    const leftName = localizedHero(left).name || left.id;
    const rightName = localizedHero(right).name || right.id;
    return leftName.localeCompare(rightName, state.language === "zhCN" ? "zh-Hans-CN" : "ko-KR");
  });
}

function renderToolHeroRow(hero, selectedIds) {
  const displayHero = localizedHero(hero);
  const name = displayHero.name || t("unnamedHero");
  const title = displayHero.title ? `${name} - ${displayHero.title}` : name;
  const active = selectedIds.has(hero.id);

  return `
    <button
      class="toolHeroRow ${active ? "active" : ""}"
      type="button"
      data-tool-hero-id="${escapeHtml(hero.id)}"
      aria-label="${escapeHtml(title)}"
      title="${escapeHtml(title)}"
    >
      ${renderIcon(hero.iconAsset, initials(name, hero.id), "heroIcon", name || hero.id)}
    </button>
  `;
}

function renderToolsPage() {
  const rows = toolHeroRows();
  const selectedHeroes = selectedToolHeroes();
  const selectedIds = new Set(selectedHeroes.map((hero) => hero.id));
  const displaySelectedHeroes = selectedHeroes.map((hero) => localizedHero(hero));
  const selectedNames = displaySelectedHeroes.map((hero, index) => hero.name || selectedHeroes[index].id);
  const selectedName = selectedNames.length ? selectedNames.join(" / ") : t("toolPending");
  const selectedTitle =
    selectedHeroes.length > 1
      ? state.toolRouletteMode === "meta"
        ? t("toolMetaResult")
        : t("toolTeamResult")
      : displaySelectedHeroes[0]?.title || selectedHeroes[0]?.id || t("toolResult");

  els.detail.innerHTML = `
    <div class="toolsPage">
      <div class="rankingHeader">
        <div>
          <h2>${escapeHtml(t("toolsTitle"))}</h2>
          <p>${escapeHtml(t("toolsSummary", { count: rows.length }))}</p>
        </div>
        <div class="toolActions">
          <button
            class="toolRandomButton"
            type="button"
            data-tool-random="single"
            ${state.toolRouletteSpinning || !rows.length ? "disabled" : ""}
          >
            ${escapeHtml(state.toolRouletteSpinning && state.toolRouletteMode === "single" ? t("toolRolling") : t("toolRandom"))}
          </button>
          <button
            class="toolRandomButton"
            type="button"
            data-tool-random="team"
            ${state.toolRouletteSpinning || rows.length < 3 ? "disabled" : ""}
          >
            ${escapeHtml(state.toolRouletteSpinning && state.toolRouletteMode === "team" ? t("toolTeamRolling") : t("toolTeamRandom"))}
          </button>
          <button
            class="toolRandomButton"
            type="button"
            data-tool-random="meta"
            ${state.toolRouletteSpinning || rows.length < 3 ? "disabled" : ""}
          >
            ${escapeHtml(state.toolRouletteSpinning && state.toolRouletteMode === "meta" ? t("toolMetaRolling") : t("toolMetaRandom"))}
          </button>
        </div>
      </div>

      <section class="toolRoulettePanel">
        <div>
          <div class="shareLabel">${escapeHtml(t("toolRouletteTitle"))}</div>
          <h3>${escapeHtml(selectedName)}</h3>
          <p>${escapeHtml(selectedHeroes.length ? selectedTitle : t("toolResult"))}</p>
        </div>
        <div class="toolRouletteIcon ${selectedHeroes.length > 1 ? "team" : ""} ${state.toolRouletteSpinning ? "spinning" : ""}">
          ${
            selectedHeroes.length
              ? selectedHeroes
                  .map((hero, index) => {
                    const name = selectedNames[index] || hero.id;
                    return renderIcon(hero.iconAsset, initials(name, hero.id), "heroIcon", name || hero.id);
                  })
                  .join("")
              : renderIcon("", "?", "heroIcon", t("toolPending"))
          }
        </div>
      </section>

      <section class="toolIconPanel">
        <div class="toolHeroRows">
          ${rows.map((hero) => renderToolHeroRow(hero, selectedIds)).join("")}
        </div>
      </section>
    </div>
  `;
}

function clearToolRoulette() {
  if (state.toolRouletteTimer) {
    window.clearInterval(state.toolRouletteTimer);
    state.toolRouletteTimer = null;
  }
  state.toolRouletteSpinning = false;
}

function scrollToolSelectionIntoView() {
  if (state.view !== "tools" || !state.toolRouletteHeroId) return;
  const row = els.detail.querySelector(`.toolHeroRow[data-tool-hero-id="${CSS.escape(state.toolRouletteHeroId)}"]`);
  row?.scrollIntoView({ block: "nearest" });
}

function updateToolSelection(heroes) {
  const ids = heroes.map((hero) => hero.id).filter(Boolean);
  state.toolRouletteHeroIds = ids;
  state.toolRouletteHeroId = ids[0] || "";
}

function shuffledToolHeroes(heroes) {
  const result = [...heroes];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function randomToolHeroes(heroes, count) {
  return shuffledToolHeroes(heroes).slice(0, Math.min(count, heroes.length));
}

function toolHeroScoreVector(hero) {
  return calculateStandStats(hero).map((axis) => axis.score);
}

function toolTeamComplementScore(heroes) {
  const axisTotals = standAxes.map((_, axisIndex) =>
    heroes.reduce((sum, hero) => sum + toolHeroScoreVector(hero)[axisIndex], 0),
  );
  const total = axisTotals.reduce((sum, value) => sum + value, 0);
  const minimum = Math.min(...axisTotals);
  const maximum = Math.max(...axisTotals);
  const average = total / axisTotals.length;
  const variance = axisTotals.reduce((sum, value) => sum + (value - average) ** 2, 0) / axisTotals.length;

  return minimum * 100 + total * 5 - (maximum - minimum) * 12 - variance * 4;
}

function complementaryToolTeam(heroes) {
  if (heroes.length <= 3) return randomToolHeroes(heroes, 3);

  const combinations = [];
  for (let firstIndex = 0; firstIndex < heroes.length - 2; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < heroes.length - 1; secondIndex += 1) {
      for (let thirdIndex = secondIndex + 1; thirdIndex < heroes.length; thirdIndex += 1) {
        const team = [heroes[firstIndex], heroes[secondIndex], heroes[thirdIndex]];
        combinations.push({
          team,
          score: toolTeamComplementScore(team),
          random: Math.random(),
        });
      }
    }
  }

  combinations.sort((left, right) => right.score - left.score || left.random - right.random);
  const topCount = Math.max(12, Math.ceil(combinations.length * 0.08));
  const topScore = combinations[Math.min(topCount - 1, combinations.length - 1)]?.score ?? combinations[0]?.score ?? 0;
  const topTeams = combinations.filter((item) => item.score >= topScore);
  return topTeams[Math.floor(Math.random() * topTeams.length)]?.team || randomToolHeroes(heroes, 3);
}

function toolCompetitiveRankMap(heroes) {
  const ranked = rankedHeroes(heroes);
  return new Map(
    ranked.map((row, index) => [
      row.hero.id,
      {
        ...row,
        index,
        total: ranked.length,
      },
    ]),
  );
}

function toolHeroCompetitiveScore(hero, rankMap) {
  const row = rankMap.get(hero.id);
  if (!row) return 0;

  return (5 - row.tier) * 240 + (row.total - row.index) * 8 + row.score * 10;
}

function toolTeamCompetitiveScore(heroes, rankMap) {
  const individualScore = heroes.reduce((sum, hero) => sum + toolHeroCompetitiveScore(hero, rankMap), 0);
  return individualScore + toolTeamComplementScore(heroes);
}

function strongestToolTeam(heroes) {
  if (heroes.length <= 3) {
    return rankedHeroes(heroes)
      .map((row) => row.hero)
      .slice(0, 3);
  }

  const rankMap = toolCompetitiveRankMap(heroes);
  const combinations = [];

  for (let firstIndex = 0; firstIndex < heroes.length - 2; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < heroes.length - 1; secondIndex += 1) {
      for (let thirdIndex = secondIndex + 1; thirdIndex < heroes.length; thirdIndex += 1) {
        const team = [heroes[firstIndex], heroes[secondIndex], heroes[thirdIndex]];
        const score = toolTeamCompetitiveScore(team, rankMap);
        const rankIndexSum = team.reduce((sum, hero) => sum + (rankMap.get(hero.id)?.index ?? Number.MAX_SAFE_INTEGER), 0);
        const idText = team.map((hero) => hero.id).sort().join(",");
        combinations.push({ team, score, rankIndexSum, idText });
      }
    }
  }

  combinations.sort(
    (left, right) =>
      right.score - left.score ||
      left.rankIndexSum - right.rankIndexSum ||
      left.idText.localeCompare(right.idText),
  );

  const topCount = Math.max(8, Math.ceil(combinations.length * 0.04));
  const topScore = combinations[Math.min(topCount - 1, combinations.length - 1)]?.score ?? combinations[0]?.score ?? 0;
  const topTeams = combinations.filter((item) => item.score >= topScore);
  const selected = topTeams[Math.floor(Math.random() * topTeams.length)] || combinations[0];

  return selected
    ? [...selected.team].sort(
        (left, right) =>
          (rankMap.get(left.id)?.index ?? Number.MAX_SAFE_INTEGER) - (rankMap.get(right.id)?.index ?? Number.MAX_SAFE_INTEGER),
      )
    : complementaryToolTeam(heroes);
}

function startToolRoulette(mode = "single") {
  if (!state.heroes.length || state.toolRouletteSpinning) return;

  clearToolRoulette();
  state.toolRouletteMode = ["single", "team", "meta"].includes(mode) ? mode : "single";
  state.toolRouletteSpinning = true;

  const candidates = toolHeroRows();
  const finalHeroes =
    state.toolRouletteMode === "meta"
      ? strongestToolTeam(candidates)
      : state.toolRouletteMode === "team"
      ? complementaryToolTeam(candidates)
      : [candidates[Math.floor(Math.random() * candidates.length)]];
  let tick = 0;
  const totalTicks = (state.toolRouletteMode === "single" ? 24 : 30) + Math.floor(Math.random() * 10);

  state.toolRouletteTimer = window.setInterval(() => {
    tick += 1;
    const isFinal = tick >= totalTicks;
    const heroes =
      isFinal
        ? finalHeroes
        : state.toolRouletteMode === "team" || state.toolRouletteMode === "meta"
          ? randomToolHeroes(candidates, 3)
          : [candidates[Math.floor(Math.random() * candidates.length)]];
    updateToolSelection(heroes);

    if (isFinal) {
      clearToolRoulette();
    }

    renderCurrentView();
    scrollToolSelectionIntoView();
  }, 58);
}

function normalizeCommunityShareVersion(value) {
  return String(value || "").trim() || legacyCommunityShareVersion;
}

function currentCommunityShareVersion() {
  return state.currentVersionId || currentVersion()?.id || fallbackVersions[0]?.id || "";
}

function communityVersionRank(version) {
  const text = normalizeCommunityShareVersion(version);
  const match = text.match(/kr\s*(\d+)(?:\s*fix\s*(\d+)?)?/i);
  if (!match) {
    return { major: -1, fix: -1, text };
  }

  return {
    major: Number.parseInt(match[1], 10),
    fix: match[2] ? Number.parseInt(match[2], 10) : 0,
    text,
  };
}

function compareCommunityVersions(leftVersion, rightVersion) {
  const left = communityVersionRank(leftVersion);
  const right = communityVersionRank(rightVersion);
  return right.major - left.major || right.fix - left.fix || right.text.localeCompare(left.text);
}

function compareCommunityShares(left, right) {
  return (
    compareCommunityVersions(left.version, right.version) ||
    right.score - left.score ||
    left.sourceIndex - right.sourceIndex
  );
}

function groupedCommunityShares() {
  const groups = [];
  const byVersion = new Map();

  for (const share of state.communityShares) {
    const version = normalizeCommunityShareVersion(share.version);
    if (!byVersion.has(version)) {
      const group = { version, shares: [] };
      byVersion.set(version, group);
      groups.push(group);
    }
    byVersion.get(version).shares.push(share);
  }

  return groups.sort((left, right) => compareCommunityVersions(left.version, right.version));
}

function normalizeCommunityShares(data) {
  const source = Array.isArray(data) ? data : Array.isArray(data?.shares) ? data.shares : [];
  return source
    .map((item, index) => {
      const rating = String(item.rating || item.payload || item.data || "").trim();
      return {
        id: String(item.id || `share-${index + 1}`),
        sourceIndex: index,
        playerName: String(item.playerName || item.player || item.name || "").trim(),
        version: normalizeCommunityShareVersion(item.version || item.mapVersion || item.gameVersion || item.dataVersion),
        description: String(item.description || item.playerDescription || item.selfDescription || item.review || item.comment || item.note || "").trim(),
        adminReview: String(item.adminReview || item.adminComment || item.adminNote || "").trim(),
        score: normalizeCommunityScore(item.score ?? item.ratingScore ?? item.adminScore ?? 0),
        rating,
      };
    })
    .filter((item) => item.rating || item.playerName || item.description || item.adminReview)
    .sort(compareCommunityShares);
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
  if (!share.rating) {
    return {
      valid: false,
      pending: true,
      count: 0,
      length: 0,
      message: t("communityPending"),
    };
  }

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
  const description = share.description || "";
  const adminReview = share.adminReview || "";
  const canApply = stats.valid && share.rating;

  return `
    <article
      class="shareCard ${stats.valid ? "" : "invalid"} ${stats.pending ? "pending" : ""}"
      ${canApply ? `role="button" tabindex="0" data-community-share-id="${escapeHtml(share.id)}"` : `aria-disabled="true"`}
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
      ${
        description
          ? `
            <div class="shareReview">
              <div class="shareLabel">${escapeHtml(t("communityDescription"))}</div>
              <p>${escapeHtml(description)}</p>
            </div>
          `
          : ""
      }
      ${
        adminReview
          ? `
            <div class="shareReview adminReview">
              <div class="shareLabel">${escapeHtml(t("communityAdminReview"))}</div>
              <p>${escapeHtml(adminReview)}</p>
            </div>
          `
          : ""
      }
      <div class="shareActions">
        <span class="shareApplyText">${escapeHtml(stats.pending ? t("communityPending") : t("communityApply"))}</span>
        ${
          canApply
            ? `
              <button
                class="ratingToolButton shareCopyButton"
                type="button"
                data-community-copy-id="${escapeHtml(share.id)}"
              >
                ${escapeHtml(t("communityCopy"))}
              </button>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function renderCommunityShareGroup(group) {
  return `
    <section class="shareVersionGroup">
      <div class="shareVersionHeader">
        <div>
          <div class="shareLabel">${escapeHtml(t("communityVersion"))}</div>
          <h3>${escapeHtml(group.version || t("communityUnknownVersion"))}</h3>
        </div>
        <span>${escapeHtml(t("communityCount", { count: group.shares.length }))}</span>
      </div>
      <div class="shareGrid">${group.shares.map((share) => renderCommunityShareCard(share)).join("")}</div>
    </section>
  `;
}

function renderCommunityShares() {
  const groups = groupedCommunityShares();

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
        groups.length
          ? `<div class="shareVersionGroups">${groups.map((group) => renderCommunityShareGroup(group)).join("")}</div>`
          : `<div class="empty">${escapeHtml(t("communityEmpty"))}</div>`
      }
    </div>
  `;
}

function selectedHero() {
  return state.heroes.find((hero) => hero.id === state.selectedId);
}

function selectedItem() {
  return state.items.find((item) => item.id === state.selectedItemId);
}

function selectedHeroDiffRow() {
  return state.diffFilteredHeroRows.find((row) => row.id === state.selectedId);
}

function selectedItemDiffRow() {
  return state.diffFilteredItemRows.find((row) => row.id === state.selectedItemId);
}

function renderCurrentView() {
  if (state.view === "heroes" && state.selectedChangelog) {
    renderChangelogDetail();
    return;
  }

  if (state.view === "items") {
    if (state.diffMode) {
      renderItemDiffDetail(selectedItemDiffRow());
      return;
    }

    renderItemDetail(selectedItem());
    return;
  }

  if (state.view === "ranking") {
    renderTierRanking();
    return;
  }

  if (state.view === "community") {
    renderCommunityShares();
    return;
  }

  if (state.view === "tools") {
    renderToolsPage();
    return;
  }

  if (state.diffMode && state.view === "heroes") {
    renderHeroDiffDetail(selectedHeroDiffRow());
    return;
  }

  renderDetail(selectedHero());
}

function renderSummary() {
  if (state.view === "heroes" && state.selectedChangelog) {
    els.summary.textContent = `${state.currentVersionLabel || state.currentVersionId || t("versionLabel")} · ${changelogEntryCount(changelogEntryTotal(currentChangelogSections()))}`;
    return;
  }

  if (state.view === "tools") {
    els.summary.textContent = t("toolsSummary", { count: state.heroes.length });
    return;
  }

  if (state.diffMode && state.view === "items") {
    els.summary.textContent = `${diffCompareText()} · ${state.diffFilteredItemRows.length}/${state.diffItemRows.length}`;
    return;
  }

  if (state.diffMode && state.view === "heroes") {
    els.summary.textContent = `${diffCompareText()} · ${state.diffFilteredHeroRows.length}/${state.diffHeroRows.length}`;
    return;
  }

  if (state.view === "items") {
    els.summary.textContent = t("itemSummary", { total: state.items.length, shown: state.filteredItems.length });
    return;
  }

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
      body: t("communityIssueBody", { rating, version: currentCommunityShareVersion() }),
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

function applyHighestRatedCommunityShare() {
  const version = currentCommunityShareVersion();
  for (const share of state.communityShares) {
    if (normalizeCommunityShareVersion(share.version) !== version) continue;
    if (!share.rating) continue;

    try {
      const overrides = parseRatingImport(share.rating);
      if (Object.keys(overrides).length) {
        state.ratingOverrides = overrides;
        return true;
      }
    } catch {
      // Ignore invalid approved entries and keep looking for the next highest scored share.
    }
  }

  return false;
}

function setView(view) {
  state.view = views.some((item) => item.id === view) ? view : "heroes";
  if (state.view !== "tools") clearToolRoulette();
  state.selectedChangelog = false;
  state.expandedAbilityId = "";
  renderViewTabs();
  applyFilter();
}

function selectChangelog() {
  if (!hasCurrentChangelog()) return;

  clearToolRoulette();
  state.selectedChangelog = true;
  state.selectedRelatedId = "";
  state.expandedAbilityId = "";
  state.view = "heroes";
  renderViewTabs();
  renderList();
  renderCurrentView();
  renderSummary();
}

function selectHero(id) {
  clearToolRoulette();
  state.selectedChangelog = false;
  state.selectedId = id;
  state.selectedRelatedId = "";
  state.expandedAbilityId = "";
  state.view = "heroes";
  renderViewTabs();
  renderList();
  renderCurrentView();
  renderSummary();
}

function selectItem(id) {
  clearToolRoulette();
  state.selectedChangelog = false;
  state.selectedItemId = id;
  state.expandedAbilityId = "";
  state.view = "items";
  renderViewTabs();
  renderList();
  renderCurrentView();
  renderSummary();
}

function applyFilter(options = {}) {
  const { deferDetail = false } = options;
  const query = els.search.value.trim().toLowerCase();
  state.filtered = query ? state.heroes.filter((hero) => searchable(hero).includes(query)) : [...state.heroes];
  state.filteredItems = query ? state.items.filter((item) => searchableItem(item).includes(query)) : [...state.items];

  state.diffFilteredHeroRows = state.diffMode
    ? query
      ? state.diffHeroRows.filter((row) => searchableHeroDiffRow(row).includes(query))
      : [...state.diffHeroRows]
    : [];
  state.diffFilteredItemRows = state.diffMode
    ? query
      ? state.diffItemRows.filter((row) => searchableItemDiffRow(row).includes(query))
      : [...state.diffItemRows]
    : [];

  if (state.diffMode && state.view === "items") {
    if (!state.diffFilteredItemRows.some((row) => row.id === state.selectedItemId)) {
      state.selectedItemId = state.diffFilteredItemRows[0]?.id || "";
    }
  } else if (state.diffMode && state.view === "heroes") {
    if (!state.diffFilteredHeroRows.some((row) => row.id === state.selectedId)) {
      state.selectedId = state.diffFilteredHeroRows[0]?.id || "";
      state.selectedRelatedId = "";
      state.expandedAbilityId = "";
    }
  } else if (state.view === "items") {
    if (!state.filteredItems.some((item) => item.id === state.selectedItemId)) {
      state.selectedItemId = state.filteredItems[0]?.id || "";
    }
  } else if (state.view === "heroes" && !state.filtered.some((hero) => hero.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id || "";
    state.selectedRelatedId = "";
    state.expandedAbilityId = "";
  }

  renderList();
  renderSummary();
  if (deferDetail && window.requestAnimationFrame) {
    window.requestAnimationFrame(() => renderCurrentView());
  } else {
    renderCurrentView();
  }
}

function hasRelatedHeroId(hero, id) {
  if (!hero || !id) return false;
  let found = false;
  visitRelatedHeroes(hero, (relatedHero) => {
    if (relatedHero.id === id) found = true;
  });
  return found;
}

function applyHeroData(data, version) {
  const previousLanguage = state.language;
  const previousSelectedId = state.selectedId;
  const previousSelectedItemId = state.selectedItemId;
  const previousRelatedId = state.selectedRelatedId;
  const previousSelectedChangelog = state.selectedChangelog;

  state.currentVersionId = version.id;
  state.currentVersionLabel = versionLabel(version);
  state.heroes = playableHeroes(data.heroes || []);
  state.items = playableItems(data.items || []);
  state.languages = Array.isArray(data.languages) && data.languages.length ? data.languages : [{ id: "source", label: "原文" }];
  state.language = state.languages.some((language) => language.id === previousLanguage)
    ? previousLanguage
    : data.defaultLanguage ||
      (state.languages.some((language) => language.id === "zhCN") ? "zhCN" : state.languages[0]?.id || "source");
  state.filtered = [...state.heroes];
  state.filteredItems = [...state.items];
  state.selectedId = state.heroes.some((hero) => hero.id === previousSelectedId) ? previousSelectedId : state.heroes[0]?.id || "";
  state.selectedItemId = state.items.some((item) => item.id === previousSelectedItemId) ? previousSelectedItemId : state.items[0]?.id || "";
  state.selectedChangelog = previousSelectedChangelog && Array.isArray(version.changelog) && version.changelog.length > 0;
  state.toolRouletteHeroIds = state.toolRouletteHeroIds.filter((id) => state.heroes.some((hero) => hero.id === id));
  state.toolRouletteHeroId = state.toolRouletteHeroIds[0] || (state.heroes.some((hero) => hero.id === state.toolRouletteHeroId) ? state.toolRouletteHeroId : "");
  state.selectedRelatedId = hasRelatedHeroId(selectedHero(), previousRelatedId) ? previousRelatedId : "";
  state.expandedAbilityId = "";
  state.draggingHeroId = "";
  state.pointerDrag = null;
  state.ratingMessage = "";
  state.exportedRatingText = "";
  state.communityMessage = "";
}

async function loadVersionManifest() {
  try {
    const response = await fetch(versionManifestPath);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const manifest = normalizeVersionManifest(await response.json());
    state.versions = manifest.versions;
    return manifest.current;
  } catch (error) {
    console.warn("Failed to load version manifest", error);
    state.versions = fallbackVersions;
    return fallbackVersions[0]?.id || "";
  }
}

async function loadHeroVersion(versionId, options = {}) {
  const { syncUrl = true } = options;
  const version = state.versions.find((item) => item.id === versionId) || state.versions[0] || fallbackVersions[0];

  applyHeroData(await loadVersionData(version), version);
  if (syncUrl) syncVersionUrl(version.id);
}

function warmVersionDataCache() {
  const versions = state.versions.filter((version) => version.id !== state.currentVersionId);
  if (!versions.length) return;

  const warm = () => {
    versions.forEach((version) => {
      loadVersionData(version).catch((error) => {
        console.warn("Failed to warm version data", versionLabel(version) || version.id, error);
      });
    });
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(warm, { timeout: 2500 });
  } else {
    window.setTimeout(warm, 250);
  }
}

function hydrateRatingsForCurrentVersion(options = {}) {
  const { allowRatingUrl = true } = options;
  state.ratingOverrides = {};

  const cachedRatingCount = loadRatingCache();
  const hasRatingUrl = allowRatingUrl && Boolean(ratingTextFromUrl(window.location.href, { allowHashPayload: false }));
  const importedRatingFromUrl = allowRatingUrl ? importRatingFromCurrentUrl() : false;
  if (!hasRatingUrl && !importedRatingFromUrl && cachedRatingCount) {
    syncRatingUrl();
  }
  if (!hasRatingUrl && !importedRatingFromUrl && !cachedRatingCount) {
    syncRatingUrl("");
    applyHighestRatedCommunityShare();
  }
}

function renderLoadedData(options = {}) {
  renderViewTabs();
  renderVersionSwitch();
  renderLanguageSwitch();
  applyFilter(options);
}

async function toggleDiffMode() {
  if (state.diffMode) {
    state.diffMode = false;
    resetDiffState();
    renderStaticChrome();
    applyFilter();
    return;
  }

  const compareVersion = comparisonVersionForCurrent();
  if (!compareVersion) return;

  state.diffMode = true;
  state.expandedAbilityId = "";
  state.view = "heroes";
  renderStaticChrome();
  renderViewTabs();
  if (els.summary) els.summary.textContent = t("loading");

  try {
    await refreshDiffMode();
    applyFilter();
  } catch (error) {
    console.error(error);
    state.diffMode = false;
    resetDiffState();
    renderStaticChrome();
    renderSummary();
    if (els.detail) els.detail.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

async function switchVersion(versionId) {
  if (!versionId || versionId === state.currentVersionId) return;

  clearToolRoulette();
  if (els.versionSelect) els.versionSelect.disabled = true;
  if (els.summary) els.summary.textContent = t("loading");

  try {
    await loadHeroVersion(versionId);
    if (state.diffMode) await refreshDiffMode();
    renderLoadedData({ deferDetail: true });
    warmVersionDataCache();
  } catch (error) {
    console.error(error);
    renderVersionSwitch();
    if (els.summary) els.summary.textContent = t("versionFetchFailed", { version: versionId });
    if (els.detail) els.detail.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

async function boot() {
  try {
    const manifestCurrent = await loadVersionManifest();
    const requestedVersionId = versionIdFromCurrentUrl();
    await loadHeroVersion(initialVersionId(manifestCurrent, requestedVersionId), {
      syncUrl: Boolean(requestedVersionId),
    });
    await loadCommunityShares();
    hydrateRatingsForCurrentVersion({ allowRatingUrl: true });
    renderLoadedData();
    warmVersionDataCache();
  } catch (error) {
    console.error(error);
    els.summary.textContent = t("fetchFailed");
    els.detail.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

els.heroList.addEventListener("click", (event) => {
  const changelogButton = event.target.closest("[data-changelog-entry]");
  if (changelogButton) {
    selectChangelog();
    return;
  }

  const itemButton = event.target.closest(".itemButton[data-item-id]");
  if (itemButton) {
    selectItem(itemButton.dataset.itemId);
    return;
  }

  const button = event.target.closest(".heroButton");
  if (button) selectHero(button.dataset.id);
});

els.detail.addEventListener("click", (event) => {
  const toolRandom = event.target.closest("[data-tool-random]");
  if (toolRandom) {
    startToolRoulette(toolRandom.dataset.toolRandom);
    return;
  }

  const toolHero = event.target.closest("[data-tool-hero-id]");
  if (toolHero) {
    selectHero(toolHero.dataset.toolHeroId);
    return;
  }

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

els.versionSelect?.addEventListener("change", (event) => {
  switchVersion(event.target.value);
});

els.diffToggle?.addEventListener("click", () => {
  toggleDiffMode();
});

els.languageSwitch?.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-language]");
  if (!button || button.dataset.language === state.language) return;

  state.language = button.dataset.language;
  renderViewTabs();
  renderLanguageSwitch();
  if (state.diffMode) {
    if (els.summary) els.summary.textContent = t("loading");
    try {
      await refreshDiffMode();
    } catch (error) {
      console.error(error);
      state.diffMode = false;
      resetDiffState();
      if (els.detail) els.detail.innerHTML = `<div class="empty">${escapeHtml(error.message)}</div>`;
    }
  }
  applyFilter();
});

boot();

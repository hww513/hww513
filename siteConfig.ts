// siteConfig.ts - 你的全站“控制中心”

export const siteConfig = {
  // 1. 网站标题与博主信息
  title: "hww513的初醒屿",
  faviconUrl: "/images/avatar.svg",
  authorName: "hww513",
  bio: "人生无处不青山",

  navTitle: "hww513的初醒屿",

  // 👇 导航栏中间的后缀/分隔符。留空字符串就不显示（Navbar 已改成条件渲染）
  navSuffix: "",

  navAfter: "",

  // 2. 头像设置（图片放在 public/ 后写 "/images/xxx.svg"）
  avatarUrl: "/images/avatar.svg",

  // 3. 网站背景设置（二选一）
  // 用渐变：把 useGradient 设为 true，走下面的 themeColors
  // 用图片轮播：useGradient 设 false，走下面的 bgImages
  useGradient: false,
  themeColors: ["#a18cd1", "#fbc2eb", "#a1c4fd", "#c2e9fb"], // 呼吸流动的颜色组合
  bgImages: ["/images/bg-1.svg", "/images/bg-2.svg", "/images/bg-3.svg"],

  // 4. 文章默认封面图（当 Markdown 没写 cover 时显示）
  defaultPostCover: "/images/cover-default.svg",

  // 5. 首页照片墙预览图
  photoWallImage: "/images/photowall.svg",

  // 6. 网易云音乐歌单 ID。留空数组 [] 时音乐页会提示“请配置 cloudMusicIds”
  cloudMusicIds: [],

  // 社交图标。文章页底部和首页个人卡片共用这一组。
  // 每个都是「点一下复制」，不跳转。值为空的按钮自动不显示。
  // 顺序：GitHub → Gitee → 邮箱 → QQ → 微信
  social: {
    github: "https://github.com/hww513",
    gitee: "", // 留空 = 不显示。有 gitee 了就填地址，按钮会自动出现
    google: "", // 已弃用，保持空
    email: "44550789@qq.com",
    qq: "44550789",
    wechat: "fyh17607800052",
  },
  counts: {
    photos: 4, // 照片墙数量，可以手动写死或动态计算
  },
  chatterTitle: "云端杂谈", // 你可以改成任何你喜欢的名字
  chatterDescription: "生活里那些没写成文章的碎片记录",

  // 👇 全局背景弹幕配置
  danmakuList: [
    "今天也要好好吃饭",
    "人生无处不青山",
    "慢慢来，比较快",
    "又在熬夜吗？",
    "记得喝水",
    "出门看看天",
    "写点什么呢",
    "该睡了",
    "好久不见",
    "一切都还来得及",
  ],

  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "",
    owner: "",
    admin: [""],
  },

  buildDate: "2026-09-26T00:00:00", // 建站日期
  footerBadges: [{"name": "Next.js 16", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"}, {"name": "React 19", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"}, {"name": "Tailwind 4", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"}],

  // 原项目这里是作者的备案号。没有备案就保持 null，页脚会自动不显示。
  icpConfig: null as { name: string; link: string } | null,

  geminiConfig: {
    modelId: "gemini-2.5-flash-lite",
    systemPrompt: "你现在是一只傲娇、聪明、有点毒舌但很可爱的暹罗猫。\n                  你的名字叫“煤球”。\n                  你说话的特点是：\n                  1. 必须简短，每次最多一两句话。\n                  2. 喜欢在句尾加上“喵~”或者“喵呜~”。\n                  3. 经常抱怨肚子饿，喜欢要小鱼干。\n                  4. 回复字数最多不能超过100字。\n                  5. 绝对不要承认自己是一个AI模型，你就是一只真实的猫。\n                  6.笨猫。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },

  friendLinkApplyFormat: "名称：hww513 の 宝藏之地\n简介：人生无处不青山\n链接：（填你的网址）\n头像：（填你的头像地址）",
  enableLevelSystem: true,
};

# hww513的初醒屿

一个毛玻璃风格的个人站：文章 / 杂谈 / 说说 / 照片墙 / 归档 / 项目 / 友链 / 音乐 / 3D 灵境。

Next.js 16 + React 19 + Tailwind 4。

---

## ⚠️ 来源与许可证

本站基于开源项目 **[heiehiehi/XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs)** 二次修改。

原作者：**heiehiehi**（[GitHub](https://github.com/heiehiehi)）

许可证：**CC BY-NC 4.0**（署名—非商业性使用 4.0 国际），完整条款见 [LICENSE](./LICENSE)。

这意味着：

- ✅ 可以自由使用、修改、分发
- ⚠️ **必须保留原作者署名**（也就是本段）
- ❌ **不得用于商业用途**

原项目 692 star。前端设计、特效组件（流萤 / 樱花 / 雪 / 弹幕 / 点击特效 / 开屏动画等）
均来自原作者，本项目在其之上做了个性化修改。

---

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

> 首次访问某个页面需要现编译，会卡 2～15 秒，属开发模式正常现象。

---

## 改成你自己的

### 全站信息

**`siteConfig.ts`** 是唯一的控制中心：

| 字段 | 作用 |
| --- | --- |
| `title` / `navTitle` / `navSuffix` / `navAfter` | 站点名称（导航栏拼成 navTitle + navSuffix + navAfter） |
| `authorName` / `bio` | 首页个人卡片的昵称与简介 |
| `avatarUrl` | 头像，图片放 `public/` 后写 `/images/xxx.svg` |
| `useGradient` / `themeColors` | 呼吸渐变动画配色 |
| `bgImages` | 背景轮播图数组 |
| `social` | 页脚/文章页的社交图标；填了值才显示，点击即复制 |
| `cloudMusicIds` | 网易云歌单 ID |
| `danmakuList` | 背景弹幕文案 |
| `buildDate` | 首页「系统已稳定运行」的计时起点 |
| `icpConfig` | 备案号；设为 `null` 则不显示 |

### 内容

| 目录 | 放什么 |
| --- | --- |
| `posts/` | 文章（Markdown，文件名即网址：`/posts/<文件名>`） |
| `moments/` | 说说 |
| `chatters/` | 杂谈 |
| `app/about/about.md` | 关于页 |
| `data/projects.ts` | 项目 |
| `data/friends.ts` | 友链 |
| `data/albums.ts` | 相册 |
| `public/images/` | 图片资源 |

### 文章 frontmatter

```markdown
---
title: "标题"
date: "2026-09-26 12:00:00"
description: "摘要"
cover: "/images/cover-default.svg"
tags: ["随笔"]
---

正文……
```

> 改了 `siteConfig.ts` 或 `data/*.ts` 这类模块级文件后，如果页面没更新，
> 重启一次开发服务最快——Turbopack 有时不会重新求值这些模块。

---

## 部署到 Vercel

本项目有 **4 个 API 路由**（`app/api/chat`、`weather`、`github`、`music`），
**不是纯静态站，不能部署到 GitHub Pages**。请用 Vercel：

1. 打开 <https://vercel.com/new>
2. 选 **Import Git Repository**，选这个仓库
3. Framework Preset 会自动识别为 **Next.js**，不用改
4. 在 **Environment Variables** 里按需填：

| 变量 | 用途 | 不填会怎样 |
| --- | --- | --- |
| `GEMINI_API_KEY` | AI 猫「煤球」聊天（`app/api/chat`） | 聊天返回错误提示，页面其余正常 |
| `QWEATHER_KEY` | 天气组件（和风天气） | 天气组件显示不出来，页面其余正常 |

5. Deploy，等一分钟，拿到 `xxx.vercel.app`

之后每次 `git push`，Vercel 会自动重新部署。

---

## 技术栈

- **Next.js 16.2.1**（App Router + Turbopack）
- **React 19.2.4**
- **Tailwind CSS 4**
- framer-motion（动画）、three.js + react-three-fiber（3D 灵境）
- Tiptap（本地后台富文本写作）
- KaTeX（数学公式）、highlight.js（代码高亮）

## 命令

```bash
npm run dev      # 开发服务
npm run build    # 生产构建
npm run start    # 跑生产构建
npm run lint     # ESLint
```

// 项目数据。加一个项目就往下复制一段改。
export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
};

export const projectsData: Project[] = [
  {
    "id": "shiguangji",
    "name": "拾光集",
    "githubUrl": "",
    "description": "一个用 Astro 写的纯静态个人博客，是这个站之外我另一个在折腾的地方。",
    "icon": "📖",
    "tags": [
      "Astro",
      "TypeScript"
    ]
  }
];

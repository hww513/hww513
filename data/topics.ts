/**
 * 文章主题。
 *
 * 结构跟相册一致：主题是一级，文章是二级。
 *   /posts/            → 主题列表
 *   /posts/<主题>/      → 该主题下的文章（客户端切换，不单独占路由）
 *   /posts/<文章>/      → 文章正文
 *
 * 加一个主题：往下复制一段改。posts 里写 posts/ 目录下 .md 的文件名（不带后缀）。
 */

export interface Topic {
  id: string;
  /** 主题名 */
  title: string;
  /** 一句话说明 */
  description: string;
  /** 封面图 */
  cover: string;
  /** 展示用的时间标签，格式随意，比如 "2026.09" */
  date: string;
  /** 这个主题下包含哪些文章（posts/ 里的 .md 文件名，不带后缀） */
  posts: string[];
}

export const topics: Topic[] = [
  {
    id: 'hww513',
    title: 'hww513',
    description: '一些想不明白的事，和一些慢慢明白的事',
    cover: '/images/cover-hww513.jpg',
    date: '2026.09',
    posts: ['reflections'],
  },
];

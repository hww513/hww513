/** 文章元信息。page.tsx 构建时读取，PostsClient 渲染用。 */
export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  cover: string;
  date: string;
  tags: string[];
}

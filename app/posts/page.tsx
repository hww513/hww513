import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { siteConfig } from '../../siteConfig';
import { topics } from '../../data/topics';
import PostsClient from './PostsClient';
import type { PostMeta } from './types';

export const metadata = {
  title: '文章 | ' + siteConfig.title,
};

/** 读取 posts/ 下所有文章的元信息（构建时执行） */
function readPosts(): PostMeta[] {
  const dir = path.join(process.cwd(), 'posts');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const raw = fs.readFileSync(path.join(dir, name), 'utf8');
      const { data } = matter(raw);
      return {
        slug: name.replace(/\.md$/, ''),
        title: typeof data.title === 'string' ? data.title : name.replace(/\.md$/, ''),
        description: typeof data.description === 'string' ? data.description : '',
        cover: typeof data.cover === 'string' ? data.cover : siteConfig.defaultPostCover,
        date: data.date ? String(data.date) : '',
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default function PostsPage() {
  return <PostsClient topics={topics} posts={readPosts()} />;
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import PageTransition from '../../components/PageTransition';
import type { Topic } from '../../data/topics';
import type { PostMeta } from './types';

/** "2026-09-27 10:00:00" → "2026.09.27" */
function fmtDate(raw: string): string {
  const m = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : raw;
}

export default function PostsClient({
  topics,
  posts,
}: {
  topics: Topic[];
  posts: PostMeta[];
}) {
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const bySlug = new Map(posts.map((p) => [p.slug, p]));

  const topicPosts = (topic: Topic) =>
    topic.posts.map((slug) => bySlug.get(slug)).filter(Boolean) as PostMeta[];

  return (
    <div className="min-h-screen relative pb-32">
      <Navbar />

      <PageTransition>
        <div className="w-full max-w-7xl mx-auto mt-28 px-4 sm:px-10 relative z-10">
          {/* ── 一级：主题列表 ───────────────────────────── */}
          {!currentTopic && (
            <div className="animate-fade-in-up">
              <div className="mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-widest mb-2 transition-colors duration-700">
                  文章
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wider transition-colors duration-700">
                  按主题收着，点开是一个主题下的全部记录
                </p>
              </div>

              {topics.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium">
                  还没有主题。在 <code className="text-indigo-500">data/topics.ts</code> 里加一个。
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 mt-10">
                  {topics.map((topic) => {
                    const list = topicPosts(topic);
                    const covers = list.map((p) => p.cover);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => setCurrentTopic(topic)}
                        className="group cursor-pointer flex flex-col items-center"
                      >
                        <div className="relative w-[85%] aspect-[4/3] mb-8">
                          <div className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-[4px] shadow-md transform rotate-6 translate-x-4 translate-y-2 group-hover:rotate-12 group-hover:translate-x-8 transition-all duration-500 border-[6px] border-white dark:border-slate-200 overflow-hidden opacity-60">
                            {covers[2] && (
                              <img
                                src={covers[2]}
                                className="w-full h-full object-cover grayscale blur-[2px]"
                                alt=""
                              />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-600 rounded-[4px] shadow-lg transform -rotate-3 -translate-x-2 -translate-y-1 group-hover:-rotate-6 group-hover:-translate-x-6 transition-all duration-500 border-[6px] border-white dark:border-slate-200 overflow-hidden opacity-80 z-10">
                            {covers[1] && (
                              <img
                                src={covers[1]}
                                className="w-full h-full object-cover grayscale-[50%]"
                                alt=""
                              />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-white dark:bg-slate-200 rounded-[4px] shadow-2xl border-[6px] border-white dark:border-slate-200 overflow-hidden z-20 transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500 relative">
                            <img
                              src={topic.cover}
                              alt={topic.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                              <span className="text-white font-bold text-lg drop-shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                {list.length} 篇文章
                              </span>
                              <span className="text-indigo-300 font-medium text-xs mt-1 drop-shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                Click to Open
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-center px-4 w-full">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {topic.title}
                            </h2>
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-sm uppercase tracking-wider">
                              {topic.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── 二级：主题内的文章 ───────────────────────── */}
          {currentTopic && (
            <div className="animate-fade-in-up">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 border-b border-slate-300/50 dark:border-slate-700/50 pb-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setCurrentTopic(null)}
                      className="group flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <span className="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-lg border border-white/50 dark:border-white/10 shadow-sm group-hover:shadow-md transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      </span>
                      返回主题
                    </button>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {currentTopic.date}
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-wider mb-2">
                    {currentTopic.title}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                    {currentTopic.description}
                  </p>
                </div>

                <div className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm">
                  共 <span className="text-indigo-500 dark:text-indigo-400 text-lg">{topicPosts(currentTopic).length}</span> 篇
                </div>
              </div>

              {topicPosts(currentTopic).length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium">
                  这个主题下还没有文章。
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {topicPosts(currentTopic).map((post, index) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}/`}
                      className="group block rounded-2xl overflow-hidden bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={post.cover}
                          alt={post.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <time className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {fmtDate(post.date)}
                          </time>
                          {post.tags.length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold">
                              {post.tags[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </PageTransition>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}

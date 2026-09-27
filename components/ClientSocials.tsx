// src/components/ClientSocials.tsx
"use client";

import { useState } from 'react';
import { siteConfig } from '../siteConfig';
import { copyText } from './copyText';

// 这里我们整合了 SocialBtn 和 ClientSocials
function SocialBtn({
  type,
  url,
  onClick,
  copied = false,
  label,
}: {
  type: string;
  url?: string;
  onClick?: () => void;
  copied?: boolean;
  label?: string;
}) {
  const getIcon = () => {
    switch (type) {
      case 'github': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>;
      case 'gitee': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482c0-.326.266-.592.592-.592h6.81c.328 0 .593.266.593.592v3.408a4.74 4.74 0 0 1-4.741 4.74H7.11A4.74 4.74 0 0 1 2.37 14.81V9.186a4.74 4.74 0 0 1 4.74-4.741h10.963v.888z"/></svg>;
      case 'google': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>;
      case 'email': return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>;
      case 'qq': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-4.418 0-8 3.582-8 8 0 1.25.289 2.433.805 3.49-1.024 1.708-1.53 3.843-1.021 5.308.203.585.806.84 1.341.57.828-.418 1.625-1.025 2.296-1.722 1.335.539 2.862.854 4.579.854 1.716 0 3.243-.315 4.578-.854.671.697 1.468 1.304 2.296 1.722.535.27 1.138.015 1.341-.57.509-1.465.003-3.6-1.021-5.308C19.71 12.433 20 11.25 20 10c0-4.418-3.582-8-8-8zm-2.5 8c-.828 0-1.5-.895-1.5-2s.672-2 1.5-2 1.5.895 1.5 2-.672 2-1.5 2zm5 0c-.828 0-1.5-.895-1.5-2s.672-2 1.5-2 1.5.895 1.5 2-.672 2-1.5 2z"/></svg>;
      case 'wechat': return <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5 13.5c-3.59 0-6.5-2.42-6.5-5.4 0-2.98 2.91-5.4 6.5-5.4s6.5 2.42 6.5 5.4c0 2.98-2.91 5.4-6.5 5.4zm7.5 7.8c-2.76 0-5-2.02-5-4.5 0-2.48 2.24-4.5 5-4.5s5 2.02 5 4.5c0 2.48-2.24 4.5-5 4.5z"/></svg>;
      default: return null;
    }
  };

  const content = (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={label ?? type}
      className={`relative w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm cursor-pointer transition-all duration-300 active:scale-90 ${
        copied
          ? 'bg-green-500 text-white border-green-400 scale-110 shadow-green-500/40 shadow-lg'
          : 'bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-white/40 dark:border-white/10 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110'
      }`}
      title={label ?? type}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        getIcon()
      )}

      {/* 复制成功后从图标上方浮出的提示气泡 */}
      <span
        className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-1 text-[10px] font-bold text-white shadow-lg transition-all duration-300 dark:bg-white/90 dark:text-slate-900 ${
          copied ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'
        }`}
      >
        已复制
      </span>
    </div>
  );

  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

export default function ClientSocials() {
  const [copied, setCopied] = useState<string | null>(null);
  const social = siteConfig.social;

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(key);
    window.setTimeout(() => {
      setCopied((current) => (current === key ? null : current));
    }, 2000);
  };

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      {/* GitHub：点击复制地址（不再跳转） */}
      {social?.github && (
        <SocialBtn
          type="github"
          label={`复制 GitHub 地址：${social.github}`}
          copied={copied === 'github'}
          onClick={() => handleCopy(social.github, 'github')}
        />
      )}
      {/* Gitee：同款，值留空时自动不显示 */}
      {social?.gitee && (
        <SocialBtn
          type="gitee"
          label={`复制 Gitee 地址：${social.gitee}`}
          copied={copied === 'gitee'}
          onClick={() => handleCopy(social.gitee, 'gitee')}
        />
      )}
      {social?.email && (
        <SocialBtn
          type="email"
          label={`复制邮箱：${social.email}`}
          copied={copied === 'email'}
          onClick={() => handleCopy(social.email, 'email')}
        />
      )}
      {social?.qq && (
        <SocialBtn
          type="qq"
          label={`复制 QQ：${social.qq}`}
          copied={copied === 'qq'}
          onClick={() => handleCopy(social.qq, 'qq')}
        />
      )}
      {social?.wechat && (
        <SocialBtn
          type="wechat"
          label={`复制微信：${social.wechat}`}
          copied={copied === 'wechat'}
          onClick={() => handleCopy(social.wechat, 'wechat')}
        />
      )}
    </div>
  );
}

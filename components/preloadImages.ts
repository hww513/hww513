/**
 * 图片预加载工具。
 *
 * 照片墙的图片用 loading="lazy"，打开相册时才开始下载，
 * 网格会一张张「跳」出来。这里在后台提前把图片灌进浏览器缓存，
 * 打开时就是瞬间显示。
 *
 * 用法：
 *   preloadImage(url)             立即预加载一张（同一 URL 只请求一次）
 *   preloadInIdle([...urls])      浏览器空闲时逐张预加载，返回取消函数
 */

/** 已经发起过预加载的 URL，避免重复请求 */
const started = new Map<string, Promise<void>>();

/** 预加载单张图片。失败也不 reject，避免打断调用方。 */
export function preloadImage(url?: string | null): Promise<void> {
  if (!url) return Promise.resolve();

  const existing = started.get(url);
  if (existing) return existing;

  const task = new Promise<void>((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

  started.set(url, task);
  return task;
}

/**
 * 在浏览器空闲时逐张预加载，一次只加载一张，
 * 避免和首屏内容抢带宽。
 *
 * 返回一个取消函数（组件卸载时调用）。
 */
export function preloadInIdle(urls: (string | undefined | null)[]): () => void {
  if (typeof window === 'undefined') return () => {};

  let cancelled = false;
  const queue = [...new Set(urls.filter(Boolean) as string[])];

  const schedule = () => {
    if (cancelled || queue.length === 0) return;

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (typeof ric === 'function') {
      ric(() => step(), { timeout: 2000 });
    } else {
      // Safari 等不支持 requestIdleCallback 的浏览器
      window.setTimeout(step, 200);
    }
  };

  const step = () => {
    if (cancelled) return;
    const url = queue.shift();
    if (!url) return;
    preloadImage(url).then(() => schedule());
  };

  schedule();

  return () => {
    cancelled = true;
  };
}

/** 批量立即预加载（用于首屏可见的图） */
export function preloadNow(urls: (string | undefined | null)[]): void {
  [...new Set(urls.filter(Boolean) as string[])].forEach((url) => {
    void preloadImage(url);
  });
}

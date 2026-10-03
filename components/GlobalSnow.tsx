"use client";

import { useEffect, useState, useMemo } from "react";

interface Props {
  /**
   * 直接开启，不看 winter-mode 开关。
   * 首页常驻下雪用这个；不传则维持原来的「冬天模式」行为。
   */
  always?: boolean;
  /** 雪花数量，默认 40。首页铺满可以给 60～80 */
  count?: number;
  /** 雪花大小范围（px），默认 [10, 25] */
  sizeRange?: [number, number];
}

export default function GlobalSnow({
  always = false,
  count = 40,
  sizeRange = [10, 25],
}: Props) {
  const [isWinter, setIsWinter] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 原来的「冬天模式」逻辑：读 body 类名 / localStorage，
    // 并用 MutationObserver 监听 ThemeToggleBlock 的切换。
    const checkWinter = () => {
      const isActive =
        document.body.classList.contains("winter-mode") ||
        localStorage.getItem("winter-mode") === "true";
      setIsWinter(isActive);
      if (isActive) document.body.classList.add("winter-mode");
    };

    checkWinter();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsWinter(document.body.classList.contains("winter-mode"));
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const snowParticles = useMemo(() => {
    const types = ["❄", "❅", "❆"];
    const [minSize, maxSize] = sizeRange;
    return Array.from({ length: count }).map(() => ({
      char: types[Math.floor(Math.random() * types.length)],
      size: Math.random() * (maxSize - minSize) + minSize,
      left: Math.random() * 100,
      // 下落时长
      duration: Math.random() * 7 + 5,
      // 左右摆动时长，和下落时长错开，避免所有雪花同频
      swayDuration: Math.random() * 2.5 + 1.8,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.5 + 0.35,
      sway: Math.random() * 14 + 6,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sizeRange[0], sizeRange[1]]);

  if (!mounted) return null;
  if (!always && !isWinter) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[190] overflow-hidden text-sky-200/90 dark:text-white"
      aria-hidden="true"
    >
      {/* 冬天模式才加那层冷色滤镜；首页常驻下雪不加，免得整体发蓝 */}
      {!always && (
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-900/10 mix-blend-overlay transition-opacity duration-1000" />
      )}

      {snowParticles.map((p, i) => (
        <div
          key={i}
          className="snow-particle absolute select-none pointer-events-none"
          style={{
            left: `${p.left}vw`,
            top: "-8vh",
            animation: `snowFall ${p.duration}s linear ${p.delay}s infinite`,
            willChange: "transform",
          }}
        >
          <span
            className="block"
            style={{
              fontSize: p.size,
              opacity: p.opacity,
              animation: `snowSway ${p.swayDuration}s ease-in-out ${p.delay}s infinite alternate`,
              filter: "drop-shadow(0 0 3px rgba(255,255,255,0.55))",
              // 每片雪花自己的摆动幅度
              ["--snow-sway" as string]: `${p.sway}px`,
            }}
          >
            {p.char}
          </span>
        </div>
      ))}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes snowFall {
          0%   { transform: translateY(0); }
          100% { transform: translateY(118vh); }
        }
        @keyframes snowSway {
          0%   { transform: translateX(calc(var(--snow-sway, 10px) * -1)) rotate(-18deg); }
          100% { transform: translateX(var(--snow-sway, 10px)) rotate(18deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          /* 尊重系统的"减少动态效果"设置 */
          .snow-particle { display: none; }
        }
      `,
        }}
      />
    </div>
  );
}

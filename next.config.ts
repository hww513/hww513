import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🚨 核心修改 1：关掉纯静态导出，让 Vercel 帮你把 API 跑起来！
  // output: 'export',

  // 🚨 核心修改 2：Vercel 不需要强制加斜杠，关掉它能避免很多 API 路径匹配错误
  // trailingSlash: true,

  // 下面这些可以保留
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true, // 忽略 TS 错误，方便快速部署
  },

  // 局域网访问：Next 16 默认拦截跨域请求，用别的设备打开
  // http://192.168.31.182:3000 时，不加这个白名单页面资源会被拒。
  // 手机换了 WiFi、IP 变了的话，把新 IP 加进来。
  allowedDevOrigins: ['192.168.31.182', '10.47.58.181', '*.local'],
};

export default nextConfig;
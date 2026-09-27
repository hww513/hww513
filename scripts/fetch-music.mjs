/**
 * 生成 public/music-data.json —— 前端播放器的歌单数据。
 *
 * 两个来源，合并成一个数组：
 *   1. 【本地音频】public/music/ 目录下的音频文件（自动扫描，推荐）
 *   2. 【网易云】siteConfig.cloudMusicIds 里配置的单曲 ID
 *
 * 用法：
 *   node scripts/fetch-music.mjs
 *
 * 每次增删歌曲后重新跑一次，并把 public/music-data.json 一起提交。
 *
 * ── 本地音频的文件名约定 ──────────────────────────────
 *   public/music/歌名.mp3              → 歌名，歌手显示"未知歌手"
 *   public/music/歌手 - 歌名.mp3        → 自动拆出歌手和歌名
 *   public/music/歌手 - 歌名.lrc        → 同名歌词（可选）
 *   public/music/歌手 - 歌名.jpg        → 同名封面（可选，支持 jpg/png/webp）
 *
 *   支持的音频格式：mp3 / m4a / ogg / wav / flac / aac
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'siteConfig.ts');
const outPath = path.join(root, 'public', 'music-data.json');
const localDir = path.join(root, 'public', 'music');

const AUDIO_EXT = ['.mp3', '.m4a', '.ogg', '.wav', '.flac', '.aac'];
const IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Referer: 'https://music.163.com/',
};

/** 从 siteConfig.ts 里把 cloudMusicIds 数组抠出来（不引入 TS 编译器） */
function readSongIds() {
  if (!fs.existsSync(configPath)) return [];
  const src = fs.readFileSync(configPath, 'utf8');
  const match = src.match(/cloudMusicIds\s*:\s*\[([^\]]*)\]/);
  if (!match) return [];
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

/** 扫描 public/music/ 下的本地音频 */
function scanLocalMusic() {
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
    return [];
  }

  const files = fs
    .readdirSync(localDir)
    .filter((f) => AUDIO_EXT.includes(path.extname(f).toLowerCase()))
    .sort();

  return files.map((file) => {
    const base = file.replace(/\.[^.]+$/, '');

    // 文件名 "歌手 - 歌名"（分隔符支持 - — –），否则整串当歌名
    let artist = '未知歌手';
    let name = base;
    const parts = base.split(/\s*[-—–]\s*/);
    if (parts.length >= 2 && parts[0].trim()) {
      artist = parts[0].trim();
      name = parts.slice(1).join(' - ').trim();
    }

    // 同名 .lrc 歌词
    let lrc = '';
    const lrcPath = path.join(localDir, `${base}.lrc`);
    if (fs.existsSync(lrcPath)) {
      try {
        lrc = fs.readFileSync(lrcPath, 'utf8');
      } catch {
        /* 歌词可选 */
      }
    }

    // 同名封面图
    let cover = '';
    for (const ext of IMAGE_EXT) {
      const candidate = `${base}${ext}`;
      if (fs.existsSync(path.join(localDir, candidate))) {
        cover = `/music/${encodeURIComponent(candidate)}`;
        break;
      }
    }

    return {
      id: `local:${base}`,
      name,
      artist,
      cover,
      url: `/music/${encodeURIComponent(file)}`,
      lrc,
      source: 'local',
    };
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 取一首歌的详情 + 歌词。
 * 网易云接口在高并发下会偶发 fetch failed，所以带 3 次重试。
 */
async function fetchNetease(id, attempt = 1) {
  try {
    // 注意：这个接口带多余的 id= 参数会返回空，必须只用 ids=[...]
    const [detailRes, lrcRes] = await Promise.all([
      fetch(`https://music.163.com/api/song/detail?ids=%5B${id}%5D`, {
        headers: HEADERS,
        signal: AbortSignal.timeout(15000),
      }),
      fetch(`https://music.163.com/api/song/lyric?id=${id}&lv=-1&kv=-1&tv=-1`, {
        headers: HEADERS,
        signal: AbortSignal.timeout(15000),
      }).catch(() => null),
    ]);

    if (!detailRes.ok) {
      if (attempt < 3) {
        await sleep(800 * attempt);
        return fetchNetease(id, attempt + 1);
      }
      return { id, error: `detail HTTP ${detailRes.status}` };
    }
    const detail = await detailRes.json();
    const song = detail.songs?.[0];
    if (!song) return { id, error: 'not_found' };

    let lrc = '';
    if (lrcRes && lrcRes.ok) {
      try {
        lrc = (await lrcRes.json()).lrc?.lyric || '';
      } catch {
        /* 歌词可选 */
      }
    }

    const artist = song.artists?.[0]?.name || '未知歌手';
    return {
      id: String(id),
      name: song.name,
      artist,
      cover: song.album?.picUrl || '',
      url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
      lrc,
      source: 'netease',
    };
  } catch (error) {
    if (attempt < 3) {
      await sleep(800 * attempt);
      return fetchNetease(id, attempt + 1);
    }
    return { id, error: String(error) };
  }
}

/**
 * 校验音频链接是否真的能播。
 *
 * 网易云的 free 外链接口对很多商业版权歌已经关闭：
 * 请求会 302 到 music.163.com/404，返回 HTML 而不是音频。
 * 这里实际拉一小段，检查有没有 MPEG 帧同步字，避免歌单里挂一堆放不出来的歌。
 */
async function verifyAudio(url) {
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return false;

    const buf = Buffer.from(await res.arrayBuffer());
    // 至少要有点体积，且前几 KB 里能找到 MPEG 帧同步字（0xFFEx / 0xFFFx）
    if (buf.length < 100 * 1024) return false;
    const limit = Math.min(buf.length - 1, 8192);
    for (let i = 0; i < limit; i++) {
      if (buf[i] === 0xff && (buf[i + 1] & 0xe0) === 0xe0) return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── 主流程 ────────────────────────────────────────────

const local = scanLocalMusic();
console.log(`[music] 本地音频 ${local.length} 首（public/music/）`);
for (const s of local) {
  console.log(`  ✅ ${s.name} — ${s.artist}${s.lrc ? '（含歌词）' : ''}${s.cover ? '（含封面）' : ''}`);
}

const ids = readSongIds();
console.log(`[music] 网易云 ${ids.length} 首（siteConfig.cloudMusicIds）`);

const neteaseResults = await Promise.all(ids.map((id) => fetchNetease(id)));
const fetched = neteaseResults.filter((r) => !r.error);
for (const s of neteaseResults.filter((r) => r.error)) {
  console.log(`  ❌ ${s.id} 取详情失败：${s.error}`);
}

// 逐首校验能不能真播（串行 + 延时，避免被限流）
console.log(`[music] 校验 ${fetched.length} 首的可播性...`);
const netease = [];
for (const song of fetched) {
  const playable = await verifyAudio(song.url);
  if (playable) {
    netease.push(song);
    console.log(`  ✅ ${song.name} — ${song.artist}${song.lrc ? '（含歌词）' : ''}`);
  } else {
    console.log(`  ⛔ ${song.name} — ${song.artist}（网易云已关闭此歌的免费外链）`);
  }
  await sleep(600);
}

const unplayable = fetched.length - netease.length;

// 本地文件排前面
const all = [...local, ...netease];

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(all, null, 2) + '\n');
console.log(`[music] 共 ${all.length} 首写入 public/music-data.json`);
if (unplayable > 0) {
  console.log(`[music] 另有 ${unplayable} 首因网易云关闭免费外链被剔除`);
}

if (all.length === 0) {
  console.log('[music] 歌单是空的：把音频文件放进 public/music/ 就会自动收录');
}

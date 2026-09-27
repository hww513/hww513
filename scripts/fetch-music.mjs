/**
 * 从网易云抓取 siteConfig.cloudMusicIds 里配置的歌曲信息，
 * 生成 public/music-data.json 供前端静态读取。
 *
 * 为什么要在构建前跑这一步：
 *   GitHub Pages 这类纯静态托管没有 /api/music 路由，
 *   前端拉不到歌单。把歌名/歌手/封面/歌词烘焙成 JSON，
 *   静态站也能用；音频本身仍从网易云 CDN 流式播放。
 *
 * 用法：
 *   node scripts/fetch-music.mjs
 *
 * 改了 siteConfig.ts 里的 cloudMusicIds 之后要重新跑一次，
 * 并把生成的 public/music-data.json 一起提交。
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const configPath = path.join(root, 'siteConfig.ts');
const outPath = path.join(root, 'public', 'music-data.json');

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Referer: 'https://music.163.com/',
};

/** 从 siteConfig.ts 里把 cloudMusicIds 数组抠出来（不引入 TS 编译器） */
function readSongIds() {
  const src = fs.readFileSync(configPath, 'utf8');
  const match = src.match(/cloudMusicIds\s*:\s*\[([^\]]*)\]/);
  if (!match) {
    console.error('❌ 在 siteConfig.ts 里找不到 cloudMusicIds');
    process.exit(1);
  }
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

async function fetchOne(id) {
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

    if (!detailRes.ok) return { id, error: `detail HTTP ${detailRes.status}` };
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
    };
  } catch (error) {
    return { id, error: String(error) };
  }
}

const ids = readSongIds();
console.log(`[music] 读取到 ${ids.length} 个歌曲 ID`);

if (ids.length === 0) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, '[]\n');
  console.log('[music] cloudMusicIds 为空，写出空列表到 public/music-data.json');
  process.exit(0);
}

const results = await Promise.all(ids.map(fetchOne));
const ok = results.filter((r) => !r.error);
const failed = results.filter((r) => r.error);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(ok, null, 2) + '\n');

for (const song of ok) {
  console.log(`  ✅ ${song.name} — ${song.artist}${song.lrc ? '（含歌词）' : ''}`);
}
for (const song of failed) {
  console.log(`  ❌ ${song.id} 失败：${song.error}`);
}
console.log(`[music] 写入 ${ok.length}/${ids.length} 首到 public/music-data.json`);

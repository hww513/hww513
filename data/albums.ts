// 相册数据。图片放在 public/images/ 下。
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "daily",
    "title": "随手拍",
    "description": "手机里舍不得删的那些",
    "cover": "/images/album-cover-1.svg",
    "date": "2026.09",
    "photos": [
      { "url": "/images/daily-01.jpg", "caption": "" },
      { "url": "/images/album-photo-1.svg", "caption": "傍晚" },
      { "url": "/images/album-photo-2.svg", "caption": "树影" }
    ]
  },
  {
    "id": "on-the-road",
    "title": "在路上",
    "description": "出门的时候顺手拍的",
    "cover": "/images/album-cover-2.svg",
    "date": "2026.08",
    "photos": [
      { "url": "/images/album-photo-3.svg", "caption": "车窗" },
      { "url": "/images/album-photo-4.svg", "caption": "站台" }
    ]
  }
];

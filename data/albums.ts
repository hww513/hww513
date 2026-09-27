// 相册数据。图片放在 public/images/ 下。
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "daily",
    "title": "随手拍",
    "description": "手机里舍不得删的那些",
    "cover": "/images/daily-cover.jpg",
    "date": "2026.09",
    "photos": []
  },
  {
    "id": "on-the-road",
    "title": "在路上",
    "description": "出门的时候顺手拍的",
    "cover": "/images/road-02.jpg",
    "date": "2026.07",
    "photos": [
      { "url": "/images/road-01.jpg", "caption": "" },
      { "url": "/images/road-02.jpg", "caption": "" },
      { "url": "/images/road-03.jpg", "caption": "" },
      { "url": "/images/road-04.jpg", "caption": "" },
      { "url": "/images/road-05.jpg", "caption": "" },
      { "url": "/images/road-06.jpg", "caption": "" },
      { "url": "/images/road-07.jpg", "caption": "" },
      { "url": "/images/road-08.jpg", "caption": "" },
      { "url": "/images/road-09.jpg", "caption": "" },
      { "url": "/images/road-10.jpg", "caption": "" },
      { "url": "/images/road-11.jpg", "caption": "" },
      { "url": "/images/road-12.jpg", "caption": "" },
      { "url": "/images/road-13.jpg", "caption": "" },
      { "url": "/images/road-14.jpg", "caption": "" },
      { "url": "/images/road-15.jpg", "caption": "" },
      { "url": "/images/road-16.jpg", "caption": "" },
      { "url": "/images/road-17.jpg", "caption": "" },
      { "url": "/images/road-18.jpg", "caption": "" }
    ]
  }
];

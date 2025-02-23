import { Product } from './product.model';
import { DocUser } from './user.model';

export interface Customer {
  id?: string;
  createdBy?: DocUser;
  name: string;
  company: string;
  country: string;
  companyWebsite: string;
  foundFrom: MediaPlatform; // where you get this client from
  contacts: MediaPlatformLink[];
  products: {
    product: string;
    quantity: number;
  }[];
  salesProgress: SalesProgress;
  createdDate: Date;
  modifiedDate: Date;
}

export type SalesProgress =
  | 'Quotation'
  | 'Sample'
  | 'PI'
  | 'Payment'
  | 'Manufacture Goods'
  | 'Ship Goods';

export interface MediaPlatformLink {
  mediaPlatform: MediaPlatform;
  link: string;
}

export type MediaPlatform =
  | 'Company Website'
  | 'Personal Website'
  | '1688'
  | 'Alibaba'
  | 'Facebook'
  | 'Instagram'
  | 'Twitter (X)'
  | 'LinkedIn'
  // | 'Mastodon'
  // | 'MeWe'
  | 'YouTube'
  | 'TikTok'
  | 'Twitch'
  | 'Vimeo'
  // | 'Dailymotion'
  | 'Pinterest'
  | 'Snapchat'
  // | 'Imgur'
  // | 'Flickr'
  // | '500px'
  | 'WhatsApp'
  | 'Telegram'
  | 'Signal'
  | 'Discord'
  | 'WeChat'
  | 'QQ'
  | 'LINE'
  | 'Viber'
  | 'Reddit'
  // | 'Quota'
  // | 'Stack Exchange'
  // | '4chan'
  // | '8kun'
  // | 'Clubhouse'
  // | 'Twitter Spaces (X Spaces)'
  // | 'Spotify Greenroom'
  // | 'Threads (by Meta)'
  // | 'Tumblr'
  // | 'Bluesky'
  // | 'Plurk'
  // | 'Behance'
  // | 'Dribbble'
  // | 'Goodreads'
  // | 'Letterboxd'
  // | 'DeviantArt'
  | 'Weibo'
  | 'Douyin (Chinese TikTok)'
  | 'Bilibili'
  | 'Xiaohongshu'
  | 'Zhihu'
  | 'Kuaishou'
  // | 'Steam Community'
  // | 'Roblox'
  // | 'Minecraft Forums'
  | 'VRChat'
  | 'Email'
  | 'Contact Number';

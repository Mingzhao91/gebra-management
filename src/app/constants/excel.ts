import { SalesProgress } from '../interfaces/customer.model';

export const HEADERS_MATCHER_ARR = [
  {
    sheetHeader: 'Product picture',
    fieldName: 'pictureUrl',
  },
  {
    sheetHeader: 'Model No.',
    fieldName: 'modelNumber',
  },
  {
    sheetHeader: 'Capacity',
    fieldName: 'capacity',
  },
  {
    sheetHeader: 'Unit price/Pcs',
    fieldName: 'prices',
  },
  {
    sheetHeader: 'Description',
    fieldName: 'description',
  },
];

export const SALES_PROGRESSES: SalesProgress[] = [
  'Quotation',
  'Sample',
  'PI',
  'Payment',
  'Manufacture Goods',
  'Ship Goods',
];

export const SALES_PROGRESSES_CHN = {
  Quotation: '报价',
  Sample: '样品',
  PI: '购货发票',
  Payment: '付款',
  'Manufacture Goods': '生产',
  'Ship Goods': '出货',
};

export const CATEGORIES = [
  'Charging Dock',
  'Mini Fan',
  'Mini Lamp',
  'Power Bank',
  'Speaker',
  'Tracker',
];

export const ROLE = ['Admin', 'Sales', 'Stock'];

export const CURRENCIES = ['USD', 'CNY'];

export const APP_MENUS_CHN = {
  signup: '注册',
  login: '登陆',
  products: '产品',
  customers: '客户',
  orders: '订单',
  logout: '退出登录',
};

export const MEDIA_PLATFORMS = [
  'Company Website',
  'Personal Website',
  '1688',
  'Alibaba',
  'Facebook',
  'Instagram',
  'Twitter (X)',
  'LinkedIn',
  // 'Mastodon',
  // 'MeWe',
  'YouTube',
  'TikTok',
  'Twitch',
  'Vimeo',
  // 'Dailymotion',
  'Pinterest',
  'Snapchat',
  // 'Imgur',
  // 'Flickr',
  // '500px',
  'WhatsApp',
  'Telegram',
  'Signal',
  'Discord',
  'WeChat',
  'QQ',
  'LINE',
  'Viber',
  'Reddit',
  // 'Quota',
  // 'Stack Exchange',
  // '4chan',
  // '8kun',
  // 'Clubhouse',
  // 'Twitter Spaces (X Spaces)',
  // 'Spotify Greenroom',
  // 'Threads (by Meta)',
  // 'Tumblr',
  // 'Bluesky',
  // 'Plurk',
  // 'Behance',
  // 'Dribbble',
  // 'Goodreads',
  // 'Letterboxd',
  // 'DeviantArt',
  'Weibo',
  'Douyin (Chinese TikTok)',
  'Bilibili',
  'Xiaohongshu',
  'Zhihu',
  'Kuaishou',
  // 'Steam Community',
  // 'Roblox',
  // 'Minecraft Forums',
  'VRChat',
  'Email',
  'Contact Number',
];

export const PRODUCTS = [
  {
    capacity: '5000mAh\\n5W',
    category: 'Charging Dock',
    prices: [
      {
        price: 4.43,
        currency: 'USD',
      },
      {
        price: 31,
        currency: 'CNY',
      },
    ],
    description:
      'Battery Type: Li-Polymer Battery \\n Material : Plastic with Rubber oil \\n Size:112*68*10mm/ 125.4g \\n Input:5V/2A (Lightning ) \\n Wireless output :5W \\n Color:  Black/White \\n Feature:Slim Design ,Led indicator ,magnet insert for iphone 12 series,phone holder',
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-M08-2.png?alt=media&token=e2365975-7ebd-4f68-9ae1-2f1ccdfcb07f',
    modelNumber: 'XN-M08-2',
  },
  {
    modelNumber: 'XN-M08-2',
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-M08-2.png?alt=media&token=e2365975-7ebd-4f68-9ae1-2f1ccdfcb07f',
    category: 'Mini Fan',
    description:
      'Type-C input&output (PD) :5V-3A,9V-2A,12V-1.5A (Max) \\n Wireless output :15W Max. （15W/10W/7.5W/5W） \\n',
    prices: [
      {
        currency: 'USD',
        price: 5.29,
      },
      {
        currency: 'CNY',
        price: 37,
      },
    ],
    capacity: '5000mAh\\n15W',
  },
  {
    prices: [
      {
        currency: 'USD',
        price: 5,
      },
      {
        price: 35,
        currency: 'CNY',
      },
    ],
    category: 'Mini Lamp',
    modelNumber: 'XN-W022-M',
    capacity: '5000mAh\\n15W',
    description:
      'USB Output  :  4.2V/3.7A,5V/3.1A,9V/2A,12V/1.5A \\n Type-C input&output (PD) :5V-3A,9V-2A,12V-1.5A (Max) \\n Wireless output :15W Max. （15W/10W/7.5W/5W） \\n Color:  Black/White \\n',
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-W022-M.png?alt=media&token=fa141638-aa05-40f8-90a0-59e9cabc0de9',
  },
  {
    capacity: '5000mAh\\n15W',
    modelNumber: 'XN-M08-T',
    description:
      'Battery Type: Li-Polymer Battery \\n Material : Plastic with Rubber oil \\n Size:112*68*10mm/ 125.4g \\n Input:5V/2A (Lightning) \\n Wireless output :5W \\n Color:  Black/White \\n Feature:Transparent \\n                                                               Type-C input&output (PD) :5V-3A,9V-2A,12V-1.5A (Max) Wireless output :15W Max. （15W/10W/7.5W/5W）',
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-M08-T.png?alt=media&token=ce8150dc-5a88-49e6-b488-26fb018a1180',
    prices: [
      {
        currency: 'USD',
        price: 5.57,
      },
      {
        currency: 'CNY',
        price: 39,
      },
    ],
    category: 'Power Bank',
  },
  {
    prices: [
      {
        price: 3.57,
        currency: 'USD',
      },
      {
        currency: 'CNY',
        price: 25,
      },
    ],
    modelNumber: 'XN-W022',
    capacity: '5000mAh',
    description:
      'Battery Type: Li-Polymer Battery 955465 \\n Material : Plastic with lines texture \\n Size:98*66*16mm/ 145g \\n Output: 5V/2A \\n Input:5V/2A (Micro usb & Type C ) \\n Wireless output :5W \\n Color:  Black/White/Blue/Grey \\n Feature:Dual input (type c& micro usb), \\n Led indicator ,keychain hole',
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-W022.png?alt=media&token=427461c9-976b-4d68-95ca-d26f6a48cb01',
    category: 'Speaker',
  },
  {
    modelNumber: 'XN-W022-M',
    description:
      'Battery Type: Li-Polymer Battery \\n Material : Plastic with lines texture \\n Size:98*66*16mm/ 145g \\n Output: 5V/2A \\n Input:5V/2A (Micro usb & Type C ) \\n Wireless output :5W \\n Color:  Black/White/Blue/Grey \\n Feature:Dual input (type c& micro usb), \\n Led indicator ,keychain hole,magnet insert for iphone 12 ,13 series',
    prices: [
      {
        currency: 'USD',
        price: 4.14,
      },
      {
        price: 29,
        currency: 'CNY',
      },
    ],
    pictureUrl:
      'https://firebasestorage.googleapis.com/v0/b/gebra-products-managemen-668af.appspot.com/o/products%2FXN-W022-M.png?alt=media&token=fa141638-aa05-40f8-90a0-59e9cabc0de9',
    category: 'Tracker',
    capacity: '5000mAh\\n5W',
  },
];

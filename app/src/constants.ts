export const FIREBASE_WRITE_LIMIT = 500;

export const SOCIAL_PLATFORMS = {
  facebook: {
    icon: 'mdi-facebook',
    field: {
      label: 'Alamat',
      placeholder: 'https://www.facebook.com/yourpage',
      isValid: (value: string) => value.startsWith('https://www.facebook.com/') || 'Alamat harus dimulai dengan https://www.facebook.com/',
    },
    getUrl: (value: string) => value,
  },
  twitter: {
    icon: 'mdi-twitter',
    field: {
      label: 'Username',
      placeholder: '@username',
      isValid: (value: string) => value.startsWith('@') || 'Username harus dimulai dengan @',
    },
    getUrl: (value: string) => `https://twitter.com/${value}`,
  },
  instagram: {
    icon: 'mdi-instagram',
    field: {
      label: 'Username',
      placeholder: '@username',
      isValid: (value: string) => value.startsWith('@') || 'Username harus dimulai dengan @',
    },
    getUrl: (value: string) => `https://instagram.com/${value.replace('@', '')}`,
  },
  youtube: {
    icon: 'mdi-youtube',
    field: {
      label: 'Username',
      placeholder: '@username',
      isValid: (value: string) => value.startsWith('@') || 'Username harus dimulai dengan @',
    },
    getUrl: (value: string) => `https://youtube.com/${value}`,
  },
  twitch: {
    icon: 'mdi-twitch',
    field: {
      label: 'Username',
      placeholder: '@username',
      isValid: (value: string) => value.startsWith('@') || 'Username harus dimulai dengan @',
    },
    getUrl: (value: string) => `https://twitch.tv/${value}`,
  },
  whatsapp: {
    icon: 'mdi-whatsapp',
    field: {
      label: 'Nomor',
      placeholder: '+6281234567890',
      isValid: (value: string) => value.startsWith('+62') || 'Nomor harus dimulai dengan +62',
    },
    getUrl: (value: string) => `https://wa.me/${value}`,
  },
  web: {
    icon: 'mdi-web',
    field: {
      label: 'Alamat',
      placeholder: 'https://example.com',
      isValid: (value: string) => value.startsWith('https://') || 'Alamat harus dimulai dengan https://',
    },
    getUrl: (value: string) => value,
  },
  link: {
    icon: 'mdi-link',
    field: {
      label: 'Alamat',
      placeholder: 'https://example.com',
      isValid: (value: string) => value.startsWith('https://') || 'Alamat harus dimulai dengan https://',
    },
    getUrl: (value: string) => value,
  },
};

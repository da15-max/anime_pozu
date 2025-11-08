/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (元々設定があればそのまま)
  
  // ★★★ この 'images' ブロックを追加・修正 ★★★
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // エラー時のフォールバック画像用
        port: '',
        pathname: '/**',
      },
      // もし将来的にGoogleの他の画像ドメイン(tbn1, tbn2...)も
      // 許可したい場合は、ワイルドカードが使えます:
      // {
      //   protocol: 'https',
      //   hostname: '*.gstatic.com', 
      // },
    ],
  },
  // ★★★ ここまで ★★★
};

export default nextConfig;
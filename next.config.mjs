/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  },
  async headers() {
    return [
      {
        // 모든 API 경로에 대해 CORS 헤더 추가
        source: '/(.*)', // API 경로 지정
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://simple-gg.vercel.app',
          }, // 특정 출처 허용
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT', // 허용할 메서드
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version', // 허용할 헤더
          },
        ],
      },
    ];
  },
};

export default nextConfig;

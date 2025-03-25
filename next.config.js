module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/ga4-admin/:path*',
        destination: 'https://analyticsadmin.googleapis.com/:path*',
      },
    ];
  },
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 180,
    },
  },
};

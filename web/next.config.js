module.exports = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/mission",
        destination: "/story/mission",
        permanent: true,
      },
    ];
  },
};

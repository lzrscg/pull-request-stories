module.exports = {
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://randomuser.me/**'), new URL('https://res.cloudinary.com/**')],
  },
};

export default nextConfig;


// https://res.cloudinary.com/dyifrkx1s/image/authenticated/s--DEe7cs6E--/v1740079071/agrasandhan/recBzidUguL80mL1S.jpg
// https://res.cloudinary.com/dyifrkx1s/image/authenticated/s--DEe7cs6E--/v1741003834/agrasandhan/reclIbJF9f85L3p7n.jpg
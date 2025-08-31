import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://randomuser.me/**'), new URL('https://res.cloudinary.com/**')],
  },
  
  // Bundle optimization configurations
  experimental: {
    // Enable optimized package imports to reduce bundle size
    optimizePackageImports: ['@tanstack/react-query', 'zustand', 'lucide-react'],
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Production optimizations
    if (!isServer) {
      // Enable tree shaking for better bundle optimization
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
      
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;


// https://res.cloudinary.com/dyifrkx1s/image/authenticated/s--DEe7cs6E--/v1740079071/agrasandhan/recBzidUguL80mL1S.jpg
// https://res.cloudinary.com/dyifrkx1s/image/authenticated/s--DEe7cs6E--/v1741003834/agrasandhan/reclIbJF9f85L3p7n.jpg
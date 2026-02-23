import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // potrebno za Docker pravi standalone build koji ne zahteva node_modules
  output: "standalone",
  async headers() {
    return [
      {
        // samo za API rute
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000/", //samo zahtevi sa localhosta mogu da idu na api rute
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization", //koji headersi smeju da se salju u zahtevu
          },
          // Kolacici se šalju samo sa istog domena
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

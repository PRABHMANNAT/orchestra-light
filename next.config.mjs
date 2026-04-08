import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

export default function nextConfig(phase) {
  return {
    reactStrictMode: true,
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    webpack: (config, { dev }) => {
      if (dev) {
        config.cache = false;
      }

      return config;
    }
  };
}

declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCacheRule[];
    publicExcludes?: string[];
    buildExcludes?: RegExp[];
    fallbacks?: {
      document?: string;
      image?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
  }

  interface RuntimeCacheRule {
    urlPattern: RegExp | string;
    handler: 'CacheFirst' | 'CacheOnly' | 'NetworkFirst' | 'NetworkOnly' | 'StaleWhileRevalidate';
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
        purgeOnQuotaError?: boolean;
      };
      networkTimeoutSeconds?: number;
      cacheableResponse?: {
        statuses?: number[];
        headers?: Record<string, string>;
      };
    };
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export = withPWA;
}

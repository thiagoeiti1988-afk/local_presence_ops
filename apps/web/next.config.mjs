/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@local-presence-ops/analytics",
    "@local-presence-ops/audit",
    "@local-presence-ops/config",
    "@local-presence-ops/content",
    "@local-presence-ops/followup",
    "@local-presence-ops/profiles",
    "@local-presence-ops/providers",
    "@local-presence-ops/reports",
    "@local-presence-ops/reviews",
  ],
  webpack(config) {
    // Workspace packages import their own sibling modules with an explicit
    // ".js" extension (required for plain `tsc`/Node ESM resolution), but
    // the source files on disk are ".ts". Webpack needs to be told to try
    // ".ts"/".tsx" first when it sees a ".js" specifier.
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      ".js": [".ts", ".tsx", ".js"],
    };
    return config;
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Demo business logos (scripts/seed.ts, public/demo-logos/*.svg) are
    // our own trusted assets, not user-uploaded content -- safe to allow
    // through next/image's optimizer, unlike arbitrary remote SVGs.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        // Reserved for demo/editorial photography added via the admin
        // panel. Not hardcoded into seed data (see scripts/seed.ts).
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

module.exports = nextConfig;

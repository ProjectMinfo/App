/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'export',
    distDir: "build",
}

module.exports = nextConfig

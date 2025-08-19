/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		unoptimized: true,
	},
	experimental: {
    	optimizePackageImports: ['radix-ui'],
  	},

};

export default nextConfig;

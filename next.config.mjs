import process from 'node:process'
export default process.env.NEXT_PUBLIC_BUILD_MODE === 'pages'
  ? { output: 'export', trailingSlash: false, images: { unoptimized: true } }
  : {}

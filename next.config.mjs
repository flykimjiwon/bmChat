// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
      removeConsole: {
        exclude: ['error', 'warn'], // 'error'와 'warn'은 남겨둠
      },
    },
  };
  
  export default nextConfig;
  
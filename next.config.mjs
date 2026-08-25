import createMDX from '@next/mdx';

const withMDX = createMDX();
export default withMDX({
  // Keep the development compiler from mutating production build artifacts.
  // Running `next dev` and `next build` against the same directory can leave
  // manifests inconsistent and make otherwise valid routes return 500s.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
});

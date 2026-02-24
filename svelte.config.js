import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev'); 

export default {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    paths: {
      base: dev ? '' : '/Design-Monolith'
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path.match(/\.(svg|png|jpg|ico|webp)$/)) return;
        throw new Error(message);
      }
    }
  }
};
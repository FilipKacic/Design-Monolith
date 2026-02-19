import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/Design-Monolith' : ''
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (path.match(/\.(svg|png|jpg|ico|webp)$/)) return;
        throw new Error(message);
      }
    }
  }
};
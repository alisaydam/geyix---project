import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
  },
};

export default config;

// /** @type {import('@sveltejs/kit').Config} */
// import adapter from "@sveltejs/adapter-netlify";

// const config = {
//   kit: {
//     adapter: adapter(),
//     // hydrate the <div id="svelte"> element in src/app.html
//   },
// };

// export default config;

// import adapter from '@sveltejs/adapter-netlify';

// const config = {
//   kit: {
//     adapter: adapter(),
//     // hydrate the <div id="svelte"> element in src/app.html
//     target: '#svelte' This tarket shıyld be removed
// 	}
// };

// export default config

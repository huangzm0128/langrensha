/**
 * @type {import('vite').UserConfig}
 */
// const config = {
//    // base: "/werewolf/game",,
// };

// export default config;

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig ({
	plugins: [
		vue()
	],
	server: {
		host: '0.0.0.0',
	    port: 3000,
	    proxy: {
	      '/api': {
	        target: 'http://localhost:3011',	//后台地址
	        changeOrigin: true, //开启跨域
	        rewrite: (path) => path.replace(/^\/api/, '')
	      },
	    }
  }
})

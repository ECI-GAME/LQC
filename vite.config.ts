import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import jsx from "@vitejs/plugin-vue-jsx";
import commonjs from 'vite-plugin-commonjs';
import htmlPlugin from "vite-plugin-html-config";

// https://vitejs.dev/config/
export default defineConfig(function ({mode}) {
  const env = loadEnv(mode, "./");

  const headScripts = [];
  // 引入 iconfont
  if (env.VITE_APP_ICONFONT) {
    headScripts.push({defer: true, src: env.VITE_APP_ICONFONT});
  }

  return {
    resolve: {
      extensions: [".ts", ".vue", ".cjs", ".js", ".tsx"],
      alias: {
        "src/": `${path.resolve(__dirname, "src")}/`,
        "types/": `${path.resolve(__dirname, "types")}/`,
      },
    },
    plugins: [
      commonjs(),
      vue(),
      jsx(),
      htmlPlugin({headScripts}),
    ],
    server: {
      port: 9088,
      host: "0.0.0.0"
    },
    optimizeDeps: {
      include: [
      ]
    }
  }
})

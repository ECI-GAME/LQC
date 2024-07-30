import path from "path";
import vue from '@vitejs/plugin-vue'
import jsx from "@vitejs/plugin-vue-jsx";
import {defineConfig, loadEnv, type UserConfig} from 'vite';
import commonjs from 'vite-plugin-commonjs';
import htmlPlugin from "vite-plugin-html-config";


const Config = defineConfig(function ({mode}: UserConfig) {
  const env = loadEnv(mode || "production", "./");
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
        "@ue/http": path.resolve(__dirname, "src/libs/http"),
        "@js-lion/upload": path.resolve(__dirname, "src/libs/upload/upload"),
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
      include: []
    }
  }
});


export default Config;
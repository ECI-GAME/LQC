import path from "path";
import vue from '@vitejs/plugin-vue'
import jsx from "@vitejs/plugin-vue-jsx";
import {defineConfig, loadEnv, type UserConfig} from 'vite';
import commonjs from 'vite-plugin-commonjs';
import htmlPlugin from "vite-plugin-html-config";
// @ts-ignore
import ElementPlus from 'unplugin-element-plus/vite';
import safeGet from "@fengqiaogang/safe-get";

const Config = defineConfig(function (config: UserConfig) {
  const env = loadEnv(config.mode || "production", "./");
  const headScripts = [];
  const alias: { [key: string]: string } = {};
  // 引入 iconfont
  if (env.VITE_APP_ICONFONT) {
    headScripts.push({defer: true, src: env.VITE_APP_ICONFONT});
  }
  const command = safeGet<string>(config, "command");
  if (command !== "build") {
    alias["vue"] = path.resolve("node_modules", "vue/dist", "vue.esm-browser.js");
  }
  return {
    resolve: {
      extensions: [".ts", ".vue", ".cjs", ".js", ".tsx"],
      alias: {
        ...alias,
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
      ElementPlus({})
    ],
    server: {
      port: 9090,
      host: "0.0.0.0",
      hmr: {
        protocol: 'ws',
        port: 9090,
      },
    },
    optimizeDeps: {
      include: []
    }
  }
});


export default Config;
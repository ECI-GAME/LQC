import { VNode } from 'vue';

declare module 'vue-router' {
  interface RouterView {
    (): VNode;
  }
}
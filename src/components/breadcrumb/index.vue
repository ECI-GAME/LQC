<script setup lang="tsx">
import lazyload from "src/utils/lazyload";
import {defineComponent, h as createElement} from "vue";

const props = defineProps({
  view: {
    type: String,
    required: false,
  }
})

const Files = import.meta.glob("./*/*.vue");

const pickView = function (name: string) {
  let value: any;
  for (const key in Files) {
    if (key.includes(name)) {
      value = lazyload(Files[key]);
      break;
    }
  }
  return defineComponent({
    setup() {
      return () => {
        if (value) {
          return createElement(value);
        }
        return (<></>);
      }
    }
  });
}

</script>

<template>
  <div>
    <component v-if="view" :is="pickView(view)" :key="view"></component>
  </div>
</template>


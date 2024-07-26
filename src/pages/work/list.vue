<script setup lang="ts">
import {ref, onMounted} from "vue";
import BigNumber from "bignumber.js";
import BoxScale from "src/components/box/scale.vue";

const list = [
  "https://assets.vuejs.com/208e0972-71b8-5be4-a5c0-4d29ad1f6261/2987d30fc481516b82d3e976beb342e5.png",
  "https://assets.vuejs.com/09879b95-ffc1-5b25-8b24-5a820b49b334/aca2ab0c46205c39bd289eb1ff0f0e6c.png",
  "https://assets.vuejs.com/0f5719a3-3b94-5e67-925d-0c52ea5e0832/126911f0d8ee5700a1b798021648b3e3.jpg",
  "https://assets.svon.org/39056396-fdac-5d2e-be45-766571ad1c2f/38a5d95d68a258a4bde958261266722f.png",
  "https://assets.vuejs.com/528fad00-f3ab-51f2-9277-d34c63233544/46da701a47d854f4b81bdbf799a6d5a8.png",
  "https://assets.vuejs.com/49342ba8-be2c-566c-983e-502caee14057/1ef191c4264f58e09ee15c80ecde19be.png",
  "https://assets.vuejs.com/3fd73a4a-315e-5d25-acaa-5af23ff95573/ca3cae6a145950f899b548ca76cb1c6b.png"
];

const boxRef = ref();
const active = ref<string>();
const top = ref<number>(0);

const onChange = function (src: string) {
  active.value = src;
  const index = list.indexOf(src);
  const width = boxRef.value.clientWidth;
  const height = new BigNumber(width).times(1.2).toNumber();
  const value = new BigNumber(height).times(index + 1).minus(height).times(-1).toNumber();
  const h = new BigNumber(boxRef.value.clientHeight).div(2).toNumber();
  top.value = new BigNumber(value).plus(h).minus(new BigNumber(height).div(2)).toNumber();
}

onMounted(function () {
  setTimeout(function() {
    onChange(list[2]);
  }, 0);
});

</script>

<template>
  <div class="overflow-hidden relative" ref="boxRef" :style="`--box-top: ${top}px;`">
    <div class="absolute left-0 top-0 w-full translate-y-[var(--box-top)] ease-in-out duration-500">
      <BoxScale v-for="src in list" :key="src" :scale="120">
        <div class="h-full pb-1 cursor-pointer" @click="onChange(src)">
          <div class="h-full bg-cover bg-no-repeat bg-center hover:blur-none ease-in-out" :class="{'blur-sm': active !== src}" :style="`background-image: url(${src});`"></div>
        </div>
      </BoxScale>
    </div>
  </div>
</template>

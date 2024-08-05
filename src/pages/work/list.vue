<script setup lang="ts">
import {ref, onMounted} from "vue";
import BigNumber from "bignumber.js";
import safeGet from "@fengqiaogang/safe-get";
import BoxScale from "src/components/box/scale.vue";

const $emit = defineEmits(["change"]);
const props = defineProps({
  list: {
    type: Array,
    required: true
  },
  active: {
    type: [String, Number],
    required: false
  }
})

const boxRef = ref();
const top = ref<number>(0);

const indexOf = function (id: string | number) {
  for (let i = 0; i < props.list.length; i++) {
    const item = props.list[i] as object;
    const value = safeGet<string>(item, "id");
    if (value && String(value) === String(id)) {
      return i;
    }
  }
  return 0;
}

const onChange = function (fileId: string | number) {
  $emit("change", fileId);
  const index = indexOf(fileId);
  const width = boxRef.value.clientWidth;
  const height = new BigNumber(width).times(1.2).toNumber();
  const value = new BigNumber(height).times(index + 1).minus(height).times(-1).toNumber();
  const h = new BigNumber(boxRef.value.clientHeight).div(2).toNumber();
  top.value = new BigNumber(value).plus(h).minus(new BigNumber(height).div(2)).toNumber();
}

onMounted(function () {
  if (props.active) {
    onChange(props.active);
  } else {
    const value = safeGet<string>(props.list, "[0].id");
    if (value) {
      onChange(value)
    }
  }
});
</script>

<template>
  <div class="overflow-hidden relative" ref="boxRef" :style="`--box-top: ${top}px;`">
    <div class="absolute left-0 top-0 w-full translate-y-[var(--box-top)] ease-in-out duration-500">
      <BoxScale v-for="data in list" :key="data.id" :scale="120">
        <div class="h-full pb-1 cursor-pointer" @click="onChange(data.id)">
          <div class="h-full bg-cover bg-no-repeat bg-top hover:blur-none ease-in-out"
               :class="{'blur-sm': String(active) !== String(data.id)}"
               :style="`background-image: url(${data.originalImagePath});`"></div>
        </div>
      </BoxScale>
    </div>
  </div>
</template>

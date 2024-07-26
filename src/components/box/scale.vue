<script setup>
/**
 * @file 等宽登高布局
 * @author svon.me@gmail.com
 */

defineProps({
  scale: {
    type: Number,
    required: false,
    default: () => 100
  }
});


</script>

<template>
  <div :style="`--box-scale:${scale > 0 ? scale : 0}%`">
    <div class="relative before:block before:content-[''] before:pt-[var(--box-scale)]">
      <div class="absolute left-0 top-0 right-0 bottom-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadLog from "./upload/log.vue";
</script>
<template>
  <div class="layout-view h-screen-f">
    <slot></slot>
  </div>
  <UploadLog></UploadLog>
</template>

<style scoped lang="scss">
.layout-view {
  --header-value: 60px;
  --border-color: rgba(5, 5, 5, 0.06);
  --screen-value: calc(100vh - 60px);
}
</style>

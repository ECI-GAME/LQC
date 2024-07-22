<script setup lang="ts">
import {RouterView} from "vue-router";
</script>

<template>
  <div className="ml-[var(--layout-menu-width)] h-full overflow-y-auto p-4 md:p-6">
    <RouterView></RouterView>
  </div>
</template>

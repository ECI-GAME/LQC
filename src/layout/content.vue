<script setup lang="ts">
import {RouterView} from "vue-router";
</script>

<template>
  <div className="ml-[var(--layout-menu-width)] overflow-y-auto ">
    <RouterView v-slot="scope">
      <component :is="scope.Component" class="p-4 md:p-6"/>
    </RouterView>
  </div>
</template>

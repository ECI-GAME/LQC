<script setup lang="ts">
import {userStore} from "src/store";

const user = userStore();

</script>

<template>
  <div>{{ user.info.user_name }}</div>
</template>

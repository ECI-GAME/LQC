<script setup lang="ts">
import { Icon } from "@ue/icon";
import {userStore} from "src/store";
import { Badge } from "ant-design-vue";

const user = userStore();

</script>

<template>
  <div class="flex items-center">
    <div class="mr-5">
      <Badge :dot="true">
        <a class="link inline-block p-1 bg-black bg-opacity-30 hover:bg-opacity-45 rounded-full">
          <Icon class="flex text-2xl" type="bell-fill"></Icon>
        </a>
      </Badge>
    </div>
    <div>{{ user.info.user_name }}</div>
  </div>
</template>

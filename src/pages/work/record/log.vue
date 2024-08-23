<script setup lang="ts">
import {Descriptions, DescriptionsItem} from "ant-design-vue";

</script>

<template>
  <Descriptions class="mb-5 deep-[th]:hidden" :column="1" :bordered="true" size="small">
    <DescriptionsItem>张三在 2024-08-20 10:00:00 将内容 <span class="line-through">xxxxx</span> 变更为 <span class="text-[red]">BBBBB</span>。</DescriptionsItem>
    <DescriptionsItem>张三在 2024-08-20 10:00:00 将内容 <span class="line-through">xxxxx</span> 变更为 <span class="text-[red]">BBBBB</span>。</DescriptionsItem>
    <DescriptionsItem>张三在 2024-08-20 10:00:00 将内容 <span class="line-through">xxxxx</span> 变更为 <span class="text-[red]">BBBBB</span>。</DescriptionsItem>
  </Descriptions>
</template>


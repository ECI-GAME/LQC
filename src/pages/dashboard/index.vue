<script setup lang="ts">
/**
 * @file Home
 * @author svon.me@gmail.com
 */

import {Button} from "ant-design-vue";
import {onCreate} from "src/utils/project";
import Upload from "src/components/upload";

import type {FileData} from "src/utils/upload/common";

const onSuccess = function (files: FileData[]) {
  console.log(files);
}

</script>
<template>
  <div>
    <div>
      <Button @click="onCreate">新建</Button>
    </div>
    <div>项目进度总览</div>
    <div>任务中心</div>
    <Upload @success="onSuccess"></Upload>
  </div>
</template>



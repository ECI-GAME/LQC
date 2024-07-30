<script setup lang="ts">
/**
 * @file Home
 * @author svon.me@gmail.com
 */

import {h as createElement} from "vue";
import {Button} from "ant-design-vue";
import {onCreate} from "src/utils/project";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import * as modal from "@ue/modal";

import type {FileData} from "src/utils/upload/common";

const onSuccess = function (files: FileData[]) {
  console.log(files);
}

const onDemo = async function () {
  const res = await modal.form([
    {
      key: "file",
      component: Upload,
      props: {
        multiple: true,
      },
      slots: {
        preview: ({files, update}: { files: FileData[], update: (files: FileData[]) => void }) => {
          return createElement(UploadPreview, {
            list: files,
            onChange: update
          });
        }
      }
    }
  ], {
    title: "文件上传",
    width: 500
  });
  console.log(res);
}

</script>
<template>
  <div>
    <div>
      <Button @click="onCreate">新建</Button>
    </div>
    <div>项目进度总览</div>
    <div>任务中心</div>
    <hr/>
    <Button @click="onDemo">文件上传测试</Button>
    <hr/>
    <Upload :multiple="true" @success="onSuccess">
      <Button>AAA</Button>
    </Upload>
  </div>
</template>



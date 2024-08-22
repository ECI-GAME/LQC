<script setup lang="ts">
/**
 * @file Home
 * @author svon.me@gmail.com
 */

import {h as createElement, ref} from "vue";
import {Button} from "ant-design-vue";
import {useProject} from "src/utils/project";
import LanguagePair from "src/components/language/select_pair.vue";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import * as modal from "@ue/modal";

import type {FileData} from "src/utils/upload/common";

interface PreviewOption {
  // 文件列表
  files: FileData[];
  // 修改文件列表数据
  update: (files: FileData[]) => void
}

const languages = ref<string[]>([]);
const {create: onCreate} = useProject()

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
        // 单次选择上传的文件
        onSuccess: function (files: FileData[]) {
          console.log(files);
        }
      },
      slots: {
        // 处理已上传的图片预览
        preview: ({files, update}: PreviewOption) => {
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
    <div>{{ languages }}</div>
    <div class="mt-5">
      <LanguagePair class="w-100" v-model:value="languages"></LanguagePair>
    </div>
    <div class="mt-5">
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



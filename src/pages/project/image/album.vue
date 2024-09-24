<script setup lang="ts">
/**
 * @file 画册管理
 * @author svon.me@gmail.com
 * @description 创建或者编辑
 **/

import * as _ from "lodash-es";
import {ref, toRaw} from "vue";
import {useValidate, rules} from "@ue/form";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import LanguagePair from "src/components/language/pair.vue";
import {Input, DatePicker, Form, FormItem, Textarea, Button, Space} from "ant-design-vue";

import type {PropType} from "vue";
import type {ImageAlbum} from "src/types";
import type {FileData} from "src/utils/upload/common";

const $emit = defineEmits(["cancel", "submit"]);
const props = defineProps({
  value: {
    required: false,
    type: Object as PropType<ImageAlbum>,
    default: function () {
      return {};
    }
  }
});

const uploadStatus = ref<boolean>();
const files = ref<FileData[]>([]);
const dateFormat: string = "YYYY-MM-DD";
const {formRef, validate} = useValidate();
const data = ref<ImageAlbum>({...props.value});

console.log(data);

const onCancel = function (e: Event) {
  $emit("cancel", e);
}

const onSubmit = async function (e: Event) {
  const status = await validate();
  if (status) {
    const value = toRaw(data.value);
    const images = _.map(files.value, function (item: FileData) {
      return {
        imageType: item.type,
        imageSize: item.size,
        imageName: item.fileName,
        originalImagePath: item.src
      };
    });
    const res = {...value, projectVersionImageVos: images};
    $emit("submit", e, res);
  }
}
</script>

<template>
  <div class="p-5">
    <Form class="grid grid-cols-2 gap-x-5" layout="vertical" ref="formRef" :model="data">
      <FormItem label="画册名称" name="versionName" :rules="rules.text('请输入画册名称!')">
        <Input v-model:value="data.versionName" placeholder="请输入画册名称" :maxlength="50"/>
      </FormItem>
      <FormItem label="语言对">
        <LanguagePair :input="true" :value="data.languagePair"/>
      </FormItem>
      <FormItem label="计划开始时间" name="startDate" :rules="rules.text('请选择开始时间!')">
        <DatePicker class="w-full" v-model:value="data.startDate" placeholder="开始时间" mode="date"
                    :format="dateFormat" :value-format="dateFormat"/>
      </FormItem>
      <FormItem label="计划完成时间" name="endDate" :rules="rules.text('请选择结束时间!')">
        <DatePicker class="w-full" v-model:value="data.endDate" placeholder="结束时间" mode="date" :format="dateFormat"
                    :value-format="dateFormat"/>
      </FormItem>
      <FormItem class="col-span-2 mb-0" label="备注" name="remark">
        <Textarea class="w-full deep-[textarea]:resize-none" v-model:value="data.remark" :rows="4" :maxlength="500" :show-count="true"
                  placeholder="请输入备注"/>
      </FormItem>
      <FormItem class="col-span-2" v-if="!data.id">
        <Upload v-model:loading="uploadStatus" v-model:value="files">
          <template #preview="{files, update}">
            <UploadPreview :list="files" @change="update"></UploadPreview>
          </template>
        </Upload>
      </FormItem>
    </Form>
    <div class="text-right">
      <Space>
        <Button @click.stop="onCancel">取消</Button>
        <Button type="primary" :disabled="uploadStatus" @click="onSubmit">确认</Button>
      </Space>
    </div>
  </div>
</template>

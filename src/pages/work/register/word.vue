<script setup lang="ts">
import {Icon} from "@ue/icon";
import {preview} from "src/utils/brower/image";
import {ElImage as Image} from 'element-plus';
import {Card, Form, FormItem, Select, SelectOption, Textarea, Button} from "ant-design-vue";

import type {PropType} from "vue";
import type {DotData} from "src/components/preview/config";

const props = defineProps({
  data: {
    type: Object as PropType<DotData>,
    default: () => {
      return {};
    }
  }
});

</script>

<template>
  <Card>
    <Form layout="vertical" ref="formRef">
      <FormItem label="类别">
        <Select>
          <SelectOption :value="1">框内</SelectOption>
          <SelectOption :value="2">框外</SelectOption>
        </Select>
      </FormItem>
      <FormItem v-if="data.image">
        <a class="block" :href="preview(data.image)" target="_blank">
          <Card class="deep-[.ant-card-body]:p-1">
            <Image class="w-full h-30" :src="data.image" fit="cover"/>
          </Card>
        </a>
      </FormItem>

      <FormItem class="deep-[label]:w-full">
        <template #label>
          <div class="w-full flex items-center justify-between">
            <div>
              <span>原文</span>
            </div>
            <div>
              <Icon class="text-xl text-primary cursor-pointer" type="font-size"></Icon>
            </div>
          </div>
        </template>
        <Textarea :rows="4" :value="data.translatedText"></Textarea>
      </FormItem>
      <FormItem label="译文">
        <Textarea :rows="4"></Textarea>
      </FormItem>
      <div class="text-right">
        <Button type="primary">保存</Button>
      </div>
    </Form>
  </Card>
</template>

<script setup lang="ts">
/**
 * @file PSD 参数配置页面
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import Dict from "src/components/dict/index.vue";
import Select from "src/components/dict/select.vue";
import Loading from "src/components/loading/index.vue";
import {Card, Button, Form, FormItem, InputNumber} from "ant-design-vue";

import type {PsConfig} from "src/types";

const route = useRoute();
const router = useRouter();
const isLoading = ref<boolean>(true);
const labelCol = {style: {width: '5rem'}};

const psConfigList = ref<PsConfig[]>([]);

const getConfigList = async function () {
  isLoading.value = true;
  const res = await api.project.getProjectPSConfig(route.params.projectId as string);
  psConfigList.value = res.results;
  setTimeout(() => {
    isLoading.value = false;
  }, 150);
}

onMounted(getConfigList);

const onSubmit = async function () {
  const status = await api.project.updateProjectPSErrorData(psConfigList.value);
  if (status) {
    router.back();
  }
}
</script>

<template>
  <Loading :status="isLoading">
    <Form class="min-h-150" size="small" layout="horizontal" :label-col="labelCol">
      <Card class="mt-5 first:mt-0" size="small" v-for="item in psConfigList" :key="item.id">
        <template #title>
          <Dict :value="item.category" type="comic_ps_title_config"></Dict>
        </template>
        <FormItem class="pt-3" label="文字方向">
          <Select class="max-w-50" v-model:value="item.textDirection" type="comic_ps_font_direction"></Select>
        </FormItem>

        <FormItem label="字体">
          <div class="flex items-center">
            <div class="flex-1 max-w-50">
              <Select v-model:value="item.font" showSearch type="sys_ps_font"></Select>
            </div>
            <div class="flex-1 max-w-50 ml-5">
              <InputNumber v-model:value="item.fontSize" :min="1" :max="1296" :step="1" :precision="0" size="small"
                           addon-after="PT"/>
            </div>
          </div>
        </FormItem>

        <FormItem label="行距">
          <div class="w-full max-w-50">
            <InputNumber v-model:value="item.lineSpacing" :min="1" :max="5000" :step="1" :precision="0" size="small"
                         addon-after="%"/>
          </div>
        </FormItem>
      </Card>
    </Form>
    <div class="mt-5 first:mt-0 text-right">
      <Button type="primary" @click="onSubmit">保存</Button>
    </div>
  </Loading>
</template>
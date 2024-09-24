<script setup lang="ts">
/**
 * @file PSD 参数配置页面
 */
import api from "src/api";
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import * as model from "src/utils/model";
import Loading from "src/components/loading/index.vue";
import {Card, Button, Form, FormItem, Select, InputNumber} from "ant-design-vue";

import type {PsConfig} from "src/types";

const route = useRoute();
const isLoading = ref<boolean>(true);
const labelCol = {style: {width: '5rem'}};
const fieldNames = {label: 'dictLabel', value: 'dictValue'};

const psConfigList = ref<PsConfig[]>([]);
const {state: psFontList, isReady: isReadyFont} = model.list(() => api.system.getDictData('sys_ps_font'), void 0, true);
const {
  state: psFontConfigList,
  isReady: isReadyDirect
} = model.list(() => api.system.getDictData('comic_ps_font_direction'), void 0, true);
const {
  state: psTitleConfigList,
  isReady: isReadyTitle
} = model.list(() => api.system.getDictData('comic_ps_title_config'), void 0, true);

const getConfigList = async function () {
  isLoading.value = true;
  const res = await api.project.getProjectPSConfig(route.params.projectId as string);
  psConfigList.value = res.results;
  setTimeout(() => {
    isLoading.value = false;
  }, 150);
}

onMounted(getConfigList);

const findTitle = function (dictValue: string | number): string | undefined {
  let text: string | undefined;
  for (const data of psTitleConfigList.value.results) {
    if (data.dictValue === dictValue) {
      text = data.dictLabel;
      break;
    }
  }
  return text;
}

const onSubmit = async function () {
  const status = await api.project.updateProjectPSErrorData(psConfigList.value);
  if (status) {
    await getConfigList();
  }
}
</script>

<template>
  <Loading :status="isLoading">
    <Form class="min-h-150" layout="horizontal" :label-col="labelCol" v-if="isReadyFont && isReadyDirect && isReadyTitle">
      <Card class="mt-5 first:mt-0" size="small"
            v-for="item in psConfigList"
            :key="item.id"
            :title="findTitle(item.category)">
        <FormItem label="文字方向">
          <Select
              class="w-full max-w-50"
              v-model:value="item.textDirection"
              size="small"
              placeholder="请选择"
              :fieldNames="fieldNames"
              :options="psFontConfigList.results">
          </Select>
        </FormItem>

        <FormItem label="字体">
          <div class="flex items-center">
            <div class="flex-1 max-w-50">
              <Select class="w-full" v-model:value="item.font"
                      size="small"
                      showSearch
                      placeholder="请选择"
                      :fieldNames="fieldNames"
                      :options="psFontList.results">
              </Select>
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
      <div class="mt-5 first:mt-0 text-right">
        <Button type="primary" @click="onSubmit">保存</Button>
      </div>
    </Form>
  </Loading>
</template>
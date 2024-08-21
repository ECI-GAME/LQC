<!--PSD 生成页面 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
import api from "src/api";
import {useRoute} from "vue-router";
import * as model from "src/utils/model";
import Loading from "src/components/loading/index.vue";
import {Card, Button, Form, FormItem, Cascader, Input} from "ant-design-vue";

const route = useRoute();
const labelCol = {style: {width: '5rem'}};
const fieldNames = {label: 'dictLabel', value: 'dictValue', children: 'children'};

const {state: psFontList} = model.list(() => api.system.getDictData('sys_ps_font'), void 0, true);
const {state: psFontConfigList} = model.list(() => api.system.getDictData('comic_ps_font_direction'), void 0, true);
const {state: psTitleConfigList} = model.list(() => api.system.getDictData('comic_ps_title_config'), void 0, true);
const {state: psConfigList, execute: getConfigList, isLoading} = model.list(() => {
  return api.project.getProjectPSConfig(route.params.projectId as string)
}, void 0, true);

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
    await getConfigList(200);
  }
}
</script>

<template>
  <Loading :status="isLoading">
    <Form class="min-h-screen" layout="horizontal" :label-col="labelCol">
      <Card class="mt-5 first:mt-0" size="small"
            v-for="item in psConfigList.results"
            :key="item.id"
            :title="findTitle(item.category)">
        <FormItem label="文字方向">
          <Cascader
              class="w-full max-w-50"
              v-model="item.textDirection"
              size="small"
              filterable
              placeholder="请选择" :fieldNames="fieldNames"
              :options="psFontConfigList.results">
          </Cascader>
        </FormItem>

        <FormItem label="字体">
          <div class="flex items-center">
            <div class="flex-1 max-w-50">
              <Cascader class="w-full" v-model="item.font"
                        size="small"
                        filterable
                        placeholder="请选择" :fieldNames="fieldNames"
                        :options="psFontList.results">
              </Cascader>
            </div>
            <div class="flex-1 max-w-50 ml-5">
              <Input v-model:value="item.fontSize" :min="1" size="small" suffix="PT"/>
            </div>
          </div>
        </FormItem>

        <FormItem label="行距">
          <div class="w-full max-w-50">
            <Input v-model:value="item.lineSpacing" :min="1" size="small" suffix="%"/>
          </div>
        </FormItem>
      </Card>
      <div class="mt-5 first:mt-0 text-right">
        <Button type="primary" @click="onSubmit">保存</Button>
      </div>
    </Form>
  </Loading>
</template>
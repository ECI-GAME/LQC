<script setup lang="ts">
/**
 * @file 项目详情
 */

import {ref} from 'vue';
import api from 'src/api';
import {Icon} from "@ue/icon";
import {useRoute} from 'vue-router';
import Version from './version.vue';
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {onCreate} from "src/utils/version";
import Loading from "src/components/loading/index.vue";
import LanguageDetail from "src/components/language/detail.vue";
import {Descriptions, DescriptionsItem, Card, Button, Space} from 'ant-design-vue';
import {PullRequestOutlined, CloseSquareOutlined, PictureOutlined, ReadOutlined} from "@ant-design/icons-vue";

import type {Project} from "src/types";

const route = useRoute();
// 构造当前列表数据对象
const readOptions = ref([])
const initReadOrder = async function () {
  readOptions.value = await api.system.getDictData('comic_image_read_order');

}

initReadOrder()
const {
  state: projectInfo,
  isReady
} = model.result<Project>(() => api.project.getProjectInfoById(route.params.projectId as string), {} as Project, true);

const onCreateVersion = async function () {
  const status = await onCreate(route.params.projectId as string, 0, 0);
  if (status) {
    window.location.reload();
  }
}
const showValue = ref('')
const showLabel = function (value: string) {
  readOptions.value.results.forEach(s => {
    if (s.dictValue == value) {
      showValue.value = s.dictLabel
    }
  })
  return showValue.value
}

</script>

<template>
  <div>
    <template v-if="isReady">
      <Card>
        <template #title>{{ projectInfo.projectName }} ({{ projectInfo.projectStatus }})</template>
        <Descriptions :column="3" :bordered="true">
          <DescriptionsItem label="项目编号">{{ projectInfo.projectNum }}</DescriptionsItem>
          <DescriptionsItem label="语言对">
            <LanguageDetail :value="projectInfo"></LanguageDetail>
          </DescriptionsItem>
          <DescriptionsItem label="发行商">{{ projectInfo.comicPublisher }}</DescriptionsItem>
          <DescriptionsItem label="开始/结束日期">{{ projectInfo.planStartTime }}-{{
              projectInfo.planEndTime
            }}
          </DescriptionsItem>
          <DescriptionsItem label="状态">进行中</DescriptionsItem>
          <DescriptionsItem label="阅读顺序">{{ showLabel(projectInfo.readOrder) }}</DescriptionsItem>
          <DescriptionsItem label="备注" :span="3">{{ projectInfo.remarks }}</DescriptionsItem>
        </Descriptions>
      </Card>
      <Card class="mt-5" title="配置中心" id="proConfig">
        <Space size="large">
          <RouterLink :to="{ name: alias.NodeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">
              <template #icon>
                <PullRequestOutlined class="my-0 inline-flex"/>
              </template>
              流程人员配置
            </Button>
          </RouterLink>

          <RouterLink :to="{ name: alias.RemarkTypeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">

              <template #icon>
                <CloseSquareOutlined class="my-0 inline-flex"/>
              </template>
              错误类型配置
            </Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.PsTypeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">
              <template #icon>
                <PictureOutlined class="my-0 inline-flex"/>
              </template>
              PSD生成配置
            </Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.Knowledge.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">
              <template #icon>
                <ReadOutlined class="my-0 inline-flex"/>
              </template>
              知识库配置
            </Button>
          </RouterLink>
        </Space>
      </Card>
    </template>
    <template v-else>
      <Loading :status="true" class="h-100"></Loading>
    </template>

    <Card class="mt-5">
      <template #title>
        <div class="flex items-center justify-between">
          <span>画册管理</span>
          <Space>
            <Button class="ml-2" @click="onCreateVersion">
              <Space>
                <Icon class="flex" type="plus"/>
                <span>创建画册</span>
              </Space>
            </Button>
            <RouterLink :to="{ name: alias.VersionImage.name, params: { projectId: projectInfo.id } }">
              <Button type="primary" class="ml-2">
                <Space>
                  <Icon class="flex" type="file-image"/>
                  <span>图片管理</span>
                </Space>
              </Button>
            </RouterLink>
          </Space>
        </div>
      </template>
      <Version class="mt-5" :project-id="route.params.projectId"></Version>
    </Card>
  </div>
</template>
<style scoped lang="scss">

#proConfig :deep(.ant-btn-primary) {
  background-color: #28A745 !important; /* 背景颜色 */
  color: white !important; /* 文字颜色 */
}

#proConfig :deep(.ant-btn-primary:hover) {
  background-color: #28A745 !important; /* 背景颜色 */
  color: #ffffff !important; /* 文字颜色 */
}
</style>
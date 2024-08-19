<script setup lang="ts">
import api from 'src/api';
import {useRoute} from 'vue-router';
import Version from './version.vue';
import * as model from "src/utils/model";
import * as alias from "src/router/alias";
import {onCreate} from "src/utils/version";
import Loading from "src/components/loading/index.vue";
import LanguageDetail from "src/components/language/detail.vue";
import {Descriptions, DescriptionsItem, Card, Button, Space, Breadcrumb, BreadcrumbItem} from 'ant-design-vue';

import type {Project} from "src/types";

const route = useRoute();
// 构造当前列表数据对象
const {
  state: projectInfo,
  isReady
} = model.result<Project>(() => api.project.getProjectInfoById(route.params.projectId as string), {} as Project, true);

const onCreateVersion = async function () {

  // 创建项目
  const status = await onCreate(route.params.projectId as string);
  // 状态判断
  if (status) {
    window.location.reload();
  }
}
</script>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectList.name }">
          <a href="">项目列表</a>
        </RouterLink>
      </BreadcrumbItem>
      <BreadcrumbItem>项目中心</BreadcrumbItem>
    </Breadcrumb>

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
          <DescriptionsItem label="交付图片类型">{{ projectInfo.imageType }}</DescriptionsItem>
          <DescriptionsItem label="备注" :span="3">{{ projectInfo.projectExplain }}</DescriptionsItem>
        </Descriptions>
      </Card>
      <Card class="mt-5" title="配置中心">
        <Space size="large">
          <RouterLink :to="{ name: alias.NodeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">流程人员配置</Button>
          </RouterLink>

          <RouterLink :to="{ name: alias.RemarkTypeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">错误类型配置</Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.PsTypeConfig.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">PSD生成配置</Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.Knowledge.name, params: { projectId: projectInfo.id } }">
            <Button type="primary">知识库配置</Button>
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
            <Button type="primary" class="ml-2" @click="onCreateVersion">创建画册</Button>
            <RouterLink :to="{ name: alias.VersionImage.name, params: { projectId: projectInfo.id } }">
              <Button type="primary" class="ml-2">图片管理</Button>
            </RouterLink>
            <!-- <Button type="primary" class="ml-2">任务中心</Button> -->
          </Space>
        </div>
      </template>
      <Version class="mt-5" :project-id="route.params.projectId"></Version>
    </Card>
  </div>
</template>

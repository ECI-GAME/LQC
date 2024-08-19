<script setup lang="ts">
import {onMounted, computed, ref} from 'vue';
import {useRoute} from 'vue-router';
import Version from './version.vue';
import LanguageDetail from "src/components/language/detail.vue";
import {Descriptions, DescriptionsItem, Card, Button, Space, Breadcrumb, BreadcrumbItem} from 'ant-design-vue';
import api from 'src/api';
import {onCreate} from "src/utils/version";
import * as alias from "src/router/alias";

import type {Project} from "src/types";


const route = useRoute();
const projectInfo = ref<Project>();
onMounted(async () => {
  try {
    projectInfo.value = await api.project.getProjectInfoById(route.params.projectId as string);

  } catch (error) {
    console.error('Error fetching project info:', error);
  }
});


const projectTitle = computed(() => {
  if (projectInfo.value) {
    return `${projectInfo.value.projectName} (${projectInfo.value.projectStatus})`;
  }
  return 'Loading...';
});

const onCreateVersion = async function () {

  // 创建项目
  const status = await onCreate(route.params.projectId as string);
  // 状态判断
  if (status) {
    window.location.reload();
  }
}
const languageInfos = ref([]);
const fetchLanguageInfo = async () => {
  try {
    languageInfos.value = await api.system.getDictData('comic_language_type');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
//语言映射
const changeLanguage = function (source: String) {

  for (const element of languageInfos.value) {
    if (source === element.code) {
      return element.dictLabel;
    }

  }
  return '-';
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
    <br/>
    <Card :title="projectTitle">
      <Descriptions v-if="projectInfo" :column="3" :bordered="true">
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
      <p v-else>Loading...</p>
    </Card>

    <Card class="mt-5" title="配置中心">
      <Space size="large">
        <RouterLink :to="{ name: alias.NodeConfig.name, params: { projectId: projectId } }">
          <Button type="primary">流程人员配置</Button>
        </RouterLink>

        <RouterLink :to="{ name: alias.RemarkTypeConfig.name, params: { projectId: projectId } }">
          <Button type="primary">错误类型配置</Button>
        </RouterLink>
        <RouterLink :to="{ name: alias.PsTypeConfig.name, params: { projectId: projectId } }">
          <Button type="primary">PSD生成配置</Button>
        </RouterLink>
        <RouterLink :to="{ name: alias.Knowledge.name, params: { projectId: projectId } }">
          <Button type="primary">知识库配置</Button>
        </RouterLink>
      </Space>
    </Card>

    <Card class="mt-5" title="画册管理">
      <div class="text-right">
        <Button type="primary" class="ml-2" @click="onCreateVersion">创建画册</Button>
        <RouterLink :to="{ name: alias.VersionImage.name, params: { projectId: projectId } }">
          <Button type="primary" class="ml-2">图片管理</Button>
        </RouterLink>
        <!-- <Button type="primary" class="ml-2">任务中心</Button> -->
      </div>
      <Version class="mt-5" :project-id="route.params.projectId"></Version>
    </Card>
  </div>
</template>

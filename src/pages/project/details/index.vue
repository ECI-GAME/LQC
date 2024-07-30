<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Version from './version.vue';
import { Descriptions, DescriptionsItem, Card, Button, Space } from 'ant-design-vue';
import api from 'src/api';

const route = useRoute();
const projectId = route.params.projectId;
const projectInfo = ref(null);

onMounted(async () => {
  try {
    projectInfo.value = await api.project.getProjectInfoById(projectId);
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
</script>

<template>
  <div>
    <Card :title="projectTitle">
      <Descriptions v-if="projectInfo" :column="3" :bordered="true">
        <DescriptionsItem label="项目编号">{{ projectInfo.projectNum }}</DescriptionsItem>
        <DescriptionsItem label="语言对">{{ projectInfo.sourceLanguage }} - {{ projectInfo.targetLanguage }}</DescriptionsItem>
        <DescriptionsItem label="发行商">{{ projectInfo.comicPublisher }}</DescriptionsItem>
        <DescriptionsItem label="开始/结束日期">{{ projectInfo.planStartTime }}-{{ projectInfo.planEndTime }}</DescriptionsItem>
        <DescriptionsItem label="状态">{{ projectInfo.projectStatus }}</DescriptionsItem>
        <DescriptionsItem label="交付图片类型">{{ projectInfo.imageType }}</DescriptionsItem>
        <DescriptionsItem label="备注" :span="3">{{ projectInfo.projectExplain }}</DescriptionsItem>
      </Descriptions>
      <p v-else>Loading...</p>
    </Card>

    <Card class="mt-5" title="配置中心">
      <Space size="large">
        <Button type="primary">流程人员配置</Button>
        <Button type="primary">错误类型配置</Button>
        <Button type="primary">PSD生成配置</Button>
        <Button type="primary">知识库配置</Button>
      </Space>
    </Card>

    <Card class="mt-5" title="版本管理">
      <Version></Version>
    </Card>
  </div>
</template>

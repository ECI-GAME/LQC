<script setup lang="ts">
/**
 * @file 项目详情
 * @author svon.me@gmail.com
 */

import {Icon} from "@ue/icon";
import {computed, ref} from "vue";
import {useRoute} from 'vue-router';
import Version from './version.vue';
import {useImageAlbum} from "./common";
import * as alias from "src/router/alias";
import Dict from "src/components/dict/index.vue";
import Loading from "src/components/loading/index.vue";
import LanguageDetail from "src/components/language/detail.vue";
import {Descriptions, DescriptionsItem, Card, Button, Space} from 'ant-design-vue';

const route = useRoute();
const uuid = ref<number>(Math.random());
const projectId = computed<string | number>(() => route.params.projectId as string);


const {state: project, isReady, create: onCreate} = useImageAlbum(projectId.value);

const onCreateVersion = async function () {
  const status = await onCreate();
  if (status) {
    uuid.value = Math.random();
  }
}

</script>

<template>
  <div>
    <template v-if="isReady">
      <Card>
        <template #title>{{ project.projectName }} ({{ project.projectStatus }})</template>
        <Descriptions :column="3" :bordered="true">
          <DescriptionsItem label="项目编号">{{ project.projectNum }}</DescriptionsItem>
          <DescriptionsItem label="语言对">
            <LanguageDetail :value="project"></LanguageDetail>
          </DescriptionsItem>
          <DescriptionsItem label="发行商">{{ project.comicPublisher }}</DescriptionsItem>
          <DescriptionsItem label="开始/结束日期">{{ project.planStartTime }}-{{ project.planEndTime }}
          </DescriptionsItem>
          <DescriptionsItem label="状态">进行中</DescriptionsItem>
          <DescriptionsItem label="阅读顺序">
            <Dict :value="project.readOrder" type="comic_image_read_order"></Dict>
          </DescriptionsItem>
          <DescriptionsItem label="备注" :span="3">{{ project.remarks }}</DescriptionsItem>
        </Descriptions>
      </Card>
      <Card class="mt-5" title="配置中心">
        <Space size="large">
          <RouterLink :to="{ name: alias.NodeConfig.name, params: route.params }">
            <Button type="primary">
              <Space>
                <Icon class="flex text-base" type="mr"/>
                <span>错误类型配置</span>
              </Space>
            </Button>
          </RouterLink>

          <RouterLink :to="{ name: alias.RemarkTypeConfig.name, params: route.params }">
            <Button type="primary">
              <Space>
                <Icon class="flex text-base" type="close-square"/>
                <span>错误类型配置</span>
              </Space>
            </Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.PsTypeConfig.name, params: route.params }">
            <Button type="primary">
              <Space>
                <Icon class="flex text-base" type="image"/>
                <span>PSD生成配置</span>
              </Space>
            </Button>
          </RouterLink>
          <RouterLink :to="{ name: alias.Knowledge.name, params: route.params }">
            <Button type="primary">
              <Space>
                <Icon class="flex text-base" type="read"/>
                <span>知识库配置</span>
              </Space>
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
            <RouterLink :to="{ name: alias.VersionImage.name, params: route.params }">
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

      <Version class="mt-5" :project-id="projectId" :key="uuid"></Version>
    </Card>
  </div>
</template>
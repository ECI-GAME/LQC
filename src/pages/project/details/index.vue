<script setup lang="ts">
import Version from "./version.vue";
import {Descriptions, DescriptionsItem, Card, Button, Space} from "ant-design-vue";
</script>

<template>
  <Card title="项目名称">
    <Descriptions :column="3" :bordered="true">
      <DescriptionsItem label="语言对">XXX - XXX</DescriptionsItem>
      <DescriptionsItem label="发行商">XXX</DescriptionsItem>
      <DescriptionsItem label="开始日期">XXX</DescriptionsItem>
      <DescriptionsItem label="备注" :span="3">XXX</DescriptionsItem>
    </Descriptions>
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
</template>

<script setup lang="ts">
import {Form, FormItem, Select, SelectOption, Textarea, Button} from "ant-design-vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

</script>

<template>
  <Form layout="vertical" ref="formRef">
    <FormItem label="类别">
      <Select>
        <SelectOption value="1">漏译</SelectOption>
      </Select>
    </FormItem>
    <FormItem label="备注">
      <Textarea :rows="4"></Textarea>
    </FormItem>
    <div class="text-right">
      <Button type="primary">已解决</Button>
    </div>
  </Form>
</template>

<!-- src/components/ImageShow.vue -->
<script setup lang="ts">
import { ref, reactive, watch,onCreate } from 'vue';
import { Modal, Image, Card, Checkbox, Divider, Row, Col } from "ant-design-vue";

import {useRoute} from "vue-router";

const route = useRoute();


console.log('Version ID = "%s"', route.params.versionId);
const open = ref<boolean>(true);


const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
const plainOptions = ['Apple', 'Pear', 'Orange'];
const state = reactive({
  indeterminate: true,
  checkAll: false,
  checkedList: ['Apple', 'Orange'],
});

const handleCancel = () => {
  open.value = false;
};
const onCheckAllChange = (e: any) => {
  Object.assign(state, {
    checkedList: e.target.checked ? plainOptions : [],
    indeterminate: false,
  });
  
};
watch(
  () => state.checkedList,
  val => {
    state.indeterminate = !!val.length && val.length < plainOptions.length;
    state.checkAll = val.length === plainOptions.length;
  },
);

const data = []

</script>
<style>
.ant-card-body {
  padding: 2px !important;
}
</style>
<template>
  <Modal v-model:open="open" title="Basic Modal" @ok="handleOk" @cancel="handleCancel" width="40%">
    <Checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
      Check all
    </Checkbox>
    <Divider class="mt-2 mb-2" />
    
      <Row :gutter="5" v-for="item in data.results">


        <Col :span="3">
        <Card hoverable class="flex-card" style="width: 100px">
          <template #cover>
            <Image alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          </template>

          <Checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
          </Checkbox>
          S1231321
        </Card>
        </Col>
        <Col :span="3">
        <Card hoverable class="flex-card" style="width: 100px">
          <template #cover>
            <Image alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          </template>

          <Checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
          </Checkbox>
          S1231321
        </Card>
        </Col>
      </Row>
    
  </Modal>
</template>

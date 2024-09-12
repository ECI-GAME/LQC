<script setup lang="ts">
import {Button,Modal,Table} from "ant-design-vue";
import { ref } from 'vue';

const props = defineProps({
  taskId: {
    type: [String, Number],
    required: true,
  }
});
// const onClick = function(){
//   console.log(props.taskId);
// }

const modalText = ref<string>('Content of the modal');
const open = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

const onClick = () => {
  open.value = true;
};

const handleOk = () => {
  modalText.value = 'The modal will be closed after two seconds';
  confirmLoading.value = true;
  setTimeout(() => {
    open.value = false;
    confirmLoading.value = false;
  }, 100);
};
const exportExcel = function(){
  console.log('export');
  
};


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Cash Assets',
    className: 'column-money',
    dataIndex: 'money',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    money: '￥300,000.00',
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    money: '￥1,256,000.00',
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    money: '￥120,000.00',
    address: 'Sidney No. 1 Lake Park',
  },
];

</script>

<template>
  <Button @click.stop="onClick" style="background-color: #7100fd;color: white;">翻译文本信息</Button>

  <Modal v-model:open="open" title="翻译文本信息" :confirm-loading="confirmLoading" width="60%" @ok="handleOk">
      
    <Table :columns="columns" :data-source="data" bordered>
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
      <template #title>
        <Button @click.stop="exportExcel" style="background-color: rgb(144 144 144);color: white; display: flex;justify-content: flex-end;">导出</Button>
      </template>
      <template #footer>Footer</template>
    </Table>
  </Modal>

</template>

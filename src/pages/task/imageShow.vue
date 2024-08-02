<!-- src/components/ImageShow.vue -->
<script setup lang="ts">
import { ref, reactive, watch, onCreate, computed } from 'vue';
import { Modal, Image, Card, Checkbox, Divider, Row, Col,Upload,Button } from "ant-design-vue";

import { useRouter, useRoute } from "vue-router";
import api from "src/api";

const props = defineProps({
  versionId: {
    type: [Number, String],
  }
});


console.log(props.versionId);

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
const imageInfos = ref([]);
const initImage = async () => {
  try {
    imageInfos.value = await api.version.geVersionImageById(props.versionId);
    console.log(imageInfos.value);

  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};


initImage()


const submit = function() {
  // return [1,2,3]
  return false;
}


let fileInfo: any[] = [];
const onSuccess = async function (files: FileData[]) {
  console.log('------');
  
  console.log(files);
  
  files.forEach( s=>{
    fileInfo.push({
      'imageName':s.fileName,
      'imageSize':s.size,
      'originalImagePath':s.src,
      'imageType':s.type,
      'projectNum': 'C24071700002',
      'versionId':'1'
  
    })
   
  })
  console.log(fileInfo);
  console.log('------');
  message.success("上传成功")
  api.version.addVersionImage(fileInfo);
  onLoad(100)

}



defineExpose({ onSubmit: submit })

</script>
<style>
.ant-card-body {
  padding: 2px !important;
}
.card-container {  
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 10px;
}  
  
  
</style>
<template>
  <div>
   
    <Checkbox v-model:checked="state.checkAll" class="ml-5 mt-5" :indeterminate="state.indeterminate" @change="onCheckAllChange">
      全选
    </Checkbox>
    <Upload :multiple="true" @success="onSuccess" v-model:loading="isOnloading" class="float-right mt-2">
          <Button type="primary":loading="isOnloading">图片上传</Button>
        </Upload>
    <Divider class="mt-2 mb-2" />

  
      <div class="card-container">
      <Card class="card flex-card" hoverable style="width: 100px;height:80px"   v-for="item in imageInfos"  :key="item.id" >
        <template #cover>
          <Image alt="example" class="object-cover" :src="item.originalImagePath" height="120px"/>
        </template>

        <Checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
        </Checkbox>
        {{ item.imageName }}
      </Card>
    </div>
    <div>
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<!-- src/components/ImageShow.vue -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Image, Card, Checkbox, Divider, Row, Col,Upload,Button,message } from "ant-design-vue";
import {ElButton} from "element-plus"

import api from "src/api";

const $emit = defineEmits(["submit","cancel"])
const props = defineProps({
  versionId: {
    type: [Number, String],
  }
});


console.log(props.versionId);

const open = ref<boolean>(true);

const state = reactive({
  checkAll: false,
 
});

const handleCancel = () => {
  open.value = false;
};
const onCheckAllChange = (e: any) => {
 
  console.log(e.target.checked);
  if(e.target.checked){
    imageInfos.value.forEach(s=>{
      s.checkStatus = true;
    })
  }else{
    imageInfos.value.forEach(s=>{
      s.checkStatus = false;
    })
  }
  
};


const imageInfos = ref([]);
const initImage = async () => {
  try {
    imageInfos.value = await api.version.geVersionImageById(props.versionId);
    imageInfos.value.forEach(s=>{
      s.checkStatus = false;
    })
    
    console.log(imageInfos.value);

  } catch (error) {
    console.error("Failed to fetch task status:", error);
  }
};


initImage()





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
      'versionId':versionId
  
    })
   
  })
  console.log(fileInfo);
  console.log('------');
  message.success("上传成功")
  api.version.addVersionImage(fileInfo);
  onLoad(100)

}
let imageIds = []
const submitFrom = ()=>{
  imageInfos.value.forEach(e=>{
    if(e.checkStatus){
      imageIds.push({id: e.id})
    }
  })
  if(imageIds.length===0){
    message.error('请至少选择一张图片!')
    return
  }
  $emit("submit");
}

const cancelFrom = ()=>{

  $emit("submit");
}

const onSave = function() {
  
  return { imageIds }
}

const formatImageName = (imageName: string) => {
  return imageName.length > 5 ? imageName.substring(0, 5) + '...' : imageName;
};

defineExpose({ onSubmit: onSave })

</script>
<style>
.ant-card-body {
  padding: 2px !important;
}
.card-container {  
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  align-items: center
}  
  
  
</style>
<template>
  <div class="ml-4 mr-5 mt-5 mb-5">
   
    <Checkbox v-model:checked="state.checkAll" class="ml-5 mt-5" @change="onCheckAllChange">
      全选
    </Checkbox>
    <Upload :multiple="true" @success="onSuccess" v-model:loading="isOnloading" class="float-right mt-2">
          <Button type="primary":loading="isOnloading">图片上传</Button>
        </Upload>
    <Divider class="mt-2 mb-2" />

  
      <div class="card-container">
      <Card class="card flex-card mt-5  ml-4" hoverable style="width: 100px;height:155px"   v-for="item in imageInfos"  :key="item.id" >
        <template #cover>
          <Image alt="example" class="object-cover" :src="item.originalImagePath" height="120px"/>
        </template>
        
        <Checkbox class="mt-2" v-model:checked="item.checkStatus">
        </Checkbox>
       <label>{{ formatImageName(item.imageName) }}</label> 
      </Card>
    </div>
    <div class="text-right">
      <ElButton type="primary" @click="submitFrom">保存</ElButton>
      <ElButton type="info" @click="cancelFrom">取消</ElButton>
    </div>
  </div>
</template>


<!--PSD 生成页面 -->
<script setup lang="ts">
/**
 * @file 错误类型配置
 */
 import api from "src/api";
 import {RouterLink, useRoute} from "vue-router";
 import * as alias from "src/router/alias";
 import { Card,Breadcrumb,BreadcrumbItem,InputNumber,Select  } from "ant-design-vue";
 import {ElSelect,ElOption,ElRow,ElCol,ElButton} from "element-plus"
 import { onMounted, ref } from 'vue';

const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const projectId = route.params.projectId
let psConfigList = ref([]);

const initMethod = async () => {
  try {
    psConfigList.value = await api.project.getProjectPSConfig(projectId);
    psConfigList.value.forEach(s=>{
      psTitleConfigList.value.forEach(e=>{
        if(e.dictValue == s.category){
         s.titleTxt = e.dictLabel
        }
      })
    })
    console.log('1212');
    
    console.log(psConfigList.value);
  } catch (error) {
    console.error("Failed to fetch language:", error);    
  }
};
let psFontList = ref([]);
let psFontConfigList = ref([]);
let psTitleConfigList = ref([]);
const initDictData = async()=>{
  try {
    psFontList.value =  await api.system.getDictData('sys_ps_font');
    psFontConfigList.value =  await api.system.getDictData('comic_ps_font_direction');
    psTitleConfigList.value =  await api.system.getDictData('comic_ps_title_config');
    
    initMethod();
    console.log(psFontList.value);
    console.log(psTitleConfigList.value);
  } catch (error) {
    console.error("Failed to fetch language:", error);    
  }
}


onMounted(() => {
  initDictData()
  
});

let word = ''
let fontNum =0

const sumbitFrom =async function(){
  console.log(psConfigList.value);
  
  await api.project.updateProjectPSErrorData(psConfigList.value)
  
  initMethod()
}
</script>

<template>
  <div>
    <Breadcrumb>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>
        <RouterLink :to="{ name: alias.ProjectDetails.name, params:{ projectId: projectId } }">
            <a href="">项目中心</a>
        </RouterLink>
    </BreadcrumbItem>    
      <BreadcrumbItem>PSD 生成配置</BreadcrumbItem>
    </Breadcrumb>
    <br/><br/>
    <div  v-for="item in psConfigList" >
    <Card :title="item.titleTxt" bodyStyle="color:black;width:100%;">
      <ElRow class="mt-2 mb-2">
        <ElCol :span="2"class="text-center">
          文字方向：
        </ElCol>
        <ElCol :span="5">
          <ElSelect v-model="item.textDirection" size="small" filterable placeholder="请选择">
            <ElOption
              v-for="item in psFontConfigList"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue">
            </ElOption>
          </ElSelect>
        </ElCol>
      </ElRow>
      
    <ElRow class="mt-2 mb-2">
        <ElCol :span="2" class="text-center">
          字 体：
        </ElCol>
        <ElCol :span="5">
          <ElSelect v-model="item.font" size="small" filterable placeholder="请选择">
            <ElOption
              v-for="item in psFontList"
              :key="item.dictLabel"
              :label="item.dictLabel"
              :value="item.dictValue">
            </ElOption>
          </ElSelect>
        </ElCol>
      
        <ElCol :span="2">
          <InputNumber v-model:value="item.fontSize" :min="1"   size = "small"/>pt
        </ElCol>
      </ElRow>
   
  
    
    <ElRow>
        <ElCol :span="2"  class="text-center">
          <label>行  距：</label>
        </ElCol>
        <ElCol :span="5">
          <InputNumber v-model:value="item.lineSpacing" :min="1"   size = "small"/>%
        </ElCol>
      </ElRow>

    </Card>
    <br/>
  </div>
  <ElButton type="primary" @click="sumbitFrom" class="fixed top-208 left-400">保存</ElButton>
  </div>
</template>
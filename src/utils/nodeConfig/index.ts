import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';

import { onMounted, ref } from 'vue';


const methodInfos = ref([]);
let methodArray = [];
let projectId = 0;
const fetchMethodInfo = async () => {
  try {
    methodInfos.value = await api.system.getDictData('comic_method_job');
    console.log(methodInfos.value);
    
    methodInfos.value.forEach(e=>{
      methodArray.forEach(s=>{
        if(s.methCode === e.dictValue){
          e.disabled = true
        }
      })
      
    })
 

  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

const onSubmit = async function (formData: object) {
  methodInfos.value.forEach(s=>{
    if(formData.methCode === s.dictValue){
      formData.methodName = s.dictLabel
    }    
  })
  formData.projectId = projectId
  console.log(formData);
  const code = await api.project.addProjecMethodInfoBy(formData);
  if (code === false) {
    return false
  } else {
    return true
  }

  return true
  
};
/**
 * @file 流程节点创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (methodList:Array,projectNum:number) {
  methodArray = methodList;
  projectId = projectNum
  console.log(methodArray);
  fetchMethodInfo()
  return modal.form([
    {
      key: "methCode",
      label: "流程节点",
      component: Select,
      props:{
        fieldNames: { label: "dictLabel", value: "dictValue"},
        options: methodInfos,
      }
    },
  ], {
    title: "新增流程节点",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
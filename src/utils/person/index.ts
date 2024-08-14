import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import { text } from "stream/consumers";
import { node } from "prop-types";

const persons = ref([]);
const fetchMethodInfo = async () => {
  try {
    persons.value = await api.project.getProjectUserInfoBy();
  } catch (error) {
    console.error("Failed to fetch language:", error);
    
  }
};
fetchMethodInfo()

const onSubmit = async function (formData: object) {

  console.log(formData);
  formData.nodeId = nodeId 
  const code = await api.project.addProjectUserInfoBy(formData);
  if (code === false) {
    return false
  } else {
    return true
  }

  return true
  
};
const openNewUser = function(){
  return modal.form([
    {
      key: "userName",
      label: "用户名",
      component: Input,
      
    },
    {
      key: "handlerId",
      label: "邮箱",
      component: Input,
      
    },
  ], {
    title: "邀请人员",
    width: 300,
    buttonClassName: ["pb-5"],
    okText: "邀请",
    onOk: onSubmit,
  });
}

let nodeId =0

/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreatePerson = async function (param1:number) {
  nodeId = param1
  console.log('node:'+nodeId);
  
  return modal.form([
    {
      key: "handlerId",
      label: "用户名",
      component: Select,
      props:{
        fieldNames: { label: "dictLabel", value: "dictValue" },
        options: persons
      }
    },
  ], {
    title: "新增人员",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit,
    otherText:  "邀请",
    otherOk: openNewUser,
  });
}
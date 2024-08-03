import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const methodInfos = ref([]);
const fetchMethodInfo = async () => {
  try {
    methodInfos.value = await api.system.getDictData('comic_method_job');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchMethodInfo()

const onSubmit = async function (formData: object) {

  console.log(formData);
    
  
  
};
/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function () {
  const projectInfo= await api.project.projectInit()

  return modal.form([
    {
      key: "nodeCode",
      label: "流程节点",
      component: Select,
      props:{
        fieldNames: { label: "dictLabel", value: "dictValue" },
        options: methodInfos
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
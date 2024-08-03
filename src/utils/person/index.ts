import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const persons = ref([]);
const fetchMethodInfo = async () => {
  try {
    persons.value = await api.system.getDictData('comic_method_job');
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
export const onCreatePerson = async function () {
  const projectInfo= await api.project.projectInit()

  return modal.form([
    {
      key: "nodeCode",
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
    onOk: onSubmit
  });
}
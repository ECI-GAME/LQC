import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';
import { ref } from 'vue';


// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = async function (formData: object) {

  if(formData.sourceLanguage===formData.targetLanguage){
    message.error('源语言和目标语言不能相同！')
    return
  }
  const code = await api.project.addProject(formData);
  if(code===false){
    return false
  }else{
    return true
  }
  
  
  
};

const languageInfos = ref([]);
const fetchLanguageInfo = async () => {
  try {
    languageInfos.value = await api.system.getDictData('comic_language_type');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function () {
  const projectInfo= await api.project.projectInit()

  return modal.form([
    [
      {
        key: "projectNum",
        label: "项目编号",
        value:projectInfo.projectNum,
        component: Input,
        props:{
          disabled:true
        }
      },
      {
        key: "projectName",
        label: "项目名称",
        component: Input,
      }
    ],
    [
      {
        key: "sourceLanguage",
        label: "源语言",
        component: Select,
        props:{
          fieldNames: { label: "dictLabel", value: "code" },
          options: languageInfos.value
        }
      },
      {
        key: "targetLanguage",
        label: "目标语言",
        component: Select,
        props:{
          fieldNames: { label: "dictLabel", value: "code" },
          options: languageInfos.value
        }
      }
    ],
    
    [
      {
        key: "comicPublisher",
        label: "发行商",
        component: Input,
      },
      {
        key: "imageType",
        label: "交付图片格式",
        component: Input,
      },
     
    ],
    [
      {
        key: "planStartTime",
        label: "计划开始时间",
        component: DatePicker,
        props:{
          style:{
            width:'100%'
          }
        }
      },
      {
        key: "planEndTime",
        label: "计划完成时间",
        component: DatePicker,
        props:{
          style:{
            width:'100%'
          }
        }
      },
    ],
    {
      key: "projectExplain",
      label: "备注",
      component: Input.TextArea,
    },
  ], {
    title: "新建项目",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
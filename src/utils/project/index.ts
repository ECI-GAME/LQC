import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import { message } from 'ant-design-vue';
import { ref } from 'vue';

const projectInfo = ref({})
// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = async function (formData: object) {
  console.log(formData);
  
  if(formData.sourceLanguage===formData.targetLanguage){
    message.error('源语言和目标语言不能相同！')
    return
  }
  if(formData.id){
    const code = await api.project.updateProject(formData);
    if(code===false){
      return false
    }else{
      return true
    }
  }else{
    const code = await api.project.addProject(formData);
    if(code===false){
      return false
    }else{
      return true
    }
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

const readOrders = ref([]);
const fetchReadOrderInfo = async () => {
  try {
    readOrders.value = await api.system.getDictData('comic_image_read_order');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

fetchReadOrderInfo()
/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (data) {
  if(data==undefined||data==null){
    projectInfo.value= await api.project.projectInit()
  }else{
    projectInfo.value = data
  }
  console.log(projectInfo.value);
  
  return modal.form([
    {
      key: "id",
      value:projectInfo.value.id,
      component: Input,
      className:"hidden",
      props:{
        class:'hidden'
      }
    },
    [
      {
        key: "projectNum",
        label: "项目编号",
        value:projectInfo.value.projectNum,
        component: Input,
        props:{
          disabled:true
        }
      },
      {
        key: "projectName",
        value:projectInfo.value.projectName,
        label: "项目名称",
        component: Input,
      }
    ],
    [
      {
        key: "sourceLanguage",
        label: "源语言",
        value:projectInfo.value.sourceLanguage,
        component: Select,
        props:{
          fieldNames: { label: "dictLabel", value: "code" },
          options: languageInfos.value
        }
      },
      {
        key: "targetLanguage",
        label: "目标语言",
        value:projectInfo.value.targetLanguage,
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
        value:projectInfo.value.comicPublisher,
        label: "发行商",
        component: Input,
      },
      // {
      //   key: "imageType",
      //   value:projectInfo.value.imageType,
      //   label: "交付图片格式",
      //   component: Input,
      // },
      {
        //comic_image_read_order
        key: "readOrder",
        value:projectInfo.value.readOrder,
        label: "漫画阅读顺序",
        component: Select,
        props:{
          fieldNames: { label: "dictLabel", value: "dictValue" },
          options: readOrders.value
        }
      },
    ],
    [
      {
        key: "planStartTime",
        //value:projectInfo.value.planStartTime,
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
        //value:projectInfo.value.planEndTime,
        component: DatePicker,
        props:{
          style:{
            width:'100%'
          }
        }
      },
    ],
    
     
    {
      key: "remarks",
      value:projectInfo.value.remarks,
      label: "备注",
      component: Input.TextArea,
    },
  ], {
    title: (projectInfo.value.id || "新建项目","修改项目"),
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
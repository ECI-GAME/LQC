import * as modal from "@ue/modal";
import {Input, RangePicker, Select} from "ant-design-vue";
import api from "src/api";
import { ref, h, createApp } from "vue";
import ImageShow  from "./imageShow";


let versionInfo=[]
let versionId =0
// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = function (formData: object) {
  formData.projectNum = versionInfo.projectNum
  formData.versionId = versionInfo.id
  formData.sourceLanguage = versionInfo.languagePair.split("->")[0]
  formData.targetLanguage = versionInfo.languagePair.split("->")[1]
  formData.projectVersionImages = [{id:20}]
  // 如果有错误，返回false或根据具体需求处理  
  return api.task.submitTask(formData);  
};

const onImageShow = async function () {
  // 动态创建并挂载 ImageShow 组件实例
  const app =await createApp({
    render() {
      return h(ImageShow,{versionId});
    }
  });

  const div = document.createElement('div');
  document.body.appendChild(div);
  app.mount(div);
};
export const onCreate =async function (param1:number) {
  
  versionInfo = await api.version.geVersionInfoById(6)
  console.log(versionInfo);
  return modal.form([
    [{
      key: "taskType",
      label: "任务类型",
      component: Input,
    },
    {
      key: "taskName",
      label: "任务名称",
      component: Input,
    }],
    [
      {
        key:"taskLanguage",
        label: "语言对",
        component: Select,
        value:versionInfo.languagePair,
        props:{
          disabled:true
          // fieldNames: { label: "label", value: "value" },
          // options: [
          //   { value: "zhangsan@mail.com", label: "zhangsan@mail.com" },
          //   { value: "lisi@mail.com", label: "lisi@mail.com" },
          // ]
        }
      },
      {
        key:"taskStatus",
        label: "任务状态",
        component: Input,
        value:"草稿",
        props:{
          disabled:true
        }
      },
    ],
    {
      
      label: "日期",
      component: RangePicker,
      props: {
        "class": "w-full"
      }
    },
    [
      {
        key:"handlerId",
        label: "处理人",
        component: Input,
      },
      {
        key:"taskOrder",
        label: "任务顺序",
        component: Input,
      },
    ],
    {
      key:"remarks",
      label: "备注",
      component: Input.TextArea,
    },
    {
      label: "图片资源",
      component: Input,
    }
  ], {
    title: "新建任务",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit,
    otherText : "Image Select",
    otherOk: onImageShow,
  });
}
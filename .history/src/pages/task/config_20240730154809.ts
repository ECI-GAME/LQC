import * as modal from "@ue/modal";
import {Input, RangePicker, Select} from "ant-design-vue";
import api from "src/api";

const versionInfo= await api.version.geVersionInfoById(1)
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
export const onCreate =async function () {

  
  console.log(modal.form);
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
          fieldNames: { label: "label", value: "value" },
          options: [
            { value: "zhangsan@mail.com", label: "zhangsan@mail.com" },
            { value: "lisi@mail.com", label: "lisi@mail.com" },
          ]
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
    onOk: onSubmit
  });
}
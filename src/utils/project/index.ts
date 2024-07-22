import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";


// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = function (formData: object) {
  console.log(formData);
  // 返回 true 关闭弹框，返回 false 则说明有异常
  return true;
};

/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = function () {
  modal.form([
    {
      label: "项目名称",
      component: Input,
    },
    [
      {
        label: "源语言",
        component: Select,
      },
      {
        label: "目标语言",
        component: Select,
      }
    ],
    {
      label: "发行商",
      component: Input,
    },
    [
      {
        label: "交付图片格式",
        component: Input,
      },
      {
        label: "开始日期",
        component: DatePicker,
      },
    ],
    {
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
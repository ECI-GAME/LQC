import * as modal from "@ue/modal";
import {Input, RangePicker, Select} from "ant-design-vue";


// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = function (formData: object) {
  console.log(formData);
  // 返回 true 关闭弹框，返回 false 则说明有异常
  return true;
};

export const onCreate = function () {
  return modal.form([
    {
      label: "任务类型",
      component: Select,
    },
    {
      label: "任务名称",
      component: Input,
    },
    {
      label: "日期",
      component: RangePicker,
      props: {
        "class": "w-full"
      }
    },
    [
      {
        label: "处理人",
        component: Select,
      },
      {
        label: "处理顺序",
        component: Input,
      },
    ],
    {
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
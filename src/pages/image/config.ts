import * as modal from "@ue/modal";
import {Input, RangePicker, Select} from "ant-design-vue";

export const columns = [
  {title: "图片名称", dataIndex: 'imageName', key: 'imageName'},
  {title: "关联画册", dataIndex: 'versionName', key: 'versionName'},
  {title: "状态", dataIndex: 'imageStatus', key: 'imageStatus', align: "center"},
  {title: "当前处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "原图", dataIndex: 'originalImagePath', key: 'preview', align: "center"},
  {title: "TEP 图片", dataIndex: 'tepImagePath', key: 'preview', align: "center"},
  {title: "PSD生成图片", dataIndex: 'psdPath', key: 'preview', align: "center"},
  {title: "DTP 图片(PSD)", dataIndex: 'dtpImagePath', key: 'preview', align: "center"},
  {title: "QA 图片", dataIndex: 'notesImagePath', key: 'preview', align: "center"},
  {title: "归档图片", dataIndex: 'deliveryImagePath', key: 'preview', align: "center"},
  {title: "关联任务", dataIndex: 'taskName', key: 'image', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

export const ImageNodeType = {
  "originalImagePath": "original",
  "tepImagePath": "tep",
  "psdPath": "psd",
  "dtpImagePath": "dtp",
  "notesImagePath": "qa",
  "deliveryImagePath": "finish",
};

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
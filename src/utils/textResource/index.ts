import * as modal from "@ue/modal";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import {message} from 'ant-design-vue';
import {ref} from 'vue';


let projectId = 0
console.log('projectId:' + projectId);

// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = async function (formData: object) {

  if (formData.typeCode != null) {
    textTypes.value.forEach(s => {
      if (s.dictValue == formData.typeCode) {
        formData.typeName = s.dictLabel
      }
    })
  }
  formData.projectId = Number(projectId)
  formData.status = 1
  console.log(formData);

  const code = await api.project.addTextReource(formData);
  if (code === false) {
    return false
  } else {
    return true
  }


};

const textTypes = ref([]);
const fetchLanguageInfo = async () => {
  try {
    const res = await api.system.getDictData('comic_text_reource_type');
    textTypes.value = res.results;
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (proId: number) {
  projectId = proId
  return modal.form([
    {
      key: "typeCode",
      label: "类别",
      component: Select,
      props: {
        fieldNames: {label: "dictLabel", value: "dictValue"},
        options: textTypes.value
      }
    },
    {
      key: "originalText",
      label: "原文",
      component: Input,

    },
    {
      key: "translationText",
      label: "译文",
      component: Input,

    },
    {
      key: "remark",
      label: "备注",
      component: Input,

    },

  ], {
    title: "新建文本资源",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
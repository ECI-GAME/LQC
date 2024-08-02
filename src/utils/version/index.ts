//画册创建弹框
import * as modal from "@ue/modal";
import { h as createElement } from "vue";
import { Input, DatePicker, Select } from "ant-design-vue";
import api from "src/api";
import { RouterLink, useRoute } from "vue-router";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import type { FileData } from "src/utils/upload/common";
import { ref } from 'vue';

const onSuccess = function (files: FileData[]) {
  console.log(files);
}
const languageInfos = ref([]);

const fetchLanguageInfo = async () => {
  try {
    languageInfos.value = await api.system.getDictData('comic_language_type');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
const changeLanguage = function(source:String){
 
  for (const element of languageInfos.value) {
    if (source === element.code) {
      return element.dictLabel;
    }
  
  }
  return '-';
}

const imageList = []

const onSubmit = function (formData: object) {
  console.log(projectInfo);
  formData.languagePair = projectInfo.sourceLanguage + '->' + projectInfo.targetLanguage
  formData.projectNum = projectInfo.projectNum
  formData.projectVersionImageVos = imageList
  console.log(formData);
  
  api.version.addVersion(formData)
  return true;
};
let projectInfo: Object | undefined;  




/**
 * @file 画册创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (parma1: number) {
 
  projectInfo = await api.project.getProjectInfoById(parma1)

  projectInfo.languagePair = changeLanguage(projectInfo.sourceLanguage) + '->' + changeLanguage(projectInfo.targetLanguage)

  return modal.form([
    [
      {
        key: "versionName",
        label: "画册名称",
        component: Input,

      },
      {
        key: "language",
        label: "语言对",
        component: Input,
        value:projectInfo.languagePair,
        props: {
          disabled: true
        }
      }
    ],

    [
      {
        key: "startDate",
        label: "计划开始时间",
        component: DatePicker,
        props:{
          style:{
            width:'100%'
          }
        }
      },
      {
        key: "endDate",
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
    {

      component: Upload,
      props: {
        multiple: true,
        spinning: true,
        onSuccess: function (files: FileData[]) {
          imageList.push({
            'imageName': files[0].fileName,
            'imageSize': files[0].size,
            'originalImagePath': files[0].src,
            'imageType': files[0].type
          })
          console.log('upload success');
          console.log(imageList);

        },

      },
      slots: {
        preview: ({ files, update }: { files: FileData[], update: (files: FileData[]) => void }) => {
          return createElement(UploadPreview, {
            list: files,
            onChange: update
          });
        }
      }
    },

  ], {
    title: "新建画册",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
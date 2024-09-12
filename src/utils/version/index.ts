//画册创建弹框
import * as modal from "@ue/modal";
import {h as createElement} from "vue";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import {RouterLink, useRoute} from "vue-router";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import type {FileData} from "src/utils/upload/common";
import {ref} from 'vue';

const onSuccess = function (files: FileData[]) {
  console.log(files);
}
const languageInfos = ref([]);

const fetchLanguageInfo = async () => {
  try {
    const res = await api.system.getDictData('comic_language_type');
    languageInfos.value = res.results;
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};
fetchLanguageInfo()
const changeLanguage = function (source: String) {

  for (const element of languageInfos.value) {
    if (source === element.code) {
      return element.dictLabel;
    }

  }
  return '-';
}

const imageList = []

const onSubmit =async function (formData: object) {
  console.log(projectInfo);
  formData.languagePair = projectInfo.sourceLanguage + '->' + projectInfo.targetLanguage
  formData.projectNum = projectInfo.projectNum
  formData.projectVersionImageVos = imageList
  console.log(formData);

  await api.version.addVersion(formData)
  return true;
};

const onUpdate = function (formData: object) {
  formData.id = versionInfo.id
  api.version.updateVersion(formData)
  return true;
};
let projectInfo: Object | undefined;
let versionInfo: Object | undefined;


/**
 * @file 画册创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (projectId: number | string,type:number,versionId: number | string) {
  projectInfo = await api.project.getProjectInfoById(projectId)
  projectInfo.languagePair = changeLanguage(projectInfo.sourceLanguage) + '->' + changeLanguage(projectInfo.targetLanguage)
  versionInfo = {}
  if(type==1){
    versionInfo = await api.version.geVersionInfoById(versionId)
  }
  return modal.form([
    
    [
      {
        key: "versionName",
        value : versionInfo.versionName,
        label: "画册名称",
        component: Input,

      },
      {
        key: "language",
        label: "语言对",
        component: Input,
        value: projectInfo.languagePair,
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
        props: {
          style: {
            width: '100%'
          }
        }
      },
      {
        key: "endDate",
        label: "计划完成时间",
        component: DatePicker,
        props: {
          style: {
            width: '100%'
          }
        }
      },
    ],
    {
      key: "remark",
      label: "备注",
      value: versionInfo.remark,
      component: Input.TextArea,
    },
    {

      component: Upload,
      props: {
        multiple: true,
        spinning: true,
        onSuccess: function (files: FileData[]) {
          files.forEach(e=>{
            imageList.push({
              'imageName': e.fileName,
              'imageSize': e.size,
              'originalImagePath': e.src,
              'imageType': e.type
            })
          })
          
        },

      },
      slots: {
        preview: ({files, update}: { files: FileData[], update: (files: FileData[]) => void }) => {
          return createElement(UploadPreview, {
            list: files,
            onChange: update
          });
        }
      }
    },

  ], {
    title: type==0?"新建画册":"修改画册",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: type==0?"Submit":"修改",
    onOk: type==0?onSubmit:onUpdate
  });
}
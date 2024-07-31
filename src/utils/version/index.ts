import * as modal from "@ue/modal";
import {h as createElement} from "vue";
import {Input, DatePicker, Select} from "ant-design-vue";
import api from "src/api";
import {RouterLink, useRoute} from "vue-router";
import Upload from "src/components/upload/index.vue";
import UploadPreview from "src/components/upload/preview.vue";
import type {FileData} from "src/utils/upload/common";

const onSuccess = function (files: FileData[]) {
  console.log(files);
}
const imageList = []
const projectInfo= await api.project.getProjectInfoById(3)
projectInfo.languagePair = projectInfo.sourceLanguage+'->'+projectInfo.targetLanguage
console.log('------');

console.log(projectInfo);
console.log('------');
// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = function (formData: object) {
  formData.projectNum = projectInfo.projectNum
  formData.projectVersionImageVos = imageList
  return api.version.addVersion(formData);
};

/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function () {

  return modal.form([
    [
      {
        key: "versionName",
        label: "版本名称",
        component: Input,
        
      },
      {
        key: "languagePair",
        label: "语言对",
        component: Input,
        value: projectInfo.languagePair,
        props:{
          disabled:true
        }
      }
    ],
    
    [
      {
        key: "startDate",
        label: "计划开始时间",
        component: DatePicker,
       
      },
      {
        key: "endDate",
        label: "计划完成时间",
        component: DatePicker,
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
        onSuccess: function(files: FileData[]) {
          imageList.push({
            'imageName':files[0].fileName,
            'imageSize':files[0].size,
            'originalImagePath':files[0].src,
            'imageType':files[0].type
          })
          console.log('upload success');
          console.log(imageList);
          
        }
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
    title: "新建版本",
    width: 480,
    buttonClassName: ["pb-5"],
    okText: "Submit",
    onOk: onSubmit
  });
}
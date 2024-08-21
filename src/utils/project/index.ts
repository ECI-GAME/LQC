import api from "src/api";
import {rules} from "@ue/form";
import * as modal from "@ue/modal";
import * as model from "src/utils/model";
import safeSet from "@fengqiaogang/safe-set";
import {Input, DatePicker, Select, message} from "ant-design-vue";

import type {LanguageData, Project} from 'src/types';

/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (
  data: Project,
  languageInfo: LanguageData[] = [],
  readOrder: object[] = [],
  onSubmit?: (value: Project) => Promise<boolean>) {
  return modal.form([
    [
      {
        key: "projectNum",
        label: "项目编号",
        value: data.projectNum,
        component: Input,
        props: {
          disabled: true
        }
      },
      {
        key: "projectName",
        value: data.projectName,
        label: "项目名称",
        component: Input,
        rules: rules.text("请填写项目名称")
      }
    ],
    [
      {
        key: "sourceLanguage",
        label: "源语言",
        value: data.sourceLanguage,
        component: Select,
        rules: rules.text("请选择源语言"),
        props: {
          fieldNames: {label: "dictLabel", value: "code"},
          options: languageInfo
        }
      },
      {
        key: "targetLanguage",
        label: "目标语言",
        value: data.targetLanguage,
        component: Select,
        rules: rules.text("请选择目标语言"),
        props: {
          fieldNames: {label: "dictLabel", value: "code"},
          options: languageInfo
        }
      }
    ],

    [
      {
        key: "comicPublisher",
        value: data.comicPublisher,
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
        value: data.readOrder,
        label: "漫画阅读顺序",
        component: Select,
        rules: rules.text("请选择阅读顺序"),
        props: {
          options: readOrder,
          fieldNames: {label: "dictLabel", value: "dictValue"},
        }
      },
    ],
    [
      {
        key: "planStartTime",
        //value:projectInfo.value.planStartTime,
        label: "计划开始时间",
        component: DatePicker,
        props: {
          style: {
            width: '100%'
          }
        }
      },
      {
        key: "planEndTime",
        label: "计划完成时间",
        //value:projectInfo.value.planEndTime,
        component: DatePicker,
        props: {
          style: {
            width: '100%'
          }
        }
      },
    ],
    {
      key: "remarks",
      value: data.remarks,
      label: "备注",
      component: Input.TextArea,
    },
  ], {
    title: (data.id ? "修改项目" : "新建项目"),
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    textAlign: "right",
    okText: "Submit",
    onOk: onSubmit
  });
}

const onSave = function (formData: Project) {
  if (formData.sourceLanguage === formData.targetLanguage) {
    message.error('源语言和目标语言不能相同！')
    return false;
  }
  if (formData.id) {
    return api.project.updateProject(formData)
  }
  return api.project.addProject(formData)
}

export const useProject = function () {
  // 项目详情
  const {
    state: projectInfo,
    execute: onLoadProject
  } = model.result<Project>(() => api.project.projectInit(), {} as Project, true);

  // 语言对列表
  const {state: languageInfo} = model.list<LanguageData>(function () {
      return api.system.getDictData<LanguageData>('comic_language_type');
    },
    new model.PageResult<LanguageData>([]),
    true
  );
  // 项目阅读顺序
  const {state: readOrder} = model.list<object>(function () {
      return api.system.getDictData<object>('comic_image_read_order');
    },
    new model.PageResult<object>([]),
    true
  );

  return {
    project: projectInfo,
    create: (data?: Project) => {
      // 处理表单数据，传给接口完成项目创建逻辑
      const onSubmit = async function (value: Project) {
        if (data && data.id) {
          safeSet(value, 'id', data.id)
        }
        const status = await onSave(value);
        if (status) {
          await onLoadProject(100);
        }
        return status;
      };
      return onCreate(
        data || projectInfo.value,
        languageInfo.value.results,
        readOrder.value.results,
        onSubmit);
    }
  }
}

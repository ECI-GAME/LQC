/**
 * @file 项目创建与编辑
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {rules} from "@ue/form";
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import * as model from "src/utils/model";
import safeSet from "@fengqiaogang/safe-set";
import {Input, DatePicker, Select, message} from "ant-design-vue";
import LanguagePair from "src/components/language/select_pair.vue";

import type {Project} from 'src/types';
import type {RuleObject} from "ant-design-vue/es/form";

const dateFormat: string = "YYYY-MM-DD";
const languageValidator = function () {
  const isArray = rules.array("请选择语言对");
  const validator: RuleObject = {
    required: true,
    validator(rule: RuleObject, value: any[]) {
      if (value && Array.isArray(value)) {
        const list = _.compact(value);
        if (list.length === 2) {
          return Promise.resolve();
        }
      }
      return Promise.reject("请选择语言对");
    },
  };
  return [...isArray, validator];
}

const languageTransform = function (value: Project): Project {
  const languagePair: string[] = _.get(value, "languagePair") || [];
  const sourceLanguage = languagePair[0];
  const targetLanguage = languagePair[1];

  const tmp = _.omit(value, ["languagePair"]);
  return {...tmp, sourceLanguage, targetLanguage} as Project;
}

const onCreate = async function (
  data: Project,
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
    {
      key: "languagePair",
      label: "语言对",
      value: [data.sourceLanguage, data.targetLanguage],
      component: LanguagePair,
      rules: languageValidator(),
    },
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
        value: data.planStartTime,
        label: "计划开始时间",
        component: DatePicker,
        props: {
          "class": "w-full",
          mode: "date",
          format: dateFormat,
          valueFormat: dateFormat,
        }
      },
      {
        key: "planEndTime",
        label: "计划完成时间",
        value: data.planEndTime,
        component: DatePicker,
        props: {
          "class": "w-full",
          mode: "date",
          format: dateFormat,
          valueFormat: dateFormat,
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
  // 项目阅读顺序
  const {state: readOrder} = model.list<object>(function () {
      return api.system.getDictData<object>('comic_image_read_order');
    },
    new model.PageResult<object>([]),
    true
  );

  const __submit = async function (value: Project) {
    const info = languageTransform(value);
    const status = await onSave(info);
    if (status) {
      await onLoadProject(100);
    }
    return status;
  }

  return {
    project: projectInfo,
    // 编辑项目信息
    edit: (data: Project) => {
      // 处理表单数据，传给接口完成项目创建逻辑
      const onSubmit = async function (value: Project) {
        safeSet(value, 'id', data.id);
        return __submit(value);
      };
      return onCreate(
        data,
        readOrder.value.results,
        onSubmit);
    },
    // 创建项目信息
    create: () => {
      return onCreate(
        projectInfo.value,
        readOrder.value.results,
        __submit);
    }
  }
}

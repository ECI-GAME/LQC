/**
 * @file 知识库- 文本资源
 * @author svon.me@gamil.com
 **/

import api from "src/api";
import type {FormItemData} from "@ue/form";
import {rules} from "@ue/form";
import * as modal from "@ue/modal";
import {Textarea} from "ant-design-vue";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";
import Select from "src/components/dict/select.vue";
import type {TextResource} from "src/types";

const RESOURCE_TYPE = "comic_text_reource_type";
const FieldNames = {label: "dictLabel", value: "dictValue"};

const getTypeName = async function (code: string | number): Promise<string> {
  // 获取所有文本类型
  const res = await api.system.getDictData(RESOURCE_TYPE);
  const db = new DBList(res.results, FieldNames.value);
  // 查询选择的文本类型数据
  const item = db.selectOne({[db.primary]: code});
  // 获取文本类型的名称
  return safeGet<string>(item, FieldNames.label) || "";
}

// 处理表单数据，传给接口完成项目创建逻辑
const onSubmit = async function (data: TextResource) {
  // 获取文本类型的名称
  const typeName = await getTypeName(data.typeCode);
  // 发起请求
  return api.project.addTextReource({...data, typeName, status: 1});
};

const onUpdate = async function (data: TextResource) {
  // 获取文本类型的名称
  const typeName = await getTypeName(data.typeCode);
  // 发起请求
  return api.project.updateTextReource({...data, typeName});
}

const basis = function (data: TextResource): FormItemData[] {
  return [
    {
      key: "typeCode",
      label: "类别",
      component: Select,
      value: data.typeCode,
      rules: rules.text("请选择文本类型！"),
      props: {
        type: RESOURCE_TYPE,
        fieldNames: FieldNames,
        placeholder: "请选择文本类型",
      }
    },
    {
      key: "originalText",
      label: "原文",
      component: Textarea,
      value: data.originalText,
      rules: rules.text("请输入原文！"),
      props: {
        showCount: false,
        maxlength: 500,
        placeholder: "请输入原文",
      }
    },
    {
      key: "translationText",
      label: "译文",
      component: Textarea,
      value: data.translationText,
      rules: rules.text("请输入译文！"),
      props: {
        showCount: false,
        maxlength: 500,
        placeholder: "请输入译文",
      }
    },
    {
      key: "remark",
      label: "备注",
      component: Textarea,
      value: data.remark,
      props: {
        showCount: false,
        maxlength: 500,
        placeholder: "请输入备注",
      }
    },
  ];
}

/**
 * @file 创建文本
 * @author svon.me@gmail.com
 */
export const onCreate = async function (projectId: number | string, versionId?: number | string) {
  const items = basis({} as TextResource);
  return modal.form(items, {
    title: "新建文本资源",
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    onOk: (value: object) => {
      return onSubmit({...value, projectId, versionId} as TextResource);
    },
  });
}

/**
 * @file 编辑文本
 * @author svon.me@gmail.com
 */
export const onEdit = async function (data: TextResource) {
  const items = basis(data);
  return modal.form(items, {
    title: "编辑文本资源",
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    onOk: (value: object) => {
      const formData = {
        id: data.id,
        projectId: data.projectId,
        versionId: data.versionId,
        ...value
      }
      return onUpdate(formData as TextResource);
    },
  });
}
/**
 * @file 流程节点管理
 * @author svon.me@gamil.com
 */

import api from "src/api";
import {rules} from "@ue/form";
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import {DBList} from "@fengqiaogang/dblist";
import safeGet from "@fengqiaogang/safe-get";
import Select from "src/components/dict/select.vue";

const DictNodeType = "comic_method_job";


// 新增流程节点
const onSubmit = async function (data: object, projectId: string | number) {
  // 获取所有节点列表
  const res = await api.system.getDictData(DictNodeType);
  const db = new DBList(res.results, "dictValue");
  // 根据当前选择的节点 id 查询该节点详细数据
  const item = db.selectOne({[db.primary]: safeGet<string | number>(data, "methCode")});
  const formData = {
    ...data,
    // 项目ID
    projectId,
    // 获取节点名称
    methodName: safeGet<string>(item, "dictLabel"),
  };
  // 调用添加节点接口
  return api.project.addProjecMethodInfoBy(formData);
};

/**
 * @file 流程节点创建
 * @author svon.me@gmail.com
 */
export const onCreate = async function (methodList: Array<any>, projectId: string | number) {
  const selected = _.map(methodList, (item: object) => safeGet<string>(item, "methCode"));
  return modal.form([
    {
      key: "methCode",
      label: "流程节点",
      component: Select,
      rules: rules.text('请选择流程节点！'),
      props: {
        type: DictNodeType,
        placeholder: "请选择流程节点",
        readonly: _.compact(selected),
      }
    },
  ], {
    title: "新增流程节点",
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    onOk: (value: object) => onSubmit(value, projectId),
  });
}
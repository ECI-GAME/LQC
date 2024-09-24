import api from "src/api";
import * as _ from "lodash-es";
import {rules} from "@ue/form";
import * as modal from "@ue/modal";
import {Input} from "ant-design-vue";
import safeGet from "@fengqiaogang/safe-get";
import Select from "src/components/dict/select.vue";

const onSubmit = function (data: object, nodeId: number | string) {
  const value = {...data, nodeId};
  return api.project.addProjectUserInfoBy(value);
};

const onInvite = function (data: object, projectNum: number | string, nodeId: number | string) {
  const value = {...data, jobMethodsId: nodeId, projectNum};
  return api.project.invitePerson(value);
}

// 人员邀请
export const inviteUser = function (projectNum: number | string, nodeId: number | string) {
  return modal.form([
    {
      key: "roleId",
      label: "角色",
      component: Select,
      rules: rules.text('请选择角色！'),
      props: {
        placeholder: "请选择角色！",
        fieldNames: {label: "name", value: "id"},
        options: () => api.system.getRoleList()
      }
    },
    {
      key: "empName",
      label: "用户名",
      component: Input,
      rules: rules.text('请输入用户名！'),
    },
    {
      key: "empMailAccount",
      label: "邮箱",
      component: Input,
      rules: rules.email('请输入正确的邮箱地址！'),
    },
  ], {
    title: "邀请人员",
    width: 300,
    buttonClassName: ["pb-5", "px-5"],
    okText: "邀请",
    onOk: (value: object) => onInvite(value, projectNum, nodeId),
  });
}

/**
 * @file 添加人员
 * @author svon.me@gmail.com
 */
export const onCreatePerson = async function (projectNum: number | string, nodeId?: number | string, personList: object[] = []) {
  if (!nodeId) {
    return false;
  }
  const readonly = personList.map((item: object) => safeGet<string>(item, "handlerId"));
  return modal.form([
    {
      key: "handlerId",
      label: "用户名",
      component: Select,
      rules: rules.text('请选择流程节点！'),
      props: {
        placeholder: "请选择人员",
        readonly: _.compact(readonly),
        options: () => api.project.getProjectUserInfoBy()
      }
    },
  ], {
    title: "新增人员",
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    onOk: (value: object) => onSubmit(value, nodeId),
    otherText: "邀请",
    otherOk: () => inviteUser(projectNum, nodeId),
  });
}
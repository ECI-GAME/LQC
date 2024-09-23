import api from "src/api";
import {rules} from "@ue/form";
import * as modal from "@ue/modal";
import {Input} from "ant-design-vue";
import Select from "src/components/dict/select.vue";

const onSubmit = function (data: object, nodeId: number | string) {
  const value = {...data, nodeId};
  return api.project.addProjectUserInfoBy(value);
};


export const openNewUser = function (nodeId: number | string) {
  return modal.form([
    {
      key: "roleId",
      label: "角色",
      component: Select,
      rules: rules.text('请选择角色！'),
      props: {
        placeholder: "请选择角色！",
        fieldNames:{label: "name", value: "id"},
        options: () => api.system.getRoleList()
      }
    },
    {
      key: "userName",
      label: "用户名",
      component: Input,
      rules: rules.text('请输入用户名！'),
    },
    {
      key: "handlerId",
      label: "邮箱",
      component: Input,
      rules: rules.email('请输入正确的邮箱地址！'),
    },
  ], {
    title: "邀请人员",
    width: 300,
    buttonClassName: ["pb-5", "px-5"],
    okText: "邀请",
    onOk: (value: object) => onSubmit(value, nodeId),
  });
}

/**
 * @file 项目创建
 * @author svon.me@gmail.com
 */
export const onCreatePerson = async function (nodeId?: number | string) {
  if (!nodeId) {
    return false;
  }
  return modal.form([
    {
      key: "handlerId",
      label: "用户名",
      component: Select,
      rules: rules.text('请选择流程节点！'),
      props: {
        placeholder: "请选择人员",
        options: () => api.project.getProjectUserInfoBy()
      }
    },
  ], {
    title: "新增人员",
    width: 480,
    buttonClassName: ["pb-5", "px-5"],
    onOk: (value: object) => onSubmit(value, nodeId),
    otherText: "邀请",
    otherOk: () => openNewUser(nodeId),
  });
}
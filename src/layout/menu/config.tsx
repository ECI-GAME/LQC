import {h} from "vue";
import {Icon} from "@ue/icon";
import * as alias from "src/router/alias";


const CreateIcon = function (name: string) {
  return h("span", {
    "class": "mr-2 inline-block"
  }, [
    h(Icon, {"class": "flex !text-2xl ease-in-out duration-300", type: name})
  ]);
}

export const items = [
  {label: "Home", key: alias.Home.name, icon: CreateIcon("home")},
  {label: "项目", key: alias.ProjectList.name, icon: CreateIcon("project")},
  {label: "任务", key: alias.TaskList.name, icon: CreateIcon("unorderedlist")},
  {label: "知识库", key: "3", icon: CreateIcon("book")},
  {label: "报表", key: "4", icon: CreateIcon("dashboard")},
  {label: "监控", key: "5", icon: CreateIcon("setting")},
  {label: "帮助", key: "6", icon: CreateIcon("info-circle")}
];
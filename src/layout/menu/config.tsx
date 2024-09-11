import {Icon} from "@ue/icon";
import * as _ from "lodash-es";
import {h, computed} from "vue";
import {userStore} from "src/store";
import * as alias from "src/router/alias";
import safeGet from "@fengqiaogang/safe-get";
import type {RouteRecordBase} from "types/common";


const CreateIcon = function (name?: string) {
  if (name) {
    return h("span", {
      "class": "mr-2 inline-block"
    }, [
      h(Icon, {"class": "flex !text-2xl ease-in-out duration-300", type: name})
    ]);
  }
}

const pickRouter = function (name?: string) {
  let value: RouteRecordBase | undefined;
  if (name) {
    for (const key of _.keys(alias)) {
      const data = safeGet<RouteRecordBase>(alias, key);
      if (data && data.name === name) {
        value = data;
        break;
      }
    }
  }
  return value;
}

export const useItems = function () {
  const user = userStore();
  const list = computed<object[]>(function () {
    const menus: object[] = [];
    for (const item of user.menus) {
      const label = safeGet<string>(item, "title");
      const path = safeGet<string>(item, "path");
      const route = pickRouter(path);
      const icon = safeGet<string>(item, "meta.icon");
      menus.push({
        label,
        icon: CreateIcon(icon),
        name: safeGet(route, "name"),
        key: safeGet(route, "meta.type") || path,
      });
    }
    return menus;
  });
  // [
  //   {label: "Home", key: alias.Home.name, icon: CreateIcon("home")},
  //   {label: "项目", key: alias.ProjectList.name, icon: CreateIcon("project")},
  //   {label: "任务", key: alias.TaskList.name, icon: CreateIcon("unorderedlist")},
  //   {label: "知识库", key: "3", icon: CreateIcon("book")},
  //   {label: "报表", key: "4", icon: CreateIcon("dashboard")},
  //   {label: "监控", key: "5", icon: CreateIcon("setting")},
  //   {label: "帮助", key: "6", icon: CreateIcon("info-circle")}
  // ]
  return {list};
};



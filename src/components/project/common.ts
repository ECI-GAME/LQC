import type {ProjectImage} from "src/types";

export const getAllSelectList = function (list: ProjectImage[], taskId?: string | number): Array<string | number> {
  const data = new Set<string | number>();
  for (const item of list) {
    if (item.taskId) {
      if (taskId && String(item.taskId) === String(taskId)) {
        data.add(item.id);
      }
    } else {
      data.add(item.id);
    }
  }

  return [...data];
}

// 根据任务ID过滤默认选中数据
export const autoSelectedList = function (list: ProjectImage[], taskId?: string | number): Array<string | number> {
  const data = new Set<string | number>();
  if (taskId) {
    for (const item of list) {
      if (item.taskId && String(item.taskId) === String(taskId)) {
        data.add(item.id);
      }
    }
  }
  return [...data];
}

// 过滤默认选中数据
export const initSelectedList = function (list: ProjectImage[], autoValue: Array<string | number> = [], taskId?: string | number): Array<string | number> {
  const data = new Set<string | number>(autoSelectedList(list, taskId));
  for (const value of autoValue) {
    data.add(value);
  }
  return [...data];
}
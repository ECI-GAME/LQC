import api from "src/api";
import * as _ from "lodash-es";
import {rules} from "@ue/form";
import {ref, computed} from "vue";
import * as modal from "@ue/modal";
import * as model from "src/utils/model";
import ImageShow from "./comp/image.vue";
import safeGet from "@fengqiaogang/safe-get";
import Dict from "src/components/dict/index.vue";
import LanguagePair from "src/components/language/pair.vue";
import Select from "src/components/dict/select.vue";
import {Input, InputNumber, RangePicker, message} from "ant-design-vue";


import type {ModalProps} from "@ue/modal";
import type {TaskData, VersionInfo} from "src/types";


export class Search {
  taskName?: string;  // 任务名称关键字检索
  taskType?: string | number; // 任务类型状态
  handlerName?: string; // 操作员名称
}

export const useColumns = function (projectId?: string | number) {
  const list: object[] = [
    {title: "任务名称", dataIndex: 'taskName', key: 'taskName'},
  ];
  if (!projectId) {
    list.push({title: "项目名称", dataIndex: 'projectName', key: 'projectName'});
  }
  list.push(
    {title: "状态", dataIndex: 'taskStatus', key: 'taskStatus', align: "center"},
    {title: "处理人", dataIndex: 'handlerName', key: 'tags', align: "center", width: 180, minWidth: 140, maxWidth: 300},
    {title: "图片总量", dataIndex: 'totalCnt', key: 'totalCnt', align: "center"},
    {title: "创建时间", dataIndex: 'createTime', key: 'time', align: "center"},
    {title: "更新时间", dataIndex: 'updateTime', key: 'time', align: "center"},
    {title: "进度", dataIndex: 'doneCnt', key: 'progress', align: "center"},
    {title: "操作", dataIndex: 'action', key: 'action', align: "center"},
  );
  return ref<object[]>(list);
};

const dateFormat: string = "YYYY-MM-DD";
const onTaskModal = function (data: TaskData, persons: object[], config: ModalProps) {
  return modal.form([
    {
      key: "taskName",
      label: "任务名称",
      value: data.taskName,
      component: Input,
      rules: rules.text("请输入任务名称!"),
    },
    [
      {
        label: "语言对",
        component: LanguagePair,
        props: {
          value: data.languagePair,
        },
      },
      {
        label: "任务状态",
        component: Dict,
        props: {
          autoValue: "草稿",
          value: data.taskStatus,
          type: "comic_task_status",
        }
      }
    ],
    {
      key: "timeDay",
      label: "日期",
      component: RangePicker,
      value: _.compact([data.estimatedStartDate, data.estimatedEndDate]),
      rules: rules.array("请选择日期!"),
      props: {
        "class": "w-full",
        format: dateFormat,
        valueFormat: dateFormat,
      }
    },
    [
      {
        key: "handlerId",
        label: "处理人",
        component: Select,
        value: data.handlerId,
        rules: rules.text("请选择处理人!"),
        props: {
          options: persons,
          fieldNames: {label: "empName", value: "handlerId"},
        }
      },
      {
        key: "taskOrder",
        label: "任务顺序",
        value: data.taskOrder,
        component: InputNumber,
        rules: rules.number("请设置任务顺序!"),
        props: {
          "class": "w-full",
        }
      },
    ],
    {
      key: "remarks",
      label: "备注",
      value: data.remarks,
      component: Input.TextArea,
    },
    {
      key: "projectVersionImages",
      value: [],
      component: ImageShow,
      rules: data.id ? void 0 : rules.array("请选择图片资源!"),
      props: {
        versionId: data.versionId,
        projectNum: data.projectNum,
        taskId: data.id,
        count: safeGet<string | number>(data, "totalCnt"),
      }
    },
  ], config);
};


//提交
const onSubmit = async function (formData: TaskData) {
  const images = safeGet<object[]>(formData, "projectVersionImages");
  if (!images || _.size(images) < 1) {
    message.error('请至少选择一张图片后提交!')
    return
  }
  return api.task.submitTask(formData);
};

//更新
const onUpdate = async function (formData: TaskData) {
  const value = _.omit(formData, ["projectVersionImages"]);
  const status = await api.task.updateTask(value as TaskData);
  if (status) {
    const images = safeGet<Array<object>>(formData, "projectVersionImages") || [];
    if (images.length > 0) {
      await api.task.updateImageInfo(images);
    }
  }
  return status
};


export const useTask = function () {
  const versionId = ref<string | number>()
  const {state: persons, execute: onReloadPersons, isLoading: personLoading} = model.list<object>(async function () {
    if (versionId.value) {
      const res = await api.task.getTaskInfoPersonById(versionId.value);
      return new model.PageResult<object>(res);
    }
    return new model.PageResult<object>();
  }, void 0, !!versionId);

  const {state: info, execute: onReloadInfo, isLoading: infoLoading} = model.result<VersionInfo>(function () {
    if (versionId.value) {
      return api.version.geVersionInfoById<VersionInfo>(versionId.value);
    }
    return {} as VersionInfo;
  }, {} as VersionInfo, !!versionId);

  const isLoading = computed<boolean>(function () {
    return personLoading.value ? infoLoading.value : false;
  });

  const reload = function (version?: string | number) {
    if (version) {
      // 如果版本号有变更
      if (version !== versionId.value) {
        // 修改版本号并重新加载数据
        versionId.value = version;
        return Promise.all([onReloadPersons(0), onReloadInfo(0)]);
      }
    } else {
      return Promise.all([onReloadPersons(0), onReloadInfo(0)]);
    }
  }

  const create = async function () {
    return onTaskModal({...info.value, versionId: versionId.value} as TaskData, persons.value.results, {
      width: 480,
      title: "新建任务",
      okText: "提交",
      buttonClassName: ["pb-5", "px-5"],
      onOk: function (data: object) {
        const [
          estimatedStartDate,
          estimatedEndDate
        ] = safeGet<string[]>(data, "timeDay") || [];
        const [
          sourceLanguage,
          targetLanguage
        ] = info.value.languagePair.split("->");
        const person = _.find(persons.value.results, _.pick(data, ["handlerId"]));
        const value: object = {
          ..._.omit(data, ["timeDay"]),
          estimatedStartDate: `${estimatedStartDate} 00:00:00`,
          estimatedEndDate: `${estimatedEndDate} 23:59:59`,
          sourceLanguage,
          targetLanguage,
          taskType: 1,
          versionId: versionId.value,
          projectNum: info.value.projectNum,
          handlerName: safeGet<string>(person, "empName")
        };
        return onSubmit(value as TaskData);
      },
    });
  };
  const edit = async function (data: TaskData) {
    return onTaskModal({
      ...data,
      languagePair: info.value.languagePair,
    }, persons.value.results, {
      width: 480,
      title: "编辑任务",
      okText: "更新",
      buttonClassName: ["pb-5", "px-5"],
      onOk: function (res: object) {
        const [
          estimatedStartDate,
          estimatedEndDate
        ] = safeGet<string[]>(res, "timeDay") || [];
        const [
          sourceLanguage,
          targetLanguage
        ] = info.value.languagePair.split("->");
        const person = _.find(persons.value.results, _.pick(res, ["handlerId"]));
        const value: object = {
          ..._.omit(res, ["timeDay"]),
          sourceLanguage,
          targetLanguage,
          id: data.id,
          estimatedStartDate: `${estimatedStartDate} 00:00:00`,
          estimatedEndDate: `${estimatedEndDate} 23:59:59`,
          versionId: versionId.value,
          projectNum: info.value.projectNum,
          handlerName: safeGet<string>(person, "empName")
        };
        return onUpdate(value as TaskData);
      },
    });
  }
  return {isLoading, versionId, reload, create, edit};
}





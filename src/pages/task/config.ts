import * as modal from "@ue/modal";
import {Input, InputNumber, RangePicker, Select, message} from "ant-design-vue";


import api from "src/api";
import {ref, onMounted} from "vue";
import ImageShow from "./imageShow.vue";

export const columns = [
  {title: "任务名称", dataIndex: 'taskName', key: 'taskName'},
  {title: "状态", dataIndex: 'taskStatus', key: 'taskStatus', align: "center"},
  {title: "处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "图片总量", dataIndex: 'totalCnt', key: 'totalCnt', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "更新时间", dataIndex: 'lastDealTime', key: 'lastDealTime', align: "center"},
  {title: "进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'action', key: 'action', align: "center"},
];


let versionInfo = ref([]);
let persons = ref([]);
let nodes = ref([]);
let taskInfo = ref([]);
const languageInfos = ref([]);
const taskStatusOption = ref([]);

let versionId = ref(0)
let formImages = [];
//提交
const onSubmit = async function (formData: object) {
  if (formImages.length === 0) {
    message.error('请至少选择一张图片后提交!')
    return
  }
  const date = new Date(formData.timeDay[0].$d);
  const formattedDate1 = formatDate(date);
  const date1 = new Date(formData.timeDay[1].$d);
  const formattedDate2 = formatDate(date1);
  formData.estimatedStartDate = formattedDate1
  formData.estimatedEndDate = formattedDate2

  formData.taskType = 1
  formData.projectVersionImages = formImages
  formData.projectNum = versionInfo.value.projectNum
  formData.versionId = versionInfo.value.id
  formData.sourceLanguage = versionInfo.value.languagePair.split("->")[0]
  formData.targetLanguage = versionInfo.value.languagePair.split("->")[1]
  formData.handlerName = gethandlerName(formData.handlerId)

  const code = await api.task.submitTask(formData);
  if (code === false) {
    return false
  } else {
    return true
  }
};
//更新
const onUpdate = async function (formData: object) {

  const date = new Date(formData.timeDay[0].$d);
  const formattedDate1 = formatDate(date);
  const date1 = new Date(formData.timeDay[1].$d);
  const formattedDate2 = formatDate(date1);
  formData.estimatedStartDate = formattedDate1
  formData.estimatedEndDate = formattedDate2
  formData.id = taskInfo.value.id
  console.log('2');
  const code = await api.task.updateTask(formData);
  if (code === false) {
    return false
  } else {
    return true
  }
};
const gethandlerName = function (handlerId) {
  const person = persons.value.find(s => s.handlerId === handlerId);
  return person ? person.empName : '';
};

//图片资源保存
const onImageShow = async function () {
  const res = await modal.confirm(ImageShow, {
    width: 650,
    height: 400,
    title: "图片选择",
  }, {
    versionId: versionInfo.value.id,
    projectNum: versionInfo.value.projectNum,
    taskId: taskInfo.value.id || 0
  })
  if (res.imageIds.length > 0) {
    formImages = res.imageIds
  }
  return false;

};
//查询当前版本的所有节点
const fetchNodeInfo = async () => {
  try {
    nodes.value = await api.task.getTaskInfoNodeById(versionId.value);
    if (nodes.value.length == 0) {
      message.error('当前任务还未配置流程节点，请联系PM进行配置')

    }
    console.log(nodes.value[0].id);
    fetchPersonInfo(nodes.value[0].id);
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

//初始化人员
const fetchPersonInfo = async (nodeId) => {
  try {
    persons.value = await api.task.getTaskInfoPersonById(versionId.value, nodeId);
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

//--初始化语言字典开始

const fetchLanguageInfo = async () => {
  try {
    const res = await api.system.getDictData('comic_language_type');
    languageInfos.value.results = res.results;
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

fetchLanguageInfo()
const changePariLanguage = (source: string) => {
  const [sourceLang, targetLang] = source.split("->");

  const findLabelByCode = (code: string) => {
    const language = languageInfos.value.results.results.find(element => element.code === code);
    return language ? language.dictLabel : '';
  };
  const sourceRet = findLabelByCode(sourceLang);
  const targetRet = findLabelByCode(targetLang);

  return `${sourceRet} -> ${targetRet}`;
};
//---语言字典结束


const fetchTaskStatusInfo = async () => {
  try {
    const res = await api.system.getDictData('comic_task_status');
    taskStatusOption.value = res.results;
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};


const changeLabel = function (value: string) {
  let dictLabel = ''
  taskStatusOption.value.forEach(e => {

    if (value == Number(e.dictValue)) {
      dictLabel = e.dictLabel
    }

  })
  console.log(dictLabel);

  return dictLabel
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(function () {
  fetchTaskStatusInfo()
});
export const onCreate = async function (param1: number, type: number) {

  if (type == 1) {
    versionId.value = param1
    taskInfo.value = []
  } else {
    taskInfo.value = await api.task.getTaskInfoById(param1)
    versionId.value = taskInfo.value.versionId

  }


  fetchNodeInfo();
  versionInfo.value = await api.version.geVersionInfoById(versionId.value)
  return modal.form([

    {
      key: "taskName",
      label: "任务名称",
      value: taskInfo.value.taskName,
      component: Input,
    }
    ,
    [
      {
        key: "taskLanguage",
        label: "语言对",
        component: Select,
        value: changePariLanguage(versionInfo.value.languagePair),
        props: {
          disabled: true
        }
      },
      {
        key: "taskLabel",
        label: "任务状态",
        component: Input,
        value: taskInfo.value.taskStatus ? changeLabel(taskInfo.value.taskStatus) : '草稿',
        props: {
          disabled: true

        }
      }

    ],
    {
      key: "timeDay",
      label: "日期",
      component: RangePicker,
      //value: taskInfo.value.timeDay,
      props: {
        "format": 'YYYY/MM/DD',
        "class": "w-full"
      }
    },
    [
      {
        key: "handlerId",
        label: "处理人",
        component: Select,
        value: taskInfo.value.handlerId,
        props: {
          fieldNames: {label: "empName", value: "handlerId"},
          options: persons
        }
      },
      {
        key: "taskOrder",
        label: "任务顺序",
        value: taskInfo.value.taskOrder,
        component: InputNumber,

        props: {
          style: {
            width: '100%'
          }
        }
      },
    ],
    {
      key: "remarks",
      label: "备注",
      value: taskInfo.value.remarks,
      component: Input.TextArea,
    },

  ], {
    title: "新建任务",
    width: 480,
    buttonClassName: ["pb-5 "],
    okText: type == 1 ? "提交" : "更新",
    onOk: type == 1 ? onSubmit : onUpdate,
    otherText: "图片资源",
    otherOk: onImageShow,
  });
}
import * as modal from "@ue/modal";
import {Input,InputNumber, RangePicker, Select,Link, message} from "ant-design-vue";
import api from "src/api";
import { ref, } from "vue";
import ImageShow  from "./imageShow.vue";
import { log } from "console";

export const columns = [
  {title: "任务名称", dataIndex: 'taskName', key: 'taskName'},
  {title: "状态", dataIndex: 'taskStatus', key: 'taskStatus', align: "center"},
  {title: "处理人", dataIndex: 'handlerName', key: 'handlerName', align: "center"},
  {title: "图片总量", dataIndex: 'totalCnt', key: 'totalCnt', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "更新时间", dataIndex: 'lastDealTime', key: 'lastDealTime', align: "center"},
  {title: "进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'action', key: 'action', align: "right"},
];


let versionInfo=ref([]);
let persons=ref([]);
let nodes=ref([]);
let taskInfo=ref([]);
const languageInfos = ref([]);
const taskStatusOption = ref([]);

let versionId =ref(0)
let formImages = [];
//提交
const onSubmit =async function (formData: object) {
  if(formImages.length===0){
    message.error('请至少选择一张图片后提交!')
    return
  }
  formData.taskType = 1
  formData.projectVersionImages = formImages
  formData.projectNum = versionInfo.value.projectNum
  formData.versionId = versionInfo.value.id
  formData.sourceLanguage = versionInfo.value.languagePair.split("->")[0]
  formData.targetLanguage = versionInfo.value.languagePair.split("->")[1]
  formData.handlerName = gethandlerName(formData.handlerId)
  
  const code = await api.task.submitTask(formData);  
  if(code===false){
    return false
  }else{
    return true
  }
};
//更新
const onUpdate =async function (formData: object) {
  formData.id = taskInfo.value.id
  const code = await api.task.updateTask(formData);  
  if(code===false){
    return false
  }else{
    return true
  }
};
const gethandlerName = function(handlerId) {
  const person = persons.value.find(s => s.handlerId === handlerId);
  return person ? person.empName : '';
};

//图片资源保存
const onImageShow =  async function () {
  const res = await modal.confirm(ImageShow, {
    width: 650,
    height:400,
    title: "图片选择",
  }, {
    versionId: versionInfo.value.id,
    projectNum: versionInfo.value.projectNum,
    taskId: taskInfo.value.id||0
  })
  if(res.imageIds.length>0){
    formImages = res.imageIds
  }
  return false;
  
};
//查询当前版本的所有节点
const fetchNodeInfo = async () => {
  try {
    nodes.value = await api.task.getTaskInfoNodeById(versionId.value);
    console.log('node.............');
    
    console.log(nodes.value);
    if(nodes.value.length==0){
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
   
    
    persons.value = await api.task.getTaskInfoPersonById(versionId.value,nodeId);
    console.log('persons');
    
    console.log(persons.value);
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

//--初始化语言字典开始

const fetchLanguageInfo = async () => {
  try {
    languageInfos.value = await api.system.getDictData('comic_language_type');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

fetchLanguageInfo()
const changePariLanguage = (source: string) => {
  const [sourceLang, targetLang] = source.split("->");

  const findLabelByCode = (code: string) => {
    const language = languageInfos.value.find(element => element.code === code);
    return language ? language.dictLabel : '';
  };
  const sourceRet = findLabelByCode(sourceLang);
  const targetRet = findLabelByCode(targetLang);

  return `${sourceRet} -> ${targetRet}`;
};
//---语言字典结束



const fetchTaskStatusInfo = async () => {
  try {
    taskStatusOption.value = await api.system.getDictData('comic_task_status');
  } catch (error) {
    console.error("Failed to fetch language:", error);
  }
};

fetchTaskStatusInfo()

const changeLabel = function(value:string){
  console.log(value);
  console.log(taskStatusOption.value);
  let dictLabel = ''
  taskStatusOption.value.forEach(e=>{
  
    if(value == Number(e.dictValue)){
      dictLabel = e.dictLabel
    }
    
  })
  console.log(dictLabel);
  
  return dictLabel
}
export const onCreate =async function (param1:number,type:number) {
  
  if(type==1){
    versionId.value = param1
    taskInfo.value = []
  }else{
    taskInfo.value =await api.task.getTaskInfoById(param1)
    versionId.value = taskInfo.value.versionId
    console.log(taskInfo.value);
    console.log(versionId.value);
  }
  
  
  
  fetchNodeInfo();
  versionInfo.value = await api.version.geVersionInfoById(versionId.value)
  return modal.form([

    {
      key: "taskName",
      label: "任务名称",
      value:taskInfo.value.taskName,
      component: Input,
    }
  ,
    [
      {
        key:"taskLanguage",
        label: "语言对",
        component: Select,
        value:changePariLanguage(versionInfo.value.languagePair),
        props:{
          disabled:true
        }
      },
      {
        key:"taskLabel",
        label: "任务状态",
        component: Input,
        value:taskInfo.value.taskStatus?changeLabel(taskInfo.value.taskStatus):'草稿',
        props:{
          disabled:true

        }
      }
        
    ],
    {
      
      label: "日期",
      component: RangePicker,
      props: {
        "class": "w-full"
      }
    },
    [
      {
        key:"handlerId",
        label: "处理人",
        component: Select,
        value: taskInfo.value.handlerId,
        props:{
          fieldNames: { label: "empName", value: "handlerId" },
          options: persons
        }
      },
      {
        key:"taskOrder",
        label: "任务顺序",
        value: taskInfo.value.taskOrder,
        component: InputNumber,
        
        props:{
          style:{
            width:'100%'
          }
        }
      },
    ],
    {
      key:"remarks",
      label: "备注",
      value: taskInfo.value.remarks,
      component: Input.TextArea,
    },
   
  ], {
    title: "新建任务",
    width: 480,
    buttonClassName: ["pb-5 "],
    okText: type==1?"提交":"更新",
    onOk: type==1?onSubmit:onUpdate,
    otherText : "图片资源",
    otherOk: onImageShow,
  });
}
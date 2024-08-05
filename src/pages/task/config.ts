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
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "更新时间", dataIndex: 'lastDealTime', key: 'lastDealTime', align: "center"},
  {title: "进度", dataIndex: 'totalCnt', key: 'totalCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "right"},
];


let versionInfo=ref([]);
let persons=ref([]);
let nodes=ref([]);
const languageInfos = ref([]);
let versionId =0
let formImages = [];
//提交
const onSubmit =async function (formData: object) {
  if(formImages.length===0){
    message.error('请至少选择一张图片后提交!')
    return
  }
  formData.taskType = 1
  formData.projectVersionImages = formImages
  formData.projectNum = versionInfo.projectNum
  formData.versionId = versionInfo.id
  formData.sourceLanguage = versionInfo.languagePair.split("->")[0]
  formData.targetLanguage = versionInfo.languagePair.split("->")[1]
  formData.handlerName = gethandlerName(formData.handlerId)
  
  const code = await api.task.submitTask(formData);  
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
    title: "弹框",
  }, {
    versionId: versionInfo.id
  })
  if(res.imageIds.length>0){
    formImages = res.imageIds
  }
  return false;
  
};
//查询当前版本的所有节点
const fetchNodeInfo = async () => {
  try {
    nodes.value = await api.task.getTaskInfoNodeById(versionId);
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
   
    
    persons.value = await api.task.getTaskInfoPersonById(versionId,nodeId);
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

export const onCreate =async function (param1:number) {
  versionId = param1
  
  fetchNodeInfo();
  versionInfo = await api.version.geVersionInfoById(param1)
  return modal.form([

    {
      key: "taskName",
      label: "任务名称",
      component: Input,
    }
  ,
    [
      {
        key:"taskLanguage",
        label: "语言对",
        component: Select,
        value:changePariLanguage(versionInfo.languagePair),
        props:{
          disabled:true
        }
      },
      {
        key:"taskStatus",
        label: "任务状态",
        component: Input,
        value:"草稿",
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
        props:{
          fieldNames: { label: "empName", value: "handlerId" },
          options: persons
        }
      },
      {
        key:"taskOrder",
        label: "任务顺序",
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
      component: Input.TextArea,
    },
   
  ], {
    title: "新建任务",
    width: 480,
    buttonClassName: ["pb-5 "],
    okText: "Submit",
    onOk: onSubmit,
    otherText : "图片资源",
    otherOk: onImageShow,
  });
}
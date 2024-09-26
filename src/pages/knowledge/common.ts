import {ref} from "vue";
import api from "src/api";
import {useRoute} from "vue-router";
import * as message from "@ue/message";
import onSure from "src/utils/tips/sure";
import safeGet from "@fengqiaogang/safe-get";

class FormState {
  searchValue?: string;
}


export const useCommon = function () {
  const route = useRoute();
  const pageSize = ref<number>(10);
  const pageNumber = ref<number>(1);
  const isUploading = ref<boolean>(false);
  const fromData = ref<FormState>(new FormState());
  const isShowProject = ref<boolean>(!!route.params.projectId);

  const versionId = ref<number | undefined>(route.query.versionId ? Number(route.query.versionId) : void 0);
  const projectId = ref<number | undefined>(route.params.projectId ? Number(route.params.projectId) : void 0);

  return {
    versionId,
    projectId,
    isShowProject,
    pageSize,
    pageNumber,
    isUploading,
    fromData
  };
}

// 文件格式校验
export const onFileAccept = (file: File) => {
  if (file.name) {
    const reg = /\.xlsx$/i;
    if (reg.test(file.name)) {
      return true;
    }
  }
  message.error('仅支持xlsx格式文件上传!');
  return false
};

// 资源文件删除
export const onRemove = async function (data: object) {
  let status = await onSure("是否确认删除？");
  if (status) {
    const fileId = safeGet<string>(data, "fileId");
    if (fileId) {
      status = await api.knowLedge.removeItem(fileId);
    }
  }
  return !!status;
}

export const fileColumns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联画册", dataIndex: 'versionName', key: 'versionName', align: "center"},
  {title: "文件名称", dataIndex: 'fileName', key: 'fileName'},
  {title: "文件大小", dataIndex: 'fileSize', key: 'fileSize', width: 100},
  {title: "文件类型", dataIndex: 'fileType', key: 'fileType', align: "center", width: 100},
  {title: "创建人", dataIndex: 'createByName', key: 'createByName', align: "center", width: 100},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

export const textColumns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联画册", dataIndex: 'versionName', key: 'versionName', align: "center"},
  {title: "原文", dataIndex: 'originalText', key: 'originalText'},
  {title: "建议译文", dataIndex: 'translationText', key: 'translationText'},
  {title: " 备注", dataIndex: 'remark', key: 'remark', align: "left"},
  {title: " 类别", dataIndex: 'typeName', key: 'textName', align: "center", width: 100},
  {title: "创建人", dataIndex: 'createBy', key: 'createBy', align: "center", width: 100},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];
import {ref} from "vue";
import {useRoute} from "vue-router";

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


export const fileColumns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联版本", dataIndex: 'versionName', key: 'versionName'},
  {title: "文件名称", dataIndex: 'fileName', key: 'fileName'},
  {title: "文件大小", dataIndex: 'fileSize', key: 'fileSize'},
  {title: "文件类型", dataIndex: 'fileType', key: 'fileType', align: "center"},
  {title: "创建人", dataIndex: 'createByName', key: 'createByName', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];
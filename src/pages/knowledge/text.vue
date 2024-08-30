<!--文本-->
<script setup lang="ts">
/**
 * @file 知识库
 */
import {onMounted, ref, reactive} from 'vue';

import api from "src/api";
import {Icon} from "@ue/icon";
import {API_BASE} from "src/config";
import * as model from "src/utils/model";
import {ElSelect, ElOption} from "element-plus"
import {onCreate} from "src/utils/textResource";
import Authorization from "src/libs/http/config/authorization";
import {Table, Form, FormItem, InputSearch, Button, FormProps, Upload, message, Pagination} from "ant-design-vue";

const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  }
})


const pageNumber = ref(1)
const versionOption = ref([])

interface FormState {
  typeId: number
  searchValue: string;
  versionId: number

}

const formState = reactive<FormState>({
  typeId: props.projectId,
  searchValue: '',
});

const handleFinish: FormProps['onFinish'] = values => {
  console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
  console.log(errors);
};


const columns = [
  {title: "关联项目", dataIndex: 'projectName', key: 'projectName'},
  {title: "关联版本", dataIndex: 'versionName', key: 'versionName'},
  {title: "原文", dataIndex: 'originalText', key: 'originalText'},
  {title: "建议译文", dataIndex: 'translationText', key: 'translationText'},
  {title: " 类别", dataIndex: 'typeName', key: 'textName'},
  {title: " 备注", dataIndex: 'remark', key: 'remark'},
  {title: "创建人", dataIndex: 'createBy', key: 'createBy', align: "center"},
  {title: "创建时间", dataIndex: 'createTime', key: 'createTime', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];
const onSearch = () => {
  onLoad()
  console.log(state.value);

}
const exportTemple = () => {
  //api.project.exportTextResource()
  window.open(API_BASE + '/project/text/export/textTmp')
}

const importTemple = () => {
  let fromData = {}
  // file
  // projectNum
  api.project.importTextResource()
}
const {state, execute: onLoad, isLoading} = model.list<object>(
  function () {

    //return api.knowLedge.textList(1, formState.typeId);
    return api.knowLedge.textList(pageNumber.value, formState.typeId, formState.versionId, formState.searchValue);
  },
  new model.PageResult<object>([]),
  true
);

onMounted(async () => {
  try {
    versionOption.value = await api.project.getVersionDict(props.projectId);
    console.log(versionOption.value);
  } catch (error) {
    console.error('Error fetching project info:', error);
  }
});

const nweTextRource = async function () {
  const status = await onCreate(props.projectId);
  if (status) {
    onLoad(100);
  }
}
const fileList = ref([]);
const uploadData = {'projectId': props.projectId}
const headers = {'Authorization': Authorization('TOKEN', 'Authorization').Authorization}

console.log('header');

const handleChange = (info: UploadChangeParam) => {
  console.log(info);

  if (info.code != 200) {
    message.error(info.msg);
  } else {
    message.success(info.msg);
    onLoad(100);
  }
  fileList.value = []
  return
};

const beforeUpload = (file: UploadProps['fileList'][number]) => {
  console.log(file.name);
  console.log(file.name.indexOf('xlsx') > -1);
  console.log(file.name.indexOf('xlsx'));


  const isJpgOrPng = file.name.indexOf('xlsx') > -1;
  if (!isJpgOrPng) {
    fileList.value = []
    message.error('仅支持xlsx格式文件上传!');
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 200;
  if (!isLt2M) {
    fileList.value = []
    message.error('上传附件必须小于200MB!');
    return false
  }
  return isJpgOrPng && isLt2M;
};

const changePage = function (page) {
  pageNumber.value = page
  onLoad()
}
</script>
<template>
  <div>
    <Form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
      <FromItem>

        <ElSelect v-model="formState.versionId" placeholder="请选择画册" class="w-50" clearable>
          <ElOption
              v-for="item in versionOption"
              :key="item.versionId"
              :label="item.verisonName"
              :value="item.versionId">
          </ElOption>
        </ElSelect>
      </FromItem>
      <FromItem>

        <InputSearch v-model:value="formState.searchValue" :allow-clear="true" placeholder="请输入条件" enter-button
                     @search="onSearch"
                     class="w-100 float-left"/>
      </FromItem>
      <FromItem class="ml-3">
        <Button type="primary" class="bg-neutral-600" @click="exportTemple">导出</Button>

      </FromItem>
      <FromItem class="ml-3">
        <Upload
            v-model:file-list="fileList"
            name="file"
            action="http://192.168.15.30:9999/eci-comic/project/text/upload/textResource"
            :headers="headers"
            :data="uploadData"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @success="handleChange"
        >
          <Button type="primary" class="bg-violet-600">导入</Button>
        </Upload>


      </FromItem>
      <FromItem class="ml-3">
        <Button type="primary" class="bg-blue-600" @click="nweTextRource">新增</Button>

      </FromItem>

    </Form>

    <Table class="mt-5" :loading="isLoading" :data-source="state.results" :pagination="false" :columns="columns"
           :bordered="true">
      <template #bodyCell="{ column, text, record }">


        <template v-if="column.key === 'action'">
                    <span class="inline-block">
                        <Icon class="text-xl text-primary cursor-pointer" type="edit-square"></Icon>
                    </span>
        </template>
      </template>
    </Table>
    <br/>
    <Pagination v-model:current="pageNumber" class="float-right" :total="state.total" show-less-items
                @change="changePage" :show-total="total => `共 ${state.total} 条`"/>
  </div>

</template>
<!--附件-->

<script setup lang="ts">
/**
 * @file 知识库
 */
import { onMounted, computed, ref } from 'vue';
import api from "src/api";
import { useRoute } from "vue-router";
import * as alias from "src/router/alias";
import * as model from "src/utils/model";

import { Table, Form, InputSearch, Button, FormProps, message, Card, Image, Row, Col } from "ant-design-vue";

import { Icon } from "@ue/icon";
import { reactive } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Upload from "src/components/upload/index.vue";
import { FileData } from "src/utils/upload/common";
import { ElSelect, ElOption } from "element-plus"



const route = useRoute();
console.log('Project ID = "%s"', route.params.projectId);
const isOnloading = ref<boolean>(false);
const versionOption = ref([])
const versionInfo = ref({})
const fromData = ref({
    searchValue: "",
})
let fileInfo: any[] = [];
interface FormState {
    typeId: number
    fileName: string;
    fileType: string;
}
const formState: UnwrapRef<FormState> = reactive({
    typeId: route.params.projectId,
    fileName: '',
    fileType: ''
});

const handleFinish: FormProps['onFinish'] = values => {
    console.log(values, formState);
};
const handleFinishFailed: FormProps['onFinishFailed'] = errors => {
    console.log(errors);
};


const onSearch = () => {
    onLoad()
    console.log(state.value);

}
const { state, execute: onLoad, isLoading } = model.list<object>(
    function () {

        //return api.knowLedge.list(1, formState.typeId);
        console.log(fromData.value);
        return api.knowLedge.list(1, route.params.projectId, fromData.value.versionId, fromData.value.searchValue, "2");
    },
    new model.PageResult<object>([]),
    true
);
//文件上传
const onSuccess = async function (files: FileData[]) {
    console.log('------');

    console.log(files);

    files.forEach(s => {
        fileInfo.push({
            'fileName': s.fileName,
            'fileSize': s.size,
            'filePath': s.src,
            'fileType': s.type,
            'projectId': route.params.projectId,
            'versionId': versionInfo.value.versionId || 0,
            "resourceType": '2'
        })

    })
    message.success("上传成功")
    api.project.addKnowLedgeInfo(fileInfo);
    fileInfo = []

    onLoad(100)

}
const formatImageName = (imageName: string) => {
  return imageName.length > 10 ? imageName.substring(0, 10) + '...' : imageName;
};


onMounted(async () => {
    try {
        versionOption.value = await api.project.getVersionDict(route.params.projectId);
        console.log(versionOption.value);
    } catch (error) {
        console.error('Error fetching project info:', error);
    }
});
</script>
<template>
    <div>
        <Form layout="inline" :model="formState" @finish="handleFinish" @finishFailed="handleFinishFailed">
            <FromItem>

                <ElSelect v-model="fromData.versionId" placeholder="请选择画册" class="w-50" clearable>
                    <ElOption v-for="item in versionOption" :key="item.versionId" :label="item.verisonName"
                        :value="item.versionId">
                    </ElOption>
                </ElSelect>
            </FromItem>
            <FromItem>

                <InputSearch v-model:value="fromData.searchValue" placeholder="请输入条件" enter-button allow-clear
                    @search="onSearch" class="w-100 float-left" />
            </FromItem>
            <FromItem>

                <Upload :multiple="true" @success="onSuccess" class="ml-3" v-model:loading="isOnloading">
                    <Button :loading="isOnloading">图片上传</Button>
                </Upload>
            </FromItem>

        </Form>

        <Card>
            <Row>
                <Col :span="3" v-for="item in state.results">
                <Card style="width:150px" class="mb-5">
                    <Image style="margin-left:5px ;height: 150px; width: auto; display: flex;flex-wrap: wrap;justify-content: flex-start;"
                        :src="item.filePath" />
                    <span>{{formatImageName(item.fileName)}}</span>
                </Card>
                </Col>
               
            </Row>
        </Card>
    </div>

</template>
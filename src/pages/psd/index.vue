<script setup lang="ts">
/**
 * @file 知识库
 */
import { ref } from "vue"
import api from "src/api";
import { Upload,Button,Divider,Image,Row,Col,Table } from "ant-design-vue";
const headers = {'Authorization':'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaWQiOiIwMDAwMHJhMnp4bTUwc3BjNnEzMXdqOW9iZ2Z5NzRuZCIsInVzZXJfbmFtZSI6InJvb3QiLCJ0eiI6Ik1hcnF1ZXNhcyBTdGFuZGFyZCBUaW1lIiwicGlkIjotMSwib2lkIjotMSwib2xkaWQiOm51bGwsImNsaWVudF9pZCI6ImxxYV9nYW1lIiwiYXR0YWNocyI6IiIsImVuYW1lIjoiTFFBIiwiaHBpZCI6bnVsbCwiYXR5cGUiOiIxIiwic2NvcGUiOlsiYWxsIl0sImRuYW1lIjoiRUNJW-i2heeuoV0iLCJleHAiOjE3MjMwMTM4OTYsInF5d3giOm51bGwsImFpZCI6IjAwMDAwMDA1eHY2ZTkwb3RkbjdobWYyYjR1c3pqcGljIiwianRpIjoiOWYyNzFkMmYtNTYyOS00OTg2LWExOTQtMjEzZjBjMTFkNzA2IiwiZGlkIjotMX0.gUzAMkSXxQgjSHpCivyEDhkfSg-G0bJQhfLWNTFfpci9X2S5bHH4NPTek_TkksGsRFLtaU55Ue61PIsABAE0ZfYy_5p5mKwlbODCL6WvIwBZzY4b-ph-yCB4pFleOdVzw51EoYesgAk-90w5GPc56eb3VhhF6at6Hp0PX_AFrV7i8_HQ5JG6Qbz0-ozSqKihJNQovyUcJw3XH5anrTXV_qctq3zYHR_TEMrMs0lC2bfXGqT9q735a-8w8q8ZyMTwro6vUM9u_wETbsvVO-B0A1doxsuaVmeMbfovYwiSh5LObaPfe9X0WUsk4U9ZtCYL3VjUn07KNUv9ot2Cec9CAQ'}
const url = ref("");
const list = ref([]);
const dataSource = ref([]);
const handleChange=function(e){
    console.log(e);
    url.value = "http://192.168.15.30:8098/game/common/image/local?fileName="+e.data.url
    list.value = e.data.arrays.reverse()
    console.log(url.value);
    list.value.forEach(element => {
        dataSource.value.push({source:element})
    });
    console.log(dataSource.value);
    
    return true
}
const gptDeal =async function(text:string){
  console.log(text.source);
  const res = await api.project.ocrResult(text.source)
  text.target_ai = res
  console.log(res);
  
}

const columns =  [
          {
            title: '原文',
            dataIndex: 'source',
            key: 'source',
          },
          {
            title: '译文_AI',
            dataIndex: 'target_ai',
            key: 'target',
          },
          {
            title: '译文_Google',
            dataIndex: 'google_ai',
            key: 'target',
          },
          {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
          },
        ]
const pagination = {
    defaultPageSize: 1000,
}
</script>
<template>
<div>
    PSD TEST
    <br/><br/>
    <Upload
    v-model:file-list="fileList"
    name="file"
    action="http://192.168.15.30:9999/eci-comic/game/common/upload/"
    :headers="headers"
    @success="handleChange"
  >
    <Button type="primary">
      <upload-outlined></upload-outlined>
      Click to Upload
    </Button>
  </Upload>
  <Divider />
  <Row>
    <Col :span="18">
        <Image
            :src='url'
        />
    </Col>
    <Col :span="6">
        <Table v-if="dataSource.length>0":dataSource="dataSource" bordered :columns="columns" :pagination="pagination">
          <template #bodyCell="{ column, text, record  }">
          <template v-if="column.key === 'option'">
            <Button @click="gptDeal(record)">GPT</Button>
          </template>
        </template>
      </Table>
    </Col>
  </Row>
  
</div>



</template>


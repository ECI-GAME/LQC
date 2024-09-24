<script setup lang="ts">
/**
 * @file 错误类型配置
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import * as _ from "lodash-es";
import {rules} from "@ue/form";
import * as modal from "@ue/modal";
import {useRoute} from "vue-router";
import onSure from "src/utils/tips/sure";
import * as model from "src/utils/model";
import {ref, reactive, computed} from 'vue';
import safeGet from "@fengqiaogang/safe-get";
import {Card, Tag, Input, Space, Button} from "ant-design-vue";

import type {Remark} from "src/types";

const route = useRoute();
const projectId = computed<string>(() => route.params.projectId as string);

const {state, execute: onReload} = model.list<Remark>(function () {
  return api.project.projectErrorType(projectId.value);
}, new model.PageResult<Remark>(), true);

// 删除类型
const handleClose = async function (item: Remark) {
  let status = await onSure("是否确认删除？");
  if (status) {
    status = await api.project.delProjectPSErrorData(item.id)
  }
  if (status) {
    await onReload(300);
  }
};

const onAddSubmit = function (name: string, item: Remark) {
  const children = safeGet<Remark[]>(item, "childrenList") || [];
  const last = _.size(children) > 0 ? _.last(children) : void 0;
  const sort = safeGet<number>(last, "errorTypeSort") || 0;
  const data = {
    errorTypeName: name,
    errorTypeSort: sort + 1,
    errorTypeParent: item.id,
    projectId: projectId.value
  }
  return api.project.addProjectPSErrorData(data);
};

// 添加类别
const onAddNode = async function (item: Remark) {
  const status = await modal.form<boolean>({
    key: "name",
    component: Input,
    rules: rules.text("请输入类型名称！"),
    props: {
      "class": "w-full",
      maxlength: 100,
      showCount: true,
      placeholder: "请输入类型名称",
      allowClear: true,
      autofocus: true,
      tabindex: 1,
    }
  }, {
    width: 360,
    title: "新增类型",
    buttonClassName: ["px-5", "pb-5"],
    onOk: (res: object) => {
      const name = safeGet<string>(res, "name")!;
      return onAddSubmit(name, item);
    }
  });
  if (status) {
    await onReload(300);
  }
};

</script>

<template>
  <div>
    <template v-for="data in state.results" :key="data.id">
      <Card class="mt-5 first:mt-0" :title="data.errorTypeName">
        <div class="-mt-2">
          <template v-if="data.childrenList">
            <div class="inline-block mr-2 mt-2" v-for="tag in data.childrenList" :key="tag.id">
              <Tag class="m-0">
                <Space>
                  <span>{{ tag.errorTypeName }}</span>
                  <Button type="text"
                          class="flex m-0 p-0 h-[initial]"
                          @click.stop="handleClose(tag)">
                    <Icon class="flex text-xs" type="close"></Icon>
                  </Button>
                </Space>
              </Tag>
            </div>
          </template>
          <Tag class="border-dashed bg-white" @click="onAddNode(data)">
            <Space size="small">
              <Icon class="flex text-xs scale-[0.8]" type="plus"></Icon>
              <span>新增类别</span>
            </Space>
          </Tag>

          <!--          <Input-->
          <!--              v-if="item.inputVisible"-->
          <!--              v-model:value="item.inputValue"-->
          <!--              type="text"-->
          <!--              size="small"-->
          <!--              :style="{ width: '78px' }"-->
          <!--              @keyup.enter="handleInputConfirm(item)"-->
          <!--          />-->

        </div>
      </Card>
    </template>
  </div>
</template>
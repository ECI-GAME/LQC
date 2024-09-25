<!--节点配置页面 -->
<script setup lang="ts">
/**
 * @file 节点配置页面
 * @author svon.me@gmail.com
 */

import api from "src/api";
import {Icon} from "@ue/icon";
import * as _ from "lodash-es";
import {useRoute} from "vue-router";
import * as model from "src/utils/model";
import {computed, onMounted, ref} from 'vue';
import safeGet from "@fengqiaogang/safe-get";
import {onCreate} from "src/utils/nodeConfig";
import {onCreatePerson} from "src/utils/person";
import {VueDraggableNext} from 'vue-draggable-next';
import {Button, Col, Empty, Popconfirm, Row} from "ant-design-vue";

import type {Project} from "src/types";

const route = useRoute();
const projectId = computed<string>(() => String(route.params.projectId));

const active = ref<string | number>();
const state = ref<object[]>([]);

// 项目详情
const {state: project} = model.result<Project>(function () {
  return api.project.getProjectInfoById(projectId.value);
}, {} as Project, true);

const {state: personList, execute: onLoadPersons} = model.list(function () {
  if (active.value) {
    return api.project.getProjectPersonById(active.value);
  }
  return [];
}, new model.PageResult(), false);

const onLoadList = async function () {
  const list = await api.project.getProjectMethodById(projectId.value);
  if (list && list.length > 0) {
    state.value = list;
    setTimeout(function () {
      changePerson(list[0]);
    }, 0);
  } else {
    active.value = void 0;
    state.value = [];
  }
}

onMounted(onLoadList);

const changePerson = function (element: object) {
  const value = safeGet<string | number>(element, "id");
  if (value) {
    active.value = value;
    onLoadPersons(500)
  }
}

// 删除人员
const deletePerson = async function (id: number | string) {
  const status = await api.project.deletePerson(id);
  if (status) {
    await onLoadPersons(500);
  }
}

// 删除节点
const deleteNode = async function (id: number) {
  const status = await api.project.deleteNode(id);
  if (status) {
    // 重新加载数据
    await onLoadList();
    // 重新排序
    state.value = _.map(state.value, function (value: object, index: number) {
      return {...value, orderBy: index + 1};
    });
    await saveNodeInfo();
  }
}

// 添加节点
const onCreateWorkFlow = async function () {
  const status = await onCreate(state.value, projectId.value);
  if (status) {
    await onLoadList();
  }
}

// 添加人员
const onCreatePeople = async function () {
  const status = await onCreatePerson(project.value.projectNum, active.value, personList.value.results);
  if (status) {
    await onLoadPersons(500);
  }
}

// 保存排序
const saveNodeInfo = function () {
  return api.project.updateProMethSort(state.value);
}

</script>

<template>
  <div>
    <div class="flex m-10">
      <Row class="w-11/12">
        <Col :span="11">
          <div class="flex items-center justify-end mb-5">
            <b class="text-xl mr-auto">流程节点</b>
            <Button class="mr-5" @click="onCreateWorkFlow">新增流程节点</Button>
            <Button @click="saveNodeInfo" type="primary">保存</Button>
          </div>

          <VueDraggableNext class="dragArea list-group w-full cursor-pointer" :list="state">
            <div v-for="element in state" :key="element.methCode">
              <div
                  class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center flex items-center justify-between"
                  :class="{ '!bg-[blue]': element.id == active }"
                  @click="changePerson(element)">
                <span class="mx-auto" :class="{ 'text-white': element.id == active }">{{ element.methodName }}</span>
                <Popconfirm
                    title="确认删除该节点信息吗?"
                    ok-text="确认"
                    cancel-text="取消"
                    @confirm="deleteNode(element.id)"
                >
                  <Icon
                      class="text-xl cursor-pointer text-primary"
                      :class="{ 'text-white': element.id == active }"
                      type="delete"></Icon>
                </Popconfirm>
              </div>
            </div>
          </VueDraggableNext>
        </Col>
        <Col :span="1">
        </Col>
        <Col :span="11">
          <div class="flex items-center justify-between mb-5">
            <b class="text-xl">人员信息</b>
            <Button type="primary" @click="onCreatePeople" :disabled="!active">添加人员</Button>
          </div>

          <template v-if="personList.total > 0">
            <div class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-center" v-for="person in personList.results"
                 :key="person.handlerId">
              <span>{{ person.handlerName }}</span>
              <Popconfirm
                  title="确认删除该人员信息吗?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deletePerson(person.id)"
              >
                <Icon class="text-xl text-primary cursor-pointer float-right" type="delete"></Icon>
              </Popconfirm>
            </div>
          </template>
          <template v-else>
            <Empty></Empty>
          </template>
        </Col>
      </Row>
    </div>
  </div>
</template>

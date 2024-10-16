<script setup lang="ts">
import api from "src/api";
import {Icon} from "@ue/icon";
import Tips from "./tips.vue";
import * as _ from "lodash-es";
import {ref, toRaw} from "vue";
import Textarea from "./textarea.vue";
import Cropper from "src/utils/cropper";
import {basename} from "src/utils/image";
import {useValidate, rules} from "@ue/form";
import * as ImageUtil from "src/utils/image";
import safeGet from "@fengqiaogang/safe-get";
import {changeTranslationList} from "../config";
import Select from "src/components/dict/select.vue";
import {ElLoading} from 'element-plus';
import {Button, Form, FormItem, Space, Spin} from "ant-design-vue";
import {DotData, DotDataType, DotMatchType} from "src/components/preview/config";

import type {PropType} from "vue";
import type {ImageData} from "src/types";

const $emit = defineEmits(["save", "cancel"]);
const props = defineProps({
  data: {
    type: Object as PropType<DotData>,
    default: () => {
      return {};
    }
  },
  corrdinate: {
    type: Function,
    required: true,
  },
  file: {
    type: Object as PropType<ImageData>,
    required: true,
  },
  projectId: {
    type: [String, Number],
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  readOrder: {
    type: String,
    required: true,
  },
});

const translation1Ref = ref();
const translation2Ref = ref();
const translationWord = ref<object>();
const {formRef, validate} = useValidate();

const model = ref({
  imagePath: props.data.imagePath,
  imageFlag: String(props.data.imageFlag || 6), // 类型
  translatedText: props.data.translatedText,          // 译文
  translatedHtml: props.data.translatedHtml,
  originalText: props.data.originalText,              // 原文
  originalHtml: props.data.originalHtml,
});

const getResult = function () {
  const corrdinate = props.corrdinate();
  const data = {
    ...model.value,
    imageName: void 0,
    taskId: safeGet<string | number>(props.file, "taskId")!,  //任务ID
    imageId: safeGet<string | number>(props.file, "imageId")!,     //图片ID
    // imageName: props.data.imageName || basename(props.data.imagePath),    //图片名称
    // imagePath: props.data.imagePath,              //图片路径
    xCorrdinate1: _.toInteger(corrdinate.xCorrdinate1),
    yCorrdinate1: _.toInteger(corrdinate.yCorrdinate1),
    xCorrdinate2: _.toInteger(corrdinate.xCorrdinate2),
    yCorrdinate2: _.toInteger(corrdinate.yCorrdinate2),
    imageWidth: _.toInteger(props.data.imageWidth),
    imageHeight: _.toInteger(props.data.imageHeight),
  } as DotData;
  if (data.imagePath) {
    // 有图片则证明为 OCR
    data.imageName = props.data.imageName || basename(data.imagePath);
    data.coordinateType = DotDataType.Ocr;
  } else {
    // 普遍标记
    data.coordinateType = DotDataType.Word;
  }

  if (translation1Ref.value) {
    const textarea = translation1Ref.value.getValue();
    data.originalHtml = textarea.html;
    data.originalText = textarea.text;
  }

  if (translation2Ref.value) {
    const textarea = translation2Ref.value.getValue();
    data.translatedHtml = textarea.html;
    data.translatedText = textarea.text;
  }
  return data;
};

const onSave = async function () {
  let status = await validate();
  if (status) {
    const value = getResult();
    if (props.data && props.data.id) {
      const formValue = {...value, id: props.data.id}
      if (props.data.matchType && props.data.matchType !== DotMatchType.not) {
        // 审核 - 编辑
        status = await api.work.word.updateCheck(formValue);
      } else {
        // 正常编辑
        status = await api.work.word.update(formValue);
      }
    } else {
      status = await api.work.word.add(value);
    }
  }
  if (status) {
    $emit("save");
  }
}

const onCancel = function () {
  $emit("cancel");
}
const spinning = ref<boolean>(false);
const translateUuid = ref<number>(Math.random());
//google机翻接口
const translateMt = async function () {
  spinning.value = true
  const fromData = {
    'taskId': props.file.taskId,
    'content': model.value.originalText
  }
  const res = await api.Common.googleMt(fromData);
  if (res && res.content) {
    model.value.translatedText = res.content;
    model.value.translatedHtml = res.content;
    translateUuid.value = Math.random();
  }
  spinning.value = false
}

const onChangeTranslationList = function (data: string[][]) {
  translationWord.value = changeTranslationList(data);
}

const getBgPosition = function (src: string, dot: DotData) {
  return {
    'width': `${dot.xCorrdinate2 - dot.xCorrdinate1}px`,
    'height': `${dot.yCorrdinate2 - dot.yCorrdinate1}px`,
    'background-image': `url('${src}')`,
    'background-size': `${dot.imageWidth}px ${dot.imageHeight}px`,
    'background-position': `${dot.xCorrdinate1 * -1}px ${dot.yCorrdinate1 * -1}px`,
  };
}

const onOCR = async function (dot: DotData) {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  try {
    const cropper = new Cropper(props.file.imagePath);
    // 裁剪获取 base64 图片数据
    const value = await cropper.cutXY(dot.xCorrdinate1, dot.yCorrdinate1, dot.xCorrdinate2, dot.yCorrdinate2);
    if (value) {
      // base64 数据转换为 File 对象
      const img = ImageUtil.base64ToImage(value);
      const res = {...toRaw(model.value)};
      // 上传 File 获取图片地址
      const text = await api.system.ocr(img, props.readOrder, props.language);
      if (text) {
        res.originalText = text;
        res.originalHtml = text;
      }
    }
  } catch (e) {
    // todo
  } finally {
    setTimeout(() => {
      loading.close();
    }, 500);
  }
}

const onScanWord = function () {
  const comp = translation1Ref.value;
  if (comp && comp.scan) {
    comp.scan();
  }
}

</script>

<template>
  <Form layout="vertical" ref="formRef" :model="model">
    <FormItem label="类别" name="imageFlag" :rules="rules.text('请选择类别！')">
      <Select v-model:value="model.imageFlag" placeholder="请选择类别" type="comic_ps_title_config"></Select>
    </FormItem>
    <FormItem class="deep-[label]:w-full" name="originalText">
      <template #label>
        <div class="w-full flex items-center justify-between">
          <div>
            <span>原文</span>
          </div>
          <Space class="text-primary cursor-default">
            <Icon type="securityscan" class="text-xl cursor-pointer hidden" @click="onScanWord"></Icon>
            <Spin :spinning="spinning">
              <Icon class="cursor-pointer" :size="20" type="font-size" @Click="translateMt"></Icon>
            </Spin>
          </Space>
        </div>
      </template>
      <Textarea ref="translation1Ref"
                :project-id="projectId"
                :autofocus="true"
                v-model:html="model.originalHtml"
                v-model:text="model.originalText"
                @translation="onChangeTranslationList"></Textarea>
    </FormItem>
    <FormItem label="译文" name="translatedText">
        <Textarea ref="translation2Ref" :key="translateUuid"
                  :project-id="projectId"
                  v-model:html="model.translatedHtml"
                  v-model:text="model.translatedText"></Textarea>
    </FormItem>
    <Tips v-if="translationWord" class="deep-[.ant-descriptions-item-content]:text-primary"
          :word="translationWord"></Tips>
    <div class="flex items-center justify-between">
      <Space v-if="file.imagePath">
        <Button type="primary" danger @click="onCancel">取消</Button>
        <Button type="primary" @click="onOCR(data)">OCR</Button>
      </Space>
      <template v-else>
        <Button type="primary" danger @click="onCancel">取消</Button>
      </template>
      <template v-if="props.data.matchType && props.data.matchType !== DotMatchType.not">
        <Button type="primary" @click="onSave">提交</Button>
      </template>
      <template v-else>
        <Button type="primary" @click="onSave">保存</Button>
      </template>
    </div>
  </Form>
</template>

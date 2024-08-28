<script setup lang="ts">
import {watch, onMounted} from "vue";
import {checkWord} from "../config";
import Text from '@tiptap/extension-text'
import Color from '@tiptap/extension-color';
import StarterKit from "@tiptap/starter-kit";
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import {Editor, EditorContent} from "@tiptap/vue-3";

const $emit = defineEmits(["update:html", "update:text", "translation"]);
const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true,
  },
  html: {
    type: String,
    default: () => "",
  },
  text: {
    type: String,
    default: () => "",
  }
});

const editor = new Editor({
  autofocus: false,
  editable: true,
  content: props.html || props.text,
  extensions: [
    StarterKit, Document, Text, Heading, Paragraph, TextStyle, Color, Strike,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ]
});

let __html: string;
onMounted(function () {
  __html = props.html;
  watch(() => props.html, function (value) {
    // 当 value 发生变化时主动修改富文本内容
    if (value && value !== __html) {
      editor.commands.setContent(String(value));
    }
  })
})

const onCheckText = async function () {
  const html = editor.getHTML();
  const text = editor.getText();
  const str = String(text).trim();
  if (str && str.length > 0 && html !== __html) {
    const res = await checkWord(props.projectId, html);
    if (res.translation) {
      $emit("translation", res.translation);
    }
    if (res.html) {
      __html = res.html;
      editor.commands.setContent(res.html);
    } else {
      __html = html;
    }
  }
  $emit("update:html", __html);
  $emit("update:text", text);
}
editor.on("create", onCheckText);
editor.on("blur", onCheckText);
</script>

<template>
  <div class="text-sm h-30 px-3 py-1 border border-solid border-[var(--el-border-color)] rounded overflow-auto"
       translate="no">
    <EditorContent class="h-full tiptap-box deep-[.tiptap]:outline-none" :editor="editor"/>
  </div>
</template>

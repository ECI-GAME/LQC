<script setup lang="ts">
import api from "src/api";
import * as _ from "lodash-es";
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

import {CheckCode} from "src/types";

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
const DisableColor = "#FF0000";
const DisableStart = `<span style="color: ${DisableColor};"><del>`;
const DisableEnd = `</del><span>`;

const checkWord = async function (keyword: string): Promise<string | undefined> {
  const res = await api.work.word.check(props.projectId, keyword);
  let end: number = 0;
  const result: string[] = [];
  const translation: string[][] = [];
  for (const item of res) {
    const code = String(item.checkTypeCode);
    if (code === CheckCode.Disable) {
      const text = keyword.slice(end, item.index - 1);
      result.push(text + `${DisableStart}${item.word}${DisableEnd}`);
      end = item.index + _.size(item.word) - 1;
    } else if (code === CheckCode.Translation) {
      const text = keyword.slice(end, item.index - 1);
      result.push(text + `<span style="color: #0EA5E9;">${item.word}<span>`);
      end = item.index + _.size(item.word) - 1;
      translation.push([item.word, item.suggestTranslation]);
    }
  }
  if (translation.length > 0) {
    $emit("translation", translation);
  }
  if (result.length > 0) {
    result.push(keyword.slice(end));
    return result.join("");
  }
}

const onCheckText = async function () {
  const html = editor.getHTML();
  const text = editor.getText();
  const str = String(text).trim();
  if (str && str.length > 0 && html !== __html) {
    const value = await checkWord(html);
    if (value) {
      __html = value;
      editor.commands.setContent(value);
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

import {DictItem} from "./dict";

export interface LanguageData extends DictItem {
  lang: string | null;
}
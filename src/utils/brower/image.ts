/**
 * @file 图片预览
 */

import {PREVIEW_IMAGE} from "src/config";

export const preview = function (value?: string) {
  if (value) {
    return `${PREVIEW_IMAGE}?src=${value}&scale=1`;
  }
}
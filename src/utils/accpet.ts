/**
 * @file 文件格式校验
 * @author svon.me@gmail.com
 **/

import * as tips from "@ue/message";
import {accept} from "@js-lion/upload";

export const ImageAccept = "jpg, jpeg, png, gif, webp, psd";

export const checkFileType = async function (file: File, acceptValue: string, message?: string): Promise<boolean> {
  const status = await accept(acceptValue, file);
  if (!status && message) {
    tips.error(message);
  }
  return status;
}

export const checkFileImage = function (file: File, acceptValue?: string, message?: string) {
  return checkFileType(
    file,
    acceptValue || ImageAccept,
    message || "格式错误，请上传 JPG/JPEG/PNG/PSD 等格式的文件"
  );
}
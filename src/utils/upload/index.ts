/**
 * @file 文件上传
 * @author svon.me@gmail.com
 */

import {format} from "./common";
import UpdateBasis from "./file";
import type {FileData} from "./common";
import type {ChangeCallback, Result} from "@js-lion/upload";


const Upload = async function (file: File, onChange?: ChangeCallback): Promise<FileData | undefined> {
  const upload = new UpdateBasis([file]);
  if (onChange) {
    upload.on(onChange);
  }
  const [data]: Array<Result> = await upload.start();
  if (data) {
    return format(data)
  }
}

export default Upload;
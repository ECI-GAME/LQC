/**
 * @file 文件上传
 * @author svon.me@gmail.com
 * @description 前端直传 Aliyun OSS
 */

import {Bucket} from "./common";
import {S3} from "@js-lion/upload";

export default class Upload extends S3 {
  constructor(files: File[]) {
    super(Bucket, files);
  }
}

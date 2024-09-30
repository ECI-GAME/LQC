/**
 * @file 文件上传
 * @author svon.me@gmail.com
 */

export {default as S3} from "./util/s3/file";
export {Result, Status} from "./util/common/res";
export {BucketType} from "./util/common/config";
export {default as OSS} from "./util/aliyunoss/file";
export {default as Basis} from "./util/common/basis";
export {default as accept} from "./components/accept";
export type {ChangeCallback} from "./util/common/config";
export {default as Upload} from "./components/upload.vue";
export type {AcceptFun as Accept} from "./components/accept";
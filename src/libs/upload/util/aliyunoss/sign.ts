/**
 * @file Aliyun OSS 签名
 * @author svon.me@gmail.com
 */

import URL from "url";
import {API} from "@js-lion/api";
import {API_BASE} from "src/config";
import safeGet from "@fengqiaogang/safe-get";
import {filePath} from "../common/config";

export enum UploadOrigin {
  Multipart = "ali-multi", // 阿里云大文件上传
  Simple = "ali-simple"    // 阿里云小文件上传
}

export class Signature {
  accessId!: string;     // AliOSS accessKeyId
  accessKey!: string;    // AliOSS accessKey
  // 上传路径
  dir!: string;
  // Ali OSS  Bucket 名称
  containerName!: string;
  // 上传域名地址
  host!: string;
  // 签名
  securityToken!: string;
  // 文件名
  fileName?: string;
  // Bucket 所在地域
  region!: string;
  // 预览地址
  url?: string;
  path?: string;
  origin!: UploadOrigin
}

export const getSignature = async function (file: File, headers: object = {}, body: object = {}): Promise<Signature | undefined> {
  const api: API = new API();
  const fileSize = file ? Math.ceil(file.size / 1024) : 0;
  let res;
  try {
    const value = {
      ...body,
      fileSize,
      fileName: file?.name
    };
    // 获取签名
    const url = URL.parse(API_BASE, true);
    url.pathname = "/lqa-game/system/project/common/getOssAuth"
    res = await api.post(URL.format(url), value, {headers});
  } catch (e) {
    return void 0;
  }
  const sign = new Signature();
  if (res) {
    sign.origin = safeGet<UploadOrigin>(res, "origin") || UploadOrigin.Simple;
    sign.host = safeGet<string>(res, "host")!;
    sign.dir = safeGet<string>(res, "dir")!;
    sign.accessId = safeGet<string>(res, "accessId")!;
    sign.accessKey = safeGet<string>(res, "accessKey")!;
    sign.fileName = safeGet<string>(res, "fileName") || file?.name.replace(/[\s+=#&]/ig, "");

    sign.securityToken = safeGet<string>(res, "securityToken")!;
    sign.containerName = safeGet<string>(res, "containerName")!;
    sign.region = safeGet<string>(res, "region")!;
    // 储存到阿里云 OSS 中的文件路径
    if (sign.dir) {
      sign.path = filePath(file, sign.dir.replace(/^\/|\/$/, "")); //  `${sign.dir}${sign.fileName}`
    } else {
      sign.path = filePath(file);
    }
    // 互联网访问该文件的 URL 链接地址
    sign.url = `https://lqa-api.svon.org/out/images/${sign.path}`;
  }
  return sign;
}
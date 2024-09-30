/**
 * @file 文件上传
 * @author svon.me@gmail.com
 * @description 前端直传 Aliyun OSS
 */

import Basis from "../common/basis";
import {Result, Status} from "../common/res";
import {getFileMeta} from "../common/config";
import {getSignature, UploadOrigin} from "./sign";
import {getAliOssClient, AliOssOption} from "./client";

import {Checkpoint} from "ali-oss";

import type OSS from "ali-oss";
import type {Signature} from "./sign";


export default class Upload extends Basis {
  public chunkSize: number = 2 * 1024 * 1024;  // 大文件切片颗粒度大小, 默认 2M
  constructor(files: File[]) {
    super(files);
  }

  init(): void {
    return void 0;
  }

  // 判断是否为小文件
  isFileSimple(file: File): boolean {
    const size = file.size;
    // 判断文件是否小于 10M
    return size <= this.chunkSize * 5;
  }

  async putObject(file: File): Promise<Result> {
    // 获取签名
    const signature = await getSignature(file);
    const client = getAliOssClient(signature);
    if (!signature || !client) {
      const res = new Result(file, void 0, void 0, Status.abnormal);
      this.onChange(file, 0, res);
      return Promise.reject(new Error("Signature exception !"));
    }
    // 判断签名中是否有指定上传文件的方式
    if (signature.origin) {
      // 判断是否启用大文件上传
      if (signature.origin === UploadOrigin.Multipart) {
        return this.multipartUpload(signature, client, file);
      }
      // 默认小文件方式上传
      return this.simpleUpload(signature, client, file);
    } else if (this.isFileSimple(file)) {
      // 判断当前是否为小文件
      return this.simpleUpload(signature, client, file);
    }
    // 默认大文件方式上传
    return this.multipartUpload(signature, client, file);
  }

  // 判断文件是否已经上传过
  hasObject(file: File, path?: string | undefined): Promise<Result | undefined> {
    return Promise.resolve(void 0);
  }

  // 小文件上传
  private async simpleUpload(signature: Signature, client: OSS, file: File): Promise<Result> {
    const meta = getFileMeta(file)
    const options = {
      ...AliOssOption(signature.fileName),
      mime: meta.type,
    };
    try {
      await client.put(signature.path!, file, options);
      const res = new Result(file, signature.url, void 0, Status.complete);
      this.onChange(file, 100, res);
      return res;
    } catch (error) {
      const res = new Result(file, signature.url, void 0, Status.abnormal);
      this.onChange(file, 0, res);
      return res;
    }
  }

  // 大文件上传
  private async multipartUpload(signature: Signature, client: OSS, file: File): Promise<Result> {
    const meta = getFileMeta(file)
    const size = Math.ceil(file.size / 1024 / 1024);
    // 设置分片大小 字节, 默认值为1 MB，最小值为100 KB
    let partSize = this.chunkSize;
    if (size < 100) {
      // 文件大于 100M 则切片为 partSize 大小，小于 100M 则切片为 partSize / 2 大小
      partSize = partSize / 2;
    }
    const options = {
      ...AliOssOption(signature.fileName),
      mime: meta.type,
      partSize,
      checkpoint: void 0,
      parallel: 4, // 设置并发上传的分片数量
      // 获取分片上传进度、断点和返回值。
      progress: (progress: number, checkpoint: Checkpoint) => {
        // console.log(progress, checkpoint);
        const res = new Result(file, signature.url, void 0, Status.progress);
        this.onChange(file, Number((progress * 100).toFixed(0)), res);
      },
    };
    try {
      await client.multipartUpload(signature.path!, file, options);
      const res = new Result(file, signature.url, void 0, Status.complete);
      this.onChange(file, 100, res);
      return res;
    } catch (e) {
      const res = new Result(file, signature.url, void 0, Status.abnormal);
      this.onChange(file, 0, res);
      return res;
    }
  }
}
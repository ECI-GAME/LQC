<script setup lang="ts">
/**
 * @file Home
 * @author svon.me@gmail.com
 */

import {Axios} from "axios";
import * as _ from "lodash-es";
import * as R2Config from "src/config/r2";


import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  UploadPartCommand,
  CreateMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  ListMultipartUploadsCommand,
  ListPartsCommand,
  AbortMultipartUploadCommand
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
  region: R2Config.region,
  endpoint: R2Config.host,
  credentials: {
    accessKeyId: R2Config.accessKey,
    secretAccessKey: R2Config.secretKey,
  },
});


const demo = async function (e: Event) {
  const dom = e.target as unknown as HTMLInputElement;
  const file = dom.files ? dom.files[0] : void 0;
  if (file) {
    // const name = Math.random().toString().slice(2);
    const name = "011217852215955837";
    const command = new PutObjectCommand({
      Bucket: R2Config.Bucket,
      Key: `${name}/${file.name}`,
      ContentType: file.type,
    });
    const url = await getSignedUrl(S3, command, {expiresIn: 60 * 5});
    console.log(url)
    const api = new Axios({
      timeout: 1000 * 60 * 60,
    });
    const res = await api.put(url, file, {
      headers: {
        'Content-Type': file.type
      }
    });
    console.log(res);
  }
}

const getClient = async function (file: File) {
  const name = Math.random().toString().slice(2);
  const key = `${name}/${file.name}`;
  const command = new CreateMultipartUploadCommand({
    Bucket: R2Config.Bucket,
    Key: key,
    ContentType: file.type,
  });
  // 创建临时的切片文件上传空间
  const box = await S3.send(command);
  return {
    url: function (partNumber: number) {
      const part = new UploadPartCommand({
        Bucket: R2Config.Bucket,
        Key: key,
        UploadId: box.UploadId,
        PartNumber: partNumber
      });
      return getSignedUrl(S3, part, {expiresIn: 60 * 5});
    },
    merge: function (parts: object[]) {
      const list = _.sortBy(parts, ["PartNumber"]);
      console.log(list);
      const command = new CompleteMultipartUploadCommand({
        Bucket: R2Config.Bucket,
        Key: key,
        UploadId: box.UploadId,
        MultipartUpload: {Parts: list}
      });
      return S3.send(command);
    }
  }
}

const makeChunks = function (size: number) {
  const list = [];
  const chunkSize = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(size / chunkSize);
  let end = 0;
  for (let i = 0; i < totalChunks; i++) {
    const start = end;
    end = Math.min(start + chunkSize, size);
    list.push({start, end, index: i + 1});
    // if (start + chunkSize < size) {
    //   end = start + chunkSize;
    //   list.push({start, end, index: i + 1});
    // } else {
    //   list[list.length - 1].end = size;
    //   break;
    // }
  }
  console.log("chunks");
  console.log(list)
  console.log(size);
  return list;
}

const demo2 = async function (e: Event) {
  const dom = e.target as unknown as HTMLInputElement;
  const file = dom.files ? dom.files[0] : void 0;
  if (file) {
    const parts = [];
    const api = new Axios({
      timeout: 1000 * 60 * 5,
    });

    console.log(Date.now())

    console.time("upload");

    const chunks = makeChunks(file.size);
    const client = await getClient(file);

    const upload = async function (item: { start: number, end: number, index: number }) {
      const value = file.slice(item.start, item.end);
      const url = await client.url(item.index);
      const res = await api.put(url, value, {
        headers: {'Content-Type': file.type}
      });
      const ETag = String(res.headers.etag);
      return {ETag, PartNumber: String(item.index)};
    }

    for (const list of _.chunk(chunks, 4)) {
      const promises = _.map(list, function (item: { start: number, end: number, index: number }) {
        return upload(item);
      });
      const res = await Promise.all(promises);
      parts.push(...res);
    }

    // for (const item of chunks) {
    //   const res = await upload(item);
    //   console.log(res);
    //   parts.push(res);
    // }

    try {
      const result = await client.merge(parts);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
    console.timeEnd("upload");
    console.log(Date.now())

  }
}

const remove = async function() {
  try {
    // 列出所有正在进行的分段上传
    const listCommand = new ListMultipartUploadsCommand({ Bucket: R2Config.Bucket });
    const listResponse = await S3.send(listCommand);

    console.log(listResponse)

    if (listResponse.Uploads && listResponse.Uploads.length > 0) {
      for (const upload of listResponse.Uploads) {
        // 获取每个正在进行的分段上传的 UploadId 和 Key
        const uploadId = upload.UploadId!;
        const key = upload.Key!;

        // 列出正在进行的分段上传的所有部分
        const listPartsCommand = new ListPartsCommand({ Bucket: R2Config.Bucket, Key: key, UploadId: uploadId });
        const listPartsResponse = await S3.send(listPartsCommand);

        // 取消分段上传
        const abortCommand = new AbortMultipartUploadCommand({ Bucket: R2Config.Bucket, Key: key, UploadId: uploadId });
        await S3.send(abortCommand);

        console.log(`Aborted multipart upload: ${uploadId} for key: ${key}`);
      }
    } else {
      console.log("No ongoing multipart uploads found.");
    }
  } catch (err) {
    console.error("Error aborting multipart uploads:", err);
  }
}


</script>
<template>
  <div class="w-full h-full flex justify-center items-center">
    <!--    <input type="file" @change="demo"/>-->
    <button @click="remove">删除</button>
  </div>
</template>



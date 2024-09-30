// @ts-ignore
import OSS from "ali-oss";
// @ts-ignore
import {Signature} from "./sign";

export const AliOssOption = function (fileName?: string) {
  const headers = {
    // 指定该Object被下载时的网页缓存行为。
    "Cache-Control": "no-cache",
    // 指定该Object被下载时的名称。
    "Content-Disposition": fileName ? `attachment; filename="${encodeURIComponent(decodeURIComponent(fileName))}"` : "attachment",
    // 指定该Object被下载时的内容编码格式。
    "Content-Encoding": "utf-8",
    // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
    "x-oss-forbid-overwrite": "true",
  };
  return {headers, timeout: 1000 * 30};
}

export const getAliOssClient = function (signature?: Signature): OSS | undefined {
  if (signature) {
    return new OSS({
      // 启用加密
      secure: true,
      // 启用自定义加速域名
      cname: !!signature.host,
      // 修正上传接口域名, 只保留域名部分
      endpoint: signature.host ? signature.host.replace(/^(https?:)?\/\//, "") : void 0,
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: signature.region,
      // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）
      accessKeyId: signature.accessId,
      accessKeySecret: signature.accessKey,
      // 从STS服务获取的安全令牌（SecurityToken）
      stsToken: signature.securityToken,
      // 填写Bucket名称
      bucket: signature.containerName,
    });
  }
}
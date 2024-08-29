import * as _ from "../index";

export const getFileMeta = function (file: File) {
  const name: string = encodeURIComponent(file.name);
  return {
    // 文件基础信息
    // Key Value 均为 String 类型
    name,                 // 名称
    size: String(file.size),                 // 大小
    type: String(file.type),                 // 类型
    lastmodified: String(file.lastModified), // 最后修改时间
  }
}

export const fileMd5 = function (file: File): string {
  const meta = getFileMeta(file);
  const value = _.UUIDV5(meta.name, meta.size, meta.type, meta.lastmodified);
  return value ? value : _.UUID();
}

export const filePath = function (file: File): string {
  const md5: string = fileMd5(file);
  const name: string = _.MD5(file.name);
  const index: number = file.name.lastIndexOf(".");
  const suffix: string = file.name.slice(index + 1);
  return `${md5}/${name}.${suffix}`;
}
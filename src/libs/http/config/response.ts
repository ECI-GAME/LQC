/**
 * @file API 响应结果校验
 * @author svon.me@gmail.com
 */

export class APIConfig {
  dataName: string | string[] = "data"; // 接口数据对应的属性名称
  success: string | number | Array<string | number> = [200]; // 接口成功状态码
  codeName: string | string[] = ["code", "scode"]; // 状态码属性名称
  statusName: string | string[] = "status"; // 状态枚举属性名称
}

function isNil(value: any): boolean {
  return value == null;
}

function safeGet<T>(data: any, key: string): T | undefined {
  if (data && typeof data === "object") {
    return data[key] as T;
  }
}

const getResult = function <T, D>(response: D): T | undefined {
  let result = safeGet<T>(response as object, "data") ;
  if (response && result) {
    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch (e) {
        // todo
      }
    }
    const message = safeGet<string>(result, "msg");
    if (message) {
      // @ts-ignore
      delete result["msg"];
      return {message, ...result} as T;
    }
    return result;
  }
  return response as any;
};

// 判断状态码
export const check = function <T, D>(API: APIConfig, response: D): T | boolean | undefined | object {
  const result = getResult<T, D>(response);
  const getValue = function (data: object) {
    let tmp: object | boolean | undefined;
    // @ts-ignore
    for (const key of [].concat(API.dataName)) {
      if (data.hasOwnProperty(key)) {
        const value = safeGet<object>(result, key);
        tmp = isNil(value) ? true : value;
        break;
      }
    }
    return tmp || data;
  }

  if (result && typeof result === "object") {
    // 获取 code 值
    let scode: string | number | undefined = "";
    if (Array.isArray(API.codeName)) {
      for (const key of API.codeName) {
        if (result.hasOwnProperty(key)) {
          scode = safeGet<string | number>(result, key);
          break;
        }
      }
    } else {
      scode = safeGet<string>(result, API.codeName) || "";
    }
    let flag: boolean = false;
    // @ts-ignore
    for (const value of [].concat(API.success)) {
      if (String(scode) === String(value)) {
        flag = true;
        break;
      }
    }
    if (flag) {
      return getValue(result);
    }
    // 判断状态
    // @ts-ignore
    for (const key of [].concat(API.statusName)) {
      if (result.hasOwnProperty(key)) {
        flag = safeGet<boolean>(result, key) || false;
        break;
      }
    }
    if (flag) {
      return getValue(result);
    }
    // 如果状态码存在
    if (scode && /\d+/.test(String(scode))) {
      // 向外抛出异常
      throw result;
    }
    if ("data" in result) {
      return safeGet(result, "data");
    }
  }
  return result;
};

export const asyncCheck = async function <T, D>(API: APIConfig, result: D | Promise<D>) {
  const value: D = await result;
  return check<T, D>(API, value);
};
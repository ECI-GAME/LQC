/**
 * @file 处理路径的常用方法
 * @author svon.me@gmail.com
 **/

const isHttp = function (path: string): boolean {
  return path ? /^https?/i.test(path) : false;
};

export const isAbsolute = function (path: string): boolean {
  return path.charAt(0) === '/';
};


function normalizeArray(paths: string[]) {
  const res: string[] = [];
  for (const value of paths) {
    // 过滤空数据
    if (!value || value === ".") {
      continue;
    }
    if (value === "..") {
      if (res.length > 0 && res[res.length - 1] !== "..") {
        res.pop();
      }
    } else if (isHttp(value)) {
      res.push(`${value}//`);
    } else {
      res.push(value);
    }
  }
  return res;
}

export const normalize = function (path: string): string {
  // 判断是否为 / 开头
  const isabsolute = isAbsolute(path);
  // 判断是否为 http 链接
  const ishttp = isHttp(path);
  // 判断末尾是否以 / 结束
  const trailingSlash = path && path[path.length - 1] === '/';
  let value = normalizeArray(path.split("/")).join("/");
  if (!value) {
    return ".";
  }
  if (value && trailingSlash) {
    value += "/";
  }
  if (ishttp) {
    return value.replace(/\/{2,}/g, "//");
  }
  if (isabsolute) {
    value = `/${value}`;
  }
  return value;
}


export const join = function (...args: string[]): string {
  return normalize(args.join("/"))
}
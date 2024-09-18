/**
 * 处理账号权限
 * @param 请求对象
 * @returns
 */

const get = function (name: string): string {
  const value = document.cookie;
  const reg = new RegExp(`${name}=(\\S+)`, "i");
  const data = value.match(reg) || [];
  const text = Array.isArray(data) ? data[1] : null;
  if (text) {
    const v = text.trimEnd().replace(/\;?$/i, "");
    return v.trim();
  }
  return "";
}

const Authorization = function (cookieName: string, tokenKey: string) {
  let value = cookieName ? get(cookieName) : void 0;
  if (value && tokenKey) {
    return {
      [tokenKey]: `Bearer ${value}`
    };
  }
}

export default Authorization;
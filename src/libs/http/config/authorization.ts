/**
 * 处理账号权限
 * @param 请求对象
 * @returns 
 */

const get = function(name: string): string {
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

const Authorization = function(cookieName: string, tokenKey?: string) {
  let value = get(cookieName);
  const headers = {};
  if (value) {
    const key = tokenKey || "token";
    Object.assign(headers, { [key]: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaWQiOiIwMDAwMHJhMnp4bTUwc3BjNnEzMXdqOW9iZ2Z5NzRuZCIsInVzZXJfbmFtZSI6InJvb3QiLCJ0eiI6Ik1hcnF1ZXNhcyBTdGFuZGFyZCBUaW1lIiwicGlkIjotMSwib2lkIjotMSwib2xkaWQiOm51bGwsImNsaWVudF9pZCI6ImxxYV9nYW1lIiwiYXR0YWNocyI6IiIsImVuYW1lIjoiTFFBIiwiaHBpZCI6bnVsbCwiYXR5cGUiOiIxIiwic2NvcGUiOlsiYWxsIl0sImRuYW1lIjoiRUNJW-i2heeuoV0iLCJleHAiOjE3MjMwMTM4OTYsInF5d3giOm51bGwsImFpZCI6IjAwMDAwMDA1eHY2ZTkwb3RkbjdobWYyYjR1c3pqcGljIiwianRpIjoiOWYyNzFkMmYtNTYyOS00OTg2LWExOTQtMjEzZjBjMTFkNzA2IiwiZGlkIjotMX0.gUzAMkSXxQgjSHpCivyEDhkfSg-G0bJQhfLWNTFfpci9X2S5bHH4NPTek_TkksGsRFLtaU55Ue61PIsABAE0ZfYy_5p5mKwlbODCL6WvIwBZzY4b-ph-yCB4pFleOdVzw51EoYesgAk-90w5GPc56eb3VhhF6at6Hp0PX_AFrV7i8_HQ5JG6Qbz0-ozSqKihJNQovyUcJw3XH5anrTXV_qctq3zYHR_TEMrMs0lC2bfXGqT9q735a-8w8q8ZyMTwro6vUM9u_wETbsvVO-B0A1doxsuaVmeMbfovYwiSh5LObaPfe9X0WUsk4U9ZtCYL3VjUn07KNUv9ot2Cec9CAQ` });
  }
  return headers;
}

export default Authorization;
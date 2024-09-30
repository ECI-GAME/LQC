/**
 * @file 时间公共方法
 * @author svon.me@gmail.com
 */

import moment from "moment";
import * as _ from "lodash-es";

export const formatYYMMDD = "YY-MM-DD";
export const formatYYMMDDhhmmss = "YY-MM-DD HH:mm:ss";

export const formatYYYYMMDD = "YYYY-MM-DD";
export const format = "YYYY-MM-DD HH:mm:ss";

export const formatZone = "YYYY-MM-DDTHH:mm:ss.SSSZ";

// 当前时间（毫秒）
export const now = () => Date.now();

// 日期类型转换
export const toDate = function (value: string | number | Date): moment.Moment {
  if (_.isString(value)) {
    if (_.includes(value, "T") || _.includes(value, "+")) {
      return moment(value, formatZone);
    }
    if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
      return moment(value, formatYYMMDD);
    }
    if (/^\d{2}-\d{2}-\d{2}\s+\d{2}-\d{2}-\d{2}$/.test(value)) {
      return moment(value, formatYYMMDDhhmmss);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return moment(value, formatYYYYMMDD);
    }
    return moment(value, format);
  }
  if (_.isNumber(value)) {
    const len = String(value).length;
    if (len < 13) {
      const tmp = new Array(13 - len).fill("0").join("");
      const time = Number(`${value}${tmp}`);
      return toDate(time);
    }
    return toDate(new Date(value));
  }
  return moment(value);
}

// 日期格式化方法
export const template = function (value?: string | number | Date, formatValue?: string): string {
  const date = toDate(value || now());
  return date.format(formatValue || format);
}
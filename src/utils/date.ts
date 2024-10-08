/**
 * @file 时间公共方法
 * @author svon.me@gmail.com
 */

import dayjs from "dayjs";
import moment from "moment";
import * as _ from "lodash-es";

export const formatYYMMDD = "YY-MM-DD";
export const formatYYMMDDhhmmss = "YY-MM-DD HH:mm:ss";

export const formatYYYYMMDD = "YYYY-MM-DD";
export const format = "YYYY-MM-DD HH:mm:ss";

export const formatZone = "YYYY-MM-DDTHH:mm:ss.SSSZ";

// 当前时间（毫秒）
export const now = () => Date.now();

type DateType = string | number | Date | moment.Moment;

const transformFormat = function (date: string, format: string): string {
  if (_.includes(date, "/")) {
    return format.replace(/-/g, "/");
  }
  return format;
}

// 日期类型转换
export const toDate = function (value: DateType, formatSpec?: string): moment.Moment {
  if (formatSpec) {
    const format = _.isString(value) ? transformFormat(value, formatSpec) : formatSpec;
    return moment(value, format);
  }
  if (_.isString(value)) {
    if (_.includes(value, "T") || _.includes(value, "+")) {
      return toDate(value, formatZone);
    }
    if (/^\d{2}[-/]\d{2}[-/]\d{2}$/.test(value)) {
      return toDate(value, formatYYMMDD);
    }
    if (/^\d{2}[-/]\d{2}[-/]\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(value)) {
      return toDate(value, formatYYMMDDhhmmss);
    }
    if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(value)) {
      return toDate(value, formatYYYYMMDD);
    }
    return toDate(value, format);
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
  if (dayjs.isDayjs(value)) {
    return toDate(value.valueOf());
  }
  return moment(value);
}

// 判断第一个时间是否为第二个时间的之前时间
export const isBefore = function (time1: DateType, time2: DateType, unit?: string) {
  const value = toDate(time2);
  return toDate(time1).isBefore(value, unit as any);
}

// 判断第一个时间是否为第二个时间的之前时间
export const isAfter = function (time1: DateType, time2: DateType, unit?: string) {
  const value = toDate(time2);
  return toDate(time1).isAfter(value, unit as any);
}

// 日期格式化方法
export const template = function (value?: DateType, formatValue?: string): string {
  const date = toDate(value || now());
  return date.format(formatValue || format);
}

// 判断当前时间是否是目标时间之前, 如果条件成立则返回 true
export const disabledBefore = function (current: DateType, value: DateType): boolean {
  const status = isBefore(current, value, "day");
  return !status;
}
// 判断当前时间是否是目标时间之后, 如果条件成立则返回 true
export const disabledAfter = function (current: DateType, value: DateType): boolean {
  const status = isAfter(current, value, "day");
  return !status;
}

// 判断当前时间是否在两个之间，如果条件成立返回 true, 反之返回 false
// 如果开始时间与结束时间都为空时默认返回 true
export const allow = function (current: DateType, before?: DateType, after?: DateType): boolean {
  if (before && after) {
    const status1 = disabledBefore(current, before);
    const status2 = disabledAfter(current, after);
    return status1 && status2;
  }
  if (before) {
    return disabledBefore(current, before);
  }
  if (after) {
    return disabledAfter(current, after);
  }
  return true;
}
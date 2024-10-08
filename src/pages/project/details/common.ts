/**
 * @file 画册管理
 * @author svon.me@gmail.com
 **/

import api from "src/api";
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import * as date from "src/utils/date";
import * as model from "src/utils/model";
import ImageAlbumView from "src/pages/project/image/album.vue";

import type {Component} from "vue";
import type {TimePlan} from "../image/config";
import type {Project, ImageAlbum} from "src/types";


export const albumColumns = [
  {title: "画册名称", dataIndex: 'versionName', key: 'versionName'},
  {title: "语言对", dataIndex: 'languagePair', key: 'languagePair', align: "center"},
  {title: "状态", dataIndex: 'versionStatus', key: 'status', align: "center"},
  {title: "时间区域", dataIndex: 'dateInterval', key: 'dateInterval', align: "center"},
  {title: "画册进度", dataIndex: 'doneCnt', key: 'doneCnt', align: "center"},
  {title: "操作", dataIndex: 'id', key: 'action', align: "center"},
];

/**
 * @file 画册创建
 * @author svon.me@gmail.com
 */
const onCreateImage = function (value: ImageAlbum, timePlan?: TimePlan) {
  const onOk = function (data: ImageAlbum) {
    if (data) {
      return api.version.addVersion(data);
    }
    return false;
  }
  const config = {title: "新建画册", width: 480, onOk};
  return modal.confirm<Component, boolean>(ImageAlbumView, config, {value, timePlan});
}

/**
 * @file 画册编辑
 * @author svon.me@gmail.com
 */
const onEditImage = function (value: ImageAlbum, timePlan?: TimePlan) {
  const onOk = function (data: ImageAlbum) {
    if (data) {
      const res = {
        ...data,
        id: value.id,
        // 数据兼容
        startDate: `${data.startDate} 00:00:00`,
        endDate: `${data.endDate} 23:59:59`,
      };
      return api.version.updateVersion(res)
    }
    return false;
  }
  const config = {title: "编辑画册", width: 480, onOk};
  return modal.confirm<Component, boolean>(ImageAlbumView, config, {value, timePlan});
}

// 相册管理
export const useImageAlbum = function (projectId: number | string) {
  // 项目详情
  const {state, isReady} = model.result<Project>(() => {
    return api.project.getProjectInfoById(projectId);
  }, {} as Project, true);

  // 创建
  const create = function (): Promise<boolean> {
    const languagePair = state.value.sourceLanguage + '->' + state.value.targetLanguage;
    return onCreateImage({
        projectNum: state.value.projectNum,
        languagePair
      } as ImageAlbum,
      {
        min: state.value.planStartTime, // 最小时间
        max: state.value.planEndTime,   // 最大时间
      }
    );
  };

  // 编辑
  const edit = async function (value: ImageAlbum): Promise<boolean> {
    const languagePair = state.value.sourceLanguage + '->' + state.value.targetLanguage;
    const res = await api.version.geVersionInfoById<ImageAlbum>(value.id);
    const timePlan = {
      min: state.value.planStartTime, // 最小时间
      max: state.value.planEndTime,   // 最大时间
    };
    if (res) {
      res.startDate = res.startDate ? date.template(res.startDate, date.formatYYYYMMDD) : "";
      res.endDate = res.endDate ? date.template(res.endDate, date.formatYYYYMMDD) : "";
      return onEditImage({...res, languagePair}, timePlan);
    } else {
      const dateList = String(value.dateInterval || "").split("-");
      const [startDate, endDate] = _.map(dateList, function (value: string) {
        if (value) {
          return date.toDate(value, date.formatYYMMDD).format(date.formatYYYYMMDD);
        }
        return "";
      });
      return onEditImage({...value, startDate, endDate, languagePair}, timePlan);
    }
  }
  return {state, isReady, create, edit};
}



/**
 * @file 画册管理
 * @author svon.me@gmail.com
 **/

import api from "src/api";
import moment from "moment";
import * as _ from "lodash-es";
import * as modal from "@ue/modal";
import * as model from "src/utils/model";
import ImageAlbumView from "src/pages/project/image/album.vue";

import type {Component} from "vue";
import type {Project, ImageAlbum} from "src/types";

const dateFormat: string = "YYYY-MM-DD";

/**
 * @file 画册创建
 * @author svon.me@gmail.com
 */
const onCreateImage = function (value: ImageAlbum) {
  const onOk = function (data: ImageAlbum) {
    if (data) {
      return api.version.addVersion(data);
    }
    return false;
  }
  return modal.confirm<Component, boolean>(ImageAlbumView, {title: "新建画册", width: 480, onOk}, {value});
}

/**
 * @file 画册编辑
 * @author svon.me@gmail.com
 */
const onEditImage = function (value: ImageAlbum) {
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
  return modal.confirm<Component, boolean>(ImageAlbumView, {title: "编辑画册", width: 480, onOk}, {value});
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
    return onCreateImage({projectNum: state.value.projectNum, languagePair} as ImageAlbum);
  };

  // 编辑
  const edit = async function (value: ImageAlbum): Promise<boolean> {
    const res = await api.version.geVersionInfoById<ImageAlbum>(value.id);
    if (res) {
      res.startDate = res.startDate ? moment(res.startDate).format(dateFormat) : "";
      res.endDate = res.endDate ? moment(res.endDate).format(dateFormat) : "";
      return onEditImage({...res});
    } else {
      const dateList = String(value.dateInterval || "").split("-");
      const [startDate, endDate] = _.map(dateList, function (value: string) {
        if (value) {
          return moment(value, "YY/MM/DD").format(dateFormat);
        }
        return "";
      });
      return onEditImage({...value, startDate, endDate});
    }
  }
  return {state, isReady, create, edit};
}



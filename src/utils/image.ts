import URL from "url";
import * as _ from "lodash-es";

/**
 * @param base64   Base64
 * @param mimeType 图片类型
 * @param  name    图片名称
 * @description 将 base64 转换为图片并进行上传
 */
export const base64ToImage = function (base64: string, mimeType = "image/png", name?: string) {
  const splitIndex = base64.indexOf(",");
  const byteString = atob(base64.slice(splitIndex + 1));     // base64 内容

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], {type: mimeType});
  if (!name) {
    const types: string[] = mimeType.split("/");
    name = `${Date.now()}_image.${_.last(types)}`;
  }
  return new File([blob], name, {type: mimeType});
}
/**
 * @param canvas   Base64
 * @param mimeType 图片类型
 * @param quality  图片质量
 * @description 将 Canvas 转换为 Base64
 */
export const canvasToBase64 = function (canvas: HTMLCanvasElement, mimeType = "image/png", quality = 1) {
  return canvas.toDataURL(mimeType, quality);
}

/**
 * @param canvas   Base64
 * @param mimeType 图片类型
 * @param quality  图片质量
 * @param name    图片名称
 * @description 将 Canvas 转换为图片
 */
export const canvasToImage = function (canvas: HTMLCanvasElement, mimeType = "image/png", quality = 1, name: string = "image") {
  const value = canvasToBase64(canvas, mimeType, quality);
  if (value) {
    return base64ToImage(value, mimeType, name);
  }
}

// 获取图片名称
export const basename = function (src?: string): string | undefined {
  if (src) {
    const url = URL.parse(src, true);
    if (url.search) {
      const params = new URLSearchParams(url.search);
      const value = params.get("filename")
      if (value) {
        return value;
      }
    }
    const list = (url.pathname || "").split("/");
    const name = list[list.length - 1];
    if (name) {
      return name;
    }
  }
}
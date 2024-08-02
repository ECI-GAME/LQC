/**
 * @file ORC 工具
 * @author svon.me@gmail.com
 */

import * as image from "./image";

export default class Cropper {
  public image: HTMLImageElement | string;

  constructor(image: HTMLImageElement | string) {
    this.image = image;
  }

  private getImage(): Promise<HTMLImageElement> {
    if (typeof this.image === "string") {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
          resolve(img);
        }
        img.onerror = function (e) {
          reject(e);
        }
        img.src = this.image as string;
      });
    } else {
      // this.image.crossOrigin = "Anonymous";
      return Promise.resolve(this.image);
    }
  }

  cutXY(x1: number, y1: number, x2: number, y2: number) {
    return this.cut(x1, y1, x2 - x1, y2 - y1);
  }

  async cut(x1: number, y1: number, width: number, height: number): Promise<string | undefined> {
    try {
      const img = await this.getImage();

      const originalCanvas = document.createElement("canvas");
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = width;
      croppedCanvas.height = height;
      originalCanvas.width = img.width;
      originalCanvas.height = img.height;

      const originalCtx = originalCanvas.getContext('2d');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (originalCtx) {
        originalCtx.drawImage(img, 0, 0);
      }
      if (croppedCtx) {
        croppedCtx.drawImage(
          originalCanvas,
          x1, y1, width, height, // 裁剪区域
          0, 0, width, height // 绘制到裁剪Canvas的位置和大小
        );
        return image.canvasToBase64(croppedCanvas);
      }
    } catch (e) {
      return Promise.reject(e);
    }
    return void 0;
  }
}
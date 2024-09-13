import {ElLoading} from "element-plus";

const loading = function (timeout: number = 300) {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const app = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      // 展示 Loading 效果
      const view = ElLoading.service({lock: true, text: 'Loading'});
      try {
        // 执行原逻辑
        return await app.apply(self, args);
      } catch (e) {
        return Promise.reject(e);
      }
      finally {
        setTimeout(() => {
          view.close();
        }, timeout);
      }
    }
  };
}
export default loading;
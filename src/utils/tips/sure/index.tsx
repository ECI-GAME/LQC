import {h} from "vue";
import {Icon} from "@ue/icon";
import * as modal from "@ue/modal";

export default function (message: string) {
  const value: any = h(Icon, {type: "warning-circle"});
  const html = (<div className="flex items-center pb-5">
    <div className="text-2xl text-[#faad14]">{value}</div>
    <div className="ml-3 flex-1 w-20 truncate">{message}</div>
  </div>);
  return modal.sure(html, {title: "提示", okText: "确认" });
}
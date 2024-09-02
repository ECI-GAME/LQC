import View from "./view.vue";
import Menu from "./menu/index.vue";
import Content from "./content.vue";
import {useRoute} from "vue-router";
import * as alias from "src/router/alias";
import {defineComponent, ref, h} from "vue";

type ChangeMenu = (off: boolean) => void;

const fullPage = function (status: boolean, change: ChangeMenu) {
  return (<Content status={status} change={change}></Content>);
}

const autoPage = function (status: boolean, change: ChangeMenu) {
  return [
    <div className="float-left h-full w-[var(--layout-menu-width)]">
      <Menu class="h-full w-full" status={status}></Menu>
    </div>,
    fullPage(status, change),
  ];
}


const MenuWidth = {
  on: 260,
  off: 50,
}

export default defineComponent({
  name: "Layout",
  setup: function () {
    const route = useRoute();
    const menuWidth = ref(MenuWidth.on);
    const menuOff = ref<boolean>(false);
    const onChangeMenuWidth = function (off: boolean) {
      if (menuOff.value !== off) {
        menuOff.value = off;
        if (off) {
          menuWidth.value = MenuWidth.off;
        } else {
          menuWidth.value = MenuWidth.on;
        }
      }
    }
    return () => {
      let style: any;
      let value;
      if (route.name === alias.NotFount.name) {
        style = `--layout-menu-width: 0px`;
        value = [fullPage(menuOff.value, onChangeMenuWidth)];
      } else {
        style = `--layout-menu-width: ${menuWidth.value}px`;
        value = autoPage(menuOff.value, onChangeMenuWidth);
      }
      return (<View style={style}>
        {value}
      </View>);
    }
  }
});
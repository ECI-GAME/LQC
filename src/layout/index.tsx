import View from "./view.vue";
import Menu from "./menu/index.vue";
import Content from "./content.vue";
import {useRoute} from "vue-router";
import * as alias from "src/router/alias";
import {defineComponent, ref, h} from "vue";

const fullPage = function () {
  return (<Content></Content>);
}

const autoPage = function () {
  return [
    <div className="float-left h-full w-[var(--layout-menu-width)]">
      <Menu class="h-full w-full"></Menu>
    </div>,
    fullPage(),
  ];
}

export default defineComponent({
  name: "Layout",
  setup: function () {
    const route = useRoute();
    const menuWidth = ref(260);
    return () => {
      let style: any;
      let value;
      if (route.name === alias.NotFount.name) {
        style = `--layout-menu-width: 0px`;
        value = [fullPage()];
      } else {
        style = `--layout-menu-width: ${menuWidth.value}px`;
        value = autoPage();
      }
      return (<View style={style}>
        {value}
      </View>);
    }
  }
});
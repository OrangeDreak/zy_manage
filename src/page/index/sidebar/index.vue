<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height: 100%">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">
        {{ $t("menuTip") }}
      </div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {};
  },
  created() {
    // this.$store.dispatch("GetMenu").then((data) => {
    //   if (data.length === 0) return;
    //   this.$router.$avueRouter.formatRoutes(data, true);
    // });
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      let index = "";
      if (this.$route.meta.parentPath) {
        index = this.$route.meta.parentPath;
      } else {
        index = this.$router.$avueRouter.getValue(this.$route);
      }
      return index;
    },
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>

<template>
  <basic-container>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
      </el-tab-pane>
    </el-tabs>
    <Screen v-if="activeName === 'screen'" />
    <Home v-if="activeName === 'home'" />
  </basic-container>
</template>

<script>
import Home from "./app/home/index.vue";
import Screen from "./app/screen/index.vue";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      tabs: [
        {
          label: "开屏",
          value: "screen",
        },
        {
          label: "首页",
          value: "home",
        },
      ],
      activeName: "screen",
    };
  },
  components: {
    Home,
    Screen,
  },
  created() {
    this.getAreaList();
  },
  methods: {
    ...mapActions(["getAreaList"]),
  },
};
</script>

<style>
</style>

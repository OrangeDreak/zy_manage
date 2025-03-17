<template>
  <!-- <basic-container> -->
  <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
    <el-tab-pane
      v-for="item in tabs"
      :label="item.label"
      :key="item.value"
      :name="item.value"
    >
      <component :is="activeName" :ref="activeName"></component>
    </el-tab-pane>
  </el-tabs>
  <!-- </basic-container> -->
</template>

<script>
import banner from "./banner.vue";
export default {
  data() {
    return {
      activeName: "banner",
      tabs: [
        {
          label: "banner",
          value: "banner",
        },
      ],
    };
  },
  components: {
    banner,
  },
  methods: {
    tabChange() {
      console.log("执行");
      this.$refs[this.activeName].closeDialog();
    },
  },
};
</script>

<style>
</style>

<template>
  <div class="basic-container">
    <el-card shadow="never">
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "basicContainer",
};
</script>

<style lang="scss">
.basic-container {
  padding: 10px 6px 50px;
  border-radius: 10px;
  box-sizing: border-box;
  .el-card {
    width: 100%;
  }
  &:first-child {
    padding-top: 0;
  }
}
</style>

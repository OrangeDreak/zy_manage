<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="addDialogColse"
    class="dialog"
  >
    <div class="overText">确定要结束当前会话吗？</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()" size="small">取消</el-button>
      <el-button record type="primary" @click="submit()" size="small"
        >确定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      title: "会话信息",
    };
  },
  methods: {
    open(data) {
      this.visible = true;
    },
    dialogClose() {
      this.visible = false;
    },
    submit() {
      console.log("提交");
      this.$emit("overFun");
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  .cleanBtn {
    border: none;
    background-color: transparent;
  }

  .overText {
    font-size: 16px;
  }
}
</style>

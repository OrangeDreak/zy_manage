<template>
  <div>
    <el-popover v-model="visible" :placement="placement" trigger="click" @show="popoverShow">
      <template>
        <!-- <div v-if="show" class="remark">
          备注：{{ remark }}
          <div v-if="remark">
            <el-button
              style="padding: 0"
              type="text"
              size="small"
              @click="show = false"
            >
              <template #icon><i class="el-icon-edit"></i></template>
              编辑
            </el-button>
          </div>
          <el-button
            v-else
            style="padding: 0"
            type="text"
            size="small"
            @click="show = false"
          >
            <template #icon><i class="el-icon-edit"></i></template>
            编辑
          </el-button>
        </div> -->

        <div class="edit-con">
          <el-input
            v-model="remark"
            type="textarea"
            :rows="4"
            autofocus
            resize="none"
            placeholder="请输入备注"
          />
          <div class="btns">
            <el-button shape="round" size="small" @click="visible = false">取消</el-button>
            <el-button
              type="primary"
              size="small"
              shape="round"
              :loading="loading"
              @click="handleOk"
              >提交</el-button
            >
          </div>
        </div>
      </template>
      <el-button slot="reference" size="medium" type="text">备注</el-button>
    </el-popover>
  </div>
</template>

<script>
import { setRemark } from "@/api/order";
export default {
  props: {
    rowData: {
      type: Object,
      require: true,
      default() {
        return {};
      },
    },
    placement: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      remark: "",
      visible: false,
      loading: false,
    };
  },
  methods: {
    handleOk() {
      this.loading = true;
      setRemark({
        orderId: this.rowData.orderId,
        remark: this.remark,
      })
        .then(() => {
          this.$emit("handleOk", this.remark);
          this.$message.success("备注编辑成功");
          this.visible = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    popoverShow() {
      this.remark = this.rowData.remark;
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-con {
  padding: 5px;
  // :deep(input.ant-input) {
  //   resize: none;
  //   height: 100px;
  //   width: 200px;
  // }
  .remark {
    font-size: 12px;
    color: #999;
    // :deep(.ant-btn-sm) {
    //   padding: 0;
    // }
  }
  .btns {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    button {
      font-size: 12px;
      margin-left: 10px;
    }
  }
}
</style>

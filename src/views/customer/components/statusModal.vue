<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="变更状态"
    @close="close"
  >
    <el-form ref="stateForm" :model="stateForm" label-width="100px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item
        label="变更状态"
        :rules="[{ required: true, message: '变更状态不能为空' }]"
        prop="workStatus"
      >
        <el-select
          v-model="stateForm.workStatus"
          filterable
          allow-create
          placeholder="请选择订单状态"
          style="width: 100%"
        >
          <el-option
            v-for="item in statusList"
            :key="item"
            :label="item.label"
            :disabled="item.value == currStatus"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateStatus } from "@/api/customer/refund";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      currStatus: "",
      stateForm: {
        id: "",
        workStatus: "",
      },
      statusList: [
        {
          label: "售后客服-待处理",
          value: "0",
        },
        {
          label: "待商家审核",
          value: "1",
        },
        {
          label: "商家审核通过",
          value: "2",
        },
        {
          label: "商家审核拒绝",
          value: "3",
        },
        {
          label: "待商家收货退款",
          value: "4",
        },
        {
          label: "客服待审核",
          value: "5",
        },
      ],
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.stateForm.id = data.id;
      this.currStatus = data.status;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.stateForm.resetFields();
      });
    },
    onSubmit() {
      this.$refs.stateForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          this.handleSubmit();
        }
      });
    },
    handleSubmit() {
      updateStatus({
        id: this.stateForm.id,
        workStatus: this.stateForm.workStatus,
      })
        .then(() => {
          this.$message.success("操作成功");
          this.visible = false;
          this.$emit("finish");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  display: flex;
  align-items: center;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    width: 0;
    font-size: 12px;
    color: #666;
    margin-left: 10px;
    .title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #000;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }
}
.remark {
}
.logistics {
  font-size: 12px;
  color: #333;
  word-break: break-word;
  margin-bottom: 5px;
  span {
    color: #183fcd;
    font-weight: 500;
  }
  margin-top: 10px;
}
</style>

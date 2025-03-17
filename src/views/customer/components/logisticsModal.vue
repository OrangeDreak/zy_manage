<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="填写物流信息"
    @close="close"
  >
    <el-form ref="logisticsForm" :model="logisticsForm" label-width="80px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item
        label="物流类型"
        :rules="[{ required: true, message: '请选择物流类型' }]"
        prop="type"
      >
        <el-select
          v-model="logisticsForm.type"
          style="width: 100%"
          size="small"
          placeholder="请选择物流类型"
        >
          <el-option
            v-for="item in list"
            :key="item.logisticsType"
            :label="item.logisticsName"
            :value="item.logisticsType"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="物流单号"
        :rules="[{ required: true, message: '请输入物流单号' }]"
        prop="number"
      >
        <el-input
          v-model="logisticsForm.number"
          size="small"
          placeholder="请输入物流单号"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="cancelSureOrder"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import {
  saveLogistics,
  getLogisticsList,
  getLogisticsDetail,
} from "@/api/customer/refund";
export default {
  // props: {
  //   list: {
  //     type: Array,
  //     require: true,
  //     default: () => [],
  //   },
  // },
  data() {
    return {
      visible: false,
      loading: false,
      list: [],
      submitType: "",
      logisticsForm: { id: "", type: "", number: "" },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.logisticsForm.id = data.id;
      this.logisticsForm.type = data.type;
      this.logisticsForm.number = data.number;
      // getLogisticsDetail({ id: data.id }).then((res) => {
      //   const data2 = res.data.data;
      //   this.logisticsForm.type = data2.logisticsType || undefined;
      //   this.logisticsForm.number = data2.logisticsNumber || undefined;
      //   if (this.logisticsForm.number) {
      //     this.submitType = "edit";
      //   } else {
      //     this.submitType = "add";
      //   }
      // });
      if (this.logisticsForm.number) {
        this.submitType = "edit";
      } else {
        this.submitType = "add";
      }
    },
    close() {
      this.$nextTick(() => {
        this.$refs.logisticsForm.resetFields();
      });
    },
    cancelSureOrder() {
      this.$refs.logisticsForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          saveLogistics({
            id: this.logisticsForm.id,
            logisticsType: this.logisticsForm.type,
            logisticsNumber: this.logisticsForm.number,
          }).then(() => {
            const text = this.submitType === "edit" ? "变更" : "添加";
            this.$message.success(text + "成功");
            this.visible = false;
            this.loading = false;
            this.$emit("finish");
          });
        }
      });
    },
  },
  created() {
    getLogisticsList().then((res) => {
      this.list = res.data.data || [];
    });
  },
};
</script>

<style lang="scss" scoped>
.tips {
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
  color: #f56c6c;
}
</style>

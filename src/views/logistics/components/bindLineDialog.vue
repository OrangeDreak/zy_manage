<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="title"
    @close="close"
  >
    <el-form ref="refOrderForm" :model="orderForm" label-width="100px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item
        label="干线ID："
        prop="outLineId"
        :rules="[{ required: true, message: '请输入干线ID', trigger: 'blur' }]"
      >
        <el-input
          v-model="orderForm.outLineId"
          style="width: 100%"
          size="small"
          placeholder="请输入干线ID"
        >
        </el-input>
      </el-form-item>
      <!-- <el-form-item
        label="运输方式："
        prop="transportationMethod"
        :rules="[{ required: true, message: '请选择运输方式', trigger: 'change' }]"
      >
        <el-select
          v-model="orderForm.transportationMethod"
          placeholder="请选择运输方式"
          style="width: 100%"
        >
          <el-option
            v-for="item in transferMethodList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bindOutLine } from "@/api/logistics/logistics";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      title: "",
      orderForm: {
        id: "",
        outLineId: "",
        // transportationMethod: undefined,
      },
      transferMethodList: [
        {
          label: "Air Transport",
          value: "air",
        },
        {
          label: "Shipping",
          value: "sea",
        },
        {
          label: "Land Transport",
          value: "land",
        },
      ],
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.title = data.title;
      this.orderForm.id = data.logisticsLineId;
      this.orderForm.outLineId = data.outLineId;
      // this.orderForm.transportationMethod = data.transportationMethod;
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refOrderForm.resetFields();
      });
    },
    handleOk() {
      // console.log(this.orderForm);
      // return;
      this.$refs.refOrderForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          bindOutLine({
            outLineId: this.orderForm.outLineId,
            logisticsLineId: this.orderForm.id,
          })
            .then(() => {
              this.$message.success("绑定成功");
              this.visible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

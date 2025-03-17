<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    width="800px"
    @close="handleCancel"
  >
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel"> 取消 </el-button>
      <el-button type="primary" :loading="loading" @click="handleOk"
        >确定</el-button
      >
    </span>
    <div class="send-modal">
      <div class="title">商品信息</div>
      <avue-crud :option="option" :data="subOrderData" />
      <div class="title">配送信息</div>
      <el-form
        ref="formRef"
        :model="formState"
        :label-col="{ xs: 24, md: 3 }"
        :wrapper-col="{ xs: 24, md: 18 }"
        label-align="right"
      >
        <el-form-item label="配送方式"
          ><span>{{ formState.logistics }}</span></el-form-item
        >
        <el-form-item label="收货人"
          ><span>{{ formState.recipientName }}</span
          >&nbsp;&nbsp;<span>{{ formState.recipientPhone }}</span></el-form-item
        >
        <el-form-item label="收货地址"
          ><span>{{ formState.address }}</span></el-form-item
        >
        <div class="title">物流信息</div>
        <el-form-item label="快递公司">
          <el-select v-model="formState.wlc" style="width: 60%">
            <el-option
              v-for="item in wlcOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="formState.wlNum" style="width: 60%" />
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
// import { orderExamine } from '@/api/order';
export default {
  data() {
    return {
      visible: false,
      loading: false,
      wlcOptions: [
        { label: "顺丰", value: 1 },
        { label: "中通", value: 2 },
        { label: "申通", value: 3 },
        { label: "圆通", value: 4 },
        { label: "菜鸟", value: 5 },
        { label: "极兔", value: 6 },
      ],
      title: "",
      formState: {
        list: [],
        logistics: "",
        recipientName: "",
        recipientPhone: "",
        address: "",
        wlc: "",
        wlNum: "",
      },
      subOrderData: [],
      option: {
        menu: false,
        header: false,
        column: [
          { label: "商品标题", prop: "productName" },
          {
            label: "数量",
            prop: "count",
          },
          {
            label: "发货状态",
            prop: "subOrderStatus",
          },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.$refs.formRef.resetFields();
      this.visible = false;
    },
    handleOk() {
      this.$refs.reasonForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // ww()
          //   .then(() => {
          //     this.$emit("finish");
          //   })
          //   .finally(() => [(this.loading = false)]);
        }
      });
      // if (selectedRowKeys.value.length && formState.wlc) {
      //   proxy.$message.success('物品开始发货');
      //   visible.value = false;
      // } else if (!selectedRowKeys.value.length) {
      //   proxy.$message.error('请先勾选商品');
      // } else if (!formState.wlc) {
      //   proxy.$message.error('请选择物流公司');
      // }
      // loading.value = true;
      // orderExamine(formState)
      //   .then(() => {
      //     if (formState.status === 2) {
      //       proxy.$message.success('订单已确认通过');
      //     } else {
      //       proxy.$message.success('订单已拒绝通过');
      //     }
      //     visible.value = false;
      //     emit('finish');
      //   })
      //   .finally(() => {
      //     loading.value = false;
      //   });
    },
    show(data) {
      this.visible = true;
      this.title = data.title;
      this.subOrderData = data.rowData.subOrderVOS;
    },
  },
};

// const title = ref('');
// const show = (item) => {
//   visible.value = true;
//   title.value = item.title;
//   formState.list = item.list;
//   formState.logistics = item.rowData.logistics;
//   formState.recipientName = item.rowData.recipientName;
//   formState.recipientPhone = item.rowData.recipientPhone;
//   formState.address = item.rowData.address;
//   formState.wlc = item.wlc;
//   formState.wlNum = item.wlNum;
//   console.log(formState);
// };
</script>

<style lang="scss" scoped>
.send-modal {
  .title {
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
  }
}
</style>

<template>
  <el-dialog
    width="900px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="发货/换单"
    @close="close"
  >
    <el-form ref="stateForm" :model="stateForm" label-width="100px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item label="" prop="orderId" style="display: none"></el-form-item>
      <el-form-item
        label="子订单："
        prop="subOrderIds"
        :rules="[
          {
            required: true,
            message: '请选择子订单',
            trigger: 'change',
          },
        ]"
      >
        <avue-crud
          ref="crud"
          rowKey="subOrderId"
          :data="subOrderData"
          :option="option"
          @selection-change="selectionChange"
        >
          <template slot-scope="{ row }" slot="productName">
            <div class="detail">
              <div class="poster">
                <el-image
                  style="width: 60px; height: 60px"
                  :src="row.skuImg"
                  fit="cover"
                ></el-image>
              </div>
              <div class="info">
                <div class="title text" :title="row.productName">
                  {{ row.productName }}
                </div>
                <div class="size text">
                  <template v-if="row.attrList">
                    <span v-for="sku in row.attrList" :key="sku.attrValue">
                      <span>{{ sku.attrName }}:{{ sku.attrValue }}&nbsp;</span>
                    </span>
                  </template>
                </div>
                <!-- <div v-if="row.subOrderId" class="orderNo text">
                    子订单ID：{{ row.subOrderId }}
                  </div> -->
                <div v-if="row.subOrderNo" class="orderNo text">子订单号：{{ row.subOrderNo }}</div>
              </div>
            </div>
            <div v-if="row.logisticsInfos" class="remark logistics">
              <span>物流单号：</span
              >{{ row.logisticsInfos[0].trackingNumber }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                row.logisticsInfos[0].deliveryCompany
              }}
            </div>
          </template>
          <template slot="price" slot-scope="{ row }">
            <div>预计：¥{{ (row.price / 100).toFixed(2) }}</div>
            <div>实际：¥{{ (row.realPrice / 100).toFixed(2) }}</div>
          </template>
          <template slot="empty"> 暂无数据 </template>
        </avue-crud>
      </el-form-item>
      <el-form-item
        label="操作类型："
        prop="type"
        :rules="[{ required: true, message: '操作类型不能为空' }]"
      >
        <el-radio-group v-model="stateForm.type">
          <el-radio :label="0">发货</el-radio>
          <el-radio :label="1">换货</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="物流公司"
        :rules="[{ required: true, message: '物流公司不能为空' }]"
        prop="deliveryCompany"
      >
        <!-- <el-input v-model="stateForm.deliveryCompany" placeholder="请输入"></el-input> -->
        <el-select
          v-model="stateForm.deliveryCompany"
          filterable
          allow-create
          placeholder="请选择物流公司，支持输入自定义物流公司"
          style="width: 50%"
        >
          <el-option v-for="item in companyList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="物流单号"
        :rules="[{ required: true, message: '物流单号不能为空' }]"
        prop="trackingNumber"
      >
        <el-input
          v-model="stateForm.trackingNumber"
          style="width: 50%"
          placeholder="请输入物流单号"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { bindLogisticsNo, checkTrackingNumberExist } from "@/api/order";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      stateForm: {
        id: "",
        orderId: "",
        type: 0,
        subOrderIds: [],
        deliveryCompany: "",
        trackingNumber: "",
      },
      companyList: [
        "圆通速递",
        "中通快递",
        "韵达快递",
        "申通快递",
        "极兔快递",
        "顺丰速运",
        "京东物流",
        "邮政EMS",
      ],
      option: {
        menu: false,
        header: false,
        // selection: true,
        maxHeight: 570,
        // index: true,
        // selectable: (row, index) => {
        //   if (row.status == 1) {
        //     return true;
        //   }
        // },
        column: [
          { label: "商品详情", prop: "productName", width: 400 },
          {
            label: "单价",
            prop: "price",
            formatter: (val) => {
              return this.$convertFenToYuan(val.price, { sign: "￥" });
            },
          },
          {
            label: "数量",
            prop: "count",
            formatter: (val) => {
              return "×" + val.count;
            },
          },
        ],
      },
      subOrderData: [],
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.stateForm.id = data.id;
      this.stateForm.orderId = data.outOrderNo;
      this.stateForm.subOrderIds = data._checkedResult;
      this.subOrderData = data.purchaseSubOrderList.filter((item) => {
        if (data._checkedResult.includes(item.subOrderId)) {
          return true;
        }
      });
    },
    close() {
      this.$nextTick(() => {
        this.$refs.stateForm.resetFields();
        this.subOrderData = [];
      });
    },
    selectionChange(list) {
      this.stateForm.subOrderIds = list.map((v) => v.subOrderId);
      this.$refs.stateForm.validateField("subOrderIds");
      // this.$message.success("选中的数据" + JSON.stringify(list));
    },
    onSubmit() {
      this.$refs.stateForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await checkTrackingNumberExist({
            trackingNumber: this.stateForm.trackingNumber,
          });

          if (data.data) {
            this.$confirm("系统存在相同的物流单号，是否确认填写？", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.handleSubmit();
              })
              .catch(() => {
                this.loading = false;
              });
            return;
          }
          console.log(111111);

          this.handleSubmit();
        }
      });
    },
    handleSubmit() {
      bindLogisticsNo({
        subOrderIds: this.stateForm.subOrderIds,
        outOrderNo: this.stateForm.orderId,
        operationType: this.stateForm.type,
        trackingCompany: this.stateForm.deliveryCompany,
        trackingNumber: this.stateForm.trackingNumber,
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

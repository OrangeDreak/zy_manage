<template>
  <el-dialog
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="创建售后工单"
    @close="close"
  >
    <div v-loading="loading">
      <el-form
        ref="refRefundForm"
        :model="refundForm"
        size="small"
        :validate-on-rule-change="false"
        :rules="rules"
        @submit.native.prevent
        label-width="140px"
      >
        <el-form-item label="主订单编号：" prop="orderNo">
          <div class="search">
            <el-input
              v-model="refundForm.orderNo"
              clearable
              style="width: 40%; margin-right: 7px"
              placeholder="请输入主订单编号"
              @keyup.enter.native="searchOrder"
            ></el-input
            ><el-button type="primary" icon="el-icon-search" @click="searchOrder">查询</el-button>
          </div>
        </el-form-item>
        <el-form-item label="申请售后子订单：" prop="subOrderIds">
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
                  <div v-if="row.subOrderNo" class="orderNo text">
                    子订单号：{{ row.subOrderNo }}
                  </div>
                </div>
              </div>
            </template>
            <template slot="empty"> 暂无数据 </template>
          </avue-crud>
          <div class="amount-info">
            <span
              >主订单总额：<span class="amount"
                ><template v-if="amountInfo.totalAmount">￥</template
                >{{ amountInfo.totalAmount || "-" }}</span
              >（
              <span
                >商品金额：<span class="amount"
                  ><template v-if="amountInfo.subtotal">￥</template
                  >{{ amountInfo.subtotal || "-" }}</span
                ></span
              >；
              <span
                >精细化拍照：<span class="amount"
                  ><template v-if="amountInfo.photoExtraCharge">￥</template
                  >{{ amountInfo.photoExtraCharge || "-" }}</span
                ></span
              >；
              <span
                >物流运费：<span class="amount"
                  ><template v-if="amountInfo.totalDeliveryFee">￥</template
                  >{{ amountInfo.totalDeliveryFee || "-" }}</span
                ></span
              >；
              <span
                >补款金额：<span class="amount"
                  ><template v-if="amountInfo.additionalPayment">￥</template
                  >{{ amountInfo.additionalPayment || "-" }}</span
                ></span
              >
              ）</span
            >
            <!-- </el-col>
            <el-col :span="12"> -->
            <!-- <span
            >售后子单总金额：<span class="amount"
              ><template v-if="amountInfo.subtotal">￥</template
              >{{ amountInfo.subtotal || "-" }}</span
            ></span
          > -->
          </div>
        </el-form-item>
        <el-form-item label="售后类型：" prop="type">
          <el-radio-group v-model="refundForm.type" @change="typeChange">
            <el-radio label="1">优惠券下发</el-radio>
            <el-radio label="0">仅退款</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="refundForm.type === '0'">
          <el-form-item label="退款来源：" prop="source">
            <el-checkbox-group v-model="refundForm.source" @change="sourceChange">
              <!-- 订单金额已包含补款金额 -->
              <el-checkbox label="1">订单金额</el-checkbox>
              <el-checkbox label="2" disabled>物流金额</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="退款金额：" prop="amount">
            <div>
              <el-input-number
                v-model="refundForm.amount"
                style="width: 30%"
                class="refund-align-left"
                :precision="2"
                :max="maxRefundAmount"
                placeholder=""
                :controls="false"
              ></el-input-number>
              &nbsp;元
            </div>
          </el-form-item>
          <!-- <el-form-item label="退件运费：" prop="refundFee">
            <div>
              <el-input-number
                v-model="refundForm.refundFee"
                style="width: 30%"
                class="refund-align-left"
                :precision="2"
                placeholder=""
                :controls="false"
              ></el-input-number>
              &nbsp;元
            </div>
          </el-form-item> -->
          <!-- <el-form-item label="实际退款金额：">
            <div v-if="refundForm.amount" class="real-amount">
              {{ (refundForm.amount - refundForm.refundFee).toFixed(2) }}元
            </div>
            <div v-else class="real-amount">--</div>
          </el-form-item> -->
        </div>
        <div v-show="refundForm.type === '1'">
          <el-form-item label="优惠券：" prop="couponId">
            <el-select
              v-model="refundForm.couponId"
              filterable
              remote
              reserve-keyword
              style="width: 30%"
              placeholder="请输入优惠券名称/code搜索"
              :remote-method="remoteMethod"
              :loading="searchLoading"
            >
              <el-option
                v-for="item in couponList"
                :key="item.id"
                :label="'券名:' + item.name + '/code:' + item.code + '/库存:' + item.stockTotal"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <!-- <el-select
              v-model="refundForm.couponId"
              multiple
              style="width: 30%"
              placeholder="请输入优惠券名称搜索"
            >
              <el-option
                v-for="item in couponList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="优惠券张数：" prop="couponNum">
            <el-input-number
              v-model="refundForm.couponNum"
              style="width: 30%"
              :precision="0"
              :min="0"
              placeholder=""
            ></el-input-number>
          </el-form-item>
        </div>
        <el-form-item label="退款凭证" prop="fileList">
          <el-upload
            ref="refUpload"
            :action="`${$root1}/resource/oss/upload`"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            class="refund-upload"
            :limit="limit"
            :class="{
              hideUpload: refundForm.fileList.length >= limit ? true : false,
            }"
            list-type="picture-card"
            :file-list="refundForm.fileList"
            :on-success="handleSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <div slot="tip" class="el-upload__tip">最多上传{{ limit }}张凭证</div>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="仅退款原因：" prop="reason">
          <el-input
            v-model="refundForm.reason"
            style="width: 30%"
            :rows="5"
            resize="none"
            type="textarea"
            placeholder=""
          ></el-input>
        </el-form-item>
      </el-form>
      <footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="subLoading" type="primary" @click="subData">确定</el-button>
      </footer>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import { listData } from "@/api/operate/coupon";
import { getSubOrderList, addWorkOrder } from "@/api/customer/refund";
import clipboard from "@/util/clipboard";
import { convertFenToYuan, convertYuanToFen } from "@/util/commonUtil.js";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      searchLoading: false,
      orderNo: "", // 防止二次输入错误数据
      limit: 10,
      refundForm: {
        orderNo: "",
        subOrderIds: [],
        type: "0",
        source: ["2"],
        amount: undefined,
        // refundFee: 15,
        couponId: undefined,
        couponNum: undefined,
        fileList: [],
        reason: "",
      },
      amountInfo: {
        subtotal: 0,
        totalDeliveryFee: 0,
        additionalPayment: 0,
        photoExtraCharge: 0,
        totalAmount: 0,
      },
      maxRefundAmount: undefined,
      subLoading: false,
      orderId: undefined,
      subOrderData: [],
      couponList: [],
      rules: {},
      dialogueId: null,
      rules1: {
        orderNo: [{ required: true, message: "请输入主订单编号" }],
        subOrderIds: [
          {
            required: true,
            message: "请选择申请售后子订单",
          },
        ],
        type: [{ required: true, message: "请选择售后类型" }],
        couponId: [{ required: true, message: "请选择优惠券" }],
        couponNum: [{ required: true, message: "请输入优惠券张数" }],
        fileList: [{ required: true, message: "请上传仅退款凭证" }],
        reason: [{ required: true, message: "请输入退款原因" }],
      },
      rules2: {
        orderNo: [{ required: true, message: "请输入主订单编号" }],
        subOrderIds: [
          {
            required: true,
            message: "请选择申请售后子订单",
          },
        ],
        type: [{ required: true, message: "请选择售后类型" }],
        source: [{ required: true, message: "请选择退款来源" }],
        amount: [{ required: true, message: "请输入退款金额", trigger: "change" }],
        // refundFee: [{ required: true, message: "请输入退件运费", trigger: "change" }],
        fileList: [{ required: true, message: "请上传退款凭证" }],
        reason: [{ required: true, message: "请输入退款原因" }],
      },
      option: {
        menu: false,
        header: false,
        selection: true,
        // selectable: (row, index) => {
        //   if (row.status == 1) {
        //     return true;
        //   }
        // },
        column: [
          { label: "商品详情", prop: "productName", width: 300 },
          {
            label: "单价",
            prop: "price",
            formatter: (val) => {
              return convertFenToYuan(val.price, { sign: "￥" });
            },
          },
          {
            label: "数量",
            prop: "count",
            formatter: (val) => {
              return "×" + val.count;
            },
          },
          // { label: "订单状态", prop: "statusDesc" },
          {
            label: "精细化拍照",
            prop: "photoExtraCharge",
            formatter: (val) => {
              return convertFenToYuan(val.photoExtraCharge, { sign: "￥" });
            },
          },
          {
            label: "订单金额",
            prop: "subtotal",
            formatter: (val) => {
              return convertFenToYuan(val.subtotal + (val.photoExtraCharge || 0), { sign: "￥" });
            },
          },
        ],
      },
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  filters: {
    convertFenToYuan,
  },
  methods: {
    show(e) {
      this.visible = true;
      this.rules = { ...this.rules2 };
      if (e) {
        this.dialogueId = e.dialogueId;
      }
      // console.log(e, "ddd");
    },
    searchOrder() {
      this.orderNo = this.refundForm.orderNo;
      this.refundForm.subOrderIds = [];
      getSubOrderList({
        orderNo: this.refundForm.orderNo,
      })
        .then((res) => {
          // this.amountInfo.subtotal = convertFenToYuan(
          //   res.data.data.subtotal + (res.data.data.photoExtraCharge || 0),
          // );
          this.amountInfo.subtotal = convertFenToYuan(res.data.data.subtotal);
          this.amountInfo.totalDeliveryFee = convertFenToYuan(res.data.data.totalDeliveryFee);
          this.amountInfo.additionalPayment = convertFenToYuan(res.data.data.additionalPayment);
          this.amountInfo.photoExtraCharge = convertFenToYuan(res.data.data.photoExtraCharge);
          this.amountInfo.totalAmount = convertFenToYuan(res.data.data.totalAmount);
          this.refundForm.amount = this.amountInfo.subtotal;
          this.orderId = res.data.data.orderId;
          this.subOrderData = res.data.data?.purchaseSubOrderList || [];
          this.maxRefundAmount = res.data.data.totalAmount / 100;
        })
        .catch(() => {
          this.subOrderData = [];
        });
    },
    selectionChange(list) {
      this.refundForm.subOrderIds = list.map((v) => v.subOrderId);
      // this.$message.success("选中的数据" + JSON.stringify(list));
    },
    typeChange() {
      if (this.refundForm.type === "0") {
        this.refundForm.amount = this.amountInfo.subtotal;
        this.refundForm.source = ["2"];
        this.refundForm.couponNum = undefined;
        this.refundForm.couponId = [];
        this.rules = { ...this.rules2 };
        this.couponList = [];
        this.$nextTick(() => {
          this.$refs.refRefundForm.clearValidate(["couponId", "couponNum"]);
        });
      } else {
        this.refundForm.amount = undefined;
        this.refundForm.source = ["2"];
        this.rules = { ...this.rules1 };
        this.rules.couponId = [{ required: true, message: "请选择优惠券" }];
        this.rules.couponNum = [{ required: true, message: "请输入优惠券张数" }];
        this.$nextTick(() => {
          this.$refs.refRefundForm.clearValidate(["amount", "source"]);
        });
      }
    },
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        listData({
          name: query,
          stockResidueSymbol: 2,
          stockResidue: 0,
          current: 1,
          size: 20,
        })
          .then((res) => {
            const arr1 = res.data.data.records || [];
            listData({
              code: query,
              stockResidueSymbol: 2,
              stockResidue: 0,
              current: 1,
              size: 20,
            })
              .then((res) => {
                const arr2 = res.data.data.records || [];
                const arr3 = [...arr1, ...arr2];
                const ids = [];
                const list = [];
                arr3.forEach((item) => {
                  if (!ids.includes(item.id)) {
                    ids.push(item.id);
                    list.push(item);
                  }
                });
                this.couponList = list;
              })
              .finally(() => {
                this.searchLoading = false;
              });
          })
          .catch(() => {
            this.searchLoading = false;
          });
      } else {
        this.options = [];
      }
    },
    subData() {
      this.$refs.refRefundForm.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          const imgs = [];
          this.refundForm.fileList.forEach((item) => {
            if (item.response && item.response.code === 200) {
              imgs.push(item.response.data.url);
            }
          });
          // this.refundForm.subOrderIds = this.subOrderData.map((v) => v.subOrderId);
          let params = {
            orderId: this.orderId,
            subOrderIdList: this.refundForm.subOrderIds,
            refundType: this.refundForm.type,
            refundSource:
              this.refundForm.type === "0"
                ? this.refundForm.source.length > 1
                  ? 3
                  : this.refundForm.source[0]
                : undefined,
            refundAmount:
              this.refundForm.type === "0" ? convertYuanToFen(this.refundForm.amount) : undefined,
            couponId: this.refundForm.type === "1" ? this.refundForm.couponId : undefined,
            couponNum: this.refundForm.type === "1" ? this.refundForm.couponNum : undefined,
            refundRemark: {
              msg: this.refundForm.reason,
              pics: imgs,
            },
          };
          if (this.dialogueId) {
            params = { ...params, dialogueId: this.dialogueId };
          }
          addWorkOrder(params)
            .then(() => {
              this.$message.success("创建成功");
              this.visible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.subLoading = false;
            });
        }
      });
    },
    close() {
      this.orderId = undefined;
      this.subOrderData = [];
      this.amountInfo.subtotal = 0;
      this.amountInfo.totalDeliveryFee = 0;
      this.amountInfo.totalAmount = 0;
      this.$refs.refUpload.clearFiles();
      this.$nextTick(() => {
        this.$refs.refRefundForm.resetFields();
      });
    },
    handleSuccess(response, file, fileList) {
      if (response && response.code !== 200) {
        this.$message.error(response.msg);
      }
      this.refundForm.fileList = fileList.filter((v) => {
        if (!v.response || (v.response && v.response.code === 200)) {
          return true;
        }
      });
      this.$refs.refRefundForm.validateField("fileList");
    },
    handleRemove(file, fileList) {
      this.refundForm.fileList = fileList.filter((v) => {
        if (!v.response || (v.response && v.response.code === 200)) {
          return true;
        }
      });
      this.$refs.refRefundForm.validateField("fileList");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    copyTxt(even, txt) {
      clipboard(txt, even);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
}
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
.real-amount {
  font-size: 14px;
  color: #ee2624;
  font-weight: 500;
}
.amount-info {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  .amount {
    color: #ee2624;
  }
}
.refund-align-left {
  :deep(.el-input__inner) {
    text-align: left;
  }
}
.other-info {
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
}
.refund-upload {
  :deep(.el-upload--picture-card) {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}
.hideUpload {
  /deep/.el-upload--picture-card {
    display: none !important;
  }
}
footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 10px;
}
</style>

<template>
  <el-dialog
    width="80%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="售后订单详情"
    @close="close"
  >
    <div v-loading="loading">
      <div class="header">
        <div class="item">
          <span class="label">售后单号:</span>
          {{ orderInfo.afterSaleOrderNo }}&nbsp;<i
            v-if="orderInfo.afterSaleOrderNo"
            class="el-icon-copy-document"
            @click="copyTxt($event, orderInfo.afterSaleOrderNo)"
            style="font-size: 14px; color: #1890ff"
          />
        </div>
        <div class="item">
          <span class="label">主订单号:</span>
          {{ orderInfo.orderNo }}&nbsp;<i
            v-if="orderInfo.orderNo"
            class="el-icon-copy-document"
            @click="copyTxt($event, orderInfo.orderNo)"
            style="font-size: 14px; color: #1890ff"
          />
        </div>
        <div class="item">
          <span class="label">用户ID:</span>
          {{ orderInfo.buyerId }}&nbsp;<i
            v-if="orderInfo.buyerId"
            class="el-icon-copy-document"
            @click="copyTxt($event, orderInfo.buyerId)"
            style="font-size: 14px; color: #1890ff"
          />
        </div>
        <div class="item">
          <span class="label">申请时间:</span>
          {{ orderInfo.gmtCreate }}
        </div>
      </div>
      <div class="sub-order">
        <avue-crud ref="crud" rowKey="id" :data="subOrderData" :option="option">
          <template slot-scope="{ row }" slot="productName">
            <div class="detail">
              <div class="poster">
                <el-image
                  style="width: 100%; height: 100%"
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
                    <!-- &nbsp;<span class="num">×{{ row.count }}</span> -->
                  </template>
                </div>
                <div class="text">子订单号：{{ row.subOrderNo }}</div>
              </div>
            </div>
          </template>
          <template slot="empty"> 暂无数据 </template>
        </avue-crud>
        <div class="amount-info">
          <span
            >主订单总金额：<span class="amount"
              ><template v-if="amountInfo.totalAmount">￥</template
              >{{ amountInfo.totalAmount || "-" }}</span
            >（
            <span
              >商品总金额：<span class="amount"
                ><template v-if="amountInfo.subtotal">￥</template
                >{{ amountInfo.subtotal || "-" }}</span
              ></span
            >；
            <span
              >精细化拍照：<span class="amount"
                ><template v-if="amountInfo.totalPhotoExtraCharge">￥</template
                >{{ amountInfo.totalPhotoExtraCharge || "-" }}</span
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
                ><template v-if="amountInfo.totalAdditionalPayment">￥</template
                >{{ amountInfo.totalAdditionalPayment || "-" }}</span
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
          <!-- </el-col>
          </el-row> -->
        </div>
        <div class="amount-info">
          <span
            >售后子单总金额：<span class="amount"
              ><template v-if="amountInfo.subTotalAmount">￥</template
              >{{ amountInfo.subTotalAmount || "-" }}</span
            >
            （
            <span
              >精细化拍照：<span class="amount"
                ><template v-if="amountInfo.subTotalPhotoExtraCharge">￥</template
                >{{ amountInfo.subTotalPhotoExtraCharge || "-" }}</span
              ></span
            >）
          </span>
        </div>
      </div>
      <el-form ref="refForm" :model="orderInfo" @submit.native.prevent label-width="140px">
        <!-- <el-form-item label="售后类型：" prop="refundType">
          <template v-if="orderInfo.refundType == 1">优惠券下发</template>
          <template v-else-if="orderInfo.refundType == 0">仅退款</template>
          <template v-else>退货退款</template>
        </el-form-item> -->
        <template v-if="orderInfo.refundType === 0 || orderInfo.refundType === 2">
          <el-form-item label="退款来源：" prop="source">
            <el-checkbox-group v-model="orderInfo.source" @change="sourceChange" disabled>
              <el-checkbox :label="1">订单金额</el-checkbox>
              <el-checkbox :label="2">物流金额</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="订单退款金额：" prop="refundAmount">
            <!-- <el-input-number v-model="orderInfo.refundAmount" placeholder=""></el-input-number> -->

            <template v-if="orderInfo.action">
              <el-input
                v-model="editInfo.refundAmount"
                style="width: 20%"
                class="refund-align-left"
                size="small"
                placeholder="请输入订单退款金额"
                @input="formatAmount"
              ></el-input>
              元
              <!-- <div>客服修改金额原因：{{ orderInfo.kefuReason }}</div> -->
            </template>
            <template v-else>
              <span>￥{{ editInfo.refundAmount }}</span>
              <!-- <i

                class="el-icon-edit"
                @click="eidtAmount"
                >&nbsp;编辑</i
              > -->
            </template>
          </el-form-item>
          <el-form-item
            v-if="[1, 2].includes(orderInfo.refundType)"
            label="退件运费："
            prop="refundFee"
          >
            <!-- <el-input-number v-model="orderInfo.refundAmount" placeholder=""></el-input-number> -->

            <template v-if="orderInfo.workOrderStatus === 5 && orderInfo.action === 'toExamine'">
              <el-input
                v-model="editInfo.refundFee"
                style="width: 20%"
                class="refund-align-left"
                size="small"
                placeholder="请输入退件运费"
                @input="formatFee"
              ></el-input>
              元
            </template>
            <template v-else>
              <span>￥{{ editInfo.refundFee }}</span>
              <!-- <i

                class="el-icon-edit"
                @click="eidtAmount"
                >&nbsp;编辑</i
              > -->
            </template>
          </el-form-item>
          <el-form-item label="实际退款金额：">
            <div class="real-amount">
              {{ (+editInfo.refundAmount - +editInfo.refundFee).toFixed(2) }}元
            </div>
          </el-form-item>
        </template>
        <template v-if="orderInfo.refundType === 1">
          <el-form-item label="优惠券：" prop="type">
            {{ orderInfo.couponName }} / {{ orderInfo.couponCode }}
          </el-form-item>
          <el-form-item label="优惠券张数：" prop="type">
            {{ orderInfo.couponNum }}张
          </el-form-item>
        </template>
        <el-form-item
          v-if="(orderInfo.refundType == 0 || orderInfo.refundType == 2) && showChange"
          label="修改金额原因："
          prop="updateRemark"
        >
          <el-input
            v-model="editInfo.updateRemark"
            style="width: 30%"
            :rows="4"
            resize="none"
            type="textarea"
            placeholder=""
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="
            (orderInfo.refundType == 0 || orderInfo.refundType == 2) && orderInfo.attributes.flows
          "
          label="金额修改原因："
          prop="updateRemark"
        >
          <div v-for="item in orderInfo.attributes.flows">
            {{ item.remark }}
          </div>
        </el-form-item>

        <el-form-item v-if="orderInfo.action === 'toExamine'" label="退款凭证" prop="fileList">
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
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
          >
            <div slot="tip" class="el-upload__tip">最多上传{{ limit }}张凭证</div>
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-else label="退款凭证：" prop="fileList">
          <template v-if="orderInfo.imgs">
            <el-image
              v-for="(item, i) in orderInfo.imgs"
              :key="i"
              style="height: 80px; margin: 0 10px 10px 0"
              :src="item"
              :preview-src-list="orderInfo.imgs"
            >
            </el-image>
          </template>
        </el-form-item>
        <el-form-item v-if="orderInfo.refundType == 0" label="仅退款原因：" prop="reason">
          {{ orderInfo.reason }}
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      width="500px"
      title="驳回原因"
      :visible.sync="innerVisible"
      @close="innerClose"
      append-to-body
    >
      <el-form ref="refRejectForm" :model="rejectForm" label-width="100px">
        <el-form-item
          label="驳回原因："
          prop="reason"
          :rules="[{ required: true, message: '请输入驳回原因' }]"
        >
          <el-input
            v-model="rejectForm.reason"
            style="width: 100%"
            :rows="5"
            resize="none"
            type="textarea"
            placeholder="请输入驳回原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取消</el-button>
        <el-button type="primary" :loading="subLoading2" @click="onSubReject">确定</el-button>
      </span>
    </el-dialog>
    <!-- 审核金额确认 -->
    <el-dialog
      width="500px"
      title="金额确认"
      :close-on-click-modal="false"
      :visible.sync="innerVisible2"
      append-to-body
    >
      <div class="amount-confirm">
        <el-form ref="refAmountForm" :model="amountInfo" label-width="200px">
          <template v-if="orderInfo.action === 'toExamine'">
            <!-- <el-form-item label="主订单总金额：">￥{{ amountInfo.totalAmount }} </el-form-item>
            <el-form-item label="补款金额：">
              ￥{{ amountInfo.totalAdditionalPayment }}
            </el-form-item>
            <el-form-item label="精细化拍照总金额：">
              ￥{{ amountInfo.totalPhotoExtraCharge }}
            </el-form-item>
            <el-form-item label="物流运费：">￥{{ amountInfo.totalDeliveryFee }} </el-form-item>
            <el-form-item
              style="border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 16px 0"
              label="售后子单总金额："
              >￥{{ amountInfo.subTotalAmount }}（精细化拍照：￥{{
                amountInfo.subTotalPhotoExtraCharge
              }}）</el-form-item
            > -->
            <el-form-item label="订单退款金额：">
              <span>￥{{ editInfo.refundAmount }}</span>
            </el-form-item>
            <el-form-item label="退件运费：">
              <span>￥{{ editInfo.refundFee }}</span>
            </el-form-item>
          </template>
          <el-form-item label="实际退款金额：">
            <span class="real-amount"
              >￥{{ (+editInfo.refundAmount - +editInfo.refundFee).toFixed(2) }}</span
            >
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible2 = false">取消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubPass">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <span v-if="orderInfo.action" slot="footer" class="dialog-footer">
      <el-button plain @click="visible = false">取消</el-button>
      <el-button type="warning" @click="onReject">{{
        orderInfo.action === "toExamine" ? "驳回" : "打回"
      }}</el-button>
      <el-button type="success" @click="onPass">通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  workOrderDetail,
  financeAudit,
  financeReturn,
  financeConfirm,
} from "@/api/customer/refund";
import clipboard from "@/util/clipboard";
import { convertFenToYuan, convertYuanToFen } from "@/util/commonUtil.js";
export default {
  data() {
    return {
      visible: false,
      innerVisible: false,
      innerVisible2: false,
      rejectForm: {
        reason: "",
        refundFee: 0,
        refundAmount: 0,
      },
      loading: false,
      orderInfo: {
        refundAmount: 0,
        refundFee: 0,
        attributes: { flows: null },
      },
      subOrderData: [],
      option: {
        menu: false,
        header: false,
        column: [
          { label: "商品详情", prop: "productName", width: 400 },
          {
            label: "单价",
            prop: "price",
            formatter: (val) => {
              return convertFenToYuan(val.price, { sign: "￥" });
            },
          },
          {
            label: "申请件数",
            prop: "refundNum",
            formatter: (val) => {
              return "×" + val.refundNum;
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
          {
            label: "售后类型",
            prop: "refundTypeStatusName",
          },
          {
            label: "退款原因",
            prop: "refundReason",
            html: true,
            formatter: (val) => {
              return `<strong style="color:#F56C6C;">${val.refundReason}</strong>`;
            },
          },
        ],
      },
      amountInfo: {
        subtotal: 0,
        totalDeliveryFee: 0,
        totalPhotoExtraCharge: 0,
        totalAdditionalPayment: 0,
        totalAmount: 0,
        subTotalAmount: 0,
        subTotalPhotoExtraCharge: 0,
      },
      editInfo: {
        refundAmount: 0,
        refundFee: 0,
        updateRemark: "",
        status: false,
      },
      maxRefundAmount: undefined,
      subLoading: false,
      subLoading2: false,
      dialogImageUrl: "",
      dialogVisible: false,
      refundForm: {
        fileList: [],
      },
      limit: 10,
    };
  },
  filters: {
    convertFenToYuan,
  },
  computed: {
    showChange() {
      if (
        +convertYuanToFen(this.editInfo.refundAmount) - +this.orderInfo.refundAmount != 0 ||
        +convertYuanToFen(this.editInfo.refundFee) - +this.orderInfo.refundFee != 0
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    formatFee(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      if (Number(value) > this.editInfo.refundAmount) value = this.editInfo.refundAmount;
      this.editInfo.refundFee = value;
    },
    formatAmount(val) {
      let value = val.replace(/[^0-9.]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9.]/g, '');
      // 2. 只能有一个小数点
      value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      value = value.replace(/(\.\d{2})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      if (value.startsWith(".")) {
        value = `0${value}`;
      }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      if (Number(value) > convertFenToYuan(this.orderInfo.refundAmount))
        value = convertFenToYuan(this.orderInfo.refundAmount);
      this.editInfo.refundAmount = value;
    },
    show(data) {
      this.visible = true;
      this.loading = true;

      workOrderDetail({ id: data.id })
        .then((res) => {
          const data2 = res.data.data || {};
          data2.attributes = JSON.parse(data2.attributes);
          // if (data2.refundType != 2) {
          //   this.option.column[this.option.column.length - 1].hide = true;
          // } else {
          //   this.option.column[this.option.column.length - 1].hide = false;
          // }
          this.maxRefundAmount = convertFenToYuan(data2.refundAmount);

          this.amountInfo.totalAdditionalPayment = convertFenToYuan(data2.totalAdditionalPayment);
          this.amountInfo.subtotal = convertFenToYuan(data2.subtotal);
          this.amountInfo.totalDeliveryFee = convertFenToYuan(data2.totalDeliveryFee);
          this.amountInfo.totalAmount = convertFenToYuan(data2.totalAmount);
          this.subOrderData = data2.afterSaleSubOrderList || [];
          this.subOrderData.forEach((item) => {
            this.amountInfo.subTotalAmount += item.subtotal;
            this.amountInfo.subTotalAmount += item.photoExtraCharge || 0;
            this.amountInfo.subTotalPhotoExtraCharge += item.photoExtraCharge || 0;
          });
          this.amountInfo.subTotalAmount = convertFenToYuan(this.amountInfo.subTotalAmount);
          this.amountInfo.subTotalPhotoExtraCharge = convertFenToYuan(
            this.amountInfo.subTotalPhotoExtraCharge,
          );
          // this.amountInfo.subtotal = convertFenToYuan(
          //   this.amountInfo.subtotal + this.amountInfo.totalPhotoExtraCharge,
          // );
          this.amountInfo.totalPhotoExtraCharge = convertFenToYuan(data2.totalPhotoExtraCharge);
          // this.orderInfo.attributes = JSON.parse(data2.attributes);
          this.orderInfo = data2;
          this.orderInfo.orderId = data.id;
          this.orderInfo.action = data.action;
          this.orderInfo.source = data2.refundSource === 3 ? [1, 2] : [data2.refundSource];
          this.orderInfo.imgs = data2.refundRemark?.pics || [];
          if (this.orderInfo.imgs.length && data.action) {
            this.refundForm.fileList = this.orderInfo.imgs.map((item) => {
              return {
                name: item,
                url: item,
                status: "success",
              };
            });
          }
          this.orderInfo.reason = data2.refundRemark?.msg || "";
          this.editInfo.refundAmount = convertFenToYuan(this.orderInfo.refundAmount);
          this.editInfo.refundFee = convertFenToYuan(this.orderInfo.refundFee);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    eidtAmount() {
      this.editInfo.status = true;
    },
    handleSubmit() {
      console.log(this.editInfo.refundAmount);
      // this.orderInfo.refundAmount = convertYuanToFen(this.editInfo.refundAmount);
      this.editInfo.status = false;
      // updateWorkOrderAmount({
      //   id: this.orderInfo.orderId,
      //   amount: convertYuanToFen(this.editInfo.refundAmount),
      // })
      //   .then(() => {
      //     this.orderInfo.refundAmount = convertYuanToFen(this.editInfo.refundAmount);
      //     this.$message.success("退款金额编辑成功");
      //   })
      //   .finally(() => {
      //     this.editInfo.status = false;
      //   });
    },
    onReject() {
      if (this.orderInfo.action === "toExamine") {
        this.innerVisible = true;
      } else {
        this.$confirm("确认打回吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          financeReturn({
            id: this.orderInfo.id,
          }).then(() => {
            this.$emit("finish");
            this.visible = false;
            this.$message.success("操作成功!");
          });
        });
      }
    },
    onPass() {
      if (this.showChange && !this.editInfo.updateRemark) {
        this.$message.warning("请输入修改金额原因");
        return;
      }
      this.innerVisible2 = true;
    },
    onSubPass() {
      this.subLoading = true;
      if (this.orderInfo.action === "toExamine") {
        const imgs = [];
        this.refundForm.fileList.forEach((item) => {
          if (item.response && item.response.code === 200) {
            imgs.push(item.response.data.url);
          } else if (item.status === "success") {
            imgs.push(item.url);
          }
        });
        financeAudit({
          id: this.orderInfo.orderId,
          status: 1,
          refundFee: convertYuanToFen(this.editInfo.refundFee),
          refundAmount: convertYuanToFen(this.editInfo.refundAmount),
          updateRemark: this.editInfo.updateRemark || undefined,
          pics: imgs,
        })
          .then(() => {
            this.$message.success("审核已通过");
            this.$emit("finish");
            this.innerVisible2 = false;
            this.visible = false;
          })
          .finally(() => {
            this.subLoading = false;
          });
      } else {
        financeConfirm({
          id: this.orderInfo.id,
          refundFee: convertYuanToFen(this.editInfo.refundFee),
          refundAmount: convertYuanToFen(this.editInfo.refundAmount),
          updateRemark: this.editInfo.updateRemark || undefined,
        })
          .then(() => {
            this.$message.success("确认退款成功");
            this.subLoading = false;
            this.$emit("finish");
            this.innerVisible2 = false;
            this.visible = false;
          })
          .catch(() => {
            this.subLoading = false;
          });
      }
    },
    onSubReject() {
      this.$refs.refRejectForm.validate((valid) => {
        if (valid) {
          this.subLoading2 = true;
          financeAudit({
            id: this.orderInfo.orderId,
            status: 2,
            refundAmount: convertYuanToFen(this.editInfo.refundAmount),
            rejectReason: this.rejectForm.reason,
          })
            .then(() => {
              this.$message.success("已驳回售后申请");
              this.$emit("finish");
              this.innerVisible = false;
              this.visible = false;
            })
            .finally(() => {
              this.subLoading2 = false;
            });
        }
      });
    },
    innerClose() {
      this.$nextTick(() => {
        this.$refs.refRejectForm.resetFields();
      });
    },
    close() {
      this.amountInfo.subtotal = 0;
      this.amountInfo.totalPhotoExtraCharge = 0;
      this.amountInfo.totalDeliveryFee = 0;
      this.amountInfo.totalAdditionalPayment = 0;
      this.amountInfo.totalAmount = 0;
      this.amountInfo.subTotalAmount = 0;
      this.amountInfo.subTotalPhotoExtraCharge = 0;
      this.editInfo.updateRemark = "";
      this.orderInfo = {
        refundAmount: 0,
        refundFee: 0,
        attributes: { flows: null },
      };
      this.subOrderData = [];
      this.refundForm.fileList = [];
    },
    copyTxt(even, txt) {
      clipboard(txt, even);
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
    },
    handleRemove(file, fileList) {
      this.refundForm.fileList = fileList.filter((v) => {
        if (!v.response || (v.response && v.response.code === 200)) {
          return true;
        }
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #f3f7fd;
  border-radius: 2px;
  .el-icon-copy-document {
    cursor: pointer;
  }
}
.detail {
  display: flex;
  align-items: center;
  .poster {
    width: 60px;
    height: 60px;
  }
  .info {
    width: calc(100% - 70px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
.el-icon-edit {
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
  font-size: 14px;
}
.real-amount {
  font-size: 16px;
  color: #ee2624;
  font-weight: 500;
}
.amount-info {
  padding: 10px 0 20px 44px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  .amount {
    color: #ee2624;
  }
}
.amount-confirm {
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
</style>

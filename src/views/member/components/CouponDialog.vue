<template>
  <el-dialog
    width="60%"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="发放优惠券"
    @close="close"
  >
    <div v-loading="loading">
      <el-form
        ref="refRefundForm"
        :model="refundForm"
        size="small"
        :validate-on-rule-change="false"
        :rules="rules"
        label-width="140px"
      >
        <div>
          <el-form-item label="优惠券：" prop="couponId">
            <el-select
              v-model="refundForm.couponId"
              filterable
              remote
              reserve-keyword
              style="width: 80%"
              placeholder="请输入优惠券名称/code搜索"
              :remote-method="remoteMethod"
              :loading="searchLoading"
              @change="couponChange"
            >
              <el-option
                v-for="item in couponList"
                :key="item.id"
                :disabled="!item.status"
                :label="'券名:' + item.name + '/code:' + item.code + '/库存:' + item.stockTotal"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券张数：" prop="couponNum">
            <el-input-number
              v-model="refundForm.couponNum"
              style="width: 80%"
              :precision="0"
              :max="max"
              :min="0"
              placeholder=""
            ></el-input-number>
          </el-form-item>
        </div>
        <!-- <el-form-item label="发放原因：" prop="reason">
          <el-input
            v-model="refundForm.reason"
            style="width: 80%"
            :rows="5"
            resize="none"
            type="textarea"
            placeholder=""
          ></el-input>
        </el-form-item> -->
      </el-form>
      <footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button :loading="subLoading" type="primary" @click="subData">确定</el-button>
      </footer>
    </div>
  </el-dialog>
</template>

<script>
import { listData } from "@/api/operate/coupon";
import { distributeCoupons } from "@/api/member/user";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      searchLoading: false,
      memberId: undefined,
      max: undefined,
      refundForm: {
        couponId: undefined,
        couponNum: undefined,
        reason: "",
      },
      rules: {
        couponId: [{ required: true, message: "请选择优惠券", trigger: "change" }],
        couponNum: [{ required: true, message: "请输入优惠券张数", trigger: "blur" }],
        reason: [{ required: false, message: "请输入发放原因", trigger: "blur" }],
      },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.memberId = data;
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
    couponChange() {
      if (this.refundForm.couponId) {
        this.max = this.couponList.find((item) => item.id === this.refundForm.couponId)?.stockTotal;
      }
    },
    subData() {
      this.$refs.refRefundForm.validate((valid) => {
        if (valid) {
          this.subLoading = true;
          let params = {
            memberId: this.memberId,
            couponList: [
              {
                couponId: this.refundForm.couponId,
                count: this.refundForm.couponNum,
              },
            ],
            remark: this.refundForm.reason,
          };
          distributeCoupons(params)
            .then(() => {
              this.$message.success("发放成功");
              this.visible = false;
            })
            .finally(() => {
              this.subLoading = false;
            });
        }
      });
    },
    close() {
      this.$nextTick(() => {
        this.$refs.refRefundForm.resetFields();
      });
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

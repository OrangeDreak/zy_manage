<template>
  <div class="basic-container">
    <div class="recharge-application">
      <avue-crud
        :option="option"
        :table-loading="loading"
        :data="data"
        ref="crud"
        v-model="form"
        :search.sync="search"
        :page="page"
        @row-save="rowSave"
        :before-open="beforeOpen"
        @search-change="searchChange"
        @search-reset="searchReset"
        @current-change="currentChange"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @on-load="onLoad"
      >
        <template #userInfo="scope" slot-scope="{ row }">
          <div>ID：{{ scope.row.userId }}</div>
          <div>昵称：{{ scope.row.nickname }}</div>
        </template>
        <template #paymentEvidenceImg="scope" slot-scope="{ row }">
          <el-image
            style="height: 50px"
            v-for="(img, index) in scope.row.paymentEvidenceImg"
            :key="img"
            :src="img"
            fit="cover"
            :preview-src-list="scope.row.paymentEvidenceImg"
          >
          </el-image>
        </template>
        <template #transfer="scope" slot-scope="{ row }">
          <template v-if="scope.row.rechargeType === 1">
            <div>转账人姓名：{{ scope.row.remitterName }}</div>
            <div>转账银行：{{ scope.row.remittingBank }}</div>
            <div>汇款凭证号：{{ scope.row.referenceNo }}</div>
          </template>
        </template>
        <template #applyStatus="scope" slot-scope="{ row }">
          <el-tag v-if="scope.row.applyStatus === 0">待审核</el-tag>
          <el-tag v-else-if="scope.row.applyStatus === 1" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.applyStatus === -1" type="danger">审核驳回</el-tag>
        </template>

        <template #transfer-form="{ type }" slot="transferForm" slot-scope="{ type }">
          <template v-if="form.remitterName">
            <div>转账人姓名：{{ form.remitterName }}</div>
            <div>转账银行：{{ form.remittingBank }}</div>
            <div>汇款凭证号：{{ form.referenceNo }}</div>
          </template>
          <template v-else>--</template>
        </template>
        <template #amount-form="{ type }" slot="amountForm" slot-scope="{ type }">
          <div class="foreign-amount-form">
            <el-input-number
              v-model="form.amount"
              :precision="2"
              class="foreign-amount"
              style="width: 100%"
              :min="0"
              :max="maxAmount"
              :controls="false"
            ></el-input-number>
            <el-select
              v-model="form.currency"
              class="currency"
              :disabled="type === 'edit' || type === 'view'"
              :clearable="false"
            >
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.currency"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #realAmount-form="{ type }" slot="realAmountForm" slot-scope="{ type }">
          <div v-if="form.realAmount" class="foreign-amount-form">
            <el-input-number
              v-model="form.realAmount"
              :precision="2"
              class="foreign-amount"
              style="width: 100%"
              :min="0"
              :max="maxAmount"
              :controls="false"
            ></el-input-number>
            <el-select v-model="form.currency" class="currency" disabled :clearable="false">
              <el-option
                v-for="item in currencyList"
                :key="item.value"
                :label="item.currency"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </div>
        </template>
        <template #userId-form="{ type }" slot="userIdForm" slot-scope="{ type }">
          <div class="user-box">
            <div class="left">
              <el-select
                v-model="form.userId"
                filterable
                remote
                :disabled="type === 'edit'"
                reserve-keyword
                placeholder="请输入用户ID搜索"
                :remote-method="remoteMethod"
                :loading="searchLoading"
                @change="userChange"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :disabled="!(item.status === 0)"
                  :label="'ID:' + item.id + ' / 昵称:' + item.nickname"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              用户昵称：{{ selectUserInfo.nickname || "--" }}
            </div>

            <div class="right">
              <el-avatar shape="square" :size="80" :src="selectUserInfo.avatar">
                <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
              </el-avatar>
            </div>
          </div>
        </template>
        <template #menu-form="{ type }" slot="menuForm" slot-scope="{ row, index, type }">
          <template v-if="type === 'edit'">
            <el-button type="primary" :loading="subLoading" size="small" @click="handleAudit(1)"
              >审核通过</el-button
            >
            <el-button type="primary" :loading="subLoading" size="small" @click="handleAudit(-1)"
              >驳回</el-button
            >
          </template>
          <el-button type="pain" size="small" @click="closeDialog">取消</el-button>
        </template>
        <template #menu="scope, index">
          <el-button
            v-if="scope.row.applyStatus === 0"
            @click="handleToExamine(scope.row)"
            type="text"

            >审核</el-button
          >
        </template>
      </avue-crud>
    </div>
  </div>
</template>

<script>
import { applyList, saveApply, balanceApply } from "@/api/rechargeApply";
import { getList} from "@/api/user";
import { pickerOptions } from "@/utils/date";
import { formatNum2, convertYuanToFen } from "@/utils/commonUtil.js";
import "@/styles/flex.scss";
import "@/styles/commonStyle.scss";
import '@smallwei/avue/lib/index.css';

export default {
  data() {
    const vm = this;
    return {
      rowData: {},
      form: {},
      search: {},
      pickerOptions,
      loading: true,
      searchLoading: false,
      query: {},
      userList: [],
      selectUserInfo: {},
      currencyList: [
              {
                label: "CNY",
                value: "CNY",
                code: "CNY",
                currency: "CNY",
              },
              {
                label: "USD",
                value: "USD",
                code: "USD",
                currency: "USD",
              },
      ],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      maxAmount: undefined,
      option: {
        calcHeight: 210,
        labelWidth: 120,
        searchShow: true,
        searchGutter: 10,
        searchLabelPosition: "left",
        searchMenuPosition: "right",
        searchSpan: 8,
        menuWidth: 120,
        searchMenuSpan: 24,
        searchLabelWidth: 90,
        span: 24,
        tip: false,
        dialogWidth: "60%",
        editTitle: "余额充值审核",
        saveBtnText: "确定",
        viewBtn: true,
        viewBtnIcon: "a",
        addBtn: true,
        addBtnText: "创建充值申请",
        editBtn: false,
        cancelBtn: false,
        updateBtn: false,
        delBtn: false,
        column: [
          {
            label: "ID",
            prop: "id",
            order: 1,
            // width: 150,
            addDisplay: false,
            editDisplay: false,
            search: true,
          },
          {
            label: "申请时间",
            prop: "gmtCreated",
            search: true,
            addDisplay: false,
            editDisplay: false,
            searchRange: true,
            format:"YYYY-MM-DD HH:mm:ss",
            valueFormat:"YYYY-MM-DD HH:mm:ss",
            type: "daterange",
            pickerOptions: pickerOptions,
            order: 0,
            width: 95,
            formatter: (val) => {
              return val.gmtCreated;
            },
          },
          {
            label: "用户ID",
            prop: "userId",
            // width: 150,
            order: 1,
            editDisabled: true,
            search: true,
            hide: true,
          },
          {
            label: "用户信息",
            prop: "userInfo",
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
          },
          {
            label: "转账银行",
            prop: "transfer",
            addDisplay: false,
            editDisplay: true,
          },
          {
            label: "充值类型",
            prop: "rechargeType",
            type: "select",
            editDisabled: true,
            search: true,
            order: 1,
            rules: [
              {
                required: true,
                message: "请选择充值类型",
                trigger: "change",
              },
            ],
            value: 1,
            dicData: [
              {
                label: "银行转账",
                value: 1,
              },
              {
                label: "PayPal转账",
                value: 2,
              },
            ],
          },
          {
            label: "申请人",
            prop: "creatorRealName",
            disabled: true,
            editDisplay: false,
            search: true,
            order: 1,
            hide: true,
            value: "",
          },
          {
            label: "充值币种",
            prop: "currency",
            type: "select",
            viewDisplay: false,
            addDisplay: false,
            editDisplay: false,
            hide: true,
            dicData: [
              {
                label: "CNY",
                value: "CNY",
              },
              {
                label: "USD",
                value: "USD",
              },
            ],
          },
          {
            label: "充值金额",
            // prop: "rechargeAmount",
            prop: "amount",
            // align: "center",
            rules: [
              {
                required: true,
                message: "请输入充值金额",
                trigger: "blur",
              },
            ],
            formatter: (val) => {
              return (
                (val.currencySign ? val.currencySign : val.currency) +
                " " +
                formatNum2(val.amount)
              );
            },
          },
          {
            label: "到账金额",
            // prop: "rechargeAmount",
            prop: "realAmount",
            // align: "center",
            addDisplay: false,
            editDisplay: false,
            formatter: (val) => {
              if (val.applyStatus === 1) {
                return (
                  (val.currencySign ? val.currencySign : val.currency) +
                  " " +
                  formatNum2(val.realAmount)
                );
              } else {
                return "--";
              }
            },
          },
          {
            label: "汇率",
            prop: "amountRate",
            addDisplay: false,
            editDisplay: false,
            formatter: (val) => {
              return val.amountRate;
            },
          },
          {
            label: "充值凭证",
            prop: "paymentEvidenceImg",
            align: "left",
            // hide: true,
            multiple: true,
            editDisabled: true,
            // width: 400,
            type: "upload",
            accept: ".png,.jpg,.jpeg",
            listType: "picture-card",
            limit: 5,
            action: "https://qcelf.com/tp/admin/resource/oss/upload",
            tip: "支持jpg、png格式，单张图片不超过2M，最多5张",
            propsHttp: { url: "url", res: "data" },
            uploadBefore: (file, done, loading) => {
              var fileSize = file.size / 1024 / 1024 < 2;
              if (!fileSize) {
                vm.$message.error("上传图片大小不能超过2MB!");
                loading();
              } else {
                done();
              }
            },
            rules: [
              {
                required: false,
                message: "请上传充值凭证",
                trigger: "blur",
              },
            ],
          },
          {
            label: "申请备注",
            prop: "rechargePurpose",
            editDisabled: true,
            type: "textarea",
            overHidden: true,
            rules: [
              {
                required: false,
                message: "请输入备注",
                trigger: "blur",
              },
            ],
          },
          {
            label: "审核备注",
            prop: "applyRemarks",
            addDisplay: false,
            editDisplay: true,
            type: "textarea",
            overHidden: true,
            rules: [
              {
                required: false,
                message: "请输入审核备注",
                trigger: "blur",
              },
            ],
          },
          {
            label: "驳回原因",
            prop: "rejectReason",
            addDisplay: false,
            type: "textarea",
            overHidden: true,
            rules: [
              {
                required: false,
                message: "请输入",
                trigger: "blur",
              },
            ],
          },
          {
            label: "审核状态",
            prop: "applyStatus",
            search: true,
            addDisplay: false,
            editDisplay: false,
            order: 2,
            align: "center",
            type: "select",
            showColumn: true,
            rules: [
              {
                required: true,
                message: "审核状态不能为空",
                trigger: "blur",
              },
            ],
            dicData: [
              { label: "审核通过", value: 1 },
              { label: "审核驳回", value: -1 },
              { label: "待审核", value: 0 },
            ],
          },
        ],
      },
      subLoading: false,
      data: [],
    };
  },
  created() {

  },

  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        getList({
          id: query,
          current: 1,
          size: 10,
        })
          .then((res) => {
            this.userList = res.data;
          })
          .finally(() => {
            this.searchLoading = false;
          });
      } else {
        this.options = [];
      }
    },
    userChange() {
      if (this.form.userId) {
        this.selectUserInfo = this.userList.find((item) => item.id === this.form.userId);
      }
    },
    searchReset() {
      this.search = {};
      this.query = {};
      this.page.currentPage = 1;
      this.page.pageSize = 10;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      const param = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...Object.assign(params, this.query),
      };
      if (params.gmtCreated && params.gmtCreated.length) {
        const timeArr = params.gmtCreated.split(",");
        param.gmtCreatedStart = timeArr[0];
        param.gmtCreatedEnd = timeArr[1];
      } else {
        delete params.gmtCreatedStart;
        delete params.gmtCreatedEnd;
      }
      applyList(param)
        .then((res) => {
            res.data.forEach((item) => {
              if (item.paymentEvidenceImg) {
                item.paymentEvidenceImg = item.paymentEvidenceImg.split(",");
              }
            });
            this.page.total = Number(res.total);
            this.data = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    beforeOpen(done, type) {
      if (type === "add") {
        this.maxAmount = undefined;
        this.form.currency = "CNY";
        this.option.column.forEach((item) => {
          if (item.prop === "creatorRealName") {
            item.value = this.userInfo?.account || "--";
          }
        });
      } else if (type === "edit") {
        this.form = this.rowData;
        this.maxAmount = this.form.amount;
      } else {
        this.userList = [];

        if (this.form.amount) {
          this.form.amount = this.form.amount / 100;
        }
        if (this.form.realAmount) {
          this.form.realAmount = this.form.realAmount / 100;
        }
        this.selectUserInfo = {
          avatar: this.form.avatar,
          nickname: this.form.nickname,
        };
      }
      done();
    },
    rowSave(row, done, loading) {
      const params = { ...row };
      params.paymentEvidenceImg = params.paymentEvidenceImg.join();
      params.amount = convertYuanToFen(params.amount);
      saveApply(params).then(
        () => {
          done();
          this.refreshChange();
          this.$message.success("创建成功");
        },
        (error) => {
          loading();
        },
      );
    },
    async handleAudit(type) {
      if (type === -1 && !this.form.rejectReason) {
        this.$message.error("请输入驳回原因");
        return;
      }
      this.subLoading = true;
      try {
        await balanceApply({
          id: this.form.id,
          applyStatus: type,
          amount: (this.form.amount * 100).toFixed(0),
          applyRemarks: this.form.applyRemarks || undefined,
          rejectReason: this.form.rejectReason || undefined,
        });
        this.closeDialog();
        this.subLoading = false;
        this.refreshChange();
      } catch {
        this.subLoading = false;
      }
    },
    async handleToExamine(row) {
      this.rowData = { ...row };
      this.rowData.amount = (this.rowData.amount / 100).toFixed(2);
      this.userList = [
        {
          id: this.rowData.userId,
          nickname: this.rowData.nickname,
        },
      ];
      this.selectUserInfo = { avatar: this.rowData.avatar, nickname: this.rowData.nickname };
      this.$refs.crud.rowEdit();
      // const data = { id, requisitionStatus: 1 };
      // const res = await applyDetail(data);
      // if (res?.data?.success) {
      //   this.refreshChange();
      // }
    },
    closeDialog() {
      this.$refs.crud.closeDialog();
    },
  },
};
</script>

<style>
.foreign-amount-form {
  position: relative;
}
.foreign-amount-form .foreign-amount {
  padding-left: 95px;
}
.foreign-amount-form .currency {
  position: absolute;
  left: 0;
  top: 0;
  width: 100px !important;
}
.foreign-amount-form .currency .el-input__inner {
  border-radius: 4px 0 0 4px;
}
</style>
<style lang="scss" scoped>
:deep(.avue-crud__img) {
  justify-content: flex-start;
}
.user-box {
  display: flex;
  .left {
    width: 60%;
  }
  .right {
    margin-left: 20px;
    // width: 100px;
    // height: 100px;
    // overflow: hidden;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // border-radius: 2px;
    img {
      width: 100%;
    }
  }
}
</style>

<template>
  <basic-container>
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
        <template slot="userInfo" slot-scope="{ row }">
          <div>ID：{{ row.userId }}</div>
          <div>昵称：{{ row.nickname }}</div>
        </template>
        <template slot="paymentEvidenceImg" slot-scope="{ row }">
          <el-image
            style="height: 50px"
            v-for="(img, index) in row.paymentEvidenceImg"
            :key="img"
            :src="img"
            fit="cover"
            :preview-src-list="row.paymentEvidenceImg"
          >
          </el-image>
        </template>
        <template slot="transfer" slot-scope="{ row }">
          <template v-if="row.rechargeType === 1">
            <div>转账人姓名：{{ row.remitterName }}</div>
            <div>转账银行：{{ row.remittingBank }}</div>
            <div>汇款凭证号：{{ row.referenceNo }}</div>
          </template>
        </template>
        <template slot="applyStatus" slot-scope="{ row }">
          <el-tag v-if="row.applyStatus === 0">待审核</el-tag>
          <el-tag v-else-if="row.applyStatus === 1" type="success">审核通过</el-tag>
          <el-tag v-else-if="row.applyStatus === -1" type="danger">审核驳回</el-tag>
        </template>
        <template slot="gmtCreatedSearch" slot-scope="{}">
          <el-date-picker
            v-model="search.gmtCreated"
            valueFormat="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            size="small"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="daterange"
          ></el-date-picker>
        </template>
        <template slot="transferForm" slot-scope="{ type }">
          <template v-if="form.remitterName">
            <div>转账人姓名：{{ form.remitterName }}</div>
            <div>转账银行：{{ form.remittingBank }}</div>
            <div>汇款凭证号：{{ form.referenceNo }}</div>
          </template>
          <template v-else>--</template>
        </template>
        <template slot="amountForm" slot-scope="{ type }">
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
        <template slot="realAmountForm" slot-scope="{ type }">
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
        <template slot="userIdForm" slot-scope="{ type }">
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
        <template slot="menuForm" slot-scope="{ row, index, type }">
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
        <template slot="menu" slot-scope="{ row }">
          <el-button
            v-if="permission.recharge_audit && row.applyStatus === 0"
            @click="handleToExamine(row)"
            type="text"
            size="small"
            >审核</el-button
          >
        </template>
      </avue-crud>
    </div>
  </basic-container>
</template>

<script>
import { applyList, saveApply, balanceApply, getCurrencyList } from "@/api/fund";
import { getList } from "@/api/member/user";
import { pickerOptions } from "@/util/date";
import { mapGetters } from "vuex";
import { getToken } from "@/util/auth";
import website from "@/config/website";
import { Base64 } from "js-base64";

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
      currencyList: [],
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
            value: 0,
            dicData: [
              {
                label: "不可提现余额",
                value: 0,
              },
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
            dicData: [],
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
                vm.$formatNum2(val.amount)
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
                  vm.$formatNum2(val.realAmount)
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
            action: "/resource/oss/upload",
            tip: "支持jpg、png格式，单张图片不超过2M，最多5张",
            propsHttp: { url: "url", res: "data" },
            headers: {
              Authorization: `Basic ${Base64.encode(
                `${website.clientId}:${website.clientSecret}`,
              )}`,
              "Blade-Auth": "bearer " + getToken(),
            },
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
                message: vm.$t("tip.required"),
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
  computed: {
    ...mapGetters(["permission", "userInfo"]),
  },
  created() {
    getCurrencyList().then((res) => {
      this.option.column.forEach((item) => {
        if (item.prop === "currency") {
          const data = res.data.data || [];
          data.forEach((item) => {
            item.code = String(item.code);
          });
          this.currencyList = data;
          item.dicData = data;
        }
      });
    });
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
            const { data } = res.data;
            this.userList = data.records;
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
        param.gmtCreatedStart = params.gmtCreated[0];
        param.gmtCreatedEnd = params.gmtCreated[1];
      } else {
        delete params.gmtCreatedStart;
        delete params.gmtCreatedEnd;
      }
      applyList(param)
        .then((res) => {
          if (res && res.data && res.data.data) {
            res.data.data.records.forEach((item) => {
              if (item.paymentEvidenceImg) {
                item.paymentEvidenceImg = item.paymentEvidenceImg.split(",");
              }
            });
            const data = res.data.data;
            this.page.total = Number(data.total);
            this.data = data.records;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    beforeOpen(done, type) {
      if (type === "add") {
        this.maxAmount = undefined;
        this.form.currency = "0";
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
      params.amount = this.$convertYuanToFen(params.amount);
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

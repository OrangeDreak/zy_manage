<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      :page="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="info">
        <div class="flex-row">
          <img :src="row.avatar || notAvatar" class="user-list_avatar" />
          <div class="user-list_info">
            <div>{{ row.nickname }}</div>
            <div>手机号：{{ row.mobile }}</div>
            <div>邮箱：{{ row.email }}</div>
          </div>
        </div>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button icon="el-icon-view" type="text" size="small" @click.stop="toDetail(row.id)"
          >详情</el-button
        >
        <!-- // 0正常用户，1用户不存在，2未激活，3验证码已失效，4冻结，5注销 -->
        <!-- <el-button
          v-if="permission.member_edit_delete_frozen"
          type="text"
          size="small"
          icon="el-icon-refresh"
          @click="onFrozenThaw(row)"
          >{{ row.status === 4 ? "解冻" : "冻结" }}</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="text"
          size="small"
          icon="el-icon-tickets"
          @click="addWhite(row)"
          >{{ row.userLabel === 0 ? "加白" : "解白" }}</el-button
        > -->
        <div v-if="row.status === 0 && permission.member_issue_coupon">
          <el-button type="text" size="small" icon="el-icon-s-ticket" @click="issueCoupon(row.id)"
            >发放优惠券</el-button
          >
        </div>
        <!-- <el-button
          v-if="permission.member_edit_delete_frozen"
          type="text"
          size="small"
          icon="el-icon-tickets"
          @click="markGold(row)"
          >{{ row.userIdentity === 0 ? "标记金牌商家" : "取消金牌商家" }}</el-button
        > -->
        <!-- <el-button
          v-if="permission.member_edit_delete_frozen"
          type="text"
          size="small"
          icon="el-icon-user"
          @click="setGoldConfig(row)"
          >用户类型配置</el-button
        > -->
      </template>
    </avue-crud>
    <CouponDialog ref="refCouponDialog"></CouponDialog>
    <ForwardingMerchantDialog
      ref="refForwardingMerchantDialog"
      @finish="finish"
    ></ForwardingMerchantDialog>
  </basic-container>
</template>

<script>
import { getList, toFreeze, addWhiteList, updateUserIdentity } from "@/api/member/user";
import { convertFenToYuan, notAvatar } from "@/util/commonUtil.js";
import CouponDialog from "./components/CouponDialog.vue";
import ForwardingMerchantDialog from "@/components/user/ForwardingMerchantDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "UserList",
  components: { CouponDialog, ForwardingMerchantDialog },
  data() {
    return {
      notAvatar,
      search: {},
      data: [],
      loading: true,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: "auto",
        calcHeight: 210,
        searchMenuSpan: 6,
        menuWidth: 150,
        span: 24,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "用户ID", prop: "id", search: true, editDisplay: false },
          { label: "昵称", prop: "nickname", search: true, hide: true },
          { label: "手机号", prop: "mobile", hide: true },
          { label: "邮箱", prop: "email", search: true, hide: true },
          { label: "客户信息", prop: "info", width: 220 },
          { label: "加入时间", prop: "gmtCreate" },
          { label: "最近消费时间", prop: "lastOrderTime", width: 100 },
          {
            label: "最近消费金额",
            prop: "lastOrderGmv",
            width: 100,
            html: true,
            formatter: (val) => {
              return convertFenToYuan(val.lastOrderGmv, { sign: "￥" });
            },
          },
          { label: "消费次数", prop: "orderCnt" },
          {
            label: "累计消费金额",
            prop: "orderGmv",
            width: 100,
            html: true,
            formatter: (val) => {
              return convertFenToYuan(val.orderGmv, { sign: "￥" });
            },
          },
          { label: "会员积分", prop: "memberPoint" },
          { label: "推广积分", prop: "promotionPoint" },
          { label: "会员成长值", prop: "memberGrowth" },
          { label: "上级用户ID", prop: "parentId", width: 110 },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        ...Object.assign(params, this.query),
      };
      getList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = data.records;
          this.loading = false;
        }
      });
    },

    // 点击【详情】
    toDetail(id) {
      this.$router.push(`/userDetail/index?id=${id}`);
    },
    // 点击【冻结】/【解冻】
    onFrozenThaw(val) {
      const { status, id } = val;
      // status: 0正常；1冻结
      this.$confirm(`是否确认${status ? "解冻" : "冻结"}该用户？`, {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(async () => {
          // 0解冻；1冻结
          const param = { userId: id, status: status === 1 ? 0 : 1 };
          const { data = {} } = await toFreeze(param);
          if (data.success) {
            this.onLoad(this.page);
            this.$message.success("操作成功!");
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        })
        .catch(() => {});
    },
    addWhite(row) {
      this.$confirm(`是否确认${row.userLabel ? "解除白名单" : "加入白名单"}？`, {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      }).then(() => {
        addWhiteList({
          userId: row.id,
          userLabel: row.userLabel === 1 ? 0 : 1,
        }).then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
      });
    },
    issueCoupon(id) {
      this.$refs.refCouponDialog.show(id);
    },
    setGoldConfig(row) {
      this.$refs.refForwardingMerchantDialog.show({ userId: row.id });
    },
    markGold(row) {
      this.$confirm(`是否确认${row.userIdentity ? "解除金牌商家" : "标记金牌商家"}？`, {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      }).then(() => {
        updateUserIdentity({
          userId: row.id,
          userIdentity: row.userIdentity === 1 ? 0 : 1,
        }).then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
      });
    },
    finish() {
      this.onLoad(this.page);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.user-list {
  &-input-with-select {
    // width: 400px;
    // margin-right: 24px;
  }

  &-search {
    font-size: 14px;
    width: 120px;
  }

  &_info {
    line-height: 1.5;
  }

  &_avatar {
    width: 50px;
    height: 50px;
    border-radius: 3px;
    object-fit: cover;
    margin-right: 8px;
  }
}
</style>
<style>
.user-list-input-with-select .el-select .el-input {
  width: 100px;
}

.user-list-input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.user-list-select .el-input {
  width: 300px;
}
</style>

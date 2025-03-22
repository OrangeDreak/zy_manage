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
      <template slot-scope="{ row }" #info="scope">
        <div class="flex-row">
          <img :src="row.avatar || notAvatar" class="user-list_avatar" />
          <div class="user-list_info">
            <div>{{ scope.row.nickname }}</div>
            <div>手机号：{{ scope.row.mobile }}</div>
            <div>邮箱：{{ scope.row.email }}</div>
          </div>
        </div>
      </template>
      <template #menu="scope, index">
        <el-button icon="el-icon-view" type="text" size="small" @click.stop="toDetail(scope.row.id)"
        >详情</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, toFreeze} from "@/api/member/user";
import { convertFenToYuan, notAvatar } from "@/utils/commonUtil.js";
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

export default {
  name: "UserList",
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
          {
            label: "账户余额",
            prop: "availableBalance",
            width: 100,
            html: true,
            formatter: (val) => {
              return convertFenToYuan(val.userBalanceVO.availableBalance, { sign: "￥" });
            },
          },
          {
            label: "欠款",
            prop: "debtBalance",
            width: 100,
            html: true,
            formatter: (val) => {
              return convertFenToYuan(val.userBalanceVO.debtBalance, { sign: "￥" });
            },
          },
        ],
      },
    };
  },
  computed: {

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
          this.page.total = Number(res.total || 0);
          this.data = res.data;
          this.loading = false;
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
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        })
        .catch(() => {});
    },
    finish() {
      this.onLoad(this.page);
    },
  },
};
</script>
<style lang="scss" scoped>

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

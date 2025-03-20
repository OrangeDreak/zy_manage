<template>
  <div class="basic-container">
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      :page="page"
      rowKey="orderId"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
    >
      <template #menu="scope, index">
        <div v-if="scope.row.trackingList">
        <el-button type="text" @click="toDetail(scope.row)">查看物流</el-button>
        </div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getForwardingList } from "@/api/order";
import { pickerOptions } from "@/utils/date";
import '@smallwei/avue/lib/index.css';
import "@/styles/flex.scss";
import "@/styles/commonStyle.scss";
import { ref } from "vue";
export default {
  name: "ForwardingOrderList",
  data() {
    return {
      search: {
        gmtCreateTime: [],
        gmtPaySuccess: [],
      },
      data: [],
      tabsList: [],
      loading: false,
      purchaseId: "",
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        searchSpan: 6,
        searchMenuSpan: 24,
        searchMenuPosition: "right",
        menuWidth: 200,
        searchLabelWidth: 100,
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "订单ID", prop: "id" },
          { label: "用户昵称", prop: "nickName" },
          { label: "用户ID", prop: "userId", search: true },
          { label: "用户编码", prop: "userNo", search: true },
          {
            label: "物流信息",
            prop: "trackingNumber",
            search: true,
            html: true,
            formatter: (val) => {
              return `<div>物流公司:${val.logisticsCompany === "" ? "--" : val.logisticsCompany}</div><div>物流单号:${
                val.logisticsNumber || "--"
              }</div>`;
            },
          },
          {
            label: "订单状态",
            prop: "status",
            searchClearable: true,
            search: true,
            type: "select",
            dicData: [
              {
                label: "已录入",
                value: 0,
              },
              {
                label: "已QC",
                value: 1,
              },
              {
                label: "已发货",
                value: 2,
              },
              {
                label: "已完成",
                value: 3,
              },
              {
                label: "退货",
                value: 4,
              },
              {
                label: "已取消",
                value: -1,
              },
            ],
            align: "center",
            formatter: (val) => {
              return val.statusDesc;
            },
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            // search: true,
            width: 90,
            type: "daterange",
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => val.gmtCreate,
          },
        ],
      },
    };
  },
  created() {
    // 获取搜索项的订单状态
    this.onLoad(this.page, this.query);
  },
  methods: {
    handleClick() {
      this.page.currentPage = 1;
      this.query.status = this.search.orderStatus;
      this.onLoad(this.page, this.query);
    },
    searchChange(params, done) {
      if (params.gmtCreateTime && params.gmtCreateTime.length) {
        params.startGmtCreateTime = params.gmtCreateTime[0];
        params.endGmtCreateTime = params.gmtCreateTime[1];
      } else {
        delete params.startGmtCreateTime;
        delete params.endGmtCreateTime;
      }
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.search.status = "";
      this.query = {
        status: "",
      };
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      const param = {
        pageNo: page.currentPage,
        pageSize: page.pageSize,
        ...Object.assign(params, this.query),
      };
      getForwardingList(param)
        .then((res) => {
          console.log(res);
          this.page.total = res.total || 0;
          this.data = res.data;
          console.log(1);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 点击【详情】
    toDetail(id) {
      this.$router.push(`/order/forwarding-detail/${id}`);
    },
    finish() {
      this.refreshChange();
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

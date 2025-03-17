<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      v-model="form"
      :page="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!-- <template slot="expand" slot-scope="{ row }">
        <div class="message">{{ row.userName }}：{{ item.content }}</div>
      </template> -->
      <template slot="subOrderNo" slot-scope="{ row }">
        <div class="sub-order-no">
          {{ row.subOrderNo }}
          <el-badge :value="row.unReadCount" :max="99" :hidden="!row.unReadCount" />
        </div>
      </template>
      <template slot="menu" slot-scope="{ row }">
        <el-button type="text" @click="goDetail(row)">查看留言</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getMessageList } from "@/api/customer/session";
import { mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      form: {},
      search: {},
      loading: true,
      data: [],
      option: {
        searchMenuSpan: 16,
        searchSpan: 8,
        labelWidth: 140,
        searchLabelWidth: 100,
        defaultExpandAll: false,
        searchMenuPosition: "right",
        menuWidth: 180,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        column: [
          {
            label: "留言时间",
            prop: "gmtCreated",
          },
          {
            label: "用户昵称",
            prop: "userName",
          },
          {
            label: "用户ID",
            prop: "userId",
          },
          {
            label: "订单ID",
            prop: "orderId",
          },
          {
            label: "子订单编号",
            prop: "subOrderNo",
            search: true,
          },
        ],
      },
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  mounted() {
    this.GetMessageNum();
  },
  methods: {
    ...mapActions(["GetMessageNum"]),
    goDetail(row) {
      let path;
      let query = {};
      if (row.purchaseOrderId) {
        path = "/order/purchase-list";
        query.orderId = row.orderId;
      } else {
        path = "/order/detail/" + row.orderId;
      }
      const route = this.$router.resolve({
        path: path,
        query,
      });
      window.open(route.href, "_blank");
    },
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
      getMessageList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total);
          this.data = data.records;
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sub-order-no {
  padding: 10px 0;
}
</style>

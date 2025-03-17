<template>
  <basic-container>
    <el-form :model="formInline" label-width="100px" size="small">
      <el-row>
        <el-col :span="8">
          <el-form-item label="优惠券Code">
            <el-input style="width: 100%" v-model="formInline.code" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠券类型">
            <el-select
              v-model="formInline.couponType"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="运费抵扣券" value="0"></el-option>
              <el-option label="运费折扣券" value="2"></el-option>
              <el-option label="客服补贴券" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="优惠券状态">
            <el-select
              v-model="formInline.status"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option label="已下架" value="0"></el-option>
              <el-option label="已启用" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="适用国家">
            <el-select v-model="formInline.countryId" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in countryData"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="优惠券名称">
            <el-input v-model="formInline.name" placeholder="请输入" style="width: 100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发行余量">
            <!-- <el-select
              v-model="formInline.stockResidueSymbol"
              placeholder="请选择"
              style="width: 40%"
            >
              <el-option label="小于" value="0"></el-option>
              <el-option label="等于" value="1"></el-option>
              <el-option label="大于" value="2"></el-option>
            </el-select>
            <el-input
              v-model="formInline.stockResidue"
              placeholder="请输入"
              style="width: 60%"
            ></el-input> -->

            <el-input
              placeholder="请输入"
              v-model="formInline.stockResidue"
              class="input-with-select"
              style="width: 100%"
            >
              <el-select
                v-model="formInline.stockResidueSymbol"
                slot="prepend"
                placeholder="请选择"
                class="select-with-input"
              >
                <el-option label="小于" value="0"></el-option>
                <el-option label="等于" value="1"></el-option>
                <el-option label="大于" value="2"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="onSubmit" size="small"
              >查询</el-button
            >
            <el-button icon="el-icon-delete" @click="refresh" size="small">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row type="flex" justify="end">
        <el-col :offset="20" :span="4">
          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="small"
              >查询</el-button
            >
            <el-button @click="refresh" size="small">清空</el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- 表单 -->
    </el-form>

    <div style="margin-bottom: 2vh">
      <el-button type="primary" icon="el-icon-circle-plus" size="small" @click="addCoupon()"
        >新增</el-button
      >
      <el-button type="success" size="small" @click="basic()">基础配置</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      header-cell-style="text-align:center"
      cell-style="text-align:center"
    >
      <el-table-column prop="code" label="优惠券code" width="100"> </el-table-column>
      <el-table-column prop="name" label="优惠券名称" width="120"> </el-table-column>

      <el-table-column prop="couponTypeName" label="优惠券类型" width="100"> </el-table-column>
      <el-table-column prop="content" label="优惠内容" width="150"> </el-table-column>
      <el-table-column prop="statusName" label="生效状态" width="100"> </el-table-column>
      <el-table-column prop="expiryDate" label="用券有效期" min-width="200">
        <!-- 两种显示样式判断 -->
        <!-- <template slot-scope="scope">
          {{ scope.row }}~{{ scope.row.endTime }}
        </template> -->
      </el-table-column>
      <el-table-column prop="stockTotal" label="总库存" width="100">
        <template slot-scope="{ row }">{{ $formatNum(row.stockTotal) }}</template>
      </el-table-column>
      <el-table-column prop="stockOut" label="已领取" width="80"> </el-table-column>
      <el-table-column prop="stockVerify" label="已核销" width="80"> </el-table-column>
      <el-table-column prop="countryName" label="适用国家" width="100"> </el-table-column>
      <!-- <el-table-column prop="updaterRealName" label="更新人" width="100"> </el-table-column> -->
      <el-table-column prop="gmtModified" label="更新时间" min-width="200"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" type="text">详情</el-button>
          <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
          <el-button style="margin-left: 0" type="text" @click="copy(scope.row.id)">复制</el-button>
          <el-button
            v-if="scope.row.status"
            type="text"
            @click="statusChange(scope.row.id, scope.row.status)"
            >下架</el-button
          >
          <el-button
            v-if="!scope.row.status && permission.coupon_listing"
            type="text"
            @click="statusChange(scope.row.id, scope.row.status)"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      background
      :page-size="page.pageSize"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="page.total"
      style="margin-top: 2vh"
    >
    </el-pagination>
  </basic-container>
</template>

<script>
import { getCountry, getDetail, listData, changeStatusApi } from "../../api/operate/coupon";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      formInline: {
        code: null,
        couponType: null,
        countryId: null,
        name: null,
        stockResidueSymbol: null,
        stockResidue: null,
        status: null,
      },
      loading: true,
      tableData: [],
      // currentPage4: 1,
      // total: 0,
      // size: 10,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      countryData: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created() {
    this.getTableList();
    this.country();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.page.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.page.currentPage = val;
      this.getTableList();
    },
    onSubmit() {
      this.page.currentPage = 1;
      console.log(this.formInline, "查询");
      this.getTableList(this.formInline);
    },
    handleClick(row) {
      console.log(row);
      this.$router.push({
        path: "/operate/coupon/couponDetail",
        query: { id: row },
      });
    },
    addCoupon() {
      this.$router.push({ path: "/operate/coupon/addCoupon", query: { type: "add" } });
    },
    basic() {
      this.$router.push({ path: "/operate/coupon/couponBasic" });
    },
    refresh() {
      this.page.currentPage = 1;
      this.formInline = {
        code: null,
        couponType: null,
        countryId: null,
        name: null,
        stockResidueSymbol: null,
        stockResidue: null,
      };
      this.getTableList();
    },
    getTableList(data) {
      const pageData = {
        size: this.page.pageSize,
        current: this.page.currentPage,
      };
      const params = { ...this.formInline, ...pageData };
      // listData(params).then((res) => {
      //   // console.log(res, "res");
      //   if (res && res.status === 200) {
      //     this.tableData == res.data.data.records;
      //     console.log(this);
      //     console.log(this.tableData, "res", res.data.data.records);
      //   }
      // });
      listData(params)
        .then((res) => {
          if (res && res.data && res.data.data) {
            // console.log(this);
            const data = res.data.data;
            // this.page.total = data.total;
            this.tableData = data.records;
            this.page.total = Number(data.total || 0);
            this.loading = false;
            // this.size = data.size;
          }
        })
        .finally(() => {
          // this.loading = false;
        });
    },
    country(params) {
      getCountry(params).then((res) => {
        const countryData = res.data.data;
        this.countryData = countryData;
        // console.log(countryData, "国家列表");
      });
    },
    edit(row) {
      this.$router.push({
        path: "/operate/coupon/addCoupon",
        query: { id: row, type: "edit" },
      });
    },
    copy(row) {
      this.$router.push({
        path: "/operate/coupon/addCoupon",
        query: { id: row, type: "copy" },
      });
    },
    // 上下架
    statusChange(id, status) {
      // 0 下架状态 1 上架状态
      const data = { id, status: status == 0 ? 1 : 0 };
      console.log(id, status);
      changeStatusApi(data).then((res) => {
        console.log(res, "res");
        this.getTableList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-select .el-input {
  // width: 130px;
}

.select-with-input {
  width: 100px;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>

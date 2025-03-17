<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :search.sync="search"
      v-model="form"
      :page="page"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ size }" slot="search">
        <el-form ref="refStateForm" :size="size" :model="search" label-width="80px">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="商品价格:">
                <div class="flex-row">
                  <el-input-number
                    v-model="search.priceStart"
                    style="flex-grow: 1"
                    :precision="2"
                    :min="0"
                    clearable
                    :controls="false"
                    placeholder="请输入最低价"
                  />

                  <div class="ml8 mr8">-</div>
                  <el-input-number
                    v-model="search.priceEnd"
                    style="flex-grow: 1"
                    :precision="2"
                    :min="0"
                    :controls="false"
                    placeholder="请输入最高价"
                  />
                  <div class="ml8">元</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品名称:" prop="productName">
                <el-input
                  v-model="search.productName"
                  placeholder="请输入 商品名称"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间:" prop="gmtCreated">
                <el-date-picker
                  v-model="search.gmtCreated"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  @change="changeTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <!-- <template slot="productPriceHandledSearch" slot-scope="{ size }">
        <div class="flex-row">
          <el-input-number
            v-model="search.priceStart"
            style="flex-grow: 1"
            :precision="2"
            :size="size"
            placeholder="请输入最低价"
          />

          <div class="ml8 mr8">-</div>
          <el-input-number
            v-model="search.priceEnd"
            style="flex-grow: 1"
            :precision="2"
            :size="size"
            placeholder="请输入最高价"
          />
          <div class="ml8">元</div>
        </div>
      </template> -->
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" icon="el-icon-edit" size="small" @click.stop="onEdit(row)"
          >编 辑</el-button
        >
        <!-- 商品状态 0:下架 1:上架 -->
        <el-button
          type="text"
          icon="el-icon-refresh"
          size="small"
          @click.stop="updateStatus(row)"
          >{{ row.productStatus ? "下架" : "上架" }}</el-button
        >
      </template>
    </avue-crud>
    <Edit v-if="showEditPop" :showPop.sync="showEditPop" :form="form" @onSubmit="refreshChange" />
  </basic-container>
</template>

<script>
// import { pickerOptions } from "@/util/date";
import { convertFenToYuan } from "@/util/commonUtil.js";
import { getList, detail, remove, update } from "@/api/goods/goods";
import Edit from "@/components/pops/goods/Edit.vue";

export default {
  components: { Edit },
  data() {
    return {
      form: {},
      search: {
        priceStart: undefined,
        priceEnd: undefined,
        productName: undefined,
        gmtCreated: [],
      },
      loading: true,
      data: [],
      option: {
        viewBtn: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        searchMenuSpan: 24,
        labelWidth: 120,
        searchLabelWidth: 100,
        searchMenuPosition: "right",
        column: [
          { label: "商品ID", prop: "productId" },
          {
            label: "商品名称",
            prop: "productName",
            overHidden: true,
          },
          { label: "商品主图", prop: "productImage", type: "upload" },
          { label: "商品价格", prop: "productPriceHandled" },
          { label: "商品原价", prop: "productOriginalPriceHandled" },
          { label: "商品类目", prop: "productCategoryName" },
          { label: "平台类型", prop: "platformTypeDesc" },
          { label: "商品销量", prop: "productSoldAmount" },
          { label: "商品库存", prop: "productStock" },
          { label: "创建时间", prop: "gmtCreated" },
          { label: "商品状态", prop: "productStatusDesc" },
          { label: "商品重量尺寸", prop: "productSizeDesc", hide: true },
        ],
      },
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "1天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "3天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
        disabledDate: (time) => {
          return time.getTime() < new Date(2021, 10 - 1, 1);
        },
      },
      showEditPop: false,
    };
  },
  created() {},
  methods: {
    changeTime(val) {
      if (val && val.length) {
        this.search.gmtCreatedStart = val[0];
        this.search.gmtCreatedEnd = val[1];
      } else {
        this.search.gmtCreatedStart = null;
        this.search.gmtCreatedEnd = null;
      }
    },
    searchChange(params, done) {
      console.log(params);
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    searchReset() {
      this.search.priceStart = undefined;
      this.search.priceEnd = undefined;
      this.$refs.refStateForm.resetFields();
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

      param.priceStart =
        this.query.priceStart != undefined && this.query.priceEnd != undefined
          ? ((param.priceStart * 10000) / 100).toFixed(0)
          : undefined;
      param.priceEnd =
        this.query.priceStart != undefined && this.query.priceEnd != undefined
          ? ((param.priceEnd * 10000) / 100).toFixed(0)
          : undefined;
      if (
        param.priceStart != undefined &&
        param.priceEnd != undefined &&
        param.priceEnd < param.priceStart
      ) {
        this.$message.error("最高价不得低于最低价");
        this.loading = false;
        return;
      }
      if (!param.gmtCreated) {
        this.search.gmtCreatedStart = null;
        this.search.gmtCreatedEnd = null;
      }
      getList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total || 0);
          this.data = data.records.map((item) => this.handleData(item));
          this.loading = false;
        }
      });
    },
    handleData(val = {}) {
      val.productSizeDesc = "";
      if (val.productSize) {
        const { weight, length, width, height } = val.productSize;
        weight && (val.productSizeDesc = `重量：${weight}克；`);
        length && (val.productSizeDesc = `${val.productSizeDesc}长度：${length}CM；`);
        width && (val.productSizeDesc = `${val.productSizeDesc}宽度：${width}CM；`);
        height && (val.productSizeDesc = `${val.productSizeDesc}高度：${height}CM；`);
      } else {
        val.productSize = {};
      }
      val.productPriceHandled = convertFenToYuan(val.productPrice, {
        sign: "￥",
      });
      val.productOriginalPriceHandled = convertFenToYuan(val.productOriginalPrice, { sign: "￥" });
      return val;
    },
    // 编辑
    onEdit(row) {
      const param = {
        productId: row.productId,
        platformType: row.platformType,
      };
      detail(param).then((res) => {
        if (res && res.data && res.data.data) {
          this.form = this.handleData(res.data.data);
          this.showEditPop = true;
        }
      });
    },
    // 删除
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const param = {
            productId: row.productId,
            platformType: row.platformType,
          };
          return remove(param);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message.success("操作成功!");
        });
    },
    // 显示弹窗
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        const param = {
          productId: this.form.productId,
          platformType: this.form.platformType,
        };
        detail(param).then((res) => {
          if (res && res.data && res.data.data) {
            this.form = this.handleData(res.data.data);
          }
        });
      }
      done();
    },
    updateStatus(row) {
      const { productStatus } = row;
      // productStatus商品状态 0:下架 1:上架
      this.$confirm(`是否确认${productStatus ? "下架" : "上架"}该商品？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const param = { ...row, productStatus: productStatus === 1 ? 0 : 1 };
          const { data = {} } = await update(param);
          if (data.success) {
            this.onLoad(this.page);
            this.$message.success("操作成功!");
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>

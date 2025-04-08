<template>
  <div class="basic-container">
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :search.sync="search"
      :page="page"
      @row-save="rowSave"
      @row-del="rowDel"
      :before-open="beforeOpen"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="addTimeSearch" slot-scope="{}">
        <el-date-picker
          v-model="search.addTime"
          valueFormat="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          size="small"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          type="daterange"
        ></el-date-picker>
      </template>
      <template slot="rateForm" slot-scope="{}">
        <el-input-number
          v-model="form.rate"
          :precision="4"
          style="width: 100%"
          :controls="false"
          :min="0"
          placeholder="请输入汇率"
        ></el-input-number>
      </template>
      <template slot="addTimeForm" slot-scope="{}">
        <el-date-picker
          v-model="form.addTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择日期"
        >
        </el-date-picker>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, saveRate, delRate } from "@/api/exchange";
import { pickerOptions } from "@/util/date";
import dayjs from "dayjs";

export default {
  data() {
    return {
      rowId: null,
      form: {},
      search: {},
      loading: true,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        height: "auto",
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        span: 24,
        tip: false,
        dialogWidth: "30%",
        addBtn: true,
        editBtn: false,
        delBtn: true,
        column: [
          {
            label: "汇率",
            prop: "rate",
            rules: [{ required: true, message: "请输入汇率", trigger: "blur" }],
          },
          {
            label: "汇率类型",
            prop: "currency",
            type: "select",
            rules: [{ required: true, message: "请选择汇率类型", trigger: "change" }],
            value: 1,
            // formatter: (val) => {
            //   return getLabel()
            // }
            dicData: [{"value":1, "label":"USD"}],
          },
          {
            label: "汇率日期",
            prop: "addTime",
            search: true,
            pickerOptions: pickerOptions,
            rules: [{ required: true, message: "请选择汇率日期", trigger: "change" }],
            formatter: (val) => val.addTime,
          },
        ],
      },
      data: [],
      showEditPop: false,
    };
  },
  methods: {
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
        current: page.currentPage,
        size: page.pageSize,
        ...Object.assign(params, this.query),
      };
      if (param.addTime && param.addTime.length) {
        param.beginTime = param.addTime[0];
        param.endTime = param.addTime[1];
      }
      getList(param).then((res) => {
        this.page.total = Number(res.total || 0);
        this.data = res.data;
        this.loading = false;
      });
    },
    beforeOpen(done, type) {
      this.form.addTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      console.log(this.form);
      done();
    },
    rowSave(row, done, loading) {
      saveRate(row).then(
        () => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          loading();
        },
      );
    },
    // 点击【删除】
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delRate({ id: row.id });
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
  },
};
</script>

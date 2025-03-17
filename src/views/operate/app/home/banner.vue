<template>
  <div class="banner">
    <avue-crud
      ref="crud"
      :option="option"
      :table-loading="loading"
      :data="bannerList"
      :search.sync="search"
      :page="page"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="menu">
        <!-- <el-button type="text" size="small" @click="toView(row)"
          >查看</el-button
        > -->
        <!-- <el-button type="text" @click="changeStatus(row)">{{
          row.status ? "下架" : "上架"
        }}</el-button> -->
        <el-popconfirm
          v-if="row.status == 1"
          title="确认下架吗？"
          @confirm="changeStatus(row)"
        >
          <el-button style="margin: 0 7px" slot="reference" type="text"
            >下架</el-button
          >
        </el-popconfirm>
        <el-popconfirm
          v-if="row.status == 0"
          title="确认上架吗？"
          @confirm="changeStatus(row)"
        >
          <el-button style="margin: 0 7px" slot="reference" type="text"
            >上架</el-button
          >
        </el-popconfirm>
        <el-button type="text" @click="editBanner(row)">编辑</el-button>
        <el-popconfirm title="确定删除吗？" @confirm="delBanner(row.id)">
          <el-button style="margin: 0 7px" type="text" slot="reference"
            >删除</el-button
          >
        </el-popconfirm>
      </template>
      <template slot-scope="{ row }" slot="link">
        <a
          v-if="row.info && row.info.length"
          style="color: #409eff"
          target="_brank"
          :href="row.info[0].linkUrl"
          >{{ row.info[0].linkUrl }}</a
        >
      </template>
      <template slot-scope="{ row }" slot="banner">
        <el-image
          v-for="(item, i) in row.info"
          :key="i"
          style="width: 80px; height: 40px"
          :src="item.picture"
          :preview-src-list="row.srcList"
        >
        </el-image>
      </template>
      <template slot="menuLeft">
        <div class="menu-left">
          <span>国家：</span>
          <el-select
            v-model="search.countryId"
            size="small"
            style="margin-right: 7px"
            clearable
            placeholder="请选择国家"
            @change="countryChange"
          >
            <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addScreen"
            >新增</el-button
          >

          <el-popconfirm title="确定删除吗？" @confirm="mostDel">
            <el-button
              type="danger"
              size="small"
              slot="reference"
              icon="el-icon-delete"
              :loading="mostDelLoading"
              >批量删除</el-button
            >
          </el-popconfirm>
        </div>
      </template>
    </avue-crud>
    <BannerDialog ref="BannerDialogRef" @finish="finish" />
  </div>
</template>

<script>
import { bannerList, bannerStatusChange, bannerDel } from "@/api/operate/app";
import { pickerOptions } from "@/util/date";
import { getLabel } from "@/util/util";
import BannerDialog from "./components/bannerDialog.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      bannerList: [],
      loading: false,
      search: {
        countryId: "",
      },
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      mostDelLoading: false,
      selections: [],
      option: {
        // height: "auto",
        // calcHeight: 210,
        // header: false,
        selection: true,
        menuWidth: 250,
        searchMenuSpan: 4,
        searchLabelWidth: 100,
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "ID", prop: "id" },
          { label: "banner标题", prop: "name" },
          {
            label: "国家",
            prop: "countryId",
            type: "select",
            filterable: true,
            props: { label: "areaName", value: "id" },
            dicData: [],
            formatter: (val) => val.countryName,
          },
          // {
          //   label: "背景色值",
          //   prop: "status",
          //   type: "select",
          //   dicData: [],
          // },
          {
            label: "打开次数",
            prop: "clickCount",
          },
          {
            label: "链接",
            prop: "link",
          },
          {
            label: "图片",
            prop: "banner",
          },
          {
            label: "轮播间隔时间",
            prop: "timeInterval",
            formatter: (val) => val.timeInterval + "s",
          },
          {
            label: "状态",
            prop: "status",
            formatter: (val) =>
              getLabel(val.status, [
                {
                  label: "已上架",
                  value: 1,
                },
                {
                  label: "已下架",
                  value: 0,
                },
              ]),
          },
          {
            label: "开始时间",
            prop: "startTime",
            type: "daterange",
            // search: true,
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            pickerOptions: pickerOptions,
            formatter: (val) => val.startTime,
          },
          {
            label: "结束时间",
            prop: "endTime",
            // search: true,
          },
        ],
      },
    };
  },
  components: { BannerDialog },
  computed: {
    ...mapState({
      areaList: (state) => state.logistics.areaList,
    }),
  },
  watch: {
    areaList() {
      console.log(this.areaList);
      this.option.column.some((item) => {
        if (item.prop === "country") {
          item.dicData = this.areaList;
          return true;
        }
      });
    },
  },
  created() {
    // this.option.column.some((item) => {
    //   if (item.prop === "country") {
    //     item.dicData = this.areaList;
    //   }
    // });
  },
  methods: {
    addScreen() {
      this.$refs.BannerDialogRef.show({
        title: "新增",
      });
    },
    mostDel() {
      if (this.selections.length) {
        console.log(this.selections);
        const ids = this.selections.map((item) => item.id);
        this.mostDelLoading = true;
        bannerDel({ ids })
          .then(() => {
            this.$message.warning("批量删除成功");
            this.page.currentPage = 1;
            this.onLoad(this.page, this.query);
          })
          .finally(() => {
            this.mostDelLoading = false;
          });
      } else {
        this.$message.warning("请勾选banner");
      }
    },
    selectionChange(list) {
      this.selections = list;
      // this.$message.success('选中的数据'+ JSON.stringify(list));
    },
    toView(row) {
      this.$refs.BannerDialogRef.show({ title: "查看", item: row });
    },
    editBanner(row) {
      this.$refs.BannerDialogRef.show({
        title: "编辑",
        item: {
          id: row.id,
          name: row.name,
          countryId: row.countryId,
          timeInterval: row.timeInterval,
          info: row.info,
          position: String(row.position),
          timeRange: [row.startTime, row.endTime],
          status: row.status,
        },
      });
    },
    delBanner(id) {
      bannerDel({ ids: [id] }).then(() => {
        this.$message.success("删除成功");
        this.refreshChange();
      });
    },
    changeStatus(row) {
      bannerStatusChange({
        id: row.id,
        status: row.status ? 0 : 1,
      }).then(() => {
        row.status = row.status ? 0 : 1;
        this.$message.success(row.status ? "上架成功" : "下架成功");
      });
    },
    countryChange() {
      this.query.countryId = this.search.countryId;
      this.page.currentPage = 1;
      this.refreshChange();
    },
    searchChange(params, done) {
      if (params.gmtCreateTime && params.gmtCreateTime.length) {
        this.search.startGmtCreateTime = val[0];
        this.search.endGmtCreateTime = val[1];
      } else {
        delete this.search.startGmtCreateTime;
        delete this.search.endGmtCreateTime;
      }
      if (params.gmtPaySuccess && params.gmtPaySuccess.length) {
        this.search.startPaySuccessTime = val[0];
        this.search.endPaySuccessTime = val[1];
      } else {
        delete this.search.startPaySuccessTime;
        delete this.search.endPaySuccessTime;
      }
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
      this.selections = [];
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        ...Object.assign(params, this.query),
      };
      bannerList(param)
        .then((res) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            this.page.total = Number(data.total || 0);
            data.records.forEach((item) => {
              item.srcList = item.info.map((child) => child.picture);
            });
            this.bannerList = data.records;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$refs.BannerDialogRef.hide();
    },
    finish() {
      this.page.currentPage = 1;
      this.refreshChange();
    },
  },
};
</script>

<style lang="scss" scoped>
.banner {
  :deep(.el-tabs--border-card) {
    box-shadow: none;
  }
  .menu-left {
    white-space: nowrap;
    font-weight: normal;
    font-size: 14px;
    // span {
    //   display: inline-block;
    //   width: 100px;
    //   text-align: right;
    // }
  }
}
</style>

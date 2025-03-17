<template>
  <div class="screen">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="开屏广告" name="screen">
        <avue-crud
          :option="option"
          :table-loading="loading"
          :data="screenList"
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
            <el-button type="text" @click="toView(row)">查看</el-button>
            <el-button type="text" @click="toEdit(row)">编辑</el-button>
            <el-popconfirm v-if="row.status == 1" title="确认下架吗？" @confirm="changeStatus(row)">
              <el-button style="margin: 0 7px" slot="reference" type="text">下架</el-button>
            </el-popconfirm>
            <el-popconfirm v-if="row.status == 0" title="确认上架吗？" @confirm="changeStatus(row)">
              <el-button style="margin: 0 7px" slot="reference" type="text">上架</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定删除吗？" @confirm="delScreen(row.id)">
              <el-button style="margin: 0 7px" type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
          <!-- <template slot-scope="{ row }" slot="status">
            {{ row.statusDesc }}
          </template> -->
          <!-- <template slot="menuLeft">
            <div class="menu-left">
              <span>国家：</span>
              <el-select
                v-model="country"
                size="small"
                style="margin-right: 7px"
                clearable
                placeholder="请选择国家"
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
                >添加开屏</el-button
              >
            </div>
          </template> -->
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
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addScreen"
                >添加开屏</el-button
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
      </el-tab-pane>
    </el-tabs>
    <ScreenDialog ref="screenDialogRef" @finish="finish" />
  </div>
</template>

<script>
import { screenList, screenDel, screenChangeStatus } from "@/api/operate/app";
import { pickerOptions } from "@/util/date";
import { getLabel } from "@/util/util";
import ScreenDialog from "./components/screenDialog.vue";
import { mapState } from "vuex";
export default {
  data() {
    return {
      activeName: "screen",
      screenList: [],
      loading: false,
      search: {
        country: "",
        status: "",
        id: "",
        name: "",
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
          { label: "开屏广告ID", prop: "id" },
          { label: "开屏广告名称", prop: "name" },
          {
            label: "国家",
            prop: "country",
            type: "select",
            // search: true,
            filterable: true,
            props: { label: "areaName", value: "id" },
            dicData: [],
            formatter: (val) => val.countryName,
          },
          // {
          //   label: "订单状态",
          //   prop: "status",
          //   search: true,
          //   type: "select",
          //   dicData: [],
          // },
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
          },
          {
            label: "状态",
            // searchOrder: 4,
            prop: "status",
            // search: true,
            type: "select",
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
        ],
      },
    };
  },
  components: { ScreenDialog },
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
      this.$refs.screenDialogRef.show({
        title: "新增",
      });
    },
    toView(row) {
      this.$refs.screenDialogRef.show({
        title: "查看",
        item: {
          name: row.name,
          countryId: row.countryName,
          allowSkip: String(row.allowSkip),
          putDuration: row.putDuration,
          putDurationMine:
            row.putDuration != 3 || row.putDuration != 5 ? String(row.putDuration) : "",
          putType: String(row.putType),
          fileUrl: row.picture,
          linkType: String(row.linkType),
          timeRange: row.startTime + " 至 " + row.endTime,
          linkUrl: row.linkUrl,
        },
      });
    },
    toEdit(row) {
      this.$refs.screenDialogRef.show({
        title: "编辑",
        item: {
          id: row.id,
          name: row.name,
          countryId: row.countryId,
          allowSkip: String(row.allowSkip),
          putDuration:
            row.putDuration != 3 || row.putDuration != 5 ? "-1" : String(row.putDuration),
          putDurationMine:
            row.putDuration != 3 || row.putDuration != 5 ? String(row.putDuration) : "",
          putType: String(row.putType),
          fileUrl: row.picture,
          linkType: String(row.linkType),
          timeRange: [row.startTime, row.endTime],
          linkUrl: row.linkUrl,
        },
      });
    },
    finish() {
      this.page.currentPage = 1;
      this.refreshChange();
    },
    countryChange() {
      this.query.countryId = this.search.countryId;
      this.page.currentPage = 1;
      this.refreshChange();
    },
    delScreen(id) {
      screenDel({ ids: [id] }).then(() => {
        this.$message.success("删除成功");
        this.page.currentPage = 1;
        this.refreshChange();
      });
    },
    mostDel() {
      if (this.selections.length) {
        const ids = this.selections.map((item) => item.id);
        this.mostDelLoading = true;
        screenDel({ ids })
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
    changeStatus(row) {
      screenChangeStatus({
        id: row.id,
        status: row.status ? 0 : 1,
      }).then(() => {
        row.status = row.status ? 0 : 1;
        this.$message.success(row.status ? "上架成功" : "下架成功");
      });
    },
    searchChange(params, done) {
      if (params.gmtCreateTime && params.gmtCreateTime.length) {
        this.search.startGmtCreateTime = val[0];
        this.search.endGmtCreateTime = val[1];
      } else {
        this.search.startGmtCreateTime = null;
        this.search.endGmtCreateTime = null;
      }
      if (params.gmtPaySuccess && params.gmtPaySuccess.length) {
        this.search.startPaySuccessTime = val[0];
        this.search.endPaySuccessTime = val[1];
      } else {
        this.search.startPaySuccessTime = null;
        this.search.endPaySuccessTime = null;
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
      screenList(param)
        .then((res) => {
          if (res && res.data && res.data.data) {
            const data = res.data.data;
            this.page.total = Number(data.total || 0);
            this.screenList = data.records;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.screen {
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

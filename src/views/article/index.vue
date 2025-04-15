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
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" @click="toDetail(row.id)">查看</el-button>
        <el-button type="text" style="margin: 0 7px" @click="onEdit(row.id)"
          >编辑</el-button
        >
        <el-popconfirm
          v-if="row.status == 0"
          title="确认发布吗？"
          @confirm="onRelease(row.id)"
        >
          <el-button style="margin: 0 7px" slot="reference" type="text"
            >发布</el-button
          >
        </el-popconfirm>
        <el-popconfirm
          v-if="row.status == 1"
          title="确认下线吗？"
          @confirm="onDown(row.id)"
        >
          <el-button style="margin: 0 7px" slot="reference" type="text"
            >下线</el-button
          >
        </el-popconfirm>
        <el-popconfirm
          v-if="row.status == 2"
          title="确认上线吗？"
          @confirm="onLine(row.id)"
        >
          <el-button style="margin: 0 7px" slot="reference" type="text"
            >上线</el-button
          >
        </el-popconfirm>

        <el-popconfirm title="确定删除该文章吗？" @confirm="onDel(row.id)">
          <el-button type="text" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
      <template slot-scope="{ row }" slot="status">
        <el-tag type="success" v-if="row.status === 1">已上线</el-tag>
        <el-tag type="danger" v-else-if="row.status === 0">未发布</el-tag>
        <el-tag type="info" v-else>已下线</el-tag>
      </template>
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="createArticle"
          >新建文章</el-button
        >
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  articleList,
  articleStatusChange,
  articleDel,
  articleCategoryAllList,
} from "@/api/article";
import "@/styles/flex.scss";
import "@/styles/commonStyle.scss";
import '@smallwei/avue/lib/index.css';
export default {
  components: {},
  data() {
    return {
      search: {},
      data: [],
      tabsList: [],
      loading: false,
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: "auto",
        // calcHeight: 210,
        border: true,
        searchMenuSpan: 6,
        searchMenuPosition: "right",
        menuWidth: 250,
        menuAlign: "center",
        align: "center",
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          { label: "文章名称", prop: "name", search: true, searchOrder: 3 },
          {
            label: "栏目名称",
            prop: "articleCategoryId",
            search: true,
            type: "select",
            props: {
              label: "name",
              value: "id",
            },
            searchOrder: 1,
            dicData: [],
            formatter: (val) => val.articleCategoryName,
          },
          { label: "创建人", prop: "creatorName" },
          {
            label: "语言",
            prop: "languageEnName",
          },
          { label: "序号", prop: "sort" },
          {
            label: "创建时间",
            prop: "gmtCreate",
            // search: true,
            type: "daterange",
            searchRange: true,
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            defaultTime: ["00:00:00", "23:59:59"],
            formatter: (val) => val.gmtCreate,
          },
          {
            label: "状态",
            prop: "status",
            search: true,
            searchOrder: 2,
            type: "select",
            dicData: [
              {
                label: "未发布",
                value: 0,
              },
              {
                label: "已上线",
                value: 1,
              },
              {
                label: "已下线",
                value: 2,
              },
            ],
          },
        ],
      },
      reasonList: [],
    };
  },
  created() {
    // 获取所有栏目列表
    articleCategoryAllList().then((res) => {
      this.option.column[1].dicData = res.data.data || [];
    });
  },
  methods: {
    onDown(id) {
      articleStatusChange({
        id,
        status: 2,
      }).then(() => {
        this.refreshChange();
        this.$message.success("文章已下线");
      });
    },
    onLine(id) {
      articleStatusChange({
        id,
        status: 1,
      }).then(() => {
        this.refreshChange();
        this.$message.success("文章已上线");
      });
    },
    onRelease(id) {
      articleStatusChange({
        id,
        status: 1,
      }).then(() => {
        this.refreshChange();
        this.$message.success("文章已上线");
      });
    },
    createArticle() {
      this.$router.push(`/article/detail`);
    },
    // 编辑
    toDetail(id) {
      this.$router.push(`/article/view?id=${id}`);
    },
    onEdit(id) {
      this.$router.push(`/article/detail?id=${id}`);
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
      this.search.orderStatus = "0";
      this.query = {
        orderStatus: "0",
      };
      this.onLoad(this.page, this.query);
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
      // if (param.orderStatus == 0) {
      //   delete param.orderStatus;
      // }
      articleList(param)
        .then((res) => {
          if (res) {
            this.page.total = Number(res.total || 0);
            this.data = res.data || [];
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    onDel(id) {
      articleDel({ id: id }).then(() => {
        this.$message.success("删除成功");
        this.page.currentPage = 1;
        this.refreshChange();
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>

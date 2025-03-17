<template>
  <avue-crud
    :option="option"
    :table-loading="loading"
    :data="data"
    :page="page"
    @current-change="currentChange"
    @size-change="sizeChange"
    @refresh-change="refreshChange"
    @on-load="onLoad"
  />
</template>

<script>
import { listPromotionPoint } from "@/api/member/user";

export default {
  props: {
    userId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      loading: true,
      data: [],
      option: {
        addBtn: false,
        menu: false,
        column: [
          {
            label: "推广积分类型",
            prop: "pointTypeName",
            formatter: (val) => {
              // return getLabel(val.changeType, pointsTypeMap);
              return "推广积分类型";
            },
          },
          { label: "变动推广积分", prop: "changeValue" },
          { label: "剩余推广积分", prop: "afterValue" },
          { label: "备注", prop: "remark" },
          { label: "创建时间", prop: "gmtCreate" },
        ],
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    refreshChange() {
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page) {
      this.loading = true;
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        userId: this.userId,
      };
      listPromotionPoint(param).then((res) => {
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


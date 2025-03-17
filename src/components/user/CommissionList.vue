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
import { commissionList } from "@/api/member/user";
import { getLabel } from "@/util/util";
import { convertFenToYuan } from "@/util/commonUtil.js";

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
          { label: "用户ID", prop: "userId" },
          { label: "关系", prop: "level" },
          {
            label: "包裹订单号",
            prop: "packageNo",
            // formatter: (val) => {
            //   return convertFenToYuan(val.price, { sign: "￥" });
            // },
          },

          { label: "佣金生效时间", prop: "collectibleTime" },
          {
            label: "佣金待领取(￥)",
            prop: "commission",
            formatter: (val) => {
              return convertFenToYuan(val.commission, { sign: "￥" });
            },
          },
          {
            label: "佣金状态",
            prop: "accepted",
            formatter: (val) => {
              return getLabel(val.accepted, [
                {
                  label: "未领取",
                  value: -1,
                },
                {
                  label: "冻结",
                  value: 0,
                },
                {
                  label: "已领取",
                  value: 1,
                },
                {
                  label: "已过期",
                  value: 2,
                },
              ]);
            },
          },
          { label: "佣金过期时间", prop: "expireTime" },
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
    convertFenToYuan,
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
      commissionList(param).then((res) => {
        if (res && res.data && res.data.data) {
          const data = res.data.data;
          this.page.total = Number(data.total);
          this.data = data.records;
        }
        this.loading = false;
      });
    },
  },
};
</script>


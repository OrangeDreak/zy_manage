<template>
  <basic-container class="fs14" v-loading="loading">
    <UserInfo :info="userInfo" />
    <Account class="mt24" :info="userInfo" />
    <el-tabs
      class="mt24"
      v-model="activeTab"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.label"
        :name="item.value"
      />
    </el-tabs>
    <Basics v-if="activeTab === '1'" :info="userInfo" />
    <OrderList v-if="activeTab === '2'" :userId="userId" />
    <PointsList v-if="activeTab === '3'" :userId="userId" />
    <PromotionPointList v-if="activeTab === '4'" :userId="userId" />
    <GrowthList v-if="activeTab === '5'" :userId="userId" />
    <CommissionList v-if="activeTab === '6'" :userId="userId" />
  </basic-container>
</template>

<script>
import { getDetail } from "@/api/member/user";
import { getUrlParamJs } from "@/util/commonUtil.js";
import UserInfo from "@/components/user/UserInfo.vue";
import Account from "@/components/user/Account.vue";
import Basics from "@/components/user/Basics.vue";
import OrderList from "@/components/user/OrderList.vue";
import PointsList from "@/components/user/PointsList.vue";
import PromotionPointList from "@/components/user/PromotionPointList.vue";
import GrowthList from "@/components/user/GrowthList.vue";
import CommissionList from "@/components/user/CommissionList.vue";

export default {
  components: {
    UserInfo,
    Account,
    Basics,
    OrderList,
    PointsList,
    PromotionPointList,
    GrowthList,
    CommissionList,
  },
  provide() {
    return {
      ON_SEARCH_USER_DETAIL: this.getDetail,
    };
  },
  data() {
    return {
      loading: false,
      activeTab: "1",
      tabList: [
        { label: "基本信息", value: "1" },
        { label: "交易明细", value: "2" },
        { label: "会员积分明细", value: "3" },
        { label: "推广积分明细", value: "4" },
        { label: "成长值明细", value: "5" },
        { label: "佣金明细", value: "6" },
      ],
      userId: null,
      userInfo: {},
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (getUrlParamJs("id")) {
      this.userId = getUrlParamJs("id");
    }
    this.getDetail();
  },
  methods: {
    async getDetail() {
      this.loading = true;
      const { data = {} } = await getDetail({ userId: this.userId });
      this.loading = false;
      this.userInfo = data.data || {};
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>

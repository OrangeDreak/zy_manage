<template>
  <div class="flex">
    <div class="w40b">
      <el-card shadow="never">
        <div class="consumption_title">消费信息</div>
        <div class="box">
          <div class="item">
            <div class="fw6 mb16">最近消费</div>
            <div class="flex-row mb10">
              <div>最近消费时间：</div>
              <div>{{ info.lastOrderTime || "-" }}</div>
            </div>
            <div class="flex-row mb10">
              <div>最近消费金额：</div>
              <div>
                {{ info.lastOrderGmv | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="fw6 mb16">累计消费&售后</div>
            <div class="flex-row mb10">
              <div>总消费金额：</div>
              <div>{{ info.orderGmv | convertFenToYuan({ sign: "￥" }) }}</div>
            </div>
            <div class="flex-row mb10">
              <div>总消费次数：</div>
              <div>{{ info.orderCnt || 0 }}</div>
            </div>
            <div class="flex-row mb10">
              <div>总售后金额：</div>
              <!-- TODO:字段待后端确认 -->
              <div>
                {{ info.afterSaleAmount | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>总售后次数：</div>
              <!-- TODO:字段待后端确认 -->
              <div>{{ info.afterSaleCount || 0 }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="grow">
      <el-card shadow="never">
        <div class="consumption_title">账户资产</div>
        <div class="box property">
          <div class="item">
            <div class="fw6 mb16">余额明细</div>
            <div class="flex-row mb10">
              <div>可用余额：</div>
              <div>
                {{ info.userBalanceVO?.availableBalance | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>不可提现金额：</div>
              <div>
                {{ info.userBalanceVO?.nonWithdrawBalance | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>欠款金额：</div>
              <div>
                {{ info.userBalanceVO?.debtBalance | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>冻结金额：</div>
              <div>
                {{ info.userBalanceVO?.freezeBalance | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>

            <div class="flex-row mb10">
              <div>联盟提现金额：</div>
              <div>
                {{ info.userBalanceVO?.withdrawLeagueBalance | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="fw6 mb16">佣金</div>
            <div class="flex-row mb10">
              <div>当前账户佣金：</div>
              <div>
                {{ info.nowCommission | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>累积领取佣金：</div>
              <div>
                {{ info.receiveCommission | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>待领取佣金：</div>
              <div>
                {{ info.unReceiveCommission | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>已提现佣金：</div>
              <div>
                {{ info.withdrawalCommission | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
            <div class="flex-row mb10">
              <div>失效佣金：</div>
              <div>
                {{ info.expireCommission | convertFenToYuan({ sign: "￥" }) }}
              </div>
            </div>
          </div>
          <div class="item">
            <div class="fw6 mb16">积分</div>
            <div class="flex-row mb10">
              <div>会员积分：</div>
              <div>{{ info.memberPoint || 0 }}</div>
            </div>
            <div class="flex-row mb10">
              <div>推广积分：</div>
              <div>{{ info.promotionPoint || 0 }}</div>
            </div>
            <div class="flex-row mb10">
              <div>会员成长值：</div>
              <div>{{ info.memberGrowth || 0 }}</div>
            </div>
          </div>
          <div class="item">
            <div class="fw6 mb16">优惠券</div>
            <div class="flex-row mb10">
              <div>未使用：</div>
              <div>{{ info.usableCouponCount || 0 }}张</div>
            </div>
            <div class="flex-row mb10">
              <div>已使用：</div>
              <div>{{ info.usedCouponCount || 0 }}张</div>
            </div>
            <div class="flex-row mb10">
              <div>已过期：</div>
              <div>{{ info.expireCouponCount || 0 }}张</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { convertFenToYuan } from "@/util/commonUtil.js";

export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
  filters: {
    convertFenToYuan,
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.consumption {
  &_title {
    color: #767676;
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
  }
}
.grow {
  flex-grow: 1;
  padding-left: 10px;
}
.box {
  display: flex;
  min-height: 190px;
  flex-wrap: wrap;
  .item {
    flex: 1;
  }
}
.property {
  .item {
    flex: none;
    min-width: 190px;
    width: 25%;
  }
}
</style>

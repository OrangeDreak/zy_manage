<template>
  <div class="flex-row">
    <div class="avatar-wrap">
      <img :src="info.avatar || notAvatar" class="user_avatar" />
      <div v-if="[1, 4].includes(info.status)" class="tag">
        {{ info.status === 1 ? "已冻结" : info.status === 4 ? "已锁定" : "" }}
      </div>
    </div>
    <div>
      <div class="flex-row">
        <div class="flex-row mr40">
          <div class="fw6">昵称：</div>
          <div>{{ info.nickname }}</div>
        </div>
        <div class="flex-row mr40">
          <div class="fw6">用户ID：</div>
          <div>{{ info.id }}</div>
        </div>
        <div class="flex-row mr40">
          <div class="fw6">加入时间：</div>
          <div>{{ info.gmtCreate }}</div>
        </div>
      </div>
      <div class="mt16">
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="warning"
          size="small"
          @click="changeStatus('frozen')"
          >{{ info.status === 1 ? "解冻用户" : "冻结用户" }}</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="warning"
          size="small"
          @click="changeStatus('bind')"
          >{{ info.status === 4 ? "解除锁定" : "锁定用户" }}</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="warning"
          size="small"
          @click="addWhite"
          >{{ info.userLabel === 0 ? "加入白名单" : "解除白名单" }}</el-button
        >
        <!-- <el-button
          v-if="permission.member_edit_delete_frozen"
          type="primary"
          size="small"
          @click="markGold"
          >{{ info.userIdentity === 0 ? "标记金牌商家" : "取消金牌商家" }}</el-button
        > -->
      </div>
      <div class="mt16">
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="primary"
          size="small"
          icon="el-icon-user"
          @click="setGoldConfig"
          >用户类型配置</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="primary"
          size="small"
          @click="
            showChangePointsPop = true;
            changeType = 1;
          "
          >修改会员积分</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="primary"
          size="small"
          @click="
            showChangePointsPop = true;
            changeType = 2;
          "
          >修改推广积分</el-button
        >
        <el-button
          v-if="permission.member_edit_delete_frozen"
          type="primary"
          size="small"
          @click="
            showChangePointsPop = true;
            changeType = 3;
          "
          >修改会员成长值</el-button
        >
        <el-button
          v-if="info.status === 0 && permission.member_issue_coupon"
          type="primary"
          size="small"
          icon="el-icon-s-ticket"
          @click="issueCoupon"
          >发放优惠券</el-button
        >
      </div>
    </div>
    <div v-if="[1, 4].includes(info.status)" class="reason">
      <el-form>
        <el-form-item
          :label="(info.status === 1 ? '冻结' : info.status === 4 ? '锁定' : '') + '原因：'"
          >{{ info.updateStatusReason }}</el-form-item
        >
      </el-form>
    </div>
    <ChangePoints
      v-if="showChangePointsPop"
      :showPop.sync="showChangePointsPop"
      :changeType="changeType"
      :info="info"
    />
    <CouponDialog ref="refCouponDialog"></CouponDialog>
    <ForwardingMerchantDialog
      ref="refForwardingMerchantDialog"
      @finish="ON_SEARCH_USER_DETAIL"
    ></ForwardingMerchantDialog>
    <ChangeStatusDialog
      ref="refChangeStatusDialog"
      @finish="ON_SEARCH_USER_DETAIL"
    ></ChangeStatusDialog>
  </div>
</template>

<script>
import { changeUserStatus, addWhiteList, updateUserIdentity } from "@/api/member/user";
import { notAvatar } from "@/util/commonUtil.js";
import ChangePoints from "@/components/pops/user/ChangePoints.vue";
import CouponDialog from "@/views/member/components/CouponDialog.vue";
import ForwardingMerchantDialog from "./ForwardingMerchantDialog.vue";
import ChangeStatusDialog from "./ChangeStatusDialog.vue";
import { mapGetters } from "vuex";

export default {
  inject: ["ON_SEARCH_USER_DETAIL"],
  components: { ChangePoints, CouponDialog, ForwardingMerchantDialog, ChangeStatusDialog },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      notAvatar,
      changeType: null,
      showChangePointsPop: false,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  created() {},
  methods: {
    // 点击【冻结】/【解冻】,【锁定】/【解锁】
    changeStatus(type) {
      const { status, id } = this.info;
      // status: 0正常；1冻结；4锁定
      let changeStatus = null;
      let title = "";
      if (type === "frozen") {
        changeStatus = status === 1 ? 0 : 1;
        title = changeStatus === 1 ? "冻结用户" : "解冻用户";
      } else if (type === "bind") {
        changeStatus = status === 4 ? 0 : 4;
        title = changeStatus === 4 ? "锁定用户" : "解锁用户";
      }
      if (changeStatus === 0) {
        this.$confirm(`是否确认${title}？`, {
          confirmButtonText: "确认",
          cancelButtonText: "我再想想",
          type: "warning",
        })
          .then(async () => {
            const param = { userId: id, status: changeStatus };
            const { data = {} } = await changeUserStatus(param);
            if (data.success) {
              this.$message.success("操作成功!");
              this.ON_SEARCH_USER_DETAIL();
            } else {
              this.$message.error(data.msg || "操作失败");
            }
          })
          .catch(() => {});
      } else {
        this.$refs.refChangeStatusDialog.show({
          userId: id,
          status: changeStatus,
          title,
        });
      }
    },
    addWhite() {
      this.$confirm(`是否确认${this.info.userLabel ? "解除白名单" : "加入白名单"}？`, {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      }).then(() => {
        addWhiteList({
          userId: this.info.id,
          userLabel: this.info.userLabel === 1 ? 0 : 1,
        }).then(() => {
          this.$message.success("操作成功!");
          this.ON_SEARCH_USER_DETAIL();
        });
      });
    },
    markGold() {
      this.$confirm(`是否确认${this.info.userIdentity ? "解除金牌商家" : "标记金牌商家"}？`, {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      }).then(() => {
        updateUserIdentity({
          userId: this.info.id,
          userIdentity: this.info.userIdentity === 1 ? 0 : 1,
        }).then(() => {
          this.ON_SEARCH_USER_DETAIL();
          this.$message.success("操作成功!");
        });
      });
    },
    setGoldConfig() {
      this.$refs.refForwardingMerchantDialog.show({ userId: this.info.id });
    },
    issueCoupon() {
      this.$refs.refCouponDialog.show(this.info.id);
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.avatar-wrap {
  position: relative;
  margin-right: 24px;
  .user_avatar {
    margin-right: 0;
  }
  .tag {
    color: #fff;
    padding: 4px 6px;
    font-size: 14px;
    position: absolute;
    right: 0;
    top: 0;
    font-weight: 500;
    border-radius: 0px 0 0 4px;
    background-color: red;
    // background-color: rgba(224, 240, 247, 0.8);
  }
}
.user {
  &_avatar {
    width: 116px;
    height: 116px;
    border-radius: 3px;
    object-fit: cover;
    margin-right: 24px;
  }
}
</style>

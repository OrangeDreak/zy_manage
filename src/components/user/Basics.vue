<template>
  <div class="mb40">
    <div class="fw6 mb16">基本信息</div>
    <div class="flex-row mb10">
      <div class="flex-row w50b">
        <div class="basics_title">姓名</div>
        <div class="w500">{{ info.realName }}</div>
      </div>
      <div class="flex-row w50b">
        <div class="basics_title">生日</div>
        <div class="w500">{{ info.birthday }}</div>
      </div>
    </div>
    <div class="flex-row mb10">
      <div class="flex-row w50b">
        <div class="basics_title">年龄</div>
        <div class="w500">{{ info.age }}</div>
      </div>
      <div class="flex-row w50b">
        <div class="basics_title">性别</div>
        <div class="w500">{{ info.sexName }}</div>
      </div>
    </div>
    <div class="flex-row mb10">
      <div class="flex-row w50b">
        <div class="basics_title">邮箱</div>
        <div class="w500">{{ info.email }}</div>
      </div>
      <!-- <div class="flex-row w50b">
        <div class="basics_title">城市</div>
        <div class="w500">{{ info.country }}{{ info.province }}{{ info.area }}</div>
      </div> -->
    </div>
    <!-- <div class="flex-row mb10">
      <div class="flex-row w50b">
        <div class="basics_title">详细地址</div>
        <div class="w500">{{ info.address }}</div>
      </div>
    </div> -->
    <el-form ref="form" :model="info" label-width="80px" label-position="left">
      <el-form-item label="备注">
        <el-input
          v-model="info.remark"
          placeholder="请输入"
          type="textarea"
          :rows="4"
          class="w40b"
        />
        <el-button
          class="ml24"
          type="primary"
          plain
          size="small"
          :disabled="loading"
          @click="onSave"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <div class="fw6 mb16 mt24">账户信息</div>
    <div class="flex-row mb10">
      <div class="flex-row w50b">
        <div class="basics_title">会员等级</div>
        <div class="w500">{{ info.memberGradeName }}</div>
      </div>
      <div class="flex-row">
        <div class="basics_title">权益卡</div>
        <div class="w500">{{ info.memberEquity }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateRemark } from "@/api/member/user";

export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // formData: { remark: null },
      loading: false,
    };
  },
  // watch: {
  //   'info.remark': {
  //     handler(val) {
  //       this.formData.remark = val;
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },
  computed: {},
  created() {},
  methods: {
    async onSave() {
      this.loading = true;
      const { id, remark } = this.info;
      const param = { userId: id, remark };
      const { data } = await updateRemark(param);
      this.loading = false;
      if (data.success) this.$message.success("修改用户备注成功！");
    },

    async getDetail() {
      this.loading = true;
      const { data = {} } = await getDetail({ userId: this.userId });
      this.loading = false;
      this.userInfo = data.data;
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";

.basics {
  &_title {
    width: 80px;
  }
}
</style>

<template>
  <el-dialog :title="title" :visible.sync="showPop" width="50%" :before-close="closePop">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="left">
      <el-form-item :label="title" prop="value">
        <el-input v-model="form.value" placeholder="请输入"/>
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input v-model="form.remark" placeholder="请输入" type="textarea" :rows="4"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="closePop">取消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changePromotionPoint, changeMemberPoint, changeMemberGrowth } from "@/api/member/user";

export default {
  inject: ['ON_SEARCH_USER_DETAIL'],
  components: { },
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    changeType: {
      type: Number,
      default: null,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      title: null,
      form: { value: null, remark: null },
      rules: {
        value: [
          { required: true, message: '请输入修改内容', trigger: ['blur', 'change'], },
        ],
        remark: [
          { required: true, message: '请输入修改原因', trigger: ['blur', 'change'], },
        ],
      },
      apiMap: { 1:changeMemberPoint, 2:changePromotionPoint,  3:changeMemberGrowth },
    };
  },
  watch: {
    changeType: {
      handler(val) {
        const { memberPoint, promotionPoint, memberGrowth} = this.info;
        switch (val) {
          case 1:
            this.title = '修改会员积分';
            this.form.value = memberPoint;
            break;
          case 2:
            this.title = '修改推广积分';
            this.form.value = promotionPoint;
            break;
          case 3:
            this.title = '修改会员成长值';
            this.form.value = memberGrowth;
            break;
          default:
            break;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() { },
  methods: {
    // 关闭弹窗
    closePop() {
      this.$emit('update:showPop', false);
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const param = { userId: this.info.id, ...this.form };
          const { data = {} } = await this.apiMap[this.changeType](param);
          if (data.success) {
            this.$message.success('操作成功!');
            this.closePop();
            this.ON_SEARCH_USER_DETAIL();
          } else {
            this.$message.error(data.msg || "操作失败");
          }
        }
      });
    },
  },
  filters: {},
};
</script>

<style lang="scss" scoped>
@import '@/styles/flex.scss';
@import '@/styles/commonStyle.scss';
</style>

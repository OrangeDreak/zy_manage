<template>
  <el-dialog
    title="编辑"
    :visible.sync="showPop"
    width="50%"
    :before-close="closePop"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
      label-position="left"
    >
      <div class="fw6 mb20">销售信息</div>
      <el-form-item label="上架状态" required>
        <el-radio-group v-model="form.productStatus">
          <el-radio :label="0">下架</el-radio>
          <el-radio :label="1">上架</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="fw6 mb20">重量和尺寸信息</div>
      <el-form-item label="实际重量(克)" prop="productSize.weight">
        <el-input-number
          v-model="form.productSize.weight"
          :controls="false"
          :min="0"
          style="width: 100%"
          :precision="0"
          placeholder="请输入"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="长度(CM)" prop="productSize.length">
        <el-input-number
          v-model="form.productSize.length"
          :controls="false"
          :min="0"
          style="width: 100%"
          :precision="1"
          placeholder="请输入"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="宽度(CM)" prop="productSize.width">
        <el-input-number
          v-model="form.productSize.width"
          :controls="false"
          :min="0"
          style="width: 100%"
          :precision="1"
          placeholder="请输入"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="高度(CM)" prop="productSize.height">
        <el-input-number
          v-model="form.productSize.height"
          :controls="false"
          :min="0"
          style="width: 100%"
          :precision="1"
          placeholder="请输入"
        >
        </el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="small" @click="closePop">取消</el-button>
      <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { update } from "@/api/goods/goods";

export default {
  components: {},
  props: {
    showPop: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rules: {
        "productSize.weight": [
          {
            required: true,
            message: "请输入实际重量",
            trigger: ["blur", "change"],
          },
        ],
        "productSize.length": [
          {
            required: true,
            message: "请输入长度",
            trigger: ["blur", "change"],
          },
        ],
        "productSize.width": [
          {
            required: true,
            message: "请输入宽度",
            trigger: ["blur", "change"],
          },
        ],
        "productSize.height": [
          {
            required: true,
            message: "请输入高度",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    // 关闭弹窗
    closePop() {
      this.$emit("update:showPop", false);
    },
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { form } = this;
          const { data = {} } = await update(form);
          if (data.success) {
            this.$message.success("操作成功!");
            this.closePop();
            this.$emit("onSubmit");
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
@import "@/styles/flex.scss";
@import "@/styles/commonStyle.scss";
</style>

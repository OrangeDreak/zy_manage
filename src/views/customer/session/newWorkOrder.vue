<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="addDialogColse"
    class="dialog"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="工单分类" prop="classification">
        <el-select
          v-model="ruleForm.classification"
          placeholder="请选择工单分类"
        >
          <el-option label="分类一" value="shanghai"></el-option>
          <el-option label="分类二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工单标题" prop="title">
        <el-input
          v-model="ruleForm.title"
          placeholder="请输入工单标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="工单描述" prop="describe">
        <el-input
          v-model="ruleForm.describe"
          type="textarea"
          :rows="4"
          placeholder="请输入工单描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <div size="small" type="primary">
            添加附件（最多上传5个附件，单个文件最大20M）
          </div>
          <!-- <div slot="tip" class="el-upload__tip">
            添加附件（最多上传5个附件，单个文件最大20M）
          </div> -->
        </el-upload>
      </el-form-item>
      <el-form-item label="抄送人" prop>
        <el-select
          v-model="ruleForm.data1"
          filterable
          placeholder="请选择或输入搜索内容"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 往往 -->

      <el-form-item label="优先级">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="低"></el-radio>
          <el-radio label="中"></el-radio>
          <el-radio label="高"></el-radio>
          <el-radio label="紧急"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="工单状态">
        <el-select v-model="ruleForm.region" placeholder="请选择工单分类">
          <el-option label="未分类" value="shanghai"></el-option>
          <el-option label="待处理" value="beijing"></el-option>
          <el-option label="处理中" value="beijing"></el-option>
          <el-option label="已解决" value="beijing"></el-option>
          <el-option label="已关闭" value="beijing"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客服受理组">
        <el-select
          v-model="ruleForm.data1"
          filterable
          placeholder="请选择或输入搜索内容"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="受理客服">
        <el-select
          v-model="ruleForm.data1"
          filterable
          placeholder="请选择或输入搜索内容"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属客户">
        <el-select
          v-model="ruleForm.data1"
          filterable
          placeholder="请选择或输入搜索内容"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clean()" spain class="cleanBtn" size="mini"
        >清空</el-button
      >

      <el-button @click="dialogClose()" size="small">关闭</el-button>
      <el-button
        record
        type="primary"
        @click="submitForm('ruleForm')"
        v-if="title != '详情'"
        size="small"
        >保存</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      title: "会话信息",
      count: 0,
      labelPosition: "right",
      ruleForm: {
        classification: null,
        title: null,
        describe: null,
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },

      rules: {
        classification: [
          { required: true, message: "请选择工单分类", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入工单标题", trigger: "blur" }],
        describe: [
          { required: true, message: "请输入工单描述", trigger: "blur" },
        ],

        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  methods: {
    open(data) {
      this.visible = true;
      this.title = data.title;
      // if (data.title == "详情") {
      //   console.log(this.disableButton, "butt");
      // }
      console.log(data, "data");
      if (data.id) {
        this.id = data.id;
        this.getDetail(data.id);
      }
    },
    clean() {
      this.ruleForm = {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      };
    },
    dialogClose() {
      this.visible = false;
    },
    submitForm() {
      console.log("提交");
      this.$refs.form.validate((valid) => {
        console.log(valid, "valid");
        if (valid) {
          // }
          this.$message.success("创建工单成功");
          this.dialogClose();
        } else {
          this.$message({
            type: "error",
            message: "请输入必填项",
          });
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 上传前
    beforeUpload(file) {
      const isLt20m = file.size / 1024 / 1024 < 20;
      console.log(isLt20m);
      console.log(file, "beforeFile");
      if (!isLt20m) {
        this.$message.error("上传单文件大小不能超过 20Mb!");
        return false;
      }
    },
    beforeRemove(file) {
      console.log(file, "remove");
      // 删除失败return
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  .cleanBtn {
    border: none;
    background-color: transparent;
  }
}
</style>

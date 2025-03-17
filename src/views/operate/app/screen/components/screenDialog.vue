<template>
  <el-dialog
    :visible.sync="visible"
    :title="title + '开屏'"
    :close-on-click-modal="title === '查看' ? true : false"
    @closed="onClose"
  >
    <div class="screen-outer">
      <div class="form">
        <el-form
          ref="refFormState"
          :model="formState"
          :rules="rules"
          :validate-on-rule-change="false"
          label-width="140px"
        >
          <el-form-item label="主题名称：" prop="name">
            <template v-if="title === '查看'">{{ formState.name }}</template>
            <el-input
              size="small"
              style="width: 240px"
              v-else
              placeholder="请输入主题名称"
              v-model="formState.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="国家：" prop="countryId">
            <template v-if="title === '查看'">{{
              formState.countryId
            }}</template>
            <el-select
              v-else
              v-model="formState.countryId"
              filterable
              size="small"
              style="width: 240px"
              placeholder="请选择国家"
            >
              <el-option
                v-for="item in areaList"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :style="{ display: title != '查看' ? 'block' : 'none' }"
            label="上传素材："
            prop="fileUrl"
          >
            <!-- 'video/mp4',
                'video/ogg',
                'video/flv',
                'video/avi',
                'video/wmv',
                'video/rmvb',
                'video/mov', -->
            <el-upload
              ref="fileUpload"
              class="avatar-uploader"
              size="small"
              :accept="['image/jpeg', 'image/jpg', 'image/png', 'image/gif']"
              :action="`${$root1}/resource/oss/upload`"
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
              :show-file-list="true"
            >
              <!-- <i class="el-icon-upload" /> -->
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="tips">
              图片（jpg/png/jpeg/GIF格式）建议尺寸：750*1334px，2M内
            </div>
          </el-form-item>
          <el-form-item label="投放类型：" prop="putType" style="display: none">
            <el-radio-group size="small" v-model="formState.putType">
              <el-radio label="0">内部</el-radio>
              <el-radio label="1">外部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="投放时长：" prop="putDuration">
            <template v-if="title === '查看'">{{
              formState.putDuration + "s"
            }}</template>
            <el-radio-group
              size="small"
              v-else
              v-model="formState.putDuration"
              @change="putDurationChange"
            >
              <el-radio label="3">3s</el-radio>
              <el-radio label="5">5s</el-radio>
              <el-radio label="-1">自定义</el-radio>
            </el-radio-group>
            <!-- <div v-if="formState.putDuration === '-1'">
              <el-input-number
                v-model="formState.putDurationMine"
                placeholder="请输入投放时长"
                size="small"
                style="width: 180px"
                :controls="false"
              >
              </el-input-number
              >&nbsp;&nbsp;&nbsp;s
            </div> -->
          </el-form-item>
          <el-form-item
            v-if="formState.putDuration == '-1' && title != '查看'"
            label=""
            prop="putDurationMine"
          >
            <el-input
              v-model="formState.putDurationMine"
              placeholder="请输入投放时长"
              size="small"
              style="width: 180px"
              @input="putDurationMineIpt"
              @blur="putDurationMineBlur"
            >
              <template slot="append">s</template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否允许跳过：" prop="allowSkip">
            <template v-if="title === '查看'">{{
              formState.allowSkip === "0"
                ? "允许"
                : formState.allowSkip === "1"
                ? "不允许（不允许跳过时长）"
                : "允许关闭"
            }}</template>
            <el-radio-group size="small" v-else v-model="formState.allowSkip">
              <el-radio label="0">允许</el-radio>
              <el-radio label="1">不允许（不允许跳过时长）</el-radio>
              <el-radio label="2">允许关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生效时间：" prop="timeRange">
            <template v-if="title === '查看'">{{
              formState.timeRange
            }}</template>
            <el-date-picker
              v-else
              v-model="formState.timeRange"
              type="daterange"
              :default-time="['00:00:00', '23:59:59']"
              range-separator=":"
              size="small"
              style="width: 240px"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="跳转类型：" prop="linkType">
            <template v-if="title === '查看'">{{
              formState.linkType == "0" ? "H5" : "APP"
            }}</template>
            <el-radio-group size="small" v-else v-model="formState.linkType">
              <el-radio label="0">H5</el-radio>
              <el-radio label="1">APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="跳转链接：" prop="linkUrl">
            <template v-if="title === '查看'">{{ formState.linkUrl }}</template>
            <el-input
              size="small"
              style="width: 240px"
              v-else
              v-model="formState.linkUrl"
              placeholder="请输入跳转链接"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="view">
        <div class="title">预览</div>
        <div :class="['box', checkFileType() ? 'no-border' : '']">
          <img :src="formState.fileUrl" style="width: 100%" alt="" />
          <!-- <video
            v-if="checkFileType() === 'video'"
            width="252"
            height="450"
            controls
            :src="formState.fileUrl"
          ></video> -->
        </div>
        <!-- <el-button type="primary" @click="onView">预览</el-button> -->
      </div>
    </div>
    <span v-if="title != '查看'" slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="subForm"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { screenDetail, screenAdd, screenEdit } from "@/api/operate/app";
export default {
  data() {
    return {
      title: "",
      visible: false,
      loading: false,
      formState: {
        id: "",
        name: "",
        countryId: "",
        putDuration: "",
        putDurationMine: "",
        putType: "0",
        fileUrl: "",
        allowSkip: "",
        timeRange: [],
        linkType: "",
        linkUrl: "",
      },
      form: null,
      defaultFormState: {
        id: "",
        name: "",
        countryId: "",
        putDuration: "",
        putDurationMine: "",
        putType: "0",
        fileUrl: null,
        allowSkip: "",
        timeRange: [],
        linkType: "",
        linkUrl: "",
      },
      rules: {},
      defaultRules: {
        name: [
          {
            required: true,
            message: "请输入开屏主题名称",
            trigger: "blur",
          },
        ],
        countryId: [
          {
            required: true,
            message: "请选择国家",
            trigger: "change",
          },
        ],
        fileUrl: [
          {
            required: true,
            message: "请上传素材",
            trigger: "change",
          },
        ],
        allowSkip: [
          {
            required: true,
            message: "请选择是否允许跳过",
            trigger: "change",
          },
        ],
        timeRange: [
          {
            required: true,
            message: "请选择生效时间",
            trigger: "change",
          },
        ],
        putDuration: [
          {
            required: true,
            message: "请选择投放时长",
            trigger: "change",
          },
        ],
        putDurationMine: [
          {
            required: true,
            message: "请输入投放时长",
            trigger: "blur",
          },
        ],
        linkType: [
          {
            required: true,
            message: "请选择跳转类型",
            trigger: "change",
          },
        ],
        linkUrl: [
          {
            required: true,
            message: "请输入跳转链接",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      areaList: (state) => state.logistics.areaList,
    }),
  },
  methods: {
    checkFileType() {
      let type = "";
      if (this.formState.fileUrl) {
        const fileType = this.formState.fileUrl.substr(
          this.formState.fileUrl.length - 4
        );
        const imgs = ["jpeg", ".jpg", ".png", ".gif"];
        if (imgs.includes(fileType)) {
          type = "image";
        } else {
          type = "video";
        }
      }
      return type;
    },
    subForm() {
      // this.formState.fileUrl =
      //   "https://vd4.bdstatic.com/mda-pmi98dypxg1mkve3/sc/cae_h264/1702982064415139617/mda-pmi98dypxg1mkve3.mp4";
      this.$refs.refFormState.validate((valid) => {
        if (valid) {
          this.loading = true;
          const api = this.formState.id ? screenEdit : screenAdd;
          const params = { ...this.formState };
          params.startTime = params.timeRange[0];
          params.endTime = params.timeRange[1];
          params.picture = params.fileUrl;
          if (params.putDuration < 0) {
            params.putDuration = params.putDurationMine;
          }
          api(params)
            .then(() => {
              this.$message.success(this.title + "开屏成功");
              this.$emit("finish");
              this.visible = false;
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    putDurationChange() {
      if (this.formState.putDuration != "-1") {
        this.formState.putDurationMine = "";
      }
    },
    putDurationMineIpt() {
      this.formState.putDurationMine = this.formState.putDurationMine.replace(
        /[^\d]/g,
        ""
      );
    },
    putDurationMineBlur() {
      this.formState.putDurationMine = String(
        Number(this.formState.putDurationMine)
      );
    },
    beforeUpload(file) {
      var fileSize = file.size / 1024 / 1024 < 2;
      // if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb', 'video/mov','image/jpeg', 'image/jpg', 'image/png','image/gif' ].indexOf(file.type) == -1) {
      //   this.$message.error('请上传正确的视频格式')
      //   return false
      // }
      if (!fileSize) {
        this.$message.error("文件大小不能超过2MB");
        return false;
      }
    },
    // 上传成功回调
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.formState.fileUrl = res.data.url;
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      } else {
        this.$message.error(res.msg);
        fileList.splice(0, 1);
      }
      // if (res.code == 200) {
      //   this.formState.fileUrl = res.data;
      //   if (fileList.length > 1) {
      //     fileList.splice(0, 1);
      //   }
      // }
    },
    show(data) {
      this.visible = true;
      this.title = data.title;
      if (data.item) {
        Object.keys(this.formState).forEach((key) => {
          this.formState[key] = data.item[key] || "";
        });
      }
      if (this.title != "查看") {
        this.rules = this.defaultRules;
      } else {
        this.rules = null;
      }
    },
    hide() {
      this.visible = false;
    },
    onClose() {
      this.$refs.fileUpload.clearFiles();
      this.resetForm();

      // setTimeout(() => {
      this.$refs.refFormState.clearValidate();
      this.rules = null;
      console.log(this.formState);
      // this.$refs.refFormState.resetFields();
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     console.log(this.$refs.refFormState);
      //     this.$refs.refFormState.clearValidate();
      //   }, 2000);
      // });

      // }, 500);
    },
    resetForm() {
      Object.keys(this.defaultFormState).forEach((key) => {
        this.formState[key] = this.defaultFormState[key];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.screen-outer) {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-right: 40px;
  .form {
    flex-grow: 1;
    padding-right: 20px;
  }
  .view {
    width: 252px;
    height: 450px;
    flex-shrink: 0;
    text-align: center;
    .title {
      line-height: 30px;
    }
    .box {
      width: 252px;
      height: 450px;
      border: 1px dashed #666;
      border-radius: 20px;
      overflow: hidden;
    }
    .no-border {
      border: 1px solid #666;
    }
  }
}
</style>

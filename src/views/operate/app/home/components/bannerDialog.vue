<template>
  <el-dialog
    :visible.sync="visible"
    :title="title + 'Banner'"
    width="800px"
    :close-on-click-modal="title === '查看' ? true : false"
    @close="onClose"
  >
    <div class="banner-outer">
      <div class="form">
        <el-form
          ref="refFormState"
          :model="formState"
          :rules="rules"
          :validate-on-rule-change="false"
          label-width="140px"
        >
          <el-form-item style="display: none" label="id：" prop="id">
          </el-form-item>
          <el-form-item label="主题名称：" prop="name">
            <template v-if="title === '查看'">{{ formState.name }}</template>
            <el-input
              size="small"
              style="width: 240px"
              placeholder="请输入Banner主题名称"
              v-else
              v-model="formState.name"
            ></el-input>
          </el-form-item>
          <el-form-item label="国家：" prop="countryId">
            <template v-if="title === '查看'">{{
              formState.countryName
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
          <el-form-item label="生效时间：" prop="timeRange">
            <el-date-picker
              v-model="formState.timeRange"
              style="width: 240px"
              type="daterange"
              range-separator=":"
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="起始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-form-item>
          <el-form-item label="位置：" prop="position">
            <template v-if="title === '查看'">{{
              formState.position
            }}</template>
            <el-select
              v-else
              v-model="formState.position"
              filterable
              size="small"
              style="width: 240px"
              placeholder="请选择使用位置"
            >
              <el-option label="首页轮播" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="间隔时间：" prop="timeInterval">
            <el-radio-group v-model="formState.timeInterval">
              <el-radio :label="3">3s</el-radio>
              <el-radio :label="5">5s</el-radio>
            </el-radio-group>
          </el-form-item>
          <div
            v-for="(item, index) in formState.info"
            :key="item.key"
            class="banners"
          >
            <div class="title">
              <el-divider content-position="center"
                >{{ index + 1 }}号广告位</el-divider
              >
            </div>
            <div class="box">
              <div class="left">
                <el-form-item
                  :style="{ display: title != '查看' ? 'block' : 'none' }"
                  label="广告图片："
                  :prop="'info.' + index + '.picture'"
                  :rules="{
                    required: true,
                    message: '广告图片不能为空',
                  }"
                >
                  <el-upload
                    ref="fileUpload"
                    class="avatar-uploader"
                    size="small"
                    :accept="['image/jpeg', 'image/jpg', 'image/png']"
                    :action="`${$root1}/resource/oss/upload`"
                    :on-success="
                      (response, file, fileList) => {
                        return handleSuccess(response, file, fileList, index);
                      }
                    "
                    :before-upload="beforeUpload"
                    :on-error="handleError"
                    :show-file-list="false"
                  >
                    <img
                      v-if="item.picture"
                      :src="item.picture"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="tips">
                    尺寸420*1053px |3x的图，仅支持JPG/PNG格式
                  </div>
                </el-form-item>

                <el-form-item
                  label="应用类型："
                  :prop="'info.' + index + '.linkType'"
                  :rules="{
                    required: true,
                    message: '应用类型不能为空',
                  }"
                >
                  <el-radio-group v-model="item.linkType">
                    <el-radio :label="0">H5</el-radio>
                    <el-radio :label="1">APP</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="跳转链接："
                  :prop="'info.' + index + '.linkUrl'"
                  :rules="{
                    required: true,
                    message: '跳转链接不能为空',
                  }"
                >
                  <el-input
                    v-model="item.linkUrl"
                    style="width: 240px"
                    size="small"
                    clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  label="排序："
                  :prop="'info.' + index + '.sort'"
                  :rules="{
                    required: true,
                    message: '排序不能为空',
                  }"
                >
                  <el-input-number
                    v-model="item.sort"
                    size="small"
                    clearable
                    :precision="0"
                    :min="0"
                    :max="4"
                  >
                  </el-input-number>
                  <div class="desc">
                    输入0~4之间的数字，数字越大，展示越靠前
                  </div>
                </el-form-item>
              </div>
              <el-button
                size="small"
                icon="el-icon-delete"
                type="danger"
                @click.prevent="removeDomain(item)"
                >删除</el-button
              >
            </div>
          </div>
          <el-form-item>
            <el-button
              :disabled="formState.info.length >= 5"
              icon="el-icon-plus"
              @click="addDomain"
              size="small"
              style="width: 100%"
              >新增广告位(最多添加5个)</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="view">
        <div class="title">预览</div>
        <div :class="['box', checkFileType() ? 'no-border' : '']">
          <img
            v-if="checkFileType() === 'image'"
            :src="formState.picture"
            alt=""
          />
          <video
            v-if="checkFileType() === 'video'"
            width="252"
            height="450"
            controls
            :src="formState.picture"
          ></video>
        </div>
      </div> -->
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
import { bannerAdd, bannerEdit } from "@/api/operate/app";
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
        timeInterval: "",
        info: [],
        position: "",
        timeRange: [],
        status: 0,
      },
      defaultFormState: {
        id: "",
        name: "",
        countryId: "",
        timeInterval: "",
        position: "",
        info: [],
        timeRange: [],
        status: 0,
      },
      rules: null,
      defaultRules: {
        name: [
          {
            required: true,
            message: "请输入Banner主题名称",
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
        timeInterval: [
          {
            required: true,
            message: "请选择轮播间隔时间",
            trigger: "change",
          },
        ],
        position: [
          {
            required: true,
            message: "请选择使用位置",
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
      },
    };
  },
  computed: {
    ...mapState({
      areaList: (state) => state.logistics.areaList,
    }),
  },
  methods: {
    addDomain() {
      this.formState.info.push({
        picture: "",
        linkType: "",
        linkUrl: "",
        sort: undefined,
        key: Date.now(),
      });
    },
    removeDomain(item) {
      var index = this.formState.info.indexOf(item);
      if (index !== -1) {
        this.formState.info.splice(index, 1);
      }
    },
    checkFileType() {
      let type = "";
      if (this.formState.picture) {
        const fileType = this.formState.picture.split(".")[1];
        const imgs = ["jpeg", "jpg", "png", "gif"];
        if (imgs.includes(fileType)) {
          type = "image";
        } else {
          type = "video";
        }
      }
      return type;
    },
    subForm() {
      this.$refs.refFormState.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = { ...this.formState };
          params.startTime = params.timeRange[0];
          params.endTime = params.timeRange[1];
          const api = this.formState.id ? bannerEdit : bannerAdd;
          api(params)
            .then(() => {
              this.$message.success(this.title + "banner成功");
              this.visible = false;
              this.$emit("finish");
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
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
    handleSuccess(res, file, fileList, index) {
      if (res.code == 200) {
        this.formState.info[index].picture = res.data.url;
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      } else {
        fileList.splice(0, 1);
        this.$message.error(res.msg);
      }
    },
    handleError(res) {
      this.$message.error("上传失败");
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
      this.resetForm();
      console.log(this.formState);
      // setTimeout(() => {
      this.$refs.refFormState.clearValidate();
      this.rules = null;
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
:deep(.banner-outer) {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-right: 40px;
  .form {
    flex-grow: 1;
    padding-right: 20px;
  }

  .banners {
    // padding-left: 20px;
    .box {
      display: flex;
      align-items: center;
    }
    .left {
      width: 500px;
      margin-right: 100px;
      .avatar-uploader-icon {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        border: 1px dashed #666;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .avatar {
        width: 120px;
        height: 120px;
        border-radius: 4px;
      }
    }
  }
}
</style>

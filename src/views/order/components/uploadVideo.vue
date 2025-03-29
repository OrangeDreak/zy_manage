<template>
  <el-card class="list" shadow="never">
    <div slot="header" class="video-header">
      <span>包装过程视频</span>
      <div>
        <el-button v-if="!videoForm.status" type="primary" @click="onEdit">编辑</el-button>
        <template v-else>
          <el-button plain @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </template>
        <el-button v-if="!videoForm.status" type="primary" @click="onDel">删除</el-button>
      </div>
    </div>
    <el-form ref="videoForm" :model="videoForm" size="small" label-width="0px">
      <el-form-item label="" prop="videoUrl">
        <div class="video-box">
          <video
            v-if="videoForm.videoUrl"
            width="360"
            height="180"
            controls
            :src="videoForm.videoUrl"
          ></video>
          <el-upload
            v-if="videoForm.status"
            ref="videoUpload"
            class="video-uploade"
            drag
            action="https://admin.qcelf.com/tp/admin/resource/oss/upload"
            accept=".mp4,.flv,.avi.rmb,.mov"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :show-file-list="false"
          >
            <div v-loading="uploadLoading">
              <!-- <i class="el-icon-upload" /> -->
              <!-- <el-button type="primary">点击上传</el-button> -->
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传mp4/flv/avi/rmvb/mov文件，且不超过200M
            </div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { packageOrderEdit } from "@/api/order";

export default {
  props: {
    orderInfo: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      videoForm: {
        status: false,
        videoUrl: "",
      },
      uploadLoading: false,
      subLoading: false,
    };
  },
  watch: {
    orderInfo: {
      handler(val) {
        this.videoForm.videoUrl = val.packagingVideo;
      },
      deep: true,
    },
  },
  methods: {
    onEdit() {
      this.videoForm.status = true;
    },
    onDel() {
      this.$confirm("是否确认删除该视频？", {
        confirmButtonText: "确认",
        cancelButtonText: "我再想想",
        type: "warning",
      })
        .then(() => {
          packageOrderEdit({
            packageOrderId: this.$route.params.id,
            packagingVideo: "",
          })
            .then(() => {
              this.videoForm.status = false;
              this.subLoading = false;
              this.$message.success("删除成功");
              this.$emit("finish");
            })
            .catch(() => {
              this.subLoading = false;
            });
        })
        .catch(() => {});
    },
    onSubmit() {
      if (!this.videoForm.videoUrl) {
        this.$message.error("请上传视频文件");
        return;
      }
      this.subLoading = true;
      packageOrderEdit({
        packageOrderId: this.$route.params.id,
        packagingVideo: this.videoForm.videoUrl,
      })
        .then(() => {
          this.videoForm.status = false;
          this.subLoading = false;
          this.$message.success("视频保存成功");
          this.$emit("finish");
        })
        .catch(() => {
          this.subLoading = false;
        });
      // this.$refs.videoForm.validate((valid) => {
      //   if (valid) {

      //   }
      // });
    },
    onCancel() {
      this.videoForm.videoUrl = this.orderInfo.packagingVideo;
      this.videoForm.status = false;
    },
    beforeUploadVideo(file) {
      this.uploadLoading = true;
      var fileSize = file.size / 1024 / 1024 < 200;
      if (
        [
          "video/mp4",
          // "video/ogg",
          "video/flv",
          "video/avi",
          // "video/wmv",
          "video/rmvb",
          "video/mov",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        this.uploadLoading = false;
        return false;
      }
      if (!fileSize) {
        this.$message.error("视频大小不能超过200MB");
        this.uploadLoading = false;
        return false;
      }
    },
    cleanFileList() {
      this.videoForm = {
        title: "",
        videoUrl: "",
      };
    },
    // 上传成功回调
    handleVideoSuccess(res, file, fileList) {
      this.uploadLoading = false;
      if (res.code == 200) {
        this.videoForm.videoUrl = res.data.url;
        if (fileList.length > 1) {
          fileList.splice(0, 1);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  margin-top: 20px;
  .video-header {
    display: flex;
    padding: 10px 0px;
    align-items: center;
    justify-content: space-between;
  }
  .video-box {
    display: flex;
    video {
      margin-right: 30px;
      border: 1px solid #eee;
    }
  }
}
</style>

<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    title="用户类型配置"
    @close="close"
  >
    <el-form ref="stateForm" :model="stateForm" label-width="140px">
      <el-form-item label="" prop="id" style="display: none"></el-form-item>
      <el-form-item label="" prop="userId" style="display: none"></el-form-item>
      <el-form-item label="用户类型" prop="userIdentity">
        <el-radio-group
          v-model="stateForm.userIdentity"
          :rules="[{ required: true, message: '请选择用户类型' }]"
          @change="userTypeChange"
        >
          <el-radio :label="0">普通用户</el-radio>
          <el-radio :label="1">转运商家</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="stateForm.userIdentity === 1">
        <el-form-item
          label="商家名称"
          :rules="[{ required: true, message: '商家名称不能为空' }]"
          prop="name"
        >
          <el-input v-model="stateForm.name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="商家优惠折扣"
          :rules="[{ required: true, message: '商家优惠折扣不能为空' }]"
          prop="discount"
        >
          <el-input v-model="stateForm.discount" @input="discountIpt" placeholder="请输入">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="自动偿还运费欠款" prop="automaticDebtDeduction">
          <el-switch
            v-model="stateForm.automaticDebtDeduction"
            active-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="商家链接" prop="link">
          <el-input v-model="stateForm.link" placeholder="请输入"></el-input>
        </el-form-item>
        <div v-for="(item, index) in stateForm.imgList" :key="item.key" class="item-form">
          <div class="title">
            <el-divider content-position="center">{{ index + 1 }}号广告位</el-divider>
          </div>
          <div class="box">
            <div class="left">
              <el-form-item
                label="商家广告图片："
                :prop="'imgList.' + index + '.imgUrl'"
                :rules="{ required: true, message: '广告图片链接不能为空', trigger: 'change' }"
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
                  <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="tips">尺寸1200*100px |2x的图，仅支持JPG/PNG格式</div>
              </el-form-item>
              <el-form-item
                label="广告图片链接"
                :rules="{ required: true, message: '广告图片链接不能为空', trigger: 'change' }"
                :prop="'imgList.' + index + '.linkUrl'"
              >
                <el-input v-model="item.linkUrl" placeholder="请输入"></el-input>
              </el-form-item>
            </div>
            <i class="el-icon-delete btn" @click.prevent="removeBanner(index)"></i>
          </div>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            style="width: 100%"
            :disabled="stateForm.imgList.length >= 5"
            @click="addBanner"
            >新增广告位(最多添加5个)</el-button
          >
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserIdentityConfig, saveUserIdentityConfig } from "@/api/member/user";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      stateForm: {
        userIdentity: 0,
        userId: "",
        id: "",
        name: "",
        link: "",
        discount: 0,
        automaticDebtDeduction: 0,
        imgList: [],
      },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      getUserIdentityConfig({ memberId: data.userId }).then((res) => {
        const data = res.data.data;
        if (data) {
          this.stateForm.userIdentity = data.userIdentity;
          this.stateForm.id = data.id;
          this.stateForm.userId = data.userId;
          if (this.stateForm.userIdentity) {
            this.stateForm.name = data.name;
            this.stateForm.discount = data.transportDiscount;
            this.stateForm.link = data.hrefUrl;
            this.stateForm.automaticDebtDeduction = data.automaticDebtDeduction;

            if (!data.advertisingSpaceList) return;
            const timeStr = Date.now();
            this.stateForm.imgList = data.advertisingSpaceList.map((item, index) => {
              return {
                imgUrl: item.imgUrl,
                linkUrl: item.hrefUrl,
                key: timeStr + index,
              };
            });
          }
        }
      });
    },
    close() {
      this.$nextTick(() => {
        this.$refs.stateForm.resetFields();
        this.stateForm.imgList = [];
      });
    },
    userTypeChange() {
      if (this.stateForm.userIdentity === 0) {
        this.stateForm.name = "";
        this.stateForm.link = "";
        this.stateForm.discount = 0;
        this.stateForm.automaticDebtDeduction = 0;
        this.stateForm.imgList = [];
      }
    },
    discountIpt(val) {
      let value = val.replace(/[^0-9]/g, "");
      // 1. 必须为数字，只保留数字和小数点
      // value = value.replace(/[^0-9]/g, "");
      // 2. 只能有一个小数点
      // value = value.replace(/(\..*?)\./g, "$1");
      // 3. 小数点后保留两位小数
      // value = value.replace(/(\.\d{0})./g, "$1");
      // 4. 第一位输入小数点的时候自动补全，补为 0.
      // if (value.startsWith(".")) {
      //   value = `0${value}`;
      // }
      // 5. 除非是小数，否则数字不能以0开头
      value = value.replace(/^(0+)(\d)/, "$2");
      if (Number(value) > 100) value = 100;
      this.stateForm.discount = value;
    },
    addBanner() {
      this.stateForm.imgList.push({
        linkUrl: "",
        imgUrl: "",
        key: Date.now(),
      });
    },
    removeBanner(index) {
      if (index !== -1) {
        this.stateForm.imgList.splice(index, 1);
      }
    },
    onSubmit() {
      this.$refs.stateForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            userId: this.stateForm.userId,
            // id: this.stateForm.id,
            userIdentity: this.stateForm.userIdentity,
          };
          // if (this.stateForm.userIdentity) {
          params.name = this.stateForm.name;
          params.transportDiscount = this.stateForm.discount;
          params.automaticDebtDeduction = this.stateForm.automaticDebtDeduction;
          params.hrefUrl = this.stateForm.link;
          params.advertisingSpace = this.stateForm.imgList
            ? this.stateForm.imgList.map((item) => {
                return {
                  hrefUrl: item.linkUrl.trim(),
                  imgUrl: item.imgUrl,
                };
              })
            : undefined;
          // }
          saveUserIdentityConfig(params)
            .then(() => {
              this.$message.success("操作成功!");
              this.visible = false;
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
        this.stateForm.imgList[index].imgUrl = res.data.url;
        this.$refs.stateForm.validateField("imgList." + index + ".imgUrl");
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
  },
};
</script>

<style lang="scss" scoped>
.item-form {
  .box {
    display: flex;
    align-items: center;
  }
  .left {
    // width: 500px;
    margin-right: 80px;
    .avatar-uploader-icon {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      border: 1px dashed #999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      border: 1px dashed #999;
    }
  }
  .btn {
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
  }
}
</style>

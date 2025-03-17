<template>
  <basic-container>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="客服基础配置" name="first">
          <el-form
            :model="valueObj1"
            :rules="rules1"
            ref="ruleForm1"
            class="demo-ruleForm"
          >
            <div class="moduleBox">
              <el-form-item prop="status">
                <span class="switchText">客服欢迎消息</span>
                <el-switch
                  class="demo"
                  v-model="valueObj1.status"
                  active-color="#2571f6"
                  inactive-color="#cccccc"
                  active-text="开启"
                  inactive-text="关闭"
                  active-value="0"
                  inactive-value="1"
                  width="60"
                >
                </el-switch>
                <div class="switchTip">
                  每段对话开启时，系统将自动向顾客发送一段欢迎语
                </div>
              </el-form-item>
              <el-form-item prop="second">
                <div class="switchInput">
                  <el-input
                    v-model="valueObj1.second"
                    placeholder=""
                    type="number"
                    class="input"
                  ></el-input
                  >分钟内不在发送
                </div>
              </el-form-item>
              <el-form-item prop="content">
                <div class="switchTextarea">
                  <el-input
                    type="textarea"
                    class="textarea"
                    :autosize="{ minRows: 4 }"
                    placeholder="请输入消息内容"
                    v-model="valueObj1.content"
                  >
                  </el-input>
                </div>
              </el-form-item>

              <div class="switchButton">
                <el-button type="primary" size="small" @click="edit(0)"
                  >保存</el-button
                >
              </div>
            </div>
          </el-form>
          <el-form
            :model="valueObj2"
            :rules="rules2"
            ref="ruleForm2"
            class="demo-ruleForm"
          >
            <div class="moduleBox">
              <el-form-item prop="status">
                <span class="switchText">客服无应答时消息</span>
                <el-switch
                  class="demo"
                  v-model="valueObj2.status"
                  active-color="#2571f6"
                  inactive-color="#cccccc"
                  active-text="开启"
                  inactive-text="关闭"
                  active-value="0"
                  inactive-value="1"
                  width="60"
                >
                </el-switch>
                <div class="switchTip">
                  客服一段时间没有响应顾客消息时，系统自动向他发送一段消息
                </div>
              </el-form-item>
              <el-form-item prop="second">
                <div class="switchInput">
                  <span class="switchInputText1">客服超过</span>
                  <el-input
                    v-model="valueObj2.second"
                    placeholder=""
                    class="input"
                    type="number"
                    onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                  ></el-input
                  >秒无响应时自动发送
                </div>
              </el-form-item>
              <el-form-item prop="content">
                <div class="switchTextarea">
                  <el-input
                    type="textarea"
                    class="textarea"
                    :autosize="{ minRows: 4 }"
                    placeholder="请输入消息内容"
                    v-model="valueObj2.content"
                  >
                  </el-input>
                </div>
              </el-form-item>
              <div class="switchButton">
                <el-button type="primary" size="small" @click="edit(1)"
                  >保存</el-button
                >
              </div>
            </div>
          </el-form>
          <el-form
            :model="valueObj3"
            :rules="rules3"
            ref="ruleForm3"
            class="demo-ruleForm"
          >
            <div class="moduleBox">
              <el-form-item prop="status">
                <span class="switchText">访客无响应时消息</span>
                <el-switch
                  class="demo"
                  v-model="valueObj3.status"
                  active-color="#2571f6"
                  inactive-color="#cccccc"
                  active-text="开启"
                  inactive-text="关闭"
                  active-value="0"
                  inactive-value="1"
                  width="60"
                >
                </el-switch>
                <div class="switchTip">
                  访客一段时间没有响应客服消息时，系统自动向他发送一段消息
                </div>
              </el-form-item>
              <el-form-item prop="second">
                <div class="switchInput">
                  <span class="switchInputText1">访客超过</span>
                  <el-input
                    v-model="valueObj3.second"
                    placeholder=""
                    class="input"
                    type="number"
                    onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))"
                  ></el-input
                  >秒无响应时自动发送
                </div>
              </el-form-item>
              <el-form-item prop="content">
                <div class="switchTextarea">
                  <el-input
                    type="textarea"
                    class="textarea"
                    :autosize="{ minRows: 4 }"
                    placeholder="请输入消息内容"
                    v-model="valueObj3.content"
                  >
                  </el-input>
                </div>
              </el-form-item>
              <div class="switchButton">
                <el-button type="primary" size="small" @click="edit(2)"
                  >保存</el-button
                >
              </div>
            </div>
          </el-form>

          <div class="moduleBox">
            <el-form
              :model="valueObj4"
              :rules="rules4"
              ref="ruleForm4"
              class="demo-ruleForm"
            >
              <el-form-item prop="status">
                <span class="switchText">对话结束</span>
                <el-switch
                  class="demo"
                  v-model="valueObj4.status"
                  active-color="#2571f6"
                  inactive-color="#cccccc"
                  active-text="开启"
                  inactive-text="关闭"
                  active-value="0"
                  inactive-value="1"
                  width="60"
                >
                </el-switch>
                <div class="switchTip">
                  对话结束后，系统自动向顾客发送一段结束语
                </div>
              </el-form-item>
              <el-form-item prop="content">
                <div class="switchTextarea">
                  <div class="overText">客服手动结束时</div>
                  <el-input
                    type="textarea"
                    class="textarea"
                    :autosize="{ minRows: 4 }"
                    placeholder="请输入消息内容"
                    v-model="valueObj4.content"
                  >
                  </el-input>
                </div>
              </el-form-item>
            </el-form>
            <el-form
              :model="valueObj5"
              :rules="rules5"
              ref="ruleForm5"
              class="demo-ruleForm"
            >
              <div class="switchTextarea">
                <el-form-item prop="second">
                  <div class="overText1">系统自动关闭时</div>
                  <div class="switchInput">
                    <span class="switchInputText1">访客超过</span>
                    <el-input
                      v-model="valueObj5.second"
                      placeholder=""
                      class="input"
                      type="number"
                    ></el-input
                    >秒无响应时自动关闭
                  </div>
                </el-form-item>
                <el-form-item prop="content">
                  <el-input
                    type="textarea"
                    class="textarea"
                    :autosize="{ minRows: 4 }"
                    placeholder="请输入消息内容"
                    v-model="valueObj5.content"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="switchButton">
              <el-button type="primary" size="small" @click="edit(3)"
                >保存</el-button
              >
            </div>
          </div>
          <!-- <el-switch v-model="value1" inactive-text="按年付费"> </el-switch> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </basic-container>
</template>

<script>
import { configListApi, saveConfigApi } from "../../api/customer/basicConfig";
export default {
  data() {
    return {
      activeName: "first",
      valueObj1: {
        // type: 0,
        second: null,
        content: "",
        status: 0,
      },
      rules1: {
        second: [{ required: true, message: "请输入时间", trigger: "blur" }],
        // status: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [{ required: true, message: "请填写消息", trigger: "blur" }],
      },
      valueObj2: {
        // type: 1,
        second: null,
        content: "",
        status: 0,
      },
      rules2: {
        second: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [{ required: true, message: "请填写消息", trigger: "blur" }],
      },
      valueObj3: {
        // type: 2,
        second: null,
        content: "",
        status: 0,
      },
      rules3: {
        second: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [{ required: true, message: "请填写消息", trigger: "blur" }],
      },
      valueObj4: {
        // type: 3,
        // second: null,
        content: "",
        status: 0,
      },
      rules4: {
        // status: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [{ required: true, message: "请填写消息", trigger: "blur" }],
      },
      valueObj5: {
        // type: 5,
        second: null,
        content: "",
        // status: 0,
      },
      rules5: {
        second: [{ required: true, message: "请输入时间", trigger: "blur" }],
        content: [{ required: true, message: "请填写消息", trigger: "blur" }],
      },

      // textarea1: null,
    };
  },
  created() {
    this.getConfigList();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    async edit(type) {
      if (type !== 3) {
        let data = { ...this[`valueObj${type + 1}`], type: type };
        if (type == 0) {
          data.second = this[`valueObj${type + 1}`].second * 60;
        }
        console.log(data, "d");
        this.$refs[`ruleForm${type + 1}`].validate((valid) => {
          if (valid) {
            saveConfigApi(data).then((res) => {
              // console.log(res.success);
              // console.log(res.dat, "1");

              if (res && res?.data?.success) {
                this.$message.success("保存成功");
              }
            });
          } else {
            this.$message({
              type: "error",
              message: "填写相关信息",
            });
            console.log("error submit!!");
            return false;
          }
        });
      } else {
        // 接口导致 页面数据分离
        let flag1 = false;
        let flag2 = false;
        let data2 = {
          type: 3,
          second: 0,
          content: this.valueObj4.content,
          status: this.valueObj4.status,
        };
        let data3 = {
          type: 4,
          second: this.valueObj5.second,
          content: this.valueObj5.content,
          status: this.valueObj4.status,
        };
        this.$refs.ruleForm4.validate((valid) => {
          if (valid) {
            flag1 = true;
          } else {
            // this.$message({
            //   type: "error",
            //   message: "填写相关信息",
            // });
            return false;
          }
        });
        this.$refs.ruleForm5.validate((valid) => {
          if (valid) {
            flag2 = true;
          } else {
            this.$message({
              type: "error",
              message: "填写相关信息",
            });
            console.log("error submit!!");
            return false;
          }
        });
        if (flag1 && flag2) {
          let res1 = await saveConfigApi(data2);
          let res2 = await saveConfigApi(data3);
          if (res1 && res2 && res1?.data?.success && res2?.data?.success) {
            this.$message.success("保存成功");
          }
        }
      }

      console.log(type, this.valueObj1);
    },
    getConfigList() {
      configListApi().then((res) => {
        // console.log(res.data.data, "1");
        if (res.data.data && Array.isArray(res.data.data)) {
          // 能显示但必填问题大
          res.data.data.forEach((item) => {
            // console.log(item, "item");
            if (item.type != 3 && item.type != 4) {
              if (item.type == 0) {
                item.second = item.second / 60;
              }
              this[`valueObj${item.type + 1}`] = item;
              this[`valueObj${item.type + 1}`].status = String(
                this[`valueObj${item.type + 1}`].status
              );
              console.log(this[`valueObj${item.type + 1}`], 1);
              delete this[`valueObj${item.type + 1}`].type;

              console.log(item, "item");
            } else if (item.type == 3) {
              this.valueObj4.content = item.content;
              this.valueObj4.status = String(item.status);
            } else if (item.type == 4) {
              this.valueObj5.content = item.content;
              this.valueObj5.second = String(item.second);
            }
          });
        }
        // res.data.data
      });
    },
  },
};
</script>

<style scoped>
.demo >>> .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.demo >>> .el-switch__label--right {
  z-index: 1;
  left: -3px;
}
.demo >>> .el-switch__label--left {
  z-index: 1;
  left: 19px;
}
.demo >>> .el-switch__label.is-active {
  display: block;
}
.demo >>> .el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 50px !important;
}
</style>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 15px;
}

/deep/ .el-form {
  margin: 0;
}
.switchText {
  margin-right: 15px;
  font-size: 14px;
}

.switchTip {
  color: #cccccc;
  font-size: 12px;
  // margin-top: 10px;
  font-size: 14px;
}
.switchInput {
  // margin-top: 10px;
  font-size: 14px;

  .switchInputText1 {
    margin-right: 10px;
  }

  /deep/ .el-input__inner {
    background-color: #f2f2f2;
    padding: 0;
    text-align: center;
  }

  .input {
    width: 80px;
    height: 50px;
    margin-right: 10px;
    // margin: 0 10px 0 10px;
  }
}

.moduleBox {
  // margin-top: 20px;
  border-bottom: 0.5px solid #f2f2f2;
  // padding-bottom: 20px;
  padding: 20px;
  font-size: 16px;
  .overText {
    // margin-top: 10px;
    margin-bottom: 10px;
  }
}
.switchTextarea {
  font-size: 14px;

  /deep/ .el-textarea__inner {
    background-color: #f2f2f2;
  }
  .textarea {
    width: 500px;
  }
}

.switchButton {
  margin-top: 10px;
}
</style>

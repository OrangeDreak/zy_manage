<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="1000px"
    class="dialog"
    @opened="openRef"
    @close="cleanDialog"
    destroy-on-close
    v-if="visible"
  >
    <div class="content">
      <div class="left">
        <!-- <lemon-imui ref="IMUI" simple="true" /> -->
        <div class="title">会话记录</div>
        <div class="historyBox">
          <div class="wmc" ref="wmc" v-if="sessionArr?.length > 0">
            <!-- <div class="moreText" v-if="moreFlag">上滑查看更多</div> -->
            <ul v-for="(item, index) in sessionArr" :key="index">
              <li
                :class="!item.isSelf ? 'wmcLeft' : 'wmcRight'"
                v-if="item.sessionType == 1"
              >
                <div class="avatar">
                  <el-avatar
                    :size="40"
                    :src="userAvatar"
                    v-if="!item.isSelf"
                  ></el-avatar>
                  <el-avatar
                    :size="40"
                    :src="item.staffNickName"
                    v-if="item.isSelf"
                  ></el-avatar>
                </div>
                <div class="message">
                  <div class="nameAndTime" v-if="!item.isSelf">
                    {{ userName }}&nbsp;&nbsp;{{ item.gmtCreate | formatTime }}
                  </div>

                  <div class="nameAndTime" v-if="item.isSelf">
                    {{ item.staffNickName }}&nbsp;&nbsp;{{
                      item.gmtCreate | formatTime
                    }}
                  </div>
                  <div class="rig">
                    <div
                      class="messageContent"
                      v-text="item.content"
                      v-if="item.content"
                    ></div>
                    <img
                      :src="formatIMPic(item.pictureShortUrl)"
                      fit="contain"
                      class="messageContent"
                      v-if="!item.content"
                    />
                    <!-- <div v-if="item.type === 2" class="isRead">已读</div> -->
                  </div>
                </div>
              </li>
              <li v-if="item.sessionType == 4" class="overTip">
                <div class="overText">{{ item.content }}</div>
              </li>
            </ul>
          </div>
          <div class="wmc" ref="wmc" v-if="sessionArr?.length == 0">
            <el-empty description="暂无数据"></el-empty>
          </div>
          <div class="footer">
            <div class="footerTip">
              当前为网页端用户，需再次打开网站才能收到新消息
            </div>
            <div class="footerTip">
              （若用户更换浏览器或清理浏览器记录则无法收到）
            </div>

            <div class="initiateSession" @click="initiateSession()">
              发起会话
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="customer">
          <div class="title"><div class="titleText1">客户信息</div></div>
          <div class="content">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="formLabelAlign"
            >
              <el-form-item label="用户ID">
                <el-input
                  v-model="formLabelAlign.userId"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="用户昵称">
                <el-input
                  v-model="formLabelAlign.nickname"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="用户邮箱">
                <el-input
                  v-model="formLabelAlign.email"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
              <el-form-item label="国家">
                <el-input
                  v-model="formLabelAlign.countryName"
                  size="small"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="serviceRecord">
          <div class="title"><div class="titleText2">服务记录</div></div>
          <div class="content" v-infinite-scroll="load" ref="record">
            <div
              class="xxBox"
              v-for="(item, index) in serviceList"
              :key="index"
            >
              <span>{{ item.serviceTime }}</span
              ><span
                ><i
                  :class="[
                    item.platform === 0
                      ? 'el-icon-mobile-phone'
                      : 'el-icon-monitor',
                  ]"
                ></i
                >{{ item.statusName }}</span
              >
            </div>
            <!-- <div class="xxBox">
              <span>时间</span
              ><span><i class="el-icon-mobile-phone"></i> 已解决1</span>
            </div> -->
            <!-- <div class="xxBox"><span>时间</span><span>已解决2</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div>
            <div class="xxBox"><span>时间</span><span>已解决</span></div> -->
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cleanDialog()">关闭</el-button>
      <!-- <el-button record
        type="primary"
        @click="submitForm('ruleForm')"
        v-if="title != '详情'"
        >保存</el-button
      > -->
    </span>
  </el-dialog>
</template>

<script>
import {
  customerInfoApi,
  serviceListApi,
  detailMessageListApi,
} from "../../../api/customer/recording";
import { staffOpenApi } from "../../../api/customer/session";
export default {
  data() {
    return {
      visible: false,
      title: "会话信息",
      count: 0,
      userId: null,
      dialogueId: null,
      messageId: null,
      lastMsgTime: null,
      labelPosition: "right",
      formLabelAlign: {
        userId: "",
        nickname: "",
        email: "",
        countryName: "",
      },
      // 下拉加载高度标记
      // lastScrollHeight: 0,
      sessionId: 999,
      sessionName: "吴莫愁",
      page: {
        pageSize: 30,
        currentPage: 1,
        total: 0,
      },
      serviceList: [],
      serviceListBusy: false,
      // 不再监听下拉加载
      scrollingTag: true,
      sessionArr: [],
      hasNext: true,
      timerId: null,
      userAvatar: null,
      userName: null,
    };
  },
  mounted() {
    // this.getUpdataData();
    // //监听滚动事件
    // this.$refs.wmc.addEventListener("scroll", this.scrolling);
    // this.scrollToBottom;
  },
  methods: {
    open(data) {
      this.visible = true;
      this.title = data.title;
      this.userId = data.userId;
      this.dialogueId = data.dialogueId;
      console.log(this.visible, this.userId, "vis");

      // if (data.title == "详情") {
      //   console.log(this.disableButton, "butt");
      // }
      // console.log(data, "data");
      // if (data.id) {
      //   this.id = data.id;
      //   this.getDetail(data.id);
      // }
    },
    // dialogClose() {},
    cleanDialog() {
      // this.$nextTick(() => {
      //   this.$refs.wmc.removeEventListener("scroll", this.scrolling);
      // });
      this.visible = false;
      this.userId = null;
      this.dialogueId = null;
      this.formLabelAlign = {
        userId: "",
        nickname: "",
        email: "",
        countryName: "",
      };
      this.page = {
        pageSize: 30,
        currentPage: 1,
        total: 0,
      };
      this.serviceList = [];
      this.lastMsgTime = null;
      this.sessionArr = [];
      this.hasNext = true;
      // console.log(this.userId, "cleanUU");
      if (this.timerId) {
        clearTimeout(this.timerId);
      }
      console.log("before清理");
      // console.log(this.userId, "beforeUU");
    },
    load() {
      if (this.$refs.record.scrollHeight <= this.$refs.record.offsetHeight) {
        console.log("盒子没满");
        return;
      }

      if (!this.serviceListBusy) {
        this.serviceListBusy = true;
        this.getServiceList();
        console.log("到底了2");
      }
    },
    initiateSession() {
      const data = { userId: this.userId };
      staffOpenApi(data).then(async (res) => {
        // 发起会话
        if (res?.data?.success) {
          this.$router.push({
            path: "/customer/session",
            query: {},
          });
          this.cleanDialog();
        }
        console.log(res);
      });
      // this.$router.push({
      //   path: "/customer/session",
      //   query: {},
      // });
    },
    scrollToBottom() {
      this.timerId = setTimeout(() => {
        this.$nextTick(() => {
          var container = this.$refs.wmc;
          container.scrollTop = container.scrollHeight;
        });
      }, 250);
    },
    // getUpdataData() {
    //   //定时获取后台返回数据
    //   this.scrollToBottom;
    // },
    async openRef() {
      // this.getUpdataData();
      //监听滚动事件
      // 无法操作dom
      this.getCustomerInfo();
      this.getServiceList();
      await this.getDetailMessage(this.dialogueId);
      this.scrollToBottom();
      console.log(this.page, "page");
      this.$refs.wmc.addEventListener("scroll", this.scrolling);
    },

    getCustomerInfo() {
      let params = { userId: this.userId };
      customerInfoApi(params).then((res) => {
        this.formLabelAlign = res?.data?.data;
        this.userName = res?.data?.data.nickname;
        this.userAvatar = res?.data?.data?.avatar;
        console.log(res, "客户信息");
      });
    },
    getServiceList() {
      const data = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        userId: this.userId,
      };
      serviceListApi(data).then((res) => {
        console.log(res, "服务记录");
        if (res?.data?.data.records.length > 0) {
          this.page.currentPage++;
          this.serviceListBusy = false;
          this.serviceList = [...this.serviceList, ...res.data.data.records];
        }
      });
    },

    // 详情聊天记录
    getDetailMessage(id) {
      if (!this.hasNext) {
        return;
      }
      const data = {
        dialogueId: this.dialogueId,
        lastMsgTime: this.lastMsgTime,
        isSendMessage: 0,
      };
      return detailMessageListApi(data).then((res) => {
        if (res?.data?.data?.messageList.length === 0) {
          this.scrollingTag = false;
        } else {
          this.lastMsgTime = res?.data?.data?.lastMsgTime;
          this.hasNext = res?.data?.data?.hasNext;
        }
        this.sessionArr = [...res?.data?.data?.messageList, ...this.sessionArr];
        console.log(res, "聊天记录");
        // 改id，unshift
      });
    },
    formatIMPic(url) {
      const isHttps = location.protocol === "https:";
      const { VUE_APP_API_URL, VUE_APP_APIS_URL } = process.env;
      if (isHttps) {
        return url.replace(VUE_APP_API_URL, VUE_APP_APIS_URL);
      }
      return url;
    },
    async scrolling() {
      if (!this.$refs.wmc) {
        return;
      }
      // if (this.scrollingTag) {
      // this.$nextTick(async () => {

      var container = this.$refs.wmc;

      if (this.$refs.wmc.scrollHeight <= this.$refs.wmc.offsetHeight) {
        console.log("盒子没填满");
        return;
      }
      console.log("滚动");
      // let scrollTop =
      //   element.scrollHeight(滚动区域的滚动高度) -
      //   this.lastScrollHeight(上一次的高度);
      // element.scrollTop = scrollTop;

      if (container.scrollTop == 0) {
        this.lastScrollHeight = this.$refs.wmc.scrollHeight;
        console.log(this.lastScrollHeight);

        // this.demoTextArr.unshift(
        //   {
        //     text: "<p>今天15:43:32 用户进入</p>",
        //   },
        //   {
        //     text: `<p>由  ${this.sessionName}接待</p>`,
        //   },
        //   {
        //     text: `<p>会话ID :${this.sessionId}</p>`,
        //   }
        // );
        await this.getDetailMessage();
        this.$nextTick(() => {
          let scrollTop = this.$refs.wmc.scrollHeight - this.lastScrollHeight;
          console.log(
            scrollTop,
            this.$refs.wmc.scrollHeight,
            this.lastScrollHeight
          );
          this.$refs.wmc.scrollTop = scrollTop;
        });
        console.log("加载数据");
      }
      // });
      // console.log("滚动");
      // }
    },
  },
  beforeDestroy() {
    // if (this.id) {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    // console.log("before清理");
    // console.log(this.userId, "beforeUU");
    // this.$nextTick(() => {
    this.$refs.wmc.removeEventListener("scroll", this.scrolling);
    // });
    // }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  // background-color: #000;
  .content {
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      flex-direction: column;
      width: 400px;
      background-color: #fff;
      .title {
        width: 400px;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        font-weight: 600;
        padding-left: 10px;
        color: #1785ff;
        border-bottom: 0.5px solid #000 !important;
      }
      .historyBox {
        width: 400px;
        height: 529px;
        // background: #000;
        .wmc {
          // height: calc(100vh - 320px);
          height: 100%;
          overflow: auto;
          border-bottom: 0.5px solid #f6f7f9;
          // height: 500px;
          // flex: 1;
          // display: flex;
          // flex-direction: column;

          ul {
            list-style: none; /*清除列表默认样式*/
            padding: 0; /*清除padding*/
            margin: 0;
            font-size: 12px;
            li {
              display: flex;
              justify-content: flex-start;
              margin: 10px;
              margin-bottom: 20px;

              .avatar {
                margin: 10px;
              }

              .nameAndTime {
                display: inline-block;
              }

              .message {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              }

              .messageContent {
                display: inline-block;
                max-width: 230px;
                overflow-wrap: break-word;
                background-color: #e8e8e8;
                margin-top: 10px;
                border-radius: 5px;
                // padding: 5px;
                font-size: 14px;
                padding: 10px 14px;
                letter-spacing: 0.5px;
                // box-shadow: 0px 0px 2px 2px #ccc;
              }
              .smallTip {
                font-size: 12px;
                color: #cbcbcb;
                text-align: center;
                p {
                  margin: 0;
                }
              }
            }
            .wmcLeft {
              flex-direction: row;
            }

            .wmcCenter {
              justify-content: center;
            }
            .wmcRight {
              flex-direction: row-reverse;

              .message {
                align-items: flex-end;
              }
              .messageName {
                display: flex;
                justify-content: flex-end;
              }
              .rig {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .messageContent {
                  display: inline-block;
                  background-color: #3894ff;
                  // line-height: 12px;
                  color: #fff;
                }
              }
            }
          }

          .moreText {
            font-size: 12px;
            color: #cbcbcb;
            text-align: center;
            padding: 50px;
          }
          .overTip {
            display: flex;
            justify-content: center;
          }
          .overText {
            font-size: 12px;
            color: #cbcbcb;
            text-align: center;
            // padding: 50px;
            padding-top: 5px;
          }
        }
        .footer {
          .footerTip {
            font-size: 12px;
            text-align: center;
            margin-top: 2px;
          }
          .initiateSession {
            width: 100%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background-color: #d7dffd;
            margin-top: 5px;
            cursor: pointer;
          }
        }
      }
    }

    .right {
      border: 1px solid #000;
      .customer {
        .title {
          width: 400px;
          height: 50px;
          line-height: 50px;
          font-weight: 600;
          padding: 0 10px;
          .titleText1 {
            color: #1785ff;
            font-size: 16px;
            border-bottom: 1px solid #000;
          }
        }
        .content {
          width: 400px;
          height: 300px;
          // background: #000;
          padding-top: 25px;
          padding-left: 8px;
          // display: flex;
          // justify-content: center;
          // align-items: center;
        }
      }
      .serviceRecord {
        .title {
          width: 400px;
          height: 50px;
          line-height: 50px;
          font-weight: 600;
          padding: 0 10px;
          .titleText2 {
            font-size: 16px;
            color: #1785ff;

            border-bottom: 1px solid #000;
          }
        }
        .content {
          width: 400px;
          height: 250px;
          // background: #000;
          padding-top: 15px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: auto;
          .xxBox {
            margin-bottom: 10px;
            margin-left: 20px;
            span {
              margin: 0 40px 0 30px;
            }
          }
        }
      }
    }
  }
}
</style>

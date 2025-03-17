<template>
  <div class="bigW">
    <div class="content">
      <div class="left" v-show="!screenFlag">
        <el-button
          class="button"
          plain
          size="mini"
          @click="screen()"
          v-if="activeName === 'seconds'"
          >筛选</el-button
        >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="当前会话" name="first">
            <div class="now" ref="now">
              <ul
                class="nowCustomer"
                v-infinite-scroll="nowLoad"
                infinite-scroll-distance="0"
                infinite-scroll-disabled="nowBusy"
              >
                <li
                  v-for="(item, index) in arr"
                  :key="index"
                  class="nowCustomerSon"
                  @click="
                    setCurrent(
                      index,
                      item.dialogueId,
                      item.userId,
                      item.userAvatar,
                      item.nickname
                    )
                  "
                  :class="current == index ? 'currentLi' : ''"
                >
                  <div class="liAvatar">
                    <el-badge :is-dot="!item.isStaffRead" class="item">
                      <el-avatar
                        :size="size"
                        :src="item.userAvatar"
                      ></el-avatar>
                    </el-badge>
                  </div>
                  <div class="liInformation">
                    <div class="liTop">
                      <div class="liInformationName">
                        客户：{{ item.nickname }}
                      </div>
                      <div class="liTime">
                        <div>{{ item.time | formatDateRegex }}</div>
                      </div>
                    </div>
                    <div class="liInformationSession">
                      {{ item.content }}
                      <!-- 1231231231312312qweqweqeqewqeqweqe -->
                    </div>
                  </div>
                </li>
              </ul>
              <el-empty description="无会话" v-if="arr?.length == 0"></el-empty>
            </div>
          </el-tab-pane>
          <el-tab-pane label="历史会话" name="seconds">
            <div class="history">
              <div class="now" ref="history">
                <ul
                  class="nowCustomer"
                  v-infinite-scroll="historyLoad"
                  infinite-scroll-distance="0"
                  infinite-scroll-disabled="historyBusy"
                >
                  <li
                    v-for="(item, index) in arrTwo"
                    :key="index"
                    class="nowCustomerSon"
                    @click="
                      setHistoryCurrent(
                        index,
                        item.dialogueId,
                        item.userId,
                        item.userAvatar,
                        item.nickname
                      )
                    "
                    :class="currentTwo == index ? 'currentLi' : ''"
                  >
                    <div class="liAvatar">
                      <el-badge class="item">
                        <el-avatar
                          :size="size"
                          :src="item.userAvatar"
                        ></el-avatar>
                      </el-badge>
                    </div>
                    <div class="liInformation">
                      <div class="liTop">
                        <div class="liInformationName">
                          客户：{{ item.nickname }}
                        </div>
                        <div class="liTime">
                          <div>{{ item.time | formatDateRegex }}</div>
                        </div>
                      </div>

                      <div class="liInformationSession">
                        {{ item.content }}
                        <!-- 2131231313131313123123 -->
                      </div>
                    </div>
                  </li>
                </ul>
                <el-empty
                  description="无会话"
                  v-if="arrTwo?.length == 0"
                ></el-empty>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="left leftTwo" v-show="screenFlag">
        <div class="title">
          <el-button size="mini" @click="back()">返回</el-button>
          <el-button type="primary" size="mini" @click="startScreen()"
            >开始筛选</el-button
          >
        </div>
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabel"
          class="leftForm"
        >
          <el-form-item label="">
            <el-date-picker
              v-model="formLabel.time"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="～"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="timeSet"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="header">
          <div class="name">
            <span v-if="activeName == 'first'">{{ userName }}</span>
            <span v-if="activeName == 'seconds'">{{ userNameTwo }}</span>

            <!-- <span class="flag">首次会话</span> -->
          </div>
          <div class="btnDiv">
            <el-button plain @click="createGD()"
              >创建工单<i class="el-icon-upload el-icon--left"></i
            ></el-button>
            <el-button plain @click="overSession()"
              >{{ activeName === "first" ? "结束会话" : "发起会话"
              }}<i class="el-icon-headset el-icon--left"></i
            ></el-button>
          </div>
        </div>

        <div class="session">
          <div class="sessionContent">
            <div class="wmc" ref="wmc">
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
                      v-show="!item.isSelf"
                    ></el-avatar>
                    <el-avatar
                      :size="40"
                      :src="item.staffAvatar"
                      v-show="item.isSelf"
                    ></el-avatar>
                  </div>
                  <div class="message">
                    <div class="nameAndTime" v-if="!item.isSelf">
                      {{ userName }}&nbsp;&nbsp;{{
                        item.gmtCreate | formatTime
                      }}
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
                        @load="imgLoad"
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
            <div class="dhk">
              <WangEditor
                v-model="htmlText"
                @screen="send"
                ref="wangEditor"
                @sendPic="sendPic"
              >
              </WangEditor>
              <el-button type="primary" @click="send()" class="sendButton"
                >发送</el-button
              >
            </div>
          </div>
          <div class="aside">
            <div class="title"><div class="titleText">资料</div></div>
            <div class="information">
              <div class="smTitle">客户信息</div>
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
        </div>
      </div>
    </div>
    <!-- <newWorkOrder ref="newWorkOrderRef"></newWorkOrder> -->
    <RefundModal ref="refRefundModal"></RefundModal>
    <closeSession ref="closeSessionRef" @overFun="overFun"></closeSession>
  </div>
</template>

<script>
import WangEditor from "./session/sessionDiv.vue";
// import newWorkOrder from "./session/newWorkOrder.vue";
import closeSession from "./session/closeSession.vue";
import RefundModal from "./components/refundModal.vue";
// import { getSDK } from "@/util/lib";
import { CbEvents } from "@/util/lib/constant";
import useCreateNormalMessage from "./normalMessage";

// import {} from "./openImFun";
import {
  myDialogueListApi,
  getCustomerInfoApi,
  staffOpenApi,
  staffCloseApi,
  openIMLoginApi,
  nowMessageListApi,
} from "../../api/customer/session";

import {
  customerInfoApi,
  serviceListApi,
  detailMessageListApi,
} from "../../api/customer/recording";

// import { openImLoginApi } from "../../api/customer/openImApi";
// import { onSendMessage } from "./openImFun";
import { IMSDK, getCleanText, initStore } from "../../util/imCommon";
import { envConfig } from '@/config/env';

export default {
  data() {
    return {
      activeName: "first",
      labelPosition: "top",
      // IMSDK: null,
      openUserID: null,
      openToken: null,
      formLabelAlign: {
        userId: "",
        nickname: "",
        email: "",
        countryName: "",
      },
      formLabel: {
        time: [],
      },
      onceFlag: true,
      loading: false,
      current: 0,
      currentTwo: 0,
      // userId
      nowUserId: null,
      historyUserId: null,
      // 会话id
      nowDialogueId: null,
      historyDialogueId: null,
      lastMsgTime: null,
      scrollUserId: null,
      scrollDialogueId: null,
      hasNext: true,
      userAvatar: null,
      userName: null,
      userNameTwo: null,
      meAvatar: null,
      meName: null,
      nowPage: {
        pageSize: 30,
        currentPage: 1,
        total: 0,
      },
      historyPage: {
        pageSize: 30,
        currentPage: 1,
        total: 0,
      },
      arr: [],
      arrTwo: [],
      nowBusy: false,
      historyBusy: false,
      textarea: null,
      screenFlag: false,
      // 会话结束文本
      overFlag: false,
      moreFlag: true,
      htmlText: null,
      sessionArr: [],
      // 延时
      timerId: null,
      timeSet: ["00:00:00", "23:59:59"],
      dialogListBusy: false,
    };
  },
  async created() {
    this.useImInit();
    this.arr = [];
    this.arrTwo = [];
    await this.getMyDialogueList(1);
    const res = await this.getMyDialogueList(0);
    if (res?.data?.data?.records.length > 0) {
      this.nowDialogueId = this.arr[0].dialogueId;
      this.nowUserId = this.arr[0].userId;
      this.userAvatar = this.arr[0].userAvatar;
      this.userName = this.arr[0].nickname;
    }
    // this.getCustomerInfo();
    if (this.arr.length > 0) {
      await this.getNowMessageList(this.nowDialogueId);
      await this.getCustomerInfo(this.nowUserId);
    }

    // this.scrollToBottom();
  },
  components: { WangEditor, closeSession, RefundModal },
  mounted() {
    // this.getUpdataData();
    //监听滚动事件
    this.$refs.wmc.addEventListener("scroll", this.scrolling);

    // this.scrollToBottom();
  },
  methods: {
    async useImInit() {
      this.initLogin();

      IMSDK.on(CbEvents.OnConnectSuccess, this.OnConnectSuccess);
      IMSDK.on(CbEvents.OnRecvNewMessages, this.onRecvNewMessages);
      IMSDK.on(CbEvents.OnConnectFailed, this.OnConnectFailed);
      // IMSDK.on(CbEvents.OnConnecting, () => {
      // });
      IMSDK.on(CbEvents.OnUserTokenExpired, this.OnUserTokenExpired);
      IMSDK.on(CbEvents.OnKickedOffline, this.OnKickedOffline);

      IMSDK.on(CbEvents.OnRecvC2CReadReceipt, ({ data }) => {
        // data 已读回执列表
      });
    },
    send() {
      // 判断
      const text = this.$refs.wangEditor.text;
      if (!text || !text.trim()) {
        this.$message.warning("请输入内容");
        return;
      }

      this.sendMessage(text);
      // this.sessionArr.push({ type: 2, text: this.$refs.wangEditor.text });
      // this.scrollToBottom();

      // this.htmlText = "<p></p>";
      this.$refs.wangEditor.cleanEditor();
    },
    async sendMessage(text) {
      const { switchNormalMessage } = useCreateNormalMessage();

      const message = await switchNormalMessage(text);
      //

      let newText = text.slice(0, 20);

      console.log("newText", newText, { message });
      const res = await this.onSendMessage({ message }, newText);

      // this.scrollToBottom();
    },
    OnConnectSuccess() {},
    OnConnectFailed(e) {
      // this.initLogin();
      // 先别重试
      // this.useImInit();
      console.log("连接失败", e);
    },
    async onRecvNewMessages({ data }) {
      console.log("来消息", data, this.nowUserId, "userId");
      // 来新消息  无那个界面都刷新列表 因为切换tab不刷新列表
      if (this.activeName === "first") {
        if (this.arr.length != 0) {
          data.forEach(async (item, index) => {
            console.log("有对话来消息", data[index].recvID, this.nowUserId);

            // if (index == 0) {
            // 其他客户消息
            if (
              data[index].sendID != this.nowUserId &&
              data[index].recvID != this.nowUserId
            ) {
              console.log("不是当前会话");
              if (index == 0) {
                this.nowPage = {
                  pageSize: 30,
                  currentPage: 1,
                  total: 0,
                };
                this.arr = [];
                await this.reloadApi(0);
                //   if (this.arr.length > 0 && this.current <= this.arr.length - 1) {
                //     let cArrIndex = this.arr.findIndex((val, index) => {
                //       return this.nowDialogueId == val.dialogueId;
                //     });

                //     // this.userName = cArr.nickname;
                //     // // 其实没变
                //     // this.nowUserId = cArr.userId;
                //     // this.nowDialogueId = cArr.dialogueId;
                //     // this.userAvatar = cArr.userAvatar;
                //     // // console.log(this.userAvatar, cArr.userAvatar, "userav");
                //     // this.getCustomerInfo(this.nowUserId);
                //     // this.lastMsgTime = null;
                //     // this.sessionArr = [];
                //     // this.hasNext = true;
                //     // console.log(this.nowUserId, "now");
                //     // this.getNowMessageList(this.nowDialogueId);
                //   }
                // }
                if (this.arr.length == 0) {
                  // let cArrIndex = this.arr.findIndex((val, index) => {
                  //   return this.nowDialogueId == val.dialogueId;
                  // });
                  // if (cArrIndex == "-1" && this.arr.length == 0) {
                  this.userName = null;
                  this.nowUserId = null;
                  this.nowDialogueId = null;
                  this.scrollUserId = null;
                  this.nowBusy = false;
                  this.formLabelAlign = {
                    userId: "",
                    nickname: "",
                    email: "",
                    countryName: "",
                  };
                  this.lastMsgTime = null;
                  this.sessionArr = [];
                  this.hasNext = true;
                  // }
                }
              }
            } else if (data[index].sendID == this.nowUserId) {
              console.log("当前会话用户来消息");
              // 真实
              // this.lastMsgTime = null;
              // this.sessionArr = [];
              // this.hasNext = true;

              // await this.getNowMessageList(this.nowUserId);
              // 虚拟
              // if(data[index].sessionType)
              if (index == 0) {
                // if (this.pushFlag) {
                //   console.log(data[index], "pushDE");
                //   this.pushChatList(data[index], false, data[index].sessionType);
                //   console.log(data, "push的消息");
                // } else {
                console.log(this.nowDialogueId, "dia");
                this.lastMsgTime = null;
                this.sessionArr = [];
                this.hasNext = true;
                this.scrollDialogueId = null;
                await this.getNowMessageList(this.nowDialogueId);
                // this.pushFlag = true;
                // }

                this.scrollToBottom();
              }
              // 客服发的消息
            } else if (
              data[index].recvID == this.nowUserId &&
              this.arr.length > 0
            ) {
              console.log("当前会话我发消息");
              // this.nowPage = {
              //   pageSize: 30,
              //   currentPage: 1,
              //   total: 0,
              // };
              // this.arr = [];
              // console.log(this.arr, "arr");
              // await this.reloadApi(0);
              // if (this.arr.length == 0) {
              //   return;
              // }
              console.log(this.nowDialogueId, "dialog");
              if (this.arr[this.current].dialogueId === this.nowDialogueId) {
                console.log(this.nowDialogueId, "dialogfa");
                // this.pushChatList(data[index], true, data[index].sessionType);
                // console.log(data, "push的消息");
                this.lastMsgTime = null;
                this.sessionArr = [];
                this.hasNext = true;
                this.scrollDialogueId = null;
                await this.getNowMessageList(this.nowDialogueId);
                this.scrollToBottom();
              }
            }
            // }
          });
        } else if (this.arr.length == 0) {
          console.log("无对话来消息");
          // data.forEach(async (item, index) => {
          this.lastMsgTime = null;
          this.sessionArr = [];
          this.hasNext = true;
          this.scrollDialogueId = null;
          this.formLabelAlign = {
            userId: "",
            nickname: "",
            email: "",
            countryName: "",
          };
          this.userName = null;
          // this.nowUserId = null;

          // if (index == 0) {
          this.nowPage = {
            pageSize: 30,
            currentPage: 1,
            total: 0,
          };
          this.arr = [];
          this.current = 0;
          // }
          let resb = await this.getMyDialogueList(0);
          console.log(this.arr, "arrtt");
          if (this.arr.length == 0) {
            return;
          }
          if (resb?.data?.data?.records.length > 0) {
            this.nowDialogueId = this.arr[this.current].dialogueId;
            this.nowUserId = this.arr[this.current].userId;
            this.userAvatar = this.arr[this.current].userAvatar;
            this.userName = this.arr[this.current].nickname;
          }
          this.getCustomerInfo(this.nowUserId);
          // this.lastMsgTime = null;
          // this.sessionArr = [];
          // this.hasNext = true;
          // console.log(this.nowUserId, "now");
          this.getNowMessageList(this.nowDialogueId);
          // });
        }
      }
    },
    OnUserTokenExpired() {
      this.initLogin();
      console.log("token过期");
    },
    async initLogin() {
      const res = await this.getOpenIMConfig();

      console.log(this.openUserID, "ss12312313131313");

      const isHttps = location.protocol === "https:";
      let config;
      if (isHttps) {
        config = {
          userID: this.openUserID, // IM user userID
          token: this.openToken, // IM user token
          apiAddr: envConfig.APIS_URL,
          wsAddr: envConfig.WSS_URL,
          platformID: 5,
        };
      } else {
        config = {
          userID: this.openUserID, // IM user userID
          token: this.openToken, // IM user token
          apiAddr: envConfig.API_URL,
          wsAddr: envConfig.WS_URL,
          platformID: 5,
        };
      }

      await IMSDK.login(config)
        .then(() => {
          console.log("success");
          // this.getNowMessageList();
          initStore();
        })
        .catch(({ errCode, errMsg }) => {
          console.log(errMsg);
        });

      console.log(config, "config");
    },
    getNowMessageList(dialogueId, isSendMessage = 0, type = 1, content = "") {
      if (!this.hasNext) {
        return;
      }

      let data = {
        // openUserId: this.openUserID || "5273818844",
        dialogueId: dialogueId,
        lastMsgTime: this.lastMsgTime,
        isSendMessage,
      };
      if (isSendMessage == 1) {
        data = { ...data, content };
      }
      return nowMessageListApi(data).then((res) => {
        // 赋值聊天数组
        // 赋值最后消息事件
        console.log(res?.data?.data, "聊天记录");
        // 发送延迟 不渲染接口数据 本地数据push
        if (type !== 0) {
          this.sessionArr = [
            ...res?.data?.data.messageList,
            ...this.sessionArr,
          ];
          if (this.lastMsgTime === null) {
            // ?
            this.scrollToBottom();
          }
          this.lastMsgTime = res?.data?.data?.lastMsgTime;
          this.scrollUserId = res?.data?.data?.openUserId;
          this.scrollDialogueId = res?.data?.data?.dialogueId;
          this.hasNext = res?.data?.data?.hasNext;
          if (res?.data?.data?.messageList.length > 0 && this.meName == null) {
            this.meAvatar = res?.data?.data?.messageList[0].staffAvatar;
            this.meName = res?.data?.data?.messageList[0].staffNickName;
          }
          return this.sessionArr;
        } else {
          if (this.lastMsgTime === null) {
            // ?
            this.scrollToBottom();
          }
          if (res?.data?.data?.messageList.length > 0 && this.meName == null) {
            this.meAvatar = res?.data?.data?.messageList[0].staffAvatar;
            this.meName = res?.data?.data?.messageList[0].staffNickName;
            return this.meAvatar;
          }
        }
      });
    },
    getHistoryMessageList(
      dialogueId,
      isSendMessage = 0,
      type = 1,
      content = ""
    ) {
      if (!this.hasNext) {
        return;
      }

      let data = {
        // openUserId: this.openUserID || "5273818844",
        dialogueId: dialogueId,
        lastMsgTime: this.lastMsgTime,
        isSendMessage,
      };
      return detailMessageListApi(data).then((res) => {
        // 赋值聊天数组
        // 赋值最后消息事件
        console.log(res?.data?.data, "聊天记录");
        // 发送延迟 不渲染接口数据 本地数据push
        if (type !== 0) {
          this.sessionArr = [
            ...res?.data?.data.messageList,
            ...this.sessionArr,
          ];
          if (this.lastMsgTime === null) {
            // ?
            this.scrollToBottom();
          }
          this.lastMsgTime = res?.data?.data?.lastMsgTime;
          this.scrollUserId = res?.data?.data?.openUserId;
          this.scrollDialogueId = res?.data?.data?.dialogueId;
          this.hasNext = res?.data?.data?.hasNext;
          return this.sessionArr;
        } else {
          if (this.lastMsgTime === null) {
            // ?
            this.scrollToBottom();
          }
        }
      });
    },
    nowLoad() {
      if (this.$refs.now.scrollHeight <= this.$refs.now.offsetHeight) {
        console.log("盒子没填满");
        return;
      }
      if (!this.nowBusy) {
        this.nowBusy = true;
        this.nowPage.currentPage++;
        this.getMyDialogueList(0);
      }
      // busy状态 防止重复接口

      console.log("now触底");
    },
    historyLoad() {
      // 盒子没填满
      if (this.$refs.history.scrollHeight <= this.$refs.history.offsetHeight) {
        console.log("盒子没填满");
        return;
      }

      if (!this.historyBusy) {
        this.historyBusy = true;
        this.historyPage.currentPage++;
        this.getMyDialogueList(1);
      }
      // busy状态 防止重复接口
      console.log("触底");
    },
    getOpenIMConfig() {
      return openIMLoginApi().then((res) => {
        // console.log(res, "err");
        if (res?.data?.success) {
          this.openUserID = res.data.data.openUserId;
          this.openToken = res.data.data.token;
          console.log(this.openToken, this.openUserID, "idtoken");
        }
        // console.log(res, "config");
      });
    },

    screen() {
      console.log("筛选");
      this.screenFlag = true;
    },
    back() {
      // console.log("筛选");
      this.screenFlag = false;
    },

    createGD() {
      // this.$refs.newWorkOrderRef.open({
      //   title: "新建工单",
      // });
      let data;
      if (this.activeName === "first") {
        data = { dialogueId: this.nowDialogueId };
      } else if (this.activeName === "seconds") {
        data = { dialogueId: this.historyDialogueId };
      }
      // console.log(data, "data");
      this.$refs.refRefundModal.show(data);
    },

    overSession() {
      if (this.activeName === "first") {
        if (this.arr.length == 0) {
          return;
        }
        this.$refs.closeSessionRef.open({
          title: "结束会话确认",
        });
      } else if (this.activeName === "seconds") {
        const data = { userId: this.historyUserId };
        console.log(data);

        staffOpenApi(data).then(async (res) => {
          // 发起会话
          if (res?.data?.success) {
            this.nowPage = {
              pageSize: 30,
              currentPage: 1,
              total: 0,
            };
            this.arr = [];
            this.current = 0;
            this.nowDialogueId = null;
            this.nowUserId = null;
            console.log(this.dialogListBusy, "gg");
            const resb = await this.getMyDialogueList(0);
            if (resb?.data?.data?.records.length > 0) {
              console.log(
                this.nowDialogueId,
                resb,
                "resb",
                this.arr[0].dialogueId
              );

              this.nowDialogueId = this.arr[0].dialogueId;
              this.nowUserId = this.arr[0].userId;
              this.userAvatar = this.arr[0].userAvatar;
              this.userName = this.arr[0].nickname;
              console.log(
                this.nowDialogueId,
                resb,
                "resd",
                this.arr[0].dialogueId
              );
            }
            this.lastMsgTime = null;
            this.sessionArr = [];
            this.hasNext = true;
            this.scrollDialogueId = null;
            if (resb?.data?.data.records?.length > 0) {
              await this.getCustomerInfo(this.nowUserId);
              await this.getNowMessageList(this.nowDialogueId);
            }

            // // 切回去的处理
            // this.historyPage = {
            //   pageSize: 30,
            //   currentPage: 1,
            //   total: 0,
            // };
            // this.arrTwo = [];
            // this.currentTwo = 0;
            // await this.getMyDialogueList(1);
            console.log("Q", this.arr);
            this.activeName = "first";
          }
          // console.log(res);
        });
      }
    },

    overFun() {
      // 会话记录id
      const data = { dialogueId: this.nowDialogueId };
      // this.nowUserId = null;
      staffCloseApi(data).then(async (res) => {
        console.log(res);
        if (res?.data?.success) {
          const e = { name: this.activeName };
          this.nowPage = {
            pageSize: 30,
            currentPage: 1,
            total: 0,
          };
          this.arr = [];
          this.current = 0;
          // this.nowUserId = null;
          await this.getMyDialogueList(0);

          this.historyPage = {
            pageSize: 30,
            currentPage: 1,
            total: 0,
          };
          this.arrTwo = [];
          this.currentTwo = 0;
          this.historyDialogueId = null;
          const resb = await this.getMyDialogueList(1);
          if (resb?.data?.data?.records.length > 0) {
            this.historyDialogueId = this.arrTwo[0].dialogueId;
            this.historyUserId = this.arrTwo[0].userId;
            this.userAvatar = this.arrTwo[0].userAvatar;
            this.userNameTwo = this.arrTwo[0].nickname;
          }

          this.lastMsgTime = null;
          this.sessionArr = [];
          this.hasNext = true;
          this.formLabelAlign = {
            userId: "",
            nickname: "",
            email: "",
            countryName: "",
          };
          if (this.arrTwo.length > 0) {
            await this.getHistoryMessageList(this.historyDialogueId);
            this.getCustomerInfo(this.historyUserId);
          }
          this.$message.success("结束会话成功");
          // this.overFlag = true;
          this.activeName = "seconds";
          // this.scrollToBottom();
        }
      });
    },

    async setCurrent(index, dialogueId, userId, userAvatar, userName) {
      if (index == this.current) {
        return;
      }
      console.log(index, "index");
      this.current = index;
      this.nowDialogueId = dialogueId;
      this.nowUserId = userId;
      this.userAvatar = userAvatar;
      this.userName = userName;
      this.lastMsgTime = null;
      this.sessionArr = [];
      this.hasNext = true;
      this.scrollDialogueId = null;

      // 获取聊天记录
      await this.getNowMessageList(this.nowDialogueId);
      await this.getCustomerInfo(this.nowUserId);

      // this.arr = [];
      // this.getMyDialogueList(0);
      this.scrollToBottom();

      const i = this.arr.findIndex((val) => {
        return val.dialogueId == this.nowDialogueId;
      });
      // console.log(i, this.arr, "fi");
      this.arr[i].isStaffRead = true;
      // this.$forceUpdate();
    },

    async handleClick(e) {
      console.log(e.name);
      // 同样获取聊天记录
      this.lastMsgTime = null;
      this.sessionArr = [];
      this.hasNext = true;
      this.formLabelAlign = {
        userId: "",
        nickname: "",
        email: "",
        countryName: "",
      };
      this.userName = null;
      this.nowUserId = null;
      // this.nowUserId = null;
      if (e.name === "first") {
        if (this.arr.length > 0) {
          // 自动结束处理
          this.nowPage = {
            pageSize: 30,
            currentPage: 1,
            total: 0,
          };
          this.arr = [];

          // this.nowDialogueId = null;
          // await this.getMyDialogueList(0);
          await this.reloadApi(0);
          // 自动结束

          if (this.arr.length > 0 && this.current <= this.arr.length - 1) {
            let cArr = this.arr.find((val, index) => {
              return this.current == index;
            });
            this.userName = cArr.nickname;
            // 其实没变
            this.nowUserId = cArr.userId;
            this.nowDialogueId = cArr.dialogueId;
            this.userAvatar = cArr.userAvatar;
            // console.log(this.userAvatar, cArr.userAvatar, "userav");
            this.getCustomerInfo(this.nowUserId);
            this.lastMsgTime = null;
            this.sessionArr = [];
            this.hasNext = true;
            console.log(this.nowUserId, "now");
            this.scrollDialogueId = null;
            this.getNowMessageList(this.nowDialogueId);
          }
        }
      } else if (e.name === "seconds") {
        this.historyPage = {
          pageSize: 30,
          currentPage: 1,
          total: 0,
        };
        this.arrTwo = [];
        this.historyUserId = null;
        // await this.getMyDialogueList(1);
        await this.reloadApi(1);
        console.log(this.arrTwo, "hand");
        if (
          this.arrTwo.length > 0 &&
          this.currentTwo <= this.arrTwo?.length - 1
        ) {
          let dArr = this.arrTwo.find((val, index) => {
            return this.currentTwo == index;
          });
          console.log(dArr, "darr");
          this.userNameTwo = dArr.nickname;
          // 其实没变
          this.historyUserId = dArr.userId;
          this.historyDialogueId = dArr.dialogueId;
          this.userAvatar = dArr.userAvatar;
          this.getCustomerInfo(this.historyUserId);
          this.lastMsgTime = null;
          this.sessionArr = [];
          this.hasNext = true;
          // console.log(this.historyUserId, "history");
          this.getHistoryMessageList(this.historyDialogueId);
        }
      }
    },

    // 重复请求
    async reloadApi(type) {
      if (type == 0) {
        const res = await this.getMyDialogueList(type);
        if (res?.data?.data?.records.length == 0) {
          if (this.current > this.arr.length - 1) {
            this.current = 0;
          }
          return;
        }
        if (this.arr.length > 0) {
          if (this.current > this.arr.length - 1) {
            this.nowPage.currentPage++;
            return this.reloadApi(0);
          } else if (this.current != 0 && this.current <= this.arr.length - 1) {
            this.current = this.arr.findIndex((val) => {
              return val.dialogueId == this.nowDialogueId;
            });
            if (this.current == "-1") {
              this.current = 0;
            }
          }
        } else {
          this.current = 0;
        }
      } else if (type == 1) {
        const res = await this.getMyDialogueList(type);
        if (res?.data?.data?.records.length == 0) {
          if (this.currentTwo > this.arrTwo.length - 1) {
            this.currentTwo = 0;
          }
          return;
        }
        if (this.arrTwo.length > 0) {
          if (this.currentTwo > this.arrTwo.length - 1) {
            this.historyPage.currentPage++;
            return this.reloadApi(1);
          } else if (
            this.currentTwo !== 0 &&
            this.currentTwo <= this.arrTwo.length - 1
          ) {
            this.currentTwo = this.arrTwo.findIndex((val) => {
              return val.dialogueId == this.historyDialogueId;
            });
            if (this.currentTwo == "-1") {
              this.currentTwo = 0;
            }
          }
        } else {
          this.currentTwo = 0;
        }
      }
    },

    async setHistoryCurrent(index, dialogueId, userId, userAvatar, userName) {
      if (index == this.currentTwo) {
        return;
      }
      // 显示聊天记录
      this.currentTwo = index;
      this.historyDialogueId = dialogueId;
      this.historyUserId = userId;
      this.userAvatar = userAvatar;
      this.userNameTwo = userName;
      this.lastMsgTime = null;
      this.sessionArr = [];
      this.hasNext = true;
      await this.getHistoryMessageList(this.historyDialogueId);
      this.getCustomerInfo(this.historyUserId);
      this.scrollToBottom();
    },

    // beforeUpload(file) {
    //   console.log(file, "1");
    // },

    scrollToBottom(hasMedia = true) {
      if (hasMedia) {
        this.timerId = setTimeout(() => {
          this.$nextTick(() => {
            var container = this.$refs.wmc;
            if (container) {
              if (container?.scrollHeight == 0) {
                return;
              }
              container.scrollTop =
                container?.scrollHeight - container?.offsetHeight;
            }
          });
        }, 250);
      } else {
        this.$nextTick(() => {
          var container = this.$refs.wmc;

          container.scrollTop = container.scrollHeight - container.offsetHeight;
          // console.log(
          //   container.scrollTop,
          //   container.scrollHeight,
          //   container.offsetHeight,
          //   "123",
          //   "bottoafter"
          // );
        });
      }
    },
    // getUpdataData() {
    //   //定时获取后台返回数据
    //   this.scrollToBottom();
    // },
    getMyDialogueList(type = 0, i) {
      // 当前current 对应的index
      // const currentFlag = this.nowDialogueId;
      if (type == 0) {
        if (this.dialogListBusy) {
          return;
        }
        this.dialogListBusy = true;
        const nowPage = {
          current: this.nowPage.currentPage,
          size: this.nowPage.pageSize,
        };
        let data = { ...nowPage, type: 0 };
        return myDialogueListApi(data).then((res) => {
          if (res.data && res?.data?.data?.records.length !== 0) {
            console.log(this.arr, "arr");
            this.arr = [...this.arr, ...res.data.data.records];
            console.log(this.nowDialogueId, "列表接口now绘画id");

            // if (this.nowDialogueId) {
            //   this.current = this.arr.findIndex((val) => {
            //     return val.dialogueId == this.nowDialogueId;
            //   });
            //   // 超过30条处理
            //   if (this.current == "-1" && i == "newMessage") {
            //     if (res?.data?.data?.records.length == 0) {
            //       this.nowDialogueId = null;
            //     } else {
            //       this.nowPage.currentPage++;
            //       return this.getMyDialogueList(0, "newMessage");
            //     }
            //   }
            // }
            // if (this.current == "-1") {
            //   this.current = 0;
            // }
            // // this.current = 0;
            // // if (this.current == 0) {
            // if (this.arr.length > 0 && this.current <= this.arr?.length - 1) {
            //   this.nowDialogueId = this.arr[this.current].dialogueId;
            //   this.nowUserId = this.arr[this.current].userId;
            //   this.userAvatar = this.arr[this.current].userAvatar;
            //   this.userName = this.arr[this.current].nickname;
            // }
            // }
            // if (this.activeName == "first") {
            //   this.getCustomerInfo(this.nowUserId);
            // }
            if (res?.data?.data.records.length > 0) {
              this.nowBusy = false;
            }
          }
          this.dialogListBusy = false;
          return res;
        });
      } else if (type == 1) {
        const historyPage = {
          current: this.historyPage.currentPage,
          size: this.historyPage.pageSize,
        };
        let data = { ...historyPage, type: 1 };
        if (this.formLabel?.time?.length > 0) {
          let obj = {
            startTime: this.formLabel.time[0],
            endTime: this.formLabel.time[1],
          };
          data = { ...data, ...obj };
        }
        return myDialogueListApi(data).then((res) => {
          console.log(res, "历史会话");
          console.log(this.historyPage.currentPage, "hispage");
          if (res.data && res.data.data.records) {
            this.arrTwo = [...this.arrTwo, ...res.data.data.records];
            console.log(this.arrTwo);

            // if (this.historyDialogueId) {
            //   this.currentTwo = this.arrTwo.findIndex((val) => {
            //     console.log(val.dialogueId, "val", this.nowDialogueId);
            //     return val.dialogueId == this.historyDialogueId;
            //   });
            //   if (this.currentTwo == "-1" && i == "newMessage") {
            //     if (res?.data?.data?.records.length == 0) {
            //       this.historyDialogueId = null;
            //     } else {
            //       this.currentTwo = 0;
            //       this.historyPage.currentPage++;
            //       return this.getMyDialogueList(1, "newMessage");
            //     }
            //   }
            // }
            // if (this.currentTwo == "-1") {
            //   this.currentTwo = 0;
            // }
            // if (
            //   this.arrTwo?.length != 0 &&
            //   this.currentTwo <= this.arrTwo?.length - 1
            // ) {
            //   this.historyDialogueId = this.arrTwo[this.currentTwo].dialogueId;
            //   this.historyUserId = this.arrTwo[this.currentTwo].userId;
            //   this.userAvatar = this.arrTwo[this.currentTwo].userAvatar;
            //   this.userNameTwo = this.arrTwo[this.currentTwo].nickname;
            // }
            // if (this.activeName == "seconds") {
            //   this.getCustomerInfo(this.historyUserId);
            // }
            if (res?.data?.data.records.length > 0) {
              this.historyBusy = false;
              // this.historyPage.currentPage++;
            }
          }
          return res;
        });
      }
    },

    // 切换的
    getMyDialogueListHandelClick() {
      // 当前current 对应的index
      // const currentFlag = this.nowDialogueId;
      const nowPage = {
        current: this.nowPage.currentPage,
        size: this.nowPage.pageSize,
      };
      let data = { ...nowPage, type: 0 };
      return myDialogueListApi(data).then((res) => {
        // console.log(this.nowPage.currentPage, "nowpage");
        // console.log(res, "当前会话");
        if (res.data && res?.data?.data?.records.length !== 0) {
          this.arr = [...this.arr, ...res.data.data.records];
          console.log(this.nowDialogueId, "nowDialogIDkk");
          // if (this.nowDialogueId) {
          //   this.current = this.arr.findIndex((val) => {
          //     return val.dialogueId == this.nowDialogueId;
          //   });
          //   // 超过30条处理
          //   if (this.current == "-1") {
          //     if (res?.data?.data?.records.length == 0) {
          //       this.nowDialogueId = null;
          //     } else {
          //       this.nowPage.currentPage++;
          //       return this.getMyDialogueList(0, "newMessage");
          //     }
          //   }
          // }
          // if (this.current == "-1") {
          //   this.current = 0;
          // }
          // if (this.arr.length > 0 && this.current <= this.arr?.length - 1) {
          //   this.nowDialogueId = this.arr[this.current].dialogueId;
          //   this.nowUserId = this.arr[this.current].userId;
          //   this.userAvatar = this.arr[this.current].userAvatar;
          //   this.userName = this.arr[this.current].nickname;
          // }
          // }
          // if (this.activeName == "first") {
          //   this.getCustomerInfo(this.nowUserId);
          // }
          if (res?.data?.data.records.length > 0) {
            this.nowBusy = false;
          }
        }
        return res;
      });
    },

    getMyDialogueListHandelClickTwo() {
      // 当前current 对应的index
      // const currentFlag = this.nowDialogueId;
      const historyPage = {
        current: this.historyPage.currentPage,
        size: this.historyPage.pageSize,
      };
      let data = { ...historyPage, type: 1 };
      if (this.formLabel?.time?.length > 0) {
        let obj = {
          startTime: this.formLabel.time[0],
          endTime: this.formLabel.time[1],
        };
        data = { ...data, ...obj };
      }
      return myDialogueListApi(data).then((res) => {
        console.log(res, "历史会话");
        console.log(this.historyPage.currentPage, "hispage");
        if (res.data && res.data.data.records) {
          this.arrTwo = [...this.arrTwo, ...res.data.data.records];

          // if (this.historyDialogueId) {
          //   this.currentTwo = this.arrTwo.findIndex((val) => {
          //     // console.log(val.dialogueId, "val", this.nowDialogueId);
          //     return val.dialogueId == this.historyDialogueId;
          //   });
          //   if (this.currentTwo == "-1") {
          //     this.currentTwo = 0;
          //     if (res?.data?.data.records.length == 0) {
          //       this.historyDialogueId = null;
          //     } else {
          //       this.historyPage.currentPage++;
          //       return this.getMyDialogueList(1, "newMessage");
          //     }
          //   }

          //   // console.log(this.current, "currentll");
          // }
          // if (
          //   this.arrTwo?.length != 0 &&
          //   this.currentTwo <= this.arrTwo?.length - 1
          // ) {
          //   this.historyDialogueId = this.arrTwo[this.currentTwo].dialogueId;
          //   this.historyUserId = this.arrTwo[this.currentTwo].userId;
          //   this.userAvatar = this.arrTwo[this.currentTwo].userAvatar;
          //   this.userNameTwo = this.arrTwo[this.currentTwo].nickname;
          // }
          // if (this.activeName == "seconds") {
          //   this.getCustomerInfo(this.historyUserId);
          // }
          if (res?.data?.data.records.length > 0) {
            this.historyBusy = false;
            // this.historyPage.currentPage++;
          }
        }
        return res;
      });
    },

    getCustomerInfo(userId = null) {
      let data = undefined;
      if (userId === null) {
        data = { userId: this.nowUserId };
      } else {
        data = { userId };
      }
      // userId
      getCustomerInfoApi(data).then((res) => {
        this.formLabelAlign = res.data.data;
        console.log(res, "客户信息", this.formLabelAlign);
      });
    },
    async startScreen() {
      // this.nowUserId = null;
      // 开始筛选
      // this.historyPage = {
      //   pageSize: 30,
      //   currentPage: 1,
      //   total: 0,
      // };
      // this.currentTwo = 0;
      // this.arrTwo = [];
      // this.historyDialogueId = null;
      // this.userNameTwo = null;
      // console.log(this.formLabel, "formLabel");
      // const res = await this.getMyDialogueList(1);
      this.historyPage = {
        pageSize: 30,
        currentPage: 1,
        total: 0,
      };
      this.arrTwo = [];
      this.formLabelAlign = {
        userId: "",
        nickname: "",
        email: "",
        countryName: "",
      };
      this.lastMsgTime = null;
      this.sessionArr = [];
      this.hasNext = true;
      this.userNameTwo = null;
      // this.historyDialogueId = null;
      // await this.getMyDialogueList(1);
      await this.reloadApi(1);
      console.log(this.arrTwo, "hand", this.currentTwo);
      if (
        this.arrTwo.length > 0 &&
        this.currentTwo <= this.arrTwo?.length - 1
      ) {
        // console.log(this.arrTwo, "hand");
        let dArr = this.arrTwo.find((val, index) => {
          return this.currentTwo == index;
        });
        console.log(dArr, "darr");
        this.userNameTwo = dArr.nickname;
        // 其实没变
        this.historyUserId = dArr.userId;
        this.historyDialogueId = dArr.dialogueId;
        this.userAvatar = dArr.userAvatar;

        this.getCustomerInfo(this.historyUserId);
        // console.log(this.historyUserId, "history");
        this.getHistoryMessageList(this.historyDialogueId);
      }

      // console.log(res, "gee");
      // this.lastMsgTime = null;
      // this.sessionArr = [];
      // this.hasNext = true;
      // this.formLabelAlign = {
      //   userId: "",
      //   nickname: "",
      //   email: "",
      //   countryName: "",
      // };
      // if (this.arrTwo.length > 0) {
      //   await this.getHistoryMessageList(this.historyDialogueId);
      //   this.getCustomerInfo(this.historyUserId);
      // }

      // console.log(this.currentTwo);
      this.back();
    },
    scrolling() {
      this.$nextTick(async () => {
        // console.log("滚动22");
        var container = this.$refs.wmc;

        if (this.$refs.wmc.scrollHeight <= this.$refs.wmc.offsetHeight) {
          console.log("盒子没填满");
          return;
        }
        // let scrollTop =
        //   element.scrollHeight(滚动区域的滚动高度) -
        //   this.lastScrollHeight(上一次的高度);
        // element.scrollTop = scrollTop;

        if (container.scrollTop == 0) {
          console.log("触顶");
          this.lastScrollHeight = this.$refs.wmc?.scrollHeight;
          console.log(this.lastScrollHeight);

          if (this.activeName == "first") {
            await this.getNowMessageList(this.scrollDialogueId);
          } else if (this.activeName == "seconds") {
            await this.getHistoryMessageList(this.scrollDialogueId);
          }
          // await this.getNowMessageList(this.scrollDialogueId);
          this.$nextTick(() => {
            let scrollTop = this.$refs.wmc.scrollHeight - this.lastScrollHeight;
            console.log(
              scrollTop,
              this.$refs.wmc.scrollHeight,
              this.lastScrollHeight
            );
            this.$refs.wmc.scrollTop = scrollTop;
          });
          // console.log("加载数据");
        }
      });
      // console.log("滚动");
    },

    async onSendMessage(options, content) {
      if (this.activeName === "seconds") {
        this.$message.warning("请右上角发起会话");
        return;
      }
      try {
        console.log(
          {
            recvID: this.nowUserId,
            groupID: "",
            ...options,
          },
          "99"
        );
        const { data } = await IMSDK.sendMessage({
          recvID: String(this.nowUserId),
          groupID: "",
          ...options,
        });
        // debugger;
        // 假数据上拉加载
        // this.lastMsgTime = null;
        // this.sessionArr = [];
        // this.hasNext = true;
        // qqq
        this.pushChatList(options.message);
        const ra = await this.getNowMessageList(
          Number(this.scrollDialogueId),
          1,
          0,
          content
        );
        console.log(content, "ra");
        // if (ra.length > 0) {
        //   if (ra[ra.length - 1]) {

        // }

        // }

        this.scrollToBottom();
        return data;
      } catch (e) {
        console.log(e);
      }
    },
    sendPic(data) {
      console.log(data, "dddda");
      const content = "[图片]";
      this.onSendMessage(data, content);
    },
    formatItemSession(item, isSelf = true, sessionType = 1) {
      console.log(item, "userITem");
      return {
        // ...item,
        // isSelf: +item.sendID === (+openUserId.value || userId.value),
        isSelf: isSelf,
        content: item.textElem?.content,
        pictureUrl: item.pictureElem?.sourcePicture?.url,
        pictureShortUrl: item.pictureElem?.snapshotPicture?.url,
        // notification: item.notificationElem?.detail,
        gmtCreate: item.createTime,
        sessionType: item?.sessionType ? item.sessionType : sessionType,
        // isSelf
        staffAvatar: isSelf ? this.meAvatar : this.userAvatar,
        staffNickName: isSelf ? this.meName : this.userName,
        // isSystem: flag,
      };
    },
    imgLoad() {
      // console.log(this.onceFlag, "sff");
      // if (this.onceFlag) {
      //   console.log(this.onceFlag, "sffr");
      //   this.scrollToBottom();
      //   // this.onceFlag = false;
      // }
      // this.onceFlag = true;
    },
    pushChatList(data, isSelf = true, sessionType = 1) {
      data = data instanceof Array ? data : [data];
      const newList = data.filter((item) => item.textElem || item.pictureElem);
      console.log(newList, "newList");
      if (newList.length != 0) {
        this.sessionArr = this.sessionArr.concat(
          newList.map((item, i) =>
            this.formatItemSession(item, isSelf, sessionType)
          )
        );
        console.log(this.sessionArr, "sessionArr");
        this.scrollToBottom();
        // if (flag === null) scrollToBottom(hasMedia);
        // if (flag === false) scrollToBottom(hasMedia);
      }
    },
    formatIMPic(url) {
      const isHttps = location.protocol === "https:";
      const { VUE_APP_API_URL, VUE_APP_APIS_URL } = process.env;
      if (isHttps) {
        return url.replace(VUE_APP_API_URL, VUE_APP_APIS_URL);
      }
      return url;
    },
    OnKickedOffline() {
      this.$alert("当前设备被踢下线,请客服重新登陆", "客服系统提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `可刷新页面重新登陆`,
          });
        },
      });
    },
  },
  beforeDestroy() {
    // const status = IMSDK.logout()
    //   .then(() => {
    //     // 退出登录成功
    //   })
    //   .catch(({ errCode, errMsg }) => {
    //     // 调用失败
    //   });
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.$refs.wmc.removeEventListener("scroll", this.scrolling);
  },
  filters: {
    // 自定义过滤器：使用正则表达式过滤日期字符串
    formatDateRegex(value) {
      // 使用正则表达式匹配日期部分后的内容
      const regex = /(\d{2}:\d{2})/;
      const match = value.match(regex);

      // 返回匹配的结果，即日期后的内容
      return match ? match[0] : value;
    },
    formatTime(value) {
      if (!value) return "";

      // 创建 Date 对象，并使用 getTime() 方法将时间戳转换为毫秒数
      const date = new Date(value);

      // 获取年、月、日、时、分、秒
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要加 1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // 拼接格式化后的时间字符串
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedTime;
    },
  },
};
</script>

<style lang="scss" scoped>
// /deep/ .el-card__body{

// }

.bigW {
  background-color: palegreen;
  width: -webkit-calc(100vw - 310px);
  width: -moz-calc(100vw - 310px);
  width: calc(100vw - 310px);
  height: -webkit-calc(100vh - 130px);
  height: -moz-calc(100vh - 130px);
  height: calc(100vh - 130px);
  margin: 0 auto;
}

/deep/ .el-tabs {
  height: 100%;
}
/deep/ .el-tabs__header {
  margin: 0;
}
/deep/ .el-tabs__content {
  height: calc(100% - 40px);
}

/deep/ .el-tab-pane {
  height: 100%;
}

.sendButton {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.content {
  // width: 100%;
  // height: 100%;
  // width: calc(100%-40px) !important;
  // height: calc(100%-150px) !important;
  background-color: palegreen;
  width: -webkit-calc(100vw - 310px);
  width: -moz-calc(100vw - 310px);
  width: calc(100vw - 310px);
  height: -webkit-calc(100vh - 130px);
  height: -moz-calc(100vh - 130px);
  height: calc(100vh - 130px);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  background-color: #f4f4f4;
  box-shadow: 2px 2px 2px 2px #ccc;
  .left {
    // width: 270px;
    flex: 1;
    min-width: 0;
    height: 100%;
    background-color: #fff;
    position: relative;
    margin-right: 5px;
    .button {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
      z-index: 9;
    }
    .now {
      height: 100%;
      // height: calc(100% - 40px);
      overflow: auto;
      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        li {
          width: 100%;
          height: 60px;
          // background: orange;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // border-top: 1px solid #000;
          border-bottom: 1px solid #f2f2f2;
        }
      }
      .nowCustomer {
        .currentLi {
          background-color: #eaf1fe;
        }
        .nowCustomerSon {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .liAvatar {
            // flex: 1;
            // margin-right: 10px;
            width: 60px;
            height: 60px;
            padding: 10px;
            /deep/ .el-avatar,
            .el-avatar--circle {
              margin: 0 auto;
            }
          }
          .liInformation {
            flex: 2;
            font-size: 12px;
            min-width: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            .liTop {
              display: flex;
              justify-content: space-between;
            }
            .liInformationName {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .liInformationSession {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .liTime {
            // flex: 1;
            font-size: 12px;
            // margin: 10px;
            margin-right: 10px;
          }
        }
      }
    }
    .history {
      height: 100%;
    }
  }
  .right {
    // width: 400px;
    flex: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      width: 100%;
      height: 40px;
      // border-bottom: 1px solid #000;
      box-shadow: #cccccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      .name {
        font-size: 16px;
        padding-left: 10px;
        .flag {
          font-size: 12px;
          margin-left: 5px;
          color: #cccccc;
        }
      }
      .btnDiv {
        /deep/ .el-button {
          border: none;
          color: #2571f6;
        }
      }
    }
    .session {
      flex: 1;
      display: flex;
      justify-content: space-between;

      .sessionContent {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #f9f9f9;
        .wmc {
          height: calc(100vh - 320px);
          overflow: auto;
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
                background-color: #fff;
                margin-top: 10px;
                border-radius: 5px;
                // padding: 5px;
                font-size: 14px;
                line-height: 30px;
                padding: 10px 14px;
                letter-spacing: 0.5px;
                white-space: pre-wrap;
                // box-shadow: 0px 0px 2px 2px #ccc;
              }
            }
            .wmcLeft {
              flex-direction: row;
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
                // display: flex;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                position: relative;

                .isRead {
                  font-size: 12px;
                  line-height: 12px;
                  position: absolute;
                  bottom: -17px;
                  right: 0;
                  color: #c2c3c5;
                }
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
            padding-top: 5px;
            // padding: 50px;
          }
        }
        .dhk {
          height: 150px;
          background-color: #fff;
          position: relative;
          .clickDiv {
            height: 30px;
          }
          /deep/ .el-textarea {
            // border: none;
            // border-color: transparent;
            textarea {
              border: none;
            }
          }
        }
      }
      .aside {
        // width: 200px;
        flex: 1;
        height: 100%;
        background-color: #fff;
        .title {
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          border-bottom: 0.5px solid #ccc;
          .titleText {
            // padding-left: 20px;
          }
        }
        .information {
          padding-top: 20px;
          padding-left: 20px;
          padding-right: 20px;
          .smTitle {
            margin-bottom: 10px;
          }
          /deep/ .el-form-item__label {
            padding: 0;
            line-height: 0;
          }
        }
      }
    }
  }

  .leftTwo {
    display: flex;
    flex-direction: column;
    height: 100%;
    .title {
      height: 40px;
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #ccc;

      /deep/ .el-button {
        // border: none;
        height: 30px;
        margin-top: 5px;
      }
    }
    .leftForm {
      margin: 50px 0 0 0;
    }
    /deep/ .el-select {
      width: 100%;
      background-color: #fff;
    }

    /deep/ .el-date-editor,
    .el-range-editor,
    .el-input__inner,
    .el-date-editor--daterange {
      width: 100%;
      padding: 0;
      // background-color: #fff;
    }

    /deep/ .el-date-editor .el-range-separator {
      padding: 0;
    }
  }
}
</style>

import { getSDK } from "@/util/lib";
import { CbEvents } from "@/util/lib/constant";

export const IMSDK = getSDK();

// export const getCleanText = (text) => {
//   return text.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, "");
// };
export const initStore = () => {
  const { getSelfInfoByReq } = useUserStore.getState();
  const {
    getFriendListByReq,
    getBlackListByReq,
    getGroupListByReq,
    getRecvFriendApplicationListByReq,
    getRecvGroupApplicationListByReq,
    getSendFriendApplicationListByReq,
    getSendGroupApplicationListByReq,
  } = useContactStore.getState();
  const { getConversationListByReq, getUnReadCountByReq } =
    useConversationStore.getState();

  getConversationListByReq();
  getUnReadCountByReq();
  getSelfInfoByReq();
  getFriendListByReq();
  getBlackListByReq();
  getGroupListByReq();
  getRecvFriendApplicationListByReq();
  getRecvGroupApplicationListByReq();
  getSendFriendApplicationListByReq();
  getSendGroupApplicationListByReq();
};

export const getPicInfo = (file) => {
  return new Promise((resolve) => {
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };

    console.log(file, img, "1");
    img.src = _URL.createObjectURL(file);
  });
};

export const getMediaDuration = (path) => {
  return new Promise((resolve) => {
    const vel = new Audio(path);
    vel.onloadedmetadata = async function () {
      // resolve(vel.duration);
      resolve(Number(vel.duration.toFixed()));
    };
  });
};

export const getVideoSnshot = (item) => {
  return new Promise((reslove) => {
    var video = document.createElement("VIDEO");
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("muted", "muted");
    video.innerHTML = "<source src=" + item + ' type="audio/mp4">';
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    video.addEventListener("canplay", function () {
      var anw = document.createAttribute("width");
      //@ts-ignore
      anw.nodeValue = video.videoWidth;
      var anh = document.createAttribute("height");
      //@ts-ignore
      anh.nodeValue = video.videoHeight;
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);
      //@ts-ignore
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      var base64 = canvas.toDataURL("image/png");
      //@ts-ignore
      video.pause();
      const file = base64toFile(base64);
      reslove(file);
    });
  });
};

export const MessageType = {
  TextMessage: 101,
  PictureMessage: 102,
  VoiceMessage: 103,
  VideoMessage: 104,
  FileMessage: 105,
  AtTextMessage: 106,
  MergeMessage: 107,
  CardMessage: 108,
  LocationMessage: 109,
  CustomMessage: 110,
  TypingMessage: 113,
  QuoteMessage: 114,
  FaceMessage: 115,
  FriendAdded: 1201,
  OANotification: 1400,
  GroupCreated: 1501,
  GroupInfoUpdated: 1502,
  MemberQuit: 1504,
  GroupOwnerTransferred: 1507,
  MemberKicked: 1508,
  MemberInvited: 1509,
  MemberEnter: 1510,
  GroupDismissed: 1511,
  GroupMemberMuted: 1512,
  GroupMemberCancelMuted: 1513,
  GroupMuted: 1514,
  GroupCancelMuted: 1515,
  GroupMemberInfoUpdated: 1516,
  GroupMemberToAdmin: 1517,
  GroupAdminToNomal: 1518,
  GroupAnnouncementUpdated: 1519,
  GroupNameUpdated: 1520,
  BurnMessageChange: 1701,
  RevokeMessage: 2101,
  HasReadReceiptMessage: 2150,
  GroupHasReadReceipt: 2155,
};

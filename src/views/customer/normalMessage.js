// import { showToast } from "vant";
// import { IMSDK, getCleanText } from "@/utils/imCommon";

import { getSDK } from "@/util/lib";
import { CbEvents } from "@/util/lib/constant";
import { IMSDK } from "../../util/imCommon";
import { Message, MessageBox } from "element-ui";

export default function useCreateNormalMessage() {
  //   const getCleanTextWithBr = (text) => {
  //     text = text.replace(/<div>/g, "\n").replace(/<\/div>/g, "");
  //     return getCleanText(text);
  //   };

  const getTextMessage = async (text) => {
    // const formattedText = getCleanTextWithBr(text);
    // console.log(formattedText, "123");
    console.log(text, "萨芬");

    console.log(await IMSDK.createTextMessage(text), "sfsff嗷嗷");
    return (await IMSDK.createTextMessage(text)).data;
  };

  const switchNormalMessage = async (text) => {
    console.log(text, "13213ttt");
    let message = await getTextMessage(text);

    console.log(message, "mess");
    // if (!message) {
    //   Message.fail("发送会话失败");

    //   return;
    // }
    return message;
  };

  return {
    switchNormalMessage,
    // getCleanText,
  };
}

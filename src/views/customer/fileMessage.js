import {
  IMSDK,
  getPicInfo,
  MessageType,
  getMediaDuration,
  getVideoSnshot,
} from "../../util/imCommon";
import { v4 as uuidV4 } from "uuid";

export default function useCreateFileMessage() {
  const getFileData = (data) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(data);
    });
  };

  const getFileType = (name) => {
    const idx = name.lastIndexOf(".");
    return name.slice(idx + 1);
  };

  const getImageMessage = async (file) => {
    const { width, height } = await getPicInfo(file);
    const baseInfo = {
      uuid: uuidV4(),
      type: getFileType(file.name),
      size: file.size,
      width,
      height,
      url: URL.createObjectURL(file),
    };
    const options = {
      sourcePicture: baseInfo,
      bigPicture: baseInfo,
      snapshotPicture: baseInfo,
      sourcePath: "",
      file,
    };
    return (await IMSDK.createImageMessageByFile(options)).data;
  };

  const getVideoMessage = async (file, snapShotFile) => {
    const { width, height } = await getPicInfo(snapShotFile);
    const options = {
      videoFile: file,
      snapshotFile: snapShotFile,
      videoPath: "",
      duration: await getMediaDuration(URL.createObjectURL(file)),
      videoType: getFileType(file.name),
      snapshotPath: "",
      videoUUID: uuidV4(),
      videoUrl: "",
      videoSize: file.size,
      snapshotUUID: uuidV4(),
      snapshotSize: snapShotFile.size,
      snapshotUrl: URL.createObjectURL(snapShotFile),
      snapshotWidth: width,
      snapshotHeight: height,
      snapShotType: getFileType(file.name),
    };
    return (await IMSDK.createVideoMessageByFile(options)).data;
  };

  const createFileMessage = async (file, messageType) => {
    let snapShotFile = undefined;
    if (messageType === MessageType.VideoMessage) {
      try {
        snapShotFile = await getVideoSnshot(URL.createObjectURL(file));
      } catch (error) {
        return {
          error: "get video snapShotFile failed",
        };
      }
    }
    switch (messageType) {
      case MessageType.PictureMessage:
        return {
          message: await getImageMessage(file),
          buffer: await getFileData(file),
        };
      case MessageType.VideoMessage:
        return {
          message: await getVideoMessage(file, snapShotFile),
          buffer: await getFileData(file),
          snapBuffer: await getFileData(snapShotFile),
        };
      default:
        return {
          error: "message type error",
        };
    }
  };

  return {
    createFileMessage,
  };
}

<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{
        height: height + 'px',
        width: width + 'px',
        'overflow-y': 'hidden',
        'overflow-x': 'hidden',
        userSelect: 'none',
      }"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated"
      ref="editor"
      @keydown.enter.native.prevent="screen"
      @onBlur="onBlur"
    />
  </div>
  <!-- @keydown.shift.enter.native.prevent="screen()" -->
</template>

<script>
// import Vue from "vue";
import axios from "axios";
import { getToken } from "@/util/auth";
import { uploadImg } from "@/api/operate/article";
import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar, Boot } from "@wangeditor/editor-for-vue";
// import { getSDK, CbEvents } from "@/util/lib";
import useCreateFileMessage from "../fileMessage";
import { onSendMessage } from "../openImFun";
import {
  IMSDK,
  getPicInfo,
  MessageType,
  getMediaDuration,
  getVideoSnshot,
} from "../../../util/imCommon";
import { CbEvents } from "@/util/lib/constant";

// 参考博客：https://blog.csdn.net/m0_57442975/article/details/134261247
// 文档：https://www.wangeditor.com/
const { createFileMessage } = useCreateFileMessage();
// Boot.registerModule(ctrlEnterModule);

export default {
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: "<p></p>",
      text: null,
      currentValue: "",
      // 工具栏配置（注意结构，否则不起作用）
      toolbarConfig: {
        // 工具栏
        toolbarKeys: [
          "emotion",
          //   "insertLink",
          {
            key: "group-image",
            title: "图片",
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
            menuKeys: ["uploadImage"],
          },
        ],
        // 排除的工具栏
        excludeKeys: ["group-more-style", "group-video"],
      },

      // 菜单配置（注意结构，否则不起作用）
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            // 自定义上传图片 方法
            customUpload: this.uploadImg,
            // 上传接口设置文件名
            // fieldName: "file",
            base64LimitSize: 1, // 1k 以下插入 base64
            allowedFileTypes: ["image/*"],
            meta: {
              token: getToken(),
            },
          },
          // uploadVideo: {
          //   customUpload: this.uploadVideo,
          //   fieldName: "file",
          //   meta: {
          //     token: getToken(),
          //   },
          // },
        },
      },
      mode: "simple", // or 'simple'
      // 图片、视频上传服务器地址
      // uploadFileUrl: process.env.VUE_APP_BASE_API,
    };
  },
  props: {
    /* 编辑器的内容 */
    value: {
      type: String,
      default: "",
    },
    /* 高度 */
    height: {
      type: Number,
      default: 108,
    },
    // width: {
    //   type: Number,
    //   default: 500,
    // },
    minWidth: {
      type: Number,
      default: 0,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: 0,
    },
    /* 只读 */
    // readOnly: {
    //   type: Boolean,
    //   default: false,
    // },
    // 上传文件大小限制(MB)
    // fileSize: {
    //   type: Number,
    //   default: 5,
    // },
    /* 类型（base64格式、url格式） */
    // type: {
    //   type: String,
    //   default: "url",
    // },
  },
  watch: {
    // 监听父组件中editor值的变化
    value: {
      handler(val) {
        this.html = val;
        this.currentValue = val;
      },
      immediate: true,
    },
  },
  created() {
    // console.log(Boot, "boot");
  },
  mounted() {
    // this.$nextTick(() => {
    //   console.log("123");
    // });
    // this.initEditor();

    this.$nextTick(() => {
      // editor.txt.focus();
      // const editor = this.$refs.editor;
      // console.log(editor.txt, "txt");

      // 设置输入框一直聚焦
      // editor.txt.focus();

      // 其他操作...

      // 将编辑器实例挂载到 Vue 实例上
      const editorElement = this.$refs.editor.$el;
      const parentElement = editorElement.parentElement;

      // 计算父盒子的宽度并设置编辑器的最大宽度
      const parentWidth = parentElement.offsetWidth;
      const maxWidth = parentWidth - 50; // 父盒子宽度减去50px
      editorElement.style.maxWidth = `${maxWidth}px`;
    });
  },
  methods: {
    onCreated(editor) {
      // 一定要用 Object.seal() ，否则会报错
      this.editor = Object.seal(editor);
      console.log(this.editor, "editor");
      // this.editor.focus();

      this.editor.on("blur", this.focusInput);

      // this.editor.txt.focus();
      // console.log(this.editor.txt, "txt");

      const { insertBreak } = this.editor;

      console.log(this.editor, "editor");

      // this.editor.insertBreak = () => {
      //   if (window.Event.inputType == "insertParagraph") {
      //     console.log("enter");
      //   } else {
      //     insertBreak();
      //     console.log("222shift");
      //   }
      // };

      // Boot.registerModule(ctrlEnterModule);
      // 所工具栏配置项
      // console.log(editor.getAllMenuKeys());
    },
    onBlur() {
      // 表单冲突
      // const editor = this.editor;
      // editor.focus();
      // console.log("失焦");
    },
    onChange(editor) {
      // this.$emit("change", this.html);
      // this.value=this.html
      // console.log(editor.getText());
      // console.log(this.text, "1");
      this.text = editor.getText();
      // this.$emit("input", this.html);
    },
    //自定义上传视频

    //自定义上传图片
    uploadImg(file, insertFn) {
      console.log("1", file);
      this.getFile(file);
      // let imgData = new FormData();
      // imgData.append("file", file);
      // uploadImg(imgData).then((res) => {
      //   insertFn(res.data.data.url);
      //   this.$message({
      //     type: "success",
      //     message: "上传成功",
      //   });
      // });
    },
    focusInput() {
      console.log("失去焦点");
    },

    async getFile(uploadData) {
      let messageType = MessageType.FileMessage;
      if (uploadData.type.includes("image")) {
        messageType = MessageType.PictureMessage;
      }
      if (uploadData.type.includes("video")) {
        messageType = MessageType.VideoMessage;
      }
      const { error, message, buffer, snapBuffer } = await createFileMessage(
        uploadData,
        messageType
      );
      if (error || !message) {
        // showToast({ error, message: error });
        return;
      }
      // const data = await onSendMessage({ message });
      this.$emit("sendPic", { message });
      // console.log(data, "picData");
      // 触发父组件方法
    },
    screen(e) {
      // const { insertBreak } = this.editor;
      const newEditor = this.editor;
      if (e.shiftKey) {
        // 换行
        // this.editor.insertBreak();
        console.log(newEditor, "editor");
        newEditor.insertBreak();
        // console.log(e, "sswmc");
      } else {
        console.log(this.html);
        console.log("123", this.text);
        this.$emit("screen", this.text);
      }
    },
    // handleKeyDown(event) {
    //   if (event.key === "Enter" && event.shiftKey) {
    //     // const editor = this.$refs.editor;
    //     const editor = this.editor;

    //     // 阻止默认行为（插入换行符）
    //     event.preventDefault();

    //     // this.html += "<p><br></p>";
    //     // this.$set(this, "html", this.html + "<p><br></p>");
    //     editor.cmd.do("insertHTML", "<p><br></p>");
    //     // editor.cmd.command(null, "insertHTML", "<p><br></p>");
    //   } else if (event.key === "Enter") {
    //     // 阻止默认行为（发送消息）
    //     event.preventDefault();
    //     this.screen(); // 请替换为实际的发送消息逻辑
    //   }
    // },

    cleanEditor() {
      // this.text = undefined;
      // this.html = "<p></p>";
      this.editor.clear();
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
/* 默认字号 */

.w-e-text-container {
  font-size: 14px !important;
  width: 100%;
}
.w-e-scroll {
  width: calc(100% - 34px);
}

/* .w-e-text-container {
  height: 300px !important;
} */
</style>

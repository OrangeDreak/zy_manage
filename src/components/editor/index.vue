<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{ height: height + 'px', 'overflow-y': 'hidden' }"
      v-model="html"
      :defaultConfig="editorConfig"
      :defaultContent="defaultContent"
      :mode="mode"
      @onChange="onChange"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
// import Vue from "vue";
import axios from "axios";
import { uploadImg } from "@/api/article";
import { DomEditor } from "@wangeditor/editor";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// 参考博客：https://blog.csdn.net/m0_57442975/article/details/134261247
// 文档：https://www.wangeditor.com/
export default {
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: "",
      // 工具栏配置（注意结构，否则不起作用）
      toolbarConfig: {
        // 工具栏
        toolbarKeys: [
          "headerSelect",
          "blockquote",
          "|",
          "bold",
          "underline",
          "italic",
          "through",
          "code",
          "sup",
          "sub",
          "clearStyle",
          "color",
          "bgColor",
          "|",
          "fontSize",
          "fontFamily",
          "lineHeight",
          "|",
          "bulletedList",
          "numberedList",
          "todo",
          {
            key: "group-justify",
            title: "对齐",
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
            menuKeys: ["justifyLeft", "justifyRight", "justifyCenter", "justifyJustify"],
          },
          {
            key: "group-indent",
            title: "缩进",
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
            menuKeys: ["indent", "delIndent"],
          },
          "|",
          "emotion",
          "insertLink",
          {
            key: "group-image",
            title: "图片",
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
            menuKeys: ["insertImage", "uploadImage"],
          },
          {
            key: "group-video",
            title: "视频",
            iconSvg:
              '<svg viewBox="0 0 1024 1024"><path d="M981.184 160.096C837.568 139.456 678.848 128 512 128S186.432 139.456 42.816 160.096C15.296 267.808 0 386.848 0 512s15.264 244.16 42.816 351.904C186.464 884.544 345.152 896 512 896s325.568-11.456 469.184-32.096C1008.704 756.192 1024 637.152 1024 512s-15.264-244.16-42.816-351.904zM384 704V320l320 192-320 192z"></path></svg>',
            menuKeys: ["insertVideo", "uploadVideo"],
          },
          "insertTable",
          "codeBlock",
          "divider",
          "|",
          "undo",
          "redo",
          "|",
          // "fullScreen",
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
          },
          fontFamily: {
            fontFamilyList: [
              {
                name: "平方",
                value: "PingFang SC",
              },
              "黑体",
              {
                name: "仿宋",
                value: "仿宋",
              },
              "楷体",
              "标楷体",
              "华文仿宋",
              "华文楷体",
              {
                name: "宋体",
                value: "宋体",
              },
              "微软雅黑",
              "Arial",
              "Tahoma",
              "Verdana",
              "Times New Roman",
              "Courier New",
            ],
          },
          // uploadVideo: {
          //   customUpload: this.uploadVideo,
          //   fieldName: "file",
          // },
        },
      },
      defaultContent: [
        {
          type: "paragraph",
          children: [{ text: "" }], // 初始化文本
          // fontSize: "38px",
          fontFamily: "PingFang SC", // 初始化字体（默认字体就是该设置的字体）
          // lineHeight: 1.5,
        },
      ],
      mode: "default", // or 'simple'
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
      default: 500,
    },
    /* 最小高度 */
    minHeight: {
      type: Number,
      default: null,
    },
    /* 只读 */
    readOnly: {
      type: Boolean,
      default: false,
    },
    // 上传文件大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    /* 类型（base64格式、url格式） */
    type: {
      type: String,
      default: "url",
    },
  },
  watch: {
    // 监听父组件中editor值的变化
    value: {
      handler(val) {
        this.html = val;
      },
      immediate: true,
    },
  },
  methods: {
    onCreated(editor) {
      // 一定要用 Object.seal() ，否则会报错
      this.editor = Object.seal(editor);
      // 所工具栏配置项
      // console.log(editor.getAllMenuKeys());
      // 所工具栏详细配置项
      // console.log(editor.getConfig());
    },
    onChange(editor) {
      // this.$emit("change", this.html);
      // this.value=this.html
      this.$emit("input", this.html);
    },
    //自定义上传视频
    uploadVideo(file, insertFn) {
      let imgData = new FormData();
      imgData.append("file", file);
      axios({
        url: "https://qcelf.com/tp/admin/resource/oss/upload",
        // data: imgData,
        timeout: 60 * 1000,
        method: "post",
      }).then((response) => {
        if (response.code === 200) {
          // 插入后端返回的url，将图片显示在页面上
          insertFn(response.data.url);
          this.$message({
            type: "success",
            message: "上传成功",
          });
        }
      });
    },
    //自定义上传图片
    uploadImg(file, insertFn) {
      let imgData = new FormData();
      imgData.append("file", file);
      uploadImg(imgData).then((res) => {
        insertFn(res.data.url);
        this.$message({
          type: "success",
          message: "上传成功",
        });
      });
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    // setTimeout(() => {
    //   if (this.value) {
    //     this.html = this.value;
    //   }
    //   // 查看菜单默认配置项
    //   // console.log(this.editor.getConfig());
    //   // const toolbar = DomEditor.getToolbar(this.editor);
    //   // const curToolbarConfig = toolbar.getConfig();
    //   // console.log(curToolbarConfig.toolbarKeys); // 当前菜单排序和分组
    // }, 1500);
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
}
</style>

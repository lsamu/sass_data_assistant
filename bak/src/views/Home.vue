<template>
  <div class="box-tab">
    <div class="box-tab_toolbar">
      <el-row>
        <el-col :span="4">
          <div class="source">
            <i class="el-icon-edit">后退</i>
            <i class="el-icon-share">刷新</i>
            <i class="el-icon-delete">前进</i>
          </div>
        </el-col>
        <el-col :span="18">
          <el-input v-model="input" placeholder="请输入网页地址..."></el-input>
        </el-col>
        <el-col :span="2">
          <el-button @click="handleGO">转到</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="box-tab__webview">
      <webview
        ref="ww"
        id="foo"
        src="http://www.baidu.com/"
        style="display: inline-flex; width: 100%; height: 600px"
      ></webview>
      <!-- <iframe src="http://www.baidu.com/" frameborder="0"  style="display: inline-flex; width: 100%; height: 600px"></iframe> -->
    </div>
    <div class="box-tab__editor">
      代码<el-button @click="handleRun">运行</el-button>
      <el-button @click="handleRunTest">测试</el-button>
      <!-- <Monaco
        height="600"
        language="typescript"
        :code="code"
        :options="options"
        :highlighted="highlightLines"
        :changeThrottle="500"
        theme="vs"
        @mounted="onMounted2"
      ></Monaco> -->
      <el-input type="textarea" style="height: 200px" v-model="content">
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MonacoEditor from "vue-monaco-editor";
import { WebviewTag, ipcRenderer } from "electron";

@Component({
  components: {
    // Monaco: MonacoEditor,
  },
})
export default class Home extends Vue {
  public code = "// type your code \n";

  public highlightLines = [
    {
      number: 0,
      class: "primary-highlighted-line",
    },
    {
      number: 0,
      class: "secondary-highlighted-line",
    },
  ];

  public options = {
    selectOnLineNumbers: false,
  };

  public input: string = "";
  public content: string = "";

  public editor: any;
  public editor2: any;

  public ww: WebviewTag;

  mounted() {
    this.ww = this.$refs["ww"] as any;
  }



  public handleSelect() {}

  onMounted2(editor: any) {
    console.log("after mount!", editor, editor.getValue(), editor.getModel());
    this.editor2 = editor;
  }

  onCodeChange(editor: any) {
    console.log("code changed!", "code:" + this.editor.getValue());
  }

  handleGO() {
    console.log(this.input);
    if(this.input==""){
      return
    }
    this.ww.loadURL(this.input);
  }

  handleRun() {
    //发送 puppeteer代码运行
    // console.log(window);
    // (window as any).ipcRenderer.send('spider');
    //console.log(ipcRenderer);
    this.$nextTick(() => {
      ipcRenderer.send("spider");
    });
  }

  handleRunTest() {
      //console.log(this.ww);
      ipcRenderer.send("spider_test");
  }
}
</script>
<style lang="scss">
.box-tab {
  &___webview {
    webview {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    webview.visible {
      visibility: visible;
    }
  }
}

.secondary-highlighted-line {
  background: green;
}
.primary-highlighted-line {
  background: blue;
}
.source {
  line-height: 40px;
  height: 40px;
  > i {
    color: #606266;
    font-size: 1.5em;
    vertical-align: middle;
  }
}
</style>

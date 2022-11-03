<template>
  <div class="about">
    <Monaco
      height="600"
      language="typescript"
      :code="code"
      :options="options"
      :highlighted="highlightLines"
      :changeThrottle="500"
      theme="vs"
    ></Monaco>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MonacoEditor from "vue-monaco-editor";

@Component({
  components: {
    Monaco: MonacoEditor,
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
}
</script>

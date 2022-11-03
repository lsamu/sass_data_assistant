<template>
    <div class="box-code">
        <Codemirror v-model:value="thatOption.formData" :options="cmOptions" :height="thatOption.option.height" border
            @input="handleInput" 
            :class="{'code-not':props.disabled}" 
            :placeholder="thatOption.option.placeholder" 
            >
        </Codemirror>
    </div>
</template>
<script setup>
import { onMounted, reactive, toRefs, ref, nextTick, toRaw, watchEffect } from 'vue'
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/theme/dracula.css";
import "codemirror/theme/idea.css";
import lodash from "lodash"

const props = defineProps(["option", "data", "value", "disabled"])
const emits = defineEmits(["update:value"])

const defaultOption = {
    height: 150,
    mode: "text/javascript",
    placeholder: ""
}
/**
 * 编辑器配置
 */
const cmOptions = reactive({
    mode: "text/javascript", // Language mode
    //mode: "sql", // Language mode
    theme: "default", // Theme
    lineNumbers: true, // Show line number
    smartIndent: true, // Smart indent
    indentUnit: 2, // The smart indent unit is 2 spaces in length
    foldGutter: true, // Code folding
    styleActiveLine: true, // Display the style of the selected row
})

/**
 * 配置
 */
const thatOption = reactive({
    formData: null,
    option: null
})

watchEffect(() => {
    thatOption.formData = props.value || ""
    thatOption.option = lodash.merge(defaultOption, props.option)
    cmOptions.mode = thatOption.option.mode;
})

const handleInput = function (val) {
    emits("update:value", val)
}

</script>
<style lang="scss">
.box-code {
    line-height: 14px !important;

    .code-not {
        pointer-events: none;

        * {
            background-color: #f5f7fa;
        }
    }
}
</style>
<template>
    {{thatOption.formData}}
    <BoxCode v-model:value="thatOption.formData" @input="handleInput"></BoxCode>

    <el-button @click="handleSet">设置</el-button>
</template>
<script setup>
import { onMounted, ref, watch, reactive } from "vue"
import BoxCode from "../../components/code/index.vue"

const thatOption = reactive({
    formData: "function(){}"
})

const handleSet = function () {
    console.log(thatOption.formData)
}

const handleInput = function (val) {
    console.log(val)
}
</script>
<style lang="scss">

</style>
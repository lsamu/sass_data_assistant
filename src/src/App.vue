<template>
  <router-view></router-view>
</template>
<script>
/**
* Created by zhanghongwei on 2022-9-13.
* 软件：装备试验数据标准技术体制符合性检查原型系统
* 版本号：V1.0
* 说明：页面入口
*/
import { defineComponent, reactive, toRefs } from 'vue'

/**
 * 定义路由
 */
export default defineComponent({
  setup() {

  },
})
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
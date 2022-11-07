<template>
    <el-container>
        <el-header>
            <div style="background:#545c64">
                <el-row>
                    <el-col :span="20">
                        <div class="title">
                            <el-icon>
                                <Promotion />
                            </el-icon> 我是标题
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="menu">
                            <span @click="handleCommand('service')">
                                <el-icon>
                                    <Service />
                                </el-icon>
                            </span>
                            <span @click="handleCommand('login')">
                                <el-icon>
                                    <User />
                                </el-icon>
                            </span>
                            <span>

                                <el-popover placement="bottom" :width="60" trigger="click">
                                    <template #reference>
                                        <el-icon>
                                            <Menu />
                                        </el-icon>
                                    </template>
                                    <div>
                                        <ul>
                                            <li @click="handleCommand('setting')">设置</li>
                                            <li @click="handleCommand('about')">关于</li>
                                            <li @click="handleCommand('exit')">退出</li>
                                        </ul>
                                    </div>
                                </el-popover>
                            </span>
                            <span @click="handleCommand('mini')">
                                <el-icon>
                                    <Minus />
                                </el-icon>
                            </span>
                            <span @click="handleCommand('exit')">
                                <el-icon :size="20">
                                    <Close />
                                </el-icon>
                            </span>
                        </div>

                    </el-col>
                    <el-col :span="16">
                        <el-menu :default-active="thatOption.activeIndex" mode="horizontal" background-color="#545c64"
                            text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" router>
                            <el-menu-item index="speed">
                                <template #title>
                                    <el-icon>
                                        <Position />
                                    </el-icon>
                                    <span>我的加速</span>
                                </template>
                            </el-menu-item>
                            <el-menu-item index="game">
                                <el-icon>
                                    <Position />
                                </el-icon>
                                游戏库
                            </el-menu-item>
                            <el-menu-item index="recharge">
                                <el-icon>
                                    <Position />
                                </el-icon>
                                充值中心
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :span="8">
                        <span>
                            <el-avatar :size="40"
                                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                                @click="handlUserInfo" />
                        </span>
                        <span>136****2222 <el-button type="primary" @click="handleSpeedStatus">{{thatOption.puaseText}}</el-button></span>
                        <span>有效期: </span>
                        <span>剩余时间:</span>
                        
                    </el-col>
                </el-row>
            </div>
        </el-header>
        <!-- <router-view></router-view> -->
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" />
            </keep-alive>
        </router-view>
        <!-- <el-footer>Footer</el-footer> -->
    </el-container>
    <UserInfo :option="userInfoOption"></UserInfo>
    <UserLogin :option="userLoginOption"></UserLogin>
    <UserService :option="userServiceOption"></UserService>
    <SystemSetting :option="systemSettingOption"></SystemSetting>
    <SystemAbout :option="systemAboutOption"></SystemAbout>
</template>
<script lang="ts" setup>
import UserInfo from "@/views/user/info/index.vue"
import UserLogin from "@/views/user/login/index.vue"
import UserService from "@/views/user/service/index.vue"
import SystemSetting from "@/views/system/setting.vue"
import SystemAbout from "@/views/system/about.vue"

import ipc from "@/ipc/app"
import { ElMessage, ElMessageBox, ElNotification } from "element-plus"

const thatOption = reactive({
    activeIndex: "speed",
    puaseText: "暂停"
})

const handleSelect = () => {

}

const handleCommand = (cmd: String) => {
    switch (cmd) {
        case "service":
            userServiceOption.dialog.visible = true;
            break;
        case "login":
            userLoginOption.dialog.visible = true;
            break;
        case "about":
            systemAboutOption.dialog.visible = true;
            break;
        case "setting":
            systemSettingOption.dialog.visible = true;
            break;
        case "mini":
            ipc.mini()
            break;
        case "exit":
            ipc.quit();
            break;
    }
}

const userInfoOption = reactive({
    dialog: {
        visible: false
    }
})

const handlUserInfo = () => {
    userInfoOption.dialog.visible = true;
}

const handleSpeedStatus = () => {
    thatOption.puaseText = thatOption.puaseText == "暂停" ? "恢复" : "暂停"
}

const userLoginOption = reactive({
    dialog: {
        visible: false
    }
})
const userServiceOption = reactive({
    dialog: {
        visible: false
    }
})
const systemSettingOption = reactive({
    dialog: {
        visible: false
    }
})
const systemAboutOption = reactive({
    dialog: {
        visible: false
    }
})
</script>
<style lang="scss">
.el-header {
    // --el-header-padding: 0 0;
    // --el-header-height: 0px;
}

.el-header {
    padding: 0 !important;
    --el-header-height: none;
}

.title {
    -webkit-user-select: none;
    -webkit-app-region: drag;
    padding: 5px;
}

.menu {
    float: right;
    padding: 5px;

    span {
        padding: 5px;
    }
}
</style>
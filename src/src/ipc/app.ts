import {ipcRenderer} from "electron"

export default {
    mini:()=>{
        ipcRenderer.send("mini")
    },
    quit:()=>{
        ipcRenderer.send("quit")
    }
}
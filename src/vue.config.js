const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
    },
  },
  configureWebpack() {
    return {
      resolve: {
        fallback: {
          path: require.resolve("path-browserify"),
          fs: false
        },
      },
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "appId": "com.tdscc.app",//包名
        "productName": "tdscc",//产品名称
        "copyright": "copyright 2022",//版权
        // "win":{
        //   "icon":"./public/icon.ico" //图标
        // }
        // "asar":false,
        // 资源拷贝
        extraResources: [
          {
            from: "src/browser/config/databaseConfig.xml", to: "browser/config/databaseConfig.xml"
          },
          {
            from: "src/browser/template/试验报告模板.docx", to: "../template/试验报告模板.docx"
          },
          {
            from: "src/browser/template/试验报告模板.docx", to: "../reportfile/试验报告模板.docx"
          },
        ]
      },
    }
  }
})

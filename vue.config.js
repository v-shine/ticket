

const url = 'https://bull-ty.chengxsports.com/api/admin/sys/'; // 测试环境
                  
module.exports = {
  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
    entry
      .add('classlist-polyfill')
      .end()
    config
      .plugin('html')
      .tap(args => {
        args[0].title= '出票后台'
        return args
      })
  },
  devServer: {
    port: '7001',
    open: true,
    host: '0.0.0.0',
    proxy: {
      '/': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
}
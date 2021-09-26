import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入axios
import '@/utils/request.js'
// 导入全局样式
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// 全局引入 带树的表格
import TreeTable from 'vue-table-with-tree-grid'
// 注册 带树的表格
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

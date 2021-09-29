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
// 全局引入 moment
import Moment from 'moment'
// 导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
// 导入vue-quill-editor的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 全局注册富文本组件
Vue.use(VueQuillEditor)
// 注册 带树的表格
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false
// 注册全局时间格式化过滤器
Vue.filter('dateFormate', time => {
  return Moment(time).format('YYYY-MM-DD')
})

// 注册全局自定义指令
Vue.directive('el-focus', {
  inserted (dom) {
    dom.children[0].focus()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

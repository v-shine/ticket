import Vue from 'vue'
import App from './App.vue'
import router from './router/router'

import ElementUI from 'element-ui';
import './assets/style/element-variables.scss'
import './assets/style/common.scss'

Vue.config.productionTip = false
Vue.use(ElementUI)

import httpApi from './https/api'
Vue.prototype.$api = httpApi;


router.beforeEach((to, from, next) => {
  if(to.matched[0].meta.needLogin){
    let userInfo = sessionStorage.getItem('userInfo');
    if(userInfo){
      if(to.matched[1].meta.isAdmin){
        let userInfoJSon = JSON.parse(userInfo);
        if(userInfoJSon.userType.value == 'ADMIN'){
          next();
        }else{
          next({
            path: '/loginPage'
          })
        }
      }else{
        next();
      }
    }else{
      next({
        path: '/loginPage'
      })
    }
  }else{
    next();
  }
  
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

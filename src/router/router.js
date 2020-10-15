import Vue from "vue";
import Router from "vue-router";

import { filePath } from '@/utils'

Vue.use(Router);

/**
 * needLogin: 登录权限
 * isAdmin: 管理员权限
 */
const RouterModel = new Router({
  routes: [
    {
      path: '',
      redirect: '/loginPage'
    },
    {
        path: '/loginPage',
        name: 'loginPage',
        component: filePath('login')
    },
    {
      path: '/webPage',
      name: 'webPage',
      component: filePath('web'),
      meta: {
        needLogin: true,
      },
      redirect: '/webPage/homePage',
      children: [
        {
          path: '/webPage/homePage',
          name: 'homePage',
          component: filePath('web/home')
        },
        {
          path: '/webPage/ticketsPage',
          name: 'ticketsPage',
          component: filePath('web/tickets')
        },
        {
          path: '/webPage/memberPage',
          name: 'memberPage',
          component: filePath('web/member'),
          meta: {
            isAdmin: true
          }
        },
        {
          path: '/webPage/storePage',
          name: 'storePage',
          component: filePath('web/store'),
          redirect: '/webPage/storePage/homePage',
          meta: {
            isAdmin: true
          },
          children: [
            {
              path: '/webPage/storePage/homePage',
              name: 'storePageHome',
              component: filePath('web/store/home'),
            }
          ]
        },
      ]
  },
  ]
});
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}




export default RouterModel
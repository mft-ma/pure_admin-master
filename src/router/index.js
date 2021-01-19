import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'

Vue.use(Router)
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in sub-menu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
    affix: true                  if true, the tag will affix in the tags-view
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/commodity/index'),
        name: 'Commodity',
        meta: { title: '商品管理', icon: 'eye', noCache: true }
      }
    ]
  },
  {
    path: '/invoice',
    component: Layout,
    redirect: '/invoice/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/invoice/index'),
        name: 'Invoice',
        meta: { title: '发票管理', icon: 'star', noCache: true }
      }
    ]
  },
  {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/inventory/index'),
        name: 'Inventory',
        meta: { title: '库存管理', icon: 'lock', noCache: true }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/supplier/index'),
        name: 'Supplier',
        meta: { title: '供应商管理', icon: 'people', noCache: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'Order',
        meta: { title: '订单管理', icon: 'chart', noCache: true }
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/purchase/index'),
        name: 'Purchase',
        meta: { title: '采购管理', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: '业务员管理', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/sales',
    component: Layout,
    redirect: '/sales/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/sales/index'),
        name: 'Sales',
        meta: { title: '退货管理', icon: 'link', noCache: true }
      }
    ]
  }
]
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [{
  path: '/error',
  component: Layout,
  redirect: 'noredirect',
  name: 'ErrorPages',
  meta: {
    title: 'errorPages',
    icon: '404'
  },
  children: [
    {
      path: '401',
      component: () => import('@/views/errorPage/401'),
      name: 'Page401',
      meta: { title: 'page401', noCache: true }
    },
    {
      path: '404',
      component: () => import('@/views/errorPage/404'),
      name: 'Page404',
      meta: { title: 'page404', noCache: true }
    },
  ]
},
{
  path: '/permission',
  component: Layout,
  redirect: '/permission/index',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'permission',
    icon: 'lock',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'page',
      component: () => import('@/views/permission/page'),
      name: 'PagePermission',
      meta: {
        title: 'pagePermission',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    },
    {
      path: 'directive',
      component: () => import('@/views/permission/directive'),
      name: 'DirectivePermission',
      meta: {
        title: 'directivePermission'
        // if do not set roles, means: this page does not require permission
      }
    }
  ]
},
{ path: '*', redirect: '/404', hidden: true }
]

import Vue from 'vue'
import Router from 'vue-router'
import Content from '../components/content/Content.vue'
import Rating from '../components/rating/Rating.vue'
import Seller from '../components/seller/Seller.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    redirect: '/Content'
  }, {
    path: '/Content',
    name: 'Content',
    component: Content
  }, {
    path: '/Rating',
    name: 'Rating',
    component: Rating
  }, {
    path: '/Seller',
    name: 'Seller',
    component: Seller
  }]
})

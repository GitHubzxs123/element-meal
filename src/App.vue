<template>
  <div id="app">
    <v-header></v-header>
    <div class="tab">
      <router-link tag="div" to="/Content" class="tab-item">商品</router-link>
      <router-link tag="div" to="/Rating" class="tab-item">评价</router-link>
      <router-link tag="div" to="/Seller" class="tab-item">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './components/header/Header.vue'
export default {
  name: 'App',
  components: {
    'v-header': Header
  },
  data () {
    return {
      seller: {}
    }
  },
  mounted () {
    this.axios.get('../static/data.json').then(response => {
      this.seller = response.data.seller
    }, function (err) {
      console.log(err)
    })
  }
}
</script>

<style lang="stylus">
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-bottom: 1px solid #d9dde1
    .tab-item
      flex: 1
      text-align: center
    .active
      color: red
</style>

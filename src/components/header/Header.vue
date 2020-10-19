<template>
  <div class="wrapper">
    <div class="top">
      <div class="img">
        <img class="storeImg" :src= this.seller.avatar alt="">
      </div>
      <div class="text">
        <div class="item1">
          <span class="brand">品牌</span>
          <span class="title">{{ this.seller.name }}</span>
        </div>
        <div class="item2">{{ this.seller.description }}/{{ this.seller.deliveryTime }}分钟送达</div>
        <div class="item3">
          <img class="subImg" src="./decrease.png" alt="">
          <span class="sub">{{ this.online.description }}</span>
        </div>
      </div>
      <div class="info" @click="handleDatailShow">5个<span class="iconfont arrowRight">&#xe60d;</span></div>
    </div>
    <div class="bottom" @click="handleDatailShow">
      公告：{{ this.seller.bulletin }}
    </div>
    <div class="bgImg"></div>
    <div class="detail" v-show="detailShow" transition="fade">
      <div class="title">粥品香坊（大运村）</div>
      <div class="score">
        <star :size="48" :score="seller.score"></star>
      </div>
      <div class="cheap">
        <div class="line"></div>
        <span class="text">优惠信息</span>
        <div class="line"></div>
      </div>
      <div class="pubInfo">
        <div class="item">
          <div class="photo"><img src="./decrease.png" alt=""></div>
          <span class="words">在线支付满25减8，满50减10</span>
        </div>
        <div class="item">
          <div class="photo"><img src="./discount.png" alt=""></div>
          <span class="words">单人精彩赛</span>
        </div>
        <div class="item">
          <div class="photo"><img src="./discount.png" alt=""></div>
          <span class="words">清肺雪梨汤8折抢购</span>
        </div>
        <div class="item">
          <div class="photo"><img src="./special.png" alt=""></div>
          <span class="words">特价饮品八折抢购</span>
        </div>
        <div class="item">
          <div class="photo"><img src="./special.png" alt=""></div>
          <span class="words">单人特色套餐</span>
        </div>
      </div>
      <div class="cheap">
        <div class="line"></div>
        <span class="text">商家公告</span>
        <div class="line"></div>
      </div>
      <p class="introduce">{{ this.seller.bulletin }}</p>
      <span class="iconfont close" @click="handleDetailClose">&#xe610;</span>
    </div>
  </div>
</template>

<script>
import Star from './components/star.vue'
export default {
  name: 'Header',
  components: {
    star: Star
  },
  data () {
    return {
      detailShow: false,
      seller: {},
      online: []
    }
  },
  methods: {
    handleDatailShow () {
      this.detailShow = true
    },
    handleDetailClose () {
      this.detailShow = false
    },
    getInfo () {
      this.axios.get('../../../static/data.json')
        .then(response => {
          // console.log(response)
          this.seller = response.data.seller
          this.online = response.data.seller.supports[0]
          // console.log(this.seller)
        }, function (err) {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>

<style lang="stylus" scoped>
  .wrapper
    width: 100%
    height: 134px
    background-color: rgba(7, 17, 27, .5)
    position: relative
    .top
      width: 100%
      height: 103px
      position: relative
      .img
        display: inline-block
        width: 64px
        height: 64px
        margin: 24px 16px 18px 24px
        vertical-align: top
        .storeImg
          width: 100%
          height: 100%
          border-radius: 4px
          vertical-align: bottom
      .text
        display: inline-block
        width: 200px
        height: 64px
        margin-top: 27px
        .item1
          .brand
            display: inline-block
            width: 26px
            height: 12px
            padding: 3px 2px 0 2px
            background: red
            color: #fff
            font-size: 13px
            font-weight: bold
          .title
            display: inline-block
            font-size: 16px
            color: rgb(255, 255, 255)
            line-height: 18px
            font-weight: bold
        .item2
          font-size: 12px
          line-height: 12px
          font-weight: 200
          color: rgb(255, 255, 255)
          margin: 8px 0 4px 0
        .item3
          .subImg
            width: 14px
            height: 14px
            border-radius: 3px
            vertical-align: middle
          .sub
            font-size: 11px
            line-height: 12px
            color: rgb(255, 255, 255)
            font-weight: 200
      .info
        position: absolute
        right: 10px
        bottom: 15px
        width: 40px
        height: 15px
        line-height: 16px
        color: #fff
        font-size: 12px
        text-align: center
        background: rgba(0, 0, 0, .2)
        border-radius: 16px
        padding: 5px 0 5px 5px
        margin-right: 2px
        .arrowRight
          font-size: 8px
          font-weight: 700
          margin-left: 3px
    .bottom
      height: 15px
      font-size: 12px
      color: rgb(255, 255, 255)
      background: rgba(7, 17, 27, .2)
      padding: 9px 9px 7px 9px
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
    .bgImg
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 134px
      z-index: -1
      background-image: url(http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg)
      background-repeat: no-repeat
      background-position: 50% 50%
      background-size: cover
      filter: blur(7px)
    .detail
      width: 100%
      height: 100%
      z-index: 100
      position: fixed
      top: 0
      left: 0
      background: rgba(7, 17, 27, .8)
      opacity: 1
      backdrop-filter: blur(5px)
      &.fade-enter-active, &.fade-leave-active
        transition: all .5s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .title
        width: 100%
        line-height: 16px
        font-size: 16px
        font-weight: bold
        color: #fff
        margin-top: 34px
        text-align: center
      .score
        margin-top: 18px
        text-align: center
        font-size: 15px
      .cheap
        width: 100%
        height: 16px
        text-align: center
        margin-top: 28px
        .line
          display: inline-block
          width: 112px
          height: 2px
          margin-bottom: 4px
          background: rgba(255, 255, 255, .5)
        .text
          margin: 0 12px
          font-size: 16px
          color: #fff
      .pubInfo
        margin: 24px 0 0 50px
        box-sizing: border-box
        .item
          margin-bottom: 15px
          .photo
            display: inline-block
            width: 19px
            height: 19px
            margin-right: 3px
            vertical-align: top
            img
              width: 100%
              height: 100%
              border-radius: 3px
          .words
            font-size: 14px
            line-height: 14px
            font-weight: 200
            color: #fff
      .introduce
        color: #fff
        font-size: 14px
        line-height: 28px
        font-weight: 200
        padding: 0 45px
        margin-top: 24px
      .close
        display: inline-block
        width: 25px
        height: 25px
        margin: 20px 0 30px 175px
        color: #fff
</style>

<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="iconfont icon-shopping_cart" :class="{'highlight': totalCount>0}">&#xe6b8;</i>
            </div>
            <div class="number" v-show="totalCount">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice>0}">￥{{ totalPrice }}</div>
          <div class="desc">另需配送费{{ seller.deliveryPrice }}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">{{ payDesc }}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="listHeader">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="listContent" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{ food.name }}</span>
                <div class="price">
                  <span>￥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fold">
      <div class="mask" v-show="listShow" @click="maskClose"></div>
    </transition>
  </div>
</template>

<script>
import Cartcontrol from '../components/cartcontrol.vue'
import BScroll from 'better-scroll'

const BALL_LEN = 10
const innerClsHook = 'inner-hook'

function createBalls () {
  let balls = []
  for (let i = 0; i < BALL_LEN; i++) {
    balls.push({
      show: false
    })
  }
  return balls
}

export default {
  name: 'Shopcart',
  components: {
    cartcontrol: Cartcontrol
  },
  data () {
    return {
      fold: false,
      balls: createBalls()
    }
  },
  props: {
    seller: {},
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.listShow = false
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        food.count = 0
      })
      this.listShow = false
    },
    maskClose () {
      this.fold = false
    },
    pay () {
      if (this.totalPrice < this.seller.minPrice) {
        return
      }
      alert(`您一共消费${this.totalPrice}元,请问现金还是刷卡？`)
    },
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop (el) {
      const ball = this.dropBalls[this.dropBalls.length - 1]
      const rect = ball.el.getBoundingClientRect()
      const x = rect.left - 32
      const y = -(window.innerHeight - rect.top - 22)
      el.style.display = ''
      el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`
    },
    dropping (el, done) {
      this._reflow = document.body.offsetHeight
      el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`
      el.addEventListener('transitionend', done)
    },
    afterDrop (el) {
      const ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  created () {
    this.dropBalls = []
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.seller.minPrice}起送`
      } else if (this.totalPrice < this.seller.minPrice) {
        let diff = this.seller.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass () {
      if (this.totalPrice < this.seller.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    listShow: {
      get () {
        if (!this.totalCount) {
          return false
        }
        return this.fold
      },
      set () {
        if (!this.totalCount) {
          this.fold = false
        }
        if (!this.fold) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../common/stylus/mixin.styl'
  .shopcart
    position: absolute
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 46px
    // overflow: hidden
    .content
      display: flex
      background: #141d27
      font-size: 0
      height: 46px
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            text-align: center
            border-radius: 50%
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size: 26px
              line-height: 46px
              color: #80858a
              &.highlight
                color: #fff
          .number
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 14px
            line-height: 18px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          padding-right: 12px
          line-height: 24px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, .1)
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255, 255, .4)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          color: rgba(255, 255, 255, .4)
          font-size: 12px
      .content-right
        flex: 0 0 105px
        width: 105px
        height: 46px
        .pay
          height: 46px
          line-height: 46px
          text-align: center
          font-size: 12px
          color: rgba(255, 255, 255, .4)
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position absolute
      left: 0
      bottom: 46px
      z-index: -1
      width: 100%
      &.fold-enter, &.fold-leave-active
        // transition: all .5s
        // transfrom: translate3d(0, -100%, 0)
        opacity: 0
      &.fold-enter-active, &.fold-leave-active
        // transfrom: translate3d(0, 0, 0)
        transition: all .3s ease-in-out
      .listHeader
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .listContent
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-weight: 700
            color: rgb(240, 20, 20)
            font-size: 14px
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .mask
    position: fixed
    top: 0
    left: 0
    z-index: 40
    width: 100%
    height: 100%
    backdrop-filter: blur(5px)
    background: rgba(7, 17, 27, .7)
    &.fold-enter, &.fold-leave-active
        // transition: all .5s
        // transfrom: translate3d(0, -100%, 0)
        opacity: 0
      &.fold-enter-active, &.fold-leave-active
        // transfrom: translate3d(0, 0, 0)
        transition: all .3s ease-in-out
</style>

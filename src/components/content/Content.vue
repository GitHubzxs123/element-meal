<template>
  <div>
    <div class="wrapper">
      <div class="menu-wrapper" ref="menuWrapper">
          <ul>
              <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current': currentIndex===index}" @click="selectItem(index, $event)">
                    <span class="menu-text">
                        <span v-show="item.type>0" class="menu-img" :class="classMap[item.type]"></span>
                        {{ item.name }}
                    </span>
              </li>
          </ul>
      </div>
      <div class="food-wrapper" ref="foodWrapper">
          <ul>
              <li v-for="item in goods" :key="item.foods.index" class="food-list-hook">
                  <div class="title">
                      <h2>{{ item.name }}</h2>
                  </div>
                  <ul>
                      <li @click="selectFood(food, $event)" v-for="(food, index) in item.foods" :key="index" class="food-item border-1px">
                              <div class="food-img">
                                  <img width="57" height="57" style="border-radius: 2px" :src=food.icon alt="" class="img">
                              </div>
                              <div class="content">
                                  <div class="food-name">{{ food.name }}</div>
                                  <div class="food-description">{{ food.description }}</div>
                                  <div class="proview" style="font-size: 12px;line-height: 10px; color: rgb(147, 153, 159)">
                                      <span class="proview-span" style="margin-right: 14px">月售{{ food.sellCount }}份</span>
                                      <span>好评率{{ food.rating }}%</span>
                                  </div>
                                  <div class="price">
                                      <span class="nowPrice">￥{{ food.price }}</span>
                                      <span class="oldPrice" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                                  </div>
                                  <div class="cartControl-wrapper">
                                    <cartcontrol @add="onAdd" :food="food"></cartcontrol>
                                  </div>
                              </div>
                      </li>
                  </ul>
              </li>
          </ul>
      </div>
    </div>
    <shopcart :selectFoods="selectFoods" :seller="seller" ref="shopCart"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import Shopcart from './components/shopcart.vue'
import Cartcontrol from './components/cartcontrol.vue'
import Food from './components/food.vue'

export default {
  name: 'Content',
  data () {
    return {
      goods: [],
      seller: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  components: {
    shopcart: Shopcart,
    cartcontrol: Cartcontrol,
    food: Food
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  mounted () {
    this.getGoods()
  },
  created () {
    this.classMap = ['decrease', 'special', 'discount']
  },
  methods: {
    getGoods () {
      this.axios.get('../../../static/data.json').then(response => {
        // console.log(response)
        this.goods = response.data.goods
        this.seller = response.data.seller
        this.$nextTick(() => {
          this.initBScroll()
          this.computedHeight()
        })
      })
    },
    onAdd (el) {
      this.$refs.shopCart.drop(el)
    },
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    initBScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodScroll = new BScroll(this.$refs.foodWrapper, {
        probeType: 3,
        click: true
      })
      this.foodScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    computedHeight () {
      let foodlist = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      // console.log(foodlist)
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodlist.length; i++) {
        let item = foodlist[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectItem (index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.foodScroll.scrollToElement(el, 300)
      // console.log(index)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl'
  .wrapper
    display: flex
    position: absolute
    top: 175px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 72px
      width: 72px
      overflow: hidden
      background: #f3f5f7
      .menu-item
        diaplay: table
        width: 56px
        height: 54px
        line-height: 14px
        padding: 0 8px
        &.current
          position: relative
          margin-top: -1px
          font-weight: bold
          background: #fff
          z-index: 10
        .menu-text
          display: table-cell
          width: 56px
          height: 50px
          vertical-align: middle
          font-size: 12px
          .menu-img
            display: inline-block
            vertical-align: top
            width: 14px
            height: 14px
            background-size: 17px 15px
            background-repeat: no-repeat
          .discount
            background-image: url(./discount.png)
          .special
            background-image: url(./special.png)
    .food-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 24px
        line-height: 26px
        border-left: 2px solid #d9dde1
        color: rgb(147, 153, 159)
        background: #f3f5f7
        font-size: 14px
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
          margin-bottom: 0
        .food-img
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .food-name
            margin: 2px 0 8px 0
            font-size: 14px
            line-height: 14px
            height: 14px
            color: rgb(7, 17, 27)
          .food-description
            line-height: 14px
            letter-spacing: .5px
            font-size: 12px
            color: rgb(147, 153, 159)
            margin-bottom: 8px
          .price
            font-weight: 700
            line-height: 24px
            .nowPrice
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .oldPrice
              font-size: 10px
              text-decoration: line-through
              color: rgb(147, 153, 159)
          .cartControl-wrapper
            position: absolute
            right: -5px
            bottom: 8px
</style>

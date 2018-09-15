<template>
  <div>
    这是商品列表页
    <span>{{$route.params.goodsId}}</span><br>
    <span>{{$route.params.name}}</span>
    <router-link to="/goods/title">显示商品标题</router-link>
    <router-link to="/goods/img">显示商品图片</router-link>
    <div>
      <router-view></router-view>
    </div>
    <router-link :to="{name:'cart',params:{cartId:123}}">跳转到购物车页面</router-link>
    <button @click="jump">button - 跳转到购物车页面</button>
    <counter></counter>
  </div>
</template>

<script>
  import counter from "../components/Counter"
  export default {
    name: "goods-list",
    methods: {
      jump() {
        this.$router.push({path: '/cart?goodsId=123'})
      }
    },
    components:{
      Counter
    }
  }
</script>

<style scoped>

</style>

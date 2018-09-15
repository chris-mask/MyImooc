// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
// import {sum,minus} from "./util";
// console.log(`sum:${sum(1,6)}`);

import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.use(infiniteScroll);
Vue.config.productionTip = false;

Vue.filter("currency",currency);


Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-balls.svg"
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

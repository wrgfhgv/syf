<template>
  <div>
    <!-- <First v-show="isFirst" @changeFlag='changeFlag'></First>
    <Second v-show="!isFirst" @changeFlag='changeFlag'></Second> -->
    <!-- <Third></Third> -->
    <!-- <Fourth></Fourth> -->
    <Fifth></Fifth>
  </div>
</template>

<script>
import First from './view/first'
import Second from './view/second'
import Third from './view/third'
import Fourth from './view/fourth'
import Fifth from './view/fifth'
export default {
  data() {
    return {
      isFirst: true
    }
  },
  components: {
    First,
    Second,
    Third,
    Fourth,
    Fifth
  },
  methods: {
    changeFlag() {
      this.isFirst = !this.isFirst
    }
  }
}
</script>

<style>
.button{
  position: absolute;
  top: 100px;
  left: 900px;
  z-index: 100;
}
</style>
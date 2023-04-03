<template>
  <div>
    <div class="welcome">
      <img :src="welcome" />
    </div>
    <div class="word">
      <p>欢迎访问</p>
      <p>百畜兴旺 · 运营平台</p>
    </div>
  </div>
</template>

<script>
import welcome from '@/assets/welcome.gif'

export default {
  name: 'welcome',
  data() {
    return {
      welcome
    }
  },
  created() {
    // window.location.reload()
  }
}
</script>

<style scoped>
.welcome {
  text-align: center;
  background: linear-gradient(-180deg, #eef2f5 0%, #d2dfe8 100%);
}
.word {
  text-align: center;
  color: #52c41a;
  font-size: 28px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%);
}
</style>

<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="24" class="center">
          <h1 style="font-size: 30px">{{ detail.title }}</h1>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <b>类别：</b><span>{{ detail.categoryId }}</span>
        </a-col>
        <a-col :span="12">
          <b>创建时间：</b><span>{{ detail.createdAt }}</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <b>描述：</b>
          <span>{{ detail.description }}</span>
        </a-col>
      </a-row>
      <br />
      <a-row>
        <a-col :span="24">
          <div v-html="detail.content"></div>
        </a-col>
      </a-row>
      <a-divider style="margin-bottom: 20px" />
      <a-button type="primary" @click="goBack">
        返回
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>
<script>
export default {
  name: 'BlogPreview',
  components: {},
  data() {
    return {
      detail: {}
    }
  },
  created() {
    this.detail = this.$route.params
  },
  methods: {
    init() {
      console.log('init')
    },
    goBack() {
      this.$router.push({
        name: 'blogNew',
        params: this.detail
      })
    }
  }
}
</script>

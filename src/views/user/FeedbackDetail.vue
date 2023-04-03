<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="用户ID">
          <router-link :to="{ name: 'userDetail', params: { id: detail.userId } }">{{ detail.userId }}</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="用户IP地址">{{ detail.ip }}</a-descriptions-item>
        <a-descriptions-item label="反馈标题">{{ detail.title }}</a-descriptions-item>

        <a-descriptions-item label="反馈描述">{{ detail.description }}</a-descriptions-item>
        <a-descriptions-item label="联系电话">{{ detail.contact }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="最后修改时间">{{ detail.updatedAt }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <div class="center">
        <a-button type="primary" @click="goBack">
          返回
        </a-button>
      </div>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getFeedbackDetail } from '@/api/user'

export default {
  name: 'FeedbackDetail',
  data() {
    return {
      detail: {},
      column: 1
    }
  },
  created() {
    getFeedbackDetail(this.$route.params.id).then(res => {
      this.detail = res.data.feedback
    })
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'feedbackList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

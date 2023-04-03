<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="用户ID" span="2">
          <router-link :to="{ name: 'userDetail', params: { id: detail.userId } }">{{ detail.userId }}</router-link>
        </a-descriptions-item>
        <a-descriptions-item label="用户名" span="2">{{ detail.user.nickname }}</a-descriptions-item>
        <a-descriptions-item label="用户电话" span="2">{{ detail.user.phone }}</a-descriptions-item>
        <a-descriptions-item label="关联的诊断ID" span="2">
          <a @click="handleAIDetail(detail.recognitionId)">{{ detail.recognitionId }}</a>
        </a-descriptions-item>
        <!-- <a-descriptions-item label="订单号" span="2">{{ detail.order_id }}</a-descriptions-item> -->
<!--        <a-descriptions-item label="识别图片" span="2">-->
<!--          <img :src="detail.recognition.imageUrl" style="width: 300px;cursor: pointer" @click="showBig" />-->
<!--        </a-descriptions-item>-->
        <a-descriptions-item label="专家诊断结果" span="2">
          <a-badge :status="detail.state | resultTypeFilter" :text="detail.state | resultFilter" />
        </a-descriptions-item>
        <a-descriptions-item label="专家意见" span="2">
          <a-textarea
            v-model="detail.expertResult"
            placeholder="请输入您的诊断意见"
            :auto-size="{ minRows: 3, maxRows: 6 }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="最后修改时间">{{ detail.updatedAt }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <a-button type="primary" @click="handleSave">
        保存
      </a-button>
      <a-button @click="goBack" style="marginLeft: 12px">
        返回
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { diagnoseResultMap2 } from '@/utils/constant'
import { getExpertDetail, updateExpert } from '@/api/diagnose'
import { message } from 'ant-design-vue'

export default {
  name: 'Detail',
  data() {
    return {
      detail: {
        expertResult: '',
        state: 'InProgress',
        user: {
          nickname: ''
        },
        recognition: {
          imageUrl: ''
        }
      },
      column: 2
    }
  },
  filters: {
    resultFilter(type) {
      return diagnoseResultMap2[type].text
    },
    resultTypeFilter(type) {
      return diagnoseResultMap2[type].status
    }
  },
  created() {
    getExpertDetail(this.$route.params.id).then(res => {
      this.detail = res.data.recognition
    })
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'diagnoseExpertList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    showBig() {
      const url = this.detail.recognition.imageUrl
      this.$info({
        title: '',
        width: '70%',
        maskClosable: true,
        content: (
          <div>
            <img src={url} style="width: 100%" />
          </div>
        )
      })
    },
    handleAIDetail(id) {
      this.$router.push({
        name: 'diagnoseAIDetail',
        params: { id }
      })
    },
    handleSave() {
      const param = {
        id: this.detail.id,
        expertResult: this.detail.expertResult
      }
      updateExpert(param).then(res => {
        if (res.code === 0) {
          message.success('专家意见提交成功')
          this.goBack()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-descriptions title="" :column="column" bordered>
        <a-descriptions-item label="订单ID">{{ detail.orderId }}</a-descriptions-item>
        <a-descriptions-item label="用户ID">
          <a @click="handleUserDetail(detail.userId)">{{ detail.userId }}</a>
        </a-descriptions-item>
        <!-- <a-descriptions-item label="下单的app平台">{{ detail.sourceAppId }}</a-descriptions-item> -->
        <a-descriptions-item label="商品类型">{{ detail.orderType | productTypeFilter }}</a-descriptions-item>
        <a-descriptions-item label="商品名称">{{ detail.commodityName }}</a-descriptions-item>
        <a-descriptions-item label="商品价格">
          <strong :style="{ color: '#33cccc', fontSize: '20px' }">¥ {{ detail.price }}</strong>
        </a-descriptions-item>
        <a-descriptions-item label="支付方式">
          <a-icon
            :type="detail.payType"
            :style="{
              color: detail.payType === 'wechat' ? '#52c41a' : '#1890ff',
              fontSize: '30px',
              verticalAlign: 'middle'
            }"
          />
          <span>{{ detail.payType === 'wechat' ? ' 微信' : ' 支付宝' }}</span>
        </a-descriptions-item>
        <a-descriptions-item label="当前状态">
          <a-tag :color="detail.state | resultColorFilter">
            {{ detail.state | resultFilter }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="订单创建时间">{{ detail.createdAt }}</a-descriptions-item>
        <a-descriptions-item label="最后修改时间">{{ detail.updatedAt }}</a-descriptions-item>
        <a-descriptions-item label="支付时间">{{ detail.payedAt }}</a-descriptions-item>
      </a-descriptions>
      <a-divider style="margin-bottom: 20px" />
      <a-button type="primary" @click="goBack">
        返回
      </a-button>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { orderStatusMap, productTypeMap, orderStatusMap2 } from '@/utils/constant'

export default {
  name: 'OrderDetail',
  data() {
    return {
      detail: null,
      column: 1
    }
  },
  filters: {
    resultFilter(type) {
      return orderStatusMap[type].text
    },
    resultTypeFilter(type) {
      return orderStatusMap[type].status
    },
    productTypeFilter(type) {
      return productTypeMap[type]
    },
    resultColorFilter(type) {
      return orderStatusMap2[type].color
    }
  },
  created() {
    this.detail = this.$route.params
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'orderList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'userDetail',
        params: { userId: userId }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

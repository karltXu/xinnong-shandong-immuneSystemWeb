<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="top">每日新增订单数（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <bar-color :data="dailyNewOrderNumber" title="单位/个" :scale="scale1"></bar-color>
        </a-col>
      </a-row>
    </a-card>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="top">每日新增订金额（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <bar-color :data="dailyNewOrderAmount" title="单位/元" :scale="scale2"></bar-color>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { getOverview } from '@/api/dashboard'
import { BarColor } from '@/components'

export default {
  name: 'OrderAnalysis',
  components: {
    BarColor
  },
  data() {
    return {
      loading: true,
      dailyNewOrderAmount: [],
      dailyNewOrderNumber: [],
      scale1: [
        {
          dataKey: 'key',
          alias: '日期'
        },
        {
          dataKey: 'value',
          alias: '订单数'
        }
      ],
      scale2: [
        {
          dataKey: 'key',
          alias: '日期'
        },
        {
          dataKey: 'value',
          alias: '订单金额(元)'
        }
      ]
    }
  },

  created() {
    getOverview().then(res => {
      this.dailyNewOrderAmount = res.data.order.dailyNewOrderAmount
      this.dailyNewOrderNumber = res.data.order.dailyNewOrderNumber
      this.loading = false
    })
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less">
.top {
  margin: 20px 20px 10px 20px;
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
}
.top + hr {
  border: 1px #eeeeee solid;
}
</style>

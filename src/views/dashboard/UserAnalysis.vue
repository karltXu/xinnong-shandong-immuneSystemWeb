<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="top">每日新增用户数（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <bar-color :data="dailyNewUser" title="单位/人次" :scale="scale"></bar-color>
        </a-col>
      </a-row>
    </a-card>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="top">每日活跃用户数（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <bar-color :data="dailyActiveUser" title="单位/人次" :scale="scale"></bar-color>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import { getOverview } from '@/api/dashboard'
import { BarColor } from '@/components'

export default {
  name: 'UserAnalysis',
  components: {
    BarColor
  },
  data() {
    return {
      loading: true,
      dailyActiveUser: [],
      dailyNewUser: [],
      scale: [
        {
          dataKey: 'value',
          alias: '用户数'
        }
      ],
      searchLoading: false,
      queryParam: {}
    }
  },

  created() {
    getOverview().then(res => {
      this.dailyActiveUser = res.data.user.dailyActiveUser
      this.dailyNewUser = res.data.user.dailyNewUser
      this.loading = false
    })
  },
  mounted() {},
  methods: {
    onDateChange(date, dateString) {
      this.queryParam.createdAtStart = dateString[0]
      this.queryParam.createdAtEnd = dateString[1]
    },
    handleSearch() {
      console.log('serarch', this.queryParam)
    },
    handleReset() {
      console.log('rest')
    }
  }
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
#echart {
  height: 547px;
}
</style>

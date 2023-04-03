<template>
  <div>
    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="table-page-search-wrapper" style="padding: 24px 24px 0 24px">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="10" :sm="24">
              <a-form-item label="查询的日期范围">
                <a-range-picker
                  @change="onDateChange"
                  v-model="date"
                  :ranges="{
                    本周: [moment().startOf('week'), moment()],
                    本月: [moment().startOf('month'), moment()],
                    本年: [moment().startOf('year'), moment()]
                  }"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div ref="main" id="echart" style="padding: 24px 50px"></div>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import { getChinaOverview } from '@/api/dashboard'
import { BarColor } from '@/components'
import { option } from './map'

let myChart

const start = moment()
  .subtract(30, 'days')
  .format('YYYY-MM-DD')
const end = moment().format('YYYY-MM-DD')
const momentStart = moment().subtract(30, 'days')
const momentEnd = moment()

export default {
  name: 'UserAnalysis',
  components: {
    BarColor
  },
  data() {
    return {
      searchLoading: false,
      start,
      end,
      data: [],
      toolTipData: [],
      date: [moment().subtract(30, 'days'), moment()]
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      getChinaOverview({
        start: this.start,
        end: this.end
      }).then(res => {
        this.searchLoading = false
        this.toolTipData = res.data.statByProvinces
        this.data = res.data.items
        myChart = window.echarts.init(this.$refs.main)
        myChart.setOption(option(this.data, this.toolTipData))
      })
    },
    onDateChange(date, dateString) {
      this.date = date
      this.start = dateString[0]
      this.end = dateString[1]
    },
    handleSearch() {
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.start = start
      this.end = end
      this.date = [momentStart, momentEnd]
      this.init()
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

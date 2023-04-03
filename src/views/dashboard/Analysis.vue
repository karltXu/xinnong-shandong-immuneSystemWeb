<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="订单总金额" :total="overview.totalOrderAmount | amount">
          <a-tooltip title="订单总金额" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">
            日均销售额
            <span>￥ 234.56</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="订单总量" :total="overview.totalOrder | NumberFormat">
          <a-tooltip title="订单总量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            日访问量
            <span>{{ '1234' | NumberFormat }}</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支持的动物数量" :total="overview.totalPlant | NumberFormat">
          <a-tooltip title="支持的动物数量" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">
            转化率
            <span>60%</span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总用户数" :total="overview.totalUser">
          <a-tooltip title="当前系统总注册用户数" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日环比</span>
              80%
            </trend>
          </template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="dateChangeCommon('ai', 7)">本周</a>
              <a @click="dateChangeCommon('ai', 30)">本月</a>
              <a @click="dateChangeCommon('ai', 365)">本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" @change="aiDateChange" />
          </div>
          <a-tab-pane loading="true" tab="智能诊断分析" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="dailyAIRecognition" title="诊断记录概览" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="诊断动物排行榜" :list="plants" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="dateChangeCommon('expert', 7)">本周</a>
              <a @click="dateChangeCommon('expert', 30)">本月</a>
              <a @click="dateChangeCommon('expert', 365)">本年</a>
            </div>
            <a-range-picker :style="{ width: '256px' }" @change="expertDateChange" />
          </div>
          <a-tab-pane loading="true" tab="专家诊断分析" key="1">
            <a-row>
              <a-col :xl="23" :lg="23" :md="23" :sm="23" :xs="23">
                <bar :data="dailyExpertService" title="诊断记录概览" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <a-tab-pane loading="true" tab="动物病害分布" key="1">
            <a-row>
              <a-col :xl="14" :lg="14" :md="14" :sm="24" :xs="24">
                <div :style="{ marginLeft: '40px' }"><h4>比例概览</h4></div>
                <div :style="{ marginLeft: '25px' }">
                  <v-chart
                    :force-fit="true"
                    :height="555"
                    :data="pieData"
                    :scale="pieScale"
                    :style="{ height: '100%' }"
                  >
                    <v-tooltip :showTitle="false" data-key="item*percent" />
                    <v-axis />
                    <v-legend data-key="item" />
                    <v-pie position="percent" color="item" :vStyle="pieStyle" />
                    <v-coord type="theta" :radius="0.75" :innerRadius="0.6" />
                  </v-chart>
                </div>
              </a-col>
              <a-col :xl="9" :lg="9" :md="9" :sm="24" :xs="24">
                <rank-list title="数量排名概览" :list="pieData2" />
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { ChartCard, MiniArea, MiniBar, MiniProgress, RankList, Bar, Trend } from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { getOverview } from '@/api/dashboard'

const DataSet = require('@antv/data-set')

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend
  },
  data() {
    return {
      loading: true,
      pieScale,
      pieData: [],
      pieData2: [],
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      overview: {
        totalOrder: 0,
        totalOrderAmount: 0,
        totalPlant: 0,
        totalUser: 0
      },
      dailyAIRecognition: [],
      dailyExpertService: [],
      dailyRecognitionSuccess: [],
      diseases: [],
      plants: [],
      params: {
        start: '',
        end: '',
        metrics: ''
      }
    }
  },
  filters: {
    amount(val) {
      return '¥ ' + val
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getOverview(this.params).then(res => {
        this.overview = res.data.overview
        this.dailyAIRecognition = res.data.dc.dailyAIRecognition.map(item => {
          return { x: item.key, y: item.value }
        })
        this.dailyExpertService = res.data.dc.dailyExpertService.map(item => {
          return { x: item.key, y: item.value }
        })
        this.dailyRecognitionSuccess = res.data.dc.dailyRecognitionSuccess
        this.diseases = res.data.dc.diseases.map(item => {
          return { item: item.key, count: item.value }
        })
        const dv = new DataSet.View().source(this.diseases)
        dv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        })
        this.pieData = dv.rows
        this.plants = res.data.dc.plants.map(item => {
          return { name: item.key, total: item.value }
        })
        this.pieData2 = res.data.dc.diseases.map(item => {
          return { name: item.key, total: item.value }
        })
        this.loading = false

        // setTimeout(() => {
        //   const cans = document.getElementsByTagName('canvas')
        //   console.log('cans: ', cans.length)
        //   const pieCan = cans[cans.length - 1]
        //   pieCan.height = 800
        //   pieCan.style.height = '800px'
        // }, 500)
      })
    },
    dateChangeCommon(metrics, num) {
      this.params.start = moment()
        .subtract(num, 'days')
        .format('YYYY-MM-DD')
      this.params.end = moment().format('YYYY-MM-DD')
      this.params.metrics = metrics
      this.init()
    },
    aiDateChange(dates, datesstr) {
      this.params.start = datesstr[0]
      this.params.end = datesstr[1]
      this.params.metrics = 'ai'
      this.init()
    },
    expertDateChange(dates, datesstr) {
      this.params.start = datesstr[0]
      this.params.end = datesstr[1]
      this.params.metrics = 'expert'
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>

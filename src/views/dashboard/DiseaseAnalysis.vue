<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="table-page-search-wrapper" style="padding: 24px 24px 0 24px">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="省">
                <a-select placeholder="请选择" default-value="all" v-model="province">
                  <a-select-option value="all">全国</a-select-option>
                  <template v-for="item in options">
                    <a-select-option :key="item" :value="item">{{ item }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="9" :sm="24">
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
            <a-col :md="5" :sm="24">
              <a-form-item label="病种">
                <a-select
                  show-search
                  placeholder="支持搜索"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  v-model="disease"
                >
                  <a-select-option value="all">全部</a-select-option>
                  <template v-for="(item, index) in options1">
                    <a-select-option :key="index" :value="item.name">{{ item.name }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="top">每日某动物疾病在某个省的诊断次数（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <bar-color :data="sourceData" title="单位/次" :scale="scale"></bar-color>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { BarColor } from '@/components'
import moment from 'moment'
import { getProvinceOptions, getDiseaseOptions, getDiseaseOverview } from '@/api/dashboard'

const start = moment()
  .subtract(30, 'days')
  .format('YYYY-MM-DD')
const end = moment().format('YYYY-MM-DD')
const momentStart = moment().subtract(30, 'days')
const momentEnd = moment()

export default {
  name: 'DiseaseAnalysis',
  components: {
    BarColor
  },
  data() {
    return {
      loading: true,
      sourceData: [],
      scale: [
        {
          dataKey: 'value',
          alias: '次数'
        }
      ],
      queryParam: {
        diseaseName: '',
        province: '',
        start: start,
        end: end
      },
      province: 'all',
      disease: 'all',
      searchLoading: false,
      options: [],
      options1: [],
      date: [moment().subtract(30, 'days'), moment()]
    }
  },

  created() {
    getProvinceOptions().then(res => {
      this.options = res.data.provinces
    })
    getDiseaseOptions().then(res => {
      this.options1 = res.data.disease
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      if (this.disease === 'all') {
        this.queryParam.diseaseName = ''
      } else {
        this.queryParam.diseaseName = this.disease
      }
      if (this.province === 'all') {
        this.queryParam.province = ''
      } else {
        this.queryParam.province = this.province
      }
      getDiseaseOverview(this.queryParam).then(res => {
        this.sourceData = res.data.daily
        this.loading = false
        this.searchLoading = false
      })
    },
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.start = dateString[0]
      this.queryParam.end = dateString[1]
    },
    handleSearch() {
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.province = 'all'
      this.disease = 'all'
      this.queryParam.province = ''
      this.queryParam.diseaseName = ''
      this.queryParam.start = start
      this.queryParam.end = end
      this.date = [momentStart, momentEnd]
      this.init()
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
</style>

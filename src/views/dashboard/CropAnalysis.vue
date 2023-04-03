<template>
  <div>
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="table-page-search-wrapper" style="padding: 24px 24px 0 24px">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="动物">
                <a-select placeholder="请选择" v-model="queryParam.animalID">
                  <a-select-option value="0">全部</a-select-option>
                  <template v-for="item in options">
                    <a-select-option :key="item.animalID" :value="item.animalID">{{ item.animalName }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
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
    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0', marginTop: '24px' }">
      <div class="top">每日某动物的诊断次数（默认近一个月）</div>
      <hr />
      <a-row>
        <a-col :span="23">
          <my-line :data="sourceData" title="单位/次" :scale="scale"></my-line>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { getCropOptions, getCropOverview } from '@/api/dashboard'
import { MyLine } from '@/components'

const start = moment()
  .subtract(30, 'days')
  .format('YYYY-MM-DD')
const end = moment().format('YYYY-MM-DD')
const momentStart = moment().subtract(30, 'days')
const momentEnd = moment()

export default {
  name: 'CropAnalysis',
  components: {
    MyLine
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
        animalID: '0',
        start: start,
        end: end
      },
      searchLoading: false,
      options: [],
      date: [moment().subtract(30, 'days'), moment()]
    }
  },

  created() {
    getCropOptions().then(res => {
      this.options = res.data.plants
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    init() {
      getCropOverview(this.queryParam).then(res => {
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
      this.queryParam.animalID = '0'
      this.queryParam.start = start
      this.queryParam.end = end
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
</style>

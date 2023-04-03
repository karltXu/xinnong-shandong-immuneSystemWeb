<template>
  <div>
    <a-card :bordered="false" :body-style="{ padding: '0' }">
      <div class="table-page-search-wrapper" style="padding: 24px 24px 0 24px">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="类别">
                <a-select placeholder="请选择" defaultValue="0">
                  <a-select-option value="0">全部</a-select-option>
                  <!-- <template v-for="item in options1">
                    <a-select-option :key="item.plantID" :value="item.plantID">{{ item.plantName }}</a-select-option>
                  </template> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="农作物名称">
                <a-select placeholder="请选择" v-model="queryParam.plantID">
                  <a-select-option value="0">全部</a-select-option>
                  <template v-for="item in options2">
                    <a-select-option :key="item.plantID" :value="item.plantID">{{ item.plantName }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="病虫害">
                <a-select
                  show-search
                  placeholder="支持搜索"
                  option-filter-prop="children"
                  :filter-option="filterOption"
                  v-model="queryParam.diseaseID"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <template v-for="item in options3">
                    <a-select-option :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item label="地理位置">
                <a-cascader
                  change-on-select
                  :options="options"
                  :show-search="{ filter }"
                  placeholder="支持搜索"
                  @change="onChange"
                  v-model="position"
                />
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
            <a-col :md="2" :sm="24">
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
      <div id="map" style="padding: 24px"></div>
    </a-card>
  </div>
</template>
<script>
import moment from 'moment'
import { getMapWarning, getMapWarningOption } from '@/api/dashboard'

const start = moment()
  .subtract(30, 'days')
  .format('YYYY-MM-DD')
const end = moment().format('YYYY-MM-DD')
const momentStart = moment().subtract(30, 'days')
const momentEnd = moment()
const longitude = 120.409855
const latitude = 36.123218

export default {
  name: 'MapWarning',
  data() {
    return {
      searchLoading: false,
      data: [],
      date: [moment().subtract(30, 'days'), moment()],
      position: ['', '', ''],
      options: [],
      options1: [],
      options2: [],
      options3: [],
      queryParam: {
        province: '',
        city: '',
        district: '',
        plantID: '',
        diseaseID: '',
        start,
        end,
        longitude,
        latitude
      }
    }
  },
  created() {
    getMapWarningOption().then(res => {
      this.options = res.data.geo
      this.options2 = res.data.plants
      this.options3 = res.data.diseases
    })
  },
  mounted() {

  },
  methods: {
    moment,
    init() {
      getMapWarning(this.queryParam).then(res => {
        this.searchLoading = false
        this.data = res.data.records
        res.data.records.forEach(item => {
          // const point = new window.BMap.Point(item.longitude, item.latitude)
          // const marker = new window.BMap.Marker(point)
          // map.addOverlay(marker)
          // marker.addEventListener('click', function(e) {
          //   window.open(item.detailUrl)
          // })
        })
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
      this.position = ['', '', '']
      this.queryParam.start = start
      this.queryParam.end = end
      this.queryParam.city = ''
      this.queryParam.province = ''
      this.queryParam.district = ''
      this.queryParam.plantID = '0'
      this.queryParam.diseaseID = '0'
      this.queryParam.longitude = longitude
      this.queryParam.latitude = latitude
      this.date = [momentStart, momentEnd]
      this.init()
    },
    onChange(value, selectedOptions) {
      this.queryParam.province = value[0]
      this.queryParam.city = value[1]
      this.queryParam.district = value[2]
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
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
#echart {
  height: 547px;
}

#map {
  width: 100%;
  height: 600px;
}

.city_content_medium {
  line-height: normal;
}
.citylist_popup_main .city_content_top {
  line-height: normal;
  height: 41px !important;
}
</style>

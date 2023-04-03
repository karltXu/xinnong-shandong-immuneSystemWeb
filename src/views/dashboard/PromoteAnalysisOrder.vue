<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="渠道">
                <a-select
                  v-model="channel"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="支持多选"
                  @change="handleSelectChange"
                >
                  <a-select-option v-for="item in options" :key="item.id" :value="item.id">
                    {{ item.channel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="日期">
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
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <h1>
        <span>总金额：</span>
        <span>¥{{ sumOfAmount }}</span>
      </h1>
      <br />
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="cnt" slot-scope="text">
          <span :style="{ color: '#33cccc' }">¥ {{ text }}</span>
        </template>
        <template slot="channel" slot-scope="text, record">
          <span>{{ text }} - {{ record.channel.promoter.nickname }} </span>
        </template>
      </a-table>
      <br />
      <div class="right">
        <a-pagination
          show-quick-jumper
          show-size-changer
          :pageSizeOptions="['5', '10', '20', '50']"
          :show-total="(total, range) => `${range[0]}-${range[1]} / 共 ${total} 条`"
          :current="queryParam.pageNumber"
          :pageSize="queryParam.pageSize"
          :total="total"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
        />
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { getChannels, promotionOrder } from '@/api/dashboard'

const columns = [
  {
    title: '订单ID',
    dataIndex: 'orderId'
  },
  {
    title: '商品名称',
    dataIndex: 'commodityName'
  },
  {
    title: '渠道',
    dataIndex: 'channel.channel',
    scopedSlots: { customRender: 'channel' }
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'cnt' }
  },
  {
    title: '下单时间',
    dataIndex: 'createdAt'
  }
]

export default {
  name: 'PromotionAnalysisOrder',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        channelIds: '',
        start: null,
        end: null
      },
      data: [],
      columns,
      total: 0,
      searchLoading: false,
      tableLoading: false,
      date: [null, null],
      options: [],
      channel: [],
      sumOfAmount: 0
    }
  },

  created() {
    // this.init()
    getChannels().then(res => {
      this.options = res.data.channels
    })
  },
  methods: {
    moment,
    init() {
      this.tableLoading = true
      promotionOrder(this.queryParam).then(res => {
        this.data = res.data.orders
        this.total = res.data.total
        this.sumOfAmount = res.data.sumOfAmount
        this.tableLoading = false
        this.searchLoading = false
      })
    },

    onPageChange(pageNumber) {
      this.queryParam.pageNumber = pageNumber
      this.init()
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.queryParam.pageNumber = current
      this.init()
    },
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.start = dateString[0]
      this.queryParam.end = dateString[1]
    },
    handleSearch() {
      if (!this.queryParam.channelIds) {
        this.$message.warning('请选择渠道再查询哦...')
      } else if (!this.queryParam.start) {
        this.$message.warning('请选择日期再查询哦...')
      } else {
        this.queryParam.pageNumber = 1
        this.searchLoading = true
        this.init()
      }
    },
    handleReset() {
      this.channel = []
      this.queryParam.channelIds = ''
      this.queryParam.start = null
      this.queryParam.end = null
      this.queryParam.pageNumber = 1
      this.date = [null, null]
      this.init()
    },
    handleSelectChange(v) {
      this.queryParam.channelIds = v.join(',')
    }
  }
}
</script>
<style lang="less" scoped></style>

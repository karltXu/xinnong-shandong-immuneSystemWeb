<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="订单ID">
                <a-input v-model="queryParam.orderId" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.userId" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单状态">
                <a-select placeholder="请选择" v-model="queryParam.state">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="Created">已创建</a-select-option>
                  <a-select-option value="Paid">已支付</a-select-option>
                  <a-select-option value="Aborted">已取消</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商品类型">
                <a-select placeholder="请选择" v-model="queryParam.commodityType">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="ServicePlan">套餐订阅</a-select-option>
                  <a-select-option value="ExpertService">专家诊断</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="下单时间">
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
            <a-col :md="8" :sm="24">
              <a-form-item label="渠道">
                <a-select
                  v-model="channel"
                  mode="multiple"
                  style="width: 80%"
                  placeholder="支持多选"
                  @change="handleSelectChange"
                >
                  <a-select-option v-for="item in options" :key="item.id" :value="item.id">
                    {{ item.channel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="orderId" slot-scope="text, record">
          <a @click="handleDetail(record)">{{ text }}</a>
        </template>
        <template slot="userId" slot-scope="text">
          <a @click="handleUserDetail(text)">{{ text }}</a>
        </template>
        <span slot="status" slot-scope="text">
          <!-- <a-badge :status="text | resultTypeFilter" :text="text | resultFilter" /> -->
          <a-tag :color="text | resultColorFilter">
            {{ text | resultFilter }}
          </a-tag>
        </span>
        <template slot="orderType" slot-scope="text">
          <span>{{ text | productTypeFilter }}</span>
        </template>
        <template slot="price" slot-scope="text">
          <span :style="{ color: '#33cccc' }">¥ {{ text }}</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
        </template>
      </a-table>
      <br />
      <div class="right">
        <a-pagination
          show-quick-jumper
          show-size-changer
          :pageSizeOptions="['2', '10', '20', '50']"
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
import { getOrderList } from '@/api/order'
import { orderStatusMap, productTypeMap, orderStatusMap2 } from '@/utils/constant'
import { getChannels } from '@/api/dashboard'

const columns = [
  {
    title: '订单ID',
    dataIndex: 'orderId',
    fixed: 'left',
    scopedSlots: { customRender: 'orderId' }
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '商品类型',
    dataIndex: 'orderType',
    scopedSlots: { customRender: 'orderType' }
  },
  {
    title: '商品名称',
    dataIndex: 'commodityName'
  },
  {
    title: '渠道',
    dataIndex: 'channel.channel'
  },
  {
    title: '商品价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '订单状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '支付时间',
    dataIndex: 'paidAt'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '80px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'OrderList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        orderId: '',
        userId: '',
        state: 'all',
        commodityType: 'all',
        start: null,
        end: null,
        channelIds: ''
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      date: [null, null],
      options: [],
      channel: []
    }
  },
  filters: {
    resultFilter(type) {
      return orderStatusMap[type].text
    },
    resultTypeFilter(type) {
      return orderStatusMap[type].status
    },
    resultColorFilter(type) {
      return orderStatusMap2[type].color
    },
    productTypeFilter(type) {
      return productTypeMap[type]
    }
  },
  created() {
    getChannels().then(res => {
      this.options = res.data.channels
    })
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (param.state === 'all') {
        param.state = ''
      }
      if (param.commodityType === 'all') {
        param.commodityType = ''
      }
      getOrderList(param).then(res => {
        this.data = res.data.orders
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'orderDetail',
        params: { ...record, pageNumber, pageSize }
      })
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'userDetail',
        params: { id: userId }
      })
    },
    onPageChange(pageNumber) {
      this.tableLoading = true
      this.queryParam.pageNumber = pageNumber
      this.init()
    },
    onShowSizeChange(current, pageSize) {
      this.tableLoading = true
      this.queryParam.pageSize = pageSize
      this.queryParam.pageNumber = current
      this.init()
    },
    handleSearch() {
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.start = dateString[0]
      this.queryParam.end = dateString[1]
    },
    handleReset() {
      this.queryParam.orderId = ''
      this.queryParam.userId = ''
      this.queryParam.state = ''
      this.queryParam.commodityType = ''
      this.queryParam.start = ''
      this.queryParam.end = ''
      this.date = [null, null]
      this.queryParam.channelIds = ''
      this.channel = []
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleSelectChange(v) {
      this.queryParam.channelIds = v.join(',')
    }
  }
}
</script>
<style lang="less" scoped></style>

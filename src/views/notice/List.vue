<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="通知类型">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.notificationType" @change="handleSearch">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option v-for="item in ntMapping" :key="item.id" :value="item.key">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="通知状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.read" @change="handleSearch">
                  <a-select-option :value="-1">全部</a-select-option>
                  <a-select-option :value="1">已读</a-select-option>
                  <a-select-option :value="0">未读</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
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
      <a-table
        :data-source="data"
        :columns="columns"
        :pagination="isTablePage"
        rowKey="id"
        :loading="tableLoading"
        :scroll="{x: 700}">
        <span slot="read" slot-scope="text">
          <a-tag :color="text === 1 ? '#87d068' : '#f50'">
            {{ text === 1 ? '已读' : '未读' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
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
import { getNoticeList } from '@/api/notice'

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    fixed: 'left'
  },
  {
    title: '类型',
    dataIndex: 'notificationTypeText',
    width: 120
  },
  {
    title: '状态',
    dataIndex: 'read',
    scopedSlots: { customRender: 'read' },
    width: 90
  },
  {
    title: '日期',
    dataIndex: 'createdAt',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 80,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'NoticeList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        read: -1,
        notificationType: 'all',
        createdAtStart: null,
        createdAtEnd: null
      },
      data: [],
      columns,
      total: 0,
      searchLoading: false,
      tableLoading: true,
      date: [null, null],
      ntMapping: []
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.init()
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))

      getNoticeList(param).then(res => {
        this.data = res.data.notifications
        this.total = res.data.total
        this.ntMapping = res.data.ntMapping
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'noticeDetail',
        params: { ...record, pageNumber, pageSize, detail: record }
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
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.createdAtStart = dateString[0]
      this.queryParam.createdAtEnd = dateString[1]
    },
    handleSearch() {
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.queryParam.notificationType = 'all'
      this.queryParam.read = -1
      this.queryParam.createdAtStart = null
      this.queryParam.createdAtEnd = null
      this.queryParam.pageNumber = 1
      this.date = [null, null]
      this.tableLoading = true
      this.init()
    }
  }
}
</script>
<style lang="less" scoped></style>

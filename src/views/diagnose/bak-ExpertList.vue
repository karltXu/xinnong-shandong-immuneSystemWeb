<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.userId" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="识别状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.state">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="InProgress">诊断中</a-select-option>
                  <a-select-option value="Done">诊断完成</a-select-option>
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
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="userId" slot-scope="text">
          <a @click="handleUserDetail(text)">{{ text }}</a>
        </template>
        <template slot="recognitionId" slot-scope="text">
          <a @click="handleAIDetail(text)">{{ text }}</a>
        </template>
        <template slot="image" slot-scope="text">
          <img :src="text" style="height: 50px" />
        </template>
        <span slot="result" slot-scope="text">
          <a-badge :status="text | resultTypeFilter" :text="text | resultFilter" />
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <!-- <a target="_blank" :href="record.recognition.detailUrl">详情</a> -->
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
import { getExpertList } from '@/api/diagnose'
import { diagnoseResultMap2 } from '@/utils/constant'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    fixed: 'left',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '用户昵称',
    dataIndex: 'user.nickname'
  },
  {
    title: '关联的AI诊断',
    dataIndex: 'recognitionId',
    scopedSlots: { customRender: 'recognitionId' }
  },
  // {
  //   title: '识别的图片',
  //   dataIndex: 'recognition.imageUrl',
  //   scopedSlots: { customRender: 'image' }
  // },
  {
    title: '诊断状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '专家诊断结果',
    dataIndex: 'expertResult'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
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
  name: 'ExpertList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        userId: '',
        state: 'all',
        start: null,
        end: null
      },
      data: [],
      columns,
      total: 0,
      searchLoading: false,
      tableLoading: true,
      date: [null, null]
    }
  },
  filters: {
    resultFilter(type) {
      return diagnoseResultMap2[type].text
    },
    resultTypeFilter(type) {
      return diagnoseResultMap2[type].status
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
      if (param.state === 'all') {
        param.state = ''
      }
      getExpertList(param).then(res => {
        this.data = res.data.expertServices
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'diagnoseExpertDetail',
        params: { ...record, pageNumber, pageSize }
      })
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'userDetail',
        params: { id: userId }
      })
    },
    handleAIDetail(id) {
      this.$router.push({
        name: 'diagnoseAIDetail',
        params: { id }
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
      this.queryParam.start = dateString[0]
      this.queryParam.end = dateString[1]
    },
    handleSearch() {
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.queryParam.userId = ''
      this.queryParam.state = 'all'
      this.queryParam.start = null
      this.queryParam.end = null
      this.queryParam.pageNumber = 1
      this.date = [null, null]
      this.tableLoading = true
      this.init()
    }
  }
}
</script>
<style lang="less" scoped></style>

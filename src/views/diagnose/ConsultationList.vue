<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="会诊编号">
                <a-input v-model="queryParam.id" @pressEnter="handleSearch"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="会诊专家">
                <a-select
                  mode="multiple"
                  label-in-value
                  :value="value"
                  placeholder="支持多选"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="fetchUser"
                  @change="handleChange"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in expertData" :key="d.value">
                    {{ d.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="动物">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.animalId" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in animalOptions" :key="item.animalID" :value="item.animalID">{{ item.animalName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="会诊状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.state" @change="handleSearch">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="Created">待支付</a-select-option>
                  <a-select-option value="Paid">待应诊</a-select-option>
                  <a-select-option value="Refused">已拒诊</a-select-option>
                  <a-select-option value="Accepted">待会诊</a-select-option>
                  <a-select-option value="Consulting">会诊中</a-select-option>
                  <a-select-option value="Consulted">待结诊</a-select-option>
                  <a-select-option value="Done">已结诊</a-select-option>
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
            <a-col :md="8" :sm="24">
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
        :scroll="{x: 1000}">
        <template slot="userId" slot-scope="text">
          <a @click="handleUserDetail(text)">{{ text }}</a>
        </template>
        <template slot="iconUrl" slot-scope="text, record">
          <span>{{ record.expert.name }}</span>
        </template>
        <template slot="meeting" slot-scope="text, record">
          <div v-if="text">
            <div>{{ text | timeFormat }}</div>
            <div>{{ record.meetingEnd | timeFormat }}</div>
          </div>
          <span v-else>-</span>
        </template>
        <span slot="state" slot-scope="text">
          <a-tag :color="text | resultTypeFilter" style="border-radius: 10px">
            {{ text | resultFilter }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">详情</a>
          <a v-if="(record.state === 'Accepted' || record.state === 'Consulting') && record.entryable" @click="handleVideo(record.id)" style="margin-left: 16px;">进入会诊室</a>
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
import { getConsultationList, getAnimalOptions, GetMeetingInfo } from '@/api/diagnose'
import { getExpertList } from '@/api/expert'
import { ConsultationMap } from '@/utils/constant'

const columns = [
  {
    title: '会诊编号',
    dataIndex: 'id',
    fixed: 'left',
    width: 120
  },
  {
    title: '会诊专家',
    dataIndex: 'expert.name',
    scopedSlots: { customRender: 'expert' },
    width: 100
  },
  {
    title: '就诊动物',
    dataIndex: 'animal.animalName',
    width: 90
  },
  {
    title: '会诊状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '预约时间',
    dataIndex: 'meetingStart',
    scopedSlots: { customRender: 'meeting' },
    width: 180
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 200
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'ConsultationList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        animalId: 0,
        state: 'all',
        expertIds: [],
        createdAtStart: null,
        createdAtEnd: null
      },
      data: [],
      columns,
      total: 0,
      searchLoading: false,
      tableLoading: true,
      date: [null, null],
      animalOptions: [],
      value: [],
      expertData: [],
      fetching: false
    }
  },
  filters: {
      resultFilter(type) {
          return ConsultationMap[type].text
      },
      resultTypeFilter(type) {
          return ConsultationMap[type].status
      },
      timeFormat(val) {
        return moment(val * 1000).format('YYYY-MM-DD HH:mm')
      }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.init()
    getAnimalOptions().then(res => {
      this.animalOptions = res.data.animals
    })
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (param.state === 'all') {
        param.state = ''
      }
      getConsultationList(param).then(res => {
        this.data = res.data.consultations
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'consultationDetail',
        params: { ...record, pageNumber, pageSize }
      })
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'expertDetail',
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
      this.queryParam.id = ''
      this.queryParam.expertName = ''
      this.queryParam.animalId = 0
      this.queryParam.expertIds = []
      this.queryParam.state = 'all'
      this.queryParam.createdAtStart = null
      this.queryParam.createdAtEnd = null
      this.queryParam.pageNumber = 1
      this.date = [null, null]
      this.tableLoading = true
      this.init()
    },
    handleVideo(id) {
     GetMeetingInfo({ id }).then(res => {
        window.open(res.data.meetingLink, '_blank')
      })
    },
    fetchUser(value) {
      this.lastFetchId += 1
      this.expertData = []
      this.fetching = true

      getExpertList({ pageNumber: 1, pageSize: 20, name: value, blocked: 'all' }).then(res => {
          console.log('fetching user', value)
          const data = res.data.experts.map(user => ({
            text: user.name,
            value: user.id
          }))
          this.expertData = data
          this.fetching = false
      })
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        expertData: [],
        fetching: false
      })
      this.queryParam.expertIds = value.map(item => item.key)
    }
  }
}
</script>
<style lang="less" scoped></style>

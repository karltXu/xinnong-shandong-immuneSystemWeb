<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="动物">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.animalId" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in animalOptions" :key="item.animalID" :value="item.animalID">{{ item.animalName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="6" :sm="24">
              <a-form-item label="指导状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.state">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="InProgress">诊断中</a-select-option>
                  <a-select-option value="Done">诊断完成</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-item label="就诊时间">
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
        :scroll="{x: 1500}">
        <template slot="userId" slot-scope="text">
          <a @click="handleUserDetail(text)">{{ text }}</a>
        </template>
        <template slot="consultation" slot-scope="text">
          <a @click="handleConDetail(text)">{{ text }}</a>
        </template>
        <template slot="diagnosisResult" slot-scope="text">
          <span v-if="!text">-</span>
          <a-tag v-else color="red">
            <span>{{ text[0].diseaseName + '-' + text[0].probability }}</span>
          </a-tag>
        </template>
        <template slot="caller" slot-scope="text, record">
          <span>{{ record.user.lastName }}{{ text == '男' ? '先生' : '女士' }}</span>
        </template>
        <span slot="state" slot-scope="text">
          <span v-if="!text">-</span>
          <a-tag v-else :color="text === 'Done' ? '#87d068' : '#f50'" style="border-radius: 10px">
            {{ text | resultFilter }}
          </a-tag>
          <!-- <a-badge :status="text | resultTypeFilter" :text="text | resultFilter" /> -->
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
import { getCaseList, getCaseOptions } from '@/api/case'
import { diagnoseResultMap2 } from '@/utils/constant'

const columns = [
  {
    title: '病历ID',
    dataIndex: 'id',
    fixed: 'left',
    width: 120
  },
  {
    title: '专家诊断记录关联ID',
    dataIndex: 'consultation.id',
    scopedSlots: { customRender: 'consultation' },
    width: 120
  },
  {
    title: '就诊用户',
    dataIndex: 'createdByAdminUserInfo.nickname',
    width: 90
  },
   {
    title: '就诊动物',
    dataIndex: 'consultation.animal.animalName',
    width: 70
  },
  {
    title: '会诊专家',
    dataIndex: 'consultation.expert.name',
    width: 90
  },
  {
    title: '主诉',
    dataIndex: 'chiefComplaint',
    width: 120
  },
  {
    title: '诊断结果',
    dataIndex: 'result',
    width: 100
  },
  {
    title: '就诊时间',
    dataIndex: 'createdAt',
    width: 120
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
  name: 'CaseList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        animalId: 0,
        start: null,
        end: null
      },
      data: [],
      columns,
      total: 0,
      searchLoading: false,
      tableLoading: true,
      date: [null, null],
      animalOptions: []
    }
  },
  filters: {
    resultFilter(type) {
      return diagnoseResultMap2[type].text
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.init()
    getCaseOptions().then(res => {
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
      getCaseList(param).then(res => {
        this.data = res.data.cases
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'caseDetail',
        params: { ...record, pageNumber, pageSize }
      })
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'userDetail',
        params: { id: userId }
      })
    },
    handleConDetail(id) {
      this.$router.push({
        name: 'consultationDetail',
        params: { id }
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
      this.queryParam.animalId = 0
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

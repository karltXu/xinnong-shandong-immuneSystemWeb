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
            <a-col :md="6" :sm="24">
              <a-form-item label="指导状态">
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
        <template slot="iconUrl" slot-scope="text, record">
          <!-- <img :src="text" style="height: 50px;width: 50px;border-radius: 50%;" /> -->
          <span>{{ record.expert.name }}</span>
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
import { getExpertList2, getAnimalOptions } from '@/api/diagnose'
import { diagnoseResultMap2 } from '@/utils/constant'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    fixed: 'left',
    width: 60
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    scopedSlots: { customRender: 'userId' },
    width: 70
  },
  {
    title: '用户称呼',
    dataIndex: 'user.sex',
    scopedSlots: { customRender: 'caller' },
    width: 90
  },
   {
    title: '动物',
    dataIndex: 'animal.animalName',
    width: 60
  },
  {
    title: '关联的智能诊断结果',
    dataIndex: 'ducg.diagnosisResult',
    scopedSlots: { customRender: 'diagnosisResult' },
    width: 150
  },
  {
    title: '指导专家',
    dataIndex: 'expert.iconUrl',
    scopedSlots: { customRender: 'iconUrl' },
    width: 100
  },
  {
    title: '指导状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '指导意见',
    dataIndex: 'expertResult',
    width: 200
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 130
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
        animalId: 0,
        state: 'all',
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
      console.log(11, diagnoseResultMap2)
      return diagnoseResultMap2[type].text
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
      getExpertList2(param).then(res => {
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

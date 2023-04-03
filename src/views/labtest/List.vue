<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="检测编号">
                <a-input v-model="queryParam.seqNo" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="检测机构">
                <a-select v-model="queryParam.agencyId" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in agencyOptions" :value="item.id" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="检测项目">
                <a-select mode="multiple" style="width: 100%" v-model="queryParam.testCategoryIds" @change="handleSearch">
                  <a-select-option v-for="item in testCategoryOptions" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-item label="检查日期">
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
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="检测状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.state" @change="handleSearch">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option v-for="item in testStateOptions" :value="item" :key="item">
                    {{ item | stateFilterName }}
                  </a-select-option>
                </a-select>
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
        <template slot="businessId" slot-scope="text">
          <a @click="handleDetail(text)">{{ text }}</a>
        </template>
        <template slot="examinations" slot-scope="text">
          <div v-for="item in text" :key="item.id">{{ item.name }}</div>
        </template>
        <span slot="state" slot-scope="text">
          <a-tag :color="text | stateFilterColor ">
            {{ text | stateFilterName }}
          </a-tag>
        </span>
        <span slot="updatedAt" slot-scope="text, record">
          <span>{{ record.state === 'Done' ? text : '-' }}</span>
        </span>
        <span slot="archived" slot-scope="text">
          <a-tag :color="text ? '#f50' : '#2db7f5' ">
            {{ text ? '是' : '否' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 4px">查看</a>
          <!-- <a-popconfirm v-if="!record.archived" title="确定要归档此记录？" ok-text="是" cancel-text="否" @confirm="handleAchived(record.id)">
            <a href="#" style="margin-left: 15px">归档</a>
          </a-popconfirm> -->
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
import { getTestList, getTestOptions, ArchivedTest } from '@/api/labtest'
import { TestRecordMap } from '@/utils/constant'
import { message } from 'ant-design-vue'
// import { message } from 'ant-design-vue'

const columns = [
  {
    title: '检验编号',
    dataIndex: 'seqNo',
    fixed: 'left',
    width: 160
  },
  {
    title: '检测项目',
    dataIndex: 'agencyExaminations',
    width: 220,
    scopedSlots: { customRender: 'examinations' }
  },
  {
    title: '检测状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '检测机构',
    dataIndex: 'agency.name',
    width: 150
  },
  {
    title: '检查日期',
    dataIndex: 'createdAt',
    width: 180
  },
  {
    title: '完成时间',
    dataIndex: 'updatedAt',
    width: 180,
    scopedSlots: { customRender: 'updatedAt' }
  },
  // {
  //   title: '是否归档',
  //   dataIndex: 'archived',
  //   width: 100,
  //   scopedSlots: { customRender: 'archived' }
  // },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '90px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'TestList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        seqNo: '',
        agencyId: 0,
        testCategoryIds: [],
        state: 'all'
      },
      data: [],
      total: 0,
      columns,
      date: [null, null],
      searchLoading: false,
      tableLoading: false,
      testCategoryOptions: [],
      agencyOptions: [],
      testStateOptions: []
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
    getTestOptions().then(res => {
      const { testCategoryOptions, agencyOptions, testStateOptions } = res.data
      this.testCategoryOptions = testCategoryOptions
      this.agencyOptions = agencyOptions
      this.testStateOptions = testStateOptions
    })
  },
  filters: {
    stateFilterName(val) {
      return TestRecordMap[val].text
    },
    stateFilterColor(val) {
      return TestRecordMap[val].status
    }
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))

      getTestList(param).then(res => {
        this.data = res.data.testRecords
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'testDetail',
        params: { id, pageNumber, pageSize }
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
    handleReset() {
      this.queryParam.seqNo = ''
      this.queryParam.agencyId = 0
      this.queryParam.testCategoryIds = []
      this.queryParam.state = 'all'
      this.queryParam.createdAtStart = ''
      this.queryParam.createdAtEnd = ''
      this.date = [null, null]
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.createdAtStart = dateString[0]
      this.queryParam.createdAtEnd = dateString[1]
    },
    handleAchived(id) {
      ArchivedTest(id).then(res => {
        message.success('归档成功')
        this.init()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

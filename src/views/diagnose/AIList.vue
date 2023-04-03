<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="5" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.userId" @pressEnter="handleSearch"/>
              </a-form-item>
            </a-col>
            <!--            <a-col :md="7" :sm="24">-->
            <!--              <a-form-item label="识别结果">-->
            <!--                <a-select placeholder="请选择" default-value="all" v-model="queryParam.state">-->
            <!--                  <a-select-option value="all">全部</a-select-option>-->
            <!--                  <a-select-option value="InProgress">识别中</a-select-option>-->
            <!--                  <a-select-option value="Failed">识别失败</a-select-option>-->
            <!--                  <a-select-option value="Rejected">未订阅已拒绝</a-select-option>-->
            <!--                  <a-select-option value="DoneSuccess">识别完成-有识别结果</a-select-option>-->
            <!--                  <a-select-option value="DoneNoResult">识别完成-图片不能识别</a-select-option>-->
            <!--                  <a-select-option value="DoneFailed">识别完成-无识别结果</a-select-option>-->
            <!--                </a-select>-->
            <!--              </a-form-item>-->
            <!--            </a-col>-->
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
        <template slot="position" slot-scope="text, record">
          <span v-if="text === null && record.city === null && record.district === null">无</span>
          <span v-else>{{ text }}{{ record.city }}{{ record.district }}</span>
        </template>
        <template slot="result" slot-scope="text">
          <li v-for="(item,index) in text" :key="item.diseaseName">
            <a v-if="0===index">{{ item.diseaseName }}({{ item.probability }})</a>
          </li>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 8px">详情</a>
<!--          <a target="_blank" :href="record.detailUrl">识别结果</a>-->
        </template>
      </a-table>
      <br/>
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
import { getAiList } from '@/api/diagnose'
import { diagnoseResultMap } from '@/utils/constant'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    fixed: 'left',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '动物名称',
    dataIndex: 'animalName'
  },
  {
    title: '诊断地址',
    dataIndex: 'province',
    scopedSlots: { customRender: 'position' }
  },
  {
    title: '诊断结果',
    dataIndex: 'diagnosisResult',
    scopedSlots: { customRender: 'result' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '130px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'AIList',
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
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: true,
      date: [null, null]
    }
  },
  filters: {
    resultFilter(type) {
      return diagnoseResultMap[type].text
    },
    resultTypeFilter(type) {
      return diagnoseResultMap[type].status
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
      getAiList(param).then(res => {
        this.data = res.data.recognitions
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'diagnoseAIDetail',
        params: { id, pageNumber, pageSize, tag: 1 }
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

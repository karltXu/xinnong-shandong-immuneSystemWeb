<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="课程名字">
                <a-input v-model="queryParam.title" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="16" :sm="24">
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
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="课程讲师">
                <a-select style="width: 100%" v-model="queryParam.expertId" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in expertOptions" :value="item.expertId" :key="item.expertId">
                    {{ item.expertName }}
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
        @change="handleTableChange">
        <template slot="imgURL" slot-scope="text">
          <img :src="text" alt="head img" style="height: 50px; width: 50px;">
        </template>
        <template slot="views" slot-scope="text">
          <a-tag color="#108ee9">{{ text }}</a-tag>
        </template>
        <span slot="disabled" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 0 ? '正常' : '禁用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 15px">详情</a>
          <a @click="handleModify(record.id)" style="margin-right: 4px">编辑</a>
          <a-popconfirm title="确定要删除此课程吗？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 15px;color: red">删除</a>
          </a-popconfirm>
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
import { getCourseList, DeleteCourse, getCourseOptions } from '@/api/course'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '课程ID',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '图片',
    dataIndex: 'coverUrl',
    scopedSlots: { customRender: 'imgURL' }
  },
  {
    title: '课程名称',
    dataIndex: 'title'
  },
  {
    title: '课程讲师',
    dataIndex: 'expert.name'
  },
  {
    title: '发布时间',
    dataIndex: 'createdAt',
    sorter: (a, b) => a.createdAt - b.createdAt
  },
  {
    title: '查看次数',
    dataIndex: 'views',
    scopedSlots: { customRender: 'views' },
    sorter: (a, b) => a.views - b.views
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'CourseList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        title: '',
        expertId: 0
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      expertOptions: [],
      date: [null, null]
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
    this.getOption()
  },
  methods: {
    moment,
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      getCourseList(param).then(res => {
        this.data = res.data.courses
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    getOption() {
      getCourseOptions().then(res => {
          const { expertOptions, courseCategoryOptions } = res.data
          this.courseCategoryOptions = courseCategoryOptions
          this.expertOptions = expertOptions
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'courseDetail',
        params: { id, pageNumber, pageSize }
      })
    },
    handleModify(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'courseModify',
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
    onDateChange(date, dateString) {
      this.date = date
      this.queryParam.createdAtStart = dateString[0]
      this.queryParam.createdAtEnd = dateString[1]
      this.init()
    },
    handleSearch() {
      this.queryParam.pageNumber = 1
      this.searchLoading = true
      this.init()
    },
    handleReset() {
      this.searchLoading = false
      this.queryParam.title = ''
      this.queryParam.expertId = 0
      this.queryParam.createdAtStart = null
      this.queryParam.createdAtEnd = null
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeleteCourse(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.sortedInfo = sorter
      if (sorter.field === 'views') {
        this.queryParam.orderByField = 'views'
      } else if (sorter.field === 'createdAt') {
        this.queryParam.orderByField = 'created_at'
      } else {
        this.queryParam.orderByField = ''
      }
      if (sorter.order === 'descend') {
        this.queryParam.orderByType = 'desc'
      } else if (sorter.order === 'ascend') {
        this.queryParam.orderByType = 'asc'
      } else {
        this.queryParam.orderByType = null
      }
      this.init()
    }
  }
}
</script>
<style lang="less" scoped></style>

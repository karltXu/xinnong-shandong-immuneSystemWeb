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
              <a-form-item label="反馈标题">
                <a-input v-model="queryParam.title" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="联系电话">
                <a-input v-model="queryParam.contact" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
        <span slot="status" slot-scope="text">
          <a-badge :status="text | resultTypeFilter" :text="text | resultFilter" />
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 15px">详情</a>
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
import { getFeedbackList } from '@/api/user'
import { userStatusMap } from '@/utils/constant'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    fixed: 'left',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '用户IP地址',
    dataIndex: 'ip'
  },
  {
    title: '反馈标题',
    dataIndex: 'title'
  },
  {
    title: '反馈描述',
    dataIndex: 'description'
  },
  {
    title: '联系电话',
    dataIndex: 'contact'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '120px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'UserList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        userId: '',
        title: '',
        contact: ''
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false
    }
  },
  filters: {
    resultFilter(type) {
      return userStatusMap[type].text
    },
    resultTypeFilter(type) {
      return userStatusMap[type].status
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
  },
  methods: {
    init() {
      getFeedbackList(this.queryParam).then(res => {
        this.data = res.data.feedbacks
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'feedbackDetail',
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
      this.queryParam.pageNumber = 1
      this.queryParam.userId = ''
      this.queryParam.title = ''
      this.queryParam.contact = ''
      this.tableLoading = true
      this.init()
    },
    handleUserDetail(userId) {
      this.$router.push({
        name: 'userDetail',
        params: { id: userId }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

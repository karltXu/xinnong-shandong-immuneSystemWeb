<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="商家名字">
                <a-input v-model="queryParam.name" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商家电话">
                <a-input v-model="queryParam.phone" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="商家地址">
                <a-input v-model="queryParam.address" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="展示状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.disabled">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option value="0">正常</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
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
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <template slot="businessId" slot-scope="text">
          <a @click="handleDetail(text)">{{ text }}</a>
        </template>
        <span slot="disabled" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 0 ? '正常' : '禁用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 4px">编辑</a>
          <a-popconfirm title="确定要删除此商家？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 15px">删除</a>
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
import { getBusinessList, DeleteBusiness } from '@/api/business'
import { orderStatusMap, productTypeMap, orderStatusMap2 } from '@/utils/constant'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '商家ID',
    dataIndex: 'id',
    fixed: 'left',
    scopedSlots: { customRender: 'businessId' }
  },
  {
    title: '商家名字',
    dataIndex: 'name'
  },
  {
    title: '商家电话',
    dataIndex: 'phone'
  },
  {
    title: '商家地址',
    dataIndex: 'address'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '展示状态',
    dataIndex: 'disabled',
    scopedSlots: { customRender: 'disabled' }
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
        name: '',
        phone: '',
        address: '',
        disabled: 'all'
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
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
  },
  methods: {
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (param.disabled === 'all') {
        param.disabled = ''
      }
      getBusinessList(param).then(res => {
        this.data = res.data.merchants
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'businessDetail',
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
      this.queryParam.name = ''
      this.queryParam.phone = ''
      this.queryParam.address = ''
      this.queryParam.disabled = 'all'
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeleteBusiness(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

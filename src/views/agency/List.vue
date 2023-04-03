<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="机构名称">
                <a-input v-model="queryParam.name" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-item label="检测范围/检测项目">
                <a-select mode="multiple" style="width: 100%" v-model="queryParam.testCategoryIds" @change="handleSearch">
                  <a-select-option v-for="item in testCategoryOptions" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="48"> -->
            <a-col :md="7" :sm="24">
              <a-form-item label="从业年限">
                <a-input-number v-model="queryParam.workingAgeMin" :min="0" :max="1000" @change="handleSearch" />-
                <a-input-number v-model="queryParam.workingAgeMax" :min="0" :max="1000" @change="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="展示状态">
                <a-select placeholder="请选择" default-value="all" v-model="queryParam.archived" @change="handleSearch">
                  <a-select-option :value="-1">全部</a-select-option>
                  <a-select-option :value="0">正常</a-select-option>
                  <a-select-option :value="1">禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
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
        <template slot="testCategoryNames" slot-scope="text">
          {{ text && text.join(',') }}
        </template>
        <span slot="archived" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 0 ? '正常' : '禁用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleManager(record)" style="margin-right: 14px">检测项管理</a>
          <a @click="handleDetail(record.id)" style="margin-right: 4px">编辑</a>
          <!-- <a-popconfirm title="确定要删除此检测机构？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 10px">删除</a>
          </a-popconfirm> -->
          <a-popconfirm v-if="record.archived === 0" title="确定要禁用此检测机构？" ok-text="是" cancel-text="否" @confirm="handleForbidden(record.id)">
            <a href="#" style="margin-left: 10px">禁用</a>
          </a-popconfirm>
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
import { getAgencyList, DeleteAgency, getAgencyOptions, ForbiddenAgency } from '@/api/agency'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left',
    width: 50
  },
  {
    title: '检测机构名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 200
  },
  {
    title: '联系人',
    dataIndex: 'contact',
    width: 100
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    width: 140
  },
  {
    title: '执业年限',
    dataIndex: 'workingAge',
    width: 100
  },
  {
    title: '营业地址',
    dataIndex: 'address'
  },
  // {
  //   title: '检测项目',
  //   dataIndex: 'testCategoryNames',
  //   scopedSlots: { customRender: 'testCategoryNames' },
  //   width: 120
  // },
  {
    title: '展示状态',
    dataIndex: 'archived',
    scopedSlots: { customRender: 'archived' },
    width: 70
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 200,
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'DetectList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        atype: 1,
        pageNumber: 1,
        pageSize: 10,
        name: '',
        archived: -1,
        workingAgeMin: 0,
        workingAgeMax: 0
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      testCategoryOptions: []
    }
  },
  created() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
    getAgencyOptions().then(res => {
      const { testCategoryOptions } = res.data
      this.testCategoryOptions = testCategoryOptions
    })
  },
  methods: {
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))

      getAgencyList(param).then(res => {
        this.data = res.data.agencys
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'detectDetail',
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
      this.queryParam.goodAtAnimalIds = []
      this.queryParam.workingAgeMin = 0
      this.queryParam.workingAgeMax = 0
      this.queryParam.archived = -1
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeleteAgency(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    },
    handleForbidden(id) {
      ForbiddenAgency(id).then(res => {
        if (res.code === 0) {
          message.success('禁用成功')
          this.init()
        }
      })
    },
    handleManager(record) {
      this.$router.push({
        name: 'detectItemList',
        params: { id: record.id, name: record.name }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

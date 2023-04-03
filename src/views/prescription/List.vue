<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="处方名称">
                <a-input v-model="queryParam.name" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建人">
                <a-select style="width: 100%" v-model="queryParam.createdBy" @change="handleSearch">
                  <a-select-option :value="0">全部</a-select-option>
                  <a-select-option v-for="item in createdByOptions" :value="item.id" :key="item.id">
                    {{ item.nickname }}
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
        :scroll="{ x: 1000 }">
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)">详情</a>
          <a-popconfirm title="确定要删除此处方吗？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
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
import { getPrescriptionList, DeletePrescription, getPrescriptionOptions } from '@/api/prescription'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '处方ID',
    dataIndex: 'id',
    fixed: 'left',
    width: 120
  },
  {
    title: '处方名称',
    dataIndex: 'name',
    width: 200
  },
  {
    title: '创建人',
    dataIndex: 'expert.name',
    width: 100
  },
  {
    title: '备注',
    dataIndex: 'remarks'
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
    width: '120px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'PrescriptionList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        title: '',
        createdBy: 0
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      date: [null, null],
      createdByOptions: []
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
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      getPrescriptionList(param).then(res => {
        this.data = res.data.prescriptions
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    getOption() {
      getPrescriptionOptions().then(res => {
        const { createdByOptions } = res.data
        this.createdByOptions = createdByOptions
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'prescriptionDetail',
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
      this.queryParam.name = ''
      this.queryParam.createdBy = 0
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeletePrescription(id).then(res => {
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

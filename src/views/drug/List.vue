<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="药品通用名称">
                <a-input v-model="queryParam.name" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="生产企业">
                <a-input v-model="queryParam.manufacture" @pressEnter="handleSearch" />
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
        :scroll="{x: 1200}">
        <template slot="package" slot-scope="text, record">
          <span> {{ getPackage(record) }} </span>
        </template>
        <template slot="manufacture" slot-scope="text">
          <span> {{ text || '-' }} </span>
        </template>
        <template slot="disabled" slot-scope="text">
          <span v-if="text === 1">
            <a-tag color="red">
              禁用
            </a-tag>
          </span>
          <span v-else>
            <a-tag color="cyan">
              启用
            </a-tag>
          </span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)">详情</a>
          <!-- <a-popconfirm title="确定要删除此药品吗？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 15px;color: red">删除</a>
          </a-popconfirm> -->
          <a-popconfirm :title="`确定要${record.disabled === 1 ? '启用' : '禁用'}此药品吗？`" ok-text="是" cancel-text="否" @confirm="handleOnOff(record)">
            <a v-if="record.disabled === 1" href="#" style="margin-left: 15px;color: #108ee9">启用</a>
            <a v-else href="#" style="margin-left: 15px;color: red">禁用</a>
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
import { getDrugList, DeleteDrug, DisableDrug } from '@/api/drug'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '药品编号',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '药品通用名称',
    dataIndex: 'genericName'
  },
  {
    title: '药品名称',
    dataIndex: 'name'
  },
  {
    title: '包装规格',
    dataIndex: 'package1Name',
    scopedSlots: { customRender: 'package' }
  },
  {
    title: '含量规格',
    dataIndex: 'contentSpecification'
  },
  {
    title: '生产企业',
    dataIndex: 'manufacture',
    scopedSlots: { customRender: 'manufacture' }
  },
  {
    title: '状态',
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
  name: 'CourseList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        name: ''
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
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
  },
  methods: {
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      getDrugList(param).then(res => {
        this.data = res.data.drugs
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'drugDetail',
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
      this.queryParam.genericName = ''
      this.queryParam.manufacture = ''
      this.queryParam.pageNumber = 1
      this.tableLoading = true
      this.init()
    },
    handleDelete(id) {
      DeleteDrug(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    },
    handleOnOff(id) {
      DisableDrug(id).then(res => {
        if (res.code === 0) {
          message.success('修改成功')
          this.init()
        }
      })
    },
    getPackage(item) {
      if (!item.package1Name) {
        return '-'
      }
      let str = ''
      if (item.package2Number !== 0 && item.package3Number !== 0) {
        str = item.package2Number + item.package2Name + ' * ' + item.package3Number + item.package3Name + ' / ' + item.package1Name
      } else if (item.package2Number !== 0) {
        str = str = item.package2Number + item.package2Name + ' / ' + item.package1Name
      } else if (item.package3Number !== 0) {
        str = item.package3Number + item.package3Name + ' / ' + item.package1Name
      } else {
        str = item.package1Name
      }
      return str
    }
  }
}
</script>
<style lang="less" scoped></style>

<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标题">
                <a-input v-model="queryParam.title" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类别">
                <a-select placeholder="请选择" v-model="queryParam.categoryId">
                  <a-select-option value="all">全部</a-select-option>
                  <a-select-option v-for="item in options" :value="item.id" :key="item.id">
                    {{ item.name }}
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
      <a-table :data-source="data" :columns="columns" :pagination="isTablePage" rowKey="id" :loading="tableLoading">
        <span slot="categoryId" slot-scope="text">
          <span>{{ text | categoryFilter }}</span>
        </span>
        <span slot="archived" slot-scope="text">
          <a-tag :color="!text ? 'green' : ''">{{ text ? '已归档' : '正常' }}</a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a :href="record.detailUrl" target="_blank">查看</a>
          <a-button v-if="hasModifyPermission" type="link" @click="handleModify(record.id)">修改</a-button>
          <template v-if="hasModifyPermission">
            <a-popconfirm
              v-if="!record.archived"
              title="确定要归档此博客？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleForbidden(record.id)"
            >
              <a href="#">归档</a>
            </a-popconfirm>
            <a-popconfirm
              v-else
              title="确定要取消归档此博客？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleForbidden(record.id)"
            >
              <a href="#">取消归档</a>
            </a-popconfirm>
          </template>
          <a-popconfirm v-if="hasDeletePermission" title="确定要删除此博客？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
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
import { getBlogList, getBlogOptions, ArchiveBlog, DeleteBlog } from '@/api/blog'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    fixed: 'left'
  },
  {
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '类别',
    dataIndex: 'categoryId',
    scopedSlots: { customRender: 'categoryId' },
     width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  {
    title: '是否归档',
    dataIndex: 'archived',
    scopedSlots: { customRender: 'archived' },
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '220px',
    scopedSlots: { customRender: 'action' }
  }
]
var optionsMap = {}

export default {
  name: 'UserList',
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        categoryId: 'all',
        title: ''
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      options: []
    }
  },
  filters: {
    categoryFilter(type) {
      return optionsMap[type]
    }
  },
  computed: {
    hasModifyPermission() {
      return this.$store.getters.hasPermission('blogs', 'update')
    },
    hasDeletePermission() {
      return this.$store.getters.hasPermission('blogs', 'delete')
    }
  },
  mounted() {
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true

    getBlogOptions().then(res => {
      this.options = res.data.options
      for (const item of res.data.options) {
        optionsMap[item.id] = item.name
      }
      this.init()
    })
  },
  methods: {
    init() {
      const param = JSON.parse(JSON.stringify(this.queryParam))
      if (param.categoryId === 'all') {
        param.categoryId = ''
      }
      getBlogList(param).then(res => {
        this.data = res.data.blogs
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(record) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'blogDetai',
        params: { ...record, pageNumber, pageSize }
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
      this.queryParam.title = ''
      this.queryParam.categoryId = 'all'
      this.tableLoading = true
      this.init()
    },
    handleForbidden(id) {
      ArchiveBlog(id).then(res => {
        if (res.code === 0) {
          message.success('操作成功')
          this.init()
        }
      })
    },
    handleDelete(id) {
      DeleteBlog(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    },
    handleModify(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'blogModify',
        params: { id, pageNumber, pageSize }
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

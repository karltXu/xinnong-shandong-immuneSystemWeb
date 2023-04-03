<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="用户ID">
                <a-input v-model="queryParam.id" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="昵称">
                <a-input v-model="queryParam.nickname" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="手机号">
                <a-input v-model="queryParam.phone" @pressEnter="handleSearch" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="渠道">
                <a-select
                  v-model="channel"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="支持多选"
                  @change="handleSelectChange"
                >
                  <a-select-option v-for="item in options" :key="item.id" :value="item.id">
                    {{ item.channel }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" offset="18">
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
          <a @click="handleDetail(text)">{{ text }}</a>
        </template>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | resultTypeFilter" :text="text | resultFilter" />
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record.id)" style="margin-right: 15px">详情</a>
          <a-popconfirm
            v-if="!record.status"
            title="确定要禁用此用户？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleForbidden(record.id)"
          >
            <a href="#">禁用</a>
          </a-popconfirm>
          <a-popconfirm
            v-else
            title="确定要解禁此用户？"
            ok-text="是"
            cancel-text="否"
            @confirm="handleForbidden(record.id)"
          >
            <a href="#">解禁</a>
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
import { getUserList, updateUserStatus } from '@/api/user'
import { userStatusMap } from '@/utils/constant'
import { message } from 'ant-design-vue'
import { getChannels } from '@/api/dashboard'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    fixed: 'left',
    scopedSlots: { customRender: 'userId' }
  },
  {
    title: '昵称',
    dataIndex: 'nickname'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '用户备注',
    dataIndex: 'remarks'
  },
  {
    title: '渠道',
    dataIndex: 'channel.channel'
  },
  {
    title: '当前状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt'
  },
  //   {
  //     title: '权益',
  //     dataIndex: 'userRights.currentServicePlan'
  //   },
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
        nickname: '',
        phone: '',
        id: ''
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      options: [],
      channel: []
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
    getChannels().then(res => {
      this.options = res.data.channels
    })
    if (this.$route.params.pageNumber) {
      this.queryParam.pageNumber = this.$route.params.pageNumber
      this.queryParam.pageSize = this.$route.params.pageSize
    }
    this.tableLoading = true
    this.init()
  },
  methods: {
    init() {
      getUserList(this.queryParam).then(res => {
        this.data = res.data.users
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleDetail(id) {
      const { pageNumber, pageSize } = this.queryParam
      this.$router.push({
        name: 'userDetail',
        params: { id, pageNumber, pageSize, tag: 1 }
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
      this.queryParam.nickname = ''
      this.queryParam.id = ''
      this.queryParam.phone = ''
      this.queryParam.channelIds = ''
      this.channel = []
      this.tableLoading = true
      this.init()
    },
    handleForbidden(id) {
      updateUserStatus(id).then(res => {
        if (res.code === 0) {
          message.success('修改状态成功')
          this.init()
        }
      })
    },
    handleSelectChange(v) {
      this.queryParam.channelIds = v.join(',')
    }
  }
}
</script>
<style lang="less" scoped></style>

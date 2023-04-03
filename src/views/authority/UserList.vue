<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="账号">
              <a-input placeholder="请输入" v-model="queryParam.queryFilters.username" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="角色">
              <a-select v-model="queryParam.queryFilters.roleId">
                <a-select-option v-for="role in roleOption" :value="role.id" :key="role.id">{{
                  role.name
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0" v-model="queryParam.queryFilters.status">
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户名称">
                <a-input placeholder="请输入" v-model="queryParam.queryFilters.nickname" />
              </a-form-item>
            </a-col>
          </template>

          <a-col :md="6" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="init">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator" v-if="hasAdd">
      <a-button type="primary" icon="plus" @click="newOne">新建</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="loadData"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: 800 }"
      rowKey="id"
    >
      <span slot="status" slot-scope="text">
        <a-tag :color="text == 1 ? 'green' : 'pink'">{{ text | statusFilter }}</a-tag>
      </span>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0,height: 300px">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col :span="4" class="right">
            <b>是否超级管理员：</b>
          </a-col>
          <a-col :span="8">
            <span>{{ record.role.code === 'BUILTIN_SYSTEM_ADMIN' ? '是' : '否' }}</span>
          </a-col>
          <a-col :span="4" class="right">
            <b>创建时间：</b>
          </a-col>
          <a-col :span="8">
            <span>{{ record.createdAt || '' }}</span>
          </a-col>
          <a-col :span="4" class="right">
            <b>备注：</b>
          </a-col>
          <a-col :span="8">
            <span>{{ record.remarks || '' }}</span>
          </a-col>
          <a-col :span="4" class="right">
            <b>最后修改时间：</b>
          </a-col>
          <a-col :span="8">
            <span>{{ record.updatedAt || '' }}</span>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a-button type="link" size="small" @click="checkDetail(text)" ghost v-if="hasUpdate">编辑</a-button>
        <a-divider type="vertical" />
        <a-button
          :disabled="record.role.code === 'BUILTIN_SYSTEM_ADMIN'"
          v-if="record.status == 1 && hasUpdate"
          type="link"
          size="small"
          @click="handleProhibit(text, record)"
        >
          禁用
        </a-button>
        <a-button
          :disabled="record.username == 'admin' || record.username == currentUser"
          v-if="record.status == 0 && hasUpdate"
          size="small"
          type="dashed"
          @click="handleProhibit(text, record)"
        >
          启用
        </a-button>
        <a-divider type="vertical" />
        <a @click="handleDelete(text, record)" v-if="hasDelete" style="color: red"> 删除</a>
      </span>
    </a-table>
    <br />
    <div style="text-align: right;">
      <a-pagination
        :total="total"
        :showTotal="(total, range) => `共  ${total} 条`"
        :defaultPageSize="10"
        :defaultCurrent="1"
        showSizeChanger
        showQuickJumper
        @change="paginationChange"
        @showSizeChange="paginationSizeChange"
      />
    </div>
    <role-modal ref="modal" @ok="handleOk"></role-modal>
  </a-card>
</template>

<script>
import RoleModal from './modules/RoleModal'
import { getAllAsOptions, getUserList, deleteUser, updateUserStatus } from '@/api/authority'

const statusMap = {
  1: '正常',
  0: '禁用'
}
const columns = [
  {
    title: '账号',
    dataIndex: 'username'
  },
  {
    title: '用户名称',
    dataIndex: 'nickname'
  },
  {
    title: '角色',
    dataIndex: 'role.name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'UserList',
  components: {
    RoleModal
  },
  data() {
    return {
      advanced: false,
      visible: false,
      form: null,
      mdl: {},
      // 查询参数
      queryParam: {
        queryFilters: {}
      },
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      loading: false,
      total: 0,
      roleOption: []
    }
  },
  computed: {
    hasAdd() {
      return this.$store.getters.hasPermission('userManage', 'add')
    },
    hasDelete() {
      return this.$store.getters.hasPermission('userManage', 'delete')
    },
    hasUpdate() {
      return this.$store.getters.hasPermission('userManage', 'update')
    },
    hasQuery() {
      return this.$store.getters.hasPermission('userManage', 'query')
    },
    currentUser() {
      return this.$store.state.user.username
    }
  },
  mounted() {
    this.init()
    this.init2()
  },
  filters: {
    statusFilter(type) {
      return statusMap[type]
    }
  },
  methods: {
    init2() {
      getAllAsOptions().then(res => {
        this.roleOption = res.data.roles
      })
    },
    init() {
      this.loading = true
      getUserList(this.queryParam)
        .then(res => {
          this.loadData = res.data.users
          this.total = res.data.total
          this.loading = false
        })
        .catch(err => {
          console.log('err: ', err)
          this.loading = false
        })
    },
    reset() {
      this.queryParam.queryFilters = {}
      this.init()
    },
    checkDetail(id) {
      this.$router.push({
        path: '/authority/user-update',
        query: {
          userId: id
        }
      })
      //   window.open(routeUrl.href, '_blank')
    },
    handleDelete(id, record) {
      const that = this
      this.$confirm({
        title: `你确定要删除以下账号吗?`,
        content: record.username,
        onOk() {
          deleteUser(id).then(res => {
            that.$message.success('删除成功。')
            that.init()
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    handleProhibit(id, record) {
      const that = this
      const title = record.status === 1 ? '禁用' : '启用'
      this.$confirm({
        title: `你确定要${title}以下用户吗?`,
        content: record.username,
        onOk() {
          updateUserStatus(id).then(res => {
            that.$message.success('修改状态成功。')
            that.init()
          })
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    paginationChange(page, pageSize) {
      this.queryParam.pageSize = pageSize
      this.queryParam.pageNumber = page
      this.init()
    },
    paginationSizeChange(current, size) {
      this.queryParam.pageSize = size
      this.queryParam.pageNumber = current
      this.init()
    },
    newOne() {
      this.$router.push({
        name: 'UserNew'
      })
    },
    handleOk() {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style lang="less" scoped>
.right {
  text-align: right;
}
</style>

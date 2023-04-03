<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入" v-model="queryParam.queryFilters.name" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="状态">
              <a-select placeholder="请选择" default-value="0" v-model="queryParam.queryFilters.status">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="init">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
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
      rowKey="id"
      :scroll="{ x: 1020 }"
    >
      >
      <span slot="status" slot-scope="text">
        <a-tag :color="text === 1 ? 'green' : 'pink'">{{ text | statusFilter }}</a-tag>
      </span>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :span="7">
              <span>{{ role.name }}：</span>
            </a-col>
            <a-col :span="17" v-if="role.actions.length > 0">
              <a-tag
                :color="
                  action.code == 'delete'
                    ? 'pink'
                    : action.code == 'update'
                      ? 'purple'
                      : action.code == 'add'
                        ? 'cyan'
                        : 'green'
                "
                v-for="(action, k) in role.actions"
                :key="k"
              >
                <span v-if="action.checked">{{ action.name }}</span>
              </a-tag>
            </a-col>
            <a-col :span="17" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="checkDetail(text)" v-if="hasUpdate">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown v-if="hasUpdate">
          <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a v-if="record.status === 1" href="javascript:;" @click="handleProhibit(text, record)">禁用</a>
              <a v-else href="javascript:;" @click="handleProhibit(text, record)">启用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="handleDelete(text, record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
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
import { getRoleList, deleteRole, updateRoleStatus } from '@/api/authority'

const statusMap = {
  1: '正常',
  2: '禁用'
}
const columns = [
  {
    title: '唯一识别码',
    dataIndex: 'code'
  },
  {
    title: '角色名称',
    dataIndex: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastModified'
  },
  //   {
  //     title: '最后修改人',
  //     dataIndex: 'lastOperator',
  //     width: 110
  //   },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'id',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'RoleList',
  components: {
    RoleModal
  },
  data() {
    return {
      visible: false,
      form: null,
      // 查询参数
      queryParam: {
        queryFilters: {}
      },
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
      loading: false,
      total: 0
    }
  },
  computed: {
    hasAdd() {
      return this.$store.getters.hasPermission('roleManage', 'add')
    },
    hasDelete() {
      return this.$store.getters.hasPermission('roleManage', 'delete')
    },
    hasUpdate() {
      return this.$store.getters.hasPermission('roleManage', 'update')
    },
    hasQuery() {
      return this.$store.getters.hasPermission('roleManage', 'query')
    }
  },
  mounted() {
    this.init()
  },
  filters: {
    statusFilter(type) {
      return statusMap[type]
    }
  },
  methods: {
    init() {
      this.loading = true
      getRoleList(this.queryParam)
        .then(res => {
          this.loadData = res.data.roles
          console.log('loadData: ', this.loadData)
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    reset() {
      this.queryParam.queryFilters = {}
      this.init()
    },
    checkDetail(id) {
      this.$router.push({
        path: '/authority/role-update',
        query: {
          roleId: id
        }
      })
    },
    handleDelete(id, record) {
      const that = this
      this.$confirm({
        title: `你确定要删除以下角色吗?`,
        content: record.name,
        onOk() {
          deleteRole({ roleId: id }).then(res => {
            if (res.code === 200) {
              that.$message.success('删除成功。')
              that.init()
            }
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
        title: `你确定要${title}以下角色吗?`,
        content: record.name,
        onOk() {
          updateRoleStatus({
            roleId: id,
            toStatus: record.status === 1 ? 2 : 1
          }).then(res => {
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
        name: 'RoleNew'
      })
    },
    handleOk() {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    }
  },
  watch: {}
}
</script>

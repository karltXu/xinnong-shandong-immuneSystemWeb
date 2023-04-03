<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="唯一识别码">
              <a-input placeholder="请输入唯一识别码" v-model="queryParam.queryFilters.code" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="权限名称">
              <a-input placeholder="请输入权限名称" v-model="queryParam.queryFilters.name" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="init">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table
      :columns="columns"
      :dataSource="loadData"
      :pagination="false"
      :loading="loading"
      rowKey="id"
      :scroll="{ x: 1100 }"
    >
      <span slot="actions" slot-scope="text, record">
        <a-tag
          v-for="(action, index) in record.actions"
          :key="index"
          :color="
            action.code == 'delete'
              ? 'pink'
              : action.code == 'update'
                ? 'purple'
                : action.code == 'add'
                  ? 'cyan'
                  : 'green'
          "
        >
          {{ action.name }}
        </a-tag>
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
    <a-modal title="操作" :width="800" v-model="visible" @ok="handleOk">
      <a-form
        :autoFormCreate="
          form => {
            this.form = form
          }
        "
      >
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一识别码"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一识别码" v-model="mdl.id" id="no" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="权限名称"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="permission_name" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="状态" hasFeedback validateStatus="warning">
          <a-select v-model="mdl.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述" hasFeedback>
          <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe" />
        </a-form-item>

        <a-divider />

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="赋予权限" hasFeedback>
          <a-select style="width: 100%" mode="multiple" v-model="mdl.actions" :allowClear="true">
            <a-select-option v-for="(action, index) in permissionList" :key="index" :value="action.value">{{
              action.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { getPermissionList } from '@/api/authority'
const columns = [
  {
    title: '唯一识别码',
    dataIndex: 'code'
  },
  {
    title: '菜单名称',
    dataIndex: 'name'
  },
  {
    title: '可操作权限',
    dataIndex: 'actions',
    scopedSlots: {
      customRender: 'actions'
    },
    width: 250
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  {
    title: '最后修改时间',
    dataIndex: 'lastModified'
  },
  {
    title: '最后修改人',
    dataIndex: 'lastOperator',
    width: 110
  }
]
const labelCol = {
  xs: {
    span: 24
  },
  sm: {
    span: 5
  }
}
const wrapperCol = {
  xs: {
    span: 24
  },
  sm: {
    span: 16
  }
}

export default {
  name: 'PermissionList',
  components: {},
  data() {
    return {
      visible: false,
      loading: false,
      labelCol,
      wrapperCol,
      form: null,
      mdl: {},
      queryParam: {
        queryFilters: {}
      },
      columns,
      permissionList: null,
      loadData: [],
      total: 0
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: '正常',
        2: '禁用'
      }
      return statusMap[status]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      getPermissionList(this.queryParam).then(res => {
        this.loadData = res.data.permissions
        this.total = res.data.total
        this.loading = false
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
    reset() {
      this.queryParam.queryFilters = {}
      this.init()
    },
    handleEdit(record) {
      this.mdl = Object.assign({}, record)
      this.visible = true
    },
    handleOk() {}
  }
}
</script>

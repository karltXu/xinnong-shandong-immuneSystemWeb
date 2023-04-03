<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <!-- <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <p style="font-size: 26px;font-weight: 600;color: #108ee9;">{{ agencyName }}</p>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="标准库检测项目">
                <a-select mode="multiple" style="width: 100%" v-model="queryParam.testCategoryIds" @change="handleSearch">
                  <a-select-option v-for="item in testCategoryOptions" :key="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="单价">
                <a-input-number v-model="queryParam.costMin" :min="0" :max="100000" @change="handleSearch" />-
                <a-input-number v-model="queryParam.costMax" :min="0" :max="100000" @change="handleSearch" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleSearch" :loading="searchLoading">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button style="margin-left: 8px" type="danger" @click="handleAdd">新增</a-button>
              </span>
            </a-col>
          </a-row> -->
          <a-row>
            <a-col :md="20" :sm="24">
              <p style="font-size: 26px;font-weight: 600;color: #108ee9;">{{ agencyName }}</p>
            </a-col>
            <a-col :md="4" :sm="24">
              <span>
                <a-button style="margin-left: 8px" type="danger" @click="handleAdd">新增</a-button>
              </span>
              <span>
                <a-button style="margin-left: 8px" @click="handleBack">返回</a-button>
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
        :scroll="{x: 1000}"
      >
        <template slot="businessId" slot-scope="text">
          <a @click="handleDetail(text)">{{ text }}</a>
        </template>
        <template slot="testCategoryNames" slot-scope="text">
          {{ text.join(',') }}
        </template>
        <span slot="archived" slot-scope="text">
          <a-tag :color="text === 0 ? 'green' : ''">
            {{ text === 0 ? '正常' : '禁用' }}
          </a-tag>
        </span>
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" style="margin-right: 14px">编辑</a>
          <a @click="handleDetail(record)" style="margin-right: 4px">详情</a>
          <a-popconfirm title="确定要删除此项目？" ok-text="是" cancel-text="否" @confirm="handleDelete(record.id)">
            <a href="#" style="margin-left: 10px">删除</a>
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
    <a-modal v-model="visible" title="检测项目详情" @ok="handleOkDetail" class="detail">
      <Detail :detail="detail"></Detail>
    </a-modal>
    <a-modal class="edit" v-model="visibleEdit" title="检测项目修改" @ok="handleOkEdit" @cancel="handleCancelEdit">
      <Edit :form="detail" ref="edit" @success="init" :name="agencyName"></Edit>
    </a-modal>
    <a-modal class="edit" v-model="visibleAdd" title="新增检测项目" @ok="handleOkAdd" @cancel="handleCancelAdd">
      <Add ref="add" @success="init" :name="agencyName" :id="queryParam.agencyId"></Add>
    </a-modal>
  </page-header-wrapper>
</template>

<script>
import { getItemList, DeleteItem, getAgencyOptions } from '@/api/agency'
import { message } from 'ant-design-vue'
import Detail from './component/Detail.vue'
import Edit from './DetectDetail.vue'
import Add from './DetectNew.vue'

const columns = [
  {
    title: '动物',
    dataIndex: 'animal.animalName',
    fixed: 'left',
    width: 80
  },
  {
    title: '标准库检测项目',
    dataIndex: 'examination.name',
    width: 200
  },
  {
    title: '机构检测项目',
    dataIndex: 'name',
    width: 200
  },
  // {
  //   title: '检测类型',
  //   dataIndex: 'itemName',
  //   width: 100
  // },
  {
    title: '检测方法',
    dataIndex: 'method',
    width: 100
  },
  {
    title: '单价',
    dataIndex: 'cost',
    width: 90
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'DetectItemList',
  components: {
    Detail,
    Edit,
    Add
  },
  data() {
    return {
      isTablePage: false,
      queryParam: {
        pageNumber: 1,
        pageSize: 10,
        agencyId: 0
      },
      data: [],
      total: 0,
      columns,
      searchLoading: false,
      tableLoading: false,
      testCategoryOptions: [],
      visible: false,
      visibleEdit: false,
      visibleAdd: false,
      detail: null,
      agencyName: ''
    }
  },
  created() {
    this.agencyName = this.$route.params.name
    this.queryParam.agencyId = this.$route.params.id
  },
  mounted() {
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

      getItemList(param).then(res => {
        this.data = res.data.agencyExamination
        this.total = res.data.total
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    handleEdit(record) {
      this.detail = record
      this.visibleEdit = true
    },
     handleDetail(record) {
      this.detail = record
      this.visible = true
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
      DeleteItem(id).then(res => {
        if (res.code === 0) {
          message.success('删除成功')
          this.init()
        }
      })
    },
    handleOkDetail() {
      this.visible = false
    },
    handleOkEdit() {
      this.$refs.edit.onSubmit()
      this.visibleEdit = false
    },
    handleCancelEdit() {
      this.visibleEdit = false
    },
    handleAdd() {
      this.visibleAdd = true
    },
    handleOkAdd() {
      this.$refs.add.onSubmit()
      this.visibleAdd = false
    },
    handleCancelAdd() {
      this.visibleAdd = false
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  /deep/ .ant-modal {
    width: 620px !important;
  }

}
.edit {
  /deep/ .ant-modal {
    width: 720px !important;
  }
  /deep/ .ant-modal-body {
    padding: 0 !important;
  }
}
</style>

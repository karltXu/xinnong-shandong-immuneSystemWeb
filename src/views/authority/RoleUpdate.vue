<template>
  <a-card :bordered="false" :style="{ height: '100%' }">
    <a-row :gutter="24">
      <a-col :md="16" :offset="4">
        <div style="max-width: 800px">
          <a-form :form="form" layout="vertical" @submit="handleSubmit">
            <a-form-item label="唯一键">
              <a-input
                disabled
                v-decorator="['code', { rules: [{ required: true, message: 'Please input unique key!' }] }]"
                placeholder="请填写唯一键"
              />
            </a-form-item>

            <a-form-item label="角色名称">
              <a-input
                v-decorator="['name', { rules: [{ required: true, message: '请输入角色名称!' }] }]"
                placeholder="请填写角色名称"
              />
            </a-form-item>

            <a-form-item label="状态">
              <a-select v-decorator="['status', { rules: [] }]">
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">禁用</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="是否内置">
              <a-radio-group disabled :options="radioOptions" v-decorator="['isBuiltin']" />
            </a-form-item>
            <a-form-item label="备注说明">
              <a-textarea
                :row="3"
                v-decorator="['remarks', { rules: [{ required: true, message: '请输入备注!' }] }]"
                placeholder="请填写角色名称"
              />
            </a-form-item>

            <a-form-item label="拥有权限">
              <a-row class="role-row" :gutter="16" v-for="(permission, index) in permissions" :key="index">
                <a-col :md="5" :style="{ textAlign: 'right' }"> {{ permission.name }}： </a-col>
                <a-col :md="19">
                  <a-checkbox
                    v-if="permission.actions.length > 0"
                    :indeterminate="permission.indeterminate"
                    :checked="permission.checkedAll"
                    @change="onChangeCheckAll($event, permission)"
                  >
                    全选
                  </a-checkbox>
                  <a-checkbox-group
                    :options="permission.actionsOption"
                    v-model="permission.checkedData"
                    @change="onChangeCheck(permission)"
                  />
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item style="text-align: center">
              <a-button htmlType="submit" type="primary" :disabled="isBuiltin === 1">保存</a-button>
              <a-button style="margin-left: 8px" @click="handleBack">返回</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { updateRole, getRoleInfo } from '@/api/authority'

export default {
  name: 'RoleUpdate',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      permissions: [],
      radioOptions: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      isBuiltin: 0
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    init() {
      const that = this
      getRoleInfo({ roleId: this.$route.query.roleId }).then(res => {
        const info = res.data.info
        this.isBuiltin = info.isBuiltin
        this.form.setFieldsValue({
          name: info.name,
          code: info.code,
          remarks: info.remarks,
          status: info.status,
          isBuiltin: info.isBuiltin
        })
        info.permissions.map(function(permission) {
          const checkedData = that.getAllChecked(permission.actions)
          permission.checkedData = checkedData
          const actionsOption = that.cvtForShow(permission.actions)
          permission.actionsOption = actionsOption
          permission.indeterminate =
            permission.checkedData.length > 0 && permission.checkedData.length !== permission.actions.length
          permission.checkedAll = permission.checkedData.length === permission.actions.length
        })
        this.treeData = info.treePerms
        this.permissions = info.permissions
      })
    },
    onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.checkedData.length && permission.checkedData.length < permission.actions.length
      permission.checkedAll = permission.checkedData.length === permission.actions.length
    },
    onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        checkedData: e.target.checked ? permission.actionsOption.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    },
    cvtForShow(actions) {
      var newActions = []
      actions.map(function(action) {
        newActions.push({
          value: action.permissionId,
          label: action.name
        })
      })
      return newActions
    },
    getAllChecked: function(actions) {
      var checked = []
      actions.map(function(action) {
        if (action.checked) {
          checked.push(action.permissionId)
        }
      })
      return checked
    },
    handleSubmit(e) {
      var that = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const submitData = values
          submitData.roleId = that.$route.query.roleId
          var innerId = []
          that.permissions.map(item => {
            item.checkedData.map(id => {
              innerId.push(id)
            })
          })
          submitData.permissionIds = innerId
          updateRole(submitData).then(res => {
            that.$message.success('修改成功')
            that.$router.go(-1)
          })
        }
      })
    },
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.role-row {
  margin: 20px 0;
}
</style>

<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-alert
      message="重要提示"
      description="新建用户的默认密码是：aiphsnuser@2020，请提示用户登录后修改."
      type="warning"
      showIcon
    />
    <br />
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="登录账号"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
          v-decorator="['username', { rules: [{ required: true, message: '请输入登录账号' }] }]"
          name="name"
          placeholder="请输入用户名称"
        />
      </a-form-item>
      <a-form-item
        label="用户名称"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
          v-decorator="['nickname', { rules: [{ required: true, message: '请输入用户名称' }] }]"
          name="name"
          placeholder="请输入用户名称"
        />
      </a-form-item>
      <a-form-item
        label="角色"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-select
          placeholder="请选择用户所属角色"
          v-decorator="['roleId', { rules: [{ required: true, message: '请选择一个角色' }] }]"
        >
          <a-select-option v-for="role in roleOption" :value="role.id" :key="role.code" :disabled="role.code === 'BUILTIN_EXPERT'">{{
            role.name
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="备注"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-textarea
          rows="4"
          placeholder="请输入备注"
          v-decorator="['remarks', { rules: [{ required: true, message: '请输入备注信息' }] }]"
        />
      </a-form-item>

      <a-form-item
        label="用户状态"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-radio-group
          :options="radioOptions"
          v-decorator="[
            'status',
            {
              initialValue: 1
            }
          ]"
        />
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button htmlType="submit" type="primary">保存</a-button>
        <a-button style="margin-left: 8px" @click="handleBack">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getAllAsOptions, createUser } from '@/api/authority'

export default {
  name: 'UserNew',
  data() {
    return {
      form: this.$form.createForm(this),
      radioOptions: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '禁用',
          value: 2
        }
      ],
      roleOption: [],
      currentRoleCode: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getAllAsOptions().then(res => {
        this.roleOption = res.data.roles
      })
    },
    // handler
    handleSubmit(e) {
      var that = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          const submitData = values

          createUser(submitData).then(res => {
            if (res.code === 0) {
              that.$message.success('新建管理账号成功')
              that.$router.push({
                name: 'UserManagerList'
              })
            }
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
<style type="text/css" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

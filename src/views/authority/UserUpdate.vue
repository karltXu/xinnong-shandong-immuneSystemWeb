<template>
  <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="登录账号"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-input
          v-decorator="['username', { rules: [{ required: true, message: '请输入登录账号' }] }]"
          name="name"
          placeholder="用户名称"
          disabled
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
          placeholder="用户名称"
        />
      </a-form-item>
      <a-form-item
        label="角色"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-select v-decorator="['roleId', { rules: [{ required: true, message: '请选择一个角色' }] }]">
          <a-select-option
            v-for="role in roleOption"
            :value="role.id"
            :key="role.id"
            :disabled="role.code == 'BUILTIN_SYSTEM_ADMIN'"
          >
            {{ role.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="备注"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-textarea rows="4" placeholder="请输入备注" v-decorator="['remarks']" />
      </a-form-item>

      <a-form-item
        label="用户状态"
        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-radio-group :disabled="currentUser == username" :options="radioOptions" v-decorator="['status']" />
      </a-form-item>
      <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
        <a-button htmlType="submit" type="primary">保存</a-button>
        <a-button style="margin-left: 8px" @click="handleBack">返回</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getAllAsOptions, getUserDetail, updateUser } from '@/api/authority'

export default {
  name: 'UserUpdate',
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
          value: 0
        }
      ],
      roleOption: [],
      username: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.user.username
    }
  },
  mounted() {
    this.getRoleOptions()
    this.getUserInfo()
  },
  methods: {
    getRoleOptions() {
      getAllAsOptions().then(res => {
        this.roleOption = res.data.roles
      })
    },
    getUserInfo() {
      getUserDetail(this.$route.query.userId).then(res => {
        this.setInitInfo(res)
      })
    },
    setInitInfo(res) {
      var that = this
      const info = res.data.account

      const formParams = {
        username: info.username,
        nickname: info.nickname,
        roleId: info.role.id,
        remarks: info.remarks,
        status: info.status
      }

      setTimeout(function() {
        that.form.setFieldsValue(formParams)
      })
      that.username = info.username
    },
    // handler
    handleSubmit(e) {
      var that = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const submitData = values
          updateUser(that.$route.query.userId, submitData).then(res => {
            if (res.code === 0) {
              that.$message.success('修改成功')
              // that.$router.go(-1)
              that.goToUserList()
            }
          })
        }
      })
    },

    handleChange({ fileList }) {
      this.fileList = fileList
    },
    handleBack() {
      this.$router.go(-1)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    goToUserList() {
      this.$router.push({
        name: 'UserManagerList'
      })
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

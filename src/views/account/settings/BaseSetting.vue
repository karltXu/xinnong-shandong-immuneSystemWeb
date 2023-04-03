<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="原密码" :required="true">
            <a-input-password v-model="params.password" />
          </a-form-item>
          <a-form-item label="新密码" :required="true">
            <a-input-password v-model="params.newPassword" />
          </a-form-item>
          <a-form-item label="确认新密码" :required="true">
            <a-input-password v-model="params.confirmPassword" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSave" :loading="loading">保存</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import md5 from 'md5'
import { updatePassword } from '@/api/login'
import { message } from 'ant-design-vue'

export default {
  data() {
    return {
      params: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      loading: false
    }
  },
  methods: {
    handleSave() {
      if (this.params.newPassword !== this.params.confirmPassword) {
        this.$message.error('两次新密码输入不一致')
        return
      }
      if (this.params.newPassword.length < 8) {
        this.$message.warning('密码不能少于8个字符')
        return
      }
      this.loading = true
      const params = {
        oldPassword: md5(this.params.password),
        newPassword: md5(this.params.newPassword)
      }
      updatePassword(params).then(res => {
        this.loading = false
        if (res.code === 0) {
          message.success('密码修改成功')
          this.params.password = ''
          this.params.newPassword = ''
          this.params.confirmPassword = ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>

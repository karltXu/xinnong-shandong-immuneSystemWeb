<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="ID" prop="itemId">
          <a-input v-model="form.itemId" disabled />
        </a-form-model-item>
        <a-form-model-item label="套餐名称" prop="title">
          <a-input v-model="form.title" />
        </a-form-model-item>

        <a-form-model-item label="套餐价格(元)" prop="price">
          <a-input v-model="form.price" />
        </a-form-model-item>
        <a-form-model-item label="套餐可用期限(月)" prop="period">
          <a-input v-model="form.period" />
        </a-form-model-item>
        <a-form-model-item label="赠送专家服务次数" prop="freeExpertService">
          <a-input v-model="form.freeExpertService" />
        </a-form-model-item>

        <a-form-model-item label="可订阅数量" prop="plantSubscriptionLimit">
          <a-input v-model="form.plantSubscriptionLimit" />
        </a-form-model-item>
        <a-form-model-item label="编码" prop="code">
          <a-input v-model="form.code" disabled />
        </a-form-model-item>

        <a-form-model-item label="套餐简介" prop="description">
          <a-input v-model="form.description" type="textarea" />
        </a-form-model-item>

        <a-form-model-item label="是否可用" prop="enabled">
          <a-switch v-model="form.enabled" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button type="primary" @click="onSubmit" :loading="saveLoading">
            保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="goBack">
            返回
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getVIPDetail, VIPUpdate } from '@/api/package'
import { message } from 'ant-design-vue'

export default {
  name: 'VIPDetail',
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      loading: false,
      form: {},
      rules: {
        title: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入套餐价格', trigger: 'blur' }],
        period: [{ required: true, message: '请输入套餐可用期限', trigger: 'blur' }],
        freeExpertService: [{ required: true, message: '请输入赠送专家服务次数', trigger: 'blur' }],
        plantSubscriptionLimit: [{ required: true, message: '请输入可订阅数量', trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  mounted() {
    console.log('this.$route.params.id: ', this.$route.params.id)
    getVIPDetail(this.$route.params.id).then(res => {
      this.form = res.data.servicePlan
      this.form.price = this.priceFilter(this.form.price)
      this.form.enabled = this.form.enabled === 1
    })
  },
  methods: {
    priceFilter(type) {
      const interger = parseInt(type / 100)
      const float = type % 100
      return interger + '.' + (float < 10 ? '0' + float : float)
    },
    goBack() {
      this.$router.push({
        name: 'packageVIPList',
        params: {
          pageNumber: this.$route.params.pageNumber,
          pageSize: this.$route.params.pageSize
        }
      })
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 更新
          this.saveLoading = true
          this.form.price = this.form.price * 100
          this.form.enabled = this.form.enabled ? 1 : 0
          VIPUpdate(this.form).then(res => {
            this.saveLoading = false
            if (res.code === 0) {
              message.success('修改成功')
              this.goBack()
            }
          })
        } else {
          message.warning('请先填写完整再提交哦！')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less"></style>

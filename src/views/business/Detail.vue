<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="商家ID" prop="id">
          <a-input v-model="form.id" disabled />
        </a-form-model-item>
        <a-form-model-item label="商家名字" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="商家类型" prop="category">
          <a-radio-group v-model="form.category">
            <a-radio value="MANUFACTURER">
              药企
            </a-radio>
            <a-radio value="COMMON">
              动保产品销售商家
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="药品经营范围" prop="category">
          <!-- <a-form-model-item label="药品经营范围" prop="category" v-show="form.category === 'MANUFACTURER'"> -->
          <a-select
            mode="multiple"
            label-in-value
            :value="value"
            placeholder="选择药品"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchDrug"
            @change="handleSelectChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in data" :key="item.name" :value="item.id">
              {{ item.name }}<span style="color: #bbb;" v-if="item.contentSpecification"> - {{ item.contentSpecification }}</span>
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="商家店面照">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
          >
            <img v-if="form.imageURL" :src="form.imageURL" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="商家简介" prop="description">
          <a-input v-model="form.description" type="textarea" />
        </a-form-model-item>
        <a-form-model-item label="商家地址" prop="address">
          <a-input v-model="form.address" />
        </a-form-model-item>
        <a-form-model-item label="商家电话" prop="phone">
          <a-input v-model="form.phone" />
        </a-form-model-item>

        <a-form-model-item label="选择位置" prop="pos">
          <Map @mapdata="saveMapData" :lng="form.longitude" :lat="form.latitude"></Map>
        </a-form-model-item>

        <a-form-model-item label="商家经度" prop="longitude">
          <a-input v-model="form.longitude" @change="addChange" />
        </a-form-model-item>
        <a-form-model-item label="商家纬度" prop="latitude">
          <a-input v-model="form.latitude" @change="addChange" />
        </a-form-model-item>

        <!-- <a-form-model-item label="商家详情" prop="detail">
          <a-input v-model="form.detail" type="textarea" />
        </a-form-model-item> -->
        <a-form-model-item label="商家详情" prop="detail">
          <TEditor v-model="form.detail"></TEditor>
        </a-form-model-item>

        <a-form-model-item label="创建时间" prop="createdAt">
          <a-date-picker v-model="form.createdAt" show-time type="date" style="width: 100%;" disabled />
        </a-form-model-item>
        <a-form-model-item label="上次更新时间" prop="updatedAt">
          <a-date-picker v-model="form.updatedAt" show-time type="date" style="width: 100%;" disabled />
        </a-form-model-item>

        <a-form-model-item label="商家是否可用" prop="disabled">
          <a-radio-group v-model="form.disabled">
            <a-radio :value="0">
              正常
            </a-radio>
            <a-radio :value="1">
              禁用
            </a-radio>
          </a-radio-group>
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
import { UpdateBusiness } from '@/api/business'
import mixin from './mixin'
import { message } from 'ant-design-vue'

export default {
  name: 'BusinessDetail',
  mixins: [mixin],
  data() {
    return {

    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'businessList',
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
          const param = {
            ...this.form
          }
          param.drugIds = this.value.map(item => item.key)
          // if (this.form.category === 'MANUFACTURER') {
          // } else {
          //   param.drugIds = []
          // }
          param.drugs = null
          UpdateBusiness(param).then(res => {
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
<style lang="less">
#map {
  width: 700px;
  height: 600px;
}
#editor {
  width: 700px;
}
.avatar-uploader .ant-upload.ant-upload-select-picture-card {
  height: 100px;
}
.img {
  width: 100px;
}
</style>

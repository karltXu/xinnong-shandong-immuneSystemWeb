<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
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
        <!-- <a-form-model-item label="经营范围" prop="scope" v-show="form.category === 'MANUFACTURER'">
          <a-input v-model="form.scope" />
        </a-form-model-item> -->
        <a-form-model-item label="药品经营范围" prop="category">
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
        <a-form-model-item label="商家logo图片" prop="imageURL">
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
          <Map @mapdata="saveMapData"></Map>
        </a-form-model-item>
        <a-form-model-item label="商家经度" prop="longitude">
          <a-input v-model="form.longitude" />
        </a-form-model-item>
        <a-form-model-item label="商家纬度" prop="latitude">
          <a-input v-model="form.latitude" />
        </a-form-model-item>

        <!-- <a-form-model-item label="商家详情" prop="detail">
          <a-input v-model="form.detail" type="textarea" />
        </a-form-model-item> -->

        <a-form-model-item label="商家详情" prop="detail">
          <TEditor v-model="form.detail"></TEditor>
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <a-button type="primary" @click="onSubmit" :loading="saveLoading">
            保存
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            重置
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { CreateBusiness } from '@/api/business'
import { message } from 'ant-design-vue'
import mixin from './mixin'

export default {
  name: 'BusinessNew',
  mixins: [mixin],
  data() {
    return {

    }
  },
  methods: {
    onSubmit() {
      this.saveLoading = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //  新建
          const param = {
            ...this.form
          }
          param.drugIds = this.value.map(item => item.key)
          // if (this.form.category === 'MANUFACTURER') {
          // } else {
          //   param.drugIds = []
          // }
          CreateBusiness(param).then(res => {
            if (res.code === 0) {
              message.success('新建商家成功')
              this.$router.push({
                name: 'businessList'
              })
            }
          })
        } else {
          this.saveLoading = false
          message.warning('请先填写完整再提交哦！')
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
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
.city_content_medium {
  line-height: normal;
}
.citylist_popup_main .city_content_top {
  line-height: normal;
  height: 41px !important;
}
</style>

<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="解剖机构名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="负责人/法人" prop="principal">
          <a-input v-model="form.principal" />
        </a-form-model-item>
        <a-form-model-item label="联系人姓名" prop="contact">
          <a-input v-model="form.contact" />
        </a-form-model-item>

        <a-form-model-item label="联系人电话" prop="phone">
          <a-input style="width: 80%;margin-right: 10px;" v-model="form.phone" />
          <a-tag color="cyan">
            <small> 用于登录账号</small>
          </a-tag>
        </a-form-model-item>

        <a-form-model-item label="宣传照" prop="introImageUrls">
          <a-upload
            name="intro"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload1"
          >
            <img v-if="form.introImageUrls" :src="form.introImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(1)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="营业执照" prop="licenseImageUrls">
          <a-upload
            name="license"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload2"
          >
            <img v-if="form.licenseImageUrls" :src="form.licenseImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(2)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="执业兽医师资格证" prop="certImgUrls">
          <a-upload
            name="cert"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload3"
          >
            <img v-if="form.certImageUrls" :src="form.certImageUrls" alt="logo" class="img" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(3)">放大查看</a>
        </a-form-model-item>
        <a-form-model-item label="团队人数" prop="personNumber">
          <a-input-number v-model="form.personNumber" :min="1" :max="100000" />
        </a-form-model-item>
        <a-form-model-item label="营业地址" prop="address">
          <a-input v-model="form.address" />
        </a-form-model-item>
        <a-form-model-item label="选择位置" prop="pos">
          <Map ref="map" @mapdata="saveMapData" :lng="form.longitude" :lat="form.latitude"></Map>
        </a-form-model-item>

        <a-form-model-item label="经度" prop="longitude">
          <a-input v-model="form.longitude" @change="addChange" />
        </a-form-model-item>
        <a-form-model-item label="纬度" prop="latitude">
          <a-input v-model="form.latitude" @change="addChange" />
        </a-form-model-item>

        <a-form-model-item label="执业年限" prop="workingAge">
          <a-input-number id="inputNumber" v-model="form.workingAge" :min="0" :max="100" />
        </a-form-model-item>

        <a-form-model-item label="擅长服务的动物种类" prop="goodAtAnimalIds">
          <a-select mode="multiple" style="width: 100%" v-model="form.goodAtAnimalIds">
            <a-select-option v-for="item in animalNameOptions" :key="item.animalID">
              {{ item.animalName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="展示状态" prop="archived">
          <a-radio-group v-model="form.archived">
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
import { getAgencyDetail, UpdateAgency } from '@/api/agency'
import { getStsConfig, clientConstrctor } from '@/api/oss'
import { message } from 'ant-design-vue'
import mixin from './mixin'

export default {
  name: 'AgencyDetail',
  mixins: [mixin],
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loading: false,
      form: {
        name: ''
      },
      client: {},
      saveLoading: false,
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  created() {
    // 获取oss参数
    getStsConfig().then(res => {
      const { bucket, region, stsToken } = res.data
      this.client = clientConstrctor(bucket, region, stsToken)
    })
    this.getOption()
  },
  mounted() {
    getAgencyDetail(this.$route.params.id).then(res => {
      this.form = res.data.agency
    })
  },
  methods: {
    goBack() {
      this.$router.push({
        name: 'agencyList',
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
          UpdateAgency(param).then(res => {
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
    },
    addChange() {
      if (this.form.latitude && this.form.longitude) {
        this.$refs.map.initMap()
      }
    }
  }
}
</script>
<style lang="less">
#map {
  width: 700px;
  height: 600px;
}
.avatar-uploader .ant-upload.ant-upload-select-picture-card {
  height: 100px;
}
.img {
  width: 100px;
}
</style>

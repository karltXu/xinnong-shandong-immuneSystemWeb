<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >

        <a-form-model-item
          label="药品通用名称"
          prop="genericName"
        >
          <a-input v-model="form.genericName" />
        </a-form-model-item>
        <a-form-model-item
          label="药品名称"
          prop="name"
        >
          <a-input v-model="form.name" />
        </a-form-model-item>
        <!-- <a-form-model-item label="外观图片">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :customRequest="ossUpload"
          >
            <img
              v-if="form.imageUrl"
              :src="form.imageUrl"
              alt="logo"
              class="img"
            />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <a @click="checkBig(1)">放大查看</a>
        </a-form-model-item> -->
        <a-form-model-item
          label="包装规格"
          prop="package1Name"
        >
          <a-input-number v-model="form.package1Number" :min="1" :max="100000" :default-value="1" :disabled="true" />
          <a-select style="width: 100px" v-model="form.package1Name">
            <a-select-option v-for="(item,index) in package1Options" :value="item" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>

          <a-input-number v-model="form.package2Number" :min="0" :max="100000" style="margin-left: 10px;" />
          <a-select style="width: 100px" v-model="form.package2Name" @change="handleSelect2">
            <a-select-option value="">
              无
            </a-select-option>
            <a-select-option v-for="(item,index) in package2Options" :value="item" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>

          <a-input-number v-model="form.package3Number" :min="0" :max="100000" style="margin-left: 10px;" />
          <a-select style="width: 100px" v-model="form.package3Name" @change="handleSelect3">
            <a-select-option value="">
              无
            </a-select-option>
            <a-select-option v-for="(item,index) in package3Options" :value="item" :key="index">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="含量规格"
          prop="contentSpecification"
        >
          <a-input v-model="form.contentSpecification" />
        </a-form-model-item>
        <a-form-model-item
          label="生产企业"
          prop="manufacture"
        >
          <a-input v-model="form.manufacture" />
        </a-form-model-item>

        <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
          <!-- <a-button
            type="primary"
            @click="onSubmit"
            :loading="saveLoading"
          >
            保存
          </a-button> -->
          <a-button
            style="margin-left: 10px;"
            @click="goBack"
          >
            返回
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import mixin from './mixin'
import { getDrugDetail, UpdateDrug } from '@/api/drug'
import { message } from 'ant-design-vue'

export default {
    name: 'DrugDetail',
    data() {
        return {

        }
    },
    mixins: [mixin],
    mounted() {
        this.init()
    },
    methods: {
        init () {
          getDrugDetail(this.$route.params.id).then((res) => {
            this.form = res.data.drug
        })
        },
        goBack() {
          if (this.$route.params.pageNumber) {
            this.$router.push({
                name: 'drugList',
                params: {
                    pageNumber: this.$route.params.pageNumber,
                    pageSize: this.$route.params.pageSize
                }
            })
          } else {
            this.$router.go(-1)
          }
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // 更新
                    if (!this.form.package2Name && this.form.package2Number) {
                      message.warning('单位是无，不能有值哟！')
                      return
                    }
                    if (this.form.package2Name && !this.form.package2Number) {
                      message.warning('有单位的时候，值不能为0哦！')
                      return
                    }
                    if (!this.form.package3Name && this.form.package3Number) {
                      message.warning('单位是无，不能有值哟！')
                      return
                    }
                    if (this.form.package3Name && !this.form.package3Number) {
                      message.warning('有单位的时候，值不能为0哦！')
                      return
                    }

                    const param = {
                        ...this.form
                    }
                    UpdateDrug(param).then((res) => {
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
        handleSelect2(v) {
          if (!v) {
            this.form.package2Number = 0
          }
        },
        handleSelect3(v) {
           if (!v) {
            this.form.package3Number = 0
          }
        }
    }
}
</script>
<style lang="less" scoped scoped>

.img {
    width: 100px;
}
</style>

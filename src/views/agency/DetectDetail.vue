<template>
  <a-card :bordered="false">
    <p style="font-size: 26px;font-weight: 600;color: #108ee9;">{{ name }}</p>
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="动物/标准库检测项目" prop="examinationId">
        <a-select
          placeholder="请选择动物"
          style="width: 100px"
          @change="getExaminationByAnimal"
          :defaultValue="form.animal.animalID"
        >
          <a-select-option
            v-for="item in animalOptions"
            :key="item.animalID"
            :value="item.animalID"
          >
            {{ item.animalName }}
          </a-select-option>
        </a-select>

        <a-select
          show-search
          option-filter-prop="children"
          :filter-option="filterOption"
          v-model="form.examinationId"
          style="width: 300px;margin-left: 10px;"
        >
          <a-select-option v-for="item in examinationOptions" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="机构检测项目" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <!-- <a-form-model-item label="检测类型" prop="itemName">
        <a-input v-model="form.itemName" />
      </a-form-model-item> -->
      <a-form-model-item label="检测方法" prop="method">
        <!-- <a-input v-model="form.method" /> -->
        <a-select placeholder="请选择检测方法" v-model="form.method">
          <a-select-option v-for="(item, index) in examOptions" :key="index" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item label="单价" prop="cost">
        <a-input-number v-model="form.cost" :min="1" :max="100000" /> 元
      </a-form-model-item>

      <a-form-model-item label="采样说明" prop="introduction">
        <a-textarea :rows="5" :minRows="5" :maxRows="10" v-model="form.introduction" />
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remarks">
        <a-textarea :rows="5" :minRows="5" :maxRows="10" v-model="form.remarks" />
      </a-form-model-item>

      <!-- <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
        <a-button type="primary" @click="onSubmit" :loading="saveLoading">
          保存
        </a-button>
        <a-button style="margin-left: 10px;" @click="onCancle">
          取消
        </a-button>
      </a-form-model-item> -->
    </a-form-model>
  </a-card>

</template>
<script>
import { UpdateItem } from '@/api/agency'
import { message } from 'ant-design-vue'
import mixin from './DetectMixin'

export default {
  name: 'DetectDetail',
  mixins: [mixin],
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          animal: {
            animalName: '',
            animalID: 0
          },
          examination: {
            name: ''
          }
        }
      }
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      loading: false,
      saveLoading: false,
      examinationId: ''
    }
  },
  created() {

  },
  mounted() {
    setTimeout(() => {
      this.getExaminationByAnimal(this.form.animal.animalID)
    }, 500)
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 更新
          const param = {
            ...this.form
          }
          UpdateItem(param).then(res => {
            if (res.code === 0) {
              message.success('修改成功')
              this.$emit('success')
            }
          })
        } else {
          message.warning('请先填写完整再提交哦！')
          return false
        }
      })
    },
    onCancle() {

    }
  }
}
</script>
<style lang="less" scoped>
.note {
  position: absolute;
  left: 180px;
  color: #c41d7f;
}
</style>

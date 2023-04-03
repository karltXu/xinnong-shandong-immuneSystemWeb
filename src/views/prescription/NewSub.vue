<template>
  <a-card :bordered="false">
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="处方名称"
        prop="name"
      >
        <a-input v-model="form.name" style="width: 500px;" />
      </a-form-model-item>

      <a-form-model-item
        label="药品列表"
        prop="selectedDrugList"
      >
        <a-button type="primary" @click="handleAddDrug" style="margin-bottom: 20px;">
          添加药品
        </a-button>
        <table border="1" cellpadding="10" width="100%">
          <thead>
            <th>药品名称</th>
            <th>用法</th>
            <th>用药频率</th>
            <th>单次剂量</th>
            <th>开药量</th>
            <th style="width: 90px;">含量规格</th>
            <th style="width: 90px;">包装规格</th>
            <th style="width: 120px;">备注</th>
            <th style="width: 75px;">操作</th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in selectedDrugList" :key="item.id + '-' + index">
              <td>
                <a-select
                  show-search
                  :value="selectedDrugList[index].name"
                  placeholder="请输入要搜索的药品名称"
                  style="min-width: 220px"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  :dropdownMatchSelectWidth="false"
                  @search="handleSearch($event, index)"
                  @change="handleChange($event, index)"
                >
                  <a-select-option v-for="d in drugData" :key="d.id">
                    {{ d.name }}<span style="color: #bbb;" v-if="d.contentSpecification"> - {{ d.contentSpecification }}</span>
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-select style="min-width: 80px" v-model="item.method" :dropdownMatchSelectWidth="false">
                  <a-select-option v-for="(item1, index1) in usageMethodOptions" :value="item1" :key="index1">
                    {{ item1 }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-select style="min-width: 100px" v-model="item.frequency" :dropdownMatchSelectWidth="false">
                  <a-select-option v-for="(item2, index2) in usageFrequencyOptions" :value="item2" :key="index2">
                    {{ item2 }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number
                  v-model="item.single"
                  :min="1"
                  :max="100000"
                  :default-value="1"
                  style="min-width: 50px;width: 40%"
                />
                <!-- &nbsp; {{ searching[index] ? '' : getSingleMount(index) }} -->
                <a-select style="min-width: 70px;width: 60%" v-model="item.singleDosageName" :dropdownMatchSelectWidth="false">
                  <a-select-option v-for="(item3, index3) in package2Options" :value="item3" :key="index3">
                    {{ item3 }}
                  </a-select-option>
                </a-select>
              </td>
              <td>
                <a-input-number
                  v-model="item.package1"
                  :min="1"
                  :max="100000"
                  :default-value="1"
                  style="min-width: 50px;width: 40%"
                />
                <!-- &nbsp; {{ searching[index] ? '' : getAllMount(index) }} -->
                <a-select style="min-width: 70px;width: 60%" v-model="item.packageXName" :dropdownMatchSelectWidth="false">
                  <a-select-option v-for="(item4, index4) in packageOptions" :value="item4" :key="index4">
                    {{ item4 }}
                  </a-select-option>
                </a-select>
              </td>
              <td>{{ searching[index] ? '' : getContent(index) }}</td>
              <td>{{ searching[index] ? '' : getPack(index) }}</td>
              <td><a-textarea v-model="item.remarks" /></td>
              <td>
                <a-button type="primary" size="small" @click="handleDrugDetail(item.id)">
                  查看
                </a-button>&nbsp;
                <a-button type="danger" size="small" @click="handleDeleteDrug(index)">
                  删除
                </a-button>
              </td>
            </tr>
          </tbody>
        </table>
      </a-form-model-item>
      <a-form-model-item
        label="医嘱"
        prop="remarks"
      >
        <a-textarea :rows="4" v-model="form.remarks" />
      </a-form-model-item>

      <slot></slot>
    </a-form-model>
    <a-modal
      title="药品详情"
      width="50%"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleOk"
    >
      <DetailDrug :id="id"></DetailDrug>
    </a-modal>
  </a-card>
</template>
<script>
import mixin from './mixin'
import DetailDrug from './component/DetailDrug.vue'
import { message } from 'ant-design-vue'
import { CreatePrescription } from '@/api/prescription'

export default {
    name: 'PrescriptionNewSub',
    data() {
        return {

        }
    },
    props: {
      type: {
        type: String,
        default: ''
      }
    },
    mixins: [mixin],
    components: {
      DetailDrug
    },
    methods: {
      onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    //  新建
                    const drugs = []
                     this.selectedDrugList.forEach(item => {
                       if (item.id) {
                          drugs.push({
                            drugId: item.id,
                            usageMethod: item.method,
                            usageFrequency: item.frequency,
                            package1Amount: item.package1,
                            singleDosage: item.single,
                            singleDosageName: item.singleDosageName,
                            packageXName: item.packageXName,
                            remarks: item.remarks || ''
                          })
                       }
                     })
                    const param = {
                        ...this.form,
                        prescriptionDrugs: drugs
                    }
                    if (this.type === 'private') {
                      this.$emit('onSubmit', param)
                    } else {
                      CreatePrescription(param)
                          .then((res) => {
                              if (res.code === 0 && this.type === 'private') {
                                this.$emit('onSubmit', res.data.prescription.id)
                              } else if (res.code === 0) {
                                  message.success('新增处方成功')
                                  this.$router.push({
                                      name: 'prescriptionList'
                                  })
                              }
                          })
                          .catch((res) => {
                              this.$emit('setSaveLoading', false)
                          })
                    }
                } else {
                    this.$emit('setSaveLoading', false)
                    this.$emit('onSubmit', 'error')
                    message.warning('请先填写完整再提交哦！')
                }
            })
        },
        resetForm() {
            this.$emit('setSaveLoading', false)
            this.$refs.ruleForm.resetFields()
            this.selectedDrugList = [1]
        }
    }
}
</script>
<style lang="less" scoped>

</style>

<template>
  <div>
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
          <a-input
            v-model="form.name"
            style="width: 500px;"
          />
        </a-form-model-item>

        <a-form-model-item
          label="药品列表"
          prop="selectedDrugList"
        >
          <a-button
            type="primary"
            @click="handleAddDrug"
          >
            添加药品
          </a-button>
          <table
            border="1"
            cellpadding="10"
            width="100%"
          >
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
              <tr
                v-for="(item,index) in selectedDrugList"
                :key="item.id + '-' + index"
              >
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
                    <a-select-option
                      v-for="d in drugData"
                      :key="d.id"
                    >
                      {{ d.name }}<span style="color: #bbb;" v-if="d.contentSpecification"> - {{ d.contentSpecification }}</span>
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    style="min-width: 80px"
                    v-model="item.usageMethod"
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option
                      v-for="(item1, index1) in usageMethodOptions"
                      :value="item1"
                      :key="index1"
                    >
                      {{ item1 }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-select
                    style="min-width: 100px"
                    v-model="item.usageFrequency"
                    :dropdownMatchSelectWidth="false"
                  >
                    <a-select-option
                      v-for="(item2, index2) in usageFrequencyOptions"
                      :value="item2"
                      :key="index2"
                    >
                      {{ item2 }}
                    </a-select-option>
                  </a-select>
                </td>
                <td>
                  <a-input-number
                    v-model="item.singleDosage"
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
                    v-model="item.package1Amount"
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
                  <a-button
                    type="primary"
                    size="small"
                    @click="handleDrugDetail(item.id)"
                  >
                    查看
                  </a-button>&nbsp;
                  <a-button
                    type="danger"
                    size="small"
                    @click="handleDeleteDrug(index)"
                  >
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
          <a-textarea
            :rows="4"
            v-model="form.remarks"
          />
        </a-form-model-item>

        <slot></slot>
      </a-form-model>
    </a-card>
    <a-modal
      title="药品详情"
      width="50%"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleOk"
    >
      <DetailDrug :id="id"></DetailDrug>
    </a-modal>
  </div>
</template>
<script>
import mixin from './mixin'
import { getPrescriptionDetail, UpdatePrescription } from '@/api/prescription'
import { message } from 'ant-design-vue'
import DetailDrug from './component/DetailDrug.vue'

export default {
    name: 'PresciptionDetail',
    data() {
        return {}
    },
    props: {
      type: {
        type: String,
        default: ''
      },
      propid: {
        type: Number,
        default: 0
      }
    },
    mixins: [mixin],
    components: {
        DetailDrug
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let paramid = this.$route.params.id
            if (this.type === 'private') {
              paramid = this.propid
            }
            getPrescriptionDetail(paramid).then((res) => {
                this.form = res.data.prescription
                this.selectedDrugList = res.data.prescription.prescriptionDrugs
                this.selectedDrugList.forEach((item, i) => {
                    delete item.id
                    Object.assign(item, item.drug)
                    this.drugValue.push(item.drug.name)
                    this.searching[i] = false
                })
            })
        },
        onSubmit() {
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    // 更新
                    const drugs = []
                    this.selectedDrugList.forEach((item) => {
                        if (item.id) {
                            drugs.push({
                                drugId: item.id,
                                usageMethod: item.usageMethod,
                                usageFrequency: item.usageFrequency,
                                package1Amount: item.package1Amount,
                                singleDosage: item.singleDosage,
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
                      UpdatePrescription(param).then((res) => {
                          if (res.code === 0) {
                              message.success('修改成功')
                              this.goBack()
                          }
                      })
                    }
                } else {
                    message.warning('请先填写完整再提交哦！')
                    this.$emit('onSubmit', 'error')
                    return false
                }
            })
            this.$emit('setSaveLoading', false)
        },
        goBack() {
            if (this.$route.params.pageNumber) {
                this.$router.push({
                    name: 'prescriptionList',
                    params: {
                        pageNumber: this.$route.params.pageNumber,
                        pageSize: this.$route.params.pageSize
                    }
                })
            } else {
                this.$router.go(-1)
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

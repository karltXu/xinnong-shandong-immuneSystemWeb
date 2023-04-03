<template>
  <a-card :bordered="false">
    <a-form-model
      ref="ruleForm"
      :model="form"
      layout="vertical"
      :rules="rules"
      style="height: calc(100vh - 220px); overflow: auto;"
    >
      <a-form-model-item
        label="主诉"
        prop="chiefComplaint"
      >
        <a-input v-model="form.chiefComplaint" />
      </a-form-model-item>
      <a-form-model-item
        label="症状"
        prop="symptoms"
      >
        <a-textarea
          :rows="5"
          v-model="form.symptoms"
        />
      </a-form-model-item>

      <a-form-model-item
        label="剖检"
        prop="physicalExamination"
      >
        <a-input v-model="form.physicalExamination" />
      </a-form-model-item>
      <a-form-model-item
        label="试剂检测及实验室检测"
        prop="auxiliaryExamination"
      >
        <a-input v-model="form.auxiliaryExamination" />
      </a-form-model-item>
      <a-form-model-item
        label="诊断结果"
        prop="result"
      >
        <a-textarea
          :rows="5"
          v-model="form.result"
        />
      </a-form-model-item>
      <a-form-model-item
        label="处方"
        prop="prescriptionIds"
      >
        <a-select
          show-search
          :value="searchValue"
          placeholder="请输入要搜索的处方名称"
          style="width: 250px;margin-right: 10px;"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch"
          @change="handleChange"
        >
          <a-select-option
            v-for="d in priscriptionList"
            :key="d.name"
          >
            {{ d.name }}
          </a-select-option>
        </a-select>
        <a-button
          type="primary"
          @click="handleAddPrescription2"
        >
          自动导入处方
        </a-button>
        <a-button
          style="margin-left: 10px;"
          type="danger"
          @click="handleAddPrescriptionManual"
        >
          手动录入处方
        </a-button>
        <div
          class="new-list"
          v-for="(item,index) in manualList"
          :key="item"
        >
          <a-button
            v-if="item < 1"
            type="danger"
            ghost
            @click="handleDeletePrescriptionManual(index)"
            style="width: 10%; margin: 30px 0 6px 0;"
          >删除</a-button>
          <a-button
            v-else
            type="primary"
            ghost
            @click="handleDeletePrescriptionManual(index)"
            style="width: 10%; margin: 30px 0 6px 0;"
          >删除</a-button>
          <PrescriptionNew
            v-if="item < 1"
            ref="prescription"
            style="border: 1px solid #ff4d4f;width: 100%;"
            type="private"
            @onSubmit="onSubmitNew"
          ></PrescriptionNew>
          <PrescriptionDetail
            v-else
            ref="prescription"
            style="border: 1px solid #52c41a;width: 100%;"
            type="private"
            :propid="item"
            @onSubmit="onSubmitNew"
          ></PrescriptionDetail>
        </div>
        <!-- <div v-for="(item, index) in addList" :key="item" style="display: flex;">
          <PrescriptionDetail :id="item"></PrescriptionDetail>
          <a-button type="link" @click="handleDeletePrescription(index)" style="width: 10%; margin-top: 30px;">删除</a-button>
        </div> -->
      </a-form-model-item>

      <!-- <a-form-model-item
        label="说明（修正病历）"
        prop="content"
      >
        <a-textarea
          :rows="5"
          v-model="form.content"
        />
      </a-form-model-item> -->
    </a-form-model>
    <!-- <div style="text-align: center; padding-top: 30px; border-top: 1px solid #ddd;">
      <a-button
        type="primary"
        @click="onSubmit"
        :loading="saveLoading"
      >
        保存病历
      </a-button>
    </div> -->
  </a-card>
</template>

<script>
import { getPrescriptionList, CreatePrescriptionBatch } from '@/api/prescription'
import { CreateCase } from '@/api/case'
import { message } from 'ant-design-vue'
// import PrescriptionDetail from './prescriptionDetail.vue'
import PrescriptionNew from '../../prescription/NewSub.vue'
import PrescriptionDetail from '../../prescription/DetailSub.vue'

export default {
    name: 'CaseNew',
    data() {
        return {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
            form: {
                chiefComplaint: this.ducg?.chiefComplaint,
                symptoms: this.ducg && this.ducg.generalInformation + '；' + this.ducg.medicalRecord,
                result: this.ducg?.diagnosisResult
                    .map((item, index) => {
                        return index + 1 + '.' + item.diseaseName + '(' + item.probability + ')'
                    })
                    .join(' '),
                physicalExamination: '无',
                auxiliaryExamination: '无'

            },
            rules: {
                chiefComplaint: [{ required: true, message: '不能为空哦', trigger: 'blur' }],
                symptoms: [{ required: true, message: '不能为空哦', trigger: 'blur' }],
                physicalExamination: [{ required: true, message: '不能为空哦', trigger: 'blur' }],
                auxiliaryExamination: [{ required: true, message: '不能为空哦', trigger: 'blur' }],
                result: [{ required: true, message: '不能为空哦', trigger: 'blur' }]
            },
            saveLoading: false,
            priscriptionList: [],
            selectedPriscriptionId: 0,
            addList: [],
            searchValue: [],
            manualList: [],
            manualListIds: [],
            flag: false
        }
    },
    components: {
        PrescriptionDetail,
        PrescriptionNew
    },
    props: {
        id: {
            type: Number,
            default: 0
        },
        ducg: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        onSubmit() {
            this.saveLoading = true
            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    this.onSubmitEach()
                    // 可以不添加药品
                    // if (this.manualListIds.length < 1) {
                    //     message.warning('请增加处方哦～')
                    //     return
                    // }
                    console.log(333, this.flag)
                    if (this.flag) {
                        return false
                    } else {
                        // 批量创建处方
                        CreatePrescriptionBatch({
                            prescriptions: this.manualListIds
                        }).then((res) => {
                            if (res.code === 0) {
                                //  新建
                                const param = {
                                    ...this.form,
                                    prescriptionIds: res.data.prescriptionIds,
                                    consultationId: this.id
                                }
                                CreateCase(param)
                                    .then((res) => {
                                        if (res.code === 0) {
                                            message.success('新增病历成功')
                                            this.$emit('close', res.data.case.id)
                                        }
                                    })
                                    .catch((res) => {
                                        this.saveLoading = false
                                    })
                            }
                        })
                    }
                } else {
                    message.warning('请先填写完整再提交哦！')
                }
            })
            this.saveLoading = false
        },
        handleDeletePrescription(i) {
            this.addList.splice(i, 1)
        },
        handleDeletePrescriptionManual(i) {
            this.manualList.splice(i, 1)
        },
        handleSearch(value) {
            getPrescriptionList({ name: value }).then((res) => {
                this.priscriptionList = res.data.prescriptions
            })
        },
        handleChange(value) {
            this.searchValue = value
            getPrescriptionList({ name: value }).then((res) => {
                const data = res.data.prescriptions
                this.priscriptionList = data
                this.selectedPriscriptionId = data[0].id
            })
        },
        handleAddPrescription() {
            if (this.selectedPriscriptionId && !this.addList.includes(this.selectedPriscriptionId)) {
                this.addList.push(this.selectedPriscriptionId)
            } else if (this.addList.includes(this.selectedPriscriptionId)) {
                message.warning('不能重复添加一个处方哦～')
            } else {
                message.warning('请先选择一个处方哦～')
            }
        },
        handleAddPrescription2() {
            if (this.selectedPriscriptionId && !this.manualList.includes(this.selectedPriscriptionId)) {
                this.manualList.push(this.selectedPriscriptionId)
            } else if (this.manualList.includes(this.selectedPriscriptionId)) {
                message.warning('不能重复添加一个处方哦～')
            } else {
                message.warning('请先选择一个处方哦～')
            }
        },
        handleAddPrescriptionManual() {
            this.manualList.push(Math.random())
        },
        onSubmitNew(v) {
            console.log('on submit 222', v)
            if (v === 'error') {
                this.flag = true
            } else {
                const ids = this.manualListIds.map(item => item.id)
                if (ids.includes(v.id)) {
                  this.manualListIds.forEach((item, index) => {
                    if (item.id === v.id) {
                      this.manualListIds.splice(index, 1)
                    }
                  })
                  this.manualListIds.push(v)
                } else {
                  this.manualListIds.push(v)
                }
            }
        },
        onSubmitEach() {
          this.flag = false
            for (let i = 0; i < this.manualList.length; i++) {
                this.$refs.prescription[i].onSubmit()
            }
        }
    }
}
</script>
<style lang="less" scoped>
.new-list {
    margin: 5px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
</style>

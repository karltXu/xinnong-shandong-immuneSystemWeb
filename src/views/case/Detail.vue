<template>
  <page-header-wrapper :title="false">
    <div>
      <div>
        <a-card :bordered="false">
          <a-descriptions
            title=""
            bordered
          >
            <a-descriptions-item label="病历ID">
              {{ detail.id }}
              <!-- <router-link :to="{ name: 'userDetail', params: { id: detail.userId } }">{{ detail.userId }}</router-link> -->
            </a-descriptions-item>

            <a-descriptions-item label="就诊时间">{{ detail.createdAt }}</a-descriptions-item>
            <a-descriptions-item label="专家诊断记录关联ID">
              <a @click="handleConDetail(detail.consultation.id)">{{ detail.consultation.id }}</a>
            </a-descriptions-item>
            <a-descriptions-item label="就诊用户">{{ detail.createdByAdminUserInfo.nickname }}</a-descriptions-item>
            <a-descriptions-item label="就诊动物">{{ detail.consultation.animal.animalName }}</a-descriptions-item>
            <a-descriptions-item label="会诊专家">{{ detail.consultation.expert.name }}</a-descriptions-item>
            <a-descriptions-item label="主诉">{{ detail.chiefComplaint }}</a-descriptions-item>
            <a-descriptions-item label="症状">{{ detail.symptoms }}</a-descriptions-item>
            <a-descriptions-item label="剖检">{{ detail.physicalExamination }}</a-descriptions-item>
            <a-descriptions-item label="试剂检测及实验室检测">{{ detail.auxiliaryExamination }}</a-descriptions-item>
            <a-descriptions-item
              label="诊断结果"
              :span="2"
            >
              <a-tag color="pink">{{ detail.result }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item
              label="处方"
              :span="3"
            >
              <div
                v-for="(item, index) in detail.prescriptions"
                :key="item.id"
              >
                <div style="color: #217d87;margin-bottom: 6px;"><b>{{ item.name }}：</b></div>
                <table
                  :border="1"
                  style="margin-bottom: 10px;"
                >
                  <thead>
                    <th style="width: 150px;">药品名称</th>
                    <th>用法</th>
                    <th>用药频率</th>
                    <th>单次剂量</th>
                    <th>开药量</th>
                    <th>备注</th>
                    <th>操作</th>
                  </thead>
                  <tbody>
                    <tr
                      v-for="drug in item.prescriptionDrugs"
                      :key="drug.id"
                    >
                      <td>{{ drug.drug.name }}</td>
                      <td>{{ drug.usageMethod }}</td>
                      <td>{{ drug.usageFrequency }}</td>
                      <!-- <td>{{ drug.singleDosage }} {{ getSingleMount(drug.drug) }}</td> -->
                      <td>{{ drug.singleDosage }} {{ drug.singleDosageName }}</td>
                      <!-- <td>{{ drug.package1Amount }} {{ getAllMount(drug.drug) }}</td> -->
                      <td>{{ drug.package1Amount }} {{ drug.packageXName }}</td>
                      <td>{{ drug.remarks || '-' }}</td>
                      <td>
                        <a-button
                          type="link"
                          @click="showDrugDetail(drug.drugId)"
                        >查看</a-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div :style="{'margin-bottom': index === detail.prescriptions.length -1 ? 0 : '20px'}">
                  <b>医嘱：</b>
                  <span>{{ item.remarks || '-' }}</span>
                </div>
              </div>
            </a-descriptions-item>
            <a-descriptions-item
              label="修正记录"
              :span="3"
            >
              <table :border="1" class="revision">
                <thead>
                  <th style="width: 30%;">修正时间</th>
                  <th>修正内容</th>
                </thead>
                <tbody>
                  <tr
                    v-for="item in detail.revisions"
                    :key="item.id"
                  >
                    <td>{{ item.createdAt }}</td>
                    <td>{{ item.content }}</td>
                  </tr>
                </tbody>
              </table>
            </a-descriptions-item>
            <a-descriptions-item
              label="说明（修正病历）"
              :span="3"
            >
              <a-textarea
                v-model="detail.content"
                placeholder="请输入您的指导意见"
                :auto-size="{ minRows: 3, maxRows: 6 }"
              />
              <a-button
                type="primary"
                size="small"
                @click="handleSave"
                style="margin-top: 10px;"
                :disabled="!isExpert"
              >
                修正
              </a-button>
            </a-descriptions-item>

          </a-descriptions>
          <a-divider style="margin-bottom: 20px" />
          <!-- <a-button
            type="primary"
            @click="handleSave"
            :disabled="detail.state === 'Done'"
          >
            保存
          </a-button> -->
          <a-button
            @click="goBack"
            style="marginLeft: 12px"
          >
            返回
          </a-button>
        </a-card>
      </div>
    </div>
    <a-modal
      title="药品详情"
      width="50%"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleOk"
    >
      <DetailDrug :id="id"></DetailDrug>
    </a-modal>
  </page-header-wrapper>
</template>
<script>
import { diagnoseResultMap2 } from '@/utils/constant'
import { getCaseDetail, UpdateCase } from '@/api/case'
import { message } from 'ant-design-vue'
import DetailDrug from '../prescription/component/DetailDrug.vue'

export default {
    name: 'Detail',
    data() {
        return {
            detail: {
                id: '',
                name: '',
                expert: {
                    name: ''
                },
                createdByAdminUserInfo: {
                    nickname: ''
                },
                animal: {
                    animalName: ''
                },
                ducg: {
                    diagnosisResult: ''
                },
                consultation: {
                  id: '',
                  animal: {
                    animalName: ''
                  },
                  expert: {
                    name: ''
                  }
                }
            },
            ducgUrl: '',
            visible: false,
            id: ''
        }
    },
    filters: {
        resultFilter(type) {
            return diagnoseResultMap2[type].text
        },
        resultTypeFilter(type) {
            return diagnoseResultMap2[type].status
        }
    },
    components: {
        DetailDrug
    },
    created() {
        this.init()
    },
    computed: {
        hasDetailPermission() {
            return this.$store.state.user.info.permissionList.includes('experts')
        },
        isExpert() {
            return this.$store.state.user.info.roleCode === 'BUILTIN_EXPERT'
        }
    },
    methods: {
        init() {
            getCaseDetail(this.$route.params.id).then((res) => {
                this.detail = res.data.case
                this.ducgUrl = res.data.ducgUrl
            })
        },
        goBack() {
            if (this.$route.query.from === 'other') {
              this.$router.go(-1)
            } else {
              this.$router.push({
                  name: 'caseList',
                  params: {
                      pageNumber: this.$route.params.pageNumber,
                      pageSize: this.$route.params.pageSize
                  }
              })
            }
        },
        handleAIDetail(id) {
            this.$router.push({
                name: 'diagnoseAIDetail',
                params: { id }
            })
        },
        handleConDetail(id) {
          this.$router.push({
            name: 'consultationDetail',
            params: { id }
          })
        },
        handleSave() {
          if (!this.detail.content) {
            message.error('修正内容不能为空哦')
            return
          }
            const param = {
                id: this.detail.id,
                content: this.detail.content
            }
            UpdateCase(param).then((res) => {
                if (res.code === 0) {
                    message.success('修正病历提交成功')
                    this.init()
                }
            })
        },
        getSingleMount(data) {
            if (data.package3Number !== 0) {
                return data.package3Name
            } else {
                return data.package2Name
            }
        },
        getAllMount(data) {
            return data.package1Name
        },
        showDrugDetail(id) {
            this.id = id
            this.visible = true
        },
        handleOk() {
            this.visible = false
        }
    }
}
</script>
<style lang="less" scoped>
/deep/.ant-descriptions-bordered .ant-descriptions-item-label {
    width: 180px !important;
}
table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
}
table td,
table th {
    border: 1px solid #cad9ea;
    color: #666;
    height: 30px;
}
table thead th {
    background-color: #cce8eb;
    width: 100px;
}
table tr:nth-child(odd) {
    background: #fff;
}
table tr:nth-child(even) {
    background: #f5fafa;
}
.revision {
  td,th {
    color: rgb(95, 74, 121);
    border: 1px solid rgb(226, 221, 233);;
  }
  thead th {
    background-color: rgb(135, 115, 159);
    width: 100px;
    color: #f5fafa;
  }
  tr:nth-child(odd) {
      background: #fff;
  }
  tr:nth-child(even) {
      background: rgb(229, 226, 234);
  }
}
</style>

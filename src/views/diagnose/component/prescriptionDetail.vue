<template>
  <a-card :bordered="false">
    <a-descriptions
      title=""
      :column="1"
      bordered
      size="small"
    >
      <a-descriptions-item label="处方名称">
        {{ detail.name }}
      </a-descriptions-item>
      <a-descriptions-item label="药品列表">
        <table border="1" style="text-align:center;">
          <thead>
            <th style="width: 70px;">药品名称</th>
            <th>用法</th>
            <th>用药频率</th>
            <th>单次剂量</th>
            <th>开药量</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in drugList" :key="item.id" style="border-right: 1px solid #eee;">
              <td>{{ item.name }}</td>
              <td>{{ item.usageMethod }}</td>
              <td>{{ item.usageFrequency }}</td>
              <td>{{ item.singleDosage }} {{ getSingleMount(index) }}</td>
              <td style="border-right: 1px solid grey;">{{ item.package1Amount }} {{ getAllMount(index) }}</td>
            </tr>
          </tbody>
        </table>
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ detail.remarks }}
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>
<script>
import { getPrescriptionDetail } from '@/api/prescription'

export default {
  name: 'PrescriptionDetailText',
  data() {
    return {
      detail: {
        name: '',
        remarks: ''
      },
      drugList: []
    }
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getPrescriptionDetail(this.id).then(res => {
        this.detail = res.data.prescription
            this.drugList = res.data.prescription.prescriptionDrugs
            this.drugList.forEach((item, i) => {
              delete item.drug.id
              Object.assign(item, item.drug)
            })
      })
    },
    getSingleMount(index) {
      const data = this.drugList[index]
      if (data.package3Number !== 0) {
        return data.package3Name
      } else {
        return data.package2Name
      }
    },
    getAllMount(index) {
      const data = this.drugList[index]
      return data.package1Name
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-card-body {
  padding: 10px 0;
}
/deep/.ant-descriptions-item-label {
  width: 90px;
}
</style>

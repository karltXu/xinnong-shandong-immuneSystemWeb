<template>
  <page-header-wrapper :title="false">
    <detail-sub ref="sub" @setSaveLoading="setSaveLoading">
      <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
        <a-button
          type="primary"
          @click="onSubmit"
          :loading="saveLoading"
        >
          保存
        </a-button>
        <a-button
          style="margin-left: 10px;"
          @click="goBack"
        >
          返回
        </a-button>
      </a-form-model-item>
    </detail-sub>
  </page-header-wrapper>
</template>
<script>
import DetailSub from './DetailSub.vue'

export default {
    name: 'PresciptionDetail',
    data() {
        return {
          saveLoading: false
        }
    },
    components: {
      DetailSub
    },
    methods: {
        goBack() {
          this.$refs.sub.goBack()
        },
        onSubmit() {
            this.saveLoading = true
            this.$refs.sub.onSubmit()
        },
        setSaveLoading(v) {
          this.saveLoading = v
        }
    }
}
</script>
<style lang="less" scoped scoped>

.img {
    width: 100px;
}
</style>

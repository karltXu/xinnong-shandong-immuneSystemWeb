<template>
  <page-header-wrapper :title="false">
    <new-sub ref="sub" @setSaveLoading="setSaveLoading">
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
          @click="resetForm"
        >
          重置
        </a-button>
      </a-form-model-item>
    </new-sub>
  </page-header-wrapper>
</template>

<script>
import NewSub from './NewSub.vue'

export default {
    name: 'PrescriptionNew',
    data() {
        return {
          saveLoading: false
        }
    },
    components: {
      NewSub
    },
    methods: {
        onSubmit() {
            this.saveLoading = true
            this.$refs.sub.onSubmit()
        },
        resetForm() {
            this.$refs.sub.resetForm()
        },
        setSaveLoading(v) {
          this.saveLoading = v
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
.city_content_medium {
    line-height: normal;
}
.citylist_popup_main .city_content_top {
    line-height: normal;
    height: 41px !important;
}
</style>

<template>
  <page-header-wrapper :title="false">
    <a-card :bordered="false">
      <a-row :gutter="32">
        <a-col :span="17">
          <div>
            <video :src="detail.videoUrl" controls="controls" width="100%">
              您的浏览器不支持 video 标签。
            </video>
          </div>
        </a-col>
        <a-col :span="7">
          <a-card title="课程信息">
            <a-row>
              <a-col :span="8">
                <p>课程名称：</p>
                <p>课程讲师：</p>
                <p>发布时间：</p>
                <p>课程简介：</p>
              </a-col>
              <a-col :span="16">
                <p>{{ detail.title }}</p>
                <p>{{ detail.expert.name || '-' }}</p>
                <p>{{ detail.createdAt }}</p>
                <p>{{ detail.description }}</p>
              </a-col>
            </a-row>
          </a-card>
          <br/>
          <a-card title="课程推荐">
            <a-card hoverable style="width: 100%;margin-bottom: 20px;" v-for="(item,index) in recommends" :key="index" @click="handleDetail(item.id)">
              <img
                slot="cover"
                alt="example"
                :src="item.coverUrl"
              />
              <a-card-meta :title="item.title">
                <template slot="description">
                  <div style="color: #52c41a">
                    <a-icon type="eye" />&nbsp;{{ item.views }}
                  </div>
                  <div>
                    <a-icon type="clock-circle" />&nbsp;{{ item.createdAt }}
                  </div>
                </template>
              </a-card-meta>
            </a-card>
          </a-card>
        </a-col>
      </a-row>
      <a-divider style="margin-bottom: 20px" />
      <a-row>
        <a-button
          @click="goBack"
          style="marginLeft: 12px"
        >
          返回
        </a-button>
      </a-row>
    </a-card>
  </page-header-wrapper>
</template>
<script>
import { getCourseDetail } from '@/api/course'

export default {
    name: 'CourseDetail',
    data() {
        return {
            detail: {
              expert: {
                name: ''
              }
            },
            recommends: [],
            id: ''
        }
    },
    mounted() {
        this.init()
    },
    watch: {
      id() {
        this.init()
      }
    },
    methods: {
        init () {
          getCourseDetail(this.$route.params.id).then((res) => {
            this.detail = res.data.course
            this.recommends = res.data.recommends
        })
        },
        goBack() {
          if (this.$route.params.pageNumber) {
            this.$router.push({
                name: 'coursesList',
                params: {
                    pageNumber: this.$route.params.pageNumber,
                    pageSize: this.$route.params.pageSize
                }
            })
          } else {
            this.$router.go(-1)
          }
        },
        handleDetail(id) {
          this.$router.push({
            name: 'courseDetail',
            params: { id }
          })
          this.id = id
        }
    }
}
</script>
<style lang="less" scoped>

</style>

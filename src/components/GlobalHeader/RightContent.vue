<template>
  <div :class="wrpCls">

    <a-badge
      :count="unread"
      @click="goNotice"
    >
      <a-icon
        type="bell"
        theme="twoTone"
      />
    </a-badge>

    <avatar-dropdown
      :menu="showMenu"
      :current-user="currentUser"
      :class="prefixCls"
    />
    <select-lang :class="prefixCls" />
  </div>
</template>

<script>
import storage from 'store'
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import { USER_NAME } from '@/store/mutation-types'
import { getNoticeList } from '@/api/notice'

export default {
    name: 'RightContent',
    components: {
        AvatarDropdown,
        SelectLang
    },
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-global-header-index-action'
        },
        isMobile: {
            type: Boolean,
            default: () => false
        },
        topMenu: {
            type: Boolean,
            required: true
        },
        theme: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showMenu: true,
            unread: 0
        }
    },
    computed: {
        wrpCls() {
            return {
                'ant-pro-global-header-index-right': true,
                [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
            }
        },
        currentUser() {
            return {
                name: this.$store.getters.name || storage.get(USER_NAME)
            }
        }
    },
    mounted() {
      this.timer = setInterval(() => {
        this.init()
      }, 5000)
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
        init() {
            const param = {
                pageNumber: 1,
                pageSize: 10
            }
            getNoticeList(param).then((res) => {
                this.unread = res.data.unread
            })
        },
        goNotice() {
            this.$router.push({
                name: 'notice'
            })
        }
    }
}
</script>
<style lang="less" scoped>
/deep/.ant-badge {
    display: inline-block;
    margin: 0 20px;
    transform: translateY(8px);
    cursor: pointer;
}
/deep/.anticon-bell {
    font-size: 24px;
}
</style>

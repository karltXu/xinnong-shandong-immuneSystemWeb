import storage from 'store'
import { login, getInfo } from '@/api/login'
import { ACCESS_TOKEN, USER_NAME } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            const result = response.data
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            storage.set(USER_NAME, result.userInfo.username)

            commit('SET_TOKEN', result.token)
            commit('SET_NAME', { name: result.userInfo.username, welcome: welcome() })
            commit('SET_AVATAR', result.userInfo.iconURL)
            // commit('SET_ROLES', result.userInfo.roleId)
            commit('SET_INFO', result.userInfo)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const result = response.data
            if (result.userInfo && result.userInfo.permissions.length > 0) {
              const userInfo = result.userInfo
              userInfo.permissions = result.userInfo.permissions
              userInfo.permissions.map(per => {
                if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                  const action = per.actionEntitySet.map(action => {
                    return action.action
                  })
                  per.actionList = action
                }
              })
              userInfo.permissionList = userInfo.permissions.map(permission => {
                return permission.permissionId
              })
              commit('SET_ROLES', userInfo)
              commit('SET_INFO', userInfo)
              commit('SET_NAME', userInfo.username)
              commit('SET_AVATAR', userInfo.avatar)
              resolve(userInfo)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        resolve()
        // logout(state.token)
        //   .then(() => {
        //     resolve()
        //   })
        //   .catch(() => {
        //     resolve()
        //   })
        //   .finally(() => {
        //     commit('SET_TOKEN', '')
        //     commit('SET_ROLES', [])
        //     storage.remove(ACCESS_TOKEN)
        //   })
      })
    }
  }
}

export default user

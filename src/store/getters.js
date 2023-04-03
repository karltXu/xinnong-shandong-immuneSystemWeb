const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  hasPermission: state => (name, range) => {
    let r
    if (range) {
      r = state.user.info.permissions.find(
        userInfo => userInfo.permissionId === name && userInfo.actions.includes(range)
      )
    } else {
      r = state.user.info.permissionList.includes(name)
    }
    return !!r
  }
}

export default getters

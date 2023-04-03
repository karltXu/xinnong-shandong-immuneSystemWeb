// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
import { PageView } from '@/layouts/index'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        hidden: true,
        component: () => import('@/views/welcome'),
        meta: { keepAlive: true, icon: bxAnaalyse }
      },
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        meta: {
          title: 'menu.dashboard',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: [
            'diagnosticAnalysis',
            'mapAlert',
            'newUserDiagnosticStat',
            'animalDiagnosticStat',
            'diseaseDiagnosticStat',
            'userStat',
            'orderStat'
          ]
        },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '诊断分析', keepAlive: false, permission: ['diagnosticAnalysis'] }
          },
          {
            path: '/dashboard/user',
            name: 'dashboardUser',
            component: () => import('@/views/dashboard/UserAnalysis'),
            meta: { title: '用户分析', keepAlive: true, permission: ['userStat'] }
          },
          {
            path: '/dashboard/order',
            name: 'dashboardOrder',
            component: () => import('@/views/dashboard/OrderAnalysis'),
            meta: { title: '订单分析', keepAlive: true, permission: ['orderStat'] }
          },
          {
            path: '/dashboard/map-warning',
            name: 'mapWarning',
            hidden: true,
            component: () => import('@/views/dashboard/MapWarning'),
            meta: { title: '地图预警', keepAlive: false, permission: ['mapAlert'] }
          },
          {
            path: '/dashboard/new-user-diagnose',
            name: 'newUserDiagnose',
            component: () => import('@/views/dashboard/NewUserDiagnose'),
            meta: { title: '新增用户', keepAlive: true, permission: ['newUserDiagnosticStat'] }
          },
          {
            path: '/dashboard/crop',
            name: 'dashboardCrop',
            component: () => import('@/views/dashboard/CropAnalysis'),
            meta: { title: '动物种类', keepAlive: true, permission: ['animalDiagnosticStat'] }
          },
          {
            path: '/dashboard/disease',
            name: 'dashboardDisease',
            component: () => import('@/views/dashboard/DiseaseAnalysis'),
            meta: { title: '动物疾病', keepAlive: true, permission: ['diseaseDiagnosticStat'] }
          }
        ]
      },
      //   推广分析
      {
        path: '/promote',
        name: 'promote',
        component: RouteView,
        redirect: '/promote/user',
        meta: {
          title: '推广分析',
          icon: 'dot-chart',
          permission: ['promoteAnalysisUser', 'promoteAnalysisOrder', 'landingpageManage']
        },
        children: [
          {
            path: 'user',
            name: 'promoteAnalysisUser',
            component: () => import('@/views/dashboard/PromoteAnalysisUser'),
            meta: { title: '用户数据', keepAlive: true, permission: ['promoteAnalysisUser'] }
          },
          {
            path: 'order',
            name: 'promoteAnalysisOrder',
            component: () => import('@/views/dashboard/PromoteAnalysisOrder'),
            meta: { title: '订单数据', keepAlive: true, permission: ['promoteAnalysisOrder'] }
          },
          {
            path: 'landing-page',
            name: 'landingPage',
            component: () => import('@/views/dashboard/LandingPage'),
            meta: { title: '推广页面', keepAlive: true, permission: ['landingpageManage'] }
          }
        ]
      },

      //   诊断管理
      {
        path: '/diagnose',
        name: 'diagnose',
        component: RouteView,
        redirect: '/diagnose/ai-list',
        meta: { title: '诊断管理', icon: 'bug', permission: ['aiRecord', 'expertRecord', 'aiRecordDetail', 'expertServiceV2', 'consultationRecord', 'arranges', 'meetings'] },
        children: [
          {
            path: '/diagnose/ai-list',
            name: 'diagnoseAIList',
            component: () => import('@/views/diagnose/AIList'),
            meta: { title: '智能诊断记录', keepAlive: true, permission: ['aiRecord'] }
          },
          {
            path: '/diagnose/ai-detail/:id',
            name: 'diagnoseAIDetail',
            hidden: true,
            component: () => import('@/views/diagnose/AIDetail'),
            meta: { title: '智能诊断记录详情', permission: ['aiRecordDetail'] }
          },
          // {
          //   path: '/diagnose/expert-list',
          //   name: 'diagnoseExpertList',
          //   component: () => import('@/views/diagnose/ExpertList'),
          //   meta: { title: '专家诊断记录', keepAlive: true, permission: ['expertRecord'] }
          // },
          // {
          //   path: '/diagnose/expert-detail/:id',
          //   name: 'diagnoseExpertDetail',
          //   hidden: true,
          //   component: () => import('@/views/diagnose/ExpertDetail'),
          //   meta: { title: '专家诊断记录详情', permission: ['expertRecord'] }
          // },
          {
            path: '/diagnose/expert-list',
            name: 'diagnoseExpertList',
            component: () => import('@/views/diagnose/ExpertList'),
            meta: { title: '专家指导记录', keepAlive: true, permission: ['expertServiceV2'] }
          },
          {
            path: '/diagnose/expert-detail/:id',
            name: 'diagnoseExpertDetail',
            hidden: true,
            component: () => import('@/views/diagnose/ExpertDetail'),
            meta: { title: '专家指导记录详情', permission: ['expertServiceV2'] }
          },
          {
            path: '/diagnose/consultation-list',
            name: 'consultationList',
            component: () => import('@/views/diagnose/ConsultationList'),
            meta: { title: '专家会诊记录', keepAlive: true, permission: ['consultationRecord'] }
          },
          {
            path: '/diagnose/consultation-detail/:id',
            name: 'consultationDetail',
            hidden: true,
            component: () => import('@/views/diagnose/ConsultationDetail'),
            meta: { title: '专家会诊记录详情', permission: ['consultationRecord'] }
          },
          {
            path: '/diagnose/meeting',
            name: 'meeting',
            component: () => import('@/views/diagnose/component/MeetingAdmin'),
            meta: { title: '会诊时段管理', permission: ['arranges'] }
          },
          {
            path: '/diagnose/meetingroom',
            name: 'meetingroom',
            component: () => import('@/views/diagnose/ConsultationIng'),
            meta: { title: '远程会诊室', permission: ['meetings'] }
          }
        ]
      },
      //   商家管理
      {
        path: '/business',
        name: 'business',
        component: RouteView,
        redirect: '/business/list',
        meta: { title: '商家管理', icon: 'global', permission: ['merchantList', 'newMerchant'] },
        children: [
          {
            path: '/business/list',
            name: 'businessList',
            component: () => import('@/views/business/List'),
            meta: { title: '商家列表', keepAlive: true, permission: ['merchantList'] }
          },
          {
            path: '/business/detail/:id',
            name: 'businessDetail',
            hidden: true,
            component: () => import('@/views/business/Detail'),
            meta: { title: '商家详情', keepAlive: true, permission: ['merchantList'] }
          },
          {
            path: '/business/new',
            name: 'businessNew',
            component: () => import('@/views/business/New'),
            meta: { title: '新增商家', keepAlive: true, permission: ['newMerchant'] }
          }
        ]
      },
      // 专家管理
      {
        path: '/experts',
        name: 'experts',
        component: RouteView,
        redirect: '/experts/list',
        meta: { title: '专家管理', icon: 'smile', permission: ['experts', 'newExpert'] },
        children: [
          {
            path: '/experts/list',
            name: 'expertsList',
            component: () => import('@/views/expert/List'),
            meta: { title: '专家列表', keepAlive: true, permission: ['experts'] }
          },
          {
            path: '/experts/detail/:id',
            name: 'expertsDetail',
            hidden: true,
            component: () => import('@/views/expert/Detail'),
            meta: { title: '专家详情', keepAlive: true, permission: ['experts'] }
          },
          {
            path: '/experts/new',
            name: 'expertsNew',
            component: () => import('@/views/expert/New'),
            meta: { title: '新增专家', keepAlive: true, permission: ['newExpert'] }
          }
        ]
      },
      // 课程管理
      {
        path: '/courses',
        name: 'courses',
        component: RouteView,
        redirect: '/courses/list',
        meta: { title: '课程管理', icon: 'read', permission: ['courseManage', 'courseViewList', 'courseAdd'] },
        children: [
          {
            path: '/courses/list-admin',
            name: 'coursesListAdmin',
            component: () => import('@/views/course/ListAdmin'),
            meta: { title: '课程管理列表', keepAlive: true, permission: ['courseManage'] }
          },
          {
            path: '/courses/list',
            name: 'coursesList',
            component: () => import('@/views/course/List'),
            meta: { title: '课程列表', keepAlive: true, permission: ['courseViewList'] }
          },
          {
            path: '/course/detail/:id',
            name: 'courseDetail',
            hidden: true,
            component: () => import('@/views/course/Detail'),
            meta: { title: '课程详情', keepAlive: true, permission: ['courseViewList'] }
          },
          {
            path: '/course/modify/:id',
            name: 'courseModify',
            hidden: true,
            component: () => import('@/views/course/Modify'),
            meta: { title: '课程修改', keepAlive: true, permission: ['courseAdd'] }
          },
          {
            path: '/course/new',
            name: 'courseNew',
            component: () => import('@/views/course/New'),
            meta: { title: '新增课程', keepAlive: true, permission: ['courseAdd'] }
          }
        ]
      },
      // 机构管理
      {
        path: '/agency',
        name: 'agency',
        component: RouteView,
        redirect: '/agency/list',
        meta: { title: '机构管理', icon: 'api', permission: ['anatomyAgencyManage', 'examinationAgencyManage'] },
        children: [
          {
            path: '/agency/list',
            name: 'agencyList',
            component: () => import('@/views/agency/2List'),
            meta: { title: '解剖机构列表', keepAlive: true, permission: ['anatomyAgencyManage'] }
          },
          {
            path: '/agency/detail/:id',
            name: 'agencyDetail',
            hidden: true,
            component: () => import('@/views/agency/2Detail'),
            meta: { title: '解剖结构详情', keepAlive: true, permission: ['anatomyAgencyManage'] }
          },
          {
            path: '/agency/new',
            name: 'agencysNew',
            component: () => import('@/views/agency/2New'),
            meta: { title: '新增解剖机构', keepAlive: true, permission: ['anatomyAgencyAdd'] }
          },
          {
            path: '/agency/list-detect',
            name: 'detectList',
            component: () => import('@/views/agency/List'),
            meta: { title: '检测机构列表', keepAlive: true, permission: ['examinationAgencyManage'] }
          },
          {
            path: '/agency/detail-detect/:id',
            name: 'detectDetail',
            hidden: true,
            component: () => import('@/views/agency/Detail'),
            meta: { title: '检测机构详情', keepAlive: true, permission: ['examinationAgencyManage'] }
          },
          {
            path: '/agency/new-detect',
            name: 'detectNew',
            component: () => import('@/views/agency/New'),
            meta: { title: '新增检测机构', keepAlive: true, permission: ['examinationAgencyAdd'] }
          },
          {
            path: '/agency/detect-item-list',
            name: 'detectItemList',
            hidden: true,
            component: () => import('@/views/agency/DetectList'),
            meta: { title: '检测项目列表', keepAlive: true, permission: ['examinationAgencyManage'] }
          },
          {
            path: '/agency/detect-item-detail/:id',
            name: 'detectItemDetail',
            hidden: true,
            component: () => import('@/views/agency/DetectDetail'),
            meta: { title: '检测项目详情', keepAlive: true, permission: ['examinationAgencyManage'] }
          },
          {
            path: '/agency/detect-item-new',
            name: 'detectItemNew',
            hidden: true,
            component: () => import('@/views/agency/DetectNew'),
            meta: { title: '新增检测项目', keepAlive: true, permission: ['examinationAgencyManage'] }
          }
        ]
      },
      // 检测记录管理
      {
        path: '/test',
        name: 'test',
        component: RouteView,
        redirect: '/test/list',
        meta: { title: '检测记录管理', icon: 'hdd', permission: ['examinationList'] },
        children: [
          {
            path: '/test/list',
            name: 'testList',
            component: () => import('@/views/labtest/List'),
            meta: { title: '检测记录列表', keepAlive: true, permission: ['examinationList'] }
          },
          {
            path: '/test/detail/:id',
            name: 'testDetail',
            hidden: true,
            component: () => import('@/views/labtest/Detail'),
            meta: { title: '检测记录详情', keepAlive: true, permission: ['examinationList'] }
          }
        ]
      },
      // 药品管理
      {
        path: '/drug',
        name: 'drug',
        component: RouteView,
        redirect: '/drug/list',
        meta: { title: '药品管理', icon: 'disconnect', permission: ['drugManage', 'drugAdd'] },
        children: [
          {
            path: '/drug/list',
            name: 'drugList',
            component: () => import('@/views/drug/List'),
            meta: { title: '药品列表', keepAlive: true, permission: ['drugManage'] }
          },
          {
            path: '/drug/detail/:id',
            name: 'drugDetail',
            hidden: true,
            component: () => import('@/views/drug/Detail'),
            meta: { title: '药品详情', keepAlive: true, permission: ['drugManage'] }
          },
          {
            path: '/drug/new',
            name: 'drugNew',
            component: () => import('@/views/drug/New'),
            meta: { title: '新增药品', keepAlive: true, permission: ['drugAdd'] }
          }
        ]
      },
      // 处方管理
      {
        path: '/prescription',
        name: 'prescription',
        component: RouteView,
        redirect: '/prescription/list',
        meta: { title: '处方管理', icon: 'experiment', permission: ['prescriptionManage', 'prescriptionAdd'] },
        children: [
          {
            path: '/prescription/list',
            name: 'prescriptionList',
            component: () => import('@/views/prescription/List'),
            meta: { title: '处方列表', keepAlive: true, permission: ['prescriptionManage'] }
          },
          {
            path: '/prescription/detail/:id',
            name: 'prescriptionDetail',
            hidden: true,
            component: () => import('@/views/prescription/Detail'),
            meta: { title: '处方详情', keepAlive: true, permission: ['prescriptionManage'] }
          },
          {
            path: '/prescription/new',
            name: 'prescriptionNew',
            component: () => import('@/views/prescription/New'),
            meta: { title: '新增处方', keepAlive: true, permission: ['prescriptionAdd'] }
          }
        ]
      },
      // 病历管理
      {
        path: '/case',
        name: 'case',
        component: RouteView,
        redirect: '/case/list',
        meta: { title: '病历管理', icon: 'fork', permission: ['caseList'] },
        children: [
          {
            path: '/case/list',
            name: 'caseList',
            component: () => import('@/views/case/List'),
            meta: { title: '病历列表', keepAlive: true, permission: ['caseList'] }
          },
          {
            path: '/case/detail/:id',
            name: 'caseDetail',
            hidden: true,
            component: () => import('@/views/case/Detail'),
            meta: { title: '病历详情', keepAlive: true, permission: ['caseList'] }
          }
        ]
      },
      //   动物管理
      {
        path: '/crops',
        name: 'crops',
        component: RouteView,
        redirect: '/crops/crop-list',
        meta: { title: '动物管理', icon: 'fire', permission: ['animals'] },
        children: [
          {
            path: '/crops/crop-list',
            name: 'cropsList',
            component: () => import('@/views/crops/List'),
            meta: { title: '动物列表', keepAlive: true, permission: ['animals'] }
          }
        ]
      },
      //   套餐管理
      {
        path: '/package',
        name: 'package',
        component: RouteView,
        redirect: '/package/vip-list',
        meta: {
          title: '系统配置',
          icon: 'gold',
          permission: ['vipPlan', 'expertService', 'versionManage', 'channelManage', 'adManage', 'commodity']
        },
        children: [
          // {
          //   path: '/package/vip-list',
          //   name: 'packageVIPList',
          //   component: () => import('@/views/package/VIPList'),
          //   meta: { title: 'VIP套餐', keepAlive: true, permission: ['vipPlan'] }
          // },
          // {
          //   path: '/package/vip-detail/:id',
          //   name: 'packageVIPDetail',
          //   hidden: true,
          //   component: () => import('@/views/package/VIPDetail'),
          //   meta: { title: '套餐详情', keepAlive: true, permission: ['vipPlan'] }
          // },
          // {
          //   path: '/package/expert-service-list',
          //   name: 'packageExpertList',
          //   component: () => import('@/views/package/ExpertList'),
          //   meta: { title: '专家服务', keepAlive: true, permission: ['expertService'] }
          // },
          // {
          //   path: '/package/expert-service-detail/:id',
          //   name: 'packageExpertDetail',
          //   hidden: true,
          //   component: () => import('@/views/package/ExpertDetail'),
          //   meta: { title: '套餐详情', keepAlive: true, permission: ['expertService'] }
          // },
          {
            path: '/package/commodity-list',
            name: 'commodityList',
            component: () => import('@/views/package/CommodityList'),
            meta: { title: '商品管理', keepAlive: true, permission: ['commodity'] }
          },
          {
            path: '/package/commodity-detail/:id',
            name: 'commodityDetail',
            hidden: true,
            component: () => import('@/views/package/CommodityDetail'),
            meta: { title: '商品详情', keepAlive: true, permission: ['commodity'] }
          },
          //   版本管理
          {
            path: '/package/version-manager',
            name: 'versionManager',
            component: () => import('@/views/package/VersionList'),
            meta: { title: '版本管理', keepAlive: true, permission: ['versionManage'] }
          },
          {
            path: '/package/version-new',
            name: 'versionNew',
            hidden: true,
            component: () => import('@/views/package/VersionNew'),
            meta: { title: '新建版本', keepAlive: true, permission: ['versionManage'] }
          },
          {
            path: '/package/version-detail/:id',
            name: 'versionDetail',
            hidden: true,
            component: () => import('@/views/package/VersionDetail'),
            meta: { title: '版本详情', keepAlive: true, permission: ['versionManage'] }
          },
          //   渠道管理
          {
            path: '/package/channel-manager',
            name: 'channelManager',
            component: () => import('@/views/package/ChannelList'),
            meta: { title: '渠道管理', keepAlive: true, permission: ['channelManage'] }
          },
          {
            path: '/package/channel-detail/:id',
            name: 'channelDetail',
            hidden: true,
            component: () => import('@/views/package/ChannelDetail'),
            meta: { title: '渠道详情', keepAlive: true, permission: ['channelManage'] }
          },
          //   广告管理
          {
            path: '/package/ad-manager',
            name: 'adManager',
            component: () => import('@/views/package/AdList'),
            meta: { title: '广告管理', keepAlive: true, permission: ['adManage'] }
          },
          {
            path: '/package/ad-new',
            name: 'adNew',
            hidden: true,
            component: () => import('@/views/package/AdNew'),
            meta: { title: '新建广告', keepAlive: true, permission: ['adManage'] }
          },
          {
            path: '/package/ad-detail/:id',
            name: 'adDetail',
            hidden: true,
            component: () => import('@/views/package/AdDetail'),
            meta: { title: '广告详情', keepAlive: true, permission: ['adManage'] }
          }
        ]
      },
      //   订单管理
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/list',
        meta: { title: '订单管理', icon: 'pay-circle', permission: ['orders'] },
        children: [
          {
            path: '/order/list',
            name: 'orderList',
            component: () => import('@/views/order/List'),
            meta: { title: '订单列表', keepAlive: true, permission: ['orders'] }
          },
          {
            path: '/order/detail/:id',
            name: 'orderDetail',
            hidden: true,
            component: () => import('@/views/order/Detail'),
            meta: { title: '订单详情', keepAlive: true, permission: ['orders'] }
          }
        ]
      },
      //   博客管理
      {
        path: '/blog',
        name: 'blog',
        component: RouteView,
        redirect: '/blog/list',
        meta: { title: '内容管理', icon: 'message', permission: ['blogs', 'newBlog'] },
        children: [
          {
            path: '/blog/list',
            name: 'blogList',
            component: () => import('@/views/blog/List'),
            meta: { title: '内容列表', keepAlive: true, permission: ['blogs'] }
          },
          {
            path: '/blog/new',
            name: 'blogNew',
            component: () => import('@/views/blog/New'),
            meta: { title: '新增内容', keepAlive: true, permission: ['newBlog'] }
          },
          {
            path: '/blog/preview/:id',
            name: 'blogPreview',
            hidden: true,
            component: () => import('@/views/blog/Preview'),
            meta: { title: '内容预览', keepAlive: true, permission: ['blogs'] }
          },
          {
            path: '/blog/modify/:id',
            name: 'blogModify',
            hidden: true,
            component: () => import('@/views/blog/Modify'),
            meta: { title: '修改内容', keepAlive: true, permission: ['blogs'] }
          }
        ]
      },
      //  通知管理
      {
        path: '/notice',
        name: 'notice',
        component: RouteView,
        redirect: '/notice/list',
        meta: { title: '通知管理', icon: 'bell' },
        children: [
          {
            path: '/notice/list',
            name: 'noticeList',
            component: () => import('@/views/notice/List'),
            meta: { title: '通知列表', keepAlive: true }
          },
          {
            path: '/notice/detail/:id',
            name: 'noticeDetail',
            hidden: true,
            component: () => import('@/views/notice/Detail'),
            meta: { title: '通知详情', keepAlive: true }
          }
        ]
      },
      // 用户管理详情单独拿出来
      {
        path: '/user/detail/:id',
        name: 'userDetail',
        hidden: true,
        component: () => import('@/views/user/UserDetail'),
        meta: { title: '用户详情', keepAlive: true, permission: ['userDetail'] }
      },
      //   用户管理
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        redirect: '/user/list',
        meta: { title: '用户管理', icon: 'team', permission: ['users', 'feedbackManage'] },
        children: [
          {
            path: '/user/list',
            name: 'userList',
            component: () => import('@/views/user/UserList'),
            meta: { title: '用户列表', keepAlive: true, permission: ['users'] }
          },
          {
            path: '/feedback/list',
            name: 'feedbackList',
            component: () => import('@/views/user/FeedbackList'),
            meta: { title: '用户反馈管理', keepAlive: true, permission: ['feedbackManage'] }
          },
          {
            path: '/feedback/detail/:id',
            name: 'feedbackDetail',
            hidden: true,
            component: () => import('@/views/user/FeedbackDetail'),
            meta: { title: '反馈详情', keepAlive: true, permission: ['feedbackManage'] }
          }
        ]
      },
      // 权限管理
      {
        path: '/authority',
        component: PageView,
        redirect: '/authority/user-list',
        name: 'authority',
        meta: {
          title: '权限管理',
          icon: 'lock',
          keepAlive: true,
          permission: ['userManage', 'roleManage', 'permissionManage']
        },
        children: [
          {
            path: '/authority/user-list',
            name: 'UserManagerList',
            component: () => import('@/views/authority/UserList'),
            meta: { title: '后台用户', keepAlive: true, permission: ['userManage'] }
          },
          {
            path: '/authority/user-new',
            name: 'UserNew',
            hidden: true,
            component: () => import('@/views/authority/UserNew'),
            meta: { title: '新增后台用户', keepAlive: true, permission: ['userManage'] }
          },
          {
            path: '/authority/user-update',
            name: 'UserUpdate',
            hidden: true,
            component: () => import('@/views/authority/UserUpdate'),
            meta: { title: '修改后台用户', keepAlive: true, permission: ['userManage'] }
          },
          {
            path: '/authority/role-list',
            name: 'RoleList',
            component: () => import('@/views/authority/RoleList'),
            meta: { title: '角色列表', keepAlive: true, permission: ['roleManage'] }
          },
          {
            path: '/authority/role-new',
            name: 'RoleNew',
            hidden: true,
            component: () => import('@/views/authority/RoleNew'),
            meta: { title: '新建角色', keepAlive: true, permission: ['roleManage'] }
          },
          {
            path: '/authority/role-update',
            name: 'RoleUpdate',
            hidden: true,
            component: () => import('@/views/authority/RoleUpdate'),
            meta: { title: '修改角色', keepAlive: true, permission: ['roleManage'] }
          },
          {
            path: '/authority/permission-list',
            name: 'PermissionList',
            component: () => import('@/views/authority/PermissionList'),
            meta: { title: '权限列表', keepAlive: true, permission: ['permissionManage'] }
          }
        ]
      },
      // 个人中心
      {
        path: '/account',
        component: PageView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: '个人中心', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true }
              }
            ]
          }
        ]
      },
      // 错误页面404，403，500
      {
        path: '/exception',
        name: 'exception',
        hidden: true,
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning' },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404' }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500' }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    component: UserLayout,
    redirect: '/login/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/login/RegisterResult')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]

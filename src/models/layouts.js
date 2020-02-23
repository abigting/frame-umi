export default {
  namespace: 'layout',
  state: {
    routers:[{
      name: '首页',
      icon: 'iconwechat',
      path: '/wechat',
      authority: ['1'],
      children: [
        {
          name: '个人号',
          icon: 'iconpersonal',
          key: 'person',
        },
      ],
    },
    {
      name: '指标管理',
      icon: 'iconservice',
      path: '/contact',
      authority: ['1', '2'],
      children: [
        {
          name: '评价指标',
          icon: 'iconpersonal',
          key: 'person',
        },
        {
          name: '计算指标',
          icon: 'iconpersonal',
          key: 'person',
        },
        {
          name: '自定义指标',
          icon: 'iconpersonal',
          key: 'person',
        },
      ],
    },
    {
      name: '标签管理',
      icon: 'iconmobile',
      path: '/device',
      authority: ['1'],
      children: [
        {
          name: '设备管理',
          icon: 'iconmobile',
          hide: true,
          key: 'info',
          children: [{name: '全部设备', path: '/device/list'}],
        },
      ],
    },
    {
      name: '评价管理',
      icon: 'iconsetting',
      path: '/setting',
      authority: ['1'],
      children: [
        {
          name: '信息',
          icon: 'iconuser',
          hide: true,
          key: 'info',
          children: [
            {name: '个人信息', path: '/setting/info/personal'},
            {name: '公司信息', path: '/setting/info/company'},
            {name: '版本信息', path: '/setting/info/version'},
          ],
        },
      ],
    },
      {
        name: '统计分析',
        icon: 'iconsetting',
        path: '/setting',
        authority: ['1'],
        children: [
          {
            name: '信息',
            icon: 'iconuser',
            hide: true,
            key: 'info',
            children: [
              {name: '个人信息', path: '/setting/info/personal'},
              {name: '公司信息', path: '/setting/info/company'},
              {name: '版本信息', path: '/setting/info/version'},
            ],
          },
        ],
      },
      {
        name: '暗访管理',
        icon: 'iconsetting',
        path: '/setting',
        authority: ['1'],
        children: [
        ],
      },
      {
        name: '现场考核',
        icon: 'iconsetting',
        path: '/setting',
        authority: ['1'],
        children: [
        ],
      },
      {
        name: '公告管理',
        icon: 'iconsetting',
        path: '/setting',
        authority: ['1'],
        children: [
        ],
      },
      {
        name: '系统设置',
        icon: 'iconsetting',
        path: '/setting',
        authority: ['1'],
        children: [
        ],
      },
    ],
  },
  reducers: {
    update(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
  },
}


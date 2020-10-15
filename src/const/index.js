/**
 * 左侧导航
 * index 索引
 * title 标题
 * icon 图标class  选子 element-ui 图标库
 * router 跳转地址
 * isAdmin 是否需要 管理员权限
 */
export const menu = [
    {
        index: '1',
        title: '首页',
        icon: 'el-icon-house',
        router: '/webPage/homePage',
    },
    {
        index: '2',
        title: '出票管理后台',
        icon: 'el-icon-monitor',
        router: '/webPage/ticketsPage',
        childrens: []
    },
    {
        index: '4',
        title: '彩店管理',
        icon: 'el-icon-office-building',
        router: '/webPage/storePage',
        childrens: [],
        isAdmin: true
    },
    {
        index: '3',
        title: '用户管理',
        icon: 'el-icon-user',
        router: '/webPage/memberPage',
        isAdmin: true
    },
];

/**
 * 彩种类型
 */
export const lottery = [
    {
        title: '全部',
        id: 1
    },
    {
        title: '体彩',
        id: 2
    },
    {
        title: '数字彩',
        id: 3
    },
    {
        title: '高频彩',
        id: 4
    }
]

/**
 * 用户类型
 */
export const userType = [
    {name: '全部', value: null},
    {name: '管理员', value: 'ADMIN'},
    {name: '用户', value: 'USER'}
]
/**
 * 用户状态
 */
export const userStatus = [
    {name: '全部', value: null},
    {name: '可用', value: 'VALID'},
    {name: '禁用', value: 'INVALID'}
]
import {post, get} from "./https"

import {encrypt} from '@/utils'

const httpApi = {
    /**
     * 登录： 用户名 密码
     */
    login (username, password) {
        return post('api/login', {username, password: encrypt(password)})
    },

    /**
     * 彩店类型
     */
    getShopTypeList () {
        return get('api/lotteryShop/getShopTypeList');
    },
    /**
     * 彩店状态
     */
    getShopStatusList () {
        return get('api/lotteryShop/getShopStatusList');
    },
    /**
     * 彩店列表
     */
    getPageList (params) {
        return get('api/lotteryShop/getPageList', params);
    },
    /**
     * 新增彩店
     */
    addLotteryShop (params) {
        return post('api/lotteryShop/addLotteryShop', params);
    },
    /**
     * 编辑彩店
     */
    editLotteryShop (params) {
        return post('api/lotteryShop/editLotteryShop', params);
    },
    /**
     * 查询用户列表
     */
    getListPage (params) {
        return post('api/user/getListPage', params);
    },
    /**
     * 新增用户
     */
    addUser (params) {
        return post('api/user/add', params);
    },
    /**
     * 新增用户
     */
    editUser (params) {
        return post('api/user/edit', params);
    },
    /**
     * 查询首页销售额
     */
    getHomeSalesVolume (params) {
        return get('api/ticket/getHomeSalesVolume', params);
    },
    /**
     * 查询彩种统计数据
     */
    getLotteryTypeStatisticsVO (params) {
        return get('api/ticket/getLotteryTypeStatisticsVO', params);
    },
    /**
     * 查询彩票状态统计数据
     */
    getTicketStatusStatisticsVO (params) {
        return get('api/ticket/getTicketStatusStatisticsVO', params);
    },
    /**
     * 查询彩票种类与玩法下拉列表枚举值getTicketTypeList
     */
    getTicketStatusList () {
        return get('api/ticket/getTicketStatusList');
    },
    /**
     * 查询彩票状态下拉列表枚举值
     */
    getTicketTypeList () {
        return get('api/ticket/getTicketTypeList');
    },
    /**
     * 查询彩票列表信息
     * */
    getTicketListPage (params) {
        return get('api/ticket/getListPage', params);
    },
    /**
     * 查询单条彩票信息
     */
    selectOneById (id) {
        return get(`api/ticket/selectOneById/${id}`)
    },
    /*
    * 提醒
     */
    bathRemind (id) {
        return post('api/ticket/remind/' + id)
    },
    /*
    * 出票
     */
    ticketPrint (id) {
        return post('api/ticket/print/' + id)
    },
    /**
     * 出票失败 原因提交 
     */
    printError (params) {
        return post('api//ticket/printError', params)
    }
}

export default httpApi
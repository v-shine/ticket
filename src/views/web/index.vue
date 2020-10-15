<template>
  <div class="web">
    <div class="header">
        <div class="left">
            <div class="logo imgBox">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <el-link class="title" type="primary" :underline="false">
                出票管理后台
                <span v-if="userInfo.lotteryShopName">
                    -{{userInfo.lotteryShopName}}
                </span>
            </el-link>
        </div>
        <div class="right">
            <div class="headImg imgBox">
                <img src="@/assets/images/logo.png" alt="">
            </div>
            <p class="name" v-if="userInfo">{{userInfo.name}}</p>
            <a class="btnLoginOut" @click="loginOut">退出 <i class="icon"></i></a>
        </div>
    </div>
    <div class="content">
        <div class="menu">
            <el-menu :router="true" :default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                
                <template v-for="item in menu" >
                    <!-- 按权限 显示栏目 是否为管理员才可以查看 -->
                    <template v-if="!item.isAdmin || (item.isAdmin && userInfo.userType.value == 'ADMIN')">
                        <template v-if="item.childrens && item.childrens.length > 0">
                            <el-submenu :index="item.router" :key="item.index">
                                <template slot="title">
                                    <i :class="item.icon"></i>
                                    <span slot="title">{{item.title}}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item v-for="item2 in item.childrens" :key="item2.index" :index="item2.router">
                                        {{item2.title}}
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </template>
                        <template v-if="!(item.childrens && item.childrens.length > 0)">
                            <el-menu-item :index="item.router" :key="item.index">
                                <i :class="item.icon"></i>
                                <span slot="title">{{item.title}}</span>
                            </el-menu-item>
                        </template>
                    </template>
                </template>
            </el-menu>
        </div>
        <div class="wrap">
            <router-view class="main" />
        </div>
    </div>
  </div>
</template>

<script>
import {menu} from '@/const'
export default {
    name: 'index',
    created () {
        this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.defaultActive = this.$route.matched[1].path || menu[0].router;
    },
    data () {
        return {
            userInfo: '',
            menu: menu,
            isCollapse: true,
            defaultActive: menu[0].router
        }
    },
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        loginOut () {
            sessionStorage.removeItem('userInfo');
            this.$router.push({path: '/loginPage'});
        }
    }
}
</script>

<style typle="text/scss" lang="scss" scoped>
    $url: '../../assets/images/';
    .web{
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #F8F9FF;
        .header{
            display: flex;
            justify-content: space-between;
            box-shadow:0px 3px 8px 0px rgba(183,183,183,0.19);
            background: #fff;
            padding: 11px 16px;
            align-items: center;
            .left{
                display: flex;
                align-items: center;
                .logo{
                    width: 41px;
                    height: 41px;
                    margin-right: 20px;
                }
                .title{
                    font-size: 18px;
                    font-weight: 400;
                }
            }
            .right{
                display: flex;
                align-items: center;
                .headImg{
                    width: 34px;
                    height: 34px;
                }
                .name{
                    margin: 0 14px 0 10px;
                }
                .btnLoginOut{
                    display: flex;
                    align-items: center;
                    .icon{
                        margin-left: 5px;
                        width: 14px;
                        height: 14px;
                        background: url($url + 'loginout.png') no-repeat;
                    }
                }
            }
        }
        .content{
            flex: 1;
            display: flex;
            margin-top: 2px;
            .menu{
                display: flex;
                box-shadow:3px 0px 8px 0px rgba(183,183,183,0.19);
            }
            .wrap{
                flex: 1;
                display: flex;
                justify-content: center;
                overflow-y: scroll;
                overflow-x: hidden;
                max-height: calc(100vh - 63px);
                .main{
                    width: 1300px;
                }
            }
        }
    }
</style>

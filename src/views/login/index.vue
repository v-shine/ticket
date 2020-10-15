<template>
  <div class="login">
      <div class="loginForm">
        <h1 class="title">欢迎登录</h1>
        <div class="iptList">
          <el-input class="iptItem" v-model="username" placeholder="请输入帐号">
            <i slot="prefix" class="el-icon-user el-input__icon"></i>
          </el-input>
          <el-input class="iptItem" v-model="password" type="password" placeholder="请输入密码">
            <i slot="prefix" class="el-icon-lock el-input__icon"></i>
          </el-input>
        </div>
        <el-button class="btnLogin" type="primary" @click="login">登录</el-button>
      </div>
  </div>
</template>

<script>

import {encrypt} from '@/utils'
export default {
  name: 'index',
  created () {
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      this.$api.login(this.username,this.password).then(data => {
        sessionStorage.setItem('userInfo',JSON.stringify(data.data));
        this.$router.push({path: '/webpage'})
      });
    }
  }
}
</script>

<style type="text/scss" lang="scss">
    $url: '../../assets/images/';
    .login{
      height: 100vh;
      background: url($url + 'loginBg.jpg') no-repeat center;
      display: flex;
      align-items: center;
      justify-content: center;
      .loginForm{
        width: 370px;
        padding: 40px;
        background: #fff;
        .title{
          font-weight: 500;
          font-size: 26px;
        }
        .iptList{
          margin-bottom: 20px;
          .el-input__icon{
            font-size: 18px;
          }
          .iptItem{
            margin-top: 20px;
          }
        }
        .btnLogin{
          width: 100%;
        }
      }
    }
</style>


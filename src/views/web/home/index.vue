<template>
  <div class="page">
    <h1 class="pageTitle">出票管理后台</h1>
    <div class="mBox searchBox">
      <div class="timeBox">
        <label>时间范围：</label>
        <el-link :underline="false" 
          @click="setTime(item.type)"
          :class="{primary: timeCurrent == item.type}"
          class="item" v-for="item in timeList" :key="item.type">
          {{item.title}}
        </el-link>
      </div>
      <div class="rightBox">
        <el-date-picker
          @change="timeArrChange"
          v-model="timeArr"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <a class="btnSearch" @click="getData">查询</a>
      </div>
    </div>
    <div class="saleList mt15">
      <div class="left mBox" id="saleBox">

      </div>
      <div class="center">
        <div class="item">
          <div class="text">
            <p>体彩总销售额</p>
            <p class="nums">¥{{getHomeSalesVolumeData.tcSalesVolume}}</p>
          </div>
          <i class="icon"></i>
        </div>
        <div class="item">
          <div class="text">
            <p>福彩总销售额</p>
            <p class="nums">¥{{getHomeSalesVolumeData.fcSalesVolume}}</p>
          </div>
          <i class="icon"></i>
        </div>
        <div class="item">
          <div class="text">
            <p>高频彩总销售额</p>
            <p class="nums">¥{{getHomeSalesVolumeData.gpcSalesVolume}}</p>
          </div>
          <i class="icon"></i>
        </div>
      </div>
      <div class="right mBox" id="saleDayBox">

      </div>
    </div>
    <div class="lotteryBox mBox mt15">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="体彩" name="1"></el-tab-pane>
        <el-tab-pane label="福彩" name="2"></el-tab-pane>
        <el-tab-pane label="高频彩" name="3"></el-tab-pane>
      </el-tabs>
      <div id="saleTypeBox" style="height:240px;width: 100%;"></div>
    </div>
    <div class="rankBox mBox mt15" v-if="userInfo.userType.value == 'ADMIN'">
      <el-tabs v-model="activeNameRank" @tab-click="handleClickRank">
        <el-tab-pane label="体彩" name="1"></el-tab-pane>
        <el-tab-pane label="福彩" name="2"></el-tab-pane>
        <el-tab-pane label="高频彩" name="3"></el-tab-pane>
      </el-tabs>
      <div class="list">
        <rankList class="item" v-for="item in rankListData" :key="item.id" :title="item.title" :data="item.data"></rankList>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

import { getDates, getMonthFirstDay, getMonthLastDay, getWeekStartAndEnd } from '@/utils'
import { saleOptions, saleDayOptions, saleTypeOption } from './echartsOptions'

import { rankList } from '@/components/index.js'
export default { 
  name: 'App',
  components: { rankList },
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    this.timeArr = [this.params.minTime, this.params.maxTime];
    this.getData();
  },
  computed: {
    timeCurrent: {
      get () {
        let nowDate = getDates(),
          sevenDate = getWeekStartAndEnd(),
          firstDate = getMonthFirstDay(),
          lastDate = getMonthLastDay(),
          res;
          if(this.params.minTime == nowDate && this.params.maxTime == nowDate){
            res = 0;
          }
          else if (this.params.minTime == sevenDate[0] && this.params.maxTime == sevenDate[1]) {
            res = 1;
          }
          else if (this.params.minTime == firstDate && this.params.maxTime == lastDate) {
            res = 2;
          }
          return res
      },
      set () {

      }
    }
  },
  data () {
    return {
      userInfo: '',
      timeList: [
        { title: '今日', type: 0 },
        { title: '本周', type: 1},
        { title: '本月', type: 2}
      ],
      params: {
        lotteryShopId: null,
        minTime: getDates(),
        maxTime: getDates(),
        type: null
      },
      activeName: '1',
      activeNameRank: '1',
      getHomeSalesVolumeData: {},
      rankListData: [],
      timeArr: []
    }
  },
  methods: {
    getData () {
      this.getHomeSalesVolume();
      this.getLotteryTypeStatisticsVO();
      this.getTicketStatusStatisticsVO();
    },  

    getLotteryShopId () {
      let userInfo = sessionStorage.getItem('userInfo');
      if(userInfo){
        let { lotteryShopId } = JSON.parse(userInfo);
        if(lotteryShopId){
          this.params.lotteryShopId = lotteryShopId;
        }
      }
    },
    getHomeSalesVolume () {
      this.$api.getHomeSalesVolume(this.params).then(data => {
        this.getHomeSalesVolumeData = data.data;
        this.initEchartsSale(this.getHomeSalesVolumeData);
        this.initEchartsSaleDay(this.getHomeSalesVolumeData);
      })
    },
    getLotteryTypeStatisticsVO () {
      this.$api.getLotteryTypeStatisticsVO(this.params).then(data => {
        let dataList = data.data;
        this.initEchartsSaleType(dataList);
      });
    },
    getTicketStatusStatisticsVO () {
      if(this.userInfo.userType.value == 'ADMIN'){
        this.$api.getTicketStatusStatisticsVO(this.params).then(data =>{
          this.rankListData = [
            { title: '已出票榜', data: data.data.overList },
            { title: '待出票榜', data: data.data.waitList },
            { title: '出票中榜', data: data.data.printintList },
            { title: '失败票榜', data: data.data.errorList },
          ]
        })
      }
    },
    timeArrChange (val) {
      this.params.minTime = val[0];
      this.params.maxTime = val[1];
    },
    setTime (type) {
      switch (type) {
        case 0:
          this.params.minTime = getDates();
          this.params.maxTime = getDates();
          break;
        case 1:
          this.params.minTime = getWeekStartAndEnd()[0];
          this.params.maxTime = getWeekStartAndEnd()[1];
          break;
        case 2:
          this.params.minTime = getMonthFirstDay();
          this.params.maxTime = getMonthLastDay();
          break;
        default:
      }
      this.timeArr = [this.params.minTime,this.params.maxTime]
      this.getHomeSalesVolume();
      this.getLotteryTypeStatisticsVO();
      this.getTicketStatusStatisticsVO();
    },
    initEchartsSale (data) {
      let myChart = echarts.init(document.getElementById('saleBox'));
      let dataArr = [
        { value: data.tcSalesVolume, name: '体彩总销售' },
        { value: data.fcSalesVolume, name: '福彩总销售' },
        { value: data.gpcSalesVolume, name: '高频彩总销售' }
      ]
      let option = saleOptions(dataArr,this.timeList[this.timeCurrent].title);
      myChart.setOption(option);
    },
    initEchartsSaleDay (data) {
      let myChart = echarts.init(document.getElementById('saleDayBox'));
      let dataArr = [
        ['体彩', data.tcSalesVolume],
        ['福彩', data.fcSalesVolume],
        ['高频彩', data.gpcSalesVolume]
      ]
      let option = saleDayOptions(dataArr,this.timeList[this.timeCurrent].title);
      myChart.setOption(option);
    },
    initEchartsSaleType (data) {
      let newData = [];
      if(data && data.length > 0){
        data.map((v,k)=> {
          let item = [v.lotteryType, v.salesVolume];
          newData.push(item);
        })
      }else{
        newData = [['暂无数据', '0']]
      }
      let myChart = echarts.init(document.getElementById('saleTypeBox'));
      let option = saleTypeOption(newData);
      myChart.setOption(option, true);
    },
    handleClick () {
      if(this.params.type != this.activeName){
        this.params.type = this.activeName;
        this.getLotteryTypeStatisticsVO();
      }
    },
    handleClickRank () {
      if(this.params.type != this.activeNameRank){
        this.params.type = this.activeNameRank;
        this.getTicketStatusStatisticsVO();
      }
    }
  }
}
</script>

<style type="text/scss" scoped lang="scss">

$url: '../../../assets/images/';
.page{
  .searchBox{
    justify-content: space-between;
    .timeBox{
      .item{
        margin: 0 10px;
        &.primary{
          color: #409EFF;
        }
      }
    }
    .rightBox{
      display: flex;
      align-items: center;
    }
  }
  .saleList{
    display: flex;
    justify-content: space-between;
    height: 276px;
    .left{
      width: 460px;
    }
    .center{
      width: 206px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item{
        display: flex;
        height: 48px;
        padding: 16px 10px;
        border-radius: 10px;
        font-size: 14px;
        color: #fff;
        position: relative;
        &:nth-child(1){
          background: linear-gradient(90deg,rgba(255,76,35,1) 0%,rgba(255,171,93,1) 100%);
        }
        &:nth-child(2){
          background: linear-gradient(90deg,rgba(53,120,253,1) 0%,rgba(95,181,255,1) 100%);
        }
        &:nth-child(3){
          background:linear-gradient(90deg,rgba(91,84,229,1) 0%,rgba(126,96,233,1) 100%);
        }
        .text{
          flex: 1;
          .nums{
            font-size: 22px;
            letter-spacing: 2px;
          }
        }
        .icon{
          width: 46px;
          height: 48px;
          background: url($url + 'iconSale.png') no-repeat;
          position: absolute;
          right: 10px;
          top: 50%;
          margin-top: -24px;
        }
      }
    }
    .right{
      width: 500px;
    }
  }
  .rankBox{
    .list{
      margin-top: 10px;
      display: flex;
      box-sizing: border-box;
      padding: 0 35px;
      .item{
        flex: 1;
        margin-left: 11px;
        max-width: 25%;
        &:nth-child(1){
          margin-left: 0;
        }
      }
    }
  }
}
</style>

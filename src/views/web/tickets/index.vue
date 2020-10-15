<template>
  <div class="page">
    <p class="pageTitle">出票管理查询</p>
    <div class="searchBox mBox">
      <div class="typeBox">
        <label>彩种：</label>
        <el-select v-model="params.lotteryType" @change="lotteryTypeChange" >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="typeBox ml20" v-if="typeList[currentTypeIndex] && typeList[currentTypeIndex].childs">
        <label>玩法：</label>
        <el-select v-model="params.playType" >
          <el-option
            v-for="item in typeChildsList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="iptBox ml20">
        <label>彩期：</label>
        <el-input v-model="params.issueNo"></el-input>
      </div>
      <div class="iptBox ml20">
        <label>编号：</label>
        <el-input class="max" v-model="params.ticketNo"></el-input>
      </div>
      <div class="typeBox ml20">
        <label>状态：</label>
        <el-select v-model="params.ticketStatus" >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <a class="btnSearch ml20" @click="submit">查询</a>
    </div>
    <div class="mt15 mBox">
      <el-table
        :row-class-name="tableRowClassName"
        :data="ticketListData">
        <el-table-column
          prop="id"
          width="60"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          v-if="isAdmin"
          prop="lotteryShopName"
          align="center"
          label="彩店名称">
        </el-table-column>
        <el-table-column
          prop="issueNo"
          align="center"
          label="彩期">
        </el-table-column>
        <el-table-column
          prop="lotteryType"
          align="center"
          label="彩种">
        </el-table-column>
        <el-table-column
          prop="thirdNo"
          width="200"
          align="center"
          label="投注编号">
        </el-table-column>
        <el-table-column
          width="130"
          label="投注时间"
          align="center"
          prop="createTime">
          <template slot-scope="scope">
            {{ scope.row.createTime ? scope.row.createTime.substring(5,19) : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="130"
          label="截止时间">
          <template slot-scope="scope">
            {{scope.row.printEndTime.substring(5,19)}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="130"
          label="出票时间">
          <template slot-scope="scope">
            {{scope.row.printTime ? scope.row.printTime.substring(5,19) : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          align="center"
          label="投注金额">
        </el-table-column>
        <el-table-column
          prop="taxPrize"
          align="center"
          label="奖金">
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            {{scope.row.ticketStatus ? scope.row.ticketStatus.name : '-'}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="130"
          label="操作">
          <template slot-scope="scope">
            <el-link @click="showDetail(scope.row.id)">查看</el-link>
            <el-link @click="toRemind(scope.row.id)" 
              class="ml10" v-if="scope.row.ticketStatus.value == 'WAIT' && (isAdmin && scope.row.isRemind == 0)">
              提醒
            </el-link>
            <el-link @click="showDetail(scope.row.id)" class="ml10" v-if="scope.row.ticketStatus.value == 'WAIT' && !isAdmin">
              出票
            </el-link>
            <el-link class="ml10" @click="printError(scope.row.id)" v-if="scope.row.ticketStatus.value == 'WAIT' && !isAdmin">退票</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page="params.current"
        @current-change="handleCurrentChange"
        :page-size="params.size"
        layout=" prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      class="detailModal"
      title="投注详情"
      :visible.sync="isShowDetailModal"
      width="800px">
      <p class="textBox boxBg">彩种: {{detailModalData.lotteryType}} / {{detailModalData.playType}}</p>
      <div class="list mt15">
        <div class="item boxBg">
          <el-link class="tx" type="primary">
            <span class="num">{{detailModalData.amount}}</span>元
            <span>{{detailModalData.isAdd == 1 ? '(追加)' : ''}}</span>
          </el-link>
          <p class="sub">投注金额</p>
        </div>
        <div class="item boxBg">
          <el-link class="tx" type="primary">
            <span class="num">{{detailModalData.multiple}}</span>倍
          </el-link>
          <p class="sub">方案倍数</p>
        </div>
        <div class="item boxBg">
          <el-link class="tx" type="primary">
            <span class="num" v-if="detailModalData.ticketStatus">{{detailModalData.ticketStatus.name}}</span>
          </el-link>
          <p class="sub">出票状态</p>
        </div>
        <div class="item boxBg">
          <el-link class="tx" type="primary">
            <span class="num" v-if="detailModalData.winStatus">{{detailModalData.winStatus.name}}</span>
          </el-link>
          <p class="sub">开奖状态</p>
        </div>
      </div>
      <p class="textBox boxBg mt15">
        方案内容: 
        <span class="sub">
          {{detailModalData.content}}
        </span>
      </p>
      <p class="textBox boxBg mt15">
        投注内容: 
        <span class="sub">
          {{detailModalData.passType || detailModalData.playType}}
          -
          {{detailModalData.betType}}
        </span>
      </p>
      <div class="betContent mt15">
        <template v-if="detailModalData.detailList">
          <div class="item boxBg" v-for="item in detailModalData.detailList" :key="item.viewRaceNo">
            <p>{{item.viewRaceNo}} {{item.teamContent}}</p>
            <p class="plan" v-html="item.planContent"></p>
          </div>
        </template>
        <template v-if="!detailModalData.detailList">
          <div class="item boxBg">
            {{detailModalData.content}}
          </div>
        </template>
      </div>

      <p class="textBox boxBg mt15" v-if="detailModalData.sendRemark">
        失败原因： {{detailModalData.sendRemark}}
      </p>
      <el-button v-if="isShowTicketPrint" class="btnSubmit" type="primary" @click="ticketPrint(detailModalData.id)">立即出票</el-button>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'index',
  created () {
    this.getTicketTypeList();
    this.getTicketStatusList();
    this.getTicketListPage();
    this.timer = setInterval ( () => {
      this.getTicketListPage();
    },60000)
  },
  data () {
    return {
      timer: '',
      statusList: '',
      typeList: '',
      currentTypeIndex: 0,
      params: {
        lotteryType: null,
        playType: null,
        ticketStatus: "WAIT",
        issueNo: null,
        ticketNo: null,
        size: 10,
        current: 1,
        orderBy: 'create_time',
        asc: '', // asc 正 desc 倒
      },
      total: 0,
      ticketListData: [],
      isShowDetailModal: false,
      detailModalData: '',
      lotteryTypeIsChange: false, 
    }
  },
  computed: {
    isShowTicketPrint: function () {
      return !this.isAdmin && (this.detailModalData.ticketStatus && this.detailModalData.ticketStatus.value == 'WAIT')
    },
    isAdmin: function () {
      let userInfo = sessionStorage.getItem('userInfo'),
          isAdmin;
      if(userInfo){
        userInfo = JSON.parse(userInfo);
        isAdmin = (userInfo.userType.value == "ADMIN")
      }
      return isAdmin;
    },  
    typeChildsList: {
      get () {
        let list = this.typeList[this.currentTypeIndex].childs;
        list.unshift({
          name: '全部',
          value: null
        })
        return list;
      },
      set () {

      }
    }
  },
  methods: {
    // 设置 已提醒 的数据 样式 class
    tableRowClassName ({row, rowIndex}) {
      if(row.ticketStatus.value == 'WAIT' && row.isRemind == 1){
        return 'isRemind'
      }
      return '';
    },
    // 获取状态
    getTicketStatusList () {
      this.$api.getTicketStatusList().then(data => {
        this.statusList = data.data;
        this.statusList.unshift({
          name: '全部',
          value: null
        })
      })
    },
    // 获取彩种列表
    getTicketTypeList () {
      this.$api.getTicketTypeList().then(data => {
        this.typeList = data.data;
        this.typeList.unshift({
          name: '全部',
          value: null
        })
      });
    },
    // 彩种切换 -- 改变对应子玩法列表
    lotteryTypeChange (val) {
      this.params.playType = null;
      this.typeChildsList = [];
      this.lotteryTypeIsChange = true
      this.typeList.map((v, k) => {
        if(v.value == val) {
          this.currentTypeIndex = k;
        }
      })
    },
    // 获取列表
    getTicketListPage () {
      this.lotteryTypeIsChange && (this.params.current = 1);
      this.params.asc = this.params.ticketStatus == "OVER" ? 'desc' : 'asc';
      this.$api.getTicketListPage(this.params).then(data => {
        if(data.data.records && data.data.records.length > 0){
          this.ticketListData = data.data.records
          this.total = data.data.total;
          this.lotteryTypeIsChange = false;
        }else{
          if(this.params.current >= 2){
            this.params.current = this.params.current - 1;
            this.getTicketListPage();
          }else{
            this.ticketListData = data.data.records
            this.total = data.data.total;
            this.lotteryTypeIsChange = false;
          }
        }
        this.lotteryTypeIsChange = false;
      })  
    },
    submit () {
      this.params.current = 1;
      this.getTicketListPage();
    },
    // 页数修改
    handleCurrentChange (val) {
      this.params.current = val;
      this.getTicketListPage();
    },
    // 获取详情信息
    selectOneById (id) {
      this.$api.selectOneById(id).then( data => {
        this.detailModalData = data.data;
      })
    },
    // 查看详情
    showDetail (id) {
      this.isShowDetailModal = true;
      this.selectOneById(id);
    },
    // 提醒、
    toRemind (id) {
      this.$api.bathRemind(id).then( data => {
        this.$message({
          message: '已开启提起！',
          type: 'success'
        });
        this.getTicketListPage();
      })
    },
    // 出票
    ticketPrint (id) {
      this.$confirm('此操作将直接出票, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.ticketPrint(id).then( data => {
            this.$message({
              type: 'success',
              message: '出票成功!'
            });
            this.isShowDetailModal = false;
            this.handleCurrentChange(this.params.current);
          })
        })
    },
    //退票
    printError (id) {
      this.$prompt('', '失败票原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入出票失败的原因...',
        inputPattern: /\S/,
        inputErrorMessage: '请输入出票失败的原因'
      }).then(({value}) => {
        let params = {
          id: id,
          sendRemark: value
        }
        this.$api.printError(params).then(data => {
          this.$message({
            type: 'success',
            message: '退票成功!'
          });
        })
      })
    }
  },
  destroyed () {
    clearInterval(this.timer);
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
.detailModal{
  .boxBg{
    background: #F8F9FF;
  }
  .textBox{
    font-size: 16px;
    padding: 13px 20px;
  }
  .sub{
    color: #C6C6C6;
    font-size: 12px;
  }
  .list{
    display: flex;
    .item{
      flex: 1;
      margin-left: 15px;
      padding: 28px 0;
      text-align: center;
      &:first-child{
        margin-left: 0;
      }
      .tx{
        margin-bottom: 6px;
        .num{
          font-size: 20px;
          margin-right: 5px;
        }
      }
    }
  }
  .betContent{
    .item{
      margin-bottom: 1px;
      padding: 15px 20px;
      .plan{
        font-size: 12px;
      }
    }
  }
  .btnSubmit{
    display: block;
    width: 30%;
    margin: 15px auto 0;
  }
}


</style>

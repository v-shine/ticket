<template>
  <div class="page">
    <div class="head">
      <p class="pageTitle">彩店管理</p>
      <el-button class="btnAdd" @click="hendlerOpenModal(3)" type="primary">+ 新增彩店</el-button>
    </div>
    <div class="searchBox mBox">
      <div class="typeBox">
        <label>彩店类型：</label>
        <el-select v-model="params.ticketShopType" >
          <el-option
            v-for="item in storeTypeList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="iptBox ml10">
        <label>手机号：</label>
        <el-input v-model="params.mobile" ></el-input>
      </div>
      <div class="typeBox ml10">
        <label>彩店状态：</label>
        <el-select v-model="params.ticketShopStatus" >
          <el-option
            v-for="item in storeStatusList"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-date-picker
        class=" ml10"
        v-model="currentTime"
        type="daterange"
        @change="timeChange"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <a class="btnSearch" @click="getPageList">查询</a>
    </div>

    <div class="mt15 mBox">
      <el-table
        :data="storeDataList"
        style="width: 100%">
        <el-table-column
          prop="id"
          width="60"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="shopName"
          align="center"
          label="彩店名称">
        </el-table-column>
        <el-table-column
          label="彩店类型"
          align="center"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.ticketShopType && scope.row.ticketShopType.name">
              {{scope.row.ticketShopType.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          label="店主姓名">
        </el-table-column>
        <el-table-column
          align="center"
          label="彩店状态">
          <template slot-scope="scope">
            <span v-if="scope.row.ticketShopStatus && scope.row.ticketShopStatus.name">
              {{scope.row.ticketShopStatus.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appSource"
          align="center"
          label="来源">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-link @click="hendlerOpenModal(1, scope.$index, scope.row)" :underline="false">查看</el-link>
            <el-link class="ml10" @click="hendlerOpenModal(2, scope.$index, scope.row)" :underline="false">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="params.size"
        layout=" prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <editModal 
      :visible='isShowEditModal'
      :modalType="modalType" 
      :data="modalData"
      :storeTypeList="storeTypeList.slice(1,storeTypeList.length)"
      :storeStatusList="storeStatusList.slice(1,storeStatusList.length)"
      @handlerClose="handlerCloseModal"
      @handlerSubmit="handlerSubmitModal"
       />
  </div>
</template>

<script>

import editModal from './components/editModal'
export default {
  name: 'App',
  created () {
    this.getShopTypeList();
    this.getShopStatusList();
    this.getPageList();
  },
  components: {editModal},
  data () {
    return {
      storeTypeList: [],
      storeStatusList: [],
      currentTime: [],
      params: {
        ticketShopType: null,
        mobile: null,
        ticketShopStatus: null,
        minTime: null,
        maxTime: null,
        current: 1,
        size: 10
      },
      total: 10,
      storeDataList: [],
      isShowEditModal: false,
      modalType: 1,  // 1 查看 2 编辑 3 新增
      modalData: '',
      currentEditIndex: null, // 当前修改数据的 index
    }
  },
  methods: {
    // 获取彩店类型枚举
    getShopTypeList () {
      this.$api.getShopTypeList().then(data => {
        this.storeTypeList = data.data;
        this.storeTypeList.unshift({value: null, name: '全部'})
      });
    },
    // 获取状态枚举
    getShopStatusList () {
      this.$api.getShopStatusList().then(data => {
        this.storeStatusList = data.data;
        this.storeStatusList.unshift({value: null, name: '全部'})
      });
    },
    // 获取页面列表数据
    getPageList () {
      this.$api.getPageList(this.params).then(data => {
        this.storeDataList = data.data.records;
        this.total = data.data.total;
      })
    },
    // 时间选择器
    timeChange () {
      this.params.minTime = this.currentTime[0];
      this.params.maxTime = this.currentTime[1];
    },
    // 分页 页数切换
    handleCurrentChange (val) {
      this.params.current = val;
      this.getPageList();
    },
    // 关闭弹窗
    handlerCloseModal () {
      this.isShowEditModal = false;
      this.currentEditIndex = null;
    },
    handlerSubmitModal (params) {
      // 编辑
      if(this.modalType == 2){
        this.editStore(params);
      }
      // 新增
      if(this.modalType == 3){
        this.addStore(params);
      }
      this.handlerCloseModal();
    },
    // 新增
    addStore (params) {
      this.$api.addLotteryShop(params).then(data => {
        this.$message({
          message: '新增彩店成功！',
          type: 'success'
        });
        this.getPageList();
      })
    },
    // 编辑
    editStore (params) {
      this.$api.editLotteryShop(params).then(data => {
        this.$message({
          message: '修改彩店成功！',
          type: 'success'
        });
        this.getPageList();
      })
    },

    // 打开弹窗
    hendlerOpenModal (type, index, row) {
      this.modalType = type;
      this.modalData = type == 3 ? null : row;
      this.isShowEditModal = true;
      this.currentEditIndex = index;
    },

    // 查看
    toDetail (row) {

    }
  }
}
</script>
<style type="text/scss" scoped lang="scss">
  .page{
    .head{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .btnAdd{
        height: 28px;
        padding: 0 20px;
      }
    }
  }
</style>
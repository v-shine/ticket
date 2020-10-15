<template>
  <div class="page">
    <div class="head">
      <p class="pageTitle">用户管理查询</p>
      <el-button class="btnAdd" type="primary" @click="hendlerOpenModal(3)">+ 新增用户</el-button>
    </div>
    <div class="searchBox mBox">
      <div class="iptBox">
        <label>用户姓名：</label>
        <el-input v-model="params.name"></el-input>
      </div>
      <div class="typeBox ml20">
        <label>用户状态：</label>
        <el-select v-model="params.status" >
          <el-option
            v-for="item in userStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <a class="btnSearch ml20" @click="getListPage" >查询</a>
    </div>
    <div class="mt15 mBox">
      <el-table
        :data="memberListData">
        <el-table-column
          prop="id"
          width="60"
          align="center"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="用户名">
        </el-table-column>
        <el-table-column
          label="登录帐号"
          prop="loginNo"
          align="center">
        </el-table-column>
        <el-table-column
          prop="lotteryShopId"
          align="center"
          label="彩店ID">
        </el-table-column>
        <el-table-column
          align="center"
          label="用户类型">
          <template slot-scope="scope">
            <span v-if="scope.row.userType && scope.row.userType.name">
              {{scope.row.userType.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="用户状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status && scope.row.status.name">
              {{scope.row.status.name}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-link @click="hendlerOpenModal(1, scope.$index, scope.row)">查看</el-link>
            <el-link class="ml10" @click="hendlerOpenModal(2, scope.$index, scope.row)">编辑</el-link>
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
      @handlerClose="handlerCloseModal"
      @handlerSubmit="handlerSubmitModal"
       />
  </div>
</template>

<script>
import {userType, userStatus} from '@/const'
import editModal from './components/editModal'
import {encrypt} from '@/utils'
export default {
  name: 'index',
  components: {
    editModal
  },
  created () {
      this.getListPage();
  },
  data () {
    return {
        userType: userType,
        userStatus: userStatus,
        params: {
            name: null,
            status: null,
            current: 1,
            size: 10
        },
        total: 0,
        memberListData: [],
        isShowEditModal: false,
        modalType: null,
        modalData: null,

    }
  },
  methods: {
      getListPage () {
          this.$api.getListPage(this.params).then(data =>{
              this.memberListData = data.data.records;
              this.total = data.data.total;
          })
      },
      handleCurrentChange (val) {
          this.params.current = val;
          this.getListPage();
      },
      handlerCloseModal () {
        this.isShowEditModal = false;
        this.modalType = null;
      },
      handlerSubmitModal (params) {
        let newParams = JSON.parse(JSON.stringify(params));
        newParams.loginPwd = encrypt(params.loginPwd);
        // 编辑
        if(this.modalType == 2) {
          this.editUser(newParams);
        }
        // 新增
        if(this.modalType == 3) {
          this.addUser(newParams);
        }
        this.handlerCloseModal();
      },
      addUser (params) {
        this.$api.addUser(params).then(data => {
          this.$message({
            message: '新增用户成功！',
            type: 'success'
          });
          this.getListPage();
        });
      },
      editUser (params) {
        this.$api.editUser(params).then(data => {
          this.$message({
            message: '修改用户信息成功！',
            type: 'success'
          });
          this.getListPage();
        });
      },

      hendlerOpenModal (type, index, row) {
        this.modalType = type;
        this.isShowEditModal = true;
        this.modalData = row;
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
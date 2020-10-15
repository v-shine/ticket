<template>
  <div class="editModal">
    <el-dialog
        title="用户信息"
        :visible.sync="visibleModal"
        @close="handlerClose"
        width="738px">
        <div class="row">
            <div class="col">
                <label>用户姓名：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.name" />
            </div>
            <div class="col">
                <label>彩店ID：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.lotteryShopId" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>登录账号：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.loginNo" />
            </div>
            <div class="col">
                <label>登录密码：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.loginPwd" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <label>用户类型：</label>
                <el-select :disabled="isDisabled || modalType == 2 || modalType == 3"  v-model="params.userType" class="ipt" placeholder="请选择">
                    <el-option
                        v-for="item in userType"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="col">
                <label>用户状态：</label>
                <el-select :disabled="isDisabled"  v-model="params.status" class="ipt" placeholder="请选择">
                    <el-option
                        v-for="item in userStatus"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <span slot="footer" class="dialog-footer" v-if="modalType!=1">
            <el-button type="primary" @click="handlerSubmit">确认保存</el-button>
            <el-button @click="handlerClose">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import {userType, userStatus} from '@/const'
export default {
  /**
   * modalType // 1 查看 2 编辑 3 新增 
   * visible 弹窗显示/关闭
   * data 默认展示数据 编辑/查看
   *  */  
  name: 'editModal',
  props: ['visible', 'modalType', 'data'],
  created () {
      this.userStatus = JSON.parse(JSON.stringify(userStatus)).splice(1,3);
      this.setParams();
  },
  data () {
      return {
          userType: userType,
          userStatus: null,
          params: {}
      }
  },
  computed: {
      visibleModal: {
          get () {
              return this._props.visible;
          },
          set (val) {

          }
      },
      isDisabled: {
          get () {
              return this._props.modalType == 1
          },
          set (val) {

          }
      }
  },
  methods: {
      handlerClose () {
          this.$emit('handlerClose')
      },
      handlerSubmit () {
          console.log(this.params);
          if(this._props.modalType == 3){
              let arr;
              if (!(arr = Object.keys(this.params).filter(v=>!this.params[v])).length<=0){
                this.$message({
                    message: "请输入完整的用户信息！",
                    type: 'error'
                });
              return
              }
          }
          this.$emit('handlerSubmit', this.params)
      },
      setParams () {
          let { data, modalType } = this._props;
          if(data && modalType !=3) {
            let dataStr = JSON.stringify(data);
            this.params = JSON.parse(dataStr);
            this.params.userType = data.userType.value;
            this.params.status = data.status.value;
          }else{
              this.params = {
                name: null,
                loginNo: null,
                loginPwd: null,
                lotteryShopId: null,
                userType: 'USER'
              }
          }
      }
  },
  watch: {
      'data': function(news, olds) {
          this.setParams();
      }
  }
}
</script>

<style type="text/scss" scoped lang="scss">
    .row{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .col{
            flex:1;
            display: flex;
            align-items: center;
            margin-right: 10px;
        }
        label{
            white-space: nowrap;
            width: 80px;
        }
        .ipt{
            flex: 1;
            max-width: 360px;
        }
    }
</style>

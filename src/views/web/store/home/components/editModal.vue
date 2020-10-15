<template>
  <div class="editModal">
    <el-dialog
        title="彩店信息"
        :visible.sync="visibleModal"
        @close="handlerClose"
        width="738px">
        <div class="row">
            <div class="col">
                <label>彩店名称：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.shopName" />
            </div>
            <div class="col">
                <label>店主姓名：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.userName" />
            </div>
            <div class="col">
                <label>手机号码：</label>
                <el-input :disabled="isDisabled" class="ipt" v-model="params.mobile" />
            </div>
        </div>
        <div class="row">
            <label>身份证号：</label>
            <el-input :disabled="isDisabled" class="ipt" v-model="params.userIdCard" />
        </div>
        <div class="row">
            <label>彩店地址：</label>
            <el-cascader
                @change="cascaderChange"
                :disabled="isDisabled" 
                v-model="addressList"
                :options="options">
            </el-cascader>
            <el-input :disabled="isDisabled" class="addressIpt" v-model="params.address" placeholder="请输入详细地址" />
        </div>
        <div class="row">
            <label>彩店属性：</label>
            <el-select :disabled="isDisabled"  v-model="params.ticketShopType" class="ipt" placeholder="请选择">
                <el-option
                v-for="item in storeTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="row">
            <label>彩店状态：</label>
            <el-radio :disabled="isDisabled" v-model="params.ticketShopStatus" 
                :label="item.value" v-for="item in storeStatusList" 
                :key="item.value">{{item.name}}</el-radio>
        </div>
        <div class="row">
            <label>彩店来源：</label>
            <el-input :disabled="isDisabled" class="ipt" v-model="params.appSource" />
        </div>
        <span slot="footer" class="dialog-footer" v-if="modalType!=1">
            <el-button type="primary" @click="handlerSubmit">确认保存</el-button>
            <el-button @click="handlerClose">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

import options  from '@/const/country-level3-data.js'
export default {
  /**
   * modalType // 1 查看 2 编辑 3 新增 （ 现无查看，查看跳转详情页面）
   * visible 弹窗显示/关闭
   * storeStatusList 彩店状态
   * storeTypeList 彩店类型
   * data 是否有默认数据 如 编辑时显示默认数据
   *  */  
  name: 'editModal',
  props: ['visible', 'storeTypeList', 'storeStatusList', 'modalType', 'data'],
  created () {
      this.setParams();
  },
  data () {
      return {
          options: options,
          addressList: [],
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
          if(this._props.modalType == 3){
              let arr;
              if (!(arr = Object.keys(this.params).filter(v=>!this.params[v])).length<=0){
                this.$message({
                    message: "请输入完整的彩店信息！",
                    type: 'error'
                });
              return
              }
          }
          this.$emit('handlerSubmit', this.params)
      },
      setParams () {
        let { data, modalType } = this._props;
        if(data && modalType != 3){
            let dataStr = JSON.stringify(data);
            this.params = JSON.parse(dataStr);
            this.addressList = [data.provinceName, data.cityName, data.areaName];
            this.params.ticketShopStatus = (data.ticketShopStatus && data.ticketShopStatus.value) ? data.ticketShopStatus.value : null ;
            this.params.ticketShopType = (data.ticketShopType && data.ticketShopType.value) ? data.ticketShopType.value : null ;
        }else{
            this.addressList = [];
            this.params = {
              shopName: null,
              userName: null,
              mobile: null,
              userIdCard: null,
              provinceName: [],
              cityName: null,
              areaName: null,
              address: null,
              ticketShopType: null,
              ticketShopStatus: null
          }
        }
      },
      cascaderChange () {
          this.params.provinceName = this.addressList[0];
          this.params.cityName = this.addressList[1];
          this.params.areaName = this.addressList[2];
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
    .el-cascader{
        width: 200px;
        margin-right: 15px;
    }
    .addressIpt{
       flex: 1;
    }
</style>

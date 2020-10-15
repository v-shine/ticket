<template>
  <div class="ranList">
    <div class="head">
        <el-link type="primary" class="title">{{title}}</el-link>
        <a class="more el-icon-d-arrow-right"></a>
    </div>
    <el-table
      :data="data">
      <el-table-column
        prop="lotteryShopName"
        label="彩店名称">
      </el-table-column>
      <el-table-column
        prop="ticketCount"
        label="张数">
      </el-table-column>
      <el-table-column
        prop="salesVolume"
        label="金额">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: 'rankList',
  props: ['title', 'type', 'data'],
}
</script>

<style type="text/scss" scoped lang="scss">
    .ranList {
        font-size: 14px;
        box-shadow:0px 1px 1px 1px rgba(53,105,253,0.06);
        .head{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 12px;
            height: 40px;
            border-bottom: #F5F8FF solid 1px;
            .more{
                color: #B0B0B0;
            }
        }
    }
</style>

<template>
  <el-dialog title="添加退货" :visible.sync="showDialog" width="70%" height="80%"
             @close="handleClose" @open="handleOpen">

    <el-table border style="width: 100%" :data="tableData" max-height="300px"
              tooltip-effect="dark" highlight-current-row>
      <el-table-column prop="formatId" label="编号" width="100"></el-table-column>
      <el-table-column prop="commodity.name" label="商品名称" width="120"></el-table-column>
      <el-table-column prop="amount" label="数量" width="100"></el-table-column>
      <el-table-column prop="price" label="单价" width="100"></el-table-column>
      <el-table-column :formatter="getSumPrice"  label="总价" width="100"></el-table-column>
      <el-table-column prop="cost_price" label="成本" width="100"></el-table-column>
      <el-table-column prop="other_cost" label="其他成本" width="100"></el-table-column>
      <el-table-column :formatter="getSumCost" label="总成本" width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain
                     @click="handleClick(scope.row)">详情</el-button>&nbsp;
          <!-- 新增编辑弹框子组件 -->
          <OrderInfo :infoVisible="infoVisible" @changeShow="showInfo" :value="infoId" ref="infoRef"></OrderInfo>

          <el-button size="mini" type="primary" plain @click="handleSales(scope.row)">退货</el-button>&nbsp;
          <!-- 新增编辑弹框子组件 -->
          <toSales :salesVisible="salesVisible" :updValue="infoId"
                   @changeShow="showSales" @childFn="handleClose"></toSales>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      &nbsp;&nbsp;&nbsp;
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </div>

  </el-dialog>
</template>

<script>
  import axios from "axios";
  import OrderInfo from "./OrderInfo";
  import ToSales from "./ToSales";

  export default {
    components: {OrderInfo,ToSales},
    // 接受父组件传递的值
    props:{
      addVisible:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        // 控制弹出框显示隐藏
        showDialog:false,
        formLabelWidth: '120px',
        form: {
          did:'',           //主键
          user_id:1,       //业务员id
          amount:'',        //数量
          price:'',        //单价
          cost_price:'',    //成本价
          royalties:'',     //提成
          other_cost:'',    //其他成本
          bill:0,          //有无票据 0无票据 1有票据
          bill_info:'',     //有票据，填写开票资料
          commodity_id:'',  //商品id
          invoice_id:'',    //库存编号
          status:0,        //库存状态 0未出库 1已出库 2退货
          user_name:'',     //客户名称
          address:'',       //地址
          phone:'',         //联系电话
          create_time:'',   //创建时间
          remarks:''        //备注
        },
        orderId:'',
        sumPrice:'',
        sumCost:'',
        infoId:0,
        salesVisible:false,
        infoVisible:false,
        total: null,      // 所有页面的数据
        pageSize: 5,      // 每页显示数量
        currentPage: 1,   // 默认当前显示第一页
        tableData: [{}],
      }
    },
    methods:{
      // 弹出框打开时触发
      handleOpen(){
        //查询orderList
        axios({
          url:'http://localhost:7001/getOrderList',
          method:'get',
          params:{
            page: 1,
            limit: 5
          }
        }).then(res=>{
          this.tableData=res.data.data;
          this.total=res.data.count;
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose(){
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow','false')
        //刷新父组件
        this.$emit('refreshList');
      },
      //查看
      handleClick:function(row) {
        this.infoVisible = true
        this.infoId=row.did
      },
      //退货
      handleSales:function(row) {
        this.salesVisible = true
        this.infoId=row.did
      },
      //pageSize改变触发事件
      handleSizeChange:function(val) {
        console.log('当前页数量: '+val);
        this.pageSize=val;
        axios({
          url:'http://localhost:7001/getOrderList',
          method:'get' ,
          params: {
            page:1,
            limit:val,
          }
        }).then(res=>{
          console.log("切换每页数量后=="+res.data.data.length)
          this.tableData=res.data.data;
          this.total=res.data.count;
        }).catch(function (error) {
          console.log(error)
        })
      },
      //点击当前页数触发事件
      handleCurrentChange:function(val) {
        console.log('当前页: '+val);
        axios({
          url:'http://localhost:7001/getOrderList',
          method:'get' ,
          params: {
            page:val,
            limit:this.pageSize,
          }
        }).then(res=>{
          this.tableData=res.data.data;
          this.total=res.data.count;
        }).catch(function (error) {
          console.log(error)
        })
      },
      //查询总价
      getSumPrice:function(row){
        return row.amount*row.price;
      },
      //查询总成本
      getSumCost:function(row){
        return row.amount*row.cost_price+row.other_cost;
      },
      // 监听查看功能 子组件弹窗关闭后触发，有子组件调用
      showInfo(data){
        if(data === 'false'){
          this.infoVisible = false
        }else{
          this.infoVisible = true
        }
      },
      // 监听退货功能 子组件弹窗关闭后触发，有子组件调用
      showSales(data) {
        if (data === 'false') {
          this.salesVisible = false
        } else {
          this.salesVisible = true
        }
      },
    },
    watch:{
      // 监听 addOrUpdateVisible 改变
      addVisible(oldVal,newVal){
        this.showDialog = this.addVisible
      },
    }
  }
</script>

<style scoped>

</style>

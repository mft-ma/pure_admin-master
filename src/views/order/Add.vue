<template>
  <el-dialog title="添加订单" :visible.sync="showDialog" width="50%" @close="handleClose" @open="handleOpen">

    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="cas号">
        <el-input v-model="cas" placeholder="请输入cas号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="commodityName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="queryCommunity">查找产品</el-button>
      </el-form-item>
    </el-form>

    <el-form :model="form" ref="formRef">
      <el-form-item label="商品名称" :label-width="formLabelWidth">
        <el-select v-model="form.commodity_id" placeholder="请选择商品" @change="getInventoryId">
          <el-option v-for="dept in commodityData"
                     :key="dept.sid"
                     :label="dept.name"
                     :value="dept.sid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.amount" placeholder="请输入数量"></el-input>
      </el-form-item>
      <el-form-item label="单价" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.price" placeholder="请输入单价"></el-input>
      </el-form-item>
      <el-form-item label="成本" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.cost_price" placeholder="请输入成本"></el-input>
      </el-form-item>
      <el-form-item label="其他成本" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.other_cost" placeholder="请输入其他成本"></el-input>
      </el-form-item>
      <el-form-item label="有无票据" :label-width="formLabelWidth" prop="gender">
        <el-switch v-model="form.bill" active-color="#13ce66"></el-switch><!-- @change="updateBill"-->
      </el-form-item>
      <el-form-item v-if="form.bill" label="开票资料" :label-width="formLabelWidth" prop="gender">
        <el-input type="textarea" v-model="form.bill_info" placeholder="请输入开票资料"></el-input>
      </el-form-item>
      <el-form-item label="库存编号" :label-width="formLabelWidth" prop="gender">
        <el-select v-model="form.invoice_id" placeholder="请选择库存编号">
          <el-option v-for="dept in inventoryData"
                     :key="dept.number"
                     :label="dept.number"
                     :value="dept.number">
          </el-option>
        </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="insertInventory">添加库存</el-button>
        <Inventory :inventoryVisible="inventoryVisible" :value="infoId" @changeShow="showInventory" ref="addRef"></Inventory>
      </el-form-item>
      <el-form-item label="客户名称" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.user_name" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.address" placeholder="请输入客户地址"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.phone" placeholder="请输入客户联系电话"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">提 交</el-button>
      <el-button @click="reset">重 置</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import axios from "axios";
  import Inventory from "./Inventory";

  export default {
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
        commodityName:'',
        cas:'',
        commodityData:[],
        inventoryData:[],
        infoId:0,
        inventoryVisible:false
      }
    },
    // 使用子组件
    components:{
      Inventory
    },
    methods:{
      //query按钮
      queryCommunity:function () {
        alert(this.commodityName);
        alert(this.cas);
        axios({
          url:'http://localhost:7001/queryCommodityList',
          method:'get' ,
          params: {
            commodityName:this.commodityName,
            cas:this.cas,
          }
        }).then(res=>{
          this.commodityData=res.data;
        }).catch(function (error) {
          console.log(error)
        })
      },
      // 弹出框打开时触发
      handleOpen(){
        //查询commodityList
        axios({
          url:'http://localhost:7001/commodityList',
          method:'get'
        }).then(res=>{
          this.commodityData=res.data;
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose(){
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow','false')
      },
      //下拉框改变时触发事件  商品名称选中就在库存编号下拉框赋值库存编号
      getInventoryId:function(){
        this.form.invoice_id=''
        // alert(this.form.commodity_id);
        //根据commodity_id查询对应的inventory_id库存编号
        axios.get('http://localhost:7001/queryInventoryByCommodity?id='+this.form.commodity_id)
        .then(res => {
          console.log(res)
          this.inventoryData=res.data
        }).catch(function (error) {
          console.log(error);
        })
      },
      //打开发票开关，显示输入发票资料的文本域
      updateBill:function(){
        // alert(this.form.bill);
        if(this.form.bill){//打开开关->显示发票资料
          document.getElementById("bill_info").style.display=''
        }else{//关闭开关->隐藏发票资料
          document.getElementById("bill_info").style.display='none'
        }
      },
      //重置
      reset:function () {
        // this.$refs.formRef.resetFields()
        this.form=this.$options.data.call(this).form
      },
      // 按钮点击事件 显示新增编辑弹窗组件
      insertInventory:function(){
        // alert(this.form.commodity_id);
        this.infoId=this.form.commodity_id
        // alert(this.infoId);
        this.inventoryVisible = true
      },
      // 监听添加库存功能 子组件弹窗关闭后触发，有子组件调用
      showInventory(data){
        if(data === 'false'){
          this.inventoryVisible = false
        }else{
          this.inventoryVisible = true
        }
      },
      //提交按钮  添加订单
      onSubmit:function () {
        this.form.bill=this.form.bill?1:0
        axios({
          url: 'http://localhost:7001/addOrder',
          method: 'post',
          data:this.form
        }).then(res => {
          console.log(res)
          if(res.data){
            this.$message('添加成功');
            this.showDialog=false;
            this.$emit('refreshList');
          }else{
            this.$message('添加失败');
          }
        }).catch(function (error) {
          console.log(error);
        })
      }
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

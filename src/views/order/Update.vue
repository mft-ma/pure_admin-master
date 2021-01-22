<template>
  <el-dialog title="修改商品" :visible.sync="showDialog" append-to-body
             width="50%" @close="handleClose" @open="handleOpen">
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
      <el-form-item label="ID" hidden :label-width="formLabelWidth">
        <el-input v-model="form.did"></el-input>
      </el-form-item>
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
        <el-switch v-model="form.bill" active-color="#13ce66"></el-switch>
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
        </el-select>
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

  export default {
    // 接受父组件传递的值
    props: {
      updVisible: {
        type: Boolean,
        default: false
      },
      updValue: {
        type: Number,
        default: function () {
          return 0
        }
      }
    },
    data() {
      return {
        // 控制弹出框显示隐藏
        showDialog: false,
        formLabelWidth: '120px',
        form: {
          did:'',           //主键
          user_id:1,       //业务员id
          amount:'',        //数量
          price:'',        //单价
          cost_price:'',    //成本价
          royalties:'',     //提成
          other_cost:'',    //其他成本
          bill:false,          //有无票据 0无票据 1有票据
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
        orderId: 0,
        sumPrice:'',
        sumCost:'',
        commodityName:'',
        cas:'',
        commodityData:[],
        inventoryData:[],
      }
    },
    methods: {
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
      // 弹出框打开后触发
      handleOpen() {
        //查询commodityList
        axios({
          url:'http://localhost:7001/commodityList',
          method:'get'
        }).then(res=>{
          this.commodityData=res.data;
        }).catch(function (error) {
          console.log(error);
        })
        this.orderId=this.updValue
        //查询user info
        axios({
          url:'http://localhost:7001/queryOrderById',
          params:{
            did:this.orderId
          },
          method:'get'
        }).then(res=>{
          this.form=res.data;
          this.commodityName=res.data.commodity.name;
          this.cas=res.data.commodity.cas;
          this.sumPrice=res.data.amount*res.data.price
          this.sumCost=res.data.amount*res.data.cost_price+res.data.other_cost
          this.commodityName=res.data.commodity.name
          this.form.bill=res.data.bill==0?false:true;
          this.form.invoice_id=res.data.inventory.number
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose() {
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow', 'false')
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
      //重置
      reset: function () {
        this.form=this.$options.data.call(this).form
      },
      //提交按钮
      onSubmit: function () {
        this.form.bill=this.form.bill?1:0
        axios({
          url: 'http://localhost:7001/udpOrder',
          method: 'post',
          data:this.form
        }).then(res => {
          console.log(res)
          if(res.data){
            this.$message('修改成功');
            this.showDialog=false;
            this.$emit('refreshList');
          }else{
            this.$message('修改失败');
          }
        }).catch(function (error) {
          console.log(error);
        })
      }
    },
    watch: {
      // 监听 addOrUpdateVisible 改变
      updVisible(oldVal, newVal) {
        this.showDialog = this.updVisible
      },
    }
  }
</script>

<style scoped>

</style>

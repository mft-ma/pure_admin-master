<template>
  <el-dialog title="商品介绍" :visible.sync="showDialog" append-to-body
             width="50%" @close="handleClose" @open="handleOpen">
    <el-form :model="form">
      <el-form-item label="ID" hidden :label-width="formLabelWidth">
        <el-input v-model="form.did"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" :label-width="formLabelWidth">
        <el-input v-model="commodityName"></el-input>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input v-model="form.amount"></el-input>
      </el-form-item>
      <el-form-item label="单价" :label-width="formLabelWidth">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="总价" :label-width="formLabelWidth">
        <el-input v-model="sumPrice"></el-input>
      </el-form-item>
      <el-form-item label="成本" :label-width="formLabelWidth">
        <el-input v-model="form.cost_price"></el-input>
      </el-form-item>
      <el-form-item label="其他成本" :label-width="formLabelWidth">
        <el-input v-model="form.other_cost"></el-input>
      </el-form-item>
      <el-form-item label="总成本" :label-width="formLabelWidth">
        <el-input v-model="sumCost"></el-input>
      </el-form-item>
      <el-form-item label="提成" :label-width="formLabelWidth">
        <el-input v-model="form.royalties"></el-input>
      </el-form-item>
      <el-form-item label="客户姓名" :label-width="formLabelWidth">
      <el-input v-model="form.user_name"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
      <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="开票资料" :label-width="formLabelWidth">
        <el-input v-model="form.bill_info"></el-input>
      </el-form-item>
      <el-form-item label="库存编号" :label-width="formLabelWidth">
        <el-input v-model="form.invoice_id"></el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.remarks"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">我知道了</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import axios from "axios";

  export default {
    // 接受父组件传递的值
    props:{
      infoVisible:{
        type: Boolean,
        default: false,
      },
      value:{
        type: Number ,
        default:function() {
          return 0
        }
      }
    },
    data(){
      return{
        // 控制弹出框显示隐藏
        showDialog:false,
        formLabelWidth: '120px',
        form: {
          did:'',           //主键
          user_id:'',       //业务员id
          amount:'',        //数量
          price:'',        //单价
          cost_price:'',    //成本价
          royalties:'',     //提成
          other_cost:'',    //其他成本
          bill:'',          //有无票据 0无票据 1有票据
          bill_info:'',     //有票据，填写开票资料
          commodity_id:'',  //商品id
          invoice_id:'',    //库存编号
          status:'',        //库存状态 0未出库 1已出库 2退货
          user_name:'',     //客户名称
          address:'',       //地址
          phone:'',         //联系电话
          create_time:'',   //创建时间
          remarks:''        //备注
        },
        orderId:0,
        sumPrice:'',
        sumCost:'',
        commodityName:''
      }
    },
    methods:{
      // 弹出框打开后触发
      handleOpen(){
        this.orderId=this.value
        //查询user info
        axios({
          url:'http://localhost:7001/queryOrderById',
          params:{
            did:this.orderId
          },
          method:'get'
        }).then(res=>{
          this.form=res.data;
          this.sumPrice=res.data.amount*res.data.price
          this.sumCost=res.data.amount*res.data.cost_price+res.data.other_cost
          this.commodityName=res.data.commodity.name
          this.form.invoice_id=res.data.inventory.number
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose(){
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow','false')
      }
    },
    watch:{
      // 监听 infoVisible 改变
      infoVisible(oldVal,newVal){
        this.showDialog = this.infoVisible
      },
    }
  }
</script>

<style scoped>

</style>

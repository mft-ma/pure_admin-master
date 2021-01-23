<template>
  <el-dialog title="退货记录详情" :visible.sync="showDialog" append-to-body
             width="50%" @close="handleClose" @open="handleOpen">
    <el-form :model="form">
      <el-form-item label="ID" hidden :label-width="formLabelWidth">
        <el-input v-model="form.did"></el-input>
      </el-form-item>
      <el-form-item label="业务员id" :label-width="formLabelWidth">
        <el-input v-model="form.user_id"></el-input>
      </el-form-item>
      <el-form-item label="订单编号" :label-width="formLabelWidth">
        <el-input v-model="form.order_id"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" :label-width="formLabelWidth">
        <el-input v-model="commodityName"></el-input>
      </el-form-item>
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input v-model="orderAmount"></el-input>
      </el-form-item>
      <el-form-item label="物流公司名称" :label-width="formLabelWidth">
        <el-input v-model="form.tracking_name"></el-input>
      </el-form-item>
      <el-form-item label="物流编号" :label-width="formLabelWidth">
        <el-input v-model="form.tracking_number"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" :label-width="formLabelWidth">
        <el-input v-model="form.create_time"></el-input>
      </el-form-item>
      <el-form-item label="退货状态" :label-width="formLabelWidth">
        <el-input v-model="form.status"></el-input>
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
          did:'',               //主键
          user_id:'',           //业务员id
          order_id:'',          //订单id
          tracking_number:'',   //物流编号
          tracking_name:'',     //物流公司名称
          status:'',            //退货状态
          create_time:'',       //创建时间
        },
        salesId:0,
        commodityName:'',
        orderAmount:'',
      }
    },
    methods:{
      // 弹出框打开后触发
      handleOpen(){
        this.salesId=this.value
        //查询sales info
        axios({
          url:'http://localhost:7001/querySalesByID',
          params:{
            did:this.salesId
          },
          method:'get'
        }).then(res=>{
          this.form=res.data;
          this.commodityName=res.data.order.commodity.name;
          this.orderAmount=res.data.order.amount;
          this.form.status=res.data.status==0?'未收到货':'已收到货';
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

<template>
  <el-dialog title="订单退货" :visible.sync="showDialog" width="50%" append-to-body
             @close="handleClose" @open="handleOpen">

    <el-form :model="form" ref="formRef">
      <el-form-item label="退货单号" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.tracking_number" placeholder="请输入退货单号"></el-input>
      </el-form-item>
      <el-form-item label="物流公司" :label-width="formLabelWidth" prop="gender">
        <el-input v-model="form.tracking_name" placeholder="请输入物流公司"></el-input>
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
    props:{
      salesVisible:{
        type: Boolean,
        default: false
      },
      updValue:{
        type:Number,
        default: 0
      }
    },
    data(){
      return{
        // 控制弹出框显示隐藏
        showDialog:false,
        formLabelWidth: '120px',
        form: {
          did:'',               //主键
          user_id:1,            //业务员id
          order_id:'',          //订单id
          tracking_number:'',   //物流编号
          tracking_name:'',     //物流公司名称
          status:'',            //退货状态  0未收到退货 1已收到
          create_time:0,        //创建时间
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
    methods:{
      // 弹出框打开时触发
      handleOpen(){
        this.form.order_id=this.updValue;
      },
      // 弹出框关闭后触发
      handleClose(){
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow','false')
      },
      //重置
      reset:function () {
        this.form=this.$options.data.call(this).form
      },
      //提交按钮  添加订单
      onSubmit:function () {
        axios({
          url: 'http://localhost:7001/addSales',
          method: 'post',
          data:this.form
        }).then(res => {
          console.log(res)
          if(res.data){
            this.$message('添加成功');
            this.showDialog=false;
            this.$emit('childFn');
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
      salesVisible(oldVal,newVal){
        this.showDialog = this.salesVisible
      },
    }
  }
</script>

<style scoped>

</style>

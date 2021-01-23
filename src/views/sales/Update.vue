<template>
  <el-dialog title="修改商品" :visible.sync="showDialog" append-to-body
             width="50%" @close="handleClose" @open="handleOpen">
    <el-form :model="form">
      <el-form-item label="ID" hidden :label-width="formLabelWidth">
        <el-input v-model="form.did"></el-input>
      </el-form-item>
      <el-form-item label="物流公司名称" :label-width="formLabelWidth">
        <el-input v-model="form.tracking_name"></el-input>
      </el-form-item>
      <el-form-item label="物流编号" :label-width="formLabelWidth">
        <el-input v-model="form.tracking_number"></el-input>
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
          did:'',               //主键
          tracking_number:'',   //物流编号
          tracking_name:'',     //物流公司名称
        },
        salesId:0,
        commodityName:'',
        orderAmount:'',
      }
    },
    methods: {
      // 弹出框打开后触发
      handleOpen() {
        this.salesId=this.updValue
        //查询sales info
        axios({
          url:'http://localhost:7001/querySalesByID',
          params:{
            did:this.salesId
          },
          method:'get'
        }).then(res=>{
          this.form=res.data;
        }).catch(function (error) {
          console.log(error);
        })
      },
      // 弹出框关闭后触发
      handleClose() {
        // 子组件调用父组件方法，并传递参数
        this.$emit('changeShow', 'false')
      },
      //重置
      reset: function () {
        this.form=this.$options.data.call(this).form
      },
      //提交按钮
      onSubmit: function () {
        axios({
          url: 'http://localhost:7001/updateSales',
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

<template>
    <div><!--退货管理-->
        <br>
        <el-form :inline="true" class="demo-form-inline">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="物流编号">
                <el-input v-model="tracking_number" placeholder="请输入物流编号"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item label="产品名称">
                <el-input v-model="commodityName" placeholder="请输入产品名称"></el-input>
            </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item>
                <el-button type="success" @click="queryList">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button @click="delBatch(sels)" :disabled="this.sels.length === 0">批量删除</el-button>
            <el-button @click="saveUser">添加</el-button>
            <!-- 新增编辑弹框子组件 -->
            <Add :addVisible="addVisible" @changeShow="showAdd"
                 @refreshList="queryList" ref="addRef"></Add>
        </el-row>

        <el-table border style="width: 100%" :data="tableData" max-height="470px"
                  tooltip-effect="dark" @selection-change="selsChange"
                  :cell-style="tableRowStyleName" highlight-current-row>
            <el-table-column fixed type="selection" width="55"></el-table-column>
            <el-table-column prop="formatId" label="编号" width="100"></el-table-column>
            <el-table-column prop="user_id" label="业务员id" width="100"></el-table-column>
            <el-table-column prop="order.formatId" label="订单编号" width="120"></el-table-column>
            <el-table-column prop="order.commodity.name" label="商品名称" width="120"></el-table-column>
            <el-table-column prop="order.amount" label="数量" width="100"></el-table-column>
            <el-table-column prop="tracking_name" label="物流公司" width="100"></el-table-column>
            <el-table-column prop="tracking_number" label="物流编号" width="120"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
            <el-table-column label="退货状态" width="120">
                <template slot-scope="scope">
                    <el-button size="small" round @click="handleUpdStatus(scope.row)"
                               :type="scope.row.status == 0 ?'danger':'success'">
                        {{scope.row.status==0?'未收到':'已收到'}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
                <template slot-scope="scope">
                    <el-button size="mini" type="info" plain
                               @click="handleClick(scope.row)">详情</el-button>
                    <!-- 新增编辑弹框子组件 -->
                    <info :infoVisible="infoVisible" @changeShow="showInfo" :value="infoId" ref="infoRef"></info>

                    <el-button size="mini" type="primary" plain
                               @click="handleEdit(scope.row)">编辑</el-button>
                    <!-- 新增编辑弹框子组件 -->
                    <update :updVisible="updVisible" @changeShow="showUpd" :updValue="infoId"
                            @refreshList="queryList" ref="updRef"></update>

                    <el-button size="mini" type="danger" plain
                               @click="handleDelete(scope.row)">删除</el-button>

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
    </div>
</template>

<script>
    import axios from 'axios'
    import Info from './Info'
    import Add from "./Add"
    import Update from "./Update";

    export default {
        data() {
            return {
                listId:'',
                commodityName:'',
                tracking_number:'',
                tableData: [{}],
                // 所有页面的数据
                total: null,
                // 每页显示数量
                pageSize: 5,
                // 默认当前显示第一页
                currentPage: 1,
                sels: [],//选中的值显示
                // 控制新增编辑弹窗的显示与隐藏
                addVisible: false,
                infoVisible:false,
                updVisible:false,
                infoId:0
            }
        },
        // 使用子组件
        components:{
            Add,
            Info,
            Update
        },
        methods: {
            //设置未收到货的退货订单背景为红色
            tableRowStyleName({row}) {
                if(row.status == 0){
                    return 'background-color: #f8a9a0';
                }
            },
            // 按钮点击事件 显示新增编辑弹窗组件
            saveUser(){
                this.addVisible = true
            },
            //查看
            handleClick:function(row) {
                this.infoVisible = true
                this.infoId=row.did
            },
            //修改
            handleEdit:function(row) {
                this.updVisible = true
                this.infoId=row.did
            },
            //刷新表格
            refresh:function(){
                //刷新table
                axios({
                    url:'http://localhost:7001/salesList',
                    method:'post' ,
                    data: {
                        page:this.currentPage,
                        limit:this.pageSize,
                    }
                }).then(res=>{
                    console.log(res)
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                })
            },
            //删除sales
            handleDelete:function(row) {
                axios.get("http://localhost:7001/delSales?id="+row.did).then(res=>{
                    if(res.data){
                        //刷新table
                        this.refresh();
                    }
                }).catch(function (error) {
                    console.log(error);
                })
            },
            //退货状态按钮事件  状态改为已收到&库存添加对应数量&订单提成归零
            handleUpdStatus:function(row){
                if(row.status==0){
                    axios({
                        url:'http://localhost:7001/updateSalesStatus?did='+row.did,
                        method:'get'
                    }).then(res=>{
                        if(res.data){
                            this.$message.info("货已收到了哦")
                            this.refresh();
                        }
                    }).catch(function (error) {
                        console.log(error)
                    })
                }else{
                    this.$message.info("已出库了哦")
                }
            },
            //query按钮
            queryList:function () {
                axios({
                    url:'http://localhost:7001/salesList',
                    method:'post' ,
                    data: {
                        page:this.currentPage,
                        limit:this.pageSize,
                        commodityName:this.commodityName,
                        tracking_number:this.tracking_number,
                        commodityUser:null
                    }
                }).then(res=>{
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //重置
            reset:function () {
                this.commodityName='';
                this.tracking_number='';
            },
            //pageSize改变触发事件
            handleSizeChange:function(val) {
                console.log('当前页数量: '+val);
                this.pageSize=val;
                axios({
                    url:'http://localhost:7001/salesList',
                    method:'post' ,
                    data: {
                        page:1,
                        limit:val,
                        commodityName:this.commodityName,
                        tracking_number:this.tracking_number,
                        commodityUser:null
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
                    url:'http://localhost:7001/salesList',
                    method:'post' ,
                    data: {
                        page:val,
                        limit:this.pageSize,
                        commodityName:this.commodityName,
                        tracking_number:this.tracking_number,
                        commodityUser:null
                    }
                }).then(res=>{
                    this.tableData=res.data.data;
                    this.total=res.data.count;
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //全选
            selsChange:function(sels) {
                this.sels = sels
            },
            //批量删除
            delBatch:function () {
                var ids= this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
                console.log("ids==="+ids)
                this.$confirm('此操作将永久删除该文件及其子文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.get("http://localhost:7001/delBatchSales?ids="+ids).then(res=>{
                        //刷新table
                        this.refresh();
                    }).catch(function (error) {
                        console.log(error);
                    })
                    console.log("删除成功")
                })
            },
            // 监听添加功能 子组件弹窗关闭后触发，有子组件调用
            showAdd(data){
                if(data === 'false'){
                    this.addVisible = false
                }else{
                    this.addVisible = true
                }
            },
            // 监听查看功能 子组件弹窗关闭后触发，有子组件调用
            showInfo(data){
                if(data === 'false'){
                    this.infoVisible = false
                }else{
                    this.infoVisible = true
                }
            },
            // 监听修改功能 子组件弹窗关闭后触发，有子组件调用
            showUpd(data) {
                if (data === 'false') {
                    this.updVisible = false
                } else {
                    this.updVisible = true
                }
            }
        },
        //文档就绪
        beforeCreate:function() {
            //查询order list
            axios({
                url:'http://localhost:7001/salesList',
                method:'post' ,
                data: {
                    page:1,
                    limit:5,
                    commodityName:this.commodityName,
                    tracking_number:this.tracking_number,
                    commodityUser:null
                }
            }).then(res=>{
                console.log(res)
                console.log(res.data)
                console.log(res.data.data)
                this.tableData=res.data.data;
                this.total=res.data.count;
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
</script>

<style scoped>
    .el-table .warning-row {
        background: #f8a9a0;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>

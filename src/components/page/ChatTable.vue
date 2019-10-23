<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
<!--                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">-->
<!--                    <el-option key="1" label="广东省" value="广东省"></el-option>-->
<!--                    <el-option key="2" label="湖南省" value="湖南省"></el-option>-->
<!--                </el-select>-->
                <el-select    @change="selectWay" v-model="sel" clearable placeholder='活动' class="handle-select mr10">
                        <el-option v-for="item in op" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center">
                    <template slot-scope="scope">{{scope.row.activityId}}</template>
                </el-table-column>
                <el-table-column label="所属活动">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="所属群组">
                    <template slot-scope="scope">{{scope.row.groupName}}</template>
                </el-table-column>
                <el-table-column label="发送人">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column label="发送内容">
                    <template slot-scope="scope">{{scope.row.chatContent}}</template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageIndex"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import request from "../../utils/request";
    export default {
        name: 'ChatTable',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                url: request.url,  //图片基地址
                idx: -1,  //索引
                id: -1,  //id
                fileList:[],  //图片上传前的选取
                params:null,  //放图片的
                sel:0,   //状态标记
                op:[]
            };
        },
        created() {

            this.getActivity();

        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData(aid) {
                request.fetchPost('/wechatwall/select',{activityId:aid}).then((res)=>{
                    this.tableData = res.data.data[0]["data"]
                    this.pageTotal = this.tableData.length;
                    console.log(this.tableData)
                }).catch((err=>{
                    console.log(err)
                }))

            },
          //获取活动
          getActivity(){
             let that=this
             request.fetchPost('activity/select').then(function (res) {

                that.op=res.data.data[0]['data']
               if(that.op.length>0)
               {
                   that.sel= that.op[0].activityId;
                   that.getData(that.sel)
               }

          }).catch(function (er){


          })
         },
            //活动选择的时候
         selectWay(e){
                if(this.sel>0)
                {
                      this.getData(this.sel);
                }

         },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData(this.sel);
            },


            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>

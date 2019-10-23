<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 投票记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center">
                    <template slot-scope="scope">{{scope.row.voteNoteId}}</template>
                </el-table-column>
<!--                <el-table-column prop="name" label="用户名"></el-table-column>-->
                <el-table-column label="投票标题">
                    <template slot-scope="scope">{{scope.row.voteTitle}}</template>
                </el-table-column>
                <el-table-column label="组名称">
                    <template slot-scope="scope">{{scope.row.groupName}}</template>
                </el-table-column>
                <el-table-column label="所属活动" align="center">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                  <el-table-column label="投票人" align="center">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                 <el-table-column label="投票选项" align="center">
                    <template slot-scope="scope">{{scope.row.optionsName}}</template>
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
    name: 'groupTable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            optionsList:[],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible:false,
            voteVisible:false,
            pageTotal: 0,
            form: {
                name:''
            },
            zx:'',
            idx: -1,
            id: -1,
            fileList:[],
            sel:-1,  //活动选择
            grl:-1,  //组选择
            radio:'false',
            op:[],
            opIf:false,  //是否可修改
            opId:-1, //选项id
            group:[],
            dic:{}  // 一条完整的数据
        };
    },
    created() {
        this.getActivity();

    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData(aid) {
            request.fetchPost('/vote/voteNote/select',{activityId:aid,page:this.query.pageIndex}).then((res)=>{
                this.tableData = res.data.data[0]["data"]
                this.pageTotal = res.data.data[0]['count']
                console.log(res.data.data)
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
                   that.$set(that.query, 'pageIndex', 1);
                   that.sel = that.op[0].activityId;
                   that.getData(that.sel)
               }

          }).catch(function (er){


          })
         },
            //活动选择的时候
         selectWay(e){
                if(this.sel>0)
                {     this.$set(this.query, 'pageIndex', 1);
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
            this.getData(this.sel);
        },


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

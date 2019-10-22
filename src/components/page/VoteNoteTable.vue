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
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
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
        this.getData();

    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            request.fetchPost('/vote/voteNote/select').then((res)=>{
                this.tableData = res.data.data[0]["data"]
                console.log(res.data.data)
            }).catch((err=>{
                console.log(err)
            }))

        },

        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },

        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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

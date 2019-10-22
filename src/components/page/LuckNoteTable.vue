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
                    <template slot-scope="scope">{{scope.row.luckyNoteId}}</template>
                </el-table-column>
<!--                <el-table-column prop="name" label="用户名"></el-table-column>-->
                <el-table-column label="中奖人">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column label="所属活动" align="center">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                  <el-table-column label="中奖礼品" align="center">
                    <template slot-scope="scope">{{scope.row.giftName}}</template>
                </el-table-column>
                  <el-table-column label="礼品图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="url + scope.row.giftPhoto"
                            :preview-src-list="[ url+ scope.row.giftPhoto]"
                        ></el-image>
                    </template>
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
    name: 'luckNote',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            url:'http://192.168.0.99:8081',
            tableData: [],
            optionsList:[],
            multipleSelection: [],
            delList: [],
            pageTotal: 0,
            idx: -1,
            id: -1,
            fileList:[],
        };
    },
    created() {
        this.getData();

    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            request.fetchPost('/luck/luckyNote').then((res)=>{
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

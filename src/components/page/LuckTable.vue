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
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                 <el-select    @change="selectWay" v-model="acId" clearable placeholder='活动' class="handle-select mr10">
                        <el-option v-for="item in acArr" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                  <el-button type="primary"  @click="handleAdd">新增</el-button>
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
                    <template slot-scope="scope">{{scope.row.luckyId}}</template>
                </el-table-column>
<!--                <el-table-column prop="name" label="用户名"></el-table-column>-->
                <el-table-column label="抽奖人数">
                    <template slot-scope="scope">{{scope.row.luckyNum}}</template>
                </el-table-column>
                <el-table-column label="抽奖轮数">
                    <template slot-scope="scope">{{scope.row.luckyRoundNum}}</template>
                </el-table-column>
                <el-table-column label="所属活动" align="center">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="用户是否可重复抽奖" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.type===0?'可重复':'不可重复'"
                        >{{scope.row.type===0?'可重复':'不可重复'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>

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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="抽奖人数">
                    <el-input type="number" v-model="form.num"></el-input>
                </el-form-item>
                 <el-form-item label="抽奖轮数">
                    <el-input type="number" v-model="form.roundNum"></el-input>
                </el-form-item>
                <el-form-item>
                      <el-radio  v-model="radio" label='0'>可重复</el-radio>
                     <el-radio  v-model="radio" label='1'>不可重复</el-radio>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select    v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in op" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>

        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
             <el-form>
             <el-form-item label="抽奖人数">
                    <el-input type="number" v-model="form.num"></el-input>
                </el-form-item>
                 <el-form-item label="抽奖轮数">
                    <el-input type="number" v-model="form.roundNum"></el-input>
                </el-form-item>
                <el-form-item>
                      <el-radio  v-model="radio" label='0'>可重复</el-radio>
                     <el-radio  v-model="radio" label='1'>不可重复</el-radio>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select    v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in op" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addLoad">新 增</el-button>
            </span>

        </el-dialog>
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
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible:false,
            pageTotal: 0,
            form: {
                num:0,
                roundNum:0
            },
            idx: -1,
            id: -1,
            fileList:[],
            sel:-1,  //活动选择
            radio:'0',
            op:[],
            dic:{},  // 一条完整的数据
            acId:-1, //下拉查询 活动ID
            acArr:[]  //活动下拉 查询数组
        };
    },
    created() {
       // this.getData();
        this.getActivity();

    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            request.fetchPost('/luck/select',{activityId:this.acId,page:this.query.pageIndex}).then((res)=>{
                this.tableData = res.data.data[0]["data"]
                this.pageTotal = res.data.data[0]["count"]
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
                  that.acArr=res.data.data[0]['data']
               if(that.acArr.length>0)
               {
                   that.acId= that.acArr[0].activityId;
                   that.getData(that.acId)
               }

          }).catch(function (er){


          })
         },
            //活动选择的时候
         selectWay(e){
                if(this.acId>0)
                {
                    this.$set(this.query, 'pageIndex', 1);
                    this.getData(this.acId);
                }

         },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData(this.acId);
            },
        //新增
        handleAdd(){
            this.addVisible=true;
            this.radio='0';
            this.sel=-1;
            this.form.num=0;
            this.form.roundNum=0;
        },

        //  新增数据
        addLoad(){

            let that=this
            let num=that.form.num
            let roundNum =that.form.roundNum
            let aid=that.sel   //活动id
            if(num <1 || roundNum<1 || aid<1 )
            {
                alert('请将数据填写完整')
                return
            }

            request.fetchPost('/luck/add',{luckyNum:that.form.num,luckyRoundNum:that.form.roundNum,activityId:that.sel,type:that.radio=='0'?0:1 }).then(function (res) {
                if(res.data.code==1){
                    that.addVisible=false
                     that.$set(that.query, 'pageIndex', 1);
                    that.getData(that.acId)
                    alert('新增成功')
                }else{

                    alert('新增失败')
                }
            }).catch(function (err) {
                alert(err)
            })
        },
        // 删除操作
        handleDelete(index, row) {
            let that=this;
            request.fetchPost('/luck/delete',{luckyId:row.luckyId}).then(function (res) {
                if(res.data.code==1)
                {
                     that.$set(that.query, 'pageIndex', 1);
                     that.getData(that.acId)
                     alert('删除成功')
                }else {
                    alert('删除失败')
                }

            }).catch(function (err) {
               alert('删除失败')
            })

        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {

            this.idx = index;
            this.dic = row;
            this.sel = row.activityId;
            this.form.num = row.luckyNum;
            this.form.roundNum = row.luckyRoundNum;
            this.radio=row.type===0?'0':'1';
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {

            let that=this
            let num=that.form.num
            let roundNum = that.form.roundNum
            let aid=that.sel



            if(num<1 || roundNum<1 || aid<1)
            {
                alert('请将数据填写完整')
                return
            }

            request.fetchPost('/luck/update',{luckyId:that.dic.luckyId,luckyNum:that.form.num,activityId:that.sel,luckyRoundNum:roundNum,type:that.radio=='0'?0:1 }).then(function (res) {
                if(res.data.code==1){
                    that.editVisible=false
                    that.$set(that.query, 'pageIndex', 1);
                    that.getData(that.acId)
                    alert('修改成功')
                }else{

                    alert('修改失败')
                }
            }).catch(function (err) {
                alert(err)
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData(this.acId);
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

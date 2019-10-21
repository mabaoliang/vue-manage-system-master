<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 礼品表格
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
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
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
                    <template slot-scope="scope">{{scope.row.giftId}}</template>
                </el-table-column>
                <el-table-column label="礼品名称">
                    <template slot-scope="scope">{{scope.row.giftName}}</template>
                </el-table-column>
                <el-table-column label="礼品数量">
                    <template slot-scope="scope">{{scope.row.giftNum}}</template>
                </el-table-column>
                <el-table-column label="礼品图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.giftImg"
                                :preview-src-list="[scope.row.giftImg]"
                        ></el-image>
                    </template>
                </el-table-column>
                <!--<el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                                :type="scope.row.status===1?'已开始':(scope.row.status===0?'未开始':'已开始')"
                        >{{scope.row.status===1?'已开始':(scope.row.status===0?'未开始':'已开始')}}</el-tag>
                    </template>
                </el-table-column>-->
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


        <!-- 新增弹出框-->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="礼品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="礼品数量">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label-width="80px" label="上传图片">
                    　　<!--elementui的上传图片的upload组件-->
                    　　<el-upload
                        　　 class="upload-demo"
                        　　action=""
                        name="codePhoto"
                        　　:limit=1
                        　　:auto-upload=false
                        　　:on-change="onchange"
                        　　:on-remove="handleRemove"
                        　　:file-list="fileList"
                        　　list-type="picture">
                    　　<el-button size="small" type="primary">点击上传</el-button>
                    　　<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    　</el-upload>
                    　　</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGift">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑弹出框-->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="礼品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label-width="80px" label="上传图片">
                    　　<!--elementui的上传图片的upload组件-->
                    　　<el-upload
                        　　 class="upload-demo"
                        　　action=""
                        name="codePhoto"
                        　　:limit=1
                        　　:auto-upload=false
                        　　:on-change="onchange"
                        　　:on-remove="handleRemove"
                        　　:file-list="fileList"
                        　　list-type="picture">
                    　　<el-button size="small" type="primary">点击上传</el-button>
                    　　<!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    　</el-upload>
                    　　</el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { fetchData } from '../../api/index';
    import request from "../../utils/request";
    export default {
        name: 'GiftTable',
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
                addVisible: false,
                pageTotal: 0,
                form: {
                    name:'',
                    num: 0
                },
                idx: -1,
                id: -1,
                fileList:[],
                params:null,
                sel:0,
                op:[{value:0,label:'默认'},
                    {value:1,label:'不默认'}
                ],
                img:null,
                dic:{}  // 一条完整的数据
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                request.fetchPost('/gift/select').then((res)=>{
                    this.tableData = res.data.data[0]["data"]
                    console.log(this.tableData)
                }).catch((err=>{
                    console.log(err)
                }))
                // fetchData(this.query).then(res => {
                //     this.tableData = res.list;
                //     this.pageTotal = res.pageTotal || 50;
                // });
            },
            //新增礼品
            handleAdd(){
                this.addVisible = true;
            },
            //提交新增礼品
            saveGift(){

            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {

                request.fetchPost('/gift/delete',{activityId:row.activityId}).then(function (res) {
                    this.getData()
                    this.$message.success('删除成功');
                }).catch(function (err) {
                    this.$message.success('删除失败');
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
            //图片删除
            handleRemove(file,filesList){

                this.params.delete('file')
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.dic = row;
                this.sel = row.status;
                this.form.name = row.giftName
                this.editVisible = true;
            },

            //图片改变
            onchange(file,filesList){
                this.params = new FormData();
                this.params.append('file', file.raw, file.name);
                alert('--------------')
            },
            // 保存编辑
            saveEdit() {//update
                request.fetImgPost('/wx/upload/file' ,this.params).then(function (res) {
                    //alert(this.params)
                    console.log("123456789"+res.data)
                    this.img = res.data
                    alert(this.img)
                    //console.log(res.data)
                }).catch(function (err) {
                    alert('fail')
                })
                // request.fetchPost('/gift/update',{giftId:row.giftId,giftName:this.form.name,giftImg:this.img}).then(function (res) {
                //     alert("上传成功")
                // }).catch(function (err) {
                //     alert("上传失败")
                // })

                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                // this.$set(this.tableData, this.idx, this.form);
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


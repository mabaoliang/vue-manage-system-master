<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户表格
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
                    <template slot-scope="scope">{{scope.row.userId}}</template>
                </el-table-column>
                <el-table-column label="昵称">
                    <template slot-scope="scope">{{scope.row.userNiceName}}</template>
                </el-table-column>
                <el-table-column label="OpenId">
                    <template slot-scope="scope">{{scope.row.userOpenId}}</template>
                </el-table-column>
                <el-table-column label="用户名称">
                    <template slot-scope="scope">{{scope.row.userName}}</template>
                </el-table-column>
                <el-table-column label="手机号">
                    <template slot-scope="scope">{{scope.row.userTel}}</template>
                </el-table-column>
                <el-table-column label="地址">
                    <template slot-scope="scope">{{scope.row.userAddress}}</template>
                </el-table-column>
                <el-table-column label="用户头像" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="url+scope.row.userPhoto"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="所属活动">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="所属群组">
                    <template slot-scope="scope">{{scope.row.groupName}}</template>
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
        <el-dialog title="添加用户" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="昵称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userNiceName"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="openId">
                    <el-input v-model="form.userOpenId"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-select v-model="form.address" placeholder="地址" class="handle-select mr10">
                        <el-option key="1" label="广东省" value="广东省"></el-option>
                        <el-option key="2" label="湖南省" value="湖南省"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select @change="selectWayB" v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in activity" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属群组">
                    <el-select v-model="gel" clearable placeholder="请选择">
                        <el-option v-for="item in group" :label="item.groupName" :value="item.groupId" :key="item.groupId"></el-option>
                    </el-select>
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
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="昵称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userNiceName"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                 <el-select v-model="form.address" placeholder="地址" class="handle-select mr10">
                        <el-option key="1" label="广东省" value="广东省"></el-option>
                        <el-option key="2" label="湖南省" value="湖南省"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select @change="selectWayA" v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in activity" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属群组">
                    <el-select v-model="gel" clearable placeholder="请选择">
                        <el-option v-for="item in group" :label="item.groupName" :value="item.groupId" :key="item.groupId"></el-option>
                    </el-select>
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
        name: 'UserTable',
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
                    userNiceName:'',
                    phone:'',
                    address:'',
                    userOpenId:''
                },
                idx: -1,
                id: -1,
                fileList:[],
                url:request.url,
                params:null,
                sel:0,
                gel:0,
                op:[{value:0,label:'默认'},
                    {value:1,label:'不默认'}
                ],
                acId:-1, //活动查询的ID
                acArr:[], //活动下拉查询数组
                activity:[],//活动列表
                group:[],//群组列表
                dic:{}  // 一条完整的数据
            };
        },
        created() {

            this.getActivity();
            // this.getGroup();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData(aid) {
                request.fetchPost('/user/select',{activityId:aid,page:this.query.pageIndex}).then((res)=>{
                    this.tableData = res.data.data[0]["data"];
                    this.pageTotal = res.data.data[0]["count"];
                    console.log(this.tableData)
                }).catch((err=>{
                    console.log(err)
                }))
                // fetchData(this.query).then(res => {
                //     this.tableData = res.list;
                //     this.pageTotal = res.pageTotal || 50;
                // });
            },
            //获取活动
            getActivity(){
                let that=this;
                request.fetchPost('/activity/select').then(function (res) {

                    that.activity=res.data.data[0]['data']
                    that.acArr = res.data.data[0]['data']
                    if(that.acArr.length>0)
                    {

                        that.acId = that.acArr[0].activityId
                        that.getData(that.acId)
                    }
                }).catch(function (er){


                })
            },
            //获取群组
            getGroup(){
                let that=this;
                request.fetchPost('/group/selectId',{activityId:that.sel}).then(function (res) {

                    that.group=res.data.data[0]['data']
                }).catch(function (er){
                })
            },
            //图片改变
            onchange(file,filesList){
                this.params = new FormData();
                this.params.append('file', file.raw, file.name);
            },
            //图片删除
            handleRemove(file,filesList){
                this.params.delete('file')
            },
            //添加
            handleAdd(){
                this.addVisible = true;
                this.sel = -1;
                this.gel = -1;
            },
            //提交新增用户信息
            addUser(){
                let that=this;
                let username = that.form.name;
                let userNiceN = that.form.userNiceName;
                let openid = that.form.userOpenId;
                let tel = that.form.phone;
                let address = that.form.address;
                let aid=that.sel;
                let gid=that.gel;

                request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {

                    request.fetchPost('/user/add',{userName:username,userNiceName:userNiceN,userOpenId:openid,userPhoto:res.data.message,userTel:tel,userAddress:address,
                        activityId:aid,groupId:gid}).then(function (res) {

                        if(res.data.code==200)
                        {
                            that.$set(that.query, 'pageIndex', 1);
                            that.getData(that.acId);
                            that.addVisible=false;
                            alert('新增成功')
                        }else
                        {
                            alert('新增失败')
                        }

                    }).catch(function (err) {

                        alert('新增失败--')
                    })

                }).catch(function (err) {
                    alert(err)
                })

            },

            //活动选择的时候
         selectWay(e){
                if(this.acId>0)
                {     this.$set(this.query, 'pageIndex', 1);
                      this.getData(this.acId);
                }

         },

             // 编辑时的
        selectWayA(e){
             this.gel =-1;
             this.getGroup(this.sel);
        },
        //新增时
        selectWayB(e){
                this.gel =-1;
               this.getGroup(this.sel);
        },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData(this.acId);
            },
            // 删除操作
            handleDelete(index, row) {
                let that=this;
                request.fetchPost('/user/delete',{userId:row.userId}).then(function (res) {
                    if(res.data.code==200){
                        that.$set(that.query, 'pageIndex', 1);
                        that.getData(that.acId)
                        alert('删除成功');
                    }else{
                        alert(res.data.message)
                    }
                }).catch(function (err) {
                    //this.getData()
                    alert('删除失败--')
                });

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
                this.gel = row.groupId;
                this.form.userNiceName = row.userNiceName;
                this.form.name = row.userName;
                this.form.phone = row.userTel;
                this.form.address = row.userAddress;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let that=this;
                let uid=that.dic.userId;
                let gid=that.gel;
                let aid=that.sel;
                let uname=that.form.name;
                let nickname=that.form.userNiceName;
                let address=that.form.address;
                let tel=that.form.phone;
                if(uname.length<1) {
                    alert('请将数据填写完整')
                    return
                }
                this.editVisible = false;
                if (that.params!=null && that.params.get('file')) {
                    request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {
                        request.fetchPost('/user/update',{userId:uid,userName:uname,userNiceName:nickname,userPhoto:res.data.message,userAddress:address,userTel:tel,activityId:aid,groupId:gid}).then(function (res) {
                            if (res.data.code==200)
                            {
                                that.$set(that.query, 'pageIndex', 1);
                                that.getData(that.acId)
                                alert('修改成功')
                            }else {
                                alert('修改失败')
                            }
                        }).catch(function (err) {
                            alert('修改失败--')
                        })
                    }).catch(function (err) {
                        alert(err)
                    })
                }else {
                    request.fetchPost('/user/update',{userId:uid,userName:uname,userNiceName:nickname,userPhoto:that.dic.userPhoto,userAddress:address,userTel:tel,activityId:aid,groupId:gid}).then(function (res) {
                        if(res.data.code==200){
                            that.$set(that.query, 'pageIndex', 1);
                            that.getData(that.acId)
                            alert('修改成功')
                        }else {
                            alert('修改失败')
                        }
                    }).catch(function (err) {
                        // that.getData()
                        alert('修改失败--')
                    })
                }
                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                // this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData(this.acId);
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

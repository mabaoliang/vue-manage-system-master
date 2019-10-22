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
                <el-table-column label="所属活动">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="礼品图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="url+scope.row.giftImg"
                        ></el-image>
                        <!--:preview-src-list="[scope.row.giftImg]"-->
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
        <el-dialog title="添加礼品" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="礼品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="礼品数量">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in activity" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
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
                <el-button type="primary" @click="saveGift">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑弹出框-->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="礼品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="礼品数量">
                    <el-input v-model="form.num"></el-input>
                </el-form-item>
                <el-form-item label="所属活动">
                    <el-select v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in activity" :label="item.activityName" :value="item.activityId" :key="item.activityId"></el-option>
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
        name: 'GiftTable',
        data() {
            return {
                query: {
                    address: '',
                    name: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                url:'http://192.168.0.23:8085',
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                addVisible: false,
                pageTotal: 0,
                form: {
                    name:'',
                    num: 0,
                    activityName:''
                },
                idx: -1,
                id: -1,
                fileList:[],
                params:null,
                sel: 0,
                op:[{value:0,label:'默认'},
                    {value:1,label:'不默认'}
                ],
                activity:[],
                img:null,
                dic:{}  // 一条完整的数据
            };
        },
        created() {
            this.getData();
            this.getActivity();//查询活动列表
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
                this.name = '';
                this.sel = -1;
                this.num = 0
            },
            //获取活动
            getActivity(){
                let that=this;
                request.fetchPost('/activity/select').then(function (res) {

                    that.activity=res.data.data[0]['data']
                }).catch(function (er){


                })
            },
            //提交新增礼品
            saveGift(){
                let that=this;
                let name1=that.form.name;
                let aid=that.sel;
                let number = that.form.num;
                var re = /^[0-9]+.?[0-9]*$/;

                if(name1.length<1 || !re.test(aid))
                {
                    alert('请将数据填写完整');
                    return
                }
                request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {

                    request.fetchPost('/gift/add',{giftName:name1,giftNum:number,giftImg:res.data.message,activityId:aid}).then(function (res) {

                        if(res.data.code==200)
                        {
                            that.getData();
                            that.addVisible=false;
                            alert('新增成功')
                        }else
                        {
                            alert('新增失败')
                        }

                    }).catch(function (err) {
                        that.getData();
                        alert('新增失败--')
                    })

                }).catch(function (err) {
                    alert(err)
                })
            },

            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                let that=this;
                request.fetchPost('/gift/delete',{giftId:row.giftId}).then(function (res) {
                    if(res.data.code==-1)
                    {
                        alert(res.data.message)

                    }else
                    {
                        that.getData()
                        alert('删除成功');
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
            //图片删除
            handleRemove(file,filesList){

                this.params.delete('file')
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.dic = row;
                this.sel = row.status;
                this.form.name = row.giftName;
                this.form.num = row.giftNum;
                this.form.activityName = row.activityName;
                this.editVisible = true;
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
            // 保存编辑
            saveEdit() {//update
                let that=this;
                let gum=that.form.num;
                let gid=that.tableData[that.idx].giftId;
                let nameA=that.form.name;
                let aid=that.sel;

                if(nameA.length<1)
                {
                    alert('请将数据填写完整')
                    return
                }

                this.editVisible = false;
                if (that.params!=null && that.params.get('file'))
                {
                    request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {

                        request.fetchPost('/gift/update',{giftId:gid,giftNum:gum,giftName:nameA,activityId:aid,giftImg:res.data.message}).then(function (res) {

                            if (res.data.code==200)
                            {     that.getData()
                                alert('修改成功')
                            }else {

                                alert('修改失败')
                            }

                        }).catch(function (err) {
                            // that.getData()
                            alert('修改失败--')
                        })

                    }).catch(function (err) {
                        alert(err)
                    })
                }else
                {
                    request.fetchPost('/gift/update',{activityId:aid, giftName:nameA,giftId:gid, giftImg:that.dic.giftImg,giftNum:gum}).then(function (res) {
                        if(res.data.code==200)
                        {
                            that.getData()
                            alert('修改成功')
                        }else {
                            alert('修改失败')
                        }

                    }).catch(function (err) {
                        // that.getData()
                        alert('修改失败--')

                    })
                }
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


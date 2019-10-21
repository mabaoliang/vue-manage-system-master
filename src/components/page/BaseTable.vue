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
                    <template slot-scope="scope">{{scope.row.activityId}}</template>
                </el-table-column>
<!--                <el-table-column prop="name" label="用户名"></el-table-column>-->
                <el-table-column label="活动名称">
                    <template slot-scope="scope">{{scope.row.activityName}}</template>
                </el-table-column>
                <el-table-column label="图片(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="url + scope.row.codePhoto"
                            :preview-src-list="[ url+ scope.row.codePhoto]"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.status===1?'已开始':(scope.row.status===0?'未开始':'已开始')"
                        >{{scope.row.status===1?'已开始':(scope.row.status===0?'未开始':'已开始')}}</el-tag>
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
                <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="状态选择">
                    <el-select v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in op" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="地址">-->
<!--                    <el-input v-model="form.address"></el-input>-->
<!--                </el-form-item>-->
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

         <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="活动名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="状态选择">
                    <el-select v-model="sel" clearable placeholder="请选择">
                        <el-option v-for="item in op" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="地址">-->
<!--                    <el-input v-model="form.address"></el-input>-->
<!--                </el-form-item>-->
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
                <el-button type="primary" @click="addLoad">新 增</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
import request from "../../utils/request";
export default {
    name: 'basetable',
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
            editVisible: false,   //编辑
            addVisible:false, //新增
            pageTotal: 0,
            url: 'http://192.168.0.99:8081',  //图片基地址
            form: {
                name:''
            },  // form 数据
            idx: -1,  //索引
            id: -1,  //id
            fileList:[],  //图片上传前的选取
            params:null,  //放图片的
            sel:0,   //状态标记
            op:[{value:0,label:'未开始'},
                {value:1,label:'已开始'},
                {value:2,label:'已结束'}
            ],
            dic:{}  // 一条完整的数据
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            request.fetchPost('/activity/select').then((res)=>{
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

       //新增
        handleAdd:function(){

            this.addVisible=true
            this.form.name=''
            this.sel=0
     },
        //新增数据
        addLoad:function(){
            let that =this;

            let nameA=that.form.name
            let status=that.sel
            var re = /^[0-9]+.?[0-9]*$/

            if(nameA.length<1 || !re.test(status) ||  that.params==null || !that.params.get('file'))
            {
                alert('请将数据填写完整')
                return
            }

            request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {

                  request.fetchPost('/activity/add',{activityName:nameA,status: status, codePhoto:res.data.message}).then(function (res) {

                      if(res.data.code==1)
                      {
                          that.getData()
                          that.addVisible=false
                          alert('新增成功')
                      }else
                      {
                          alert('新增失败')
                      }

                  }).catch(function (err) {
                      that.getData()
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
            request.fetchPost('/activity/delete',{activityId:row.activityId}).then(function (res) {
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
            this.sel = row.status;
            this.form.name = row.activityName
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
        saveEdit() {

            let that=this
            let aid=that.tableData[that.idx].activityId
            let nameA=that.form.name
            let status=that.sel
            var re = /^[0-9]+.?[0-9]*$/

            if(nameA.length<1 || !re.test(status))
            {
                alert('请将数据填写完整')
                return
            }

             this.editVisible = false;
             if (that.params!=null && that.params.get('file'))
             {
                 request.fetImgPost('/wx/upload/file' ,that.params).then(function (res) {

                  request.fetchPost('/activity/update',{activityId:aid, activityName:nameA,status: status, codePhoto:res.data.message}).then(function (res) {

                      if (res.data.code==1)
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
                 request.fetchPost('/activity/update',{activityId:aid, activityName:nameA,status: status, codePhoto:that.dic.codePhoto}).then(function (res) {

                     if(res.data.code==1)
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

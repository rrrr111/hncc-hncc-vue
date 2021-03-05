<template>
  <div class="app-container">
    <el-row :span="40">
      <el-col :span="4">
        <div class="grid-content bg-purple">
        <Catalog @getDiseCatalogId="getListDiseByCatalogId($event)" />
        </div>
       </el-col>
      <el-col :span="36">
        <el-row :span="30">
        <div class="grid-content bg-purple-light">

          <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
            <el-row :span="1.5">
              <el-form-item label="疾病编码" prop="code">
                <el-input
                  v-model="queryParams.code"
                  placeholder="请输入疾病编码"
                  clearable
                  size="small"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            <el-form-item label="疾病名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入疾病名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="ICD编码" prop="icd">
              <el-input
                v-model="queryParams.icd"
                placeholder="请输入ICD编码"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            </el-row>
          </el-form>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['dms:dise:add']"
          >新增
          </el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['dms:dise:edit']"
          >修改
          </el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['dms:dise:remove']"
          >删除
          </el-button>
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['dms:dise:export']"
          >导出
          </el-button>
        <el-table  :data="diseList" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="id" align="center" prop="id"/>
          <el-table-column label="目录id" align="center" prop="catId"/>
          <el-table-column label="疾病编码" align="center" prop="code"/>
          <el-table-column label="疾病名称" align="center" prop="name"/>
          <el-table-column label="ICD编码" align="center" prop="icd"/>
          <el-table-column label="状态" align="center" prop="status"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['dms:dise:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['dms:dise:remove']"
              >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

          <pagination
            style="float: right"
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />


        <!-- 添加或修改诊断类型（疾病）对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="疾病编码" prop="code">
              <el-input v-model="form.code" placeholder="请输入疾病编码"/>
            </el-form-item>
            <el-form-item label="疾病名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入疾病名称"/>
            </el-form-item>
            <el-form-item label="ICD编码" prop="icd">
              <el-input v-model="form.icd" placeholder="请输入ICD编码"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        </div>
        </el-row>
      </el-col>

    </el-row>
  </div>
</template>

<script>
  import {listDise, getDise, delDise, addDise, updateDise, exportDise} from "../../../api/dms/dise/dise";
  import Catalog from "../diseCatalog/index"

  export default {
    components: {
      Catalog
    },
    name: "Dise",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 诊断类型（疾病）表格数据
        diseList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          catId: null,
          code: null,
          name: null,
          icd: null,
          status: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.diseList = [];
      this.total = 0;
    },
    methods: {
      //根据目录类型获取疾病列表
      getListDiseByCatalogId(id){
      this.queryParams.catId = id;
      this.getList();
      },
      /** 查询诊断类型（疾病）列表 */
      getList() {
        this.loading = true;
        listDise(this.queryParams).then(response => {
          this.diseList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          catId: null,
          code: null,
          name: null,
          icd: null,
          status: 0
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加诊断类型（疾病）";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getDise(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改诊断类型（疾病）";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDise(this.form, this.form.id).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {

              if(this.queryParams.catId==null || this.queryParams.catId==undefined){
                this.msgSuccess("请选择疾病分类");
              }else {
                this.form.catId = this.queryParams.catId;
                addDise(this.form).then(response => {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                });
              }

            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除诊断类型（疾病）编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDise(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有诊断类型（疾病）数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportDise(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>

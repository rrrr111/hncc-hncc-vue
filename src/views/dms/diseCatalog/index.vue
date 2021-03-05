<template>
  <div class="app-container" style="display: inline-block;width: 200px;">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item  prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入疾病分类名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
          @input="handleQuery"
        />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['dms:catalog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dms:catalog:remove']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" @row-click="tableRowClick" :data="catalogList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="疾病分类名"  prop="name" />
    </el-table>

    <el-row :gutter="10" class="mb8">
    <el-tag>共{{Math.abs(parseInt((total%10==0?(total/10):(total/10+1))))}}页</el-tag>
    <el-pagination
      @pagination="getList"
      :total="total"
      @current-change="currentchange"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :page-size="10"
      @prev-click="prevclick"
      @next-click="nextclick"
      layout="prev, next, jumper"
    >
    </el-pagination>
    </el-row>

    <!-- 添加或修改诊断类型（疾病）目录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="疾病分类名" prop="name">
          <el-input v-model="form.name" placeholder="请输入疾病分类名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCatalog, getCatalog, delCatalog, addCatalog, updateCatalog, exportCatalog } from "../../../api/dms/disecacalog/catalog";

export default {
  name: "Catalog",
  components: {
  },
  data() {
    return {
      pageTotal:0,
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
      // 诊断类型（疾病）目录表格数据
      catalogList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //点击表格某一行
    tableRowClick(row, column, event){
    console.log(row.id)
      this.$emit('getDiseCatalogId', row.id)
    },
    //当前页数发生改变
    currentchange(pageNum){
      this.queryParams.pageNum=pageNum;
      this.getList();
    },
    //下一页
    nextclick(pageNum){
      this.queryParams.pageNum=pageNum;
      this.getList();
    },
    //上一页
    prevclick(pageNum){
      this.queryParams.pageNum=pageNum;
      this.getList();
    },
    /** 查询诊断类型（疾病）目录列表 */
    getList() {
      this.loading = true;
      listCatalog(this.queryParams).then(response => {
        this.catalogList = response.data.list;
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
        name: null,
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加诊断类型（疾病）目录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCatalog(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改诊断类型（疾病）目录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCatalog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCatalog(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除诊断类型（疾病）目录编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCatalog(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有诊断类型（疾病）目录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCatalog(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>

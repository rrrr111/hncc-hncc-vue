<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="药品编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入药品编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入药品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药品规格" prop="format">
        <el-input
          v-model="queryParams.format"
          placeholder="请输入药品规格"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药品单价" prop="price">
        <el-input
          v-model="queryParams.price"
          placeholder="请输入药品单价"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包装单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入包装单位"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <el-input
          v-model="queryParams.manufacturer"
          placeholder="请输入生产厂家"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药品剂型" prop="dosageId">
        <el-input
          v-model="queryParams.dosageId"
          placeholder="请输入药品剂型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="药品类型" prop="typeId">
        <el-input
          v-model="queryParams.typeId"
          placeholder="请输入药品类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="拼音助记码" prop="mnemonicCode">
        <el-input
          v-model="queryParams.mnemonicCode"
          placeholder="请输入拼音助记码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-date-picker clearable size="small"
                        v-model="queryParams.createDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input
          v-model="queryParams.stock"
          placeholder="请输入库存"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通用名" prop="genericName">
        <el-input
          v-model="queryParams.genericName"
          placeholder="请输入通用名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item label="药品类型" prop="typeId">
        <el-select
          v-model="queryParams.typeId"
          placeholder="药品类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in drugTypeOption"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['dms:drug:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['dms:drug:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['dms:drug:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['dms:drug:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="drugList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="药品编码" align="center" prop="code"/>
      <el-table-column label="药品名称" align="center" prop="name"/>
      <el-table-column label="药品规格" align="center" prop="format"/>
      <el-table-column label="药品单价" align="center" prop="price"/>
      <el-table-column label="包装单位" align="center" prop="unit"/>
      <el-table-column label="生产厂家" align="center" prop="manufacturer"/>
      <el-table-column label="药品剂型" align="center" prop="dosageName"/>
      <el-table-column label="药品类型" align="center" prop="typeId" :formatter="drugFormat"/>
      <el-table-column label="拼音助记码" align="center" prop="mnemonicCode"/>
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="stock"/>
      <el-table-column label="通用名" align="center" prop="genericName"/>
      <el-table-column label="状态" align="center" prop="status"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['dms:drug:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['dms:drug:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改药品项目（包括了重要、中成药、草药）对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="药品编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入药品编码"/>
        </el-form-item>
        <el-form-item label="药品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入药品名称"/>
        </el-form-item>
        <el-form-item label="药品规格" prop="format">
          <el-input v-model="form.format" placeholder="请输入药品规格"/>
        </el-form-item>
        <el-form-item label="药品单价" prop="price">
          <el-input v-model="form.price" placeholder="请输入药品单价"/>
        </el-form-item>
        <el-form-item label="包装单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入包装单位"/>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家"/>
        </el-form-item>
        <el-form-item label="药品剂型" prop="dosageId">
          <el-select
            :value-key="form.dosageId"
            v-model="form.dosageId"
            placeholder="请输入药品剂型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in dosageListAll"
              :key="dict.id"
              :label="dict.name"
              :value="dict.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="药品类型" prop="typeId">
          <el-select
            :value-key="form.typeId"
            v-model="form.typeId"
            placeholder="药品类型"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="dict in drugTypeOption"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拼音助记码" prop="mnemonicCode">
          <el-input v-model="form.mnemonicCode" placeholder="请输入拼音助记码"/>
        </el-form-item>
        <el-form-item label="创建时间" prop="createDate">
          <el-date-picker clearable size="small"
                          v-model="form.createDate"
                          type="datetime"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入库存"/>
        </el-form-item>
        <el-form-item label="通用名" prop="genericName">
          <el-input v-model="form.genericName" placeholder="请输入通用名"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">停用</el-radio>
            <el-radio label="1">启用</el-radio>
          </el-radio-group>
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
  import {listDrug, getDrug, delDrug, addDrug, updateDrug, exportDrug} from "../../../api/dms/drug/drug";
  import {listAllDosage} from "../../../api/dms/dosage/dosage"

  export default {
    name: "Drug",
    components: {},
    data() {
      return {
        //药品类型列表
        drugTypeOption: [],
        //所有的药品剂型列表
        dosageListAll: [],
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
        // 药品项目（包括了重要、中成药、草药）表格数据
        drugList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          code: null,
          name: null,
          format: null,
          price: null,
          unit: null,
          manufacturer: null,
          dosageId: null,
          typeId: null,
          mnemonicCode: null,
          createDate: null,
          stock: null,
          genericName: null,
          status: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getDosageListAll();
      this.getList();
      this.getDicts("drug_type").then(response => {
        this.drugTypeOption = response.data;
      });
    },
    methods: {
      //药品类型格式化
      drugFormat(row, column) {
        return this.selectDictLabel(this.drugTypeOption, row.typeId);
      },
      //获得所有的药品剂型列表
      getDosageListAll() {
        listAllDosage().then(response => {
          this.dosageListAll = response.data;
        })
      },
      /** 查询药品项目（包括了重要、中成药、草药）列表 */
      getList() {
        this.loading = true;
        listDrug(this.queryParams).then(response => {
          this.drugList = response.data.list;
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
          code: null,
          name: null,
          format: null,
          price: null,
          unit: null,
          manufacturer: null,
          dosageId: null,
          typeId: null,
          mnemonicCode: null,
          createDate: null,
          stock: null,
          genericName: null,
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
        this.title = "添加药品项目（包括了重要、中成药、草药）";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getDrug(id).then(response => {
          this.form = response.data;
          this.form.typeId = this.form.typeId.toString();
          this.form.dosageId = this.form.dosageId.toString();
          this.open = true;
          this.title = "修改药品项目（包括了重要、中成药、草药）";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateDrug(this.form,this.form.id).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addDrug(this.form).then(response => {
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
        this.$confirm('是否确认删除药品项目（包括了重要、中成药、草药）编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delDrug(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有药品项目（包括了重要、中成药、草药）数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportDrug(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>

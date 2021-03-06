<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="科室id" prop="deptId">
        <treeselect
          style="width: 200px"
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="true"
          @select="treeselectChange"
          :disable-branch-nodes="true"
          placeholder="请选择执行科室"
        >
        </treeselect>
      </el-form-item>

      <el-form-item label="医生名称" prop="staffId">
        <el-input
          v-model="queryParams.staffName"
          placeholder="请输入医生名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="值班日期" prop="date">
        <el-date-picker clearable size="small"
                        v-model="queryParams.date"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择值班日期">
        </el-date-picker>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sms:skd:remove']"
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
          v-hasPermi="['sms:skd:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="skdList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="上班日期" align="center" prop="date" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余号数" align="center" prop="remain"/>
      <el-table-column label="午别" align="center" prop="noon">
        <template slot-scope="scope">
          <span>{{ scope.row.noon=='0'?"上午":"下午" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值班医生" align="center" prop="staffName"/>
      <el-table-column label="挂号级别" align="center" prop="registrationRankName"/>
      <el-table-column label="科室" align="center" prop="deptName"/>
      <el-table-column label="挂号限额" align="center" prop="skLimit"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"treeselectChange
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sms:skd:remove']"
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

    <!-- 添加或修改排班时间对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上班日期" prop="date">
          <el-date-picker clearable size="small"
                          v-model="form.date"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择上班日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="剩余号数" prop="remain">
          <el-input v-model="form.remain" placeholder="请输入剩余号数"/>
        </el-form-item>
        <el-form-item label="午别" prop="noon">
          <el-input v-model="form.noon" placeholder="请输入午别"/>
        </el-form-item>
        <el-form-item label="员工id" prop="staffId">
          <el-input v-model="form.staffId" placeholder="请输入员工id"/>
        </el-form-item>
        <el-form-item label="科室id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入科室id"/>
        </el-form-item>
        <el-form-item label="挂号限额" prop="skLimit">
          <el-input v-model="form.skLimit" placeholder="请输入挂号限额"/>
        </el-form-item>
        <el-form-item label="挂号限额" prop="smsSkdRuleId">
          <el-input v-model="form.smsSkdRuleId" placeholder="请输入挂号限额"/>
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
  import {listSkd, getSkd, delSkd, addSkd, updateSkd, exportSkd} from "../../../api/sms/skd/skd";
  import {listDeptTree} from "../../../api/system/dept";
  import treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    name: "Skd",
    components: {treeselect},
    data() {
      return {
        //执行科室树状列表
        deptOptions: [],
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
        // 排班时间表格数据
        skdList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          date: null,
          staffName: null,
          deptId: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      listDeptTree().then(response => {
        this.deptOptions = response.data
      });
    },
    methods: {
      //部门选择
      treeselectChange(node, instanceId) {
        this.queryParams.deptId = node.id;
        this.getList();
      },
      /** 查询排班时间列表 */
      getList() {
        this.loading = true;
        listSkd(this.queryParams).then(response => {
          this.skdList = response.data.list;

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
          date: null,
          status: 0,
          remain: null,
          noon: null,
          staffId: null,
          deptId: null,
          skLimit: null,
          smsSkdRuleId: null
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
        this.title = "添加排班时间";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getSkd(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改排班时间";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateSkd(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addSkd(this.form).then(response => {
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
        this.$confirm('是否确认删除排班时间编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delSkd(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有排班时间数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportSkd(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>

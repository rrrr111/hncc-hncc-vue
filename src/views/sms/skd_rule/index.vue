<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="执行科室" prop="dept">
        <treeselect
          v-model="queryParams.deptId"
          :options="deptOptions"
          :show-count="true"
          @select="treeselectChange"
          :disable-branch-nodes="true"
          placeholder="请选择执行科室"
        >
        </treeselect>
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
          v-hasPermi="['sms:rule:add']"
        >新增
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
          v-hasPermi="['sms:rule:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ruleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="规则名称" align="center" prop="ruleName"/>
      <el-table-column label="规则描述" align="center" prop="description"/>
      <el-table-column label="科室" align="center" prop="deptName"/>
      <el-table-column label="创建人" align="center" prop="operatorName"/>
      <el-table-column label="创建时间" align="operateTime" prop="operateTime" width="180"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sms:rule:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="generatePlanMethod(scope.row)"
            v-hasPermi="['sms:rule:remove']"
          >生成排班时间
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

    <!-- 添加或修改排班规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="开始时间" prop="operatorId">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="operatorId">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
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
  import {listRule, delRule, addRule, updateRule, exportRule, generatePlan} from "../../../api/sms/skd_rule/skd_rule";
  import {listDeptTree} from "../../../api/system/dept";
  import treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    components: {treeselect},
    name: "index",
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
        // 排班规则表格数据
        ruleList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          status: null,
          operatorId: null,
          operateTime: null,
          ruleName: null,
          description: null,
          deptId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
    },
    methods: {
      //生成排班计划
      generatePlanMethod(row) {
        this.open = true;
        this.form.skdRuleId = row.id;


      },
      //点击新增跳转
      handleAdd() {
        this.$destroy(true);
        this.$router.push("/skd/skd_rule_item");
      },
      //部门选择
      treeselectChange(node, instanceId) {
        this.queryParams.deptId = node.id;
        this.getList();
      },
      /** 查询排班规则列表 */
      getList() {
        this.loading = true;
        listRule(this.queryParams).then(response => {
          this.ruleList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
        listDeptTree().then(response => {
          this.deptOptions = response.data
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
          status: 0,
          operatorId: null,
          operateTime: null,
          ruleName: null,
          description: null,
          deptId: null
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

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.$router.push({
          path: "/skd/skd_rule_item", query: {
            id: row.id
          }
        });
        // this.reset();
        // const id = row.id || this.ids
        // getRule(id).then(response => {
        //   this.form = response.data;
        //   this.open = true;
        //   this.title = "修改排班规则";
        // });
      },
      /** 提交按钮 */
      submitForm() {
        if (new Date(this.form.startTime) > new Date(this.form.endTime)) {
          this.msgError("结束时间不能早于开始时间");
          return false;
        }

        console.log(this.form)
        generatePlan(this.form).then(respon => {

          this.msgSuccess("生成成功");
          this.form={
            skdRuleId:undefined,
            startTime:undefined,
            endTime:undefined
          }
          this.open = false;
          this.getList();

        })

      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除排班规则编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delRule(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有排班规则数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportRule(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>

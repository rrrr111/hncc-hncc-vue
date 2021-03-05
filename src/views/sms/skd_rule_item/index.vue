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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="treeselectChange"
        >清空
        </el-button>
      </el-col>
    </el-row>


    <el-table v-loading="loading" :data="ruleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="医生名称" align="center" prop="userName"/>
      <el-table-column label="星期一上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.oneUp" false-label="0" true-label="1"
                       :checked="scope.row.oneUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期一下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.oneDown" false-label="0" true-label="1"
                       :checked="scope.row.oneDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期二上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.twoUp" false-label="0" true-label="1"
                       :checked="scope.row.twoUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期二下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.twoDown" false-label="0" true-label="1"
                       :checked="scope.row.twoDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期三上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.threeUp" false-label="0" true-label="1"
                       :checked="scope.row.threeUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期三下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.threeDown" false-label="0" true-label="1"
                       :checked="scope.row.threeDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期四上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.fourUp" false-label="0" true-label="1"
                       :checked="scope.row.fourUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期四下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.fourDown" false-label="0" true-label="1"
                       :checked="scope.row.fourDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期五上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.fiveUp" false-label="0" true-label="1"
                       :checked="scope.row.fiveUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期五下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.fiveDown" false-label="0" true-label="1"
                       :checked="scope.row.fiveDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期六上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sixUp" false-label="0" true-label="1"
                       :checked="scope.row.sixUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期六下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sixDown" false-label="0" true-label="1"
                       :checked="scope.row.sixDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="星期天上午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sevenUp" false-label="0" true-label="1"
                       :checked="scope.row.sevenUp === 1"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="星期天下午" align="center" prop="mondayMo" width="60px">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sevenDown" false-label="0" true-label="1"
                       :checked="scope.row.sevenDown === 1"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="挂号限额" align="center" class-name="small-padding fixed-width" prop="skLimit">
        <template slot-scope="scope">
          <el-input
            style="width: 70px"
            v-model="scope.row.skLimit"
            align="center"
            clearable
          >
          </el-input>
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


    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">


      <el-form-item label="规则名称" prop="remain">
        <el-input
          v-model="form.ruleName"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规则描述" prop="noon">
        <el-input
          v-model="form.description"
          placeholder="请输入规则描述"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="submitForm">{{ruleTitle}}</el-button>
      </el-form-item>
    </el-form>


    <!-- 添加或修改排班规则对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="操作人id" prop="operatorId">
          <el-input v-model="form.operatorId" placeholder="请输入操作人id"/>
        </el-form-item>
        <el-form-item label="创建时间" prop="operateTime">
          <el-date-picker clearable size="small"
                          v-model="form.operateTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="规则名" prop="ruleName">
          <el-input v-model="form.ruleName" placeholder="请输入规则名"/>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="科室id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入科室id"/>
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
  import {
    listUser,
  } from "@/api/system/user";
  import treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {listRule, getRule, delRule, addRule, updateRule, exportRule} from "../../../api/sms/skd_rule/skd_rule";
  import {listDeptTree} from "../../../api/system/dept";

  export default {
    components: {treeselect},
    name: "index",
    data() {
      return {
        //表单操作
        ruleTitle:null,
        //一周中上班的时间
        daysOfWeek: {},
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
          skdFlag: 1,
          deptId: null,
          skdRuleId:null
        },
        saveDeptId:null,
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      if(this.$route.query.id!=null&&this.$route.query.id!=undefined){
        this.queryParams.id = this.$route.query.id;
        this.getListBySkdRuleId();
        this.ruleTitle = "修改排版规则"
      }else{
        this.getList();
        this.ruleTitle = "新增排版规则"
      }

    },
    methods: {
      //部门选择
      treeselectChange(node, instanceId) {
        if(this.$route.query.id == null){
          this.queryParams.deptId = node.id;
          console.log("node--------", node)
          console.log("instanceId--------", instanceId)
          this.getList();
        }else {
          this.queryParams.deptId = this.saveDeptId;
          console.log("node--------", node)
          console.log("instanceId--------", instanceId)
          this.getListBySkdRuleId();
        }
      },
      /** 查询排班规则列表 */
      getList() {
        this.loading = true;
        listUser(this.queryParams).then(response => {
          console.log(response);
          this.ruleList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
        listDeptTree().then(response => {
          this.deptOptions = response.data
        });
      },
      getListBySkdRuleId() {
        this.loading = true;
        getRule(this.queryParams).then(response => {
          console.log(response)
          this.form = response.data.skdRule;
          this.saveDeptId=response.data.skdRule.deptId;
          this.queryParams.deptId = response.data.skdRule.deptId;
          this.ruleList = response.data.vos;
          this.total = response.data.ipage.total;
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
        this.ids = selection.map(item => item)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {

      }
      ,
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getRule(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改排班规则";
        });
      }
      ,
      /** 提交按钮 */
      submitForm() {
        if (this.queryParams.deptId == null || this.queryParams.deptId == undefined) {
          this.msgError("请选择科室")
          return false;
        } else {
          this.form.deptId = this.queryParams.deptId;
        }
        if (this.ids == null || this.ids == undefined || this.ids.length == 0) {
          this.msgError("请选择人员")
          return false;
        }
        if (this.form.description == null || this.form.description == undefined) {
          this.msgError("请输入规则描述")
          return false;
        }
        if (this.form.ruleName == null || this.form.ruleName == undefined) {
          this.msgError("请输入规则名称")
          return false;
        }

        for (var i = 0; i < this.ids.length; i++) {

          if (this.ids[i].skLimit === undefined) {
            console.log(this.ids[i].twoUp)
            this.msgError("请输入" + this.ids[i].userName + "的限额");
            return false;
          }

          this.ids[i].staffId = this.ids[i].userId;
          this.ids[i].description = this.form.description;
          this.ids[i].ruleName = this.form.ruleName;

        }


        if (this.$route.query.id != null) {
          updateRule(this.ids,this.$route.query.id).then(response => {
            this.msgSuccess("修改成功");
            this.$router.push( "/skd/skd_rule");
            this.open = false;
            this.getList();
          });
        } else {
          addRule(this.ids).then(response => {
            this.msgSuccess("新增成功");
            this.$router.push( "/skd/skd_rule");
            this.open = false;
            this.getList();
          })
        }
      }
      ,
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
      }
      ,
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
      ,
    }
  };
</script>

<template>
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="1" label="挂号信息列表">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="endAttendance">
            <el-select v-model="queryParams.endAttendance" placeholder="就诊状态" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="deptId" label-width="80px">
            <treeselect
              label-width="80px"
              v-model="queryParams.deptId"
              :options="deptOptionsSelect"
              :show-count="true"
              style="width: 200px;"
              :disable-branch-nodes="true"
              placeholder="就诊科室"
            />
          </el-form-item>


          <el-form-item prop="needBook">
            <el-input
              v-model="queryParams.name"
              placeholder="病历号/姓名"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
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
              v-hasPermi="['dms:registration:add']"
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
              v-hasPermi="['dms:registration:edit']"
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
              v-hasPermi="['dms:registration:remove']"
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
              v-hasPermi="['dms:registration:export']"
            >导出
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="registrationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="状态" align="center" prop="status" :formatter="dms_registration_statusFormat"/>
          <el-table-column label="病历号" align="center" prop="medicalRecordNo"/>
          <el-table-column label="姓名" align="center" prop="name"/>
          <el-table-column label="性别" align="center" prop="gender">
            <template slot-scope="scope">
              <span>{{ scope.row.gender=='0'?'女':'男' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出生日期" align="center" prop="dateOfBirth">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.dateOfBirth, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="就诊日期" align="center" prop="attendanceDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.attendanceDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="看诊科室" align="center" prop="deptName"/>

          <el-table-column label="就诊年龄" align="center" prop="patientAgeStr"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['dms:registration:remove']"
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

      </el-tab-pane>
      <el-tab-pane name="2" label="挂号">
        <el-form ref="form" :model="form" :inline="true" :rules="rules" label-width="80px">
          <el-form-item label="身份证" prop="identificationNo">
            <el-input v-model="form.identificationNo" placeholder="请输入患者id"/>
          </el-form-item>
          <el-form-item label="姓名" prop="endAttendance">
            <el-input v-model="form.status" placeholder="请输入诊断状态"/>
          </el-form-item>
          <el-form-item label="出生日期" prop="attendanceDate">
            <el-date-picker clearable size="small"
                            v-model="form.dateOfBirth"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别" prop="skdId">
            <el-select v-model="form.gender" placeholder="请选择活动区域">
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="0"></el-option>
              <el-option label="未知" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="家庭住址" prop="needBook">
            <el-input v-model="form.homeAddress" placeholder="请输入是否需要病历本"/>
          </el-form-item>
          <el-form-item label="联系方法">
            <el-input v-model="form.phoneNo" placeholder="请输入联系方法"/>
          </el-form-item>
          <el-form-item label="挂号科室" prop="deptId">
            <treeselect
              v-model="form.deptId"
              style="width: 200px;"
              :options="deptOptionsSelect"
              :show-count="true"
              :disable-branch-nodes="true"
              placeholder="请选择执行科室"
            />
          </el-form-item>
          <el-form-item label="挂号级别" prop="patientAgeStr">
            <el-select
              v-model="form.code"
              placeholder="请选择挂号级别"
              clearable
              @change="getRegistrationRank"
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in registrationRankOption"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="挂号日期" prop="attendanceDate">
            <el-date-picker clearable size="small"
                            v-model="form.attendanceDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择就诊日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="午别" prop="patientAgeStr">
            <el-select
              v-model="form.noon"
              placeholder="请选择午别(默认下午)"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                key="0"
                select="select"
                label="上午"
                value="0"
              />
              <el-option
                key="1"
                label="下午"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="看诊医生" prop="patientAgeStr">
            <el-select
              v-model="form.staffId"
              placeholder="请选择看诊医生"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                key="0"
                label="上午"
                value="0"
              />
              <el-option
                key="1"
                label="下午"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应收金额" prop="patientAgeStr">
            <el-input v-model="form.patientAgeStr" :disabled="true" placeholder="请输入就诊年龄"/>
          </el-form-item>
          <el-form-item label="支付方式" prop="patientAgeStr">
            <el-select
              v-model="form.codeype"
              placeholder="请选择支付方式"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option
                v-for="dict in catList"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="病历本">
            <el-radio-group v-model="form.needBook">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">挂号打印&发票</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane name="3" label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane name="4" label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>

    <!-- 添加或修改就诊(门诊)信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="身份证" prop="patientId">
          <el-input v-model="form.patientId" placeholder="请输入患者id"/>
        </el-form-item>
        <el-form-item label="姓名" prop="endAttendance">
          <el-input v-model="form.endAttendance" placeholder="请输入诊断状态"/>
        </el-form-item>
        <el-form-item label="出生日期" prop="attendanceDate">
          <el-date-picker clearable size="small"
                          v-model="form.attendanceDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择就诊日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="性别" prop="skdId">
          <el-input v-model="form.skdId" placeholder="请输入排班id"/>
        </el-form-item>
        <el-form-item label="家庭住址" prop="needBook">
          <el-input v-model="form.needBook" placeholder="请输入是否需要病历本"/>
        </el-form-item>
        <el-form-item label="联系方法">
          <el-radio-group v-model="form.bindStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="挂号科室" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入科室id"/>
        </el-form-item>
        <el-form-item label="挂号级别" prop="patientAgeStr">
          <el-input v-model="form.patientAgeStr" placeholder="请输入就诊年龄"/>
        </el-form-item>
        <el-form-item label="挂号日期" prop="attendanceDate">
          <el-date-picker clearable size="small"
                          v-model="form.attendanceDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择就诊日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="午别" prop="patientAgeStr">
          <el-input v-model="form.patientAgeStr" placeholder="请输入就诊年龄"/>
        </el-form-item>
        <el-form-item label="看诊医生" prop="patientAgeStr">
          <el-input v-model="form.patientAgeStr" placeholder="请输入就诊年龄"/>
        </el-form-item>
        <el-form-item label="应收金额" prop="patientAgeStr">
          <el-input v-model="form.patientAgeStr" placeholder="请输入就诊年龄"/>
        </el-form-item>
        <el-form-item label="支付方式" prop="patientAgeStr">
          <el-input v-model="form.patientAgeStr" placeholder="请输入就诊年龄"/>
        </el-form-item>
        <el-form-item label="病历本">
          <el-radio-group v-model="form.bindStatus">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">挂号打印&发票</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {listCat, listCatAll} from "../../../api/bms/cat/cat"
  import {listRankAll} from "../../../api/sms/registration_rank/rank"
  import treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    listRegistration,
    getRegistration,
    delRegistration,
    addRegistration,
    updateRegistration,
    exportRegistration
  } from "../../../api/dms/registrationPatient/registration";
  import {listDeptTree} from "../../../api/system/dept";

  export default {
    name: "Registration",
    components: {
      treeselect
    },
    data() {
      return {
        //卡片选择name
        activeName: '1',
        //支付方式列表
        catList: [],
        //挂号级别列表
        registrationRankOption: [],
        //就诊状态列表
        statusOptions: [],
        //执行科室树状列表
        deptOptionsSelect: [],
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
        // 就诊(门诊)信息表格数据
        registrationList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          endAttendance: null,
          deptId: null,
          name: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {

      listCat(this.queryParams).then(response => {
        this.catList = response.data.list;
      });

      listRankAll().then(response => {
        console.log(response.data.list);
        this.registrationRankOption = response.data;
      });

      this.getDicts("dms_registration_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getList();
      listDeptTree().then(response => {
        this.deptOptionsSelect = response.data
      });
    },
    methods: {
      //卡片选择
      handleClick(tab, event) {
        if(this.activeName=='2'){
          this.form.noon = '1';
          this.form.needBook = '1';
        }
      },
      //选择挂号级别之后
      getRegistrationRank() {
        if ((this.form.deptId != null && this.form.deptId != undefined)&&(this.form.code != null && this.form.code != undefined)) {

        }
      },
      //看病状态格式化
      dms_registration_statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },
      /** 查询就诊(门诊)信息列表 */
      getList() {
        this.loading = true;
        listRegistration(this.queryParams).then(response => {
          this.registrationList = response.data.list;
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
          patientId: null,
          createTime: null,
          endAttendance: null,
          status: 0,
          skdId: null,
          needBook: null,
          bindStatus: 0,
          deptId: null,
          attendanceDate: null,
          patientAgeStr: null
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
        this.title = "添加就诊(门诊)信息";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getRegistration(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改就诊(门诊)信息";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateRegistration(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addRegistration(this.form).then(response => {
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
        this.$confirm('是否确认删除就诊(门诊)信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return delRegistration(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有就诊(门诊)信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function () {
          return exportRegistration(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
      }
    }
  };
</script>

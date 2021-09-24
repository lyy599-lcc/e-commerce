<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            @clear="clear"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表(表格)区域 -->
      <el-table
        :data="userList"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="姓名"
          prop="username"
        ></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
        ></el-table-column>
        <el-table-column
          label="电话"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          label="角色"
          prop="role_name"
        ></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="onStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size='mini'
              @click="showEdit(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size='mini'
              @click="onDelete(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size='mini'
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 新增用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      @closed="addClosed"
      width="50%"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="add"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      @closed="editClosed"
      width="50%"
    >
      <!-- 对话框主体区域 -->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            disabled
            v-model="editForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="edit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 保存请求回来的用户列表数据
      userList: [],
      total: 0,
      // 是否显示添加用户弹出窗
      addDialogVisible: false,
      // 新增用户表单数据对象----
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 新增用户表单校验规则----
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名~亲', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在3到15个字符~亲',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码哦~亲', trigger: 'blur' },
          {
            min: 3,
            max: 15,
            message: '长度在3到15个字符~亲',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱哦~亲', trigger: 'blur' },
          {
            type: 'email',
            message: '邮箱格式好像不争取哦~亲',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            pattern: /^(13|14|15|16|17|18|19)[0-9]\d{8}$/,
            message: '请输入正确的手机号哦~亲',
            trigger: 'blur'
          }
        ]
      },
      // 修改用户数据对象
      editForm: {
        id: -1,
        username: '',
        email: '',
        mobile: ''
      },
      editDialogVisible: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$axios({
        url: 'users',
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 page 改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 更改用户状态
    async onStateChange (userInfo) {
      const { data: res } = await this.$axios({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: 'PUT'
      })
      if (res.meta.status !== 200) {
        // 如果修改状态失败，将开关状态还原
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 搜索
    search () {
      if (this.queryInfo.query.length === 0) return this.$message.error('请输入内容')
      this.getUserList()
    },
    // 清空搜索框
    clear () {
      this.getUserList()
    },
    // 新增关闭窗口
    addClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 修改关闭窗口
    editClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 新增用户
    add () {
      // 通过表单的校验功能 确认 数据是否都符合要求
      this.$refs.addFormRef.validate(async isOk => {
        // 如果数据通过校验 将数据提交到服务器
        if (isOk) {
          const { data: res } = await this.$axios({
            method: 'POST',
            url: 'users',
            data: this.addForm
          })
          // 如果失败 给出失败提示
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          // 如果成功 则关闭对话框 并重新请求接口 并给成功提示
          this.addDialogVisible = false
          this.getUserList()
          this.$message.success(res.meta.msg)
        } else {
          this.$message.error('未通过校验')
        }
      })
    },
    // 显示修改框
    showEdit (userData) {
      this.editForm.id = userData.id
      this.editForm.username = userData.username
      this.editForm.email = userData.email
      this.editForm.mobile = userData.mobile

      this.editDialogVisible = true
    },
    // 修改用户
    edit () {
      // 通过表单的校验功能 确认 数据是否都符合要求
      this.$refs.editFormRef.validate(async isOk => {
        if (isOk) {
          const { data: res } = await this.$axios({
            method: 'PUT',
            url: 'users/' + this.editForm.id,
            data: {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          })
          // 如果失败 给出失败提示
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          // 如果成功 则关闭对话框 并重新请求接口 并给成功提示
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserList()
        }
      })
    },
    // 删除用户
    async onDelete (id) {
      const { data: res } = await this.$axios({
        url: 'users/' + id,
        method: 'delete'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 如果当前页表格中没有任何数据了， 则请求上一页数据
      this.$message.success(res.meta.msg)
      if (this.userList.length === 1) {
        this.queryInfo.pagenum--
      }
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>

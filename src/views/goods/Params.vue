<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 :closable="false"(是否展示“X”号) show-icon(显示图标) -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            :props="cascaderProps"
            :options="cateList"
            v-model="selectedKeys"
            @change="selectCate"
            clearable
          ></el-cascader>
        </el-col>
        <el-col></el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <!-- 添加动态参数面板 -->
        <el-tab-pane
          label="用户管理"
          name="many"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table
            :data="manyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTag(scope.row, i)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-el-focus
                  v-if="scope.row.inputShow"
                  size="small"
                  class="input-new-tag"
                  v-model.trim="scope.row.inputText"
                  @keyup.enter.native="addTag(scope.row)"
                  @blur="onBlur(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="scope.row.inputShow = true"
                  type="primary"
                  plain
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性面板 -->
        <el-tab-pane
          label="配置管理"
          name="only"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table
            :data="onlyTableData"
            border
            stripe
          >
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(tag, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteTag(scope.row, i)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  v-el-focus
                  v-if="scope.row.inputShow"
                  size="small"
                  class="input-new-tag"
                  v-model.trim="scope.row.inputText"
                  @keyup.enter.native="addTag(scope.row)"
                  @blur="onBlur(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="scope.row.inputShow = true"
                  type="primary"
                  plain
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="#"
            ></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                >编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数或属性对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addParams"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="titleText"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editParams"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 分类列表
      cateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'

      },
      // 绑定用户选择的分类值
      selectedKeys: [],
      // tab页签激活显示的页签项
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 操作新增对话框
      addDialogVisible: false,
      // 添加表单数据
      addForm: {
        attr_name: ''
      },
      // 新增表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 操作修改对话框
      editDialogVisible: false,
      // 修改表单数据
      editForm: {
        attr_name: '',
        attr_id: ''
      },
      // 修改验证规则
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取静态属性或者动态参数
    async getParamsData () {
      // 判断选中的分类id数组的长度
      if (this.selectedKeys.length < 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return this.$msgBox.info('必须选择【第3级】分类')
      }

      // 发送请求，根据用户选择的三级分类和面板获取参数数据
      const { data: res } = await this.$axios({
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      res.data.forEach(e => {
        // 将数据中的 attr_vals 改装成数组
        e.attr_vals.trim().length === 0 ? e.attr_vals = [] : e.attr_vals = e.attr_vals.split(' ')
        // 在对象中添加属性
        e.inputShow = false
        e.inputText = ''
      })
      // 判断是动态参数的数据还是静态属性的数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 级联菜单中选择项发生变化时触发
    selectCate () {
      this.getParamsData()
    },
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$axios({
        url: 'categories'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // tab栏切换时获取数据
    handleTabClick () {
      this.getParamsData()
    },
    // 新增对话框关闭时重置表单
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加动态参数或者静态属性
    addParams () {
      // 当用户点击对话框中的确定时，校验表单
      this.$refs.addFormRef.validate(async valid => {
        // 校验通过，发送请求完成添加参数或者属性
        if (valid) {
          const { data: res } = await this.$axios({
            method: 'POST',
            url: `categories/${this.cateId}/attributes`,
            data: {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          })
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          // 添加成功后重新获取数据并关闭对话框
          this.$message.success(res.meta.msg)
          this.getParamsData()
          this.addDialogVisible = false
        }
      })
    },
    // 显示修改对话框
    showEditDialog (row) {
      // 将当前行的参数名字 放入文本框
      this.editForm.attr_name = row.attr_name
      // 将当前行的id保存
      this.editForm.attr_id = row.attr_id
      // 显示修改对话框
      this.editDialogVisible = true
    },
    // 修改对话框关闭时重置表单
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改参数
    async editParams () {
      const { data: res } = await this.$axios({
        url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        method: 'PUT',
        data: {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 修改成功重新获取数据 关闭对话框
      this.getParamsData()
      this.editDialogVisible = false
    },
    // 删除参数
    async deleteParams (id) {
      // 根据id删除对应的参数或属性
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$msgBox.confirm(
        '请问是否要删除该' + this.titleText,
        '删除提示',
        {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户点击确认，则confirmResult 为'confirm'
      // 如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // 没有取消就是要删除，发送请求完成删除
      const { data: res } = await this.$axios({
        url: `categories/${this.cateId}/attributes/${id}`,
        method: 'DELETE'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getParamsData()
    },
    // 按下空格时添加tag
    async addTag (row) {
      // 当输入框的值不为空时 则将输入框的值加到数组中 然后发起请求添加tag
      row.attr_vals.push(row.inputText)
      const { data: res } = await this.$axios({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: 'PUT',
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 当成功后清空输入框并隐藏输入框
      row.inputText = ''
      row.inputShow = false
    },
    // 当输入框失去焦点清空输入框并关闭
    onBlur (row) {
      row.inputText = ''
      row.inputShow = false
    },
    // 删除tag
    async deleteTag (row, i) {
      // 根据索引删除 attr_vals 数组中的某一项
      row.attr_vals.splice(i, 1)
      // 把被删除后的数组发送到数据库
      const { data: res } = await this.$axios({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: 'PUT',
        data: {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    // 添加计算属性用来获取按钮禁用与否
    isBtnDisabled () {
      return this.selectedKeys.length !== 3
    },
    // 获取选中的三级分类id
    cateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 对话框标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}

.el-tag {
  margin: 5px 5px 5px 15px;
}

.input-new-tag {
  width: 120px;
}
</style>

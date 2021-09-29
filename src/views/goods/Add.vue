<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条组件 -->
      <!-- align-center(居中效果) -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >

          <!-- 基本信息 -->
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input
                v-model="addForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <!-- 级联选择框 -->
              <el-cascader
                :props="cascaderProps"
                :options="cateList"
                v-model="addForm.goods_cat"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品图片 -->
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <!-- 商品内容 -->
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button
              type="primary"
              class="btnAdd"
              @click="add"
            >添加商品</el-button>
          </el-tab-pane>

        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img
        :src="previewPath"
        alt=""
        class="previewImg"
      >
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
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
      // 新增表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 新增表单校验规则对象
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 图片上传url
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传的headers请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      // 预览图片显示与隐藏
      previewDialogVisible: false
    }
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$axios({
        url: 'categories'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择框发生变化时
    handleChange () {
      // 如果用户选择的不是三级分类,该次选择无效，因为必须选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return this.$message.info('请选择三级分类')
      }
    },
    // 切换 tab 栏时
    beforeTabLeave (activeName, beforeActiveName) {
      // 当切换之前的 tab 栏为基本信息时，判断是否选择了商品分类
      if (beforeActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选中商品分类')
        return false
      }
    },
    // 点击tab栏切换时
    async tabClicked () {
      // 如果当前切换的是商品参数时发起请求获取动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 将 attr_vals 分隔成数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        // 如果当前切换的是商品属性时发起请求获取静态属性
        const { data: res } = await this.$axios({
          url: `categories/${this.cateId}/attributes`,
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      // 形参file就是用户预览的那个文件
      this.previewPath = file.response.data.url
      // 显示预览图片对话框
      this.previewDialogVisible = true
    },
    // 处理移除图片操作
    handleRemove (file) {
      // 形参file就是用户点击删除的文件
      // 获取用户点击删除的那个图片的临时路径
      const filePath = file.response.data.tmp_path
      // 使用findIndex来查找符合条件的索引
      const index = this.addForm.pics.findIndex(e => e.pic === filePath)
      // 移除索引对应的图片
      index > -1 && this.addForm.pics.splice(index, 1)
    },
    // 图片上传成功后
    handleSuccess (response) {
      // 将上传后返回的图片临时存放路径放进 添加商品 数据对象中
      const uploadInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(uploadInfo)
    },
    // 添加商品
    add () {
      // 校验添加商品表单
      this.$refs.addForm.validate(async valid => {
        // 如果校验未通过
        if (!valid) return this.$message.error('请填写必要的表单项！')
        // 如果通过 将 addForm 中的 goods_cat 改造成以逗号分隔的字符串
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 获取选中的动态参数和静态属性
        // 将manyTableData（动态参数）处理添加到attrs
        this.manyTableData.forEach(item => {
          const checkInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          form.attrs.push(checkInfo)
        })
        // 将onlyTableData（静态属性）处理添加到attrs
        this.onlyTableData.forEach(item => {
          const checkInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(checkInfo)
        })
        // 发送添加商品请求
        const { data: res } = await this.$axios({
          url: 'goods',
          method: 'POST',
          data: form
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 编程式导航跳转到商品列表
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    // 获取三级分类id
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },
  created () {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>

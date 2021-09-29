<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">

        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="search"
            @change="search"
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
            @click="goAddPage"
          >添加商品</el-button>
        </el-col>

      </el-row>

      <!-- 表格 -->
      <el-table
        :data="goodsList"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="140px"
        >
          <template slot-scope="scope">{{ scope.row.add_time | dateFormate }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="125px"
        >
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      // 商品列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$axios({
        url: 'goods',
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 当页号发生改变时
    handleSizeChange (newSize) {
      // 当页号发生改变时，更改pagesize，重新请求
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当页码发生改变时
    handleCurrentChange (newPage) {
      // 当页码发生改变时，更改pagenum，重新请求
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 搜索
    search () {
      this.getGoodsList()
    },
    // 删除
    async deleteGoods (id) {
      // 根据id删除对应的参数或属性
      // 弹窗提示用户是否要删除
      const confirmResult = await this.$msgBox.confirm(
        '请问是否要删除该商品',
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

      const { data: res } = await this.$axios({
        method: 'DELETE',
        url: `goods/${id}`
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>

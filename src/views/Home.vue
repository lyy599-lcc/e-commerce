<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <!-- 黑马logo -->
        <img
          src="../assets/nice.jpg"
          alt=""
        >
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="danger"
        @click="logout"
      >退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠菜单按钮 -->
        <div
          class="toggle-button"
          @click="isCollapse = !isCollapse"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="clickMenu"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id+''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.iconclass"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveMenu('/' + subItem.path)"
            >
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- welcome -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      menuList: [],
      isCollapse: false,
      clickMenu: ''
    }
  },
  created () {
    this.getMenuList()
    // 读取本地保存的上次 访问的url，并设置给菜单默认选中
    const urlHash = window.sessionStorage.getItem('curMenu')
    // 如果存在则将路径设置给菜单
    if (urlHash) this.clickMenu = urlHash
  },
  methods: {
    saveMenu (urlHash) {
      // 将路径设置给 菜单
      this.clickMenu = urlHash
      // 将路径保存到 本次内存
      window.sessionStorage.setItem('curMenu', urlHash)
    },
    // 退出
    async logout () {
      try {
        await this.$msgBox.confirm(
          '此操作将退出当前页面, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('curMenu')
        this.$router.push('/login')
      } catch (error) { }
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$axios({
        url: 'menus'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 60px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>

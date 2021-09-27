<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table
        :data="roleList"
        border
      >
        <!-- 添加展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id, scope.row)"
                >
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="{ bdtop: i2 > 0, vcenter: true }"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id, item1)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightsById(scope.row, item3.id, item2)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="#"
          type="index"
        ></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRoleRgihts(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形组件
    show-checkbox:显示复选框
    node-key:设置选中节点对应的值
    default-expand-all:是否默认展开所有节点
    :default-checked-keys 设置默认选中项的数组
    ref:设置引用 -->
      <el-tree
        show-checkbox
        default-expand-all
        :data="rightsList"
        node-key="id"
        :default-checked-keys="defKeys"
        :props="{label:'authName', children: 'children'}"
        ref='treeRef'
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button
          @click="setRoleRights"
          type="primary"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示
      setRightDialogVisible: false,
      // 权限树数据
      rightsList: [],
      // 已有权限数据
      defKeys: [],
      // 等待被分配权限id
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList () {
      const { data: res } = await this.$axios.get('roles')
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // 如果返回状态正常，将请求的数据保存在data中
      this.roleList = res.data
    },
    // 更新id删除权限
    async removeRightsById (role, rightId, father) {
      // 弹窗提示用户是否要删除
      this.$msgBox.confirm('是否删除该权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: async (action) => {
          // 如果用户点击确认 则发送请求删除当前点击权限
          if (action === 'confirm') {
            const { data: res } = await this.$axios({
              method: 'DELETE',
              url: `roles/${role.id}/rights/${rightId}`
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            // 删除成功后 服务器会返回新数据 将返回的新数组赋值给原来的权限数组 以免造成整个页面刷新
            // role.children = res.data

            // 删除成功后 就根据当前被删除的权限的 id 找到在父级数组中的 索引号 从父级数组中删除该权限 从而达到和上面一样的效果
            const index = father.children.findIndex((e) => e.id === rightId)
            index > -1 && father.children.splice(index, 1)
          } else {
            this.$message.info('已经取消删除')
          }
        }
      })
    },
    // 点击分配权限弹出对话框并请求权限树及显示当前角色已有的权限
    async showRoleRgihts (role) {
      // 将选中角色id保存到roleId中
      this.roleId = role.id
      const { data: res } = await this.$axios({
        url: 'rights/tree'
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 如果返回状态正常，将请求的数据保存在data中
      this.rightsList = res.data

      // 点击分配权限时先清空已选中的权限id
      this.defKeys = []
      // 请求 权限树数据
      this.getRoleList()
      // 找出 三级权限id 并设置给树形菜单选中
      this.getLeafKeys(role)
      // 打开分配权限对话框
      this.setRightDialogVisible = true
    },
    // 通过递归获取 角色当前三级权限id
    getLeafKeys (role) {
      // 如果当前对象没有 children 属性 说明是三级权限，就将 id 存入 defKeys 数组中
      if (!role.children) return this.defKeys.push(role.id)
      // 如果有 children 属性，那么就递归遍历它
      role.children.forEach(e => {
        this.getLeafKeys(e)
      })
    },
    // 设置角色权限
    async setRoleRights () {
      // 用el-tree的方法并利用展开运算符获取选中的权限及半选的权限的id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将获取到的选中的权限id数组转换为以逗号分隔的字符串
      const idStr = keys.join(',')
      // 发送请求分配权限
      const { data: res } = await this.$axios({
        method: 'POST',
        url: `roles/${this.roleId}/rights`,
        data: {
          rids: idStr
        }
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 请求成功关闭对话框并更新列表
      this.setRightDialogVisible = false
      this.getRoleList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px 7px 7px 20px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>

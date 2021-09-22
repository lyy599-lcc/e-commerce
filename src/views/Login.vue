<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" />
      </div>
      <!-- from -->
      <el-form
        ref="loginForm"
        label-width="0px"
        class="login_form"
        :rules="rules"
        :model="loginData"
      >
        <!-- username -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginData.username"
          ></el-input>
        </el-form-item>
        <!-- password -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginData.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- button -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            plain
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            plain
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginData: {
        username: 'admin',
        password: '123456'
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      // 校验表单元素是否合乎规则 通过表单对象的 .validate() 方法来校验
      this.$refs.loginForm.validate(async (isPass) => {
        // 如果表单校验通过， 则获取表单元素数据 提交到接口
        if (isPass) {
          const { data: res } = await this.$axios({
            url: 'login',
            method: 'POST',
            data: this.loginData
          })
          // 根据结果 使用 this.$message 弹出提示消息
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          // 登录成功后将token保存到SessionStorage
          window.sessionStorage.setItem('token', res.data.token)
          // 跳转到 home
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

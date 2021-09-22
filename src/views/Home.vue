<template>
  <div>
    Home
    <el-button
      type="danger"
      @click="logout"
      circle
    >退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
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
        this.$router.push('/login')
      } catch (error) { }
    }
  }
}
</script>

<style>
</style>

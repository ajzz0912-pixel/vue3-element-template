<template>
    <div class="system-login">
        <div class="box">
            <div class="login-content-left">
                <img :src="loginLeftPng">
                <div class="login-content-left-mask">
                    <div>后台管理系统</div>
                    <div>时间不在于你拥有多少,而在于你怎样使用。</div>
                </div>
            </div>

            <div class="box-inner">
                <h1>欢迎登录</h1>
                <el-form
                    ref="formRef"
                    class="form"
                    :model="form"
                    :rules="formRules"
                >
                    <el-form-item prop="username">
                        <el-input v-model="form.username" size="large" placeholder="用户名" type="text" maxlength="20">
                            <template #prepend>
                                <i class="iconfont icon-user" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" size="large" :type="passwordType" placeholder="密码" name="password" maxlength="20">
                            <template #prepend>
                                <i class="iconfont icon-mima" />
                            </template>
                            <template #append>
                                <i
                                    class="iconfont password-icon"
                                    :class=" passwordType ? 'icon-yanjing_yincang' : 'icon-yanjing_xianshi' "
                                    @click="passwordTypeChange"
                                />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" :loading="form.loading" class="w-full" size="default" @click="submitForm(formRef)">登录</el-button>
                </el-form>
                <div class="fixed-top-right" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
import loginLeftPng from '~/assets/login/left.jpg'
import { ElMessage } from '~/config/element'

defineOptions({
    name: 'Login',
    inheritAttrs: true,
})
const formRef = ref<FormInstance>()
const formRules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const userStore = useUserStore()
const router = useRouter()

const form = reactive({
    username: '',
    password: '',
    loading: false,
})
const passwordType = ref('password')

function passwordTypeChange() {
    passwordType.value === '' ? (passwordType.value = 'password') : (passwordType.value = '')
}

async function submitForm(formEl: FormInstance | undefined) {
    if (!formEl)
        return
    formEl.validate(async (valid: any) => {
        if (valid) {
            try {
                form.loading = true
                const data = {
                    username: form.username,
                    password: form.password,
                }
                const result = await userStore.login(data)
                if (result) {
                    ElMessage.success({
                        message: '登录成功',
                        type: 'success',
                        showClose: true,
                        duration: 1000,
                    })
                    await router.replace('/dashboard')
                }
            }
            catch (error) {
                console.log('error', error)
                ElMessage.error({
                    message: '登录失败',
                    type: 'error',
                    showClose: true,
                    duration: 1000,
                })
            }
            finally {
                form.loading = false
            }
        }
    })
}
</script>

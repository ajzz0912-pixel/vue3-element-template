import type { UserState } from '../types/store.types'

import { acceptHMRUpdate } from 'pinia'
import { userStorage } from '~/composables/storage'

export interface UserInfo {
    id?: number
    username?: string
    email?: string
    avatar?: string
    role?: string
    permissions?: string[]
    [key: string]: any // 允许额外字段
}

function persistUser(state: UserState) {
    // 展开成纯对象，避免 reactive Proxy 写入 localStorage 失败
    userStorage.value = {
        token: state.token,
        info: { ...(state.info || {}) },
    }
}

const useUserStore = defineStore('userStore', () => {
    const state: UserState = reactive(
        userStorage.value || {
            token: '', // 登录token
            info: {
                id: 0,
                username: '',
                email: '',
                avatar: '',
                role: '',
                permissions: [],
            } as UserInfo, // 用户信息
        },
    )

    function tokenChange(token: string) {
        state.token = token
        persistUser(state)
    }
    function setInfo(info: Partial<UserInfo>) {
        state.info = { ...info }
        persistUser(state)
    }

    // login by login.vue
    async function login(data: { username: string, password: string }) {
        const res = await $axios.post<UserInfo>('/user/login', data)
        const { code, token, data: userInfo } = res
        if (code === 200 && token) {
            tokenChange(token)
            setInfo({ ...userInfo })
            return token as string
        }
        return null
    }
    // get user info after user logined
    async function getInfo(params: { token: string }) {
        const res = await $axios.post<UserInfo>('/user/info', params)
        if (res.code === 200 && res.data) {
            setInfo(res.data)
            return res.data
        }
        return null
    }

    // login out the system after user click the logout button
    async function logout() {
        await $axios.post('/user/logout')

        globalStorage.value = null
        userStorage.value = null
        tabsStorage.value = []
        location.reload()
    }

    return {
        ...toRefs(state),
        tokenChange,
        setInfo,
        login,
        getInfo,
        logout,
    }
})

useUserStore(piniaInit).$subscribe((_mutation: unknown, state: UserState) => {
    persistUser(state)
})

export default useUserStore
export const userStoreWithout = () => useUserStore(piniaInit)

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}

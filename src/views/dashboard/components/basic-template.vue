<template>
    <el-card>
        <template #header>
            <div text-left>
                <span>基础模板</span>
            </div>
        </template>
        <div class="box">
            <div flex="~ items-center">
                <h4 mr-20px>ts</h4>
                <p mr-20px>ts版本的基础模板</p>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'BasicTemplate',
})
</script>

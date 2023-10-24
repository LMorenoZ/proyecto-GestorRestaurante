<script setup>
    import { RouterView } from 'vue-router'

    import SideBar from '../components/Sidebar.vue';
</script>

<template>   
    <div class="row">
        <div class="col-sm-12 col-md-3">
            <SideBar />
        </div>
        <div class="col-sm-12 col-md-9 " >
            <router-view name="seccionAdmin"></router-view>
        </div>
    </div>
</template>
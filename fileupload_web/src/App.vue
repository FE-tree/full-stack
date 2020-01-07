<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { isMobile } from '@/utils/index.js'
export default {
    name: 'app',
    methods: {
        setStyle() {
            console.log(isMobile(), window)
            if(!isMobile()){
                require('@/assets/style/pc.scss');
                this.$root.plaform = 'pc';
            }else{
                require('@/assets/style/mobile.scss');
                this.$root.plaform = 'mobile';
            }
        }
    },
    created() {
        this.setStyle()
        // window.onresize = (e) => {
        //     console.log(e)
        // }
    }
}
</script>

<style lang="scss">
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
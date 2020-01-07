<template>
    <div :class="`home ${$root.plaform}`">
        <div class="container">
            <div class="head">
                <div class="left">
                    <div class="add" @click="selectFile">
                        <div class="icon">
                            <input type="file" name="uploadFile" ref="uploadFile" @change="fileChange">
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="input-item">
                        <span>文件名称：</span>
                        <input type="text" v-model="name">
                    </div>
                    <div class="input-item">
                        <span>文件类型：</span>
                        <input type="text" v-model="type" disabled="">
                    </div>
                </div>
            </div>
            <div class="submit" @click="fileUpload" v-show="!loading">文件上传</div>
            <div class="submit" @click="fileUpload" v-show="loading"><van-loading color="#fff" style="display: inline-block" />上传中...{{progress}}</div>
            <div class="main">
                <div class="tabs">
                    <div :class="['tab',{'active':isList}]" @click="isList=true">列表</div>
                    <div :class="['tab',{'active':!isList}]" @click="isList=false">图文</div>
                </div>
                <div class="list" v-show="isList">
                    <div :class="['list-item',{'list-active':listActive==i}]" v-for="(item, i) in list" :key="i" @click="listActive=i">
                        <p>{{ item.title }}.{{ item.type }}</p>
                        <!-- <p>{{ item.created }}</p> -->
                    </div>
                </div>
                <div class="list2" v-show="!isList">
                    <div class="list2-item" v-for="(item, i) in list" :key="i">
                        <div class="pic"></div>
                        <p>{{ item.title }}.{{ item.type }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from '@/utils/axios.js'
export default {
    name: 'home',
    data() {
        return {
            file: null,
            name: '',
            type: '',
            list: [],
            isList: false,
            listActive: null,
            loading: false,
            progress: '0%'
        }
    },
    methods: {
        getList() {
            let listLoading = this.$toast.loading({
                forbidClick: true,
                duration: 0
            });
            axios.get('file/find', {}, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                        console.log(complete)
                    }
                },
            }).then(res => {
                // console.log(res)
                this.list = res.results
                listLoading.clear()
            }).catch((error) => {
                console.log(error);
                setTimeout(() => {
                    listLoading.clear()
                }, 2000)
            })
        },
        selectFile() {
            this.$refs.uploadFile.click()
        },
        fileChange(ev) {
            console.log(ev.target.files[0])
            this.file = ev.target.files[0]
            if (!this.file.type) {
                this.$toast.fail('请上传规定的文件类型')
                return;
            }
            this.name = this.file.name.split(".")[0]
            this.type = this.file.type.split("/")[1]
            if (this.type == 'jpeg') this.type = 'jpg'
        },
        fileUpload() {
            // console.log(this.file, this.name, this.type)
            if (!this.file) {
                this.$toast.fail('请选择文件')
                return;
            }
            this.loading = true
            let fd = new FormData()
            fd.append('file', this.file)
            fd.append('title', this.name)
            fd.append('type', this.type)

            axios.service({
                url: 'file/upload',
                method: 'post',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => { //原生获取上传进度的事件
                    if (progressEvent.lengthComputable) {
                        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
                        this.progress = complete
                        console.log(complete)
                    }
                },
                data: fd
            }).then(res => {
                console.log(res)
                this.loading = false
                this.$toast.success('上传成功');
                this.getList()
            }).catch(error => {
                console.log(error);
                setTimeout(() => {
                    this.loading = false
                    this.$toast.fail('网络出错')
                }, 2000)
            })
        }
    },
    created() {
        this.getList()
    }
}
</script>
<style lang="scss">
@import '@/assets/style/index.scss';
</style>
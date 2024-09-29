<script setup>
import { defineProps, onMounted, reactive, onUpdated, watch } from 'vue';
import axios from 'axios'
import ContentUser from './ContentUser.vue';
import LikeComment from './LikeComment.vue';
import CommentList from './CommentList.vue';
import ReplyBox from './ReplyBox.vue';
import { useAuthStore } from '@/store/auth';
const props = defineProps({
    commentResponse: {
        type: Object,
        required: true
    },
    openCommentFunc: {
        type: Function
    },
    openComment: {
        type: String,
    }
})
const authStore = useAuthStore();
const state = reactive({
    liked: false,
    displayDes: props.closeOrder,
    comments: [],
    isLoaded: true,
    fullComment: true,
    displayOptions: false,
    displayEdit: false
})
const handleContentClick = () => {
    if (state.displayDes) {
        props.openCommentFunc()
    } else {
        props.openCommentFunc(props.commentResponse.comment._id)
        if (!state.comments.length > 0) {
            state.isLoaded = false
            axios.get('/comment/id', { params: { commentId: props.commentResponse.comment._id, offset: 0 } }).then((res) => {
                if (res.data) {
                    state.comments = res.data
                    state.isLoaded = true
                }
            })
        } else {
            state.displayDes = !state.displayDes
        }
    }
}
const handleSeeMore = () => {
    axios.get('/comment/id', { params: { commentId: props.commentResponse.comment._id, offset: state.comments.length } }).then((res) => {
        if (res.data) {
            state.comments = [...state.comments, ...res.data]
            console.log(res.data)
        }
    })
}
onUpdated(() => {
    if (props.commentResponse.comment._id === props.openComment) {
        state.displayDes = true
    } else {
        state.displayDes = false
    }
})
const handleCommentDelete = () => {
    axios.delete('comment/', { params: { commentId: props.commentResponse.comment._id } })
        .then(res => {
            if (res && res.status === 204) {
                router.go('/')
            }
        })
}
//v-if="commentResponse.comment.user._id === authStore._id" 

</script>
<template>
    <div :class="`container`">
        <div :class="` wrapper`">
            <div class="flex justify-between p-2 items-center relative">
                <ContentUser :contentDate="commentResponse.comment.date" :user="commentResponse.comment.user"
                    :signedProfilePic="commentResponse.signedProfilePic" />
                <i @click="() => state.displayOptions = !state.displayOptions"
                    class="pi pi-ellipsis-v text-2xl text-gray-400">
                </i>
                <div v-if="state.displayOptions" class="crud-menu">
                    <div class="triangle f"></div>
                    <div class="">
                        <div class="crud-item" @click="() => state.displayEdit = !state.displayEdit">
                            <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                                <i class="pi pi-pen-to-square mr-2 text-green-500"></i><span
                                    class="text-white">Edit</span>
                            </div>
                        </div>
                        <div class="crud-item" @click="handleCommentDelete">
                            <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                                <i class="pi pi-times-circle mr-2 text-red-500"></i><span
                                    class="text-white">Delete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between w-3/4 break-words">
                <div v-if="!state.displayEdit" @click="handleContentClick" class="p-2 pr-12 pl-12 cursor-pointer">
                    <div v-if="state.displayDes || commentResponse.comment.content.length < 150"
                        class="font-bold text-lg w-full">
                        {{ commentResponse.comment.content }}
                    </div>
                    <div v-else class="font-bold text-lg w-full">
                        {{ commentResponse.comment.content.slice(0, 150) }}... <span class="text-gray-400">See
                            More</span>
                    </div>
                    <div v-if="commentResponse.signedPostPic" class="image-container">
                        <img :src="commentResponse.signedPostPic" rel="preload" />
                    </div>
                </div>
                <div v-else class="w-full"> 
                    <ReplyBox :contentId="commentResponse.comment._id" 
                        :contentLength="state.comments.length" :content="commentResponse.comment.content"/>
                </div>
                <LikeComment v-if="!state.displayEdit" :contentResponse="commentResponse" :isComment="true" />
            </div>
            <div class="w-full flex justify-around">
                <div v-if="state.displayDes && commentResponse.commentCount > 0" class="tracker"></div>
            </div>
            <div class="w-full flex justify-center">
                <div class="content">
                    <CommentList :key="commentResponse.comment._id" v-if="state.displayDes"
                        :comments="state.comments" />
                    <span v-if="state.displayDes
                        && state.comments.length <= commentResponse.commentCount
                        && state.comments.length > 0
                        && state.isLoaded" @click="handleSeeMore" class="text-gray-400 cursor-pointer p-2">See
                        More...</span>
                    <ReplyBox :contentId="commentResponse.comment._id" v-if="state.displayDes"
                        :contentLength="state.comments.length" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.tracker {
    height: 20px;
    width: 80%;
    margin-left: 2.8rem;
    border: 5px solid rgb(0, 0, 0);
    border-right: none;
    border-radius: 1rem 0 0 0;
    border-bottom: none;
    /* margin-top: 15px; */
}

.content {
    width: 90%;
}

.wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: .5rem;
    overflow-wrap: break-word;
    border-radius: .5rem .5rem 0 0;
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.295);
    border: 1px solid rgba(105, 105, 105, 0.11);
    border-bottom: .5px solid rgba(105, 105, 105, 0.11);
}

.crud-menu {
    position: absolute;
    right: 0;
    top: 3.5rem;
    padding: .5rem;
    border-radius: .5rem 0 .5rem .5rem;
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
}

.crud-item {
    background-color: rgb(0, 0, 0);

}
</style>

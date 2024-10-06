<script setup>
import { defineProps, onMounted, reactive, onUpdated, watch } from 'vue';
import axios from 'axios'
import ContentUser from './ContentUser.vue';
import LikeComment from './LikeComment.vue';
import CommentList from './CommentList.vue';
import ReplyBox from './ReplyBox.vue';
import { useAuthStore } from '@/store/auth';
import Loader from './Loader.vue';
import SpinnerIcon from '~icons/line-md/loading-twotone-loop'
const props = defineProps({
    commentResponse: {
        type: Object,
        required: true
    },
    deleteComment: {
        type: Function
    },
    openCommentFunc: {
        type: Function
    },
    openComment: {
        type: String,
    },
    openReplyFunc: {
        type: Function
    },
    openReply: {
        type: String
    }
})
const authStore = useAuthStore();
const state = reactive({
    liked: false,
    displayDes: false,
    comments: [],
    fullComment: true,
    displayOptions: false,
    displayReply: false,
    isLoading: false,
    isViewMoreLoading: false,
    commentContent: props.commentResponse.comment.content.slice(0, 150),
})
const handleContentClick = () => {
    if (state.displayDes) {
        props.openCommentFunc()
    } else {
        props.openCommentFunc(props.commentResponse.comment._id)
        if (!state.comments.length > 0) {
            state.isLoading = true
            axios.get('/comment/id', { params: { commentId: props.commentResponse.comment._id, offset: 0 } }).then((res) => {
                if (res.data) {
                    state.comments = res.data
                    state.isLoading = false
                    state.displayDes = true
                }
            })
        } else {
            state.displayDes = !state.displayDes
        }
    }
}
const handleSeeMore = () => {
    state.isViewMoreLoading = true
    axios.get('/comment/id', { params: { commentId: props.commentResponse.comment._id, offset: state.comments.length } }).then((res) => {
        if (res.data) {
            state.comments = [...state.comments, ...res.data]
            console.log(res.data)
            state.isViewMoreLoading = false

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
                props.deleteComment(props.commentResponse.comment._id)
            }
        })
}

const handleReplyClick = () => {
    if (props.openReply === props.commentResponse.comment._id) {
        props.openReplyFunc()
    } else {
        props.openReplyFunc(props.commentResponse.comment._id)
    }
}

//v-if="commentResponse.comment.user._id === authStore._id" 
</script>
<template>
    <div :class="`wrapper`">
        <div class="flex justify-between w-[100%] text-justify">
            <div class="w-full">
                <div class=" float-left h-[2.3rem]">
                    <ContentUser :user="commentResponse.comment.user"
                        :signedProfilePic="commentResponse.signedProfilePic" :isComment="true" />
                </div>
                <div class="text-[.85rem] mt-4 ml-4 w-[90%] ">
                    <span @click="handleContentClick" class="cursor-pointer">{{ state.commentContent }}</span>
                    <span
                        @click="() => state.commentContent += commentResponse.comment.content.slice(state.commentContent.length, state.commentContent.length + 300)"
                        v-if="commentResponse.comment.content.length > 150" class="text-gray-400 cursor-pointer">...See
                        More</span>
                </div>
            </div>
        </div>
        <div class="mt-2">
            <div class="relative ">
                <i v-if="commentResponse.comment.user._id === authStore._id"
                    @click="() => state.displayOptions = !state.displayOptions"
                    class="pi pi-ellipsis-v text-xl text-gray-400 ">
                </i>
                <div v-if="state.displayOptions" class="crud-menu">
                    <div class="triangle"></div>
                    <div class="crud-item" @click="handleCommentDelete">
                        <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                            <i class="pi pi-times-circle mr-2 text-red-500"></i><span class="text-white">Delete</span>
                        </div>
                    </div>
                </div>
            </div>
            <LikeComment :contentResponse="commentResponse" :isComment="true" />
        </div>
    </div>
    <div class="text-[.75rem] ml-8 flex justify-start items-center">
        <div v-if="!state.displayDes && commentResponse.commentCount > 0" class="cursor-pointer mr-4"
            @click="handleContentClick">
            View ({{ commentResponse.commentCount }}) replies..
        </div>
        <div class="cursor-pointer" @click="handleReplyClick">
            Reply
        </div>
        <SpinnerIcon v-if="state.isLoading" class="ml-5 w-4 h-4" />
    </div>
    <div class="w-full flex justify-end ">
        <div v-if="state.displayDes && state.comments.length > 0" class="w-[90%] relative">
            <div class="border-l-2 border-b-2 border-black h-8 w-4 absolute left-[-.75rem] rounded-bl-xl">
            </div>
            <CommentList :key="commentResponse.comment._id" :comments="state.comments" />
            <div class="flex ">
                <div v-if="commentResponse.commentCount - state.comments.length > 0" class="cursor-pointer text-sm"
                    @click="handleSeeMore">
                    View ({{ commentResponse.commentCount - state.comments.length }}) replies..
                </div>
                <SpinnerIcon v-if="state.isViewMoreLoading" />
            </div>
        </div>
    </div>
    <ReplyBox v-if="openReply === commentResponse.comment._id" :contentId="commentResponse.comment._id"
        :contentLength="state.comments.length" />
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

.wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: .5rem;
    overflow-wrap: break-word;
}

.crud-menu {
    position: absolute;
    right: 0;
    top: 1rem;
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

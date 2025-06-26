import { defineStore } from "pinia";
import { ref } from "vue";

export const useDisplayStore = defineStore("dispaly", () => {
  const createView = ref(false);
  const searchView = ref(false);
  const notiView = ref(false);
  const sidePanel = ref(true);
  const navOptionList = ref(false);
  const massPrevLoader = ref(false);
  function toggleCreateView() {
    console.log('im here')
    createView.value = !createView.value;
  }
  function toggleSearchView() {
    searchView.value = !searchView.value;
  }
  function toggleNotiView(data) {
      notiView.value = !notiView.value
  }
  function toggleSidePanel() {
    sidePanel.value = !sidePanel.value;
  }
  function toggleNavOptionList() {
    console.log('im here')
    navOptionList.value = !navOptionList.value;
  }
  function toggleMassPrevLoader() {
    massPrevLoader.value = !massPrevLoader.value;
  }
  return {
    sidePanel,
    toggleSidePanel,
    notiView,
    toggleNotiView,
    createView,
    toggleCreateView,
    searchView,
    toggleSearchView,
    navOptionList,
    toggleNavOptionList,
    massPrevLoader,
    toggleMassPrevLoader
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";

export const useValMessageStore = defineStore('valMessage', () => {
    const valMessage = ref(null);


    function setValMessage(valMessageValue) {
        this.valMessage = valMessageValue
    }


    return {valMessage, setValMessage}
})
import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth",() => {
  const fname = ref(null);
  const lname = ref(null);
  const email = ref(null);
  const _id = ref(null);
  const token = ref(null);
  const signedProfilePic = ref(null)
  const setFname = (value) => (fname.value = value);
  const setLname = (value) => (lname.value = value);
  const setEmail = (value) => (email.value = value);
  const setId = (value) => (_id.value = value);
  const setToken = (tokenValue) => (token.value = tokenValue);
  const setProfilePic = (signedUrl) =>{
    signedProfilePic.value = signedUrl
  };
  const  getLoggedUser = async () => {
      await axios.get("/auth/user", {
        withCredentials: true,
        
      }).then(res => {
        if(res && res.status === 200){
          setToken(res.data.token);
          setFname(res.data.user.fname);
          setLname(res.data.user.lname);
          setId(res.data.user._id);
          setProfilePic(res.data.user.signedProfilePic)
          setEmail(res.data.user.email);
        }
      }).catch(err => {
        console.log(err)
      })
  }
  
  return {
    token,
    fname,
    lname,
    email,
    _id,
    signedProfilePic,
    setToken,
    setFname,
    setLname,
    setEmail,
    setId,
    getLoggedUser,
    setProfilePic
  };
});

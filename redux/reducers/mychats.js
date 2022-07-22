import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db,collection, onSnapshot,doc,updateDoc ,auth,addDoc} from "../../firebase";

export const addNewChats =(navigation,chatName)=> createAsyncThunk(
  "AddNewchats",
  async (dispatch, getState) => {

    try {
      const chatRef = collection(db, "chats");
      const addChat = await addDoc(chatRef, {
        chatName: chatName,
        recent: "",
        userRequests:[],
        acceptedRequests:[],
        createdBy:auth.currentUser.uid,
        chatid:''
      });
      if (addChat) {
        // dispatch(UpdateAddedChats(navigation,addChat))
        const chatrefUpd=doc(db,'chats',addChat?.id)
        const updid=await updateDoc(chatrefUpd,{
          chatid:addChat?.id
        })
        navigation.goBack();          
      }
    } catch (error) {}

  }
);
export const UpdateAddedChats =(navigation,addChat)=> createAsyncThunk(
  "UpdateNewchats",
  async (dispatch, getState) => {

    try {
      const chatrefUpd=doc(db,'chats',addChat?.id)
      const updid=await updateDoc(chatrefUpd,{
        chatid:addChat?.id
      })
      navigation.goBack()
    } catch (error) {}

  }
);
export const getMyChats = createAsyncThunk(
    "getmychats",
    async (dispatch, getState) => {
      const ref = collection(db, "chats");
     
      const unsubscribe = onSnapshot(ref, (querySnapshot) => {  
       return [...querySnapshot?.docs?.map((doc) => {
          return { id: doc.id, chat: doc.data() }
        })];
      });
      
  
    }
  );
  


const chats=createSlice({
    name:"chats",
    initialState:{
        myChats:[],
        joinedChats:[],
        loading:false,
    },
    extraReducers:{
        [getMyChats.pending]:(state,action)=>{
            state.loading=true
        },
        [getMyChats.fulfilled]:(state,action)=>{
            state.myChats=action.payload
        },
        [getMyChats.rejected]:(state,action)=>{
            state.loading=false
        }
    }

})
export default chats.reducer
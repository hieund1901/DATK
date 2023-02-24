import axiosClient from "./axios.client";
import {sign} from "../utils/signature";

function activeUser(_id: string){
    const response = axiosClient.get(`/web/auth/active?_id=${_id}`);
    return response;
}

function forgetPassword(email: string){
    const response = axiosClient.post('/web/auth/forgetPassword',{email})
    return response
}

function getInfo(){
    const response = axiosClient.get('/users')
    return response;
}

function saveInfo(data){
    const response = axiosClient.put('/users', {...data, signature: sign(data)})
    return response;
}

function authLogOut(){
   return axiosClient.get('/web/auth/logout');
}

export {activeUser, forgetPassword, getInfo, saveInfo, authLogOut};
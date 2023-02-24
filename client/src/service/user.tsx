import axiosClient from "./axios.client";

function getUser(data:{}){
    // console.log(data);
    const response = axiosClient.get('/admin/users', {params:data});
    return response;
}

function getUserDetail(_id:string){
    // console.log(_id);
    const response = axiosClient.get(`/admin/users/${_id}`);
    return response;
}

function createNewUser(){
    const response = axiosClient.post('/web/auth/forgetPassword',{})
    return response
}
// const res = axios.get('https://api.vaipe.io/admin/users?page=1&pageSize=10&isPaging=true')
//             .then((val) => {
//                 console.log(val.data.data.result.users);
//                 setDataSource(val.data.data.result.users)
//             })

export {getUser, getUserDetail};
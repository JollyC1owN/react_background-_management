/* 包含应用中所有请求接口的函数：接口请求函数 */
import ajax from "./ajax"

//定义服务器的地址为常量
// const BASE = "http://localhost:5000"
const BASE = ""
//请求登录
export const reqLogin = (username, password) => {
	ajax({
		method: "POST",
		url: BASE+"/login",
		data: { //默认使用json格式的请求体
			username,    //username:username
			password     //password:password
		},
}) }
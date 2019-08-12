/* 包含应用中所有请求接口的函数：接口请求函数 */
import ajax from "./ajax"


//请求登录
export const reqLogin = (username, password) => {
	ajax({
		method: "POST",
		url: "BASE+/login",
		data: {
			username,    //username:username
			password     //password:password
		},
}) }
/* 包含应用中所有请求接口的函数：接口请求函数 
	函数的返回值都promise对象
*/
import ajax from "./ajax"
// import qs from "qs"   配合下面的使用，但是在ajax.js中，已经统一设置了
//定义服务器的地址为常量
// const BASE = "http://localhost:5000"
const BASE = ""
//请求登录
export const reqLogin = (username, password) => ajax.post(BASE+"/login", {username,password})
/* 	(
 	 ajax({
		method: "POST",
		url: BASE+"/login",
		data: { //data是对象，默认使用json格式的请求体携带参数数据
			username,    //username:username
			password     //password:password
		},
		// data: qs.stringify({username,password})  这里的写法已经统一 设定在了ajax.js中了
	})
)
 */



// const name = "admin"
// const pwd = "admin"

// reqLogin(name, pwd).then(result => {   //即response.data，在ajax.js中设置了响应拦截器
// 	console.log("请求成功"+result);
// })


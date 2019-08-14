/* 包含应用中所有请求接口的函数：接口请求函数 
	函数的返回值都promise对象
*/
import ajax from "./ajax" //axios不能发送jsonp请求
import jsonp from "jsonp"
import { message } from "antd";
import axios from "./ajax";
// import qs from "qs"   配合下面的使用，但是在ajax.js中，已经统一设置了
//定义服务器的地址为常量
// const BASE = "http://localhost:5000"
const BASE = ""
//请求登录
export const reqLogin = (username, password) => ajax.post(BASE + "/login", { username, password })

//获取天气信息---发送jsonp格式 
export const reqWeather = (city) => {
	//执行器函数：内部去执行异步任务
	//成功了调用resolve() 失败了我们不再调用reject() 而是直接提示错误信息
	return new Promise((resolve, reject) => { 
		const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
		jsonp(url, {}, (err, data) => {
			if (!err && data.error === 0) { //成功
				let { dayPictureUrl, weather } = data.results[0].weather_data[0]
				resolve({ dayPictureUrl, weather })  //只能传一个参数
			} else { //失败 
				message.error("获取天气信息失败")
			}
		})
	})
	
}

//获取分类列表       axios默认是get请求    
export const reqCategorys = () => axios(BASE+"/manage/category/list")

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


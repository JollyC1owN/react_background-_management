/* 封装能发ajax请求的相关函数，向外暴露的本质是axios
1、解决post请求携带参数的问题：默认是json，需要转换成urlencode格式
2、让请求成功的结果不是response  而是 response.data的值
3、统一处理所有请求的异常错误
*/
import axios from "axios";
import qs from "qs"
import { message} from "antd"



//在真正发请求前：添加请求拦截器 ----interceptor    
//本质上是两个函数，下列代码删除了一个  详情见gitHub（axios）
//让post请求的请求体格式为urlencode格式--->  a=1&b=2
//config 中有好几个属性  --method：请求方式     data：请求体数据
//这样设置了之后，以后所有的post请求中data的格式就是一个对象的格式来写
axios.interceptors.request.use(function (config) {
	//得到请求方式和请求体数据
	const { method, data } = config
	//处理POST请求，将data对象转换成query参数格式字符串
	//判断请求是否是POST请求，并且传入了data请求体数据
	if (method.toLowerCase() === "post" && typeof data ==="object" ) { 
		config.data =  qs.stringify(data)    //转换成了  username=admin&password=admin重新赋值修改原来的data
	}
	return config;
});
// -------------------------------------------------------------------------------------------------------------
// 添加一个响应拦截器 response interceptor
	//功能1、让请求成功的结果不是response  而是 response.data的值
	//功能2、统一处理所有请求的异常错误
//在请求返回之后且在我们自己指定的请求回调函数之前 
axios.interceptors.response.use(function (response) {
	return response.data; //取出data //这个返回的结果，就会给我们自己指定的请求响应的回调函数 
}, function (error) {//统一处理所有请求的异常错误
	// return Promise.reject(error);
		// alert("请求出错" + error.message)
		message.error("请求出错" + error.message)
		// 目的是中断promise链==>我们自己指定的失败的回调函数不会执行了   返回一个pending状态的promise
		return new Promise(() => { })
});



export default axios
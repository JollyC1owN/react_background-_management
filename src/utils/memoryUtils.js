import storageUtils from "./storageUtils";

/* 
将user信息，存储到内存中，提高运行效率
*/
const user = storageUtils.getUser()   //用来存储登录用户的信息
export default {
	//通过自己封装的方法，获取到localStorage中的user，初始值为读取到的
	user,
	product:{}
}
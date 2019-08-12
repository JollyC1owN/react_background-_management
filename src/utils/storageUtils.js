/* 
操作local数据的工具函数模块
*/
//store 支持所有的浏览器Storage存储的操作     兼容比原生好
import store from "store"
const USER_KEY = "user_key"
export default {
	/* 保存suer */
	saveUser(user) {
		// localStorage.setItem(USER_KEY,JSON.stringify(user))
		store.set(USER_KEY,user)
	},
	//返回一个user对象，没有的话返回一个空对象{}
	getUser() { 
		// return JSON.parse(localStorage.getItem(USER_KEY) || "{}")
		return store.get(USER_KEY) || {}
	},
	/* 删除保存的user */
	removeUser() {
		// localStorage.removeItem(USER_KEY)
		store.remove(USER_KEY)
	 }
}
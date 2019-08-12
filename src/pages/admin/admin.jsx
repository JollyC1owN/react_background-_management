import React, { Component } from 'react'
import {Redirect } from "react-router-dom"
// import storageUtils from "../../utils/storageUtils"
import memoryUtils from '../../utils/memoryUtils';

export default class Admin extends Component {
	render() {
		//读取保存的user，如果不存在，直接跳转到登录界面
		//因为有可能不存在，不存在则返回一个null，不能对null进行parse，所以用一个空对象代替
		// const user = JSON.parse(localStorage.getItem("user_key") || "{}")
		const user = memoryUtils.user
		if (! user._id) { 
			//this.props.history.replace("/login")    不能在render中使用这样的写法，这样用在事件的回调函数中进行路由跳转
			// 在render中用一个组件Redirect ---- 重定向
		 	return	<Redirect to="/login" />				//自动跳转到指定的路由路径
		}
		return (
			<div>
				hello,{user.username}
			</div>
		)
	}
}

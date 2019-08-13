import React, { Component } from 'react'
import { Redirect,Route,Switch } from "react-router-dom"
import { Layout } from 'antd'
// import storageUtils from "../../utils/storageUtils"
import memoryUtils from '../../utils/memoryUtils'
//左侧导航
import LeftNav from '../../components/left-nav';
// 头部
import Header from "../../components/header"
// 首页
import 	Home from "../home/home"
// 分类管理
import Category from "../category/category"
// 商品管理
import Product from "../product/product"
//角色权限
import Role from '../role/role'
// 用户管理
import User from '../user/user'
// 柱状图
import Bar from '../charts/bar'
// 线形图
import Line from '../charts/line'
// 饼状图
import Pie from '../charts/pie'




const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
	render() {
		//读取保存的user，如果不存在，直接跳转到登录界面
		//因为有可能不存在，不存在则返回一个null，不能对null进行parse，所以用一个空对象代替
		// const user = JSON.parse(localStorage.getItem("user_key") || "{}")
		const user = memoryUtils.user
		if (!user._id) {
			//this.props.history.replace("/login")    不能在render中使用这样的写法，这样用在事件的回调函数中进行路由跳转
			// 在render()中用一个组件Redirect ---- 重定向
			return <Redirect to="/login" />				//自动跳转到指定的路由路径
		}
		return (
			<Layout style={{ height: "100%" }}>
				<Sider>
					<LeftNav />
				</Sider>
				<Layout>
					<Header />
					<Content style={{ backgroundColor: "white", margin:"20px" }}>
						<Switch>
							<Route path='/home' component={Home} />
							<Route path='/category' component={Category} />
							<Route path='/product' component={Product} />
							<Route path='/role' component={Role} />
							<Route path='/user' component={User} />
							<Route path='/charts/bar' component={Bar} />
							<Route path='/charts/line' component={Line} />
							<Route path='/charts/pie' component={Pie} />
							 <Redirect to='/home' />
						</Switch>
						
					</Content>
					<Footer style={{ textAlign: "center", color: "rgba(0,0,0,.5)" }}>
						推荐使用谷歌浏览器，可以获得更佳的页面操作</Footer>
				</Layout>
			</Layout>
		)
	}
}

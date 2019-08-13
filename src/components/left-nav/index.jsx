/* admin左侧导航组件 */
import React, { Component } from 'react'
import { Link ,withRouter} from "react-router-dom"
import { Menu, Icon } from 'antd';

import "./index.less"
import logo from "../../assets/images/logo.png"
// 引入导航菜单的配置
import menuList from '../../config/menuConfig';



const { SubMenu } = Menu;
class LeftNav extends Component {
	/* reduce方法实现 */
		getMenuNodes2 = (menuList) => {
			return menuList.reduce((pre, item) => {
				//可能想pre中添加 <Menu.Item>
				if (!item.children) {
					pre.push(
						<Menu.Item key={item.key}>
							<Link to={item.key}>
								<Icon type={item.icon} />
								<span>{item.title}</span>
							</Link>
						</Menu.Item>
					)
				} else {
					


					pre.push(
						<SubMenu
							key={item.key}
							title={
								<span>
									<Icon type={item.icon} />
									<span>{item.title}</span>
								</span>
							}
						>
							{
								//通过递归的方式再创建下面的item
								this.getMenuNodes2(item.children)
							}
						</SubMenu>
					)
				 }
				//也有可能添加<SubMenu>
				return pre
			 },[])
		 } 


	/* 根据指定的menu数据生成<Menu.Item>和<SubMenu>的数组 */
	// 通过map加工来创建标签
/* 	getMenuNodes = (menuList) => {
		return menuList.map((item) => {
			if (!item.children) {
				return (
					<Menu.Item key={item.key}>
						<Link to={item.key}>
							<Icon type={item.icon} />
							<span>{item.title}</span>
						</Link>
					</Menu.Item>
				)
			}
			return (
				<SubMenu
					key={item.key}
					title={
						<span>
							<Icon type={item.icon} />
							<span>{item.title}</span>
						</span>
					}
				>
					{
						//通过递归的方式再创建下面的item
						this.getMenuNodes(item.children)
					}
				</SubMenu>
			)
		})
	} */

	render() {
		//当前请求的路由路径
		// 由于当前组件不是用作路由组件来使用，所以this.props是一个空对象{ } ，我们借助路由库提供的 withRouter()来添加路由组件该有的三个属性
		const selectKey = this.props.location.pathname
		// console.log(this.props);
		return (
			<div className="left-nav" >
				<Link className="left-nav-link" to="/home">
					<img src={logo} alt="logo" />
					<h1>硅谷后台</h1>
				</Link>
				<Menu
					defaultSelectedKeys={[selectKey]}  //默认选中的那个
					defaultOpenKeys={["/products"]}
					mode="inline"				//展开和收缩的方式
					theme="dark"				//主题
				>
					{
						this.getMenuNodes2(menuList)
					}
					
					{/* <Menu.Item key="/home">
						<Link to="/home">
							<Icon type="home" />
							<span>首页</span>
						</Link>
					</Menu.Item>
					<SubMenu
						key="products"
						title={
							<span>
								<Icon type="mail" />
								<span>商品</span>
							</span>
						}
					>
						<Menu.Item key="/category">
							<Link to="/category">
								<Icon type="folder-open" />
								<span>品类管理</span>
							</Link>
						</Menu.Item>
						<Menu.Item key="/product">
							<Link to="/product">
								<Icon type="hdd" />
								<span>商品管理</span>
							</Link>
						</Menu.Item>
					</SubMenu> */}
				</Menu>
			</div>
		)
	}
}

// 向外暴露，使用高阶组件withRouter()来包装LeftNav。来让一个非路由组件，可以具有路由组件的三个特别属性
// history、location、match
// 包装之后LeftNav可以操作路由的相关语法
export default withRouter(LeftNav)


/* 
两个小问题

1、 默认选中对应的menuItem
2、有可能需要默认打开某个SubMenu :访问的是某个二级菜单项对应的path
*/
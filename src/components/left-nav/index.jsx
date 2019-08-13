/* admin左侧导航组件 */
import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Menu, Icon, Button } from 'antd';

import "./index.less"
import logo from "../../assets/images/logo.png"
// 引入导航菜单的配置
import menuList from '../../config/menuConfig';



const { SubMenu } = Menu;
export default class LeftNav extends Component {
/* 根据指定的menu数据生成<Menu.Item>和<SubMenu>的数组 */
	// 通过map加工来创建标签
	getMenuNodes = (menuList) => { 
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
							<Icon type={item.icon}/>
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
	}

	render() {
		return (
			<div className="left-nav" >
				<Link className="left-nav-link" to="/home">
					<img src={logo} alt="logo" />
					<h1>硅谷后台</h1>
				</Link>
				<Menu
					defaultSelectedKeys={['/home']}  //默认选中的那个
					// defaultOpenKeys={['sub1']}
					mode="inline"				//展开和收缩的方式
					theme="dark"				//主题
				>
					{
						this.getMenuNodes(menuList)
					}
					{
						/* 
						<Menu.Item key="/home">
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
					</SubMenu>
						*/
					}
				</Menu>
			</div>
		)
	}
}

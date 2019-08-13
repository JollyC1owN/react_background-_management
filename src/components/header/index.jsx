/* 头部 */
import React, { Component } from 'react'
import { Modal } from 'antd';
import { withRouter } from "react-router-dom"


import './index.less';

import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import menuList from '../../config/menuConfig';
import { formateDate } from '../../utils/dateUtils';
import { reqWeather } from '../../api';
import LinkButton from "../../components/link-button"

class Header extends Component {

	state = {
		currentTime: Date.now(),
		dayPictureUrl: "", //图片的url字符串
		weather: ""   //天气文本
	}

	componentDidMount() {
		//启动循环定时器
		this.timerId = setInterval(() => {
			this.setState({
				//将时间更新为当前的时间值
				currentTime: formateDate(Date.now())
			})
		}, 1000);

		// 发送jsonp请求，获取天气信息显示
		this.getWeather()
	}

	componentWillUnmount() {
		clearInterval(this.timerId)
	}
	//退出登陆
	logout = () => {
		// 显示确认提示
		Modal.confirm(
			{
				title: '您确认要退出吗？',
				content: '♥♥♥♥♥♥♥♥',
				onOk: () => {
					console.log('OK');
					// 确认后删除存储的用户信息 ---->  
					// local
					storageUtils.removeUser()
					// 内存 
					memoryUtils.user = {}
					//清除后跳转到登录界面
					this.props.history.replace("/login")
				},
				onCancel: () => {
					console.log('Cancel');
				},
			}
		)
	}

	/*获取title   ----根据当前请求的path来获取  */
	getTitle = () => {
		let title = ""
		const path = this.props.location.pathname
		menuList.forEach(item => {
			if (item.key === path) {
				title = item.title
			} else if (item.children) {
				const cItem = item.children.find(cItem => cItem.key === path)
				if (cItem) {
					title = cItem.title
				}
			}
		})
		return title
	}

	/* 自定义的获取天气信息的函数 */
	getWeather = async() => { 
		const {dayPictureUrl, weather } = await reqWeather("北京")
		this.setState({dayPictureUrl, weather })
	}
	render() {
		const { currentTime, dayPictureUrl, weather } = this.state
		const user = memoryUtils.user
		// 得到当前需要显示的title
		const title = this.getTitle()
		return (
			<div className="header">
				<div className="header-top">
					欢迎！{user.username} &nbsp;&nbsp;
					<LinkButton  onClick={this.logout}>退出</LinkButton>
				</div>
				<div className="header-bottom">
					<div className="header-bottom-left">{title}</div>
					<div className="header-bottom-right">
						<span>{currentTime}</span>
						<img src={dayPictureUrl} alt="weather" />
						<span>{weather}</span>
					</div>
				</div>
			</div>
		)
	}
}

export default withRouter(Header)
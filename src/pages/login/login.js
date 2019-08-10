import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd';


import logo from "./images/logo.png"
import './login.less';


const Item = Form.Item
class Login extends Component {
	handleSubmit = e => {
		//阻止form表单中button的提交默认行为
		e.preventDefault();
		//取出输入的相关数据
		const form = this.props.form
		//获取所有的输入框的值
		const values = form.getFieldsValue()
		//获取某一个输入框的值
		const username = form.getFieldValue("username")
		const password = form.getFieldValue("password")
		console.log(values, username, password);
		
		alert("发送ajax")
	}
	render() {
		let { getFieldDecorator } = this.props.form
		return (
			<div className="login">
				<div className="login-header">
					<img src={logo} alt="logo" />
					<h1>React项目：后台管理系统</h1>
				</div>
				<div className="login-content">
					<h1>用户登录</h1>
					<Form onSubmit={this.handleSubmit} className="login-form">
						<Item>
							{/**getFieldDecorator()()接受的是一个组件标签返回的还是组件标签 */}
							{/**配置对象：属性名是一些特定的名称  rules */}
							{getFieldDecorator("username", {
								rules: [
									//声明式验证：使用插件已经定义好的规则进行验证
									// 1、必须输入
									// 2、必须大于等于4位
									// 3、必须小于等于12位
									// 4、必须是英文、数字、下划线的组成
									//required必填项,message:提示语句  whitespace:必选时，空格是否会被视为错误
									{ required: true, whitespace:true ,message: '用户名是必须的' },
									{ min: 4, message:'用户名不能小于4位'},
									{ max: 12, message: '用户名不能大于12位' },
									//+: >=1    * :>=0   ?: 0/1
									{ pattern: /^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线的组成'},
								]
							})(
								<Input
									prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
									placeholder="用户名"
								/>
							)}
						</Item>

						<Item>
							{getFieldDecorator("password", {
								rules: []
							})(
								<Input
									prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
									type="password"
									placeholder="密码"
								/>
							)}
						</Item>
						<Item>
							<Button type="primary" htmlType="submit" className="login-form-button">登 陆</Button>
						</Item>
					</Form>
				</div>
			</div>
		)
	}
}
/* 
利用Form.create()包装Form组件生成一个新的组件
Form组件：包含Form标签的组件
新组件会向form组件传递一个强大的属性：属性名：form，属性值：对象---->{理由有很多方法}
在浏览器的react中进行查看
 */
const WrapperForm = Form.create()(Login)

export default WrapperForm   //最终生成的组件名：<Form(Login)/>	

/*
组件：组件类，本质就是一个构造函数,定义组件：class组件/	function组件
组件对象：组件类的实例，也就是构造函数的实例 <App/>
*/

/*
用户名和密码的合法性要求
1、必须输入
2、必须大于等于4位
3、必须小于等于12位
4、必须是英文、数字、下划线的组成
*/




/*
高阶函数：
	定义：接受的参数是函数或者返回值是函数
	常见的：数组遍历相关的方法、定时器、Promise、高阶组件
	作用：实现一个更加强大，动态的功能

高阶组件：
	本质是一个函数
	函数接受一个组件，返回一个新的组件
	Form.create()返回的就是一个高阶组件
*/
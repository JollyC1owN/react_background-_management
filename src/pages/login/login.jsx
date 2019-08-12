import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd';


import logo from "./images/logo.png"
import './login.less';


const Item = Form.Item
class Login extends Component {
	
	//提交点击事件的回调函数
	handleSubmit = e => {
		//阻止form表单中button的提交默认行为
		e.preventDefault();
		/* 取出输入的相关数据
		const form = this.props.form
		获取所有的输入框的值
		const values = form.getFieldsValue()
		获取某一个输入框的值
		const username = form.getFieldValue("username")
		const password = form.getFieldValue("password")
		console.log(values, username, password); */
		
		//对表单所有的字段进行统一验证    values是获取到的数据，不用我们自己去获取----对象类型
		// this.props.form.validateFields((err, values) => {   
		this.props.form.validateFields((err, { username, password }) => { //---->也可以结构赋值拿到里面的内容
			if (!err) {
				// console.log('Received values of form: ', values);
				// alert(`验证通过发送ajax请求,username=${values.username},password=${values.password}`)
				alert(`验证通过发送ajax请求,username=${username},password=${password}`)
			} else { 
				// alert("验证失败")   ----测试的时候书写的
			}
		})
	}

	//对密码进行自定义验证
	validatePwd = (rule,value,callback) => { 
		// 1、必须输入
		// 2、必须大于等于4位
		// 3、必须小于等于12位
		// 4、必须是英文、数字、下划线的组成
		value = value.trim()
		if (!value) {
			callback("密码必须输入")
		} else if (value.length < 4) {
			callback("密码不能小于4位")
		} else if (value.length > 12) {
			callback("密码不能大于12位")
		} else if (! /^[a-zA-Z0-9_]+$/.test(value)) {
			callback("密码必须是英文、数字或下划线的组成")
		} else { 
			callback()  //验证通过
		}
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
								initialValue: "", //初始值   在未输入时点击提交就直接就提示用户不能为空
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
									//+: >= 1次    * :>= 0次   ?: 0或1次
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
								initialValue: "", //初始值  在未输入时点击提交就直接就提示用户不能为空
								rules: [
									{ validator: this.validatePwd}
								]
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
组件：组件类，本质就是一个构造函数,定义组件：class组件 /	function组件
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
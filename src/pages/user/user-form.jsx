import React, { Component } from 'react'
import { Form, Input, Select } from "antd"
import PropTypes from 'prop-types';
const Item = Form.Item
const Option = Select.Option


class UserForm extends Component {
	// 限制从父组件传来的数据类型
	static propsTypes = {
		setForm : PropTypes.func.isRequired,
		roles: PropTypes.array, //用户角色数据数组
		user:PropTypes.object,  //当前点击的那一个用户的信息
	}

	componentWillMount() {
		this.props.setForm(this.props.form)
	}

	render() {
		const { user,roles } = this.props
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 16 }
		}
		return (
			<Form {...formItemLayout}>
				<Item label="用户名：">
					{
						getFieldDecorator("username", {
							initialValue: user.username,
							rules: [
								{ required: true, message: "用户名必须输入" }
							]
						})(
							<Input type="text" placeholder="请输入用户名"></Input>
						)
					}
				</Item>
				{ //判断传来的数据中是否有_id：有则是修改，无则是添加；添加时才显示密码栏
					!user._id ? (
						<Item label="密码：">
						{
							getFieldDecorator("password", {
								initialValue: "",
								rules: [
									{ required: true, message: "密码必须输入" }
								]
							})(
								<Input type="password" placeholder="请输入密码"></Input>
							)
						}
					</Item>
					) : null
				}
				<Item label="手机号：">
					{
						getFieldDecorator("phone", {
							initialValue: user.phone,
							rules: [
								{ required: true, message: "手机号必须输入" }
							]
						})(
							<Input type="text" placeholder="请输入手机号"></Input>
						)
					}
				</Item>
				<Item label="邮箱：">
					{
						getFieldDecorator("email", {
							initialValue: user.email,
							rules: [
								{ message: "邮箱必须输入" }
							]
						})(
							<Input type="email" placeholder="请输入邮箱"></Input>
						)
					}
				</Item>
				<Item  label="角色：">
					{
						getFieldDecorator("role_id", {
							initialValue: user.role_id,
							rules: [
								{required: true, message: "角色必须选择" }
							]
						})(
							<Select  placeholder="请选择用户角色">
								{
									roles.map((item => <Option vlaue={item._id} key={item._id}>{item.name}</Option>))
								}
							</Select>
						)
					}
				</Item>
			</Form>
		)
	}
}

export default Form.create()(UserForm)
/* 添加用户角色的弹出框 */
import React, { Component } from 'react'
import { Form, Input } from "antd"
import PropTypes from 'prop-types'

const Item = Form.Item

class AddForm extends Component {

	static proprsType = {
		setForm : PropTypes.func.isRequired
	}
	componentWillMount() {
		this.props.setForm(this.props.form)
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
		return (
			<Form {...formItemLayout}>
				<Item label = "角色名称">
					{
						getFieldDecorator("roleName", {
							initialValue:"",
							rules: [
								{required:true,message:"用户角色必须输入"}
							]
						})(
							<Input type="text" placeholder="请输入角色名称"></Input>
						)
					}
				</Item>
			</Form>
		)
	}
}


export default Form.create()(AddForm)
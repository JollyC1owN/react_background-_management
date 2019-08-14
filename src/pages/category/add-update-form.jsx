/* 此Form组件是添加或者修改框的表单 */
import React, { Component } from 'react'
import PropTypes from "prop-types"
import { Form, Input, message } from 'antd';
const Item = Form.Item
class AddUpdateForm extends Component {
	static propTypes = {
		//设置传来的参数的数据类型
		setForm: PropTypes.func.isRequired,
		//有可能不传
		categoryName: PropTypes.string,
	}


	componentWillMount() {
		// 将当前子组件拥有的form对象通过函数交给了父组件
		this.props.setForm(this.props.form)
	}

	render() {
		const { getFieldDecorator } = this.props.form
		const { categoryName} =this.props
		return (
			<div>
				<Form>
					<Item>
						{getFieldDecorator("categoryName", {
							initialValue: categoryName || "", //初始值
							rules: [
								{ required: true, whitespace: true, message: '分类名称是必须输入' }
							]
						})(
							<Input type="text" placeholder="请输入分类名称"></Input>
						)}

					</Item>
				</Form>
			</div>
		)
	}
}

export default Form.create()(AddUpdateForm)

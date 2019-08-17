import React from "react"
import { Tree, Form, Input } from 'antd';

import menuList from "../../config/menuConfig"

const { TreeNode } = Tree;
const Item = Form.Item
export default class UpdateRole extends React.Component {
	state = {
		checkedKeys: [],
	}
	render() {
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 10 }
		}
		const { checkedKeys } = this.state
		return (
			<div>
				<Item label="角色名称" {...formItemLayout}>
					<Input disabled value="tomb" ></Input>
				</Item>
				<Tree
				checkable   
				defaultExpandAll    //默认打开所有的
				onCheck={this.handleCheck}  //当复选框被点击时触发 的事件
				checkedKeys={checkedKeys} //选中的复选框的数组集合
				>
					{
						this.createTreeNodes
					}
				</Tree>
			</div>
		)
	}
}

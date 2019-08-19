import React from "react"
import { Tree, Form, Input } from 'antd';
import PropTypes from 'prop-types'

import menuList from "../../config/menuConfig"

const { TreeNode } = Tree;
const Item = Form.Item
export default class UpdateRole extends React.Component {

	static propTypes = {
    role: PropTypes.object
  }
	state = {
		checkedKeys: [],
	}
	//定义一个方法，然后在父组件中调用拿到，收集到的所有选中的权限，为发送请求做准备
	getRoles = () => { 
		return this.state.checkedKeys
	}

	// // 在组件将要挂载的时候获取到父组件传来的数据，并且更新状态
	componentWillMount() {
		const menus = this.props.role.menus
		this.setState({
			checkedKeys:menus
		})
	}


	//在props属性的值发生变化的时候，触发声明周期的事件
	componentWillReceiveProps(nextProps) {
		//拿到最新的数据并且更新状态
		const menus = nextProps.role.menus
		this.setState({
			checkedKeys:menus
		})
		console.log(2222222);
		
	}
	
	handleCheck = (checkedKeys) => { 
		this.setState({
			checkedKeys
		})
	}
	// 创建所有的权限列表
	createTreeNodes = (menuList) => { 
			return menuList.map((item) => {
				return (<TreeNode title={item.title} key={item.key}>
					{item.children ? this.createTreeNodes(item.children) : null }
				</TreeNode>)
			 })
		}
	render() {
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 10 }
		}
		const { name} = this.props.role
		const { checkedKeys } = this.state
		return (
			<div>
				<Item label="角色名称" {...formItemLayout}>
					<Input disabled value={name} ></Input>
				</Item>
				<Tree
				checkable   
				defaultExpandAll    //默认打开所有的
				onCheck={this.handleCheck}  //当复选框被点击时触发 的事件
				checkedKeys={checkedKeys} //选中的复选框的数组集合
				>
				<TreeNode title = "平台全选" key= "0-0">
					{
						this.createTreeNodes(menuList)
					}
					</TreeNode>
				</Tree>
			</div>
		)
	}
}

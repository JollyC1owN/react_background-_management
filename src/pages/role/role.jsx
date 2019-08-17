/**
 * 角色管理
 */
import React, { Component } from 'react'
import {
  Card,
  message,
  Button,
  Table,
  Modal
} from "antd"
import { formateDate } from "../../utils/dateUtils"
import LinkButton from "../../components/link-button"
import { reqUsersRoleList,reqAddRole } from '../../api';
import AddForm from "./add-form"
import UpdateRole from './set-form';



export default class Role extends Component {

  state = {
    loading: true,
    roles: [],
    isShowAdd: false,
    isShowAuth:false
  }

  
  //初始化表格的字段内容
  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        // render: create_time => formateDate(create_time)
        // 调用时间格式函数，让时间显示正确的格式
        render: formateDate
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name'
      },
      {
        title: '操作',
        render: (role) => <LinkButton onClick={(role) => this.showRoles(role)}>设置权限</LinkButton>
      },
    ]
  }

  // 点击设置权限显示弹窗，并且保存当前的那个用户角色的信息
  showRoles = (role) => {
    this.role = role
    this.setState({
      isShowAuth:true
    })
   }

  //发送请求得到roles里面的用户角色列表
  getRoles = async () => {
    this.setState({loading:true})
    const result = await reqUsersRoleList()
    this.setState({loading:false})
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    }
  }
  // 添加用户发送请求
  addRole = ()=>{
    this.form.validateFields(async (err, vlaues) => { 
      if (!err) { 
        this.setState({isShowAdd: false})
        const { roleName } = vlaues
        const result = await reqAddRole(roleName)
        if (result.status === 0) { 
          message.success("添加用户角色成功")
          this.getRoles()
        }
      }
    })
  }

  // 修改用户角色权限
  updateRole = () => { 

  }


  componentWillMount() {
    //初始化表格的字段内容
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { loading, roles ,isShowAdd,isShowAuth} = this.state
    const title = (
      <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>添加角色</Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={roles}
        />
        <Modal
          visible={isShowAdd}
          title="添加角色"
          onOk={this.addRole}
          onCancel={() => {
            this.form.resetFields() //初始化输入框里的内容
            this.setState({ isShowAdd: false })
          }}
        >
          <AddForm setForm={(form)=>this.form = form}/>  
        </Modal>
         
        
        <Modal
          visible={isShowAuth}
          title="设置角色权限"
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false })
          }}
        >
        <UpdateRole/>
        </Modal>
      </Card>
    )
  }
}

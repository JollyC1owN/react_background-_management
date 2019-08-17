/** 用户管理 */
import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
} from "antd"

import UserForm from "./user-form"
import { reqUsers ,reqAddUpdateUser,reqDeleteUser} from '../../api';
import { PAGR_SIZE } from "../../utils/constants"
import LinkButton from "../../components/link-button"
import { formateDate} from "../../utils/dateUtils"

export default class User extends Component {
  state = {
    loading: false,
    users: [],   //用户数据数组
    isShow: false, //是否显示弹出框
    roles: []   //用户角色数据数组
  }
  // 初始化所有字段
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: (role_id) => this.rolesObj[role_id].name
      },
      {
        title: '操作',
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            &nbsp;&nbsp;
            <LinkButton onClick={() => this.clickDelete(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }

  // 生成roles的对象容器
  initRolesObj = (roles) => {
    this.rolesObj = roles.reduce((pre, role) => {
      pre[role._id] = role
      return pre
    }, {})
  }
  // 获取所有用户信息
  getUsers = async () => {
    this.setState({ loading: true })
    const result = await reqUsers()
    if (result.status === 0) {
      this.setState({ loading: false })
      const { users, roles } = result.data
      // 根据roles的数组生成roles的对象容器
      this.initRolesObj(roles)
      this.setState({ users, roles })
    }
  }
  //显示修改用户的对话框
  showUpdate = (user) => {
    this.user = user    //将点击的那个用户的信息对象，保存到this中
    this.setState({ isShow: true })
  }
  //删除用户的对话框
  // 响应点击删除用户
  clickDelete = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗?`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          this.getUsers()
        }
      }
    })
  }
  //显示创建用户对话框
  showCreateUser = () => {
    this.user = null
    this.setState({ isShow: true })
  }


  //修改或者添加用户
  AddOrUpdateUser =async () => { 
    const user = this.form.getFieldsValue()
    this.form.resetFields()  //将里输入框里的内容初始化
    if (this.user) { //有  则就是修改的操作
      user._id = this.user._id
    }
    this.setState({
      isShow: false
    })
    const result = await reqAddUpdateUser(user)
    if (result.status === 0) { 
      message.success("操作用户成功")
      this.getUsers()  //重新获取用户列表
    }
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }


  render() {
    const { users, isShow, loading ,roles} = this.state
    const user = this.user || {}
    const title = (
      <Button type="primary" onClick={this.showCreateUser}>创建用户</Button>
    )
    return (
      <Card title={title}>
        <Table
          loading={loading}
          columns={this.columns} //字段内容
          rowKey='_id'
          dataSource={users} //表格中的数据
          bordered        //边框
          pagination={{ defaultPageSize: PAGR_SIZE, showQuickJumper: true }}
        // 默认显示的几条数据             是否可以跳转第几页
        />
        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onCancel={() => { 
            this.form.resetFields() 
            this.setState({ isShow: false })
          }}
          onOk={this.AddOrUpdateUser}
        >
          <UserForm
            setForm={(form) => this.form = form}
            user={user}
            roles={roles}
          />
        </Modal>

      </Card>
    )
  }
}

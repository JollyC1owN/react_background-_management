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
import { reqUsersRoleList,reqAddRole,reqUpdateRole } from '../../api';
import AddForm from "./add-form"
import UpdateRole from './set-form';
import memoryUtils from "../../utils/memoryUtils"


export default class Role extends Component {

  constructor(props) { 
    super(props)
    this.roleRef = React.createRef()
  }

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
                                      //在点击里面的函数的形参不要传role！！！！！！           
        render: (role) => <LinkButton onClick={() => this.showRoles(role)}>设置权限</LinkButton>
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
        this.form.resetFields() //初始化输入框里的内容
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
  updateRole = async () => { 
    this.setState({
      isShowAuth: false
    })
    //拿到当前点击的那一个的数据对象的role ---在点击的时候就已经保存在了this中
    const role = this.role
    //调用子组件中的方法，拿到选中的复选框的选择
    role.menus = this.roleRef.current.getRoles()
    // 获取当前的设置时间
    role.auth_time = Date.now()
    // 在内存中拿到当前登录的用户
    role.auth_name = memoryUtils.user.username
    const result = await reqUpdateRole(role)
    if (result.status === 0) {
      message.success("设置权限成功")
      this.getRoles()
    } else { 
      message.error("设置权限失败")
    }
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
          <UpdateRole role={this.role} ref={this.roleRef}/>
        </Modal>
      </Card>
    )
  }
}

/**分类管理*/
import React, { Component } from 'react'
import { Card, Button, Icon, Table, message,Modal } from 'antd';
import LinkButton from "../../components/link-button"
//接口请求函数
import { reqCategorys,reqAddCategory,reqUpdateCategory } from '../../api';
import AddUpdateForm from './add-update-form';






export default class Category extends Component {

  state = {
    categorys: [], //所有分类的列表---数组
    loading: false,  //请求加载中
    showStatus: 0, // 0 代表不显示设置框  1：代表显示添加的框     2：代表显示修改的框
  }
  // 初始化table的所有列信息的数组
  initColumns = () => { 
    //描述所有字段
    this.columns = [
      {
        title: '分类名称',  //每一列的名字
        dataIndex: 'name',

      },
      {
        title: '操作',
        width: 300,
        render: () => <LinkButton>修改分类</LinkButton>
      }
    ]; 
  }

  //获取分类信息的函数
  getCategory = async () => {
    // 显示loading状态
    this.setState({loading:true})
    //发送请求
    const result = await reqCategorys()
    if (result.status === 0) { //获取成功
      const categorys = result.data
      this.setState({ //修改loading状态
        loading: false
      })
      this.setState({ //修改状态
        categorys,
        loading: false
      })
    } else { 
      message.error("获取分类列表失败")
      
    }
  }


  //修改、添加框点击ok后的回调----去添加/修改分类
  handleOk =  () => { 
    // 进行表单验证
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 验证通过后，得到输入数据
        const { categoryName} = values
        // 发添加分类的请求
        const result = await reqAddCategory(categoryName)
        // 无论是否成功都修改显示框的状态，让他消失
        this.setState({ showStatus: 0 })
        // 根据响应结果，做不同的处理
        if (result.status === 0) { //成功
          // 重新获取分类信息
          this.getCategory()
         message.success("添加分类成功")
        } else { //失败
          message.error("添加分类失败")
        }
      }
    })
    
  }
  //修改、添加框点击cancel后的回调 ----修改showStatus的值为0；让弹出框消失 
  handleCancel = () => { 
    this.setState({
      showStatus:0
    })
  }

  // 初始化
  componentWillMount() {
    this.initColumns()
  }
  // 获取分类信息列表
  componentDidMount() {
    this.getCategory()
  }


  render() {
    // 取出状态数据 categorys
    const { categorys, loading,showStatus} = this.state
    //card  右上角-  +添加  -结构
    const extra = (
      <Button type="primary" onClick={() => this.setState({ showStatus: 1})}>
        <Icon type="plus"></Icon>
        添加
      </Button>
    )
    return (
      <Card title="" extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={categorys}
          pagination={{ defaultPageSize: 5, showQuickJumper:true}}
        ></Table>

        <Modal
          title={showStatus === 1 ? "添加分类" : "修改分类"}
          visible={showStatus!== 0}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {/* 将子组件传递过来的form对象，保存到当前组件对象中 */}
          <AddUpdateForm setForm={form => this.form = form}/>
        </Modal>
      </Card>
      
  )
  }
}

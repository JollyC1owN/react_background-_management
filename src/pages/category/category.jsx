/**分类管理*/
import React, { Component } from 'react'
import { Card, Button, Icon, Table, message } from 'antd';
import LinkButton from "../../components/link-button"
import { reqCategorys } from '../../api';




export default class Category extends Component {

  state = {
    categorys: [], //所有分类的列表---数组
    loading:false  //请求加载中
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
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getCategory()
  }
  render() {
    // 取出状态数据 categorys
    const { categorys,loading} = this.state
    //card  右上角-  +添加  -结构
    const extra = (
      <Button type="primary">
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
      </Card>
    )
  }
}

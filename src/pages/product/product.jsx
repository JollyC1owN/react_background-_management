/**
 * 商品管理
 */
import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table } from "antd"

import LinkButton from "../../components/link-button"
import { reqProducts } from '../../api';

const Option = Select.Option


export default class Product extends Component {
  state = {
    loading: false,
    products: [],      //当前页的商品的列表
    total:0     //商品的总数量    ---初始为0
  }

  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc"
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "￥" + price
      },
      {
        title: "状态",
        width: 100,
        dataIndex: "status",
        render: (status) => {
          let btnText = "下架"
          let text = "在售"
          if (status === 2) {
            btnText = "上架"
            text = "已下架"
          }
          return (
            <span>
              <button>{btnText}</button><br />
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: "操作",
        render: (product) => (
          <span>
            <LinkButton>详情</LinkButton>
            <LinkButton>修改</LinkButton>
          </span>
        )
      },
    ]
  }
  // 异步获取指定页码商品列表显示
  getProducts = async (pageNum) => {
    this.setState({loading:true})
    //发送请求获取数据
    const result = await reqProducts(pageNum, 2)
    this.setState({loading:false})
    if (result.status === 0) { 
      const { total, list } = result.data
      //更新状态
      this.setState({
        products: list,
        total
      })
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1) //分页列表，只需要请求第一页显示
  }
  render() {
    const { loading, products,total } = this.state
    const title = (
      <span>
        <Select style={{ width: 200 }} value="2">
          <Option value="1">按名称搜索</Option>
          <Option value="2">按描述搜索</Option>
        </Select>
        <Input style={{ width: 200, margin: "0 10px" }} placeholder="输入关键字" />
        <Button type="primary">搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary">
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={products}
          //当点击页码时，自动调用getProducts
          pagination={{total, defaultPageSize: 2, showQuickJumper: true,  onChange:this.getProducts}} 
        ></Table>
      </Card>
    )
  }
}

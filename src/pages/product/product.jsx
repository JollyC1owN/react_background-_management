/**
 * 商品管理
 */
import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table } from "antd"
const Option = Select.Option
export default class Product extends Component {
  state = {
    loading: false,
  }
  render() {
    const { loading} = this.state
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
          // rowKey="_id"
          // loading={loading}
          // columns={this.columns}
          // dataSource={categorys}
          // pagination={{ defaultPageSize: 5, showQuickJumper: true }}
        ></Table>
      </Card>
    )
  }
}

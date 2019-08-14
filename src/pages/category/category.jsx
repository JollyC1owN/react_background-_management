/**分类管理*/
import React, { Component } from 'react'
import { Card,Button,Icon,Table } from 'antd';


export default class Category extends Component {
  render() {
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
        ></Table>
      </Card>
    )
  }
}

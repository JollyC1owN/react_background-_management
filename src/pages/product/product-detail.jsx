import React, { Component } from 'react'
import {
  Card,
  Icon,
  List,

} from "antd"
import LinkButton from "../../components/link-button"
const Item = Icon.Item
/*
商品管理的详情子路由
*/
export default class ProductDetail extends Component {
  render() {
    const title = (
      <span>
        <LinkButton onClick={()=>this.props.history.goBack()}>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title}>
        <List>
        </List>
      </Card>
    )
  }
}

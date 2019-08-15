import React, { Component } from 'react'
import {
  Card,
  Icon,
  List,
} from "antd"
import LinkButton from "../../components/link-button"
const Item = List.Item
/*
商品管理的详情子路由
*/
export default class ProductDetail extends Component {
  render() {
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className="detail">
        <List>
          <Item>
            <span className="detail-left">商品名称：</span>
            <span>aaaa</span>
          </Item>
          <Item>
            <span className="detail-left">商品描述：</span>
            <span>bbbb</span>
          </Item>
          <Item>
            <span className="detail-left">商品价格：</span>
            <span>213元</span>
          </Item>
          <Item>
            <span className="detail-left">所属分类：</span>
            <span>jolly</span>
          </Item>
          <Item>
            <span className="detail-left">商品图片：</span>
            <span>
              <img src="sssss" alt=""/>
            </span>
          </Item>
          <Item>
            <span className="detail-left">商品详情：</span>
            <span dangerouslySetInnerHTML ={{__html:"<a>kkkk</a>"}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

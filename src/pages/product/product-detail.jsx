import React, { Component } from 'react'
import {
  Card,
  Icon,
  List,
} from "antd"
import LinkButton from "../../components/link-button"
import memoryUtils from "../../utils/memoryUtils"
import { reqProductInfo ,reqCategory} from '../../api';
import { IMG_BASE_URL } from '../../utils/constants';

const Item = List.Item

/*
商品管理的详情子路由
*/
export default class ProductDetail extends Component {
  state = {
    product: memoryUtils.product,
    categoryName:""
  }

  getCategory = async (categoryId) => {
    const result = await reqCategory(categoryId)
    if (result.status === 0) { 
      const categoryName = result.data.name
      this.setState({categoryName})
    }
   }

  componentWillMount() {
    const product = memoryUtils.product
    if (product._id) {
      this.setState({product})
     }
  }

  async componentDidMount() {
    if (!this.state.product._id) {
      const productId = this.props.match.params.id
      const result = await reqProductInfo(productId)
      if (result.status === 0) {
        const product = result.data
        this.getCategory(product.categoryId)
        this.setState({ product })
      }
    } else { 
      const categoryId = this.state.product.categoryId
      this.getCategory(categoryId)
    }
  }

  render() {
    const { product,categoryName} = this.state
    
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
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="detail-left">商品描述：</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className="detail-left">商品价格：</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className="detail-left">所属分类：</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className="detail-left">商品图片：</span>
            <span>
              {
                product.imgs&&product.imgs.map(img => (
                  <img className="detail-img" key={img} src={IMG_BASE_URL + img} alt="img"/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="detail-left">商品详情：</span>
            <span dangerouslySetInnerHTML ={{__html:product.detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

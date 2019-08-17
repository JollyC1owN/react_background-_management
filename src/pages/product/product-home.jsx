/**
 * 商品管理
 */
import React, { Component } from 'react'
import { Card, Select, Input, Button, Icon, Table, message } from "antd"

import LinkButton from "../../components/link-button"
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';
import { PAGR_SIZE } from '../../utils/constants';
import memoryUtils from "../../utils/memoryUtils"
import _ from "lodash"
const Option = Select.Option


export default class ProductHome extends Component {
  state = {
    loading: false,
    products: [],      //当前页的商品的列表
    total: 0,     //商品的总数量    ---初始为0
    searchType: "productName",  //默认是按商品名称搜索
    searchName: ""
  }
  updateStatus = _.throttle(async (productId, status) => {
    // 计算更新后的值
    status = status === 1 ? 2 : 1
    // 请求更新
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success("更新商品状态成功！")
    }
    // 让当前页显示
    this.getProducts(this.pageNum)
  }, 2000, {trailing:false})

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
        // dataIndex: "status",
        render: ({ _id, status }) => {
          let btnText = "下架"
          let text = "在售"
          if (status === 2) {
            btnText = "上架"
            text = "已下架"
          }
          return (
            <span>
              <button onClick={() => this.updateStatus(_id, status)}>{btnText}</button><br />
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title: "操作",
        render: (product) => (
          <span>
            <LinkButton
              onClick={() => {
                memoryUtils.product = product
                this.props.history.push(`/product/detail/${product._id}`, product)
              }
              }
            >
              详情
            </LinkButton>
            <LinkButton onClick={()=>this.props.history.push("/product/addupdate", product)}>修改</LinkButton>
          </span>
        )
      },
    ]
  }
  // 异步获取指定页码商品列表显示   可能会有搜索
  getProducts = async (pageNum) => {
    // 保存当前页码
    this.pageNum = pageNum
    this.setState({ loading: true })
    const { searchName, searchType } = this.state
    let result
    if (searchName && this.isSearch) {
      result = await reqSearchProducts({ pageNum, pageSize: PAGR_SIZE, searchName, searchType })
    } else {
      //发送请求获取数据 
      result = await reqProducts(pageNum, PAGR_SIZE)
    }
    this.setState({ loading: false })
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
    const { loading, products, total, searchType, searchName } = this.state
    const title = (
      <span>
        <Select
          style={{ width: 200 }}
          value={searchType}
          onChange={(value) => this.setState({ searchType: value })}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          style={{ width: 200, margin: "0 10px" }}
          placeholder="输入关键字" value={searchName}
          onChange={(event) => this.setState({ searchName: event.target.value })}
        />
        <Button type="primary" onClick={() => { 
          this.isSearch = true
          this.getProducts(1)
        }
        }>搜索</Button>
      </span>
    )
    const extra = (
      <Button type="primary" onClick={()=>this.props.history.push("/product/addupdate")}>
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
          pagination={{
            total,
            defaultPageSize: PAGR_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts,
            current: this.pageNum
          }}
        ></Table>
      </Card>
    )
  }
}

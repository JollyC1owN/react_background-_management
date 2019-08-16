/*
商品管理的添加/修改子路由
*/
import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Icon
} from "antd"
import LinkButton from "../../components/link-button"
import { reqCategorys } from "../../api"


const Item = Form.Item
const Option = Select.Option



class ProductAddUpdate extends Component {

  state = {
    categoryName: []  //商品的类名数组  在下面的下拉框中使用
  }

  // 发送请求函数
  getCategory = async () => {
    // 发送获取所有分类的请求，在之前就写过，拿过来直接用
    const result = await reqCategorys()
    if (result.status === 0) {
      this.setState({
        categoryName: result.data
      })
    }
  }
  // Form表单的提交事件
  handleSubmit = (event) => {
    // 阻止默认行为
    event.preventDefault()
  }
  // 发送请求，请求所有分类
  componentDidMount() {
    this.getCategory()
  }

  render() {
    const { categoryName } = this.state
    // 拿到Form表单中属性form中的方法
    const { getFieldDecorator } = this.props.form
    // 定义title头部
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" />
        </LinkButton>
        <span>添加商品</span>
      </span>
    )
    // 设置input框与字体在一行内显示,在antd中一行总共分成24份
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: '',
              rules: [
                { required: true, message: "必须输入商品名称" }
              ]
            })(
              <Input type="text" placeholder="商品名称"></Input>
            )
            }
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: '',
              rules: [
                { required: true, message: "必须输入商品描述" }
              ]
            })(
              <Input type="text" placeholder="商品描述"></Input>
            )
            }
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: '',
              rules: [
                { required: true, message: "必须输入商品价格" }
              ]
            })( //addonAfter：在input框后面加一个小块块，具体看效果就懂了
              <Input type="number" placeholder="商品价格" addonAfter="元"></Input>
            )
            }
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryId", {
              initialValue: '',
              rules: [
                { required: true, message: "必须选择商品分类" }
              ]
            })(
              <Select>
                <Option value="">未选择</Option>
                {/* 通过state中的categoryName数组，进行加工option选项 */
                  categoryName.map(cn => (
                    <Option key={cn._id} value={cn._id}>{cn.name}</Option>
                  ))
                }
              </Select>
            )
            }
          </Item>
          <Item>
            {/* 在antd中：Form中的button不具备点击提交的属性，必须加上 htmlType="submit"这样就有了提交的功能*/}
            <Button type="primary" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)
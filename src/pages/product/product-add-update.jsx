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
  Icon,
  message
} from "antd"
import LinkButton from "../../components/link-button"
import { reqCategorys ,reqAddUpdateProduct} from "../../api"
import PicturesWall from "./prctures-wall"
import RichTextEditor from "./rich-text-editor"

const Item = Form.Item
const Option = Select.Option



class ProductAddUpdate extends Component {
  constructor(props) {
    super(props)
    this.pwRef = React.createRef()
    this.editorRef = React.createRef()
  }
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
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { name, desc, price, categoryId } = values
        //获取图片名称数组
        const imgs = this.pwRef.current.getImgs()
        // 获取detail的标签体内容
        const detail = this.editorRef.current.getDetail()
        console.log(name, desc, price, categoryId, imgs, detail);
        let product = { name, desc, price, categoryId, imgs, detail }
        if (this.isUpdate) { 
          product._id = this.product._id
        }
        //发请求
        const result = await reqAddUpdateProduct(product)
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "修改" : "添加"}商品成功`)
          this.props.history.replace("/product")
        } else { 
          message.error(result.msg)
        }
      }
    })
  }

  // 价格限制
  validatePrice = (rule, value, callback) => {
    if (value < 0) {
      callback('价格不能小于0')
    } else {
      callback()
    }
  }

  // 发送请求，请求所有分类
  componentDidMount() {
    this.getCategory()
  }
  componentWillMount() {
    const product = this.props.location.state
    this.product = product || {}
    this.isUpdate = !!this.product._id
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
        <span>{this.isUpdate ? "修改" : "添加"}商品</span>
      </span>
    )
    // 设置input框与字体在一行内显示,在antd中一行总共分成24份
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
    }

    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Item label="商品名称：">
            {getFieldDecorator("name", {
              initialValue: this.product.name,
              rules: [
                { required: true, message: "必须输入商品名称" }
              ]
            })(
              <Input type="text" placeholder="商品名称"></Input>
            )
            }
          </Item>
          <Item label="商品描述：">
            {getFieldDecorator("desc", {
              initialValue: this.product.desc,
              rules: [
                { required: true, message: "必须输入商品描述" }
              ]
            })(
              <Input type="text" placeholder="商品描述"></Input>
            )
            }
          </Item>
          <Item label="商品价格：">
            {getFieldDecorator("price", {
              initialValue: this.product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                {validator: this.validatePrice}
              ]
            })( //addonAfter：在input框后面加一个小块块，具体看效果就懂了
              <Input type="number" placeholder="商品价格" addonAfter="元"></Input>
            )
            }
          </Item>
          <Item label="商品分类：">
            {getFieldDecorator("categoryId", {
              initialValue: this.product.categoryId || "",
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
          <Item label="商品图片：" wrapperCol={{ span: 10 } }>
            <PicturesWall ref={this.pwRef} imgs={this.product.imgs} />
          </Item>
          <Item label="商品详情："  wrapperCol={{ span: 20 } } >
            <RichTextEditor detail={this.product.detail} ref={this.editorRef} /> 
          </Item>
        <Item>
          {/* 在antd中：Form中的button不具备点击提交的属性，必须加上 htmlType="submit"这样就有了提交的功能*/}
          <Button type="primary" htmlType="submit">提交</Button>
        </Item>
        </Form>
      </Card >
    )
  }
}

export default Form.create()(ProductAddUpdate)
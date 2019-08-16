import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal ,message} from 'antd'
import { reqRemoveImg } from '../../api';
import { IMG_BASE_URL } from '../../utils/constants';



function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {

  // 限制数据类型
  static propTypes = {
    imgs : PropTypes.array,
  }

  state = {
    previewVisible: false,   //是否弹出大图的标识
    previewImage: '',     //大图显示的url地址
    fileList: [],
  };
  //大图上的 X  的点击事件；关闭大图显示
  handleCancel = () => this.setState({ previewVisible: false });


  //点击大图预览的事件 -----打开大图预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    //修改状态，地址      是否显示大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  // 监听当图片文件上传/删除时，触发该事件
  handleChange =async ({ file, fileList }) => { 
    // status: "done"
    // console.log(file) 
    if (file.status === "done") {
      // 让fileList数组中的最后一个，为我们添加图片的那个一个，一一对应
      file = fileList[fileList.length-1]
      const name = file.response.data.name
      const url = file.response.data.url
      file.name = name
      file.url = url
    }else if(file.status === "removed") {
      const result = await reqRemoveImg(file.name)
      if (result.status === 0) { 
        message.success("图片删除成功")
      }
    }
    this.setState({ fileList })
  }
   

  getImgs = () => {
   return  this.state.fileList.map(item =>item.name)
   }
   
   componentWillMount() {
     const imgs = this.props.imgs
     console.log(imgs);
     
     if (imgs && imgs.length > 0) {
       /* 
      {
        uid: '-5',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      */
       const fileList =  imgs.map((img,index) => ({
        uid: -index,
        name: img,
        status: 'done',
        url:IMG_BASE_URL+img ,
       }))
       this.setState({fileList})
      }
   }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          name="image"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}



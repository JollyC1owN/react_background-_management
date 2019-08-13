/* 函数组件创建link-button */
import React from 'react';
import './index.less';
//自定义扥看似链接，实则是button
// 1、三点运算符   将接收的所有属性传给子标签 
/* 2、children标签属性
	字符串：<LinkButton>xxxx</LinkButton>
	标签对象：<LinkButton><span></span></LinkButton>
	标签对象的数组  <LinkButton><span></span><span></span></LinkButton>
*/ 

const LinkButton = (props) => {
	return (
		<button className="link-button" {...props}></button>
	);
}

export default LinkButton;

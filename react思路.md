day01

### login静态页面

### form组件的使用

1. const wrapperForm = Form.create()(login)--> 使login组件具有form属性
2. getFieldDecorator ( 'Name' ,{配置的对象} )-->form下的方法  可以设置初始值和配置对象  将输入框和此方法包裹在一个{}中 经过 getFieldDecorator 包装的控件，表单控件会自动添加 value onChange，数据同步将被 Form 接管,form对象会对所有的输入组件进行实时的监听，保存它们的value值  
3. getFieldValue 获取输入框的值  getFieldsValue 获取所有输入框的值。

# day02

### 前台表单验证

1. 对用户名使用声明式的验证规则
    声明式：应用别人规定好的规则进行编写
   1. 配置对象中的  rules:[] 内写antd的校验规则。---参考文档

2. 对密码使用自定义校验规则 validator ---这个是关键字，他的值是一个自定义方法
 
   1. rules:[] 内写好{validator:this.validatePwd} 告诉人家 我要写自定义校验规则并且是一个函数
   2. validatePwd=(rule, value, callback)=>{判断并且写规则} 并且callback必须被调用 //callback就是提示信息
   3. 点击登录时进行表单统一验证
   4. form下的方法validateFields

```js
  this.props.form.validateFields( async (err, {username,password}) => {}  
  /*
  由于发送请求需要用户名和密码 所以直接将第二个参数解构赋值
  第二个参数values 就是form.getFieldsValue()										
  获取的一个含有用户名和密码以及输入值的一个对象
  */
  initialvalue:'',  //在配置对象中设置初始值	 要不然不输入点击登陆去空格报错 
```





### 登录请求

1. **封装模块**

- 引入axiox 暴露axios
- 使用请求拦截器--> POST请求前统一处理  -->将JSON格式转化为 urlencided格式 a:1&b:1形式，由于后台服务器不支持 JSON格式 而**axios默认发送POST请求的请求体参数就是JSON格式** 而GET没有请求体 直接放到地址栏里了，不存在这个问题

```js
axios.interceptors.request.use(function (config) {
  //得到请求方式和请求体数据
const {method,data}=config
    if (method.toLowerCase()==='post'&& typeof data==='object') {
         //转成urlencided格式 a:1&b:1形式
        config.data =  qs.stringify(data)  
    }
    return config
}	       
```



-  使用响应拦截器 --->想用的数据就是response.data 响应的时候就想直接要data  直接拿到相应数据 result 或者 data

```js
axios.interceptors.response.use(function (response) {// 成功回调
		return response.data;
//此返回结果就会交给我们指定的请求响应的回调 ---->index.js 中的请求回调
}, function (error) {//失败回调统一处理所有请求异常错误，不用再去具体请求中处理

/*如果出现错误   会先执行 拦截器的 回调，然后在执行请求失败的回调，现在想要在拦截器里直接解决错误! 不在去执行请求失败的回调
请求的回调是依据拦截器的Promise回调返回结果判断  是否执行，如果是reject 请求的回调就会执行
如果  返回一个pending状态的promise，就会中断promise链
*/
	alert('请求出错'+error.message)
	return new Promise(()=>{}) // new 之后 初始化就是pending状态。
});	
```

**注：**

```js	
axios.post('/user', {//参数
    firstName: 'Fred',
    lastName: 'Flintstone'
})
    .then(function (response) { 
    console.log(response); 
//此时要想拿到数据 需要resopnse.data  经过响应拦截器处理直接 就data就拿到了。。就是形参直接变成数据了
})
    .catch(function (error) {
    console.log(error);
});			

注： axios({ //作为函数使用
    url:
    method:
    data:{}//参数
         })
```



2. **请求模块**
   1. 返回的是一个promise对象 后面可以使用 async await

```js
 export const reqLogin= (username,password)=>ajax.post(BASE+'/login',{username,password}) 
 //第二个参数是一个对象
```

​	2. 发送请求 注意名字 和参数

  3. 得到user

     	保存user到localstorage中和内存中--> 其他组件想要用user信息或者实现自动登录。看文档 返回的数据类型是json格式 , 保存到localstorage中的实现免登录，保存到内存中的供其他组件使用   

- 封装工具模块storageUtils存储到localstorage中

  ​								 

  ```js
  方法一、 操作LocalStorage											
  const user=result.data 此时user为一个普通对象，后台返回来的是JSON格式，axios自动转化成普通对象了
  												
  存：localStorage.setItem(USER_KEY, JSON.stringify(user))
  //第一个参数随意 第二个为JSON格式，要不然会调用toString方法  josn格式就不会转了				
  读：return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
  方法二、 使用store local数据存储管理工具
  存：store.set(USER_KEY, user) // 第二个参数为一个对象 json也是对象。
  读：return store.get(USER_KEY) || {}
  ```

- 创建存储模块memoryUtils读取local中的user 存储用户登录信息

  ​										

  ```js
  存储为对象格式										
  const user = storageutils.getUser() //用来存储登录用户的信息，初始值为local中读取的值
  export default {
      user
  }	
  ```

- 前台请求成功存储用户信息

  ```js
  const user=result.data
  storageutils.saveUser(user)
  memoryUtils.user=user//存储到内存中，更新storageutils.getUser()
  ```

- Admin页面实现登录判断

  ```js
  const user = memoryUtils.user
  if (!user._id) {
   //如果用户不存在 自动跳转到login界面     
  //  this.props.history.replace('/login') --->一般在事件回调函数中执行
   return <Redirect to='/login'/> //自动跳转到指定的路由路径--->在render中
  // return <Route path='/login' component={Login}/>  Route是根据请求地址才会跳转的，不是自动跳转
  }
  ```

  -  Login页面实现登录判断

    **代码同上 如果内存中有，访问login页面直接跳转到Admin页面**

4. 跳转到admin页面

   ```js
   this.props.history.replace('/')
   ```

5. 解决跨域

   ```js
   在package.json中配置"proxy": "http://localhost:5000"
   ```

# dayo3

### Admin组件布局

1. 拆分组件 left-nav  header
2. Admin使用Layout组件，left-nav 使用Menu组件 写出子路由，并注册路由，默认显示home页面

### left-nav组件

1. 点击 left-nav -header跳转到home页面(Link)

2. left-nav  的item项单独提取出menuConfig，实现数据结构分离动态显示

3. 根据菜单数据数组返回标签数组 

   

   ```js
   //根据只等的mennu数组生成标签数组，依据 map方法+函数递归
   getMenuNodes=(menuList)=>{
       return menuList.map(item=>{
           if (!item.children) {
               return (
                <Menu.Item key={item.key}>  {/* key是唯一的 所以用路径就可以 */}
                   <Link to={item.key}>
                   <Icon type={item.icon}/>
                   <span>{item.title}</span>
                   </Link>
                 </Menu.Item>
               )}
        return (
          <SubMenu
               key={item.key}
               title={
               <span>
               <Icon type={item.icon} />
               <span>{item.title}</span>
               </span> }
            > {
   this.getMenuNodes(item.children)  
   //!!!此处是重点，  调用此方法生成children下的<Item></Item>
   }
             </SubMenu>
    )})
   }
   ```

   - 注：方法二

   ```js
   getMenuNodes2=(menuList)=>{
       // 请求的路径
       const path = this.props.location.pathname
       return menuList.reduce((pre,item)=>{
           // 可能向 pre 中添加 <Menu.Item>
           if (!item.children) {
               pre.push(
                   <Menu.Item key={item.key}>  {/* key是唯一的 所以用路径就可以 */}
                   <Link to={item.key}>
                   <Icon type={item.icon}/>
                   <span>{item.title}</span>
                   </Link>
                   </Menu.Item>
               )}
           else{
               const cItem =  item.children.find(cItem=>cItem.key===path)
               if (cItem) {
                   this.openKey =item.key
               }        
               pre.push(
                   <SubMenu
                   key={item.key}
                   title={
                   <span>
                   <Icon type={item.icon} />
                   <span>{item.title}</span>
                   </span>
                   } >
    {
        this.getMenuNodes2(item.children)  //!!!此处是重点，  调用此方法生成children下的<Item></Item>
        }
           </SubMenu>
          )
       }
       return pre
      } ,[])
   }
   ```

   

4. 指定默认选中的menuItem 。this.props.location.pathname 获取路径，必须是路由组件！！（withRouter ）

   ```js
   <Menu
   // defaultSelectedKeys={['/home']}  不能写死 要不然输入地址 不会被选中
   // const selectKey = this.props.location.pathname 获取路径，必须是路由组件！！
   selectedKeys={[selectKey]}//selectedKey会解决退出在登录不被选中问题。defaut只会选一次所以不行。
   //默认打开的menu   也不能写死 和上面的selectKey不同，
   defaultOpenKeys={[this.openKey]} 
   mode="inline"
   theme="dark"
   >
   {
   this.menuNodes
    }
    </Menu>
   ```

   

5. defaultOpenKeys={[this.openKey]}   **this.openKey** 是重点

   ```js
   //defaultOpenKeys={[this.openKey]} 
   /* 
    判断当前的Item的key 是否是我需要的openKey
    查找item所欲的children中的childrenItem的key，看是否有一个请求的path匹配  
    */
   const cItem =  item.children.find(cItem=>cItem.key===path)
   if (cItem) {
       this.openKey =item.key
   }   
   ```

6. 注意this.openKey一定要在getMenuNodes2 之后，要不然拿不到值 所以将此方法放在willMount里 顺便性能优化为了使 left-nav只渲染一次，

   ```js
   this.menuNodes= this.getMenuNodes2(menuList)  //同步创建
   ```

   

### header组件

   **静态布局**

   **动态获取数据显示**

1. 去memoryUtils中获取数据

   ```js
   const user = memoryUtils.user
   //得到当前显示IDEtitle
   const title = this.getTitle()
   ```

2. 取出相应title 如果.pathname 与title相同则显示

   ```js
   getTitle=()=>{
       let title = ''
       const path = this.props.location.pathname  //需要时路由组价
       menuList.forEach((item)=>{
           if (item.key===path) {
               title=item.title
           }else if (item.children){
               const cItem =  item.children.find(cItem=>cItem.key===path)  //自动返回
               if (cItem) {
                   title=cItem.title
               }
           }
       })
       return title
   }
   ```

   

3. 动态获取时间 格式工具函数dateUtils  

   ```js
   /* 动态显示时间 */
   componentDidMount(){
       this.timeID=setInterval(() => {
           this.setState({
               currentTime:formateDate(Date.now())
           })
       },1000);
       //发送异步jsonp请求 获取天气信息
       this.getWeather()
   }
   
   componentWillUnmount(){
       clearInterval(this.timeID)
   }
   ```

4. 声明状态

   ```js
   state={
           currentTime:formateDate(Date.now()),
           dayPictureUrl:'',//图片地址
           weather:''//天气文本
       }
   ```

5. 动态获取天气和图片

   - 封装请求函数 通过**jsonp请求**

   ```js
   /*
   通过jsonp请求获取天气信息
    */
   export function reqWeather(city) {
   const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
       // 不像axios 自动返回promise对象  这个需要自己返回，因为所有接口请求函数都应该返回接口请求函数。                   
       return new Promise((resolve, reject) => {//执行器函数：内部执行异步任务的函数 ，成功了调用resolve()，失败调用reject()
           jsonp(url, {//配置对象
               param: 'callback'
           }, (error, response) => {//网上第二个参数写的data 名字不同而已
               if (!error && response.status === 'success') {
                   const {dayPictureUrl, weather} = response.results[0].weather_data[0]
                   resolve({dayPictureUrl, weather})
               } else { //失败的 
                   alert('获取天气信息失败')
               }
           })
       })
   }
   ```

6. 请求天气和图片更新状态  （此请求在DidMount 里执行）

   ```js
   /* 获取天气信息请求函数 */
   getWeather= async ()=>{
       //发请求
       const {dayPictureUrl, weather}= await  reqWeather('北京')
       //更新状态
       this.setState({
           dayPictureUrl, 
           weather
       })
   }
   ```

7. 封装button-link组件 并且给上样式，解决a标签问题

   ```js
      export default function LinkButton(props) {
          return <button className='link-button' {...props}/>
      }
   ```

   

8. 实现退出登录功能

   ```js
     logout=()=>{
          //确认提示
          Modal.confirm({
              title: '确定要退出么?',
              onOk:()=> {//自己改成箭头函数
                  console.log('OK')
                  //确认后删除存储的用户信息 local中的和内存中的
                  storageutils.removeUser()
                  memoryUtils.user={}
                  //跳转到登录界面
                  /* 此方法常用在回调函数中，而return Redict 常用在render中 */
                 this.props.history.replace('/login')  //此方法必须使用在路由组件中 
                  // console.log(this)  此时this为undefined 所以读取不到props
              },
              onCancel() {
                  console.log('Cancel');
              },
          })  
      }
   ```

# day04

### 分类管理静态布局

1. 应用组件 Card Table Icon Button

2. dataIndex  对应数据的名称，

3. 操作下面的 修改分类

   ```js
   render:()=> <LinkButton>修改分类</LinkButton>
   ```

### 动态获取数据

1. 封装请求函数

2. 初始化状态显示

3. 生命周期发送异步获取分类显示数据

4. 判断status，拿到data 更新状态

5. 取出状态数据 代替datasource

6. 定义initColumns  

   ```js
   initColums=()=>{
       this. columns = [
           {
               title: '分类的名称',
               dataIndex: 'name', 
           },
           {
               title: '操作', 
               width:300,
               render:(category)=><LinkButton>修改分类</LinkButton>
           },
       ]
   }
   ```

7.  willMount 中调用  传送到标签colums

8. ​设置状态 loading 图  布尔值。 请求前显示，请求后消失

9. 设置分页和跳转以及默认显示条数

   ```js
   pagination={{defaultPageSize: 5, showQuickJumper: true}}  //默认页数  和是否显示跳转
   ```

### 添加修改分类

1. Modal组件

2. 设置状态showStatus 0 1 2  都隐藏 ， 显示添加 显示修改

3. 在visible 中

   ```js
   <Modal
   title={showStates===1? '添加分类':'修改分类'}
   //显示隐藏
   visible={showStates!==0}
   onOk={this.handleOk}
   onCancel={this.handleCancel}
   >
   ```

4. 添加分类 修改分类  隐藏对话框

   - 包装生成form属性 进而调用getFieldDecorator ()() 包装Input进行表单验证

   - 设置类对象属性

     ```js
     static propTypes = {
         setForm:PropTypes.func.isRequired,
         categoryName: PropTypes.string,
     }
     
     ```

      

   - 设置初始值

     ```js
     const {categoryName} = this.props // category组件传入进来的属性
     ```

   - category组件异步获取分类列表数据

     ```js
     getCategorys= async ()=>{
         //显示iloading
         this.setState({loading:true})
         const result = await reqCategorys()
         console.log(result);
         //隐藏loading
         this.setState({loading:false})
         if (result.status===0) {//成功
             //取出分类数据
             const categorys=result.data
             //更新数据状态
             this.setState({
                 categorys
             })
         } else {
             message.error('获取分类列表失败')
         }
     }
     ```

   - 添加与修改分类公用Modal 根据状态 1 添加 2 修改

   - 点击OK发送添加或者修改请求

     ```js
     handleOk= ()=>{
         //进行表单验证  (antd form 组件   与登录差不多)
         this.form.validateFields(async (err,value)=>{  //此处的value 就是子组件输入框的值    属性名为 getFieldDecorator()的第一个参数categoryName  值为value
             if (!err) {
                 this.form.resetFields()//重置输入的数据
                 console.log(value);
                 //验证通过后，得到输入数据
                 //   console.log(this.form.getFieldsValue()); 这样也能获取到数据
                 const {categoryName} =value
                 const {showStates}=this.state
                 let result    //  在外面声明   外面才能看到
                 if (showStates===1) {//添加
                     //发送添加分类的请求
                     result = await  reqAddCategory(categoryName) ///  ????这个请求有用？？？？是像服务器添加分类么？？？？
                     console.log(result);       
                 }else{//修改
                     const categoryId = this.category._id
                     console.log(categoryId);
                     result = await  reqUpdataCategory({categoryId,categoryName}) 
                     console.log(result);
                 }
                 this.form.resetFields() // 重置输入数据(变成了初始值)
                 //隐藏添加对话框
                 this.setState({showStates:0}) 
                 const action = showStates===1?  '添加':'修改'
                 // 根据响应结果不同分别处理数据
                 if (result.status===0) {
                     //如果添加数据成功  则调用getCategorys 获取分类的函数 更新状态，重新获取分类列表。显示分类到下面列表
                     this.getCategorys()
                     //提示
                     message.success(action+"分类成功")
                 } else {
                     message.error(action+'分类失败')
                 }
             }
         })
     }
     ```

     注：此处的categoryName 是由 render注入的

     ```js
     initColums=()=>{
         this. columns = [
             {
                 title: '分类的名称',
                 dataIndex: 'name',  // 去下面数据找name},
                 {
                 title: '操作', 
                 width:300,										
                 /* 形参名字随便起  回调的形参赋值  不是你控制的 */
                 render:(category)=><LinkButton onClick={()=>{ //声明形参  方便点击的时候知道点击的是谁
                 this.category=category// 保存分类名称 使之随处可见
                 this.setState({showStates:2}) //点击显示  category： 就是渲染时候没有指定 dataIndex， 那么直接把数据对象给你
             }}>修改分类</LinkButton>
             },
         ]
     }
     ```

   - 点击取消是的回调

     ```js
     handleCancel=()=>{//重置是指变成初始值
         this.form.resetFields()//重置输入的数据！！！！取消修改  就不需要输入框的值了
         this.setState({
           showStates:0
         })
       }
     ```

     注：    this.form.resetFields() 解决输入框值得异常   willMount 初始化显示列表 只渲染一次

     DidMount 发请求获取分类列表数据

     

     

     ```js
      {/* 将子组件传递过来的form对象保存到当前组件上 */}
     <AddUpdataForm
         setForm={form=>this.form=form} 
         categoryName={category.name}
     />{/* 此组件即可做添加，也可以做修改 */}
     ```

     注：子传父，传递一个函数，子组件调用函数，函数在父组件执行。进而将form属性绑定到 父组件的this身上。

     ```js
     setForm={form=>this.form=form}
     this.props.setForm(this.props.form)
     ```

### 商品管理界面

1. 设置路由 注册路由 
2. ProductHome页面静态布局 头部select  下面 Table
3. datesourcr  products 并设置为状态
4. render时候读取数据动态显示
5. 设置初始化 initColums函数显示标题  状态 并且初始化获取数据显示  
6. 价格使用render 拼接 $$

### 定义接口请求函数(获取商品分页列表)

1. get请求需要携带参数 在配置对象中写 params 对象 （虽然叫params 但其实是query参数，只是名字不一样）

2. data 是 post 请求的

   ```js
   export const reqProducts =(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{
       params:{//看接口文档 包含所有 quqery参数的对象
           pageNum,
           pageSize
       }
   })
   ```

   

3. DidMount中发送请求 

   ```js
   componentDidMount(){
       //获取第一页显示，请求函数中需要两个参数。
       this.getProducts(1)  //上来先显示第一页
   }
   ```

   

4. 定义请求

   ```js
   getProducts = async (pageNum) => {
       //保存当前页码(为了更新状态时能够看见)
       this.pageNum=pageNum
       let result 
       const {searchName,searchType}=this.state
       /* 点击搜索按钮的时候，显示当前名称的页面 */
       if (!searchName) {
           //发请求获取数据  两种请求的返回结果是一样的  所以写在一起
           result = await reqProducts(pageNum,PAGE_SIZE)
           console.log(result.data.list);
       }else{
           result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
       }
       //判断数据的准确性
       if (result.status===0) {
           const {total,list} = result.data //取出我们需要的数据
           console.log(list);
           this.setState({
               products:list,
               total:total
           })
       }
   }
   ```

5. 定义状态

   ```js
   state={
           loading:false,
           //数据
           products:[], 
           total: 0 ,    //商品的总数量
           searchType:'productName',  //默认是按商品名称搜索 option 的value 为这个
           searchName:'' //搜索关键字  默认为空  动态获取输入框的值  作为发请求的参数。
       }
   ```




# day05

### 商品搜索

1. 接口请求函数 gei用 params配置参数  post用 data  传递一个对象

   ```js
   export const reqSearchProducts=({
       pageNum,
       pageSize,
       searchName, // 搜索的值
       searchType   // 搜索的类型  他只能是 productName 或者 productDesc
   })=>ajax(BASE+'/manage/product/search',{
       //默认get请求
       params:{
           pageNum,
           pageSize,
           [searchType]:searchName,  // 无法判断根据名字搜索还是描述搜索，所以用数组接住。
           //属性名 有多种情况。
       }
   })
   ```

2. 实现下拉框动态显示

   ```js
   onChange={(value)=>this.setState({searchType:value})} /* 看文档 Select value: option 对应的value */ 
   <Option value= 'productName' >按名称搜索</Option>
   <Option value= 'productDesc' >按描述搜索</Option>
   ```

3. 实现输入框受控组件效果

   ```js
   <Input
   style={{ width: 200,margin: '0,10px'}} 
   placeholder='关键字' 
   value={searchName}
   onChange={event=>this.setState({searchName:event.target.value})}  // 看input组件文档
   />
   ```

4. 添加点击事件进行搜索 (第一页显示)

   ```js
   getProducts = async (pageNum) => {
       //保存当前页码(为了更新状态时能够看见)
       this.pageNum=pageNum
       let result 
       const {searchName,searchType}=this.state
       /* 点击搜索按钮的时候，显示当前名称的页面 */
       if (!searchName) {
           //发请求获取数据  两种请求的返回结果是一样的  所以写在一起
           result = await reqProducts(pageNum,PAGE_SIZE)
           console.log(result.data.list);
       }else{
   result=awaitreqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
   ```

   

### 更新商品状态

```js
render:({_id,status})=>{
    let btnText='下架'
    let text = '在售'
    if(status===2){
        btnText='上架'
        text='已下架'
    }
    return (
        <span>
        <button onClick={()=>{this.updateStatus(_id,status)}}>{btnText}</button><br/>
        <span>{text}</span>
</span>  
)
}
```

### 商品详情页

1. 图片部分

   ```js
    {
    product.imgs && product.imgs.map(img => <img className="detail-img" key={img} src={BASE_IMG + img} alt="img" />)
                 }
   ```

   

2. 详情部分

   ```js
    {/* 返回的数据是标签，react提供的方法 */}
   <div dangerouslySetInnerHTML={{ __html: product.detail}}></div>
   ```

3. 回退按钮

4. 定义商品状态

   ```js
     state = {
       categoryName: '',
       product: memoryUtils.product
     }
   ```

   **先从内存中读取商品数据，第一次没有则从服务器读取**

   ```js
   async componentDidMount () {
   let product = this.state.product
   if (product._id) { // 如果商品有数据, 获取对应的分类
   this.getCategory(product.categoryId)
   } else { // 如果当前product状态没有数据, 根据id参数中请求获取商品并更新
   const id = this.props.match.params.id
   const result = await reqProduct(id)
   if (result.status === 0) {
   product = result.data
   this.setState({
   product
   })
   this.getCategory(product.categoryId) // 获取对应的分类
   }}
   }
   ```

5. 所处分类

   ```js
   getCategory = async (categoryId) => {
       const result = await reqCategory(categoryId)
       if (result.status===0) {
           const categoryName = result.data.name
           this.setState({ categoryName })
       }
   }
   ```

   
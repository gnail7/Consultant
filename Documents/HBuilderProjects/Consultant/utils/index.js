import request from './request.js'

//#region emoji 转换
   
//把utf16的emoji表情字符进行转码成八进制的字符
export function utf16toEntities(str) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    return str.replace(patt, function (char) {
        var H, L, code;
        if (char.length === 2) {
            H = char.charCodeAt(0); // 取出高位  
            L = char.charCodeAt(1); // 取出低位  
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
            return ("&#" + code + ";");
        } else {
            return (char);
        }
    });
}
 
//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
export function entitiesToUtf16(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
        let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
        let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
        return (String.fromCharCode(H, L));
    });
}
//#endregion emoji 转换
export const validator = (str,pattern)=>{
	return new Promise((resolve,reject)=>{
		const flag = pattern.test(str)
		flag && resolve(true)
		!flag && resolve(false)
	})
}

export const pattern = {
	phonePattern:/^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
	emailPattern:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
	namePattern:/\S/
}
export function showModal(content){
		return new Promise((resolve,reject)=>{
			uni.showModal({
				content,
				success: (res) => {
					if(res.confirm){
						resolve(true)
					}
					resolve(false)
				}
			})
		})
	}

function compare(property) {
	  return function (a, b) {
	    var value1 = a[property];
	    var value2 = b[property];
	    return   value2-value1;
	  }
}
export const showInfo = (title="标题",icon = 'none')=>{
	return new Promise((resolve,reject)=>{
		uni.showToast({
			title,
			icon
		})
	})
}

// #region 获取时间
export const timestampToTime = (times)=>{
	let time = times[1]
	let mdy = times[0]
	mdy = mdy.split('/')
	let month = parseInt(mdy[0])
	let day = parseInt(mdy[1])
	let year = parseInt(mdy[2])
	return year+'-'+month+'-'+day+' '+time
}
export const autoEndConsult = (times)=>{
	
	const t = times.slice(0,10)
	let currentDate = new Date().getTime();
	const time = formatDate(currentDate); //"2020-05-22 23:58:32" 获取到当前时间的时间戳并按自定义格式显示
	const t2 = time.slice(0,10)
	if(t2!==t){
		console.log('unequal')
		return true
	}else{
		const consultHour = times.slice(11,13)
		const consultMin = times.slice(14,16)
		const nowHour = time.slice(11,13)
		const nowMin = time.slice(14,16)
		const hGap = nowHour - consultHour
		switch(hGap){
			case 0:
			const mGap1 = nowMin - consultMin
			if(mGap1 >= 9){
				return true
			}
			return false
			case 1:
			const mGap = nowMin + 60-consultMin
			if(mGap >= 9){
				return true
			}
			return false
			break;
			default:
			return true
		}
	}
}
export function formatDate(timestamp){
	// let currentDate = new Date().getTime();
	// formatDate(currentDate); //"2020-05-22 23:58:32" 获取到当前时间的时间戳并按自定义格式显示
  let time = new Date( Number(timestamp))
  let year = time.getFullYear()
  let month = Number(time.getMonth()) + 1
  let date = time.getDate()
  let hours = time.getHours()
  let minute = Number(time.getMinutes())
  let second = time.getSeconds()

  if (month < 10) { month = '0' + month }
  if (date < 10) { date = '0' + date }
  if (hours < 10) { hours = '0' + hours }
  if (minute < 10) { minute = '0' + minute }
  if (second < 10) { second = '0' + second }

  return `${year}-${month}-${date} ${hours}:${minute}:${second}`
}
export function dateToNumber(date){
	//2022-12-12 12:12:12
	date.replace('-','')
	date.replace(':','')
	// console.log('date',date)
}
// #endregion 获取时间

// #regin map
export const map = new Map()
map.set(0,'男')
map.set(1,'女')

export const userInfoMap = new Map([
	
	['consultantName',"咨询用名"],
	['consultantPhone',"手机号码"],
	['gender',"性别"],
	['createTime',"创建日期"],
	['followedNum','粉丝数量'],
	['hasManager','身份'],
	
])

// #endregin map

// #region 获取高度
export function getTopBarHeight(){
	let menuButtonObject = uni.getMenuButtonBoundingClientRect(); //获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
	return new Promise((resolve,reject)=>{
		uni.getSystemInfo({//获取系统信息
			success: res => {
				let navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2;//导航栏高度=菜单按钮高度+（菜单按钮与顶部距离-状态栏高度）*2
				const titleBarHeight = navHeight;
				const statusBarHeight = res.statusBarHeight
				const topBarHeight = titleBarHeight + statusBarHeight
				resolve(topBarHeight) 
			},
			fail(err) {
				console.log(err);
			}
		})
	})
}
export function getTopBarHeightSync(){
	let menuButtonObject = uni.getMenuButtonBoundingClientRect(); 
	const res = uni.getSystemInfoSync()
	let navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2;
	const titleBarHeight = navHeight;
	const statusBarHeight = res.statusBarHeight
	const topBarHeight = titleBarHeight + statusBarHeight
	return topBarHeight
}
export function getNavigationBarSync(){
	let menuButtonObject = uni.getMenuButtonBoundingClientRect(); 
	const res = uni.getSystemInfoSync()
	const navHeight = menuButtonObject.height + (menuButtonObject.top - res.statusBarHeight)*2;
	return navHeight
}
// #endregion 获取高度


// #region 权限
//通过hasManager
export function getPermission(){
	const roles = ['ADMIN','CONSULTANT']
	
}
function hasPerssion(role,userRole){
  return new Promise((resolve,reject)=>{
      const judge = role.includes(userRole)
      if(judge){
        resolve(true)
        return
      }
      resolve(false)
  })
}

export  function loginInterceptor(userInfo){
	//先检查userInfo.value有没有东西
	return new Promise((resolve,reject)=>{
		if(userInfo.value.consultantPhone){
			const {consultantPhone} = userInfo.value
			request({
				url:'/login/consultant',
				method:'POST',
				data:{consultantPhone}
			}).then(r=>{
				if(r.id){
					userInfo.value = r
					uni.removeStorageSync('userInfo')
					uni.setStorageSync('userInfo',r)		
					resolve(true)
				}else{
					uni.removeStorageSync('userInfo')
					uni.showToast({
						title:'请先登录'
					})
					uni.reLaunch({
						url:'/pages/login/login'
					})
					resolve(false)
				}
			})
			}else{
				uni.removeStorageSync('userInfo')
				uni.reLaunch({
					url:'/pages/login/login'
				})
		}
		
	})
	
		
}
// #endregion 权限


import request from './request.js'

export const addChatInfo = (obj)=>{
	return request({
		url:'/user/addChatInfo',
		method:'POST',
		data:obj
	})
}

export const updateConsultant = (obj)=>{
	return request({
		url:'/consultant/updateConsultant',
		data:obj
	})
}



//获取粉丝列表consultantId
export const getFansUser = (obj)=>{
	return request({
		url:'/consultant/getFansUser',
		method:'POST',
		data:obj
	})
}


export const getAllConsultants = ()=>{
	return request({
		url:'/consultant/getAllConsultants',
	})
}

export const addSucideHotline = (obj)=>{
	return request({
		url:'/consultant/addSuicideHotline',
		data:obj
	})
}

// #region 信箱管理
/**
 * @description 回复
 * @param {obj}  = {postUser,replyInfo,createTime,letterId}  
 */
export const replayLetter = (obj)=>{
	return request({
		url:'/user/replyLetter',
		data:obj
	})
}
/**
 * @description 获取全部信件
 * @param {String}  userId
 */
export const getUserLetterList = (obj)=>{
	return request({
		url:'/consultant/getAllLetters',
		data:obj
	})
}

/**
 * @description 获取公开的信件
 * @param none
 */
export const getOpenLetterList = ()=>{
	return request({
		url:'/user/getOpenLetterList',
	})
}

export const getGoodLetters = ()=>{
	return request({
		url:'/consultant/getGoodLetters'
	})
}

/**
 * @description 更新信件信息
 * @param 很多
 */
export const updateLetter = (obj)=>{
	return request({
		url:'/consultant/updateLetter',
		data:obj
	})
}

// #endregion 信箱管理

//#region用户管理
export const getUserList = (obj)=>{
	return request({
		url:'/consultant/getUserList',
		data:obj
	})
}

//#endregion用户管理
export const getSucideHotlines = ()=>{
	return request({
		url:'/consultant/getSuicideHotlines'
	})
}

export const getReplyListApi = (params)=>{
	return request({
		url:'/consultant/getRelyLetterList',
		data:params
	})
}

export const suscribeApi = (params)=>{
	return request({
		url:'/consultant/subscribe',
		data:params
	})
}
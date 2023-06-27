// export let BASEURL = 'http://175.178.254.37:8854'
export let BASEURL = 'https://zzpbzx.com:8854'

const request = (option)=>{
	const {url,data,method} = option
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASEURL+url,
			data,
			method:method || 'POST',
			success: (res) => {
				resolve(res.data)
			},
			fail: (e) => {
				resolve(e)
			}
		})
	})
}

export default request
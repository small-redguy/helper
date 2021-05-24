var rootUrl = "https://api.m.jd.com/client.action";
var mainInfos = [];
var lotteryNum = 0;
let cookiesArr = [],
	cookie = '',
	message = '';

if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item])
	})
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
	let cookiesData = $.getdata('CookiesJD') || "[]";
	cookiesData = JSON.parse(cookiesData);
	cookiesArr = cookiesData.map(item => item.cookie);
	cookiesArr.reverse();
	cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
	cookiesArr.reverse();
	cookiesArr = cookiesArr.filter(item => !!item);
}
main();

async function main() {
	!(async () => {
			that.log('%c本插件仅供学习交流使用\n作者:小赤佬ByQQ83802712 \n联系作者 tencent://message/?uin=83802712&Menu=yes', 'color:#009a61');
		for (var i = 0; i < cookiesArr.length; i++) {
			cookie=cookiesArr[i]
			that.log(`\n开始\n`);
			await city_getHomeData();
			that.log("开始抽现金");
			for (let index = 0; index < mainInfos.length; index++) {
				 let item=mainInfos[index];
				await city_receiveCash(item.city,item.roundNum);
			}
			that.log("结束抽现金");
			that.log("开始抽奖");
			for (let index = 0; index < lotteryNum; index++) {
				that.log("第"+(index+1)+"次抽奖");
				await city_lotteryAward();
			}
			$.isdui=true;
// 			var count=0;
// 			while($.isdui==true&&count<30){
// 			    count ++ ;
// 			    await city_withdraw();
// 			}
			
		}
	})()
	.catch((e) => {
			that.log('发生异常', e)
		})
		.finally(() => {
			that.log("结束");
		})
}

function city_getHomeData() {
	return new Promise(resolve => {
		let function_id = "city_getHomeData";
		let option={
			url:rootUrl,
			headers: {
					"cookie": cookie,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: 'functionId=' + function_id + '&body=&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
		}
		$.post(option,(err,resp,data)=>{
			try {
				data=JSON.parse(data);
				if (data.data.success) {
					let res = data.data.result;
					that.log("邀请码：" + res.userActBaseInfo.inviteId);
						that.log("邀请链接：	https://bunearth.m.jd.com/babelDiy/Zeus/x4pWW6pvDwW7DjxMmBbnzoub8J/index.html?inviteId=" + res.userActBaseInfo.inviteId);
				
					that.log("当前金额：" + res.userActBaseInfo.poolMoney);
					mainInfos = res.mainInfos;
					lotteryNum = res.lotteryNum;
					that.log("可以拆现金次数：" + mainInfos.length);
					that.log("可以抽奖次数：" + lotteryNum);
				} else {
					that.log("初始化失败");
				}
			} catch (e) {
				that.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function city_receiveCash(city, roundNum) {
	return new Promise(resolve => {
		let function_id = "city_receiveCash";
		let body = {
			cashType: 1,
			roundNum: roundNum
		}
		let option={
			url:rootUrl,
			headers: {
				"cookie": cookie,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
				'&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
		}
		$.post(option,(err,resp,data)=>{
			try {
				data=JSON.parse(data);
				if (data.data.success) {
					let res = data.data.result;
					that.log(city + "拆到现金:" + res.currentTimeCash + "元，当前余额:" + res.totalCash);
				} else {
					that.log("拆现金失败");
				}
			} catch (e) {
				that.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function city_lotteryAward() {
	return new Promise(resolve => {
		let function_id = "city_lotteryAward";
		let body = {}
		let option={
			url:rootUrl,
			headers: {
				"cookie": cookie,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
				'&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
		}
		$.post(option,(err,resp,data)=>{
			try {
				data=JSON.parse(data);
				if (data.data.success) {
					let res = data.data.result;
					if (res.assistList.length > 0) {
						that.log("抽奖结果:" + JSON.stringify(res.assistList));
					} else {
						that.log("抽奖结果: 谢谢参与");
					}
				} else {
					that.log("抽奖结果:" + data.data.bizMsg);
				}
			} catch (e) {
				that.error(e);
			} finally {
				resolve();
			}
		});
	})
}

function city_withdraw() {
	return new Promise(resolve => {
		let function_id = "city_withdraw";
		let body = {"channel":2,"code":""}
		let option={
			url:rootUrl,
			headers: {
				"cookie": cookie,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: 'functionId=' + function_id + '&body=' + JSON.stringify(body) +
				'&client=wh5&clientVersion=1.0.0&uuid=network/wifi'
		}
		$.post(option,(err,resp,data)=>{
			try {
				data=JSON.parse(data);
				if (data.data.success) {
					let res = data.data.result;
					if(res){
					    that.log("余额"+res.poolMoney);
					}else{
					    $.isdui=false;
					}
				} else {
					that.log("兑换结果:" + data.data.bizMsg);
					$.isdui=false;
				}
			} catch (e) {
				that.error(e);
			} finally {
				resolve();
			}
		});
	})
}

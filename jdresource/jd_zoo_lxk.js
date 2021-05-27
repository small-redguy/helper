$.toObj = (t, e = null) => {
	try {
		return JSON.parse(t)
	} catch {
		return e
	}
}
$.toStr = (t, e = null) => {
	try {
		return JSON.stringify(t)
	} catch {
		return e
	}
}
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.pkInviteList = [];
$.secretpInfo = {};
if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item])
	})
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
	cookiesArr = [
		$.getdata("CookieJD"),
		$.getdata("CookieJD2"),
		...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)
	].filter((item) => !!item);
}!(async () => {
	if (!cookiesArr[0]) {
		$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
			"open-url": "https://bean.m.jd.com/bean/signIndex.action"
		});
		return;
	}
	that.log('活动入口：京东APP-》搜索 玩一玩-》瓜分20亿\n' +
		'邀请好友助力：内部账号自行互助(排名靠前账号得到的机会多)\n' +
		'PK互助：内部账号自行互助(排名靠前账号得到的机会多)\n' +
		'地图任务：已添加，抽奖暂未添加\n' +
		'金融APP任务：已完成\n' +
		'活动时间：2021-05-24至2021-06-20\n' +
		'脚本更新时间：2021-05-26');
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			$.cookie = cookiesArr[i];
			$.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(
				/pt_pin=([^; ]+)(?=;?)/)[1]);
			$.index = i + 1;
			that.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
			that.log(`\n如有未完成的任务，请多执行几次\n`);
			await zoo()
		}
	}

	if ($.inviteList.length === 0 || cookiesArr.length < 2) {
		return;
	}
	for (let i = 0; i < cookiesArr.length; i++) {
		$.cookie = cookiesArr[i];
		$.canHelp = true;
		$.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(
			/pt_pin=([^; ]+)(?=;?)/)[1]);
		if (!$.secretpInfo[$.UserName]) {
			continue;
		}
		$.secretp = $.secretpInfo[$.UserName];
		$.index = i + 1;
		//that.log($.inviteList);
		//pk助力
		that.log(`\n******开始pk助力*********\n`);
		for (let i = 0; i < $.pkInviteList.length; i++) {
			that.log(`${$.UserName} 去助力PK码 ${$.pkInviteList[i]}`);
			$.pkInviteId = $.pkInviteList[i];
			await takePostRequest('pkHelp');
		}
		that.log(`\n******开始邀请好友助力*********\n`);
		for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
			$.oneInviteInfo = $.inviteList[j];
			if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max) {
				continue;
			}
			//that.log($.oneInviteInfo);
			$.inviteId = $.oneInviteInfo.inviteId;
			that.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
			//await takePostRequest('helpHomeData');
			await takePostRequest('help');
			await $.wait(2000);
		}
	}
})()
.catch((e) => {
		$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
	})
	.finally(() => {
		$.done();
	})

async function zoo() {
	try {
		$.signSingle = {};
		$.homeData = {};
		$.secretp = ``;
		$.taskList = [];
		$.shopSign = ``;
		await takePostRequest('zoo_signSingle');
		if (JSON.stringify($.signSingle) === `{}` || $.signSingle.bizCode !== 0) {
			that.log($.signSingle.bizMsg);
			return;
		} else {
			that.log(`\n获取活动信息`);
		}
		await $.wait(1000);
		await takePostRequest('zoo_getHomeData');
		await $.wait(1000);
		await takePostRequest('zoo_getSignHomeData');
		await $.wait(1000);
		if ($.signHomeData.todayStatus === 0) {
			that.log(`去签到`);
			await takePostRequest('zoo_sign');
			await $.wait(1000);
		} else {
			that.log(`已签到`);
		}
		await takePostRequest('zoo_getFeedDetail');
		await $.wait(1000);
		let raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
		if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
			that.log(`满足升级条件，去升级`);
			await $.wait(3000);
			await takePostRequest('zoo_raise');
		}
		//收金币
		await $.wait(1000);
		await takePostRequest('zoo_collectProduceScore');
		await $.wait(1000);
		await takePostRequest('zoo_getTaskDetail');
		await $.wait(1000);
		//做任务
		for (let i = 0; i < $.taskList.length && $.secretp; i++) {
			$.oneTask = $.taskList[i];
			if ([1, 3, 5, 7, 9, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
				$.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask
					.followShopVo || $.oneTask.browseShopVo
				for (let j = 0; j < $.activityInfoList.length; j++) {
					$.oneActivityInfo = $.activityInfoList[j];
					if ($.oneActivityInfo.status !== 1) {
						continue;
					}
					$.callbackInfo = {};
					that.log(
						`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`
					);
					await takePostRequest('zoo_collectScore');
					if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $
						.callbackInfo.data.result.taskToken) {
						await $.wait(8000);
						let sendInfo = encodeURIComponent(
							`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`
						)
						await callbackResult(sendInfo)
					} else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
						await $.wait(2000);
						that.log(`任务完成`);
					} else {
						that.log($.callbackInfo);
						that.log(`任务失败`);
						await $.wait(3000);
					}
				}
			}
			await takePostRequest('zoo_getHomeData');
			let raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
			if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
				that.log(`满足升级条件，去升级`);
				await $.wait(1000);
				await takePostRequest('zoo_raise');
			}
		}
		//===================================图鉴里的店铺====================================================================
		if (new Date().getUTCHours() + 8 >= 17 && new Date().getUTCHours() + 8 <= 18) { //分享
			$.myMapList = [];
			await takePostRequest('zoo_myMap');
			for (let i = 0; i < $.myMapList.length; i++) {
				await $.wait(3000);
				$.currentScence = i + 1;
				if ($.myMapList[i].isFirstShare === 1) {
					console.log(`去分享${$.myMapList[i].partyName}`);
					await takePostRequest('zoo_getWelfareScore');
				}
			}
		}
		if (new Date().getUTCHours() + 8 >= 14 && new Date().getUTCHours() + 8 <=
			17) { //30个店铺，为了避免代码执行太久，下午2点到5点才做店铺任务
			console.log(`去做店铺任务`);
			$.shopInfoList = [];
			await takePostRequest('qryCompositeMaterials');
			for (let i = 0; i < $.shopInfoList.length; i++) {
				$.shopSign = $.shopInfoList[i].extension.shopId;
				console.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
				$.shopResult = {};
				await takePostRequest('zoo_shopLotteryInfo');
				await $.wait(1000);
				if (JSON.stringify($.shopResult) === `{}`) continue;
				$.shopTask = $.shopResult.taskVos;
				for (let i = 0; i < $.shopTask.length; i++) {
					$.oneTask = $.shopTask[i];
					//console.log($.oneTask);
					if ($.oneTask.taskType === 21 || $.oneTask.taskType === 14 || $.oneTask.status !== 1) {
						continue;
					} //不做入会//不做邀请
					$.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.simpleRecordInfoVo;
					if ($.oneTask.taskType === 12) { //签到
						if ($.shopResult.dayFirst === 0) {
							$.oneActivityInfo = $.activityInfoList;
							console.log(`店铺签到`);
							await takePostRequest('zoo_bdCollectScore');
						}
						continue;
					}
					for (let j = 0; j < $.activityInfoList.length; j++) {
						$.oneActivityInfo = $.activityInfoList[j];
						if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
							continue;
						}
						$.callbackInfo = {};
						console.log(
							`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`
						);
						await takePostRequest('zoo_collectScore');
						if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $
							.callbackInfo.data.result.taskToken) {
							await $.wait(8000);
							let sendInfo = encodeURIComponent(
								`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`
							)
							await callbackResult(sendInfo)
						} else {
							await $.wait(2000);
							console.log(`任务完成`);
						}
					}
				}
				// await $.wait(1000);
				// let boxLotteryNum = $.shopResult.boxLotteryNum;
				// for (let j = 0; j < boxLotteryNum; j++) {
				//   console.log(`开始第${j+1}次拆盒`)
				//   //抽奖
				//   await takePostRequest('zoo_boxShopLottery');
				//   await $.wait(3000);
				// }
				// let wishLotteryNum = $.shopResult.wishLotteryNum;
				// for (let j = 0; j < wishLotteryNum; j++) {
				//   console.log(`开始第${j+1}次能量抽奖`)
				//   //抽奖
				//   await takePostRequest('zoo_wishShopLottery');
				//   await $.wait(3000);
				// }
				await $.wait(3000);
			}
		}
		//==================================微信任务========================================================================
		$.wxTaskList = [];
		await takePostRequest('wxTaskDetail');
		for (let i = 0; i < $.wxTaskList.length; i++) {
			$.oneTask = $.wxTaskList[i];
			if ($.oneTask.taskType === 2 || $.oneTask.status !== 1) {
				continue;
			} //不做加购
			$.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask
				.followShopVo || $.oneTask.browseShopVo;
			for (let j = 0; j < $.activityInfoList.length; j++) {
				$.oneActivityInfo = $.activityInfoList[j];
				if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
					continue;
				}
				$.callbackInfo = {};
				console.log(
					`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`
				);
				await takePostRequest('zoo_collectScore');
				if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo
					.data.result.taskToken) {
					await $.wait(8000);
					let sendInfo = encodeURIComponent(
						`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`
					)
					await callbackResult(sendInfo)
				} else {
					await $.wait(2000);
					console.log(`任务完成`);
				}
			}
		}
		//=======================================================京东金融=================================================================================
		$.jdjrTaskList = [];
		await takePostRequest('jdjrTaskDetail');
		await $.wait(1000);
		for (let i = 0; i < $.jdjrTaskList.length; i++) {
			$.taskId = $.jdjrTaskList[i].id;
			if ($.taskId === '3980' || $.taskId === '3981' || $.taskId === '3982') continue;
			if ($.jdjrTaskList[i].status === '1' || $.jdjrTaskList[i].status === '3') {
				console.log(`去做任务：${$.jdjrTaskList[i].name}`);
				await takePostRequest('jdjrAcceptTask');
				await $.wait(8000);
				await takeGetRequest();
			} else if ($.jdjrTaskList[i].status === '2') {
				console.log(`任务：${$.jdjrTaskList[i].name},已完成`);
			}
		}
		//======================================================怪兽大作战==============================================================================================================
		$.pkHomeData = {};
		await takePostRequest('zoo_pk_getHomeData');
		if (JSON.stringify($.pkHomeData) === '{}') {
			that.log(`获取PK信息异常`);
			return;
		}
		await $.wait(1000);
		$.pkTaskList = [];
		await takePostRequest('zoo_pk_getTaskDetail');
		await $.wait(1000);
		for (let i = 0; i < $.pkTaskList.length; i++) {
			$.oneTask = $.pkTaskList[i];
			if ($.oneTask.status === 1) {
				$.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask
					.followShopVo || $.oneTask.browseShopVo
				for (let j = 0; j < $.activityInfoList.length; j++) {
					$.oneActivityInfo = $.activityInfoList[j];
					if ($.oneActivityInfo.status !== 1) {
						continue;
					}
					that.log(
						`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`
					);
					await takePostRequest('zoo_pk_collectScore');
					await $.wait(2000);
					that.log(`任务完成`);
				}
			}
		}
		await $.wait(1000);
		await takePostRequest('zoo_pk_getTaskDetail');
		let skillList = $.pkHomeData.result.groupInfo.skillList || [];
		$.doSkillFlag = true;
		//activityStatus === 1未开始，2 已开始
		for (let i = 0; i < skillList.length && $.pkHomeData.result.activityStatus === 2 && $.doSkillFlag ==
			true; i++) {
			if (Number(skillList[i].num) > 0) {
				$.skillCode = skillList[i].code;
				for (let j = 0; j < Number(skillList[i].num) && $.doSkillFlag == true; j++) {
					that.log(`使用技能`);
					await takePostRequest('zoo_pk_doPkSkill');
					await $.wait(2000);
				}
			}
		}
	} catch (e) {
		$.logErr(e)
	}
}

async function takePostRequest(type) {
	let body = ``;
	let myRequest = ``;
	switch (type) {
		case 'zoo_signSingle':
			body = `functionId=zoo_signSingle&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_signSingle`, body);
			break;
		case 'zoo_getHomeData':
			body = `functionId=zoo_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getHomeData`, body);
			break;
		case 'helpHomeData':
			body = `functionId=zoo_getHomeData&body={"inviteId":"${$.inviteId}"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getHomeData`, body);
			break;
		case 'zoo_collectProduceScore':
			body = getBody(type);
			myRequest = await getPostRequest(`zoo_collectProduceScore`, body);
			break;
		case 'zoo_getFeedDetail':
			body = `functionId=zoo_getFeedDetail&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getFeedDetail`, body);
			break;
		case 'zoo_getTaskDetail':
			body = `functionId=zoo_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getTaskDetail`, body);
			break;
		case 'zoo_collectScore':
			body = getBody(type);
			//that.log(body);
			myRequest = await getPostRequest(`zoo_collectScore`, body);
			break;
		case 'zoo_raise':
			body = `functionId=zoo_raise&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_raise`, body);
			break;
		case 'help':
			body = getBody(type);
			//that.log(body);
			myRequest = await getPostRequest(`zoo_collectScore`, body);
			break;
		case 'zoo_pk_getHomeData':
			body = `functionId=zoo_pk_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_pk_getHomeData`, body);
			break;
		case 'zoo_pk_getTaskDetail':
			body = `functionId=zoo_pk_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_pk_getTaskDetail`, body);
			break;
		case 'zoo_pk_collectScore':
			body = getBody(type);
			//that.log(body);
			myRequest = await getPostRequest(`zoo_pk_collectScore`, body);
			break;
		case 'zoo_pk_doPkSkill':
			body = `functionId=zoo_pk_doPkSkill&body={"skillType":"${$.skillCode}"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_pk_doPkSkill`, body);
			break;
		case 'pkHelp':
			body = getBody(type);
			myRequest = await getPostRequest(`zoo_pk_assistGroup`, body);
			break;
		case 'zoo_getSignHomeData':
			body = `functionId=zoo_getSignHomeData&body={"notCount":"1"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getSignHomeData`, body);
			break;
		case 'zoo_sign':
			body = `functionId=zoo_sign&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_sign`, body);
			break;
		case 'wxTaskDetail':
			body =
				`functionId=zoo_getTaskDetail&body={"appSign":"2","channel":1,"shopSign":""}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_getTaskDetail`, body);
			break;
		case 'zoo_shopLotteryInfo':
			body =
				`functionId=zoo_shopLotteryInfo&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_shopLotteryInfo`, body);
			break;
		case 'zoo_bdCollectScore':
			body = getBody(type);
			myRequest = await getPostRequest(`zoo_bdCollectScore`, body);
			break;
		case 'qryCompositeMaterials':
			body =
				`functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"resultData\\",\\"id\\":\\"05371960\\"}]","activityId":"2s7hhSTbhMgxpGoa9JDnbDzJTaBB","pageId":"","reqSrc":"","applyKey":"jd_star"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`qryCompositeMaterials`, body);
			break;
		case 'zoo_boxShopLottery':
			body = `functionId=zoo_boxShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_boxShopLottery`, body);
			break;
		case `zoo_wishShopLottery`:
			body =
				`functionId=zoo_wishShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_boxShopLottery`, body);
			break;
		case `zoo_myMap`:
			body = `functionId=zoo_myMap&body={}&client=wh5&clientVersion=1.0.0`;
			myRequest = await getPostRequest(`zoo_myMap`, body);
			break;
		case 'zoo_getWelfareScore':
			body = getBody(type);
			myRequest = await getPostRequest(`zoo_getWelfareScore`, body);
			break;
		case 'jdjrTaskDetail':
			body =
				`reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567"}`;
			myRequest = await getPostRequest(`listTask`, body);
			break;
		case 'jdjrAcceptTask':
			body =
				`reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567","id":"${$.taskId}"}`;
			myRequest = await getPostRequest(`acceptTask`, body);
			break;
		default:
			that.log(`错误${type}`);
	}
	return new Promise(async resolve => {
		$.post(myRequest, (err, resp, data) => {
			try {
				//that.log(data);
				dealReturn(type, data);
			} catch (e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		})
	})
}

async function dealReturn(type, data) {
	try {
		data = JSON.parse(data);
	} catch (e) {
		that.log(`返回异常：${data}`);
		return;
	}
	switch (type) {
		case 'zoo_signSingle':
			if (data.code === 0) $.signSingle = data.data
			break;
		case 'zoo_getHomeData':
			if (data.code === 0) {
				$.homeData = data.data;
				$.secretp = data.data.result.homeMainInfo.secretp;
				$.secretpInfo[$.UserName] = $.secretp;
			}
			break;
		case 'helpHomeData':
			that.log(data)
			if (data.code === 0) {
				$.secretp = data.data.result.homeMainInfo.secretp;
				//that.log(`$.secretp：${$.secretp}`);
			}
			break;
		case 'zoo_collectProduceScore':
			if (data.code === 0) {
				that.log(`收取成功，获得：${data.data.result.produceScore}`);
			}
			break;
		case 'zoo_getTaskDetail':
			if (data.code === 0) {
				that.log(`互助码：${data.data.result.inviteId || '助力已满，获取助力码失败'}`);
				if (data.data.result.inviteId) {
					$.inviteList.push({
						'ues': $.UserName,
						'secretp': $.secretp,
						'inviteId': data.data.result.inviteId,
						'max': false
					});
				}
				$.taskList = data.data.result.taskVos;
			}
			break;
		case 'zoo_collectScore':
			$.callbackInfo = data;
			break;
		case 'zoo_raise':
			if (data.code === 0) that.log(`升级成功`);
			break;
		case 'help':
		case 'pkHelp':
			//that.log(data);
			switch (data.data.bizCode) {
				case 0:
					console.log(`助力成功`);
					break;
				case -201:
					console.log(`助力已满`);
					$.oneInviteInfo.max = true;
					break;
				case -202:
					console.log(`已助力`);
					break;
				case -8:
					console.log(`已经助力过该队伍`);
					break;
				case -6:
				case 108:
					console.log(`助力次数已用光`);
					$.canHelp = false;
					break;
				default:
					console.log(`怪兽大作战助力失败：${JSON.stringify(data)}`);
			}
			break;
		case 'zoo_pk_getHomeData':
			if (data.code === 0) {
				that.log(`PK互助码：${data.data.result.groupInfo.groupAssistInviteId}`);
				if (data.data.result.groupInfo.groupAssistInviteId) $.pkInviteList.push(data.data.result.groupInfo
					.groupAssistInviteId);
				$.pkHomeData = data.data;
			}
			break;
		case 'zoo_pk_getTaskDetail':
			if (data.code === 0) {
				$.pkTaskList = data.data.result.taskVos;
			}
			break;
		case 'zoo_getFeedDetail':
		case 'zoo_pk_collectScore':
			break;
		case 'zoo_pk_doPkSkill':
			if (data.data.bizCode === 0) console.log(`使用成功`);
			if (data.data.bizCode === -2) {
				console.log(`队伍任务已经完成，无法释放技能!`);
				$.doSkillFlag = false;
			} else if (data.data.bizCode === -2003) {
				console.log(`现在不能打怪兽`);
				$.doSkillFlag = false;
			}
			break;
		case 'zoo_getSignHomeData':
			if (data.code === 0) {
				$.signHomeData = data.data.result;
			}
			break
		case 'zoo_sign':
			if (data.code === 0 && data.data.bizCode === 0) {
				that.log(`签到获得成功`);
				if (data.data.result.redPacketValue) that.log(`签到获得：${data.data.result.redPacketValue} 红包`);
			} else {
				that.log(`签到失败`);
				that.log(data);
			}
			break
		case 'wxTaskDetail':
			if (data.code === 0) {
				$.wxTaskList = data.data.result.taskVos;
			}
			break;
		case 'zoo_shopLotteryInfo':
			if (data.code === 0) {
				$.shopResult = data.data.result;
			}
			break;
		case 'zoo_bdCollectScore':
			if (data.code === 0) {
				console.log(`签到获得：${data.data.result.score}`);
			}
			break;
		case 'qryCompositeMaterials':
			//console.log(data);
			if (data.code === '0') {
				$.shopInfoList = data.data.resultData.list;
				console.log(`获取到${$.shopInfoList.length}个店铺`);
			}
			break
		case 'zoo_boxShopLottery':
			console.log(JSON.stringify(data));
			break
		case 'zoo_wishShopLottery':
			console.log(JSON.stringify(data));
			break
		case `zoo_myMap`:
			if (data.code === 0) {
				$.myMapList = data.data.result.sceneMap.sceneInfo;
			}
			break;
		case 'zoo_getWelfareScore':
			if (data.code === 0) {
				console.log(`分享成功，获得：${data.data.result.score}`);
			}
			break;
		case 'jdjrTaskDetail':
			if (data.resultCode === 0) {
				$.jdjrTaskList = data.resultData.top;
			}
			break;
		case 'jdjrAcceptTask':
			if (data.resultCode === 0) {
				console.log(`领任务成功`);
			}
			break;
		default:
			that.log(`未判断的异常${type}`);
	}
}

function takeGetRequest() {
	return new Promise(async resolve => {
		$.get({
			url: `https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?reqData={%22missionId%22:%22${$.taskId}%22,%22readTime%22:8}`,
			headers: {
				'Origin': `https://prodev.m.jd.com`,
				'Cookie': $.cookie,
				'Connection': `keep-alive`,
				'Accept': `*/*`,
				'Referer': `https://prodev.m.jd.com`,
				'Host': `ms.jr.jd.com`,
				'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT :
					(require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata(
						'JDUA') :
					"jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
					),
				'Accept-Encoding': `gzip, deflate, br`,
				'Accept-Language': `zh-cn`
			}
		}, (err, resp, data) => {
			try {
				data = JSON.parse(data);
				if (data.resultCode === 0) {
					console.log(`任务完成`);
				}
			} catch (e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		})
	})
}


//领取奖励
function callbackResult(info) {
	return new Promise((resolve) => {
		let url = {
			url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` +
				Date.now(),
			headers: {
				'Origin': `https://bunearth.m.jd.com`,
				'Cookie': $.cookie,
				'Connection': `keep-alive`,
				'Accept': `*/*`,
				'Host': `api.m.jd.com`,
				'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (
					require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') :
					"jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
				),
				'Accept-Encoding': `gzip, deflate, br`,
				'Accept-Language': `zh-cn`,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Referer': 'https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?jmddToSmartEntry=login'
			}
		}

		$.get(url, async (err, resp, data) => {
			try {
				data = JSON.parse(data);
				that.log(data.toast.subTitle)
			} catch (e) {
				$.logErr(e, resp);
			} finally {
				resolve()
			}
		})
	})
}

async function getPostRequest(type, body) {
	const url = `https://api.m.jd.com/client.action?functionId=${type}`;
	const method = `POST`;
	const headers = {
		'Accept': `application/json, text/plain, */*`,
		'Origin': `https://wbbny.m.jd.com`,
		'Accept-Encoding': `gzip, deflate, br`,
		'Cookie': $.cookie,
		'Content-Type': `application/x-www-form-urlencoded`,
		'Host': `api.m.jd.com`,
		'Connection': `keep-alive`,
		'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require(
			'./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') :
			"jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
		),
		'Referer': `https://wbbny.m.jd.com`,
		'Accept-Language': `zh-cn`
	};
	return {
		url: url,
		method: method,
		headers: headers,
		body: body
	};
}

function getBody(type) {
	let rnd = Math.round(Math.random() * 1e6)
	let nonstr = randomWord(false, 10)
	let time = Date.now()
	let key = minusByByte(nonstr.slice(0, 5), String(time).slice(-5))
	let msg = `random=${rnd}&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
	let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase();
	let taskBody = '';
	if (type === 'help') {
		taskBody =
			`functionId=zoo_collectScore&body={"taskId":2,"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${$.secretp}\\",\\"random\\":\\"${rnd}\\"}","inviteId":"${$.inviteId}","actionType":1}&client=wh5&clientVersion=1.0.0`
	} else if (type === 'pkHelp') {
		taskBody =
			`functionId=zoo_pk_assistGroup&body={"taskId":2,"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${$.secretp}\\",\\"random\\":\\"${rnd}\\"}","inviteId":"${$.pkInviteId}","actionType":1}&client=wh5&clientVersion=1.0.0`;
	} else if (type === 'zoo_collectProduceScore') {
		taskBody =
			`functionId=zoo_collectProduceScore&body={"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_0\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${$.secretp}\\",\\"random\\":\\"${rnd}\\"}"}&client=wh5&clientVersion=1.0.0`;
	} else {
		taskBody =
			`functionId=${type}&body={"taskId":"${$.oneTask.taskId}","taskToken":"${$.oneActivityInfo.taskToken}","actionType":1,"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${$.secretp}\\",\\"random\\":\\"${rnd}\\"}","itemId":"${$.oneActivityInfo.itemId}","shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`
	}
	return taskBody
}

function randomWord(randomFlag, min, max) {
	let str = "",
		range = min,
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
			'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F',
			'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		];
	// 随机产生
	if (randomFlag) {
		range = Math.round(Math.random() * (max - min)) + min;
	}
	for (let i = 0; i < range; i++) {
		let pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
}

function minusByByte(t, n) {
	var e = t.length,
		r = n.length,
		o = Math.max(e, r),
		i = toAscii(t),
		a = toAscii(n),
		s = "",
		u = 0;
	for (e !== r && (i = add0(i, o),
			a = this.add0(a, o)); u < o;)
		s += Math.abs(i[u] - a[u]),
		u++;
	return s
}

function toAscii(t) {
	var n = "";
	for (var e in t) {
		var r = t[e],
			o = /[a-zA-Z]/.test(r);
		if (t.hasOwnProperty(e))
			if (o)
				n += getLastAscii(r);
			else
				n += r
	}
	return n
}

function add0(t, n) {
	return (Array(n).join("0") + t).slice(-n)
}

function getLastAscii(t) {
	var n = t.charCodeAt(0).toString();
	return n[n.length - 1]
}

function wordsToBytes(t) {
	for (var n = [], e = 0; e < 32 * t.length; e += 8)
		n.push(t[e >>> 5] >>> 24 - e % 32 & 255);
	return n
}

function bytesToHex(t) {
	for (var n = [], e = 0; e < t.length; e++)
		n.push((t[e] >>> 4).toString(16)),
		n.push((15 & t[e]).toString(16));
	return n.join("")
}

function stringToBytes(t) {
	t = unescape(encodeURIComponent(t))
	for (var n = [], e = 0; e < t.length; e++)
		n.push(255 & t.charCodeAt(e));
	return n
}

function bytesToWords(t) {
	for (var n = [], e = 0, r = 0; e < t.length; e++,
		r += 8)
		n[r >>> 5] |= t[e] << 24 - r % 32;
	return n
}

function getSign(t) {
	t = stringToBytes(t)
	var e = bytesToWords(t),
		i = 8 * t.length,
		a = [],
		s = 1732584193,
		u = -271733879,
		c = -1732584194,
		f = 271733878,
		h = -1009589776;
	e[i >> 5] |= 128 << 24 - i % 32,
		e[15 + (i + 64 >>> 9 << 4)] = i;
	for (var l = 0; l < e.length; l += 16) {
		for (var p = s, g = u, v = c, d = f, y = h, m = 0; m < 80; m++) {
			if (m < 16)
				a[m] = e[l + m];
			else {
				var w = a[m - 3] ^ a[m - 8] ^ a[m - 14] ^ a[m - 16];
				a[m] = w << 1 | w >>> 31
			}
			var _ = (s << 5 | s >>> 27) + h + (a[m] >>> 0) + (m < 20 ? 1518500249 + (u & c | ~u & f) : m < 40 ?
				1859775393 + (u ^ c ^ f) : m < 60 ? (u & c | u & f | c & f) - 1894007588 : (u ^ c ^ f) - 899497514);
			h = f,
				f = c,
				c = u << 30 | u >>> 2,
				u = s,
				s = _
		}
		s += p,
			u += g,
			c += v,
			f += d,
			h += y
	}
	return [s, u, c, f, h]
}

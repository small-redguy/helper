/*
author: 疯疯
东东健康社区
更新时间：2021-4-22
活动入口：京东APP首页搜索 "玩一玩"即可

脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#东东健康社区
10 0-23/4 * * * https://jdsharedresourcescdn.azureedge.net/jdresource/jd_health.js, tag=东东健康社区, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "10 0-23/4 * * *" script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_health.js, tag=东东健康社区

====================Surge================
东东健康社区 = type=cron,cronexp=10 0-23/4 * * *,wake-system=1,timeout=3600,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_health.js

============小火箭=========
东东健康社区 = type=cron,script-path=https://jdsharedresourcescdn.azureedge.net/jdresource/jd_health.js, cronexpr="0 0,6,12,18 * * *", timeout=3600, enable=true
 */
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
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
let cookiesArr = [],
	cookie = "",
	message;
const inviteCodes = []
const randomCount = $.isNode() ? 20 : 5;
if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item]);
	});
	//that.log(`如果出现提示 ?.data. 错误，请升级nodejs版本(进入容器后，apk add nodejs-current)`)
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") that.log = () => {};
} else {
	cookiesArr = [
		$.getdata("CookieJD"),
		$.getdata("CookieJD2"),
		...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)
	].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
!(async () => {
	if (!cookiesArr[0]) {
		$.msg(
			$.name,
			"【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
			"https://bean.m.jd.com/", {
				"open-url": "https://bean.m.jd.com/"
			}
		);
		return;
	}
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			cookie = cookiesArr[i];
			$.UserName = decodeURIComponent(
				cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
			);
			$.index = i + 1;
			message = "";
			that.log(`\n******开始【京东账号${$.index}】${$.UserName}*********\n`);
			await main()
			await showMsg()
		}
	}
})()
.catch((e) => {
		$.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
	})
	.finally(() => {
		$.done();
	});

async function main() {
	try {
		await collectScore()
	} catch (e) {
		$.logErr(e)
	}
}

async function helpFriends() {
	await getHelp();
	for (let code of $.newShareCodes) {
		if (!code) continue
		that.log(`去助力好友${code}`)
		let res = await doTask(code, 6)
		if ([108, -1001].includes(res?.data?.bizCode)) {
			that.log(`助力次数已满，跳出`)
			break
		}
		await $.wait(1000)
	}
	await setHelp();
}

function showMsg() {
	return new Promise(async resolve => {
		message += `本次获得${$.earn}健康值，累计${$.score}健康值\n`
		$.msg($.name, '', `京东账号${$.index} ${$.UserName}\n${message}`);
		resolve();
	})
}

function getTaskDetail(taskId = '') {
	return new Promise(resolve => {
		$.get(taskUrl('jdhealth_getTaskDetail', {
				"buildingId": "",
				taskId: taskId === -1 ? '' : taskId,
				"channelId": 1
			}),
			async (err, resp, data) => {
				try {
					if (safeGet(data)) {
						data = $.toObj(data)
						if (taskId === -1) {
							let tmp = parseInt(parseFloat(data?.data?.result?.userScore ?? '0'))
							if (!$.earn) {
								$.score = tmp
								$.earn = 1
							} else {
								$.earn = tmp - $.score
								$.score = tmp
							}
						} else if (taskId === 6) {
							if (data?.data?.result?.taskVos) {
								that.log(
									`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${data?.data?.result?.taskVos[0].assistTaskDetailVo.taskToken}\n`
								);
								that.log('好友助力码：' + data?.data?.result?.taskVos[0].assistTaskDetailVo
									.taskToken)
								$.shareId = data?.data?.result?.taskVos[0].assistTaskDetailVo.taskToken;
							}
						} else
							for (let vo of data?.data?.result?.taskVos.filter(vo => vo.taskType !==
									19) ?? []) {
								that.log(`${vo.taskName}任务，完成次数：${vo.times}/${vo.maxTimes}`)
								for (let i = vo.times; i < vo.maxTimes; ++i) {
									that.log(`去完成${vo.taskName}任务`)
									if (vo.taskType === 13) {
										await doTask(vo.simpleRecordInfoVo?.taskToken, vo?.taskId)
									} else if (vo.taskType === 8) {
										await doTask(vo.productInfoVos[i]?.taskToken, vo?.taskId, 1)
										await $.wait(1000 * 10)
										await doTask(vo.productInfoVos[i]?.taskToken, vo?.taskId, 0)
									} else if (vo.taskType === 9) {
										await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId,
											1)
										await $.wait(1000 * 10)
										await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId,
											0)
									} else if (vo.taskType === 10) {
										await doTask(vo.threeMealInfoVos[0]?.taskToken, vo?.taskId)
									} else if (vo.taskType === 26 || vo.taskType === 3) {
										await doTask(vo.shoppingActivityVos[0]?.taskToken, vo?.taskId)
									}
								}
							}
					}
				} catch (e) {
					that.log(e)
				} finally {
					resolve()
				}
			})
	})
}

function doTask(taskToken, taskId, actionType = 0) {
	return new Promise(resolve => {
		$.get(taskUrl('jdhealth_collectScore', {
				taskToken,
				taskId,
				actionType
			}),
			(err, resp, data) => {
				try {
					if (safeGet(data)) {
						data = $.toObj(data)
						if ([0, 1].includes(data?.data?.bizCode ?? -1)) {
							$.canDo = true
							if (data?.data?.result?.score)
								that.log(`任务完成成功，获得：${data?.data?.result?.score ?? '未知'}能量`)
							else
								that.log(`任务领取结果：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
						} else {
							that.log(`任务完成失败：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
						}
					}
				} catch (e) {
					that.log(e)
				} finally {
					resolve(data)
				}
			})
	})
}

function collectScore() {
	return new Promise(resolve => {
		$.get(taskUrl('jdhealth_collectProduceScore', {}),
			(err, resp, data) => {
				try {
					if (safeGet(data)) {
						data = $.toObj(data)
						if (data?.data?.bizCode === 0) {
							if (data?.data?.result?.produceScore)
								that.log(`任务完成成功，获得：${data?.data?.result?.produceScore ?? '未知'}能量`)
							else
								that.log(`任务领取结果：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
						} else {
							that.log(`任务完成失败：${data?.data?.bizMsg ?? JSON.stringify(data)}`)
						}
					}
				} catch (e) {
					that.log(e)
				} finally {
					resolve()
				}
			})
	})
}

function taskUrl(function_id, body = {}) {
	return {
		url: `${JD_API_HOST}/client.action?functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
		headers: {
			"Cookie": cookie,
			"origin": "https://h5.m.jd.com",
			"referer": "https://h5.m.jd.com/",
			'Content-Type': 'application/x-www-form-urlencoded',
			"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require(
				'./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') :
				"jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"
			)
		}
	}
}

function safeGet(data) {
	try {
		if (typeof JSON.parse(data) == "object") {
			return true;
		}
	} catch (e) {
		that.log(e);
		that.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
		return false;
	}
}

function getHelp() {
	$.newShareCodes = [];
	return new Promise(resolve => {
		that.get({
			url: "http://api.tyh52.com/act/get/jdhealtharea/6"
		}, (data) => {
			try {
				if (data) {
					that.log(data);
					if (data.code == 1) {
						let list = data.data;
						try {
							if (!(list instanceof Array)) {
								list = JSON.parse(list);
							}
						} catch (dd) {}
						if (list.length > 0) {
							for (var i in list) {
								$.newShareCodes.push(list[i]);
							}
						}
					}
				}
			} catch (e) {
				that.log(e);
			} finally {
				resolve(data);
			}
		})
	});
}

function setHelp() {
	return new Promise(resolve => {
		if ($.shareId) {
			that.get({
				url: "http://api.tyh52.com/act/set/jdhealtharea/" + $.shareId
			}, (data) => {
				try {
					if (data) {
						if (data.code == 1) {
							that.log("提交自己的邀請碼成功");
						}
					}
				} catch (e) {
					that.log(e);
				} finally {
					resolve(data);
				}
			})
		} else {
			resolve();
		}

	});
}
//格式化助力码
function shareCodesFormat() {
	return new Promise(async resolve => {
		// that.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
		$.newShareCodes = [];
		// if ($.shareCodesArr[$.index - 1]) {
		//   $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
		// } else {
		//   that.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
		//   const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
		//   $.newShareCodes = inviteCodes[tempIndex].split('@');
		// }
		// const readShareCodeRes = await readShareCode();
		// if (readShareCodeRes && readShareCodeRes.code === 200) {
		// 	$.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
		// }
		// that.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
		resolve();
	})
}

function requireConfig() {
	return new Promise(resolve => {
		that.log(`开始获取${$.name}配置文件\n`);
		//Node.js用户请在jdCookie.js处填写京东ck;
		let shareCodes = [];
		if ($.isNode()) {
			if (process.env.JDHEALTH_SHARECODES) {
				if (process.env.JDHEALTH_SHARECODES.indexOf('\n') > -1) {
					shareCodes = process.env.JDHEALTH_SHARECODES.split('\n');
				} else {
					shareCodes = process.env.JDHEALTH_SHARECODES.split('&');
				}
			}
		}
		that.log(`共${cookiesArr.length}个京东账号\n`);
		$.shareCodesArr = [];
		if ($.isNode()) {
			Object.keys(shareCodes).forEach((item) => {
				if (shareCodes[item]) {
					$.shareCodesArr.push(shareCodes[item])
				}
			})
		}
		that.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
		resolve()
	})
}

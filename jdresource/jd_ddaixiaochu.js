let exchangeName = '京豆*1888'
$.maxLevel=480;
	let ACT_ID = 'A_112790_R_1_D_20201028'
	//Node.js用户请在jdCookie.js处填写京东ck;
	//IOS等用户直接用NobyDa的jd cookie
	let cookiesArr = [],
		cookie = '',
		message;


if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}

!(async () => {
			for (let i = 0; i < cookiesArr.length; i++) {
				if (cookiesArr[i]) {
					cookie = cookiesArr[i];
					$.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
					$.index = i + 1;
					$.isLogin = true;
					$.nickName = '';
					message = '';
					await TotalBean();
					that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********`);
					if (!$.isLogin) {
						$.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {
							"open-url": "https://bean.m.jd.com/"
						});
						return;
					}
					await jdBeauty()
					await jdBeauty(false)
				}
			}
		})()
		.catch((e) => {
				$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
			})
			.finally(() => {
				$.done();
			})


	function obj2param(obj) {
		let str = "";
		for (let key in obj) {
			if (str !== "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}
		return str
	}


	async function jdBeauty(help = true) {
		$.reqId = 1
		await getIsvToken()
		await getIsvToken2()
		await getActInfo()
		await getTaskList()
		await getDailyMatch()
		await play();
		// await marketGoods()
		if (help) await helpFriends()
	}
	async function helpFriends() {
		$.newShareCodes = [];
		await getHelp();
		for (let code of $.newShareCodes) {
			if (code) {
				that.log(`去助力好友${code}`)
				await getActInfo(code)
				await $.wait(500)
			}
		}
		await setHelp();
	}

	function getHelp() {
		$.newShareCodes = [];
		return new Promise(resolve => {
			$.get({
				url: "https://actapi.tyh52.com/act/get/ddaixiaochu/3",
			}, (err, resp, data) => {
				try {
					if (data) {
						data = JSON.parse(data);
						if (data.code == 1) {
							that.log("获取随机助力好友邀请码成功");
							let list = data.data;
							if (!(list instanceof Array)) {
								list = JSON.parse(list);
							}
							if (list.length > 0) {
								for (var i in list) {
									$.newShareCodes.push(list[i]);
								}
							}
						}
					}
				} catch (e) {
					$.logErr(e, resp);
				} finally {
					resolve(data);
				}
			})
		});
	}

	function setHelp() {
		return new Promise(resolve => {
			if ($.shareId) {
				$.get({
					url: "https://actapi.tyh52.com/act/set/ddaixiaochu/" + $.shareId
				}, (err, resp, data) => {
					try {
						if (data) {
							data = JSON.parse(data);
							if (data.code == 1) {
								that.log("提交自己的邀請碼成功");
							} else {
								that.log("已经提交过自己的邀请码");
							}
						}
					} catch (e) {
						$.logErr(e, resp);
					} finally {
						resolve(data);
					}
				})
			} else {
				resolve();
			}

		});
	}
	// 获得IsvToken

	function getIsvToken() {
		return new Promise(resolve => {
			$.post(jdUrl('encrypt/pin?appId=dafbe42d5bff9d82298e5230eb8c3f79'), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							$.lkEPin = data.data
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}

	// 获得对应游戏的访问Token
	function getIsvToken2() {
		return new Promise(resolve => {
			$.post(jdUrl('user/token?appId=dafbe42d5bff9d82298e5230eb8c3f79&client=m&url=pengyougou.m.jd.com'), async (err,
				resp, data) => {
				try {
					if (err) {
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							$.token = data.data
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}

	function getActInfo(inviter = null) {
		let body = {
			"inviter": inviter,
			"activeId": ACT_ID,
			"refid": "wojing",
			"lkEPin": $.lkEPin,
			"token": $.token,
			"un_area": "12_904_908_57903",
			"source": "wojing",
			"scene": "3"
		}
		return new Promise(resolve => {
			$.post(taskUrl("platform/active/role/login", body), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${err}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (!inviter) {
								$.info = data.info
								$.id = data.id
								$.authcode = data.authcode
								$.to = data.token
								$.money = JSON.parse(data.info.platform)['money']
								$.shareId = data.id
								that.log(`您的好友助力码为：${$.id}`)
								that.log(`当前星星：${$.money}`)
								// SecrectUtil2.InitEncryptInfo(data.token, data.info.pltId)
								await checkLogin()
							}
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}

	function checkLogin() {
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/logincheck", {
				info: JSON.stringify($.info),
				"reqsId": $.reqId++
			}), async (err, resp, data) => {
				try {
					if (err) {
						that.log(`${err}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							$.gameId = data.role.gameId
							$.gameToken = data.token
							$.strength = data.role.items['8003']
							that.log(`当前体力：${$.strength}`)
							// that.log(JSON.stringify(data))
							$.curLevel = data.role.gameInfo.levelId || 40103
							$.not3Star = []
							for (let level of data.role.allLevels) {
								if (level.maxStar !== 3) {
									$.not3Star.push(level.id)
								}
							}
							if (data.role.allLevels.length)
								$.level = parseInt(data.role.allLevels[data.role.allLevels.length - 1]['id'])
							else
								$.level = 1
							if ($.not3Star.length)
								that.log(`当前尚未三星的关卡为：${$.not3Star.join(',')}`)
							// SecrectUtil.InitEncryptInfo($.gameToken, $.gameId)
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve(data);
				}
			})
		})
	}
	async function play() {
		//$.level += 1
		console.log(`当前关卡：${$.level}`)
		while ($.strength >= 5 && $.level <= $.maxLevel) {
			await beginLevel()
		}
		if ($.not3Star.length && $.strength >= 5) {
			console.log(`去完成尚未三星的关卡`)
			for (let level of $.not3Star) {
				$.level = parseInt(level)
				await beginLevel()
				if ($.strength < 5) break
			}
		}
	}

	function getTaskList() {
		return new Promise(resolve => {
			$.post(taskUrl("platform/active/jingdong/gametasks", {
					"activeid": ACT_ID,
					"id": $.id,
					"token": $.gameToken,
					"authcode": $.authcode,
				}),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								for (let task of data.tasks) {
									if (task.res.sName === "闯关集星") {
										$.level = task.state.value + 1
										that.log(`当前关卡：${$.level}`)
										while ($.strength >= 5 && $.level <= 240) {
											await beginLevel()
										}
										if ($.not3Star.length && $.strength >= 5) {
											that.log(`去完成尚未三星的关卡`)
											for (let level of $.not3Star) {
												$.level = parseInt(level)
												await beginLevel()
												if ($.strength < 5) break
											}
										}
									} else if (task.res.sName === "逛逛店铺") {
										if (task.state.iFreshTimes < task.res.iFreshTimes)
											that.log(`去做${task.res.sName}任务`)
										for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
											await uploadTask(task.res.eType, task.res.iValue)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === "收藏商品") {
										if (task.state.iFreshTimes < task.res.iFreshTimes) {
											that.log(`去做${task.res.sName}任务`)
											let body = {
												"api": "followSku",
												"skuId": task.adInfo.sValue,
												"id": $.id,
												"activeid": ACT_ID,
												"activeId": ACT_ID,
												"authcode": $.authcode,
											}
											await execute(body)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === '加入会员') {
										continue
										if (!task.state.get) {
											that.log(`去做${task.res.sName}任务`)
											let body = {
												"api": "checkMember",
												"memberId": task.adInfo.sValue,
												"id": $.id,
												"activeid": ACT_ID,
												"activeId": ACT_ID,
												"authcode": $.authcode,
											}
											await execute(body)
											// await uploadTask(task.res.eType,task.res.iValue)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === '下单有礼') {
										// that.log(task)
									} else if (task.res.sName === '商品加购') {
										for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
											that.log(`去做${task.res.sName}任务`)
											let body = {
												"api": "addProductToCart",
												"skuList": task.adInfo.sValue,
												"id": $.id,
												"activeid": ACT_ID,
												"activeId": ACT_ID,
												"authcode": $.authcode,
											}
											await execute(body)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === '关注店铺') {
										if (task.state.iFreshTimes < task.res.iFreshTimes)
											that.log(`去做${task.res.sName}任务`)
										for (let i = task.state.iFreshTimes; i < task.res.iFreshTimes; ++i) {
											let body = {
												"api": "followShop",
												"shopId": task.adInfo.sValue,
												"id": $.id,
												"activeid": ACT_ID,
												"activeId": ACT_ID,
												"authcode": $.authcode,
											}
											await execute(body)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === '喂养狗狗' || task.res.sName === '每日签到') {
										if (!task.state.get) {
											if (task.state.iFreshTimes < task.res.iFreshTimes)
												that.log(`去做${task.res.sName}任务`)
											await uploadTask(task.res.eType, task.res.iValue)
											await $.wait(500)
											await finishTask(task.res.sID)
										}
									} else if (task.res.sName === '好友助力') {
										that.log(`去领取好友助力任务`)
										await finishTask(task.res.sID)
									}
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function rand(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function beginLevel() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'levelId': $.level,
			// 'score': 600000 + rand(1000,10000),
			'reqsId': $.reqId++
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/beginLevel", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									let waittime=30+rand(0,10);
									that.log(`第${$.level}关卡开启成功，等待${waittime}秒完成`)
									$.strength -= 5
									await $.wait(waittime*1000)
									await endLevel()
								} else if (data.code === 20001) {
									$.strength = 0
									that.log(`关卡开启失败，体力不足`)
								} else {
									$.strength = 0
									// that.log(`关卡开启失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function endLevel() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'levelId': $.level,
			'score': 600000 + rand(100000, 300000),
			'reqsId': $.reqId++
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/endLevel", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								// that.log(data)
								if (data.code === 0) {
									const level = data.allLevels.filter(vo => parseInt(vo.id) === $.level)
									if (level.length > 0) {
										that.log(`第${$.level++}关已通关，上报${level[0].maxScore}分，获得${level[0].maxStar}星星`)
									} else {
										that.log(`第${$.level}关分数上报失败，错误信息:${JSON.stringify(data)}`)
									}
								} else {
									that.log(`第${$.level}关分数上报失败，错误信息:${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function uploadTask(taskType, value) {
		let body = {
			"taskType": taskType,
			"value": value,
			"id": $.id,
			"activeid": ACT_ID,
			"activeId": ACT_ID,
			"authcode": $.authcode,
		}
		return new Promise(resolve => {
			$.post(taskUrl("platform//role/base/uploadtask", body),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									that.log('任务上报成功')
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function finishTask(taskId) {
		let body = {
			"taskid": taskId,
			"id": $.id,
			"activeid": ACT_ID,
			"activeId": ACT_ID,
			// "inviter": undefined,
			"token": $.to,
			"authcode": $.authcode
		}
		return new Promise(resolve => {
			$.post(taskUrl("/platform/active/jingdong/finishtask", body),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									let msg = `任务完成成功，获得`
									for (let item of data.item) {
										if (item['itemid'] === 'JD01') {
											msg += ` 体力*${item['count']}`
										} else if (item['itemid'] === 'X028') {
											msg += ` 消消乐星星*${item['count']}`
										} else {
											msg += ` ${item['itemid']}*${item['count']}`
										}
									}
									that.log(msg)
								} else {
									that.log(`暂无每日挑战任务`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function execute(body) {
		return new Promise(resolve => {
			$.post(taskUrl("/platform/active/jingdong/execute", body),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									that.log('任务上报成功')
								} else {
									that.log(`任务上报失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function getDailyMatch() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'reqsId': $.reqId++
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/getDailyMatch", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								// that.log(data)
								if (data.code === 0) {
									// that.log(data)
									$.maxScore = parseInt(data.dailyMatchList[data.dailyMatchList.length - 1]['sScore'])
									if (data.dayInfo.score >= $.maxScore && data.dayInfo.boxAwardIndex < 2) {
										await getDailyMatchAward()
									}
									if (data.dayInfo.dayPlayNums < 2) {
										await beginDailyMatch()
									}
								} else {
									that.log(`关卡开启失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function beginDailyMatch() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'reqsId': $.reqId++,
			'levelId': $.curLevel
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/beginDailyMatch", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								// that.log(data)
								if (data.code === 0) {
									that.log(`每日挑战开启成功，本日挑战次数${data.dayInfo.dayPlayNums}/2`)
									$.curLevel = data.dayInfo.curLevel
									await $.wait(30000)
									await endDailyMatch()
								} else {
									that.log(`每日挑战开启失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function endDailyMatch() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'reqsId': $.reqId++,
			'score': Math.trunc($.maxScore / 2) + 3,
			'levelId': $.curLevel,
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/endDailyMatch", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								// that.log(data)
								if (data.code === 0) {
									that.log(`每日挑战完成成功，本日分数${data.dayInfo.score}`)
								} else {
									that.log(`每日挑战完成失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function getDailyMatchAward() {
		let body = {
			'gameId': $.gameId,
			'token': $.gameToken,
			'reqsId': $.reqId++
		}
		return new Promise(resolve => {
			$.post(taskUrl("eliminate_jd/game/local/getDailyMatchAward", obj2param(body), true),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(resp)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								// that.log(data)
								if (data.code === 0) {
									that.log(`每日挑战领取成功，获得${data.reward[0] === '11001' ? '消消乐星星' : '未知道具'}*${data.reward[1]}`)
								} else {
									that.log(`每日挑战领取失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function marketGoods() {
		let body = {
			"id": $.id,
			"activeid": ACT_ID,
			"activeId": ACT_ID,
			"token": $.to,
			"authcode": $.authcode
		}
		return new Promise(resolve => {
			$.post(taskUrl("/platform/active/role/marketgoods", body),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									for (let vo of data.list) {
										if (vo.name === exchangeName) {
											let cond = vo['res']['asConsume'][0].split(',')
											if (vo['left'] === 1 && vo['count'] !== 0 && cond[0] === 'X028' && parseInt(cond[1]) <= $.money) {
												await buyGood(vo['res']['sID'])
											}
										}
									}
								} else {
									that.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function buyGood(consumeid) {
		let body = {
			"consumeid": consumeid,
			"id": $.id,
			"activeid": ACT_ID,
			"activeId": ACT_ID,
			"token": $.to,
			"authcode": $.authcode
		}
		return new Promise(resolve => {
			$.post(taskUrl("/platform/active/role/marketbuy", body),
				async (err, resp, data) => {
					try {
						if (err) {
							that.log(`${err}`)
							that.log(`${$.name} API请求失败，请检查网路重试`)
						} else {
							if (safeGet(data)) {
								data = JSON.parse(data)
								if (data.code === 0) {
									that.log(`商品兑换成功，获得${data.item[0].itemid === 'JD29' ? '京豆' : '未知奖品'} * ${data.item[0].count}`)
								} else {
									that.log(`任务完成失败，错误信息：${JSON.stringify(data)}`)
								}
							}
						}
					} catch (e) {
						$.logErr(e, resp)
					} finally {
						resolve(data);
					}
				})
		})
	}

	function taskUrl(functionId, body = {}, decrypt = false) {
		return {
			url: `https://jd.moxigame.cn/${functionId}`,
			body: decrypt ? body : JSON.stringify(body),
			headers: {
				'Host': 'jd.moxigame.cn',
				'Connection': 'keep-alive',
				'Content-Type': decrypt ? 'application/x-www-form-urlencoded' : 'application/json',
				'Referer': 'https://game-cdn.moxigame.cn/eliminateJD/index.html?activeId=A_112790_R_1_D_20201028',
				'User-Agent': "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
				'Accept-Language': 'zh-cn',
			}
		}
	}

	function getDailyReward() {
		let headers = {
			'Host': 'api.m.jd.com',
			'accept': '*/*',
			'content-type': 'application/json',
			'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/7.0.20(0x1700142b) NetType/WIFI Language/zh_CN',
			'referer': 'https://servicewechat.com/wx91d27dbf599dff74/499/page-frame.html',
			'accept-language': 'zh-cn',
			'Cookie': cookie
		};
		let body = {
			"platform": 1,
			"unionActId": "31125",
			"actId": "8mCuSXtK1MgxzDTbJEPtYU1AchA",
			"unionShareId": "",
			"type": 1,
			"eid": "DPIFTWTK6N7EEVHNJW3JW7PZDALZNTODNUBBYWQBAYXPAJCH7AMIUEGY7LVCWCRILXXEYOAM5DXZJKY5Y5AZNHQFJI"
		}
		$.get({
			url: `https://api.m.jd.com/api?functionId=getCoupons&appid=u&_=${new Date().getTime()}&loginType=2&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
			headers: headers
		}, (err, resp, data) => {
			that.log(data)
		})
	}

	function jdUrl(functionId, body = '') {
		return {
			url: `https://jdjoy.jd.com/saas/framework/${functionId}`,
			body: body,
			headers: {
				'Host': 'jdjoy.jd.com',
				'accept': '*/*',
				'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
				'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
				'content-type': 'application/x-www-form-urlencoded',
				'Cookie': cookie
			}
		}
	}

	function TotalBean() {
		return new Promise(async resolve => {
			const options = {
				"url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
				"headers": {
					"Accept": "application/json,text/plain, */*",
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept-Language": "zh-cn",
					"Connection": "keep-alive",
					"Cookie": cookie,
					"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
					"User-Agent": "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"
				}
			}
			$.post(options, (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (data) {
							data = JSON.parse(data);
							if (data['retcode'] === 13) {
								$.isLogin = false; //cookie过期
								return
							}
							$.nickName = data['base'].nickname;
						} else {
							that.log(`京东服务器返回空数据`)
						}
					}
				} catch (e) {
					$.logErr(e, resp)
				} finally {
					resolve();
				}
			})
		})
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
	
	function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

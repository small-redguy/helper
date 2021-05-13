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
const notify = $.isNode() ? require("./sendNotify") : "";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const sck = $.isNode() ? "set-cookie" : "Set-Cookie";
let cookiesArr = [],
	cookie = "",
	message;
let minPrize = 10;//设置最小奖励入会京豆值，入会奖励小于这个值的时候，不自动入会

if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item]);
	});
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") that.log = () => {};
} else {
	cookiesArr = [
		$.getdata("CookieJD"),
		$.getdata("CookieJD2"),
		...jsonParse($.getdata("CookiesJD") || "[]").map((item) => item.cookie),
	].filter((item) => !!item);
}
const JD_API_HOST = "https://api.m.jd.com/client.action";
$.rundisCount=0;
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
	await readShopId();
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
		}
	}
})()
.catch((e) => {
		$.log("", `❌ ${$.name}, 失败! 原因: ${e}!`, "");
	})
	.finally(() => {
		that.log("本次运行获得:"+$.rundisCount+"京豆");
		$.done();
	});

function showMsg() {
	return new Promise(resolve => {
		$.log($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
		resolve()
	})
}
async function main() {
	for (var shopId of $.shopIds) {
		await getVenderId(shopId);
		if ($.venderId) {
			await getShopOpenCardInfo(shopId, $.venderId);
			if ($.getShopOpenCardInfo) {
				if ($.getShopOpenCardInfo.result) {
					if ($.getShopOpenCardInfo.result.interestsRuleList) {
						let openCardStatus = $.getShopOpenCardInfo.result.userInfo.openCardStatus;
						let venderCardName = $.getShopOpenCardInfo.result.shopMemberCardInfo.venderCardName;
						let interestsRuleList = $.getShopOpenCardInfo.result.interestsRuleList;
						let disCount = 0;
						let objData = {};
						if (openCardStatus == 0) {
							interestsRuleList.forEach(item => {
								if (item.prizeName === '京豆') {
									disCount = disCount + parseInt(item.discountString);
									objData = item.interestsInfo;
								}
							});
							if (disCount > 0) {
								that.log(venderCardName + "店铺入会有" + disCount + "京豆");
								if (disCount >= minPrize) {
									that.log("去入会");
									await bindWithVender(shopId, $.venderId, objData);
								} else {
									that.log(venderCardName + "只有"+disCount+"个京豆，入会血亏，小于设置的最小领取京豆数，不入会");
								}
							}else{
								that.log(venderCardName + "有奖励，但没有京豆奖励");
							}
						} else {
							that.log(venderCardName + "已经入过会了");
						}
					} else {
						that.log(shopId + "死抠鼻，没奖励");
					}
				} else {
					that.log(shopId + "好像没有入会奖励");
				}
			} else {
				that.log(shopId + "没有获取到开卡信息");
			}
		} else {
			that.log(shopId + "没有获取到店铺信息");
		}
	}
}

function bindWithVender(shopId, venderId, objData = {}) {
	return new Promise((resolve) => {
		let body = JSON.stringify(Object.assign({
				"venderId": venderId,
				"shopId": shopId,
				"bindByVerifyCodeFlag": 1,
				"writeChildFlag": 0,
				"channel": 999,
			},objData));
			let options = {
				url: `https://api.m.jd.com/client.action?appid=jd_shop_member&functionId=bindWithVender&body=${body}&client=H5&clientVersion=9.2.0&uuid=88888&jsonp=jsonp_1619773276633_84888`,
				headers: {
					Cookie: cookie,
					Host: "api.m.jd.com",
					"Referer": `http://shopmember.m.jd.com/shopcard/?venderId=${venderId}&shopId=${shopId}&venderType=0&channel=999&returnUrl=`,
					"Content-Type": "application/x-www-form-urlencoded",
				}
			};
		$.get(options, (err, resp, res) => {
			try {
				$.result = '';
				let datas = res.match(/({[^()]+})/);
				if (datas) {
					let data = datas[0];
					if (data) {
						data = $.toObj(data);
						if (data) {
							$.result = data.message
							that.log("店铺Id:" + shopId + ",入会结果：" + $.result);
							let giftList = data.result.giftInfo.giftList;
							if (giftList) {
								let disCount = 0;
								giftList.forEach(item => {
									if (item.prizeName === '京豆') {
										disCount = disCount + parseInt(item
											.discountString);
									} else if (item.prizeType == 4) {
										disCount = disCount + parseInt(item
										.discountString);
									}
								});
								$.rundisCount=$.rundisCount+disCount;
							}
						}
					}
				}
			} catch (e) {
				that.log(e);
			} finally {
				resolve(res);
			}
		})
	});
}


function getVenderId(shopId) {
	return new Promise((resolve) => {
		let options = {
			url: `https://chat1.jd.com/api/checkChat?callback=jQuery83802712&shopId=${shopId}&_=${+new Date()}`,
			headers: {
				'Cookie': cookie,
				"host": "chat1.jd.com",
				"content-type": "application/x-www-form-urlencoded",
				"Referer": `https://mall.jd.com/shopBrandMember-${shopId}.html`,
				"User-Agent": 'jdapp;iPhone;9.5.0;'
			}
		};
		$.get(options, (err, resp, res) => {
			$.venderId = '';
			try {
				let datas = res.match(/({[^()]+})/);
				if (datas) {
					let data = datas[0];
					if (data) {
						data = $.toObj(data);
						if (data) {
							$.venderId = data.venderId;
						}
					}
				}
			} catch (e) {
				that.log(e);
			} finally {
				resolve($.venderId);
			}
		})
	});
}

function getShopOpenCardInfo(shopId, venderId) {
	return new Promise((resolve) => {
		let options = {
			url: "http://api.m.jd.com/client.action?appid=jd_shop_member&functionId=getShopOpenCardInfo&body=%7B%22venderId%22%3A%22" +
				venderId +
				"%22%2C%22channel%22%3A999%7D&client=&clientVersion=9.2.0&uuid=88888&jsonp=jsonp_59378",
			headers: {
				Cookie: cookie,
				Host: "api.m.jd.com",
				"Referer": `http://shopmember.m.jd.com/shopcard/?venderId=${venderId}&shopId=${shopId}&venderType=0&channel=999&returnUrl=`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
		};
		$.get(options, (err, resp, res) => {
			$.getShopOpenCardInfo = '';
			try {
				let datas = res.match(/({[^()]+})/);
				if (datas) {
					let data = datas[0];
					if (data) {
						data = $.toObj(data);
						if (data) {
							$.getShopOpenCardInfo = data;
						}
					}
				}
			} catch (e) {
				that.log(e);
			} finally {
				resolve($.getShopOpenCardInfo);
			}
		})
	});
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
			$.msg($.name, "", "不要在BoxJS手动复制粘贴修改cookie");
			return [];
		}
	}
}

function readShopId() {
	return new Promise((resolve) => {
		$.get({
			url: 'https://ghproxy.com/https://raw.githubusercontent.com/small-redguy/helper/main/static/ydShopId.txt'
		}, (err, resp, data) => {
			try {
				$.shopIds = [];
				if (data) {
					data = data + '';
					let shopIdstr = data.split('\n');
					for (let shopId of shopIdstr) {
						$.shopIds.push(shopId.trim());
					}
					that.log('获取店铺数据成功，一共获取到' + $.shopIds.length + '条数据');
				} else {
					that.log(`获取店铺数据失败`)
				}
			} catch (e) {
				that.log(e);
			} finally {
				resolve(data);
			}
		})
	});
}

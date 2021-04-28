
const JD_API_HOST = 'https://api.m.jd.com/';

const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', message = '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

$.linkId="";
$.linkIds=["CKKfDuj5ere8P1EUy_lC0g","jOkIZzWCgGa9NfPuHBSx1A"];
!(async () => {
    
    if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
    for(var index=0;index<$.linkIds.length;index++){
        $.linkId=$.linkIds[index];
        that.log("当前linkId："+$.linkId);
         for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      await spring_reward_query();
			if ($.data) {
				that.log("当前剩余次数:" + $.data.remainChance);
				if ($.data.remainChance) {
					for (var j = 0; j < $.data.remainChance; j++) {
						await spring_reward_receive();
						await $.wait(2000);
						if ($.reward) {
							if ($.reward.prizeType == 1) {
								that.log("获得优惠券:" + $.reward.prizeDesc + '，面值:' + $.reward.amount + "，满" + $.reward.useLimit + "可用");
							} else if ($.reward.prizeType == 4) {
								that.log("获得现金:" + $.reward.amount + '，描述:' + $.reward.prizeDesc);
							} else {
								that.log("获得" + $.reward.prizeDesc + "，面值:" + $.reward.amount);
							}
						}
					}
				}
			}
			await spring_reward_list();
			if ($.list) {
				for (var item of $.list) {
					if (item.state == 0 && item.prizeType == 4) {
						that.log("有" + item.amount + "现金没有提现，尝试提现中");
						await apCashWithDraw(item);
						await $.wait(1000);
					}
				}
			}
    }
  }
    }
			
		})()
		.catch((e) => {
				$.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
			})
			.finally(() => {
				$.done();
			})

	function spring_reward_receive() {
		return new Promise((resolve) => {
			$.get(taskUrl("spring_reward_receive", {
				"linkId": $.linkId,
				"inviter": "UhBiP5ZPaM28-O0MOaGu2g"
			}), (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.code === 0) {
								$.reward = data.data.received;
							} else {
							that.log(JSON.stringify(data));
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

	function spring_reward_query() {
		return new Promise((resolve) => {
			$.get(taskUrl("spring_reward_query", {
				"linkId": $.linkId,
				"inviter": "UhBiP5ZPaM28-O0MOaGu2g"
			}), (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.code === 0) {
								$.data = data.data;
							} else {
							that.log(JSON.stringify(data));
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

	function spring_reward_list() {
		return new Promise((resolve) => {
			$.get(taskUrl("spring_reward_list", {
				"pageNum": 1,
				"pageSize": 10,
				"linkId": $.linkId,
				"inviter": "UhBiP5ZPaM28-O0MOaGu2g"
			}), (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.code === 0) {
								$.list = data.data.items;
							} else {
							that.log(JSON.stringify(data));
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

	function apCashWithDraw(item) {
		console.log(item);
		return new Promise((resolve) => {
			$.post(taskUrlPost("apCashWithDraw", {
				"businessSource": "SPRING_FESTIVAL_RED_ENVELOPE",
				"base": {
					"id": item.id,
					"business": "",
					"poolBaseId": item.poolBaseId,
					"prizeGroupId": item.prizeGroupId,
					"prizeBaseId": item.prizeBaseId,
					"prizeType": 4
				},
				"linkId": $.linkId,
				"inviter": "UhBiP5ZPaM28-O0MOaGu2g"
			}), (err, resp, data) => {
				try {
					if (err) {
						that.log(`${JSON.stringify(err)}`)
						that.log(`${$.name} API请求失败，请检查网路重试`)
					} else {
						if (safeGet(data)) {
							data = JSON.parse(data);
							if (data.code === 0) {
								that.log(JSON.stringify(data.data));
								//that.log("如果提示null，请手动去提现一次(绑定微信)");
							} else {
									that.log(JSON.stringify(data));
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

	function taskUrl(functionId, body = {}) {
		return {
			url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=activities_platform&_t=${new Date().getTime()}`,
			headers: {
				'Cookie': cookie,
				'Host': 'api.m.jd.com',
				'Connection': 'keep-alive',
				'Content-Type': 'application/json',
				'Referer': 'https://prodev.m.jd.com/jdlite/active/31U4T6S4PbcK83HyLPioeCWrD63j/index.html?channel=qqh5fx&inviter=UhBiP5ZPaM28-O0MOaGu2g&utm_user=plusmember&ad_od=share&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1000217905_&utm_term=2555319d90df4c66b502437958986790',
				'User-Agent': "jdltapp;android;3.1.0;9;",
				'Accept-Language': 'zh-cn',
			}
		}
	}

	function taskUrlPost(functionId, body = {}) {
		return {
			url: `${JD_API_HOST}`,
			body: `functionId=${functionId}&body=${escape(JSON.stringify(body))}&appid=activities_platform&_t=${new Date().getTime()}`,
			headers: {
				'Cookie': cookie,
				'Host': 'api.m.jd.com',
				'Connection': 'keep-alive',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Referer': 'https://prodev.m.jd.com/jdlite/active/31U4T6S4PbcK83HyLPioeCWrD63j/index.html?channel=qqh5fx&inviter=UhBiP5ZPaM28-O0MOaGu2g&utm_user=plusmember&ad_od=share&cu=true&utm_source=kong&utm_medium=jingfen&utm_campaign=t_1000217905_&utm_term=2555319d90df4c66b502437958986790',
				'User-Agent': "jdltapp;android;3.1.0;9;",
				'Accept-Language': 'zh-cn',
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
	
	function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
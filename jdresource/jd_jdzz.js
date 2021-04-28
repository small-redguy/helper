const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let helpAuthor=true; // 帮助作者
const randomCount = $.isNode() ? 0 : 5;
let jdNotify = true; // 是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const inviteCodes = [
]
!(async () => {
  $.tuanList = []
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat()
      await jdWish()
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.canHelp = true
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      await getUserTuanInfo()
      await getHelpTuan();
      for (let j = 0; j < $.tuanList.length; ++j) {
        await helpFriendTuan($.tuanList[j])
        if(!$.canHelp) break
      }
      await setHelpTuan();
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdWish() {
  $.bean = 0
  $.tuan = null
  $.hasOpen = false
  await getTaskList(true)
  await getUserTuanInfo()
  if (!$.tuan) {
    await openTuan()
    if ($.hasOpen) await getUserTuanInfo()
  }
  if ($.tuan) $.tuanList.push($.tuan)
  await helpFriends()
  await getUserInfo()
  $.nowBean = parseInt($.totalBeanNum)
  $.nowNum = parseInt($.totalNum)
  for (let i = 0; i < $.taskList.length; ++i) {
    let task = $.taskList[i]
    if (task['taskId'] === 1 && task['status'] !== 2) {
      that.log(`去做任务：${task.taskName}`)
      await doTask({"taskId": task['taskId'],"mpVersion":"3.4.0"})
    } else if (task['taskId'] !== 3 && task['status'] !== 2) {
      that.log(`去做任务：${task.taskName}`)
      if(task['itemId'])
        await doTask({"itemId":task['itemId'],"taskId":task['taskId'],"mpVersion":"3.4.0"})
      else
        await doTask({"taskId": task['taskId'],"mpVersion":"3.4.0"})
      await $.wait(3000)
    }
  }
  await getTaskList();
  await showMsg();
}

function showMsg() {
  return new Promise(async resolve => {
    message += `本次获得${parseInt($.totalBeanNum) - $.nowBean}京豆，${parseInt($.totalNum) - $.nowNum}金币\n`
    message += `累计获得${$.totalBeanNum}京豆，${$.totalNum}金币\n可兑换${$.totalNum / 10000}元无门槛红包`
    if (parseInt($.totalBeanNum) - $.nowBean > 0) {
      $.msg($.name, '', `京东账号${$.index} ${$.nickName}\n${message}`);
    } else {
      $.log(message)
    }
    // 云端大于10元无门槛红包时进行通知推送
    if ($.isNode() && $.totalNum >= 1000000) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index} ${$.nickName}\n当前金币：${$.totalNum}个\n可兑换无门槛红包：${parseInt($.totalNum) / 10000}元\n`,)
    resolve();
  })
}
// function getAuthorShareCode(url) {
//   return new Promise(resolve => {
//     $.get({url: `${url}?${new Date()}`,
//       headers:{
//         "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
//       }}, async (err, resp, data) => {
//       try {
//         if (err) {
//         } else {
//           $.tuanList = $.tuanList.concat(JSON.parse(data))
//           that.log(`作者助力码获取成功`)
//         }
//       } catch (e) {
//         $.logErr(e, resp)
//       } finally {
//         resolve();
//       }
//     })
//   })
// }
function helpFriendTuan(body) {
  return new Promise(resolve => {
    $.get(taskTuanUrl("vvipclub_distributeBean_assist", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.success) {
              that.log('助力成功')
            } else {
              if (data.resultCode === '9200008') that.log('不能助力自己')
              else if (data.resultCode === '9200011') that.log('已经助力过')
              else if (data.resultCode === '2400205') that.log('团已满')
              else if (data.resultCode === '2400203') {that.log('助力次数已耗尽');$.canHelp = false}
              else that.log(`未知错误`)
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

function getUserTuanInfo() {
  let body = {"paramData": {"channel": "FISSION_BEAN"}}
  return new Promise(resolve => {
    $.get(taskTuanUrl("distributeBeanActivityInfo", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data && !data.data.canStartNewAssist) {
              $.tuan = {
                "activityIdEncrypted": data.data.id,
                "assistStartRecordId": data.data.assistStartRecordId,
                "assistedPinEncrypted": data.data.encPin,
                "channel": "FISSION_BEAN"
              }
              $.tuanActId = data.data.id
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

function openTuan() {
  let body = {"activityIdEncrypted": $.tuanActId, "channel": "FISSION_BEAN"}
  return new Promise(resolve => {
    $.get(taskTuanUrl("vvipclub_distributeBean_startAssist", body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['success']) {
              $.hasOpen = true
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

function getUserInfo() {
  return new Promise(resolve => {
    $.get(taskUrl("interactIndex"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data.data.shareTaskRes) {
            //   that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data.data.shareTaskRes.itemId}\n`);
            // } else {
            //   that.log(`\n\n已满5人助力或助力功能已下线,故暂时无${$.name}好友助力码\n\n`)
            // }
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

function getTaskList(flag = false) {
  return new Promise(resolve => {
    $.get(taskUrl("interactTaskIndex"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.taskList = data.data.taskDetailResList
            $.totalNum = data.data.totalNum
            $.totalBeanNum = data.data.totalBeanNum
            if (flag && $.taskList.filter(item => !!item && item['taskId']=== 3) && $.taskList.filter(item => !!item && item['taskId']=== 3).length) {
                 $.shareId=$.taskList.filter(item => !!item && item['taskId']=== 3)[0]['itemId'];
              that.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${$.taskList.filter(item => !!item && item['taskId']=== 3)[0]['itemId']}\n`);
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

// 完成
function doTask(body, func = "doInteractTask") {
  // that.log(taskUrl("doInteractTask", body))
  return new Promise(resolve => {
    $.get(taskUrl(func, body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // that.log(data)
            if (func === "doInteractTask") {
              if (data.subCode === "S000") {
                that.log(`任务完成，获得 ${data.data.taskDetailResList[0].incomeAmountConf} 金币，${data.data.taskDetailResList[0].beanNum} 京豆`)
                $.bean += parseInt(data.data.taskDetailResList[0].beanNum)
              } else {
                that.log(`任务失败，错误信息：${data.message}`)
              }
            } else {
              that.log(`${data.data.helpResDesc}`)
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

async function helpFriends() {
    await getHelp();
  for (let code of $.newShareCodes) {
    if (!code) continue
    await doTask({"itemId": code, "taskId": "3", "mpVersion": "3.4.0"}, "doHelpTask")
  }
  await setHelp();
}
// function readShareCode() {
//   that.log(`开始`)
//   return new Promise(async resolve => {
//     $.get({url: `https://code.chiang.fun/api/v1/jd/jdzz/read/${randomCount}/`, 'timeout': 10000}, (err, resp, data) => {
//       try {
//         if (err) {
//           that.log(`${JSON.stringify(err)}`)
//           that.log(`${$.name} API请求失败，请检查网路重试`)
//         } else {
//           if (data) {
//             that.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
//             data = JSON.parse(data);
//           }
//         }
//       } catch (e) {
//         $.logErr(e, resp)
//       } finally {
//         resolve(data);
//       }
//     })
//     await $.wait(10000);
//     resolve()
//   })
// }
function getHelp() {
		$.newShareCodes = [];
		return new Promise(resolve => {
			$.get({
				url: "http://api.tyh52.com/act/get/jdzz/3"
			}, (err, resp, data) => {
				try {
					if (data) {
						data = JSON.parse(data);
						if (data.code == 1) {
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
					url: "http://api.tyh52.com/act/set/jdzz/" + $.shareId
				}, (err, resp, data) => {
					try {
						if (data) {
							data = JSON.parse(data);
							if (data.code == 1) {
								that.log("提交自己的邀請碼成功");
							} else {
								that.log("提交邀请码失败，" + data.message);
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
	
	function getHelpTuan() {
		$.tuanList = [];
		return new Promise(resolve => {
			$.get({
				url: "http://api.tyh52.com/act/get/jdzzTuan/3"
			}, (err, resp, data) => {
				try {
					if (data) {
						data = JSON.parse(data);
						if (data.code == 1) {
							let list = data.data;
							if (!(list instanceof Array)) {
								list = JSON.parse(list);
							}
							if (list.length > 0) {
								for (var item of list) {
								    let its=item.split('@');
								    if(its.length==2){
								        let  tuan={
                                            "activityIdEncrypted": $.tuanActId,
                                            "assistStartRecordId": its[0],
                                            "assistedPinEncrypted": its[1],
                                            "channel": "FISSION_BEAN"
                                        }
									    $.tuanList.push(tuan);
								    }
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

	function setHelpTuan() {
		return new Promise(resolve => {
			if ($.tuan) {
				$.get({
					url: "http://api.tyh52.com/act/set/jdzzTuan/" + $.tuan.assistStartRecordId+'@'+$.tuan.assistedPinEncrypted
				}, (err, resp, data) => {
					try {
						if (data) {
						    that.log(data);
							data = JSON.parse(data);
							if (data.code == 1) {
								that.log("提交自己的开团碼成功");
							}else{
							    that.log("提交开团码失败，" + data.message);
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
    //   $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
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
      if (process.env.JDZZ_SHARECODES) {
        if (process.env.JDZZ_SHARECODES.indexOf('\n') > -1) {
          shareCodes = process.env.JDZZ_SHARECODES.split('\n');
        } else {
          shareCodes = process.env.JDZZ_SHARECODES.split('&');
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

function taskUrl(functionId, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${functionId}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=9.1.0`,
    headers: {
      'Cookie': cookie,
      'Host': 'api.m.jd.com',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'http://wq.jd.com/wxapp/pages/hd-interaction/index/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}

function taskTuanUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=swat_miniprogram&osVersion=5.0.0&clientVersion=3.1.3&fromType=wxapp&timestamp=${new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000}`,
    headers: {
      "Accept": "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Host": "api.m.jd.com",
      "Referer": "https://servicewechat.com/wxa5bf5ee667d91626/108/page-frame.html",
      "Cookie": cookie,
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    }
  }
}

function taskPostUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}`,
    body: body,
    headers: {
      "Cookie": cookie,
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
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
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
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
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
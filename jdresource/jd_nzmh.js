const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
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

!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      $.beans = 0
      message = '';
      await TotalBean();
      that.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : ""}`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      try {
        await jdMh('https://anmp.jd.com/babelDiy/Zeus/2x3yeXUmPbFVCAoXKQqSrdrQuoBk/index.html')
        // await jdMh('https://anmp.jd.com/babelDiy/Zeus/gY7ymUmC8ZM74Zw3woiDDQU1naT/index.html?wxAppName=jd')
        // await jdMh('https://anmp.jd.com/babelDiy/Zeus/3UGPT8RMBu4kL2YAYN98MgkcDhRq/index.html?wxAppName=jd')
        // await jdMh('https://anmp.jd.com/babelDiy/Zeus/yiNQjMxQvs3R3SdS4nwa2MFk1FE/index.html?wxAppName=jd')
      } catch (e) {
        $.logErr(e)
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

async function jdMh(url) {
  try {
    await getInfo(url)
    await getUserInfo()
    await draw()
    while ($.userInfo.bless >= $.userInfo.cost_bless_one_time) {
      await draw()
      await getUserInfo()
      await $.wait(500)
    }
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得${$.beans}京豆`
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    resolve()
  })
}

function getInfo(url = 'https://anmp.jd.com/babelDiy/Zeus/3DSHPs2xC66RgcCEB8YVLsudqfh5/index.html?wxAppName=jd') {
  that.log(`url:${url}`)
  return new Promise(resolve => {
    $.get({
      url,
      headers: {
        Cookie: cookie
      }
    }, (err, resp, data) => {
      try {
        $.info = JSON.parse(data.match(/var snsConfig = (.*)/)[1])
        $.prize = JSON.parse($.info.prize)
        resolve()
      } catch (e) {
        that.log(e)
      }
    })
  })
}

function getUserInfo() {
  return new Promise(resolve => {
    $.get(taskUrl('query'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.userInfo = JSON.parse(data.match(/query\((.*)\n/)[1]).data
          // that.log(`您的好友助力码为${$.userInfo.shareid}`)
          that.log(`当前幸运值：${$.userInfo.bless}`)
          for (let task of $.info.config.tasks) {
            if (!$.userInfo.complete_task_list.includes(task['_id'])) {
              that.log(`去做任务${task['_id']}`)
              await doTask(task['_id'])
              await $.wait(500)
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

function doTask(taskId) {
  let body = `task_bless=10&taskid=${taskId}`
  return new Promise(resolve => {
    $.get(taskUrl('completeTask', body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data.match(/query\((.*)\n/)[1])
          if (data.data.complete_task_list.includes(taskId)) {
            that.log(`任务完成成功，当前幸运值${data.data.curbless}`)
            $.userInfo.bless = data.data.curbless
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

function draw() {
  return new Promise(resolve => {
    $.get(taskUrl('draw'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${err},${jsonParse(resp.body)['message']}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data.match(/query\((.*)\n/)[1])
          if (data.data && data.data.drawflag) {
            if ($.prize.filter(vo => vo.prizeLevel === data.data.level).length > 0) {
              that.log(`获得${$.prize.filter(vo => vo.prizeLevel === data.data.level)[0].prizename}`)
              $.beans += $.prize.filter(vo => vo.prizeLevel === data.data.level)[0].beansPerNum
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

function taskUrl(function_id, body = '') {
  body = `activeid=${$.info.activeId}&token=${$.info.actToken}&sceneval=2&shareid=&_=${new Date().getTime()}&callback=query&${body}`
  return {
    url: `https://wq.jd.com/activet2/piggybank/${function_id}?${body}`,
    headers: {
      'Host': 'wq.jd.com',
      'Accept': 'application/json',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/json;charset=utf-8',
      'Origin': 'wq.jd.com',
      'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'Referer': `https://anmp.jd.com/babelDiy/Zeus/xKACpgVjVJM7zPKbd5AGCij5yV9/index.html?wxAppName=jd`,
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
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")
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
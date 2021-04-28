const JD_API_HOST = 'https://wq.jd.com/';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.tokens = JSON.parse($.getdata('jx_tokens') || '[]');
$.showLog = $.getdata('nc_showLog') ? $.getdata('nc_showLog') === 'true' : false;
$.openUrl = `openjd://virtual?params=${encodeURIComponent(
  '{ "category": "jump", "des": "m", "url": "https://wqsh.jd.com/sns/201912/12/jxnc/detail.html?ptag=7155.9.32&smp=b47f4790d7b2a024e75279f55f6249b9&active=jdnc_1_chelizi1205_2"}',
)}`;
$.result = [];
$.cookieArr = [];
$.currentCookie = '';
$.currentToken = {};
$.allTask = [];
$.info = {};
$.answer = 0;
$.helpTask = null;
$.drip = 0;

!(async () => {
  if (!getCookies()) return;
  for (let i = 0; i < $.cookieArr.length; i++) {
    $.currentCookie = $.cookieArr[i];
    $.currentToken = $.tokens[i] || {};
    $.drip = 0;
    if ($.currentCookie) {
      const userName = decodeURIComponent(
        $.currentCookie.match(/pt_pin=(.+?);/) && $.currentCookie.match(/pt_pin=(.+?);/)[1],
      );
      $.log(`\n开始【京东账号${i + 1}】${userName}`);
      $.result.push(`【京东账号${i + 1}】${userName}`);
      const startInfo = await getTaskList();
      if (!startInfo) break;
      await $.wait(500);
      const isOk = await browserTask();
      if (!isOk) break;
      await $.wait(500);
      await answerTask();
      await $.wait(500);
      const endInfo = await getTaskList();
      getMessage(endInfo, startInfo);
      await submitInviteId(userName);
      await $.wait(500);
      //await createAssistUser();
    }
  }
  await showMsg();
})()
  .catch(e => $.logErr(e))
  .finally(() => $.done());

function getCookies() {
  if ($.isNode()) {
    $.cookieArr = Object.values(jdCookieNode);
  } else {
    const CookiesJd = JSON.parse($.getdata("CookiesJD") || "[]").filter(x => !!x).map(x => x.cookie);
    $.cookieArr = [$.getdata("CookieJD") || "", $.getdata("CookieJD2") || "", ...CookiesJd].filter(x=>!!x);
  }
  if (!$.cookieArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
      'open-url': 'https://bean.m.jd.com/',
    });
    return false;
  }
  return true;
}

function getMessage(endInfo) {
  const need = endInfo.target - endInfo.score;
  const get = $.drip;
  $.result.push(
    `【水果名称】${endInfo.prizename}`,
    `【水滴】获得水滴${get} 还需水滴${need}`
  );
  if (get > 0) {
    const max = parseInt(need / get);
    const min = parseInt(need / (get + $.helpTask.limit * $.helpTask.eachtimeget));
    $.result.push(`【预测】还需 ${min} ~ ${max} 天`);
  }
}

function getTaskList() {
  return new Promise(async resolve => {
    $.get(taskUrl('query', `type=1`), async (err, resp, data) => {
      try {
        const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
        const { detail, msg, task = [], retmsg, ...other } = JSON.parse(res);
        $.helpTask = task.filter(x => x.tasktype === 2)[0] || { eachtimeget: 0, limit: 0 };
        $.allTask = task.filter(x => x.tasktype !== 3 && x.tasktype !== 2 && parseInt(x.left) > 0);
        $.info = other;
        $.log(`\n获取任务列表 ${retmsg} 总共${$.allTask.length}个任务！`);
        if (!$.info.active) {
          $.msg($.name, '请先去京喜农场选择种子！', '选择app专属种子时，请参考脚本头部说明获取token，点击通知跳转', { 'open-url': $.openUrl });
          resolve(false);
        }
        resolve(other);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(true);
      }
    });
  });
}

function  browserTask() {
  return new Promise(async resolve => {
    const tasks = $.allTask.filter(x => x.tasklevel !== 6);
    const times = Math.max(...[...tasks].map(x => x.limit));
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      $.log(`\n开始第${i + 1}个任务：${task.taskname}`);
      const status = [0];
      for (let i = 0; i < times; i++) {
        const random = Math.random() * 3;
        await $.wait(random * 1000);
        if (status[0] === 0) {
          status[0] = await doTask(task);
        }
        if (status[0] !== 0) {
          break;
        }
      }
      if (status[0] === 1032) {
        $.msg($.name, '请参考脚本头部说明获取token', '或者改中非app专属种子，点击通知跳转', { 'open-url': $.openUrl });
        resolve(false);
        return;
      }
      $.log(`\n结束第${i + 1}个任务：${task.taskname}\n`);
    }
    resolve(true);
  });
}

function answerTask() {
  const _answerTask = $.allTask.filter(x => x.tasklevel === 6);
  if (!_answerTask || !_answerTask[0]) return;
  const { tasklevel, left, taskname, eachtimeget } = _answerTask[0];
  return new Promise(async resolve => {
    if (parseInt(left) <= 0) {
      resolve(false);
      $.log(`\n${taskname}[做任务]： 任务已完成，跳过`);
      return;
    }
    $.get(
      taskUrl(
        'dotask',
        `active=${$.info.active}&answer=${$.info.indexday}:${['A', 'B', 'C', 'D'][$.answer]}:0&joinnum=${
          $.info.joinnum
        }&tasklevel=${tasklevel}&_stk=active%2Canswer%2Cch%2Cfarm_jstoken%2Cjoinnum%2Cphoneid%2Ctasklevel%2Ctimestamp`,
      ),
      async (err, resp, data) => {
        try {
          const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
          let { ret, retmsg, right } = JSON.parse(res);
          retmsg = retmsg !== '' ? retmsg : 'success';
          $.log(
            `\n${taskname}[做任务]：${retmsg.indexOf('活动太火爆了') !== -1 ? '任务进行中或者未到任务时间' : retmsg}${
              $.showLog ? '\n' + res : ''
            }`,
          );
          if (ret === 0 && right === 1) {
            $.drip += eachtimeget;
          }
          if (((ret !== 0 && ret !== 1029) || retmsg === 'ans err') && $.answer < 4) {
            $.answer++;
            await $.wait(1000);
            await answerTask();
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      },
    );
  });
}

function doTask({ tasklevel, left, taskname, eachtimeget }) {
  return new Promise(async resolve => {
    if (parseInt(left) <= 0) {
      resolve(false);
      $.log(`\n${taskname}[做任务]： 任务已完成，跳过`);
      return;
    }
    $.get(
      taskUrl(
        'dotask',
        `active=${$.info.active}&answer=${$.info.indexday}:D:0&joinnum=${$.info.joinnum}&tasklevel=${tasklevel}&_stk=active%2Canswer%2Cch%2Cfarm_jstoken%2Cjoinnum%2Cphoneid%2Ctasklevel%2Ctimestamp`,
      ),
      (err, resp, data) => {
        try {
          const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
          let { ret, retmsg } = JSON.parse(res);
          retmsg = retmsg !== '' ? retmsg : 'success';
          $.log(
            `\n${taskname}[做任务]：${retmsg.indexOf('活动太火爆了') !== -1 ? '任务进行中或者未到任务时间' : retmsg}${
              $.showLog ? '\n' + res : ''
            }`,
          );
          if (ret === 0) {
            $.drip += eachtimeget;
          }
          resolve(ret);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      },
    );
  });
}

function submitInviteId(userName) {
  return new Promise(resolve => {
    if (!$.info || !$.info.smp) {
      resolve();
      return;
    }
    $.log(`\n你的互助码: ${$.info.smp}`);
    $.log(`你的活动id: ${$.info.active}`);
    $.post(
      {
        url: `https://api.ninesix.cc/api/jx-nc/${$.info.smp}/${encodeURIComponent(userName)}?active=${$.info.active}&joinnum=${$.info.joinnum}`,
      },
      (err, resp, _data) => {
        try {
          const { code, data = {} } = JSON.parse(_data);
          $.log(`\n邀请码提交：${code}\n${$.showLog ? _data : ''}`);
          if (data.value) {
            $.result.push('【邀请码】提交成功！');
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      },
    );
  });
}

function createAssistUser() {
  return new Promise(resolve => {
    $.get({ url: `https://api.ninesix.cc/api/jx-nc?active=${$.info.active}` }, async (err, resp, _data) => {
      try {
        const { code, data: { value, extra = {} } = {} } = JSON.parse(_data);
        $.log(`\n获取随机助力码${code}\n${$.showLog ? _data : ''}`);
        if (!value) {
          $.result.push('获取助力码失败，请稍后再次手动执行脚本！');
          resolve();
          return;
        }
        $.get(
          taskUrl('help', `active=${extra.active}&joinnum=${extra.joinnum}&smp=${value}`),
          async (err, resp, data) => {
            try {
              const res = data.match(/try\{whyour\(([\s\S]*)\)\;\}catch\(e\)\{\}/)[1];
              const { ret, retmsg = '' } = JSON.parse(res);
              $.log(`\n助力：${retmsg} \n${$.showLog ? res : ''}`);
              if (ret === 0) {
                await createAssistUser();
              }
            } catch (e) {
              $.logErr(e, resp);
            } finally {
              resolve();
            }
          },
        );
      } catch (e) {
        $.logErr(e, resp);
        resolve();
      }
    });
  });
}

function showMsg() {
  return new Promise(resolve => {
    $.msg($.name, '', `\n${$.result.join('\n')}`);
    resolve();
  });
}

function taskUrl(function_path, body) {
  return {
    url: `${JD_API_HOST}cubeactive/farm/${function_path}?${body}&farm_jstoken=${
      $.currentToken['farm_jstoken']
    }&phoneid=${$.currentToken['phoneid']}&timestamp=${
      $.currentToken['timestamp']
    }&sceneval=2&g_login_type=1&callback=whyour&_=${Date.now()}&g_ty=ls`,
    headers: {
      Cookie: $.currentCookie,
      Accept: `*/*`,
      Connection: `keep-alive`,
      Referer: `https://st.jingxi.com/pingou/dream_factory/index.html`,
      'Accept-Encoding': `gzip, deflate, br`,
      Host: `wq.jd.com`,
      'Accept-Language': `zh-cn`,
    },
  };
}
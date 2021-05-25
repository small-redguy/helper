
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '',secretp = '',shareCodeList = [];

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {
  };
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
let merge;

const JD_API_HOST = `https://api.m.jd.com/client.action?functionId=`;
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }

  for (let i = 0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      if (i) that.log(`\n***************开始京东账号${i + 1}***************`)
      initial();
      await  QueryJDUserInfo();
      if (!merge.enabled)  //cookie不可用
      {
        $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        $.msg($.name, `【提示】京东账号${i ? i + 1 : "" } cookie已过期！请先获取cookie\n直接使用NobyDa的京东签到获取`, 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
        continue;
      }
      that.log('\n\n京东账号：'+merge.nickname + ' 任务开始')
      await zoo_pk_getHomeData();
      await zoo_getHomeData();
      //await qryCompositeMaterials()
      await msgShow();
      //break;
    }
  }
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())

//获取昵称（直接用，勿删）
function QueryJDUserInfo(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
        headers : {
          'Referer' : `https://wqs.jd.com/my/iserinfo.html`,
          'Cookie' : cookie
        }
      }
      $.get(url, (err, resp, data) => {
        try {
          data = JSON.parse(data);
          if (data.retcode === 13) {
            merge.enabled = false
            return
          }
         // merge.nickname = data.base.nickname;
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//查询任务 "appSign":"2","channel":1,
function zoo_getTaskDetail(shopSign = "",appSign = "",timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      appSign = appSign&&'"appSign":"2","channel":1,'
      let url = {
        url : `${JD_API_HOST}zoo_getTaskDetail`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getTaskDetail&body={${appSign}"shopSign":"${shopSign}"}&client=wh5&clientVersion=1.0.0`
      }
      //if (shopSign) {
        //that.log(shopSign)
      //  url.url = url.url.replace('zoo_getTaskDetail','zoo_shopLotteryInfo')
      //  url.body = url.body.replace('zoo_getTaskDetail','zoo_shopLotteryInfo')
      //}
      $.post(url, async (err, resp, data) => {
        try {
          //that.log('zoo_getTaskDetail:' + data)
          data = JSON.parse(data);
          if (shopSign === "") {
            shopSign = '""'
            if (appSign === "" && data.data.result) that.log(`您的个人助力码：${data.data.result.inviteId}`)
          }
          if (!data.data.result) return
          for (let i = 0;i < data.data.result.taskVos.length;i ++) {
            //if (merge.black)  return ;
            that.log( "\n" + data.data.result.taskVos[i].taskType + '-' + data.data.result.taskVos[i].taskName + (appSign&&"（微信小程序）") + '-'  +  (data.data.result.taskVos[i].status === 1 ? `已完成${data.data.result.taskVos[i].times}-未完成${data.data.result.taskVos[i].maxTimes}` : "全部已完成")  )
            if ([1,3,5,7,9,26].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1 ) {
              let list = data.data.result.taskVos[i].brandMemberVos||data.data.result.taskVos[i].followShopVo||data.data.result.taskVos[i].shoppingActivityVos||data.data.result.taskVos[i].browseShopVo
              //that.log(list)
              //if (data.data.result.taskVos[i].taskType === 9) continue
              for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
                //body : `functionId=zoo_collectProduceScore&body={"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"xAX3mMUyCgH120XCrQXIZUw==\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.1.3\\",\\"sceneid\\":\\"homePageh5\\"},\\"businessData\\":{\\"taskId\\":\\"collectProducedCoin\\",\\"rnd\\":\\"${rnd}\\",\\"inviteId\\":\\"-1\\",\\"stealId\\":\\"-1\\"},\\"secretp\\":\\"${secretp}\\"}"}&client=wh5&clientVersion=1.0.0`
                for (let j in list) {
                  if (list[j].status === 1) {
                    let rnd = Math.round(Math.random()*1e6)
                    let nonstr = randomWord(false,10)
                    let time = Date.now()
                    let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
                    let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
                    let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase() //,\"random\":\"${rnd}\"
                    let taskBody = `functionId=zoo_collectScore&body={"taskId":${data.data.result.taskVos[i].taskId},"taskToken" : "${list[j].taskToken}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","itemId":"${list[j].itemId}","actionType":1,"shopSign":${shopSign}}&client=wh5&clientVersion=1.0.0`
                    //that.log(taskBody)
                    that.log("\n"+(list[j].title||list[j].shopName))
                    await zoo_collectScore(taskBody,2000)
                    //}
                    list[j].status = 2;
                    break;
                  } else {
                    continue;
                  }
                }
              }
            }

            if ([12,13].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1) {
              //let  taskBody = `functionId=zoo_collectScore&body={"taskId":${data.data.result.taskVos[i].taskId},"itemId":"1","ss":"{\\"extraData\\":{},\\"businessData\\":{},\\"secretp\\":\\"${secretp}\\"}","shopSign":${shopSign}}&client=wh5&clientVersion=1.0.0`
              for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
                let rnd = Math.round(Math.random()*1e6)
                let nonstr = randomWord(false,10)
                let time = Date.now()
                let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
                let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
                let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()
                //let taskBody = `functionId=zoo_collectScore&body={"taskId":${data.data.result.taskVos[i].taskId},"itemId":"1","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.1.3\\",\\"sceneid\\":\\"homePageh5\\"},\\"businessData\\":{\\"taskId\\":\\"${data.data.result.taskVos[i].taskId}\\",\\"rnd\\":\\"${rnd}\\",\\"inviteId\\":\\"-1\\",\\"stealId\\":\\"-1\\"},\\"secretp\\":\\"${secretp}\\"}","actionType":"1","shopSign":${shopSign}}&client=wh5&clientVersion=1.0.0`
                let taskBody = `functionId=zoo_collectScore&body={"taskId":${data.data.result.taskVos[i].taskId},"taskToken" : "${list[j].taskToken}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","itemId":"1","actionType":1,"shopSign":${shopSign}}&client=wh5&clientVersion=1.0.0`
                if (merge.black)  return ;
                  //if (typeof data.data.result.taskVos[i].simpleRecordInfoVo !== "undefined"){
                  //  taskBody = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${data.data.result.taskVos[i].simpleRecordInfoVo.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
                  //  await qryViewkitCallbackResult(taskBody,1000)
                  //} else {
                await zoo_collectScore(taskBody,1000)
                  //}
                }
            }

            if ([2].includes(data.data.result.taskVos[i].taskType) && data.data.result.taskVos[i].status === 1) {
              //for (let k = data.data.result.taskVos[i].times; k < data.data.result.taskVos[i].maxTimes; k++) {
              //  await zoo_getFeedDetail(data.data.result.taskVos[i].taskId)
              //}
            }
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//获取我的城市
function zoo_myMap(timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_myMap`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_myMap&body={"ss":"{\\"extraData\\":{},\\"businessData\\":{},\\"secretp\\":\\"${secretp}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          that.log('zoo_myMap:' + data)
          data = JSON.parse(data);
          for (let i in data.data.result.shopList) {
            // (data.data.result.shopList[i].status === 1) {
              //that.log(data.data.result.shopList[i])
            that.log('\n开始小镇任务：'+ data.data.result.shopList[i].name)// + '-' + data.data.result.shopList[i].shopId
            await zoo_getTaskDetail(data.data.result.shopList[i].shopId)
            //}
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//逛商城
function zoo_shopSignInWrite(shopSign,timeout = 0){
  return new Promise((resolve) => {

    let rnd = Math.round(Math.random()*1e6)
    let nonstr = randomWord(false,10)
    let time = Date.now()
    let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
    let msg = `inviteId=-1&rnd=${rnd}&stealId=-1&taskId=${shopSign}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
    let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()

    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_shopSignInWrite`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_shopSignInWrite&body={"shopSign":"${shopSign}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.1.3\\",\\"sceneid\\":\\"homePageh5\\"},\\"businessData\\":{\\"taskId\\":\\"${shopSign}\\",\\"rnd\\":\\"${rnd}\\",\\"inviteId\\":\\"-1\\",\\"stealId\\":\\"-1\\"},\\"secretp\\":\\"${secretp}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          if (data.data.bizCode !== 0) {
            that.log(data.data.bizMsg)
            merge.end = true
          } else {
            that.log('获得金币' + data.data.result.score)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//逛商城
function zoo_shopSignInRead(shopSign,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_shopSignInRead`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_shopSignInRead&client=wh5&clientVersion=1.0.0&body={"shopSign":"${shopSign}"}`
      }
      $.post(url, async (err, resp, data) => {
        try {
        //   that.log(data)
          data = JSON.parse(data);
          if (data.data.result.signInTag === 0) {
             secretp = secretp||data.data.result.secretp
             await zoo_shopSignInWrite(shopSign)
          } else {
            that.log('已逛过')
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//收金币
function zoo_collectProduceScore(timeout = 0){
  return new Promise((resolve) => {
    let rnd = Math.round(Math.random()*1e6)
    let nonstr = randomWord(false,10)
    let time = Date.now()
    let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
    let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
    let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_collectProduceScore`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_collectProduceScore&body={"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_0\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      //that.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          if (data.data.bizCode === -1002) {
            //that.log('此账号暂不可使用脚本，脚本终止！')
            //merge.black = true;
            return ;
          }
          if (data.data.result) that.log(`\n收取金币：${data.data.result.produceScore}`)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//获取可偷
function zoo_pk_getStealForms(taskBody,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_getStealForms`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : taskBody
      }
      $.post(url, async (err, resp, data) => {
        try {
        //   that.log(data)
          data = JSON.parse(data);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}
//做任务
function zoo_collectScore(taskBody,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_collectScore`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : taskBody
      }
      //that.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          that.log('任务执行结果：' + data.data.bizMsg)
          if (data.data.bizCode === -1002) {
            //that.log(url.body)
            that.log('\n提示火爆，休息5秒')
            await $.wait(5000)
            //await zoo_collectScore(taskBody)
            //that.log('此账号暂不可使用脚本，脚本终止！')
            //merge.black = true;
            return ;
          }
          if (data.data.bizCode === 0 && typeof data.data.result.taskToken !== "undefined") {
            //that.log('需要再次执行,如提示活动异常请多次重试，个别任务多次执行也不行就去APP做吧！')
            let taskBody = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${data.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            //that.log(taskBody)
            await qryViewkitCallbackResult(taskBody,7000)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//做任务
function zoo_doAdditionalTask(taskBody,timeout = 0){
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_doAdditionalTask`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : taskBody
      }
      //that.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
        //   that.log(data)
          data = JSON.parse(data);
          that.log('任务执行结果：' + data.data.bizMsg)
          if (data.data.bizCode === -1002) {
            that.log('\n提示火爆，休息5秒')
            await $.wait(5000)
            return ;
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//查询甄选任务
function zoo_getFeedDetail(taskId,timeout = 0){
  return new Promise((resolve) => {

    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_getFeedDetail`,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getFeedDetail&body={"taskId":"${taskId}"}&client=wh5&clientVersion=1.0.0`
      }
      //that.log(url)
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          let list =  data.data.result.viewProductVos||data.data.result.addProductVos
          for (let i in list) {
            if (list[i].status === 1) {
              for (let j in list[i].productInfoVos) {
                if (j >= 5)  break;

                let rnd = Math.round(Math.random()*1e6)
                let nonstr = randomWord(false,10)
                let time = Date.now()
                let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
                let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
                let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase() //,\"random\":\"${rnd}\"
                let taskBody = `functionId=zoo_collectScore&body={"taskId":${list[i].taskId},"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","itemId":"${list[i].productInfoVos[j].skuId}","actionType":1}&client=wh5&clientVersion=1.0.0`
                //that.log(taskBody)
                //body={"taskId":${list[i].taskId},"itemId":"${list[i].productInfoVos[j].skuId}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.1.3\\",\\"sceneid\\":\\"homePageh5\\"},\\"random\\":\\"${rnd}\\",\\"secretp\\":\\"${secretp}\\"}","shopSign":""}&client=wh5&clientVersion=1.0.0`
                that.log(list[i].productInfoVos[j].skuName)
                await zoo_collectScore(taskBody,1000)
              }
              list[i].status = 2
            }
          }

        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//做任务2
function qryViewkitCallbackResult(taskBody,timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${taskBody}&_timestamp=`+Date.now(),
        headers : {
          'Origin' : `https://bunearth.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `*/*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`,
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Referer' : 'https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?jmddToSmartEntry=login'
        }
       }

      $.post(url, async (err, resp, data) => {
        try {
          //that.log(url.url)
          //that.log(data)
          data = JSON.parse(data);
          that.log(data.toast.subTitle)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//群组助力
function zoo_pk_assistGroup(inviteId = "",timeout = 0) {
  return new Promise((resolve) => {
    let rnd = Math.round(Math.random()*1e6)
    let nonstr = randomWord(false,10)
    let time = Date.now()
    let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
    let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
    let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()
    //inviteId = "IgNWdiLGaPbb6ArIDg2g7t5ov9boGePFOlAq0hiVz-muX7bnH9gutA"
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_assistGroup`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.6;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`,
          'Refer' : `https://bunearth.m.jd.com/babelDiy/Zeus/4SJUHwGdUQYgg94PFzjZZbGZRjDd/index.html?jmddToSmartEntry=login`
        },
        body : `functionId=zoo_pk_assistGroup&body={"confirmFlag":1,"inviteId":"${inviteId}","ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.1\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"pkPopupHelpButtonId\\",\\"sceneid\\":\\"sideTaskh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}"}&client=wh5&clientVersion=1.0.0`
      }
      //that.log(url.body)
      $.post(url, async (err, resp, data) => {
        try {
          //that.log('商圈助力：' + data)
          data = JSON.parse(data);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

//获取首页信息
function zoo_getHomeData(inviteId= "",timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_getHomeData`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_getHomeData&body={${inviteId ? "\"inviteId\":\"" + inviteId +'\"': ""}}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(url.body)
          //if (merge.black)  return ;
          data = JSON.parse(data);
          if (data.code === 0) {
            if (inviteId !== "") {
              //that.log('zoo_getHomeData2:' + JSON.stringify(data))
              //if (data.data.result.homeMainInfo.guestInfo.status === 0) {
               if (true) {
                let rnd = Math.round(Math.random()*1e6)
                let nonstr = randomWord(false,10)
                let time = Date.now()
                let key = minusByByte(nonstr.slice(0,5),String(time).slice(-5))
                let msg = `random=${rnd}&token=d89985df35e6a2227fd2e85fe78116d2&time=${time}&nonce_str=${nonstr}&key=${key}&is_trust=true`
                let sign = bytesToHex(wordsToBytes(getSign(msg))).toUpperCase()
                let taskBody = `functionId=zoo_collectScore&body={"taskId":2,"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"jmdd-react-smash_62\\",\\"sceneid\\":\\"homePageh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","inviteId":"${inviteId}","actionType":1}&client=wh5&clientVersion=1.0.0`
                await zoo_collectScore(taskBody, 1000)
                //let taskBody = `functionId=zoo_doAdditionalTask&body={"ss":"{\\"extraData\\":{\\"is_trust\\":true,\\"sign\\":\\"${sign}\\",\\"fpb\\":\\"\\",\\"time\\":${time},\\"encrypt\\":\\"3\\",\\"nonstr\\":\\"${nonstr}\\",\\"jj\\":\\"\\",\\"token\\":\\"d89985df35e6a2227fd2e85fe78116d2\\",\\"cf_v\\":\\"1.0.2\\",\\"client_version\\":\\"2.2.1\\",\\"buttonid\\":\\"homePopupHelpButtonId\\",\\"sceneid\\":\\"mainTaskh5\\"},\\"secretp\\":\\"${secretp}\\",\\"random\\":\\"${rnd}\\"}","inviteId":"cAxZdTXtIL3Z4wnNDAeu6UJH04V9-dkV6PTOUlAw2_pIXu8I-B8Mgnlc4UY"}&client=wh5&clientVersion=1.0.0`
                //await zoo_doAdditionalTask(taskBody,1000)
              }
              return
            }
            //that.log('zoo_getHomeData:' + JSON.stringify(data))
            secretp = data.data.result.homeMainInfo.secretp
            await zoo_collectProduceScore();
            await zoo_pk_getHomeData('sSKNX-MpqKPR4M9sER0OjqZ7MpK2-RQ_CxCKTbBOhmKInSJukww_AlE')
            //await zoo_pk_assistGroup()
            if (data.data.result.homeMainInfo.raiseInfo.buttonStatus === 1 ) await zoo_raise(1000)
            await zoo_getHomeData('ZXTKT018vPkIlJafIt5I9ZJBlwFjRWn6-7zx55awQ');
            //await zoo_getTaskDetail("","app")
            await zoo_getTaskDetail()
          } else {
            return
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}


//助力
function collectFriendRecordColor(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}collectFriendRecordColor`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=collectFriendRecordColor&body={"mpin":"RnFgwWRbPDGKy9RP--twXV_3bZt2p2ZADl2v","businessCode":"20118","assistType":"1"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
        //   that.log(data)
          //data = JSON.parse(data);
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function getEncryptedPinColor(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}getEncryptedPinColor`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=getEncryptedPinColor&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          data = JSON.parse(data);
          that.log('助力码:'+ data.result)
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function zoo_raise(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_raise`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_raise&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          that.log('解锁结果：'+ (data.data.bizCode||'成功'))
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function qryCompositeMaterials(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}qryCompositeMaterials`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'content-type': 'application/x-www-form-urlencoded',
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"viewLogo\\",\\"id\\":\\"05149412\\"},{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"bottomLogo\\",\\"id\\":\\"05149413\\"}]","activityId":"2cKMj86srRdhgWcKonfExzK4ZMBy","pageId":"","reqSrc":"","applyKey":"21beast"}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
          //that.log(data)
          data = JSON.parse(data);
          for (let i in data.data.viewLogo.list) {
            await zoo_getTaskDetail(data.data.viewLogo.list[i].desc)
          }
          for (let i in data.data.bottomLogo.list) {
            await zoo_getTaskDetail(data.data.bottomLogo.list[i].desc)
          }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function zoo_pk_getHomeData(body = "",timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      let url = {
        url : `${JD_API_HOST}zoo_pk_getHomeData`  ,
        headers : {
          'Origin' : `https://wbbny.m.jd.com`,
          'Cookie' : cookie,
          'Connection' : `keep-alive`,
          'Accept' : `application/json, text/plain, */*`,
          'Host' : `api.m.jd.com`,
          'User-Agent' : `jdapp;iPhone;9.2.0;14.1;`,
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding' : `gzip, deflate, br`,
          'Accept-Language' : `zh-cn`
        },
        body : `functionId=zoo_pk_getHomeData&body={}&client=wh5&clientVersion=1.0.0`
      }
      $.post(url, async (err, resp, data) => {
        try {
        //   if (body !== "") {
        //     await $.getScript("https://raw.githubusercontent.com/yangtingxiao/QuantumultX/master/memo/jd_zooShareCode.txt").then((text) => (shareCodeList = text.split('\n')))
        //     for (let i in shareCodeList) {
        //       if (shareCodeList[i]) await zoo_pk_assistGroup(shareCodeList[i]);
        //     }
        //     //await zoo_pk_assistGroup(body);
        //   } else {
        // that.log(data);
        data = JSON.parse(data);
          
          that.log('您的商圈助力码：' + data.data.result.groupInfo.groupAssistInviteId)
        //   }
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}

function randomWord(randomFlag, min, max){
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 随机产生
  if(randomFlag){
    range = Math.round(Math.random() * (max-min)) + min;
  }
  for(let i=0; i<range; i++){
    let pos = Math.round(Math.random() * (arr.length-1));
    str += arr[pos];
  }
  return str;
}

function minusByByte(t, n) {
  var e = t.length
    , r = n.length
    , o = Math.max(e, r)
    , i = toAscii(t)
    , a = toAscii(n)
    , s = ""
    , u = 0;
  for (e !== r && (i = add0(i, o),
    a = this.add0(a, o)); u < o; )
    s += Math.abs(i[u] - a[u]),
      u++;
  return s
}

function toAscii (t) {
  var n = "";
  for (var e in t) {
    var r = t[e]
      , o = /[a-zA-Z]/.test(r);
    if (t.hasOwnProperty(e))
      if (o)
        n += getLastAscii(r);
      else
        n += r
  }
  return n
}
function add0 (t, n) {
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
function getSign (t) {
  t = stringToBytes(t)
  var e = bytesToWords(t)
    , i = 8 * t.length
    , a = []
    , s = 1732584193
    , u = -271733879
    , c = -1732584194
    , f = 271733878
    , h = -1009589776;
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
      var _ = (s << 5 | s >>> 27) + h + (a[m] >>> 0) + (m < 20 ? 1518500249 + (u & c | ~u & f) : m < 40 ? 1859775393 + (u ^ c ^ f) : m < 60 ? (u & c | u & f | c & f) - 1894007588 : (u ^ c ^ f) - 899497514);
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
//初始化
function initial() {
  merge = {
    nickname: "",
    enabled: true,
    end: false,
    black: false
  }
//   for (let i in merge) {
//     merge[i].success = 0;
//     merge[i].fail = 0;
//     merge[i].prizeCount = 0;
//     merge[i].notify = "";
//     merge[i].show = true;
//   }
}
//通知
function msgShow() {
  that.log("\n\n京东账号："+merge.nickname + ' 任务已做完！\n如有未完成的任务，请多执行几次')
 //$.msg($.Name,"","京东账号："+merge.nickname + ' 任务已做完！\n如有未完成的任务，请多执行几次')
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

let cookiesArr = [], cookie = '', allMessage = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const MISSION_BASE_API = `https://ms.jr.jd.com/gw/generic/mission/h5/m`;
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      that.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdPigPet();
    }
  }
  if (allMessage && new Date().getHours() % 6 === 0) {
    if ($.isNode()) await notify.sendNotify($.name, allMessage);
    $.msg($.name, '', allMessage);
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdPigPet() {
  try {
    await pigPetLogin();
    if (!$.hasPig) return
    await pigPetSignIndex();
    await pigPetSign();
    await pigPetOpenBox();
    await pigPetLotteryIndex();
    await pigPetLottery();
    await pigPetMissionList();
    await missions();
    await pigPetUserBag();
  } catch (e) {
    $.logErr(e)
  }
}
async function pigPetLottery() {
  if ($.currentCount > 0) {
    for (let i = 0; i < $.currentCount; i ++) {
      await pigPetLotteryPlay();
    }
  }
}
async function pigPetSign() {
  if (!$.sign) {
    await pigPetSignOne();
  } else {
    that.log(`第${$.no}天已签到\n`)
  }
}
function pigPetSignOne() {
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam": "{}",
      "no": $.no
    }
    $.post(taskUrl('pigPetSignOne', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log('签到结果',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       that.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.sign = data.resultData.resultData.sign;
            //       $.no = data.resultData.resultData.today;
            //     }
            //   } else {
            //     that.log(`查询签到情况异常：${JSON.stringify(data)}`)
            //   }
            // }
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
//查询背包食物
function pigPetUserBag() {
  return new Promise(async resolve => {
    const body = {"source":0,"channelLV":"yqs","riskDeviceParam":"{}","t":Date.now(),"skuId":"1001003004","category":"1001"};
    $.post(taskUrl('pigPetUserBag', body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.goods) {
                  that.log(`\n食物名称     数量`);
                  for (let item of data.resultData.resultData.goods) {
                    that.log(`${item.goodsName}      ${item.count}g`);
                  }
                  for (let item of data.resultData.resultData.goods) {
                    if (item.count >= 20) {
                      that.log(`10秒后开始喂食${item.goodsName}，当前数量为${item.count}g`)
                      await $.wait(10000);
                      await pigPetAddFood(item.sku);
                    }
                  }
                } else {
                  that.log(`暂无食物`)
                }
              } else {
                that.log(`开宝箱其他情况：${JSON.stringify(data)}`)
              }
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
//喂食
function pigPetAddFood(skuId) {
  return new Promise(async resolve => {
    that.log(`skuId::::${skuId}`)
    const body = {
      "source": 0,
      "channelLV":"yqs",
      "riskDeviceParam":"{}",
      "skuId": skuId.toString(),
      "category":"1001",
    }
    // const body = {
    //   "source": 2,
    //   "channelLV":"juheye",
    //   "riskDeviceParam":"{}",
    //   "skuId": skuId.toString(),
    // }
    $.post(taskUrl('pigPetAddFood', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log(`喂食结果：${data}`)
            data = JSON.parse(data);
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
function pigPetLogin() {
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam":"{}",
    }
    $.post(taskUrl('pigPetLogin', body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                $.hasPig = data.resultData.resultData.hasPig;
                if (!$.hasPig) {
                  that.log(`\n京东账号${$.index} ${$.nickName} 未开启养猪活动,请手动去京东金融APP开启此活动\n`)
                  return
                }
                if (data.resultData.resultData.wished) {
                  if (data.resultData.resultData.wishAward) {
                    allMessage += `京东账号${$.index} ${$.nickName || $.UserName}\n${data.resultData.resultData.wishAward.name}已可兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
                  }
                }
              } else {
                that.log(`Login其他情况：${JSON.stringify(data)}`)
              }
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
//开宝箱
function pigPetOpenBox() {
  return new Promise(async resolve => {
    const body = {"source":0,"channelLV":"yqs","riskDeviceParam":"{}","no":5,"category":"1001","t": Date.now()}
    $.post(taskUrl('pigPetOpenBox', body), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.award) {
                  that.log(`开宝箱获得${data.resultData.resultData.award.content}，数量：${data.resultData.resultData.award.count}`);

                } else {
                  that.log(`开宝箱暂无奖励`)
                }
                await $.wait(2000);
                await pigPetOpenBox();
              } else if (data.resultData.resultCode === 420) {
                that.log(`开宝箱失败:${data.resultData.resultMsg}`)
              } else {
                that.log(`开宝箱其他情况：${JSON.stringify(data)}`)
              }
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
//查询大转盘的次数
function pigPetLotteryIndex() {
  $.currentCount = 0;
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetLotteryIndex', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  that.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
                  $.currentCount = data.resultData.resultData.currentCount;
                }
              } else {
                that.log(`查询大转盘的次数：${JSON.stringify(data)}`)
              }
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
//查询签到情况
function pigPetSignIndex() {
  $.sign = true;
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetSignIndex', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.sign = data.resultData.resultData.sign;
                  $.no = data.resultData.resultData.today;
                }
              } else {
                that.log(`查询签到情况异常：${JSON.stringify(data)}`)
              }
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
//抽奖
function pigPetLotteryPlay() {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"juheye",
      "riskDeviceParam":"{}",
      "t":Date.now(),
      "type":0,
    }
    $.post(taskUrl('pigPetLotteryPlay', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  // that.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
                  $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
                }
              } else {
                that.log(`其他情况：${JSON.stringify(data)}`)
              }
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
async function missions() {
  for (let item of $.missions) {
    if (item.status === 4) {
      that.log(`\n${item.missionName}任务已做完,开始领取奖励`)
      await pigPetDoMission(item.mid);
    } else if (item.status === 5){
      that.log(`\n${item.missionName}已领取`)
    } else if (item.status === 3){
      that.log(`\n${item.missionName}未完成`)
      if (item.mid === 'CPD01') {
        await pigPetDoMission(item.mid);
      } else {
        //TODO
        // await pigPetDoMission(item.mid);
        // await queryMissionReceiveAfterStatus(item.mid);
        // await finishReadMission(item.mid);
      }
    }
  }
}
//领取做完任务的奖品
function pigPetDoMission(mid) {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"",
      "riskDeviceParam":"{}",
      mid
    }
    $.post(taskUrl('pigPetDoMission', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log('pigPetDoMission',data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  if (data.resultData.resultData.award) {
                    that.log(`奖励${data.resultData.resultData.award.name},数量:${data.resultData.resultData.award.count}`)
                  }
                }
              } else {
                that.log(`其他情况：${JSON.stringify(data)}`)
              }
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
//查询任务列表
function pigPetMissionList() {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"",
      "riskDeviceParam":"{}",
    }
    $.post(taskUrl('pigPetMissionList', body), (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // that.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.missions = data.resultData.resultData.missions;//抽奖后剩余的抽奖次数
                }
              } else {
                that.log(`其他情况：${JSON.stringify(data)}`)
              }
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
function queryMissionReceiveAfterStatus(missionId) {
  return new Promise(resolve => {
    const body = {"missionId": missionId.toString()};
    const options = {
      "url": `${MISSION_BASE_API}/queryMissionReceiveAfterStatus?reqData=%7B%2522missionId%2522:%2522${Number(missionId)}%2522%7D`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log('queryMissionReceiveAfterStatus',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       // that.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
            //     }
            //   } else {
            //     that.log(`其他情况：${JSON.stringify(data)}`)
            //   }
            // }
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
//做完浏览任务发送信息API
function finishReadMission(missionId) {
  return new Promise(async resolve => {
    const body = {"missionId": missionId.toString(),"readTime":10};
    const options = {
      "url": `${MISSION_BASE_API}/finishReadMission?reqData=%7B%2522missionId%2522:%2522${Number(missionId)}%2522,%2522readTime%2522:10%7D`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log('finishReadMission',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       // that.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
            //     }
            //   } else {
            //     that.log(`其他情况：${JSON.stringify(data)}`)
            //   }
            // }
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
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
function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}?_=${Date.now()}`,
    body: `reqData=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Accept' : `*/*`,
      'Origin' : `https://u.jr.jd.com`,
      'Accept-Encoding' : `gzip, deflate, br`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      // 'User-Agent' : `jdapp;iPhone;9.0.0;13.4.1;e35caf0a69be42084e3c97eef56c3af7b0262d01;network/4g;ADID/F75E8AED-CB48-4EAC-A213-E8CE4018F214;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/1;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/167237;supportBestPay/0;jdSupportDarkMode/0;pv/1287.19;apprpd/MyJD_GameMain;ref/https%3A%2F%2Fuua.jr.jd.com%2Fuc-fe-wxgrowing%2Fmoneytree%2Findex%2F%3Fchannel%3Dyxhd%26lng%3D113.325843%26lat%3D23.204628%26sid%3D2d98e88cf7d182f60d533476c2ce777w%26un_area%3D19_1601_50258_51885;psq/1;ads/;psn/e35caf0a69be42084e3c97eef56c3af7b0262d01|3485;jdv/0|kong|t_1000170135|tuiguang|notset|1593059927172|1593059927;adk/;app_device/IOS;pap/JA2015_311210|9.0.0|IOS 13.4.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
      'User-Agent' : `jdapp;android;8.5.12;9;network/wifi;model/GM1910;addressid/1302541636;aid/ac31e03386ddbec6;oaid/;osVer/28;appBuild/73078;adk/;ads/;pap/JA2015_311210|8.5.12|ANDROID 9;osv/9;pv/117.24;jdv/0|kong|t_1000217905_|jingfen|644e9b005c8542c1ac273da7763971d8|1589905791552|1589905794;ref/com.jingdong.app.mall.WebActivity;partner/oppo;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 9; GM1910 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 Edg/86.0.4240.111`,
      'Referer' : `https://u.jr.jd.com/`,
      'Accept-Language' : `zh-cn`
    }
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

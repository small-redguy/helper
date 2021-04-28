
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
  if (process.env.JDFACTORY_FORBID_ACCOUNT) process.env.JDFACTORY_FORBID_ACCOUNT.split('&').map((item, index) => Number(item) === 0 ? cookiesArr = [] : cookiesArr.splice(Number(item) - 1 - index, 1))
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let wantProduct = ``;//心仪商品名称
const JD_API_HOST = 'https://api.m.jd.com/client.action';
 const inviteCodes = ['T018vPkIlJafIt5I9ZJBlwCjVWnYaS5kRrbA','T0225KkcRkgf9FzRdBzywfRYdQCjVWnYaS5kRrbA'];
!(async () => {
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
      await shareCodesFormat();
      await jdFactory()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdFactory() {
  try {
    await jdfactory_getHomeData();
    //await helpFriends(); //助力去除
    // $.newUser !==1 && $.haveProduct === 2，老用户但未选购商品
    // $.newUser === 1新用户
    if ($.newUser === 1) return
    await jdfactory_collectElectricity();//收集产生的电量
    await jdfactory_getTaskDetail();
    await doTask();
    await algorithm();//投入电力逻辑
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}
function showMsg() {
  return new Promise(resolve => {
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`${message}`);
    }
    if (new Date().getHours() === 12) {
      $.msg($.name, '', `${message}`);
    }
    resolve()
  })
}
async function algorithm() {
  // 当心仪的商品存在，并且收集起来的电量满足当前商品所需，就投入
  return new Promise(resolve => {
    $.post(taskPostUrl('jdfactory_getHomeData'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              $.haveProduct = data.data.result.haveProduct;
              $.userName = data.data.result.userName;
              $.newUser = data.data.result.newUser;
              wantProduct = $.isNode() ? (process.env.FACTORAY_WANTPRODUCT_NAME ? process.env.FACTORAY_WANTPRODUCT_NAME : wantProduct) : ($.getdata('FACTORAY_WANTPRODUCT_NAME') ? $.getdata('FACTORAY_WANTPRODUCT_NAME') : wantProduct);
              if (data.data.result.factoryInfo) {
                let { totalScore, useScore, produceScore, remainScore, couponCount, name } = data.data.result.factoryInfo
                that.log(`\n已选商品：${name}`);
                that.log(`当前已投入电量/所需电量：${useScore}/${totalScore}`);
                that.log(`已选商品剩余量：${couponCount}`);
                that.log(`当前总电量：${remainScore * 1 + useScore * 1}`);
                that.log(`当前完成度：${((remainScore * 1 + useScore * 1)/(totalScore * 1)).toFixed(2) * 100}%\n`);
                message += `京东账号${$.index} ${$.nickName}\n`;
                message += `已选商品：${name}\n`;
                message += `当前已投入电量/所需电量：${useScore}/${totalScore}\n`;
                message += `已选商品剩余量：${couponCount}\n`;
                message += `当前总电量：${remainScore * 1 + useScore * 1}\n`;
                message += `当前完成度：${((remainScore * 1 + useScore * 1)/(totalScore * 1)).toFixed(2) * 100}%\n`;
                if (wantProduct) {
                  that.log(`BoxJs或环境变量提供的心仪商品：${wantProduct}\n`);
                  await jdfactory_getProductList(true);
                  let wantProductSkuId = '';
                  for (let item of $.canMakeList) {
                    if (item.name.indexOf(wantProduct) > - 1) {
                      totalScore = item['fullScore'] * 1;
                      couponCount = item.couponCount;
                      name = item.name;
                    }
                    if (item.name.indexOf(wantProduct) > - 1 && item.couponCount > 0) {
                      wantProductSkuId = item.skuId;
                    }
                  }
                  // that.log(`\n您心仪商品${name}\n当前数量为：${couponCount}\n兑换所需电量为：${totalScore}\n您当前总电量为：${remainScore * 1 + useScore * 1}\n`);
                  if (wantProductSkuId && ((remainScore * 1 + useScore * 1) >= (totalScore * 1 + 100000))) {
                    that.log(`\n提供的心仪商品${name}目前数量：${couponCount}，且当前总电量为：${remainScore * 1 + useScore * 1}，【满足】兑换此商品所需总电量：${totalScore + 100000}`);
                    that.log(`请去活动页面更换成心仪商品并手动投入电量兑换\n`);
                    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n您提供的心仪商品${name}目前数量：${couponCount}\n当前总电量为：${remainScore * 1 + useScore * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请点击弹窗直达活动页面\n更换成心仪商品并手动投入电量兑换`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
                    if ($.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n您提供的心仪商品${name}目前数量：${couponCount}\n当前总电量为：${remainScore * 1 + useScore * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请去活动页面更换成心仪商品并手动投入电量兑换`);
                  } else {
                    that.log(`您心仪商品${name}\n当前数量为：${couponCount}\n兑换所需电量为：${totalScore}\n您当前总电量为：${remainScore * 1 + useScore * 1}\n不满足兑换心仪商品的条件\n`)
                  }
                } else {
                  that.log(`BoxJs或环境变量暂未提供心仪商品\n如需兑换心仪商品，请提供心仪商品名称，否则满足条件后会为您兑换当前所选商品：${name}\n`);
                  if (((remainScore * 1 + useScore * 1) >= totalScore * 1 + 100000) && (couponCount * 1 > 0)) {
                    that.log(`\n所选商品${name}目前数量：${couponCount}，且当前总电量为：${remainScore * 1 + useScore * 1}，【满足】兑换此商品所需总电量：${totalScore}`);
                    that.log(`BoxJs或环境变量暂未提供心仪商品，下面为您目前选的${name} 发送提示通知\n`);
                    // await jdfactory_addEnergy();
                    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n您所选商品${name}目前数量：${couponCount}\n当前总电量为：${remainScore * 1 + useScore * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请点击弹窗直达活动页面查看`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
                    if ($.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n所选商品${name}目前数量：${couponCount}\n当前总电量为：${remainScore * 1 + useScore * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请速去活动页面查看`);
                  } else {
                    that.log(`\n所选商品${name}目前数量：${couponCount}，且当前总电量为：${remainScore * 1 + useScore * 1}，【不满足】兑换此商品所需总电量：${totalScore}`)
                    that.log(`故不一次性投入电力，一直放到蓄电池累计\n`);
                  }
                }
              } else {
                that.log(`\n此账号${$.index}${$.nickName}暂未选择商品\n`);
                message += `京东账号${$.index} ${$.nickName}\n`;
                message += `已选商品：暂无\n`;
                message += `心仪商品：${wantProduct ? wantProduct : '暂无'}\n`;
                if (wantProduct) {
                  that.log(`BoxJs或环境变量提供的心仪商品：${wantProduct}\n`);
                  await jdfactory_getProductList(true);
                  let wantProductSkuId = '', name, totalScore, couponCount, remainScore;
                  for (let item of $.canMakeList) {
                    if (item.name.indexOf(wantProduct) > - 1) {
                      totalScore = item['fullScore'] * 1;
                      couponCount = item.couponCount;
                      name = item.name;
                    }
                    if (item.name.indexOf(wantProduct) > - 1 && item.couponCount > 0) {
                      wantProductSkuId = item.skuId;
                    }
                  }
                  if (totalScore) {
                    // 库存存在您设置的心仪商品
                    message += `心仪商品数量：${couponCount}\n`;
                    message += `心仪商品所需电量：${totalScore}\n`;
                    message += `您当前总电量：${$.batteryValue * 1}\n`;
                    if (wantProductSkuId && (($.batteryValue * 1) >= (totalScore))) {
                      that.log(`\n提供的心仪商品${name}目前数量：${couponCount}，且当前总电量为：${$.batteryValue * 1}，【满足】兑换此商品所需总电量：${totalScore}`);
                      that.log(`请去活动页面选择心仪商品并手动投入电量兑换\n`);
                      $.msg($.name, '', `京东账号${$.index}${$.nickName}\n您提供的心仪商品${name}目前数量：${couponCount}\n当前总电量为：${$.batteryValue * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请点击弹窗直达活动页面\n选择此心仪商品并手动投入电量兑换`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
                      if ($.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n您提供的心仪商品${name}目前数量：${couponCount}\n当前总电量为：${$.batteryValue * 1}\n【满足】兑换此商品所需总电量：${totalScore}\n请去活动页面选择此心仪商品并手动投入电量兑换`);
                    } else {
                      that.log(`您心仪商品${name}\n当前数量为：${couponCount}\n兑换所需电量为：${totalScore}\n您当前总电量为：${$.batteryValue * 1}\n不满足兑换心仪商品的条件\n`)
                    }
                  } else {
                    message += `目前库存：暂无您设置的心仪商品\n`;
                  }
                } else {
                  that.log(`BoxJs或环境变量暂未提供心仪商品\n如需兑换心仪商品，请提供心仪商品名称\n`);
                  await jdfactory_getProductList(true);
                  message += `当前剩余最多商品：${$.canMakeList[0] && $.canMakeList[0].name}\n`;
                  message += `兑换所需电量：${$.canMakeList[0] && $.canMakeList[0].fullScore}\n`;
                  message += `您当前总电量：${$.batteryValue * 1}\n`;
                  if ($.canMakeList[0] && $.canMakeList[0].couponCount > 0 && $.batteryValue * 1 >= $.canMakeList[0] && $.canMakeList[0].fullScore) {
                    let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
                    if (new Date(nowTimes).getHours() === 12) {
                      $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}【满足】兑换${$.canMakeList[0] && $.canMakeList[0] && [0].name}所需总电量：${$.canMakeList[0] && $.canMakeList[0].fullScore}\n请点击弹窗直达活动页面\n选择此心仪商品并手动投入电量兑换`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
                      if ($.isNode()) await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n${message}【满足】兑换${$.canMakeList[0] && $.canMakeList[0].name}所需总电量：${$.canMakeList[0].fullScore}\n请速去活动页面查看`);
                    }
                  } else {
                    that.log(`\n目前电量${$.batteryValue * 1},不满足兑换 ${$.canMakeList[0] && $.canMakeList[0].name}所需的 ${$.canMakeList[0] && $.canMakeList[0].fullScore}电量\n`)
                  }
                }
              }
            } else {
              that.log(`异常：${JSON.stringify(data)}`)
            }
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
async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    const helpRes = await jdfactory_collectScore(code);
    if (helpRes.code === 0 && helpRes.data.bizCode === -7) {
      that.log(`助力机会已耗尽，跳出`);
      break
    }
  }
}
async function doTask() {
  if ($.taskVos && $.taskVos.length > 0) {
    for (let item of $.taskVos) {
      if (item.taskType === 1) {
        //关注店铺任务
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          for (let task of item.followShopVo) {
            if (task.status === 1) {
              await jdfactory_collectScore(task.taskToken);
            }
          }
        } else {
          that.log(`${item.taskName}已做完`)
        }
      }
      if (item.taskType === 2) {
        //看看商品任务
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          for (let task of item.productInfoVos) {
            if (task.status === 1) {
              await jdfactory_collectScore(task.taskToken);
            }
          }
        } else {
          that.log(`${item.taskName}已做完`)
        }
      }
      if (item.taskType === 3) {
        //逛会场任务
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          for (let task of item.shoppingActivityVos) {
            if (task.status === 1) {
              await jdfactory_collectScore(task.taskToken);
            }
          }
        } else {
          that.log(`${item.taskName}已做完`)
        }
      }
      if (item.taskType === 10) {
        if (item.status === 1) {
          if (item.threeMealInfoVos[0].status === 1) {
            //可以做此任务
            that.log(`准备做此任务：${item.taskName}`);
            await jdfactory_collectScore(item.threeMealInfoVos[0].taskToken);
          } else if (item.threeMealInfoVos[0].status === 0) {
            that.log(`${item.taskName} 任务已错过时间`)
          }
        } else if (item.status === 2){
          that.log(`${item.taskName}已完成`);
        }
      }
      if (item.taskType === 21) {
        //开通会员任务
        if (item.status === 1) {
          that.log(`此任务：${item.taskName}，跳过`);
          // for (let task of item.brandMemberVos) {
          //   if (task.status === 1) {
          //     await jdfactory_collectScore(task.taskToken);
          //   }
          // }
        } else {
          that.log(`${item.taskName}已做完`)
        }
      }
      if (item.taskType === 13) {
        //每日打卡
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          await jdfactory_collectScore(item.simpleRecordInfoVo.taskToken);
        } else {
          that.log(`${item.taskName}已完成`);
        }
      }
      if (item.taskType === 14) {
        //好友助力
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          // await jdfactory_collectScore(item.simpleRecordInfoVo.taskToken);
        } else {
          that.log(`${item.taskName}已完成`);
        }
      }
      if (item.taskType === 23) {
        //从数码电器首页进入
        if (item.status === 1) {
          that.log(`准备做此任务：${item.taskName}`);
          await queryVkComponent();
          await jdfactory_collectScore(item.simpleRecordInfoVo.taskToken);
        } else {
          that.log(`${item.taskName}已完成`);
        }
      }
    }
  }
}

//领取做完任务的奖励
function jdfactory_collectScore(taskToken) {
  return new Promise(async resolve => {
    await $.wait(1000);
    $.post(taskPostUrl("jdfactory_collectScore", { taskToken }, "jdfactory_collectScore"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              $.taskVos = data.data.result.taskVos;//任务列表
              that.log(`领取做完任务的奖励：${JSON.stringify(data.data.result)}`);
            } else {
              that.log(JSON.stringify(data))
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
//给商品投入电量
function jdfactory_addEnergy() {
  return new Promise(resolve => {
    $.post(taskPostUrl("jdfactory_addEnergy"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              that.log(`给商品投入电量：${JSON.stringify(data.data.result)}`)
              // $.taskConfigVos = data.data.result.taskConfigVos;
              // $.exchangeGiftConfigs = data.data.result.exchangeGiftConfigs;
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

//收集电量
function jdfactory_collectElectricity() {
  return new Promise(resolve => {
    $.post(taskPostUrl("jdfactory_collectElectricity"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              that.log(`成功收集${data.data.result.electricityValue}电量，当前蓄电池总电量：${data.data.result.batteryValue}\n`);
              $.batteryValue = data.data.result.batteryValue;
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
//获取任务列表
function jdfactory_getTaskDetail() {
  return new Promise(resolve => {
    $.post(taskPostUrl("jdfactory_getTaskDetail", {}, "jdfactory_getTaskDetail"), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              $.taskVos = data.data.result.taskVos;//任务列表
              $.taskVos.map(item => {
                if (item.taskType === 14) {
                  that.log(`\n【京东账号${$.index}（${$.UserName}）的${$.name}好友互助码】${item.assistTaskDetailVo.taskToken}\n`)
                }
              })
            }
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
//选择一件商品，只能在 $.newUser !== 1 && $.haveProduct === 2 并且 sellOut === 0的时候可用
function jdfactory_makeProduct(skuId) {
  return new Promise(resolve => {
    $.post(taskPostUrl('jdfactory_makeProduct', { skuId }), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              that.log(`选购商品成功：${JSON.stringify(data)}`);
            } else {
              that.log(`异常：${JSON.stringify(data)}`)
            }
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
function queryVkComponent() {
  return new Promise(resolve => {
    const options = {
      "url": `https://api.m.jd.com/client.action?functionId=queryVkComponent`,
      "body": `adid=0E38E9F1-4B4C-40A4-A479-DD15E58A5623&area=19_1601_50258_51885&body={"componentId":"4f953e59a3af4b63b4d7c24f172db3c3","taskParam":"{\\"actId\\":\\"8tHNdJLcqwqhkLNA8hqwNRaNu5f\\"}","cpUid":"8tHNdJLcqwqhkLNA8hqwNRaNu5f","taskSDKVersion":"1.0.3","businessId":"babel"}&build=167436&client=apple&clientVersion=9.2.5&d_brand=apple&d_model=iPhone11,8&eid=eidIf12a8121eas2urxgGc+zS5+UYGu1Nbed7bq8YY+gPd0Q0t+iviZdQsxnK/HTA7AxZzZBrtu1ulwEviYSV3QUuw2XHHC+PFHdNYx1A/3Zt8xYR+d3&isBackground=N&joycious=228&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=88732f840b77821b345bf07fd71f609e6ff12f43&osVersion=14.2&partner=TF&rfs=0000&scope=11&screen=828*1792&sign=792d92f78cc893f43c32a4f0b2203a41&st=1606533009673&sv=122&uts=0f31TVRjBSsqndu4/jgUPz6uymy50MQJFKw5SxNDrZGH4Sllq/CDN8uyMr2EAv+1xp60Q9gVAW42IfViu/SFHwjfGAvRI6iMot04FU965+8UfAPZTG6MDwxmIWN7YaTL1ACcfUTG3gtkru+D4w9yowDUIzSuB+u+eoLwM7uynPMJMmGspVGyFIgDXC/tmNibL2k6wYgS249Pa2w5xFnYHQ==&uuid=hjudwgohxzVu96krv/T6Hg==&wifiBssid=1b5809fb84adffec2a397007cc235c03`,
      "headers":  {
        "Cookie": cookie,
        "Accept": `*/*`,
        "Connection": `keep-alive`,
        "Content-Type": `application/x-www-form-urlencoded`,
        "Accept-Encoding": `gzip, deflate, br`,
        "Host": `api.m.jd.com`,
        "User-Agent": "jdapp;iPhone;9.3.4;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;ADID/1C141FDD-C62F-425B-8033-9AAB7E4AE6A3;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/2005183373;supportBestPay/0;appBuild/167502;jdSupportDarkMode/0;pv/414.19;apprpd/Babel_Native;ref/TTTChannelViewContoller;psq/5;ads/;psn/88732f840b77821b345bf07fd71f609e6ff12f43|1701;jdv/0|iosapp|t_335139774|appshare|CopyURL|1610885480412|1610885486;adk/;app_device/IOS;pap/JA2015_311210|9.3.4|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
        "Accept-Language": `zh-Hans-CN;q=1, en-CN;q=0.9`,
      },
      "timeout": 10000,
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          // that.log('queryVkComponent', data)
          if (safeGet(data)) {
            data = JSON.parse(data);
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
//查询当前商品列表
function jdfactory_getProductList(flag = false) {
  return new Promise(resolve => {
    $.post(taskPostUrl('jdfactory_getProductList'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              $.canMakeList = [];
              $.canMakeList = data.data.result.canMakeList;//当前可选商品列表 sellOut:1为已抢光，0为目前可选择
              if ($.canMakeList && $.canMakeList.length > 0) {
                $.canMakeList.sort(sortCouponCount);
                that.log(`商品名称       可选状态    剩余量`)
                for (let item of $.canMakeList) {
                  that.log(`${item.name.slice(-4)}         ${item.sellOut === 1 ? '已抢光':'可 选'}      ${item.couponCount}`);
                }
                if (!flag) {
                  for (let item of $.canMakeList) {
                    if (item.name.indexOf(wantProduct) > -1 && item.couponCount > 0 && item.sellOut === 0) {
                      await jdfactory_makeProduct(item.skuId);
                      break
                    }
                  }
                }
              }
            } else {
              that.log(`异常：${JSON.stringify(data)}`)
            }
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
function sortCouponCount(a, b) {
  return b['couponCount'] - a['couponCount']
}
function jdfactory_getHomeData() {
  return new Promise(resolve => {
    $.post(taskPostUrl('jdfactory_getHomeData'), async (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            // that.log(data);
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              $.haveProduct = data.data.result.haveProduct;
              $.userName = data.data.result.userName;
              $.newUser = data.data.result.newUser;
              if (data.data.result.factoryInfo) {
                $.totalScore = data.data.result.factoryInfo.totalScore;//选中的商品，一共需要的电量
                $.userScore = data.data.result.factoryInfo.userScore;//已使用电量
                $.produceScore = data.data.result.factoryInfo.produceScore;//此商品已投入电量
                $.remainScore = data.data.result.factoryInfo.remainScore;//当前蓄电池电量
                $.couponCount = data.data.result.factoryInfo.couponCount;//已选中商品当前剩余量
                $.hasProduceName = data.data.result.factoryInfo.name;//已选中商品当前剩余量
              }
              if ($.newUser === 1) {
                //新用户
                that.log(`此京东账号${$.index}${$.nickName}为新用户暂未开启${$.name}活动\n现在为您从库存里面现有数量中选择一商品`);
                if ($.haveProduct === 2) {
                  await jdfactory_getProductList();//选购商品
                }
                // $.msg($.name, '暂未开启活动', `京东账号${$.index}${$.nickName}暂未开启${$.name}活动\n请去京东APP->搜索'玩一玩'->东东工厂->开启\n或点击弹窗即可到达${$.name}活动`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
              }
              if ($.newUser !== 1 && $.haveProduct === 2) {
                that.log(`此京东账号${$.index}${$.nickName}暂未选购商品\n现在也能为您做任务和收集免费电力`);
                // $.msg($.name, '暂未选购商品', `京东账号${$.index}${$.nickName}暂未选购商品\n请去京东APP->搜索'玩一玩'->东东工厂->选购一件商品\n或点击弹窗即可到达${$.name}活动`, {'open-url': 'openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html%22%20%7D'});
                // await jdfactory_getProductList();//选购商品
              }
            } else {
              that.log(`异常：${JSON.stringify(data)}`)
            }
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
function readShareCode() {
  that.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: `http://jd.turinglabs.net/api/v2/jd/ddfactory/read/${randomCount}/`, timeout: 10000}, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`)
          that.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            that.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // that.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      that.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    that.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    that.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    const shareCodes = $.isNode() ? require('./jdFactoryShareCodes.js') : '';
    that.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    // that.log(`\n种豆得豆助力码::${JSON.stringify($.shareCodesArr)}`);
    that.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}
function taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.1.0`,
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-cn",
      "Connection": "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie,
      "Host": "api.m.jd.com",
      "Origin": "https://h5.m.jd.com",
      "Referer": "https://h5.m.jd.com/babelDiy/Zeus/2uSsV2wHEkySvompfjB43nuKkcHp/index.html",
      "User-Agent": "jdapp;iPhone;9.3.4;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;ADID/1C141FDD-C62F-425B-8033-9AAB7E4AE6A3;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/2005183373;supportBestPay/0;appBuild/167502;jdSupportDarkMode/0;pv/414.19;apprpd/Babel_Native;ref/TTTChannelViewContoller;psq/5;ads/;psn/88732f840b77821b345bf07fd71f609e6ff12f43|1701;jdv/0|iosapp|t_335139774|appshare|CopyURL|1610885480412|1610885486;adk/;app_device/IOS;pap/JA2015_311210|9.3.4|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
    },
    timeout: 10000,
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
      },
      "timeout": 10000,
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
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
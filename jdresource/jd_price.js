
const selfDomain = 'https://msitepp-fm.jd.com/';
const unifiedGatewayName = 'https://api.m.jd.com/';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [];
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
    $.msg(
      $.name,
      '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取',
      'https://bean.m.jd.com/',
      {
        'open-url': 'https://bean.m.jd.com/',
      }
    );
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(
        $.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1]
      );
      $.index = i + 1;
      $.isLogin = false;
      $.nickName = '';
      await totalBean();
      if (!$.isLogin) {
        $.msg(
          $.name,
          `【提示】cookie已失效`,
          `京东账号${$.index} ${
            $.nickName || $.UserName
          }\n请重新登录获取\nhttps://bean.m.jd.com/`,
          {
            'open-url': 'https://bean.m.jd.com/',
          }
        );
        continue;
      }
      that.log(
        `\n***********开始【账号${$.index}】${
          $.nickName || $.UserName
        }********\n`
      );
      $.hasNext = true;
      $.refundtotalamount = 0;
      $.orderList = new Array();
      $.applyMap = {};
      // TODO
      $.token = '';
      $.feSt = 'f';
      that.log(`💥 获得首页面，解析超参数`);
      await getHyperParams();
      // that.log($.HyperParam)
      that.log(`----------`);
      that.log(`🧾 获取所有价格保护列表，排除附件商品`);
      for (let page = 1; $.hasNext; page++) {
        await getApplyData(page);
      }
      that.log(`----------`);
      that.log(`🗑 删除不符合订单`);
      that.log(`----------`);
      let taskList = [];
      for (let order of $.orderList) {
        taskList.push(historyResultQuery(order));
      }
      await Promise.all(taskList);
      that.log(`----------`);
      that.log(`📊 ${$.orderList.length}个商品即将申请价格保护！`);
      that.log(`----------`);
      for (let order of $.orderList) {
        await skuApply(order);
        await $.wait(300);
      }
      that.log(`----------`);
      that.log(`⏳ 等待申请价格保护结果...`);
      that.log(`----------`);
      for (let i = 1; i <= 30 && Object.keys($.applyMap).length > 0; i++) {
        await $.wait(1000);
        if (i % 5 == 0) {
          await getApplyResult();
        }
      }
      showMsg();
    }
  }
})()
  .catch((e) => {
    that.log(`❗️ ${$.name} 运行错误！\n${e}`);
  })
  .finally(() => $.done());

const getValueById = function (text, id) {
  try {
    const reg = new RegExp(`id="${id}".*value="(.*?)"`);
    const res = text.match(reg);
    return res[1];
  } catch (e) {
    throw new Error(`getValueById:${id} err`);
  }
};

function getHyperParams() {
  return new Promise((resolve, reject) => {
    const options = {
      url: 'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      headers: {
        Host: 'msitepp-fm.jd.com',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Connection: 'keep-alive',
        Cookie: $.cookie,
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'zh-cn',
        Referer: 'https://ihelp.jd.com/',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    $.get(options, (err, resp, data) => {
      try {
        if (err) throw new Error(JSON.stringify(err));
        $.HyperParam = {
          sid_hid: getValueById(data, 'sid_hid'),
          type_hid: getValueById(data, 'type_hid'),
          isLoadLastPropriceRecord: getValueById(
            data,
            'isLoadLastPropriceRecord'
          ),
          isLoadSkuPrice: getValueById(data, 'isLoadSkuPrice'),
          RefundType_Orderid_Repeater_hid: getValueById(
            data,
            'RefundType_Orderid_Repeater_hid'
          ),
          isAlertSuccessTip: getValueById(data, 'isAlertSuccessTip'),
          forcebot: getValueById(data, 'forcebot'),
          useColorApi: getValueById(data, 'useColorApi'),
        };
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

function getApplyData(page) {
  return new Promise((resolve, reject) => {
    $.hasNext = false;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;
    const pageSize = 5;

    let paramObj = {
      page,
      pageSize,
      keyWords: '',
      sid: sid_hid,
      type: type_hid,
      forcebot,
      token: $.token,
      feSt: $.feSt,
    };

    $.post(taskUrl('siteppM_priceskusPull', paramObj), (err, resp, data) => {
      try {
        if (err) {
          that.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          let pageErrorVal = data.match(
            /id="pageError_\d+" name="pageError_\d+" value="(.*?)"/
          )[1];
          if (pageErrorVal == 'noexception') {
            let pageDatasSize = eval(
              data.match(
                /id="pageSize_\d+" name="pageSize_\d+" value="(.*?)"/
              )[1]
            );
            $.hasNext = pageDatasSize >= pageSize;
            let orders = [...data.matchAll(/skuApply\((.*?)\)/g)];
            let titles = [...data.matchAll(/<p class="name">(.*?)<\/p>/g)];
            for (let i = 0; i < orders.length; i++) {
              let info = orders[i][1].split(',');
              if (info.length != 4) {
                throw new Error(`价格保护 ${order[1]}.length != 4`);
              }
              const item = {
                orderId: eval(info[0]),
                skuId: eval(info[1]),
                sequence: eval(info[2]),
                orderCategory: eval(info[3]),
                title: `🛒${titles[i][1].substr(0, 15)}🛒`,
              };
              let id = `skuprice_${item.orderId}_${item.skuId}_${item.sequence}`;
              let reg = new RegExp(`${id}.*?isfujian="(.*?)"`);
              isfujian = data.match(reg)[1];
              if (isfujian == 'false') {
                let skuRefundTypeDiv_orderId = `skuRefundTypeDiv_${item.orderId}`;
                item['refundtype'] = getValueById(
                  data,
                  skuRefundTypeDiv_orderId
                );
                // 设置原路返还
                if (item.refundtype === '2') item.refundtype = '1';
                $.orderList.push(item);
              }
              //else...尊敬的顾客您好，您选择的商品本身为赠品，是不支持价保的呦，请您理解。
            }
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

//  申请按钮
function skuApply(order) {
  return new Promise((resolve, reject) => {
    const { orderId, orderCategory, skuId, refundtype } = order;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;

    let paramObj = {
      orderId,
      orderCategory,
      skuId,
      sid: sid_hid,
      type: type_hid,
      refundtype,
      forcebot,
      token: $.token,
      feSt: $.feSt,
    };

    that.log(`🈸 ${order.title}`);
    $.post(taskUrl('siteppM_proApply', paramObj), (err, resp, data) => {
      try {
        if (err) {
          that.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          data = JSON.parse(data);
          if (data.flag) {
            if (data.proSkuApplyId != null) {
              $.applyMap[data.proSkuApplyId[0]] = order;
            }
          } else {
            that.log(`🚫 ${order.title} 申请失败：${data.errorMessage}`);
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

// 历史结果查询
function historyResultQuery(order) {
  return new Promise((resolve, reject) => {
    const { orderId, sequence, skuId } = order;
    const { sid_hid, type_hid, forcebot } = $.HyperParam;

    let paramObj = {
      orderId,
      skuId,
      sequence,
      sid: sid_hid,
      type: type_hid,
      pin: undefined,
      forcebot,
    };

    const reg = new RegExp(
      'overTime|[^库]不支持价保|无法申请价保|请用原订单申请'
    );
    let deleted = true;
    $.post(taskUrl('siteppM_skuProResultPin', paramObj), (err, resp, data) => {
      try {
        if (err) {
          that.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else {
          deleted = reg.test(data);
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        if (deleted) {
          that.log(`🚫 删除商品：${order.title}`);
          $.orderList = $.orderList.filter((item) => {
            return item.orderId != order.orderId || item.skuId != order.skuId;
          });
        }
        resolve();
      }
    });
  });
}

function getApplyResult() {
  function handleApplyResult(ajaxResultObj) {
    if (
      ajaxResultObj.hasResult != 'undefined' &&
      ajaxResultObj.hasResult == true
    ) {
      //有结果了
      let proSkuApplyId = ajaxResultObj.applyResultVo.proSkuApplyId; //申请id
      let order = $.applyMap[proSkuApplyId];
      delete $.applyMap[proSkuApplyId];
      if (ajaxResultObj.applyResultVo.proApplyStatus == 'ApplySuccess') {
        //价保成功
        $.refundtotalamount += ajaxResultObj.applyResultVo.refundtotalamount;
        that.log(
          `📋 ${order.title} \n🟢 申请成功：￥${$.refundtotalamount}`
        );
        that.log(`-----`);
      } else {
        that.log(
          `📋 ${order.title} \n🔴 申请失败：${ajaxResultObj.applyResultVo.failTypeStr} \n🔴 失败类型:${ajaxResultObj.applyResultVo.failType}`
        );
        that.log(`-----`);
      }
    }
  }
  return new Promise((resolve, reject) => {
    let proSkuApplyIds = Object.keys($.applyMap).join(',');
    const { pin, type_hid } = $.HyperParam;

    let paramObj = {
      proSkuApplyIds,
      pin,
      type: type_hid,
    };

    $.post(taskUrl('siteppM_moreApplyResult', paramObj), (err, resp, data) => {
      try {
        if (err) {
          that.log(
            `🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(
              err
            )}`
          );
        } else if (data) {
          data = JSON.parse(data);
          let resultArray = data.applyResults;
          for (let i = 0; i < resultArray.length; i++) {
            let ajaxResultObj = resultArray[i];
            handleApplyResult(ajaxResultObj);
          }
        }
      } catch (e) {
        reject(
          `⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(
            data
          )}`
        );
      } finally {
        resolve();
      }
    });
  });
}

function taskUrl(functionid, body) {
  let urlStr = selfDomain + 'rest/priceprophone/priceskusPull';
  const { useColorApi, forcebot } = $.HyperParam;

  if (useColorApi == 'true') {
    urlStr =
      unifiedGatewayName +
      'api?appid=siteppM&functionId=' +
      functionid +
      '&forcebot=' +
      forcebot +
      '&t=' +
      new Date().getTime();
  }
  return {
    url: urlStr,
    headers: {
      Host: useColorApi == 'true' ? 'api.m.jd.com' : 'msitepp-fm.jd.com',
      Accept: '*/*',
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://msitepp-fm.jd.com',
      Connection: 'keep-alive',
      Referer: 'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      Cookie: $.cookie,
    },
    body: body ? `body=${JSON.stringify(body)}` : undefined,
  };
}

function showMsg() {
  that.log(`🧮 本次价格保护金额：${$.refundtotalamount}💰`);
  if ($.refundtotalamount) {
    $.msg(
      $.name,
      ``,
      `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次价格保护金额：${
        $.refundtotalamount
      }💰`,
      {
        'open-url':
          'https://msitepp-fm.jd.com/rest/priceprophone/priceProPhoneMenu',
      }
    );
  }
}

function totalBean() {
  return new Promise((resolve) => {
    const options = {
      url: `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      headers: {
        Accept: 'application/json,text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-cn',
        Connection: 'keep-alive',
        Cookie: $.cookie,
        Referer: 'https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      },
    };
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          that.log(`${JSON.stringify(err)}`);
          that.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              return;
            }
            $.isLogin = true;
            if(data['base']){
                $.nickName = data['base'].nickname;
            }else{
                $.nickName = $.UserName
            }
          } else {
            that.log(`京东服务器返回空数据`);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function jsonParse(str) {
  if (typeof str == 'string') {
    try {
      return JSON.parse(str);
    } catch (e) {
      that.log(e);
      $.msg(
        $.name,
        '',
        '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie'
      );
      return [];
    }
  }
}
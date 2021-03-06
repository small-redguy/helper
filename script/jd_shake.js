const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [],
	cookie = '';
let helpAuthor = false; //为作者助力的开关
if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) => {
		cookiesArr.push(jdCookieNode[item])
	})
	if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') that.log = () => {};
} else {
	let cookiesData = $.getdata('CookiesJD') || "[]";
	cookiesData = JSON.parse(cookiesData);
	cookiesArr = cookiesData.map(item => item.cookie);
	cookiesArr.reverse();
	cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
	cookiesArr.reverse();
	cookiesArr = cookiesArr.filter(item => !!item);
}
let originCookie,actID,actsID,taskToken,taskId,itemId,body;
var _0xodp = 'jsjiami.com.v6',
	_0x20c3 = [_0xodp, '5LqI5Liz6LWo5Y2/', 'w5fCoWvClyE=', 'CMONwok2IiPDi8KA', 'F8KfAw==',
		'wqLDlsKrwp3DvknCgsKHc8KfHsOYLcKOHX7ChsKAwo3CisOnPzliNTzCiMKoFQ7CvCMDDibDmgLCvQ==', 'DSnCuBTCnQ==',
		'V8Klw48HwqrDhcKQf8KDwqk5bm9SeGc6wrhJbsKWwopcwpUzDcOlPMKzNcOMw48EXg==', 'CsKLOMKaew==', 'Vm4qw4PCqA==',
		'MnZjwrM8wo/DscKhTsKhSwV7wrNuWcOZ', 'E8OIwogAOg==', 'I8KFQ8O7SQ==', 'wo1Yw6k6w6w=',
		'woEbwocOWsOKW0F+wpPDmyDCisKBZ8OVfMK2dVVOLcKGw5s9w6HDnX/DtcObfcOfwqLCpsK2P8OuO2hrwrEgBDrChsKTRivDjUbDlcO8ZUnCtRUSW8OTw5zDnA4hUEMvw6nDrTLDpsObUHvDqcONbMKWV3LCjR9fw7tfwpjCjMK1L3ZnOsKYwp1wVsKAw7kFX8KZc8OycHjDll9K',
		'C3NeJV7Dpg40f8O2w4XCsA/Cr8Ovw5U5YsOswr7DmzDDssOKw6nDi8OEIFMo', 'K8ODw6g5wo4=',
		'HcO9wpkCwqrCmsONHsKDwrQ1YjheMC82wr1Jb8OVwoZHwq8+DMOhMMOoZ8KUwoQYWMKZP1txGDo=', 'BwLCqhQ=', 'w5rDkEDCng==',
		'w494wqfClsKO', 'TFs6w7jCsynDl29cZsKmwrtlLydqU8OMawrDqsO5NnwEWsKDw4rCkMOyQHrCthfCgGgb', 'wprDtcKNZAU=',
		'XMKfREUPRzZNwoc=', 'w7rCnAcjw5o=', 'PF1gwrVG', 'wr9Ew5wcw5g=', 'wrXDmMKQVwPDjA==', 'wrDDpsK+wpnDrA==',
		'KkzDpGk=', 'ex84w587dcKTw6DDow==', 'Jnxmwqpk', 'eAPDsw==', 'FR0sMGBK', 'wrfDhcOCw4t3', 'woEtaBg=',
		'LcK+RsOQSw==', 'UCLDocOvFw==', 'LQJ/w4I=', 'w45IVgRfw6I=', 'B0/DgsKC', 'wosKwpIQ', 'wpbDhcOub1k=',
		'fsKSw68owpDCu8OeIsKQ', 'IMK4XMO+e18=', 'wrPDmsKVwqnDgg==', 'CgwjI2FR', 'HMO9wrgbJQY=', 'IkLDtw==',
		'5Lug5aWP5rCh5p6S5pCx5LuE5pGI5ZO444OO', 'wqDDncOqwqTDuRI=', 'JcOLODPCpHfCqMK1w7Zt', 'w6DClh0W',
		'5Lms5Lqx6Lat5Y+5', 'QwjDpMO+Dg==', 'wrA/eQsjw7/DqcOC', 'IB/Dr8OzGcKr772RCw==', 'wpnDjA4k', 'wrzDn8OO',
		'RAfDrcO+', 'VGtXMwzvvogE', 'L8K8RsO6Zw==', 'wpLDr+Wkvui3l3jCouWNmOWYs8KCw4o=', 'w5rCoGHClw==',
		'5rGr5p6r5omi5aa75p635L2p', 'wonDgBs9w4I=', 'BMKbBMKXHRg=', 'wqfDqsOzSkw=', 'IkLDpHzCosKSFsK3QcO+', 'w4PCiE0=',
		'JcK9NMKrchjDvsOj', 'QsOiw5BTHMKlWFpBajTCm8KgekNIwrnDkEk=', 'BD5tYm0=', 'w4ZIwo3Cr8Kj', 'w492wqbCkQ==',
		'BMO9woIGAg==', 'wrLDjcK1fTE=', '5b2V5buQ772F', 'W2k3CsKW', 'EA9UZQ==', 'NcKnIsK4eAXDmw==', 'A8OlIxQ=',
		'w5LDp1bCmHcF', 'w4dKUThhw4jCtntwwrPDjcOkw6jCoA==', 'wqfDnWrDgGTCi8OWXcOw', 'w4JSYwB3w5TCgl9w', 'IcKUwpU=',
		'wqw6CnvDlsOnwosLw4Q=', 'M8KhIMK8eCLDgMO+w78rcEUBw5s=', 'M8KJK0g=', 'BgtTcVdh', '55mO5L665oC/5YuV',
		'wrvDi8OXwr7DsQM=', 'w5DCqG8GwpwLwpUfw5s=', 'VwUsw4JmS0ghw78BYlAAwq4=', 'PcO3HTXCiQ==', 'wqXDgcOD',
		'5oCb5ZWb6I6A5b6C', 'IsKzNcK6', 'wosPw6g3LCM=', 'J8KjwoUyWG7Dt8OWw5M=', 'D2wBw70lwqIHw78=', 'wqTDjMO/bw==',
		'X2FMKQ/Cog==', 'w43Du2TCmnoDwojDgMKN', 'wrhvw55Aw7DDsUXCqsKUwoVbMQ==', 'X8KZX1YEbj5Gwps=', 'HHwBw70=',
		'dcK/w40xwpg=', 'w4tKVhY=', 'VsOkw7xBFcKl', 'w4LCnmsXFsKVccKHw44=', 'wqDDmcOIw4xRIcOrwoc=', 'wqlvw5o=',
		'5p+w5pac5YKC6ZWb6L6H5LiI5pmM5Lib56ak6YOv6YO2772g', 'wqXDgcODwo7DrwU=', 'HAZzw4RD',
		'5LmD5YG35Yiw5YWt5L+d5ZK45LqU5YmY', 'wqXDjcOaw4lzJw==', 'w7rClgMYw7nDhxfCqw==', 'WRLDocOvA8K3', 'w4DCkzgHw4M=',
		'XmxQLBPCv0Y/UMOywozDvxXCp8OvwpFJfsO2', 'DsOtw5E1wqhkEjjDog==', 'wrFhw44Dw7DDkw==',
		'w5zCj0UQB8KOe8K2w6BrQ8OKS2g6Li/Dj2Q=', 'P1o0w4wYwo8=', 'DcOtw4sqwrh+CzzDuMOhJU0=', 'VSFSwq0=', 'wrJhw5Qc',
		'wpvDicOowrzDtg==', 'wqbDjcOAw5ZhPcOtwp/Cry9HYw==', 'wosrE2vDuA==', 'wqzDgsOs', 'PMKxM8KaIw==', 'MsOLwpgIBQ==',
		'CcO4w4Mqwol4', 'w4bDrUnCgXQGwr/DvsKNw7bClsK9', 'woUKwp0ZXcKY', 'YsKUZ1XCj8OYw4YSwqU0TcKKX8OnwqPDjzI=',
		'w5xbTh5i', 'SAU2w7lVUGoyw6QYaEw=', 'AAzCsBTCuEfDvSkhwrwvUA==', 'fsKSw68owpDCuw==', 'AcKmXmE=',
		'FkHDh8Kaw68TwoPDgjUKwole', 'GVrDjsKbw4kA', 'aksRJsK6w78=', 'ScKEWkAOVwxDwpHCrsOrw7w=', 'DMK6GcK8Ug==',
		'LVssJcK3QA==', 'WcKyw6QUwrbCk8OTNcKBwq0DI20Odw==', 'bjPDrMOxAw==', 'CgYq', '5b2b5biC772F', 'PkzDonvCog==',
		'wp/DiBsr', 'w7rDk0LCp00=', 'HsOtw5Y/', 'wqdpw4crw5bDk8Oc', 'C8OrMA==', 'QE46w6k=',
		'wrHDnMKNfwDDisOpw7QkwpknUw/Dmw==', 'w7zCkgMGw4HDig==', 'McORwos=', 'w5rCrnvCkw==', 'AsKfBMKJJwM=',
		'LsOLwo8nCTHDlcKDYMKAEcOENzHChMOlHsOFw5gkYlhgwoI=', 'wqctBG3DgQ==', 'wqzDgcKAworDqAfDpcOHf8KKM8KXK8Od',
		'JU3Du8Ksw7c=', 'IMKNwqIrSA==', 'wpjDrcKmfx8=', 'PMKyQcOt', 'wovDuMOhw4Z3', 'wpVFw791w6k=', 'wpjDvsKqbz7DoA==',
		'CcKjEsKefg==', 'FMKuTVbDj8O2woE=', 'BsKDPMK+HA==', 'BMKiRGDDjMOm', 'OWNtwoZiw50=', 'Iz5kS1E=',
		'EsO4w5Yuwo8xVnLDrcO4Iw3DuH7DqxVrwp5BC2xzw7vDlcOiRsOiwofCmRt2HcO3Uw==', 'wpgaw7JsLXkJf0cOwpxT',
		'Fh3CqQzClVHDrjw8wrouEcOHGsOnw63ChSgFwoTCm8KgfcObAsKBJVJyXcOrR3Y=',
		'w6/ChwAfw4TDnQbCusKqDFsow6UowpHDqsKmw6vCs8KBw5B3NsOycsKmwoFmwpzCicOdO8Ok',
		'HQnCuBDCjAnDphg9wrouW8KEDsK+wq7DnDVYw5rDncOjY8KVHsKINEt+QMOkDWXDqcOGwoYmAgbCvcOIwoIDY1XDtsKnwqBfw4bCkzzCqwDCrsOvw6crw7bCtcKaw4YSwrEqLMOjPTbCkiZdCkTCgcKjw7EkUcKDwpDDiH8wwqVPw6DDscKTwoDChMOaw53CrH45wqLDjBpjZ8O1wpLCnwUaTsKPCcKLwojDqcO0w6LDuzDCj8KswoYXw5HDp8KALMK3ZSjDsXfDtsKJIB8uw5kQw5lEf0DDlyvCizXDisKdEUkfV8KGw4nCnMOBfsKkGMK1wql4wo3DlQ8twoEDScOXwoJBwoDCicKbAV/Dv1RBw7UzF1fDkcO4wr7DqsKNNMKDHBUYbcOSQsOkTMOgZAfChMK4w4LCi2EqJsOpw7dteW/CkinDicOcT0ZNJ8KBHsO6V8O6ScK4YxwzNWzCocKnw5hswr7DqVEtRcORF1jCoAxUesO7wqzDpjNVw4FPdDLDkcOewrvDpWtDPsOobGjCgcOPwqIBccO6wpxLw4YjwpAnwonDoVlvHnnCtVrDtMOLcXfDr8Oww4MJw5cwwoPDjsOIwpbCjhdLWU7Dv8OgLEDCkcKbOsKjw7JAaMOzfsOlwqdgSsKZw5nClMOtIsKlw4hecXHCpAPDq8KNCsO0w5ZWw54uA8Kjw4zCh8OTw5oiw6jCrsKzZMKlPsKrZMOAXXp3IS5gYEoTw4PDuQ0jwrfCrC/DoDzCpcKaw4bCnkVWwoo7KMKCwoDDgXbDnD9ldzpVccO3RcOkfWvCn8K/CcOZw4TDvsKSwrnDkiTDsU46QgRjwpjDiw/Cu8Ohwr1+w5zCrsKKw7rCo8OwIiLDh8OTw5QwMMKwKcKWw6PDpcKOaTfDnQ==',
		'w5LCn0Elwpg=', 'w5ZgwoTCkMKY', 'Q1Unw7jDrDPCnCVbesKuw6FyMXVpWA==', 'woIKwpYOBMKRGAdgw4M=', 'IV7Ds2DCow==',
		'AsKwe8O1Yg==', 'woLDpMKXwqDDiQ==', 'NkrDh2LCiw==', 'c25lwqdpwpI=',
		'GcKyw5cewrzCkcOLbcKVwrFlZmEQe2Z6wq9wZsOLwppZwpM4XsKgPMOieMKI', 'w7zCkgQQw4LDmgI=', 'wosOwoAb',
		'McOUPyfDhjjCuMK5w7Z4QysmG8KeFgY=', 'w4TCpyLCkTc=', 'VAE6w708RHQ6w6YU',
		'EsO4w5Yuwo8xVnLDu8O5ZEnDsX7Doh4ow5JbFSZiwrjDlcOpTsO5wobCqQ1nBsOhd2Bkwpl7wrZ6KcKMwo/DhwBwc2wZDjTCisOeSQ==',
		'Bxk9KHxaw4kPwrQUw4fCi8KUdSrCn8OQK1jCm8Kwwrw1CsO/wrPDlMOacCvDlTs=',
		'P8KcK1nDj8Kew51Bw6Q5DsOYBMO/wrrDkG8vcCHDiMKgw5TDuMOtAsKgw4/CisOyABAlKcOnaWjDgMKFXVgcNw19w63DpQlz', 'E8KpQQ==',
		'OMOQwpo=', 'bsOFw5BhKsKURmp0WRTCp8KN', 'L8OUwp8VFQ==', 'w5rCtFoVwpwNwpA=', 'w5HCv3Qlwow=', 'w53CjVkxDg==',
		'T8K+w4gD', 'wqbDjcK4', 'w6LCmBc=', 'GMKmWnA=', 'w6rDo8KPwqTorbrmsLHlppzoto3vvJ7orJjmorfmnJPnvI7otZPphqLor4o=',
		'wovDiB05w7M=', 'LWTDo3LCpQ==', 'RsKYekMGSTE=', 'I8KSwpFzwpdeSkU=', 'w5vCtE0Lwoc=', 'KMK7IsKwcxfDhcOp',
		'5Lmm5Lq+5p+S5YmM5Zul6L6n5Zmz56uS5pWi5o6B', 'JQxsw6Z4ew==', 'FsONwq0pGA==', '6I2u5Y2r5reF5YqY5L6W5oOL5oqp5YiZ',
		'VcOZw4F+Cw==', 'wrbDicOd',
		'JcKPwoZowqoFCA9EWXRWw4jCt8Kow7LChCrCuxDCh8Krw7HDlMOgwp7Co8OgOcOfEkLChSpIw4oBw53DvMKX', 'QWtY',
		'NcKmM8KycxHDgcOqw6M=', 'JmjClcKgw4s=', 'K8O8wo4sBw==', 'R20rHsKHw5M=', 'GHkLEcK3YGDCscKG', 'McKQDVDDpQ==',
		'CgYqAWdL', 'LEN6wq9f', 'wpYIw7EnIyM=', 'IsKXJcK6Hw==', 'DGDCv8Kew7s=', 'JQxs',
		'5Lm15Lqh5p+z5YqR5Zif6Kyb6ZWX5pe25oyl5LuT56i477yt6K6M5qGi5pye6IeG6Lqb6K2M5aWN57+w57qw5oCe5YS0',
		'SngsV8KewpXCr8Kqwp3CoiNo', 'SjRPwqnCq8OpYgFvZglaGMOVFMK2w7vCsjY=', 'DMOhMgUAFgbDiiPCvg==',
		'TsKbRkAIQz5fwpfCscOTwrzDhn/DsBjCu0k0YcKow4LDigxQwoTDp2DCu8KXTwzCug==',
		'J8KfwpNowqkETnBNRnMdwoHCvMO0wqfDkzTDo07DnsKqwqjCi8O1woPCrsO1JcOVT0DDhDlEw5RXwpLDjsOuDWPDq8KywrwDwpwIw6HDvm0laC8ww67CkwzCiywEw4xnLws7VQ/DncOww77DhS/CgsOqPAvChW4+wqXDksKgTSwwKR7Dh8KUH8OFDBrDh8KRN8KceMK1w57DjW/CpMK7RcOsDFpewr/DksKdXsKrREsdYMKrTAHDu1zDgTXDo0bCuTXCrhsGRcKbw57DgMKrGcOrG8KdHw/DtMKZV8OGwoR7TsOoXl17w6tEWMK8wqxIbhzDkcKGw5TDlcOCw55cdsOsb8O7TjbCgsO6ecKPwoxGwqLDpFPCjF7DpsO9wp4dAnkfwrQmwpTDulMGEDwNw69GZsK6wrnCnnLDgMKrDcKQHl1Jw5VAwpzDvkjDnG0sbmnCklYkN1LCi8OvwpLDnsKzw4zCq3DDlAfDv1bCq21DXMObABPCtsKmw4QWwrxeEUfDl8KIw4Qkw5jCkCDDkMOGw5AgFWNJTcK7w7JPWsK1S0MXLcOHA8KcA8KgRsKe',
		'wrrDhcKmbW8=',
		'44Ga5oyK56e+44GU6K+O5YWU6Iyk5Y2W5LiQ5Lml6LWU5Y+/5Lizw7t0KcOvw7TCiMOQ55mS5oyL5L+m55eIwql/wp4SShfnmp3kuI/kuKXnr6zlip/ojaDlj4Q=',
		'GMKOA8KMOE03w69xJ8OgwpXCixTCoMO7WTN6OcOOOT5wwrp6DmzChsO0w488NTBCEMKCLsKGw74rBsOd', 'w43DsUI=', 'w5F4wrjCgA==',
		'asKdVUco', 'wrnDmMOdw5JWcsKww5HCuSNJY8KJw6AQwqFnJnktwobDqsKrwrfCuMOXB09pw5ZUwrVkKMKswqzDqjI0YMKEw6DCsw==',
		'wrfDpzglw7g=', 'w5HCtEAWwokR', 'KMKjwqBswpQ=', 'wogtaBoF', 'GQ9UZ1M=', 'JcKzVsO8dw==', 'NMONwqArCyvDiA==',
		'RA/Do8OwOMKlYkI=', 'wpfDhgg=', 'fMOtHT/CisK4w47lv7Tlpp7jgbTkuZbkua7ot63ljLU=', 'w4bCiU4FDw==',
		'A3rCgsKhw6DCuD7DtA==', 'cxB1ZMOUDivDqcOeRQ==', 'Cxoq', 'wrfDnMKTVQ==', '5Lul5Lm/6LSt5Y2U',
		'w47Dq0bChlUQwoHDsw==', 'ccOyw6pGN8KweVA=',
		'TOispemGjOaVq+eZpuW8o+iMn+WNmsKQMGxeHcOMwqPCnT57w6FRVMOrw4FpeDwZwpfDlHN3chkZwpfCnMKUw6zDqjHCjMKQwoRJdcK6wrdyB8Osw4zDlw==',
		'GFrDn8KGw7New7/ChTgfwr5fw5/CrMOBMHZbw5LCj3kNFcOkw53CsMOMwqzCggjDi8OxdsOPwr3CpCxtSW3CsVvDng==',
		'XMKOWEgvTytCwpjCpw==', 'wpoFw7QpKTLltpHlpKrmlKFNw54e', 'jsljiamin.com.v6HObEGCQhRGM=='
	];
(function(_0x4166af, _0x51d073, _0x50d9e3) {
	var _0x2aa7b9 = function(_0x3b3259, _0x275d9a, _0x91db0a, _0x4a94da, _0x4da129) {
		_0x275d9a = _0x275d9a >> 0x8, _0x4da129 = 'po';
		var _0x1395f8 = 'shift',
			_0x893937 = 'push';
		if (_0x275d9a < _0x3b3259) {
			while (--_0x3b3259) {
				_0x4a94da = _0x4166af[_0x1395f8]();
				if (_0x275d9a === _0x3b3259) {
					_0x275d9a = _0x4a94da;
					_0x91db0a = _0x4166af[_0x4da129 + 'p']();
				} else if (_0x275d9a && _0x91db0a['replace'](/[lnHObEGCQhRGM=]/g, '') === _0x275d9a) {
					_0x4166af[_0x893937](_0x4a94da);
				}
			}
			_0x4166af[_0x893937](_0x4166af[_0x1395f8]());
		}
		return 0x74cc3;
	};
	return _0x2aa7b9(++_0x51d073, _0x50d9e3) >> _0x51d073 ^ _0x50d9e3;
}(_0x20c3, 0xf4, 0xf400));
var _0x44eb = function(_0x55b360, _0x5a016d) {
	_0x55b360 = ~~'0x' ['concat'](_0x55b360);
	var _0x2f0ad0 = _0x20c3[_0x55b360];
	if (_0x44eb['QzQtIT'] === undefined) {
		(function() {
				var _0x417933;
						try {
							var _0x57f638 = Function('return\x20(function()\x20' +
								'{}.constructor(\x22return\x20this\x22)(\x20)' + ');');
							_0x417933 = _0x57f638();
						} catch (_0x3b8065) {
							_0x417933 = window;
						}
			var _0x580e8f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			_0x417933['atob'] || (_0x417933['atob'] = function(_0x2d284f) {
				var _0x38d1ce = String(_0x2d284f)['replace'](/=+$/, '');
				for (var _0x4e72cf = 0x0, _0x524157, _0x16a295, _0x2e62b1 = 0x0, _0x270e59 =
					''; _0x16a295 = _0x38d1ce['charAt'](_0x2e62b1++); ~_0x16a295 && (_0x524157 =
						_0x4e72cf % 0x4 ? _0x524157 * 0x40 + _0x16a295 : _0x16a295, _0x4e72cf++ % 0x4) ?
					_0x270e59 += String['fromCharCode'](0xff & _0x524157 >> (-0x2 * _0x4e72cf & 0x6)) :
					0x0) {
					_0x16a295 = _0x580e8f['indexOf'](_0x16a295);
				}
				return _0x270e59;
			});
		}());
		var _0x443c72 = function(_0x1782cc, _0x5a016d) {
			var _0x4aecd7 = [],
				_0x8b793a = 0x0,
				_0x21e56d, _0x47cb8d = '',
				_0x2eb9be = '';
			_0x1782cc = atob(_0x1782cc);
			for (var _0x39dade = 0x0, _0x43777e = _0x1782cc['length']; _0x39dade < _0x43777e; _0x39dade++) {
				_0x2eb9be += '%' + ('00' + _0x1782cc['charCodeAt'](_0x39dade)['toString'](0x10))['slice'](-0x2);
			}
			_0x1782cc = decodeURIComponent(_0x2eb9be);
			for (var _0x152572 = 0x0; _0x152572 < 0x100; _0x152572++) {
				_0x4aecd7[_0x152572] = _0x152572;
			}
			for (_0x152572 = 0x0; _0x152572 < 0x100; _0x152572++) {
				_0x8b793a = (_0x8b793a + _0x4aecd7[_0x152572] + _0x5a016d['charCodeAt'](_0x152572 % _0x5a016d[
					'length'])) % 0x100;
				_0x21e56d = _0x4aecd7[_0x152572];
				_0x4aecd7[_0x152572] = _0x4aecd7[_0x8b793a];
				_0x4aecd7[_0x8b793a] = _0x21e56d;
			}
			_0x152572 = 0x0;
			_0x8b793a = 0x0;
			for (var _0x19a4a3 = 0x0; _0x19a4a3 < _0x1782cc['length']; _0x19a4a3++) {
				_0x152572 = (_0x152572 + 0x1) % 0x100;
				_0x8b793a = (_0x8b793a + _0x4aecd7[_0x152572]) % 0x100;
				_0x21e56d = _0x4aecd7[_0x152572];
				_0x4aecd7[_0x152572] = _0x4aecd7[_0x8b793a];
				_0x4aecd7[_0x8b793a] = _0x21e56d;
				_0x47cb8d += String['fromCharCode'](_0x1782cc['charCodeAt'](_0x19a4a3) ^ _0x4aecd7[(_0x4aecd7[
					_0x152572] + _0x4aecd7[_0x8b793a]) % 0x100]);
			}
			return _0x47cb8d;
		};
		_0x44eb['NgavHC'] = _0x443c72;
		_0x44eb['OvbSwt'] = {};
		_0x44eb['QzQtIT'] = !![];
	}
	var _0xc3ef12 = _0x44eb['OvbSwt'][_0x55b360];
	if (_0xc3ef12 === undefined) {
		if (_0x44eb['CAHsVh'] === undefined) {
			_0x44eb['CAHsVh'] = !![];
		}
		_0x2f0ad0 = _0x44eb['NgavHC'](_0x2f0ad0, _0x5a016d);
		_0x44eb['OvbSwt'][_0x55b360] = _0x2f0ad0;
	} else {
		_0x2f0ad0 = _0xc3ef12;
	}
	return _0x2f0ad0;
};
!(async () => {
	var _0x11a938 = {
		'LYyAf': _0x44eb('0', 'lRQ4'),
		'rAdKh': _0x44eb('1', '7Pdp'),
		'NvdDV': _0x44eb('2', '8&0b'),
		'oXqbF': _0x44eb('3', 'n%aX'),
		'HXTRU': _0x44eb('4', 'O]S*'),
		'QOJgr': _0x44eb('5', 'Q)jP'),
		'iQjvV': function(_0x552c18) {
			return _0x552c18();
		},
		'CHsTr': 'application/json',
		'EvckI': _0x44eb('6', '@z!l'),
		'LNWon': _0x44eb('7', 'PWy8'),
		'eXRtM': function(_0x2888a4, _0x1a7db5) {
			return _0x2888a4(_0x1a7db5);
		},
		'fikiR': function(_0x5208b4, _0x500c4c, _0x451094) {
			return _0x5208b4(_0x500c4c, _0x451094);
		},
		'AffkP': function(_0x3bb544, _0x5283ce, _0x3d4ee) {
			return _0x3bb544(_0x5283ce, _0x3d4ee);
		},
		'VheaX': function(_0xf481e6, _0x3ac654) {
			return _0xf481e6 > _0x3ac654;
		},
		'yxJDO': function(_0x5681af, _0x1cecc7) {
			return _0x5681af < _0x1cecc7;
		},
		'kfBFj': function(_0x58703b) {
			return _0x58703b();
		}
	};
	if (!cookiesArr[0x0]) {
		$[_0x44eb('8', '^JeB')]($[_0x44eb('9', 'IJYy')], _0x11a938[_0x44eb('a', 'n%aX')], _0x44eb('b',
		'2^p6'), {
			'open-url': _0x11a938[_0x44eb('c', 'O%58')]
		});
		return;
	}
	await _0x11a938['iQjvV'](getACT_ID);
	for (let _0x34777c = 0x0; _0x34777c < cookiesArr[_0x44eb('d', '0$5a')]; _0x34777c++) {
		if (cookiesArr[_0x34777c]) {
			cookie = cookiesArr[_0x34777c];
			originCookie = cookiesArr[_0x34777c];
			$['UserName'] = _0x11a938[_0x44eb('e', 'O]S*')](decodeURIComponent, cookie[_0x44eb('f', 'K&6Z')](
				/pt_pin=(.+?);/) && cookie[_0x44eb('10', 'v^h*')](/pt_pin=(.+?);/)[0x1]);
			$[_0x44eb('11', 'Ry$H')] = _0x34777c + 0x1;
			$[_0x44eb('12', '^uAu')] = !![];
			$[_0x44eb('13', 'v9GL')] = '';
			await _0x11a938['iQjvV'](TotalBean);
			that[_0x44eb('14', 'O%58')](_0x44eb('15', 'CYQT') + $[_0x44eb('16', ']^ZG')] + '】' + ($[
				'nickName'] || $[_0x44eb('17', 'gmFx')]) + _0x44eb('18', 'e@MP'));
			if (!$['isLogin']) {
				$[_0x44eb('19', 'MtqE')]($[_0x44eb('1a', '#FtW')], '【提示】cookie已失效', _0x44eb('1b', '9Wuu') + $[
						'index'] + '\x20' + ($[_0x44eb('1c', '^JeB')] || $[_0x44eb('1d', 'LzwQ')]) +
					_0x44eb('1e', 'on!x'), {
						'open-url': _0x44eb('1f', 'ZW5t')
					});
				if ($['isNode']()) {
					await notify[_0x44eb('20', 'n%aX')]($['name'] + _0x44eb('21', 'J9ze') + $['UserName'],
						_0x44eb('22', '!vY&') + $[_0x44eb('23', '$pWB')] + '\x20' + $[_0x44eb('24',
						'^uAu')] + '\x0a请重新登录获取cookie');
				}
				continue;
			}
			if (helpAuthor) {
				function _0x438755() {
					return new Promise(_0x161426 => {
						$[_0x44eb('25', 'PWy8')]({
							'url': _0x44eb('26', 'bo(q')
						}, (_0x4678b6, _0x4ac057, _0x396401) => {
							try {
								if (_0x396401) {
									$[_0x44eb('27', '@Z2A')] = JSON['parse'](_0x396401);
								};
							} catch (_0x3696fb) {
								that['log'](_0x3696fb);
							} finally {
								_0x161426();
							};
						});
					});
				}

				function _0x449624(_0x166ad0, _0x3c9e1a) {
					let _0x179ac5 = {
						'url': _0x44eb('28', 'NCWx'),
						'headers': {
							'Host': _0x11a938[_0x44eb('29', 'on!x')],
							'Content-Type': 'application/x-www-form-urlencoded',
							'Origin': _0x11a938[_0x44eb('2a', '!vY&')],
							'Accept-Encoding': _0x44eb('2b', 'sVWw'),
							'Cookie': cookie,
							'Connection': _0x11a938[_0x44eb('2c', '^uAu')],
							'Accept': _0x11a938[_0x44eb('2d', 'Ry$H')],
							'User-Agent': _0x11a938[_0x44eb('2e', '6!tw')],
							'Referer': _0x44eb('2f', '*&2P') + _0x166ad0 + _0x44eb('30', 'jSR)'),
							'Accept-Language': _0x11a938[_0x44eb('31', 'p47v')]
						},
						'body': 'functionId=cutPriceByUser&body={\x22activityId\x22:\x22' + _0x166ad0 +
							_0x44eb('32', 'NCWx') + _0x3c9e1a +
							',\x22userPic\x22:\x22\x22}&client=wh5&clientVersion=1.0.0'
					};
					return new Promise(_0x4be1ed => {
						$[_0x44eb('33', '@Z2A')](_0x179ac5, (_0x1a2bcd, _0x2a0bf3, _0x318f47) => {
							if (_0x318f47) {
								$[_0x44eb('34', '^JeB')] = JSON[_0x44eb('35', 'IJYy')](
									_0x318f47);
								_0x4be1ed();
							};
						});
					});
				}

				function _0x429f1f(_0x17bd20, _0x2c5504) {
					let _0x32fb7b = {
						'url': _0x44eb('36', '!vY&'),
						'headers': {
							'Content-Type': _0x11a938[_0x44eb('37', '#FtW')]
						},
						'body': JSON[_0x44eb('38', 'n%aX')]({
							'actID': _0x17bd20,
							'actsID': _0x2c5504,
							'done': 0x1
						})
					};
					return new Promise(_0x1d9115 => {
						var _0x805757 = {
							'tkwPw': function(_0x4f32e8) {
								return _0x11a938['iQjvV'](_0x4f32e8);
							}
						};
						$['post'](_0x32fb7b, (_0x5c3dc4, _0x3a0d65, _0x38365c) => {
							_0x805757[_0x44eb('39', 'uEv%')](_0x1d9115);
						});
					});
				}
				await _0x11a938[_0x44eb('3a', 'sVWw')](_0x438755);
				if ($[_0x44eb('3b', '6!tw')]['data'][_0x44eb('3c', '#FtW')] !== 0x0) {
					for (let _0x34777c = 0x0; _0x34777c < $[_0x44eb('3d', 'bo(q')][_0x44eb('3e', 'yT]0')][
							'length'
						]; _0x34777c++) {
						var _0x438a56 = _0x44eb('3f', '9Wuu')[_0x44eb('40', 'sVWw')]('|'),
							_0x359a1d = 0x0;
						while (!![]) {
							switch (_0x438a56[_0x359a1d++]) {
								case '0':
									if ($[_0x44eb('41', 'v9GL')] && $['Res'][_0x44eb('42', 'MtqE')] === 0x4) {
										await _0x11a938[_0x44eb('43', '2^p6')](_0x429f1f, actID, actsID);
									}
									continue;
								case '1':
									await _0x11a938['AffkP'](_0x449624, actID, actsID);
									continue;
								case '2':
									actID = $[_0x44eb('27', '@Z2A')][_0x44eb('44', 'K&6Z')][_0x34777c][_0x44eb(
										'45', 'Ry$H')];
									continue;
								case '3':
									actsID = $[_0x44eb('46', 'v9GL')][_0x44eb('47', '9Wuu')][_0x34777c][_0x44eb(
										'48', 'S2#E')];
									continue;
								case '4':
									await $[_0x44eb('49', 'ZW5t')](0x5dc);
									continue;
							}
							break;
						}
					};
				};
			};
			$[_0x44eb('4a', '*&2P')] = 0x0;
			if (_0x11a938[_0x44eb('4b', 'Q)jP')]($[_0x44eb('4c', 'NCWx')][_0x44eb('4d', 'Ry$H')], 0x0)) {
				for (let _0x34777c = 0x0; _0x11a938[_0x44eb('4e', 'bo(q')](_0x34777c, $['ACT_IDarr'][_0x44eb(
						'4f', 'MtqE')]); _0x34777c++) {
					$['ACT_ID'] = $['ACT_IDarr'][_0x34777c][_0x44eb('50', '^uAu')];
					await _0x11a938['kfBFj'](shake);
				}
			} else {
				that[_0x44eb('51', 'yT]0')](_0x44eb('52', 'v9GL'));
			}
			if ($['bean'] > 0xa) {
				if ($[_0x44eb('53', 'Qu%y')]()) {
					await notify[_0x44eb('54', 'xD26')]('' + $[_0x44eb('55', 'uEv%')], _0x44eb('56', 'Q)jP') +
						$[_0x44eb('57', 'v9GL')] + '\x20' + $[_0x44eb('58', 'K&6Z')] + _0x44eb('59',
						'v9GL') + $[_0x44eb('5a', 'O%58')] + '个豆子进账。');
				} else [$[_0x44eb('5b', '2^p6')]($[_0x44eb('5c', 'v9GL')], _0x44eb('5d', 'jSR)') + $['bean'] +
					'个豆子进账。')];
			}
		}
	}
})()[_0x44eb('5e', 'Ry$H')](_0x506157 => {
	$['log']('', '❌\x20' + $['name'] + _0x44eb('5f', '$pWB') + _0x506157 + '!', '');
})['finally'](() => {
	$[_0x44eb('60', '$pWB')]();
});
async function shake() {
	var _0x5bfa73 = {
		'ritwT': function(_0x26a07b) {
			return _0x26a07b();
		},
		'gGxDM': function(_0x758756, _0x2f9cd5) {
			return _0x758756 > _0x2f9cd5;
		},
		'aNiZs': function(_0x493a5c, _0x5a8d35) {
			return _0x493a5c < _0x5a8d35;
		},
		'iawkN': _0x44eb('61', 'bo(q')
	};
	await _0x5bfa73[_0x44eb('62', 'O%58')](getHomedata);
	if ($[_0x44eb('63', 'PWy8')]) {
		await task();
	}
	await getHomedata();
	if (_0x5bfa73[_0x44eb('64', 'Q)jP')]($['lotteryNum'], 0x0)) {
		for (let _0x5893a3 = 0x0; _0x5bfa73['aNiZs'](_0x5893a3, $[_0x44eb('65', 'yT]0')]); _0x5893a3++) {
			await lottery();
			await $['wait'](0x3e8);
		}
	} else {
		that[_0x44eb('66', ']^ZG')](_0x5bfa73['iawkN']);
	}
}

function lottery() {
	var _0x1aa0ba = {
		'pPMfV': function(_0x460110, _0x1e8132) {
			return _0x460110 === _0x1e8132;
		},
		'eKUZm': _0x44eb('67', 'on!x'),
		'jCYnd': 'jBeanAwardVo',
		'yQXJH': function(_0x8feb5a) {
			return _0x8feb5a();
		},
		'YCnBn': function(_0x40bea8, _0x1deb6a, _0x3e48d0) {
			return _0x40bea8(_0x1deb6a, _0x3e48d0);
		},
		'kpKMF': _0x44eb('68', 'LzwQ')
	};
	return new Promise(_0x168769 => {
		var _0x1a36b2 = {
			'BbjCn': function(_0x1d4769, _0x244dcb) {
				return _0x1aa0ba[_0x44eb('69', 'v^h*')](_0x1d4769, _0x244dcb);
			},
			'WUSuC': _0x1aa0ba['eKUZm'],
			'kYKbc': _0x1aa0ba['jCYnd'],
			'JnvFA': function(_0x54f1dd, _0x4f813a) {
				return _0x54f1dd(_0x4f813a);
			},
			'UexgI': function(_0x3bf9e1) {
				return _0x1aa0ba[_0x44eb('6a', 'IJYy')](_0x3bf9e1);
			}
		};
		$[_0x44eb('6b', 'IJYy')](_0x1aa0ba[_0x44eb('6c', '^uAu')](postUrl, _0x1aa0ba[_0x44eb('6d', '#FtW')], {
			'appId': $['ACT_ID'],
			'taskId': 0x1
		}), (_0x74e2e7, _0x529d6e, _0x24299d) => {
			try {
				if (_0x74e2e7) {
					that['log'](_0x44eb('6e', '&Py7') + JSON['stringify'](_0x74e2e7));
				} else {
					_0x24299d = JSON[_0x44eb('6f', 'lRQ4')](_0x24299d);
					if (_0x24299d[_0x44eb('47', '9Wuu')] && _0x1a36b2['BbjCn'](_0x24299d[_0x44eb('70',
							'v^h*')][_0x44eb('71', 'on!x')], !![])) {
						if (_0x24299d[_0x44eb('72', '8&0b')][_0x44eb('73', '^JeB')][_0x44eb('74',
								'S2#E')](_0x44eb('75', 'nIYp'))) {
							if (_0x24299d['data']['result'][_0x44eb('76', 'S2#E')]['hasOwnProperty'](
									_0x1a36b2['WUSuC'])) {
								that[_0x44eb('77', 'O]S*')]('获得一张' + _0x24299d['data']['result'][
									_0x44eb('78', 'Y1ur')
								]['couponVo'][_0x44eb('79', 'on!x')] + '-' + _0x24299d[_0x44eb(
									'7a', '&Py7')][_0x44eb('7b', 'v^h*')]['myAwardVo'][
									'couponVo'
								]['quota'] + _0x44eb('7c', 'bo(q'));
							}
							if (_0x24299d['data'][_0x44eb('7d', 'Qu%y')][_0x44eb('7e', '0$5a')][_0x44eb(
									'7f', '6@EB')](_0x1a36b2[_0x44eb('80', 'xD26')])) {
								that[_0x44eb('81', 'Qu%y')](_0x44eb('82', 'CYQT') + _0x24299d[
										_0x44eb('83', 'on!x')][_0x44eb('84', 'J9ze')][_0x44eb('85',
										'@z!l')]['jBeanAwardVo'][_0x44eb('86', '*im(')] + '个' +
									_0x24299d[_0x44eb('87', 'Q)jP')][_0x44eb('88', 'jSR)')][_0x44eb(
										'89', '^JeB')][_0x44eb('8a', 'BlkZ')][_0x44eb('8b', 'n%aX')]
									);
								$[_0x44eb('8c', '*im(')] += _0x1a36b2[_0x44eb('8d', 'NCWx')](parseInt,
									_0x24299d[_0x44eb('8e', 'S2#E')][_0x44eb('8f', 'LzwQ')][_0x44eb(
										'90', ']^ZG')]['jBeanAwardVo'][_0x44eb('91', '2^p6')]);
							}
						} else {
							that[_0x44eb('92', '6!tw')](_0x44eb('93', 'J9ze'));
						}
					}
				}
			} catch (_0x59acf6) {
				$[_0x44eb('94', 'Qu%y')](_0x59acf6);
			} finally {
				_0x1a36b2[_0x44eb('95', '9Wuu')](_0x168769);
			}
		});
	});
}
async function task() {
	var _0xaa244c = {
		'Nihyb': function(_0x5d527e, _0x32d969) {
			return _0x5d527e !== _0x32d969;
		},
		'NdHtn': function(_0x552eef, _0x44cfbd) {
			return _0x552eef < _0x44cfbd;
		},
		'RgLwk': function(_0x25a551, _0x5ce984) {
			return _0x25a551 * _0x5ce984;
		},
		'JhXgO': function(_0x5e852f, _0x2b6746) {
			return _0x5e852f(_0x2b6746);
		},
		'LKDfh': _0x44eb('96', 'yT]0'),
		'outLi': function(_0x53f1a2, _0x35b5c2) {
			return _0x53f1a2 !== _0x35b5c2;
		},
		'mSMRH': function(_0x359d40, _0x3cb66a) {
			return _0x359d40 === _0x3cb66a;
		}
	};
	for (let _0x3ed8da of $[_0x44eb('97', '2^p6')]) {
		switch (_0x3ed8da[_0x44eb('98', 'uEv%')]) {
			case 0x9:
				if (_0xaa244c['Nihyb'](_0x3ed8da[_0x44eb('99', 'v9GL')], 0x2)) {
					for (let _0x3b267f = 0x0; _0xaa244c[_0x44eb('9a', 'uEv%')](_0x3b267f, _0x3ed8da[_0x44eb('9b',
							'jSR)')]['length']); _0x3b267f++) {
						taskToken = _0x3ed8da['shoppingActivityVos'][_0x3b267f][_0x44eb('9c', 'p47v')];
						taskId = _0x3ed8da[_0x44eb('9d', '6!tw')];
						itemId = _0x3ed8da[_0x44eb('9e', ']^ZG')][_0x3b267f]['itemId'];
						body = {
							'appId': $[_0x44eb('9f', '*im(')],
							'taskToken': taskToken,
							'taskId': taskId,
							'itemId': itemId,
							'actionType': 0x1
						};
						await doTask(body);
						if (_0x3ed8da[_0x44eb('a0', 'p47v')] === 0x0) {
							await $[_0x44eb('a1', '7Pdp')](0x41a);
						} else {
							await $[_0x44eb('a2', '6!tw')](_0xaa244c[_0x44eb('a3', 'Qu%y')](_0x3ed8da[_0x44eb('a4',
								'2^p6')], 0x41a));
						}
						body = {
							'appId': $['ACT_ID'],
							'taskToken': taskToken,
							'taskId': taskId,
							'itemId': itemId,
							'actionType': 0x0
						};
						await _0xaa244c[_0x44eb('a5', 'Y1ur')](doTask, body);
						await $['wait'](0x7d0);
					}
				}
				break;
			case 0x15:
				that[_0x44eb('a6', 'Q)jP')](_0xaa244c[_0x44eb('a7', 'PWy8')]);
				break;
			case 0x1:
				if (_0xaa244c[_0x44eb('a8', '^uAu')](_0x3ed8da[_0x44eb('a9', 'p47v')], 0x2)) {
					for (let _0x5a3fd5 = 0x0; _0x5a3fd5 < _0x3ed8da[_0x44eb('aa', '^JeB')][_0x44eb('ab',
						'*&2P')]; _0x5a3fd5++) {
						var _0x4c8418 = _0x44eb('ac', '&Py7')[_0x44eb('ad', 'S2#E')]('|'),
							_0x37d3eb = 0x0;
						while (!![]) {
							switch (_0x4c8418[_0x37d3eb++]) {
								case '0':
									if (_0xaa244c['mSMRH'](_0x3ed8da[_0x44eb('ae', '6@EB')], 0x0)) {
										await $['wait'](0x41a);
									} else {
										await $['wait'](_0xaa244c['RgLwk'](_0x3ed8da[_0x44eb('af', '@Z2A')],
										0x41a));
									}
									continue;
								case '1':
									body = {
										'appId': $[_0x44eb('b0', 'NCWx')],
										'taskToken': taskToken,
										'taskId': taskId,
										'itemId': itemId,
										'actionType': 0x0
									};
									continue;
								case '2':
									await $[_0x44eb('b1', 'CYQT')](0x7d0);
									continue;
								case '3':
									itemId = _0x3ed8da[_0x44eb('b2', 'ZW5t')][_0x5a3fd5][_0x44eb('b3', 'ZW5t')];
									continue;
								case '4':
									body = {
										'appId': $[_0x44eb('b4', 'lRQ4')],
										'taskToken': taskToken,
										'taskId': taskId,
										'itemId': itemId,
										'actionType': 0x1
									};
									continue;
								case '5':
									taskToken = _0x3ed8da[_0x44eb('b5', 'n%aX')][_0x5a3fd5]['taskToken'];
									continue;
								case '6':
									await _0xaa244c[_0x44eb('b6', 'on!x')](doTask, body);
									continue;
								case '7':
									await _0xaa244c['JhXgO'](doTask, body);
									continue;
								case '8':
									taskId = _0x3ed8da[_0x44eb('b7', 'e@MP')];
									continue;
							}
							break;
						}
					}
				}
				break;
			default:
				break;
		}
	}
}

function doTask(_0x170fd3) {
	var _0xe90687 = {
		'ZQgJV': function(_0x3846cf, _0x503c79) {
			return _0x3846cf === _0x503c79;
		},
		'fnOav': function(_0x4aabbf) {
			return _0x4aabbf();
		},
		'DUlju': _0x44eb('b8', 'NCWx')
	};
	return new Promise(_0x3e9fbe => {
		$['post'](postUrl(_0xe90687[_0x44eb('b9', 'v9GL')], _0x170fd3), (_0xc2e036, _0x3d2977, _0x1af867) => {
			try {
				if (_0xc2e036) {
					that[_0x44eb('ba', 'MtqE')](_0x44eb('bb', 'e@MP') + JSON['stringify'](
					_0xc2e036));
				} else {
					_0x1af867 = JSON[_0x44eb('bc', 'yT]0')](_0x1af867);
					if (_0x1af867[_0x44eb('bd', 'O%58')] && _0xe90687[_0x44eb('be', '^JeB')](_0x1af867[
							'code'], 0x0)) {
						switch (_0x1af867[_0x44eb('bf', 'p47v')][_0x44eb('c0', '6!tw')]) {
							case 0x1:
								that[_0x44eb('c1', '8&0b')](_0x1af867[_0x44eb('c2', '!vY&')][
									'bizMsg']);
								break;
							case 0x0:
								if (_0x1af867[_0x44eb('70', 'v^h*')][_0x44eb('c3', '#FtW')](_0x44eb(
										'c4', 'uEv%'))) {
									that[_0x44eb('c5', '^uAu')](_0x1af867[_0x44eb('c6', '$pWB')][
										_0x44eb('c7', 'PWy8')
									][_0x44eb('c8', '^uAu')]);
								}
								break;
							default:
								break;
						}
					}
				}
			} catch (_0x5c9e3a) {
				$['logErr'](_0x5c9e3a);
			} finally {
				_0xe90687[_0x44eb('c9', 'Y1ur')](_0x3e9fbe);
			}
		});
	});
}

function getHomedata() {
	var _0x1ae34a = {
		'UcPZw': function(_0x43a6af, _0x5a69fd) {
			return _0x43a6af === _0x5a69fd;
		},
		'jWfnq': function(_0xbf0773, _0x4d23a8) {
			return _0xbf0773(_0x4d23a8);
		},
		'APXOh': function(_0x19a325) {
			return _0x19a325();
		},
		'ZTHdR': function(_0x1d331f, _0x440829, _0x42c9ca) {
			return _0x1d331f(_0x440829, _0x42c9ca);
		},
		'GhDTw': _0x44eb('ca', 'bo(q')
	};
	return new Promise(_0x2cd5b4 => {
		var _0x262385 = {
			'OqSEc': function(_0x5b2f2b, _0x41cee2) {
				return _0x5b2f2b === _0x41cee2;
			},
			'vyKBW': function(_0x74cc2c, _0x587d77) {
				return _0x1ae34a[_0x44eb('cb', 'ZW5t')](_0x74cc2c, _0x587d77);
			},
			'hfeGW': function(_0x10fd54, _0x43cc3f) {
				return _0x1ae34a[_0x44eb('cc', '@z!l')](_0x10fd54, _0x43cc3f);
			},
			'WPDOj': function(_0x1de442) {
				return _0x1ae34a[_0x44eb('cd', '#FtW')](_0x1de442);
			}
		};
		$[_0x44eb('ce', 'Ry$H')](_0x1ae34a[_0x44eb('cf', '2^p6')](postUrl, _0x1ae34a[_0x44eb('d0', 'BlkZ')], {
			'appId': $[_0x44eb('d1', '#FtW')]
		}), (_0x2f279c, _0x9270bd, _0x11fbf5) => {
			try {
				if (_0x2f279c) {
					that['log']('异常：' + JSON['stringify'](_0x2f279c));
				} else {
					_0x11fbf5 = JSON['parse'](_0x11fbf5);
					if (_0x11fbf5[_0x44eb('c2', '!vY&')] && _0x262385[_0x44eb('d2', 'on!x')](_0x11fbf5[
							_0x44eb('c2', '!vY&')][_0x44eb('d3', 'CYQT')], 0x0) && _0x262385[_0x44eb(
							'd4', 'PWy8')](_0x11fbf5['data']['success'], !![])) {
						$[_0x44eb('63', 'PWy8')] = _0x11fbf5['data'][_0x44eb('d5', 'CYQT')]['taskVos'];
						$['lotteryNum'] = _0x262385['hfeGW'](parseInt, _0x11fbf5['data']['result'][
							'lotteryNum'
						]);
					}
				}
			} catch (_0x1f230e) {
				$[_0x44eb('d6', 'sVWw')](_0x1f230e);
			} finally {
				_0x262385[_0x44eb('d7', 'v^h*')](_0x2cd5b4);
			}
		});
	});
}

function postUrl(_0x4165a3, _0x4dca08) {
	var _0x5799b2 = {
		'gYRYI': _0x44eb('d8', 'p47v'),
		'oNoTe': _0x44eb('d9', 'J9ze'),
		'iyQus': _0x44eb('da', '@Z2A'),
		'oschd': _0x44eb('db', 'uEv%'),
		'NmIlm': _0x44eb('dc', '@Z2A'),
		'HFHMD': 'https://h5.m.jd.com/babelDiy/Zeus/4Ro286LnfotzEnXJ1mqPEgLHkphx/index.html?babelChannel=ttt6&lng=0.000000&lat=0.000000&sid=&un_area=',
		'xgWjL': 'zh-cn'
	};
	return {
		'url': _0x5799b2['gYRYI'],
		'headers': {
			'Host': _0x5799b2[_0x44eb('dd', '0$5a')],
			'Content-Type': _0x5799b2[_0x44eb('de', 'IJYy')],
			'Origin': 'https://h5.m.jd.com',
			'Accept-Encoding': _0x44eb('df', '!vY&'),
			'Cookie': cookie,
			'Connection': _0x44eb('e0', '*&2P'),
			'Accept': _0x5799b2[_0x44eb('e1', 'yT]0')],
			'User-Agent': _0x5799b2[_0x44eb('e2', 'Ry$H')],
			'Referer': _0x5799b2[_0x44eb('e3', 'bo(q')],
			'Accept-Language': _0x5799b2[_0x44eb('e4', 'yT]0')]
		},
		'body': 'functionId=' + _0x4165a3 + _0x44eb('e5', 'sVWw') + JSON['stringify'](_0x4dca08) + _0x44eb('e6', 'NCWx')
	};
}

function TotalBean() {
	var _0x56f3ea = {
		'awagy': function(_0x534e88, _0x541d33) {
			return _0x534e88 === _0x541d33;
		},
		'cIszb': _0x44eb('e7', 'uEv%'),
		'feczz': _0x44eb('e8', '*&2P'),
		'KsAmt': function(_0x599e2b) {
			return _0x599e2b();
		},
		'TxNdI': _0x44eb('e9', 'xD26'),
		'QZqJZ': _0x44eb('ea', '$pWB'),
		'BugcP': _0x44eb('eb', '6@EB'),
		'rjsQy': 'jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2\x20CFNetwork/1206\x20Darwin/20.1.0',
		'lnZTq': 'JDUA'
	};
	return new Promise(async _0x180bf4 => {
		const _0x49c3e9 = {
			'url': _0x44eb('ec', 'p47v'),
			'headers': {
				'Accept': _0x44eb('ed', 'MtqE'),
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept-Encoding': _0x56f3ea['TxNdI'],
				'Accept-Language': _0x56f3ea['QZqJZ'],
				'Connection': _0x56f3ea['BugcP'],
				'Cookie': cookie,
				'Referer': _0x44eb('ee', '&Py7'),
				'User-Agent': $['isNode']() ? process[_0x44eb('ef', 'CYQT')]['JD_USER_AGENT'] ? process[
						_0x44eb('f0', '^uAu')][_0x44eb('f1', 'LzwQ')] : _0x56f3ea[_0x44eb('f2',
					'^uAu')] : $['getdata']('JDUA') ? $[_0x44eb('f3', '0$5a')](_0x56f3ea[_0x44eb('f4',
						'0$5a')]) : _0x56f3ea[_0x44eb('f5', ']^ZG')]
			}
		};
		$[_0x44eb('f6', 'NCWx')](_0x49c3e9, (_0x30a450, _0x148ac8, _0x345749) => {
			try {
				if (_0x30a450) {
					that[_0x44eb('f7', 'bo(q')]('' + JSON['stringify'](_0x30a450));
					that[_0x44eb('f8', 'uEv%')]($[_0x44eb('f9', 'CYQT')] + _0x44eb('fa',
					'bo(q'));
				} else {
					if (_0x345749) {
						_0x345749 = JSON[_0x44eb('fb', 'O%58')](_0x345749);
						if (_0x56f3ea['awagy'](_0x345749[_0x56f3ea[_0x44eb('fc', 'yT]0')]], 0xd)) {
							$[_0x44eb('fd', 'n%aX')] = ![];
							return;
						}
						$[_0x44eb('fe', 'O]S*')] = _0x345749[_0x56f3ea[_0x44eb('ff', '0$5a')]][
							_0x44eb('100', 'on!x')
						];
					} else {
						that['log'](_0x44eb('101', 'bo(q'));
					}
				}
			} catch (_0x4f6dc1) {
				$[_0x44eb('102', '9Wuu')](_0x4f6dc1, _0x148ac8);
			} finally {
				_0x56f3ea[_0x44eb('103', '^uAu')](_0x180bf4);
			}
		});
	});
}

function getACT_ID() {
	var _0x43bb81 = {
		'qXNJr': _0x44eb('104', '#FtW'),
		'jlxAG': function(_0x19fbc7) {
			return _0x19fbc7();
		}
	};
	return new Promise(_0x116b84 => {
		var _0x2279b3 = {
			'vBbhk': function(_0x3a5083, _0x531f1f) {
				return _0x3a5083 > _0x531f1f;
			},
			'fxRyY': _0x43bb81[_0x44eb('105', 'LzwQ')],
			'yOplO': function(_0x20f076) {
				return _0x43bb81['jlxAG'](_0x20f076);
			}
		};
		$[_0x44eb('106', '2^p6')]({
			'url': _0x44eb('107', 'O]S*') + Date['now']()
		}, (_0x261187, _0x4f4dca, _0x172640) => {
			try {
				if (_0x261187) {
					that[_0x44eb('108', 'jSR)')]('' + JSON[_0x44eb('109', 'on!x')](_0x261187));
				} else {
					if (_0x172640) {
						_0x172640 = JSON[_0x44eb('10a', 'gmFx')](_0x172640);
						if (_0x2279b3[_0x44eb('10b', '^uAu')](_0x172640['data'][_0x44eb('10c', 'lRQ4')],
								0x0)) {
							$[_0x44eb('10d', 'e@MP')] = _0x172640['data'];
							that['log'](_0x2279b3[_0x44eb('10e', '&Py7')]);
						} else {
							$['ACT_IDarr'] = [];
						}
					}
				}
			} catch (_0x113296) {
				$[_0x44eb('10f', 'MtqE')](_0x113296, _0x4f4dca);
			} finally {
				_0x2279b3[_0x44eb('110', 'sVWw')](_0x116b84);
			}
		});
	});
}

function safeGet(_0x3b3252) {
	var _0x3d3c72 = {
		'RmRFT': function(_0x22cb11, _0x18ab32) {
			return _0x22cb11 == _0x18ab32;
		},
		'ZiXMU': _0x44eb('111', 'J9ze')
	};
	try {
		if (_0x3d3c72[_0x44eb('112', 'PWy8')](typeof JSON[_0x44eb('35', 'IJYy')](_0x3b3252), _0x3d3c72[_0x44eb('113',
				'gmFx')])) {
			return !![];
		}
	} catch (_0x412b1e) {
		that[_0x44eb('114', '9Wuu')](_0x412b1e);
		that[_0x44eb('114', '9Wuu')](_0x44eb('115', '#FtW'));
		return ![];
	}
};
_0xodp = 'jsjiami.com.v6';
// prettier-ignore

const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [],
	cookie = '',
	originCookie = '',
	message = '';
let helpAuthor = false; //为作者助力的开关
let actID, times;
var _0xodN = 'jsjiami.com.v6',
	_0x3c1f = [_0xodN, 'w6laIEfCiw82YG8=', 'IB8WwoA=', 'w6rCjsKHwothw7HDjRbDiA==', 'AhPDoMO9B2QJQsOY',
		'w44tw5XCjEnDnsOheV4=', 'w7suPsKGIQM=', 'wrXDlMO9ZcOUUMKGwpVoJA==', 'fxvCn8Ogw47CtQ==', 'bxXCuMOp',
		'w5xVXcO2w7zDlQ==', 'w5vDlMKaw74=', 'NyrDlsKfQg==', 'w6HDoQhJcQ==', 'w7bCug8=', 'w6fDhMKnw6fDnA==', 'w6vDlRVn',
		'wqVGQyzDqg==', 'KBrChMOCbS8uWsOww70=', 'ZsKuw4JxVA==', 'S1DDg8OfEQ==', 'woY7woM=',
		'5b6o5aex5oqz5Y2I5p6T57mt5aWP5aW644O8', 'wqjCmxkjw6g=', 'ThXCvcOrfA==', 'w6fCqMOeP8OYF8KFw5jDtsO6w44=',
		'NMKmdk81wqDDi8KoDsODQQ==', 'w49HwqAuw7gMwqjCqHM=', 'w7HCrXXCnig=', 'w5vDnDLDn1PCssK8IsKd', 'dwLDoMKvVsOIdMK/',
		'wqDCjDc9w60=', 'Mh8lwovChQ==', 'w54tF8KUJg==', 'dGPDtMOHUw==', 'w4nDmiXDhEDCr8KYMsK6asKt', 'wok+w4jCjQY=',
		'w4w1w7DDhcKhf37CvsOn', 'DGLDq8OUOV3DmsK7fiY=', 'fw3CvMOt', 'GcKTW0DDrw==', 'wrNZwr4DwqDDpFfCi0U=',
		'w4svw5XCgg==', 'WxTCncOtfcKU', 'w4DCmRzDkGY=', 'BSbCtSth', 'w4zDkMKNw63DuMOxwrTDlsKN', 'wr8vw4tx',
		'w5ZPw5/DucOzSA==', 'wrNnFcKzKg==', 'QMKTw6NFdA==', 'HRPDjMKWXw==', 'QEvCscK+', 'w7jCpQTDuFM=',
		'AxbCgiJRwodKw5E1XgfCmcONwpw=', 'wp9iVxnDiQ==', 'HxLDosOkLEYLQw==', 'fn/DusKU', 'PgjCj8O0ViA/dw==',
		'w4rDmCLDiH/CqMKKJA==', 'w4ZTbcO1w73DhAVJ', '5rak6KeR5L+S5Z2pwooZw6g=', 'wqh6wqIfw74=', 'wrJdwrkT',
		'YwjCtsOPZQ==', 'woTCqU7Cu0w=', 'w7Epw6rDmsKO', 'A8KdUA==', 'w7zDgBNvaMOiUkYw', 'w4FHJcKY', 'WQnCq8OnXw==',
		'wr83w4zCjg==', 'PBrCg8Oy', 'w7HCqsODIg==', 'w6IGCsK8PQ==',
		'w6vDnQ9hfMOtUg8qOFfDocOJcsOBw55Iw7PDlcKqw5g0NBfDgmnClA0=', 'ChTChQRQwoBuw5oTSl8=', 'FsK1w7DCsgo=',
		'LsKOw5ZafB1Cw4zCoEs=', 'w4w1w6fDg8KtZUnCpA==', 'w5s3w5HChg==', 'DsKWU2bDoRI=', 'eX7CucKUw73DhsKtw4s=',
		'fRXCoMO9w4Q=', 'FhrDrMOqMUQJVMOY', 'wrENwoUQG8K7MMOPXw==', 'wrt4PQ==', '6Iyt5b+da+avtOe+seeIuuaep+S9hw==',
		'woY7woNkHTM=', 'w6XDucKaw4fDrw==', 'worCiBpBw5HCjMOSMcKbwq5fwpE=', 'w5UmwozCgFU=', 'NwDDrcKuVw==',
		'w41ew5/DqcOjScKP', 'OB7CnsKrfCE2c8Oww78=', 'ZEYkwqrCuA==', 'w4hHJcKYG8O5P8OawpI=', 'GAPCksOiTw==',
		'w6d8w4/DhsO8', 'TA7Ck8OqfcKeXsKH', '5LmH5LiF6Lyc5ZqN5Lis5Li05q2956me5pS75o62', 'w4opw5HDgsKN', 'exvCv8O8',
		'wpB3wpcxwqg=', 'w6TDrnLCiSI=', 'wroDw49MCQ==', 'w61BO1PDtEw9d2zDgMKvwplsw7xEYsKT', 'w5p0woEXTA==',
		'w7DCjMOuIMOX', 'wqvDgcOmYsO7VMKbwppn', 'QMKkw6vCr1I=', 'w5nClzDDoEw=', 'wpAgwocYIw==', 'cVXDuMOKeA==',
		'w4Uhw4jCjQ==', 'Ul/CvsKLw4Q=', 'wpJDwpELw50=', 'cMKQf0wW', 'ODDDosOABg==', 'YUDDjsOweQ==', 'w7FLd8Kw',
		'XMKkd2sc', 'bMOwAMOy', 'VXbDjcOHc8K4Kgtx', '6Iy95b6sY+asgue8o+eIoOado+S8iA==', 'XMOLLcOJBg==',
		'w6TDhVbCswBmw4DChsKvPcKNwpLCvcOW', 'w5PDnMKdw6s=', 'wrtqN8KRJw==', 'YEPCnsKBw64=', 'wo/CmQcO', 'w49kVMKWw4Y=',
		'w4dSPMKNO8Kgf8KHwpbCh3TDlXtLOcO4w6p5VcK6HsKMw6zDujwqw75swohgL8K6w4vCpg==', 'ZmPDiMOxFA==', 'w4dMZMK0w50=',
		'wrjCjUrCs2c=', 'w4RDLcKNZcO7PMOBwoHCkg==', 'SibDqnhd',
		'ARPCkB1Ww5Jzw7MyQQzCjsKCw5xXw55ww6HCt8OycMOeR8OZw40MwpF9woDCoW5dwowIwoDDmcOWwpfCicOXwoEkw5LChiHDt0MlBjPCqcKuwrcGwqYDAnzDisO7w48JwrU4wpbDrwYSwrhRKMOaw5FKwqPCrxrDsTYqwqvCg8O2wo9kJsOuw70zwrHDunZvw4RWw77CuQLDpl3CtcOOF8OCKcOaRcOnwpZdw4Bgwo9iw4JiWk7CoMOxw6oUY34mFw/ClFXDs1wVZcOGMsKkw5HDkMKPw4rDo3vClTMLY2FNw6kswodQw5UIw7U0N8KYw7cPw5pwFsOQWsOKwow1d8K8OsK8wqJLwrsrIMOew6jCui9zw6UUX8OydMKIe8O3UMOGw7tEw4jDojgpFipBw6osEcOMXGBvw6vDpMO0w7rCgSXClhTCgMK9KMKywpPCicK+HyXCp8KKwo9jwrYkwojDr8OwwqXDiH/Cv0B4wrXDhMKIaUlOdgw0RF/CgsKPCsKtQsKtI15FPxhZw5/DnsOtw43DvsOZXcOsRjwPwr7CjsKGw7bCjsKSw7PDl8OlwpfDscOnw5NVw59h',
		'wrDDgcOge8OmCcOdw5N2dMKuAMKXbMOYwoxewoJUPgvCoMO0wpseHMKiFxHDnDB4wopAwqPCt8Oqw78tMcK/w7A+wqwaPMKzOcOyQAvCmMOOY3PCscKnZcOxYCHCkjgnV8OlI2XCvzVrwoXCnwVNwoTCnG1xRytNUsKEw5g2w5LDusKWw7zCqE3Dl8Oiw6sowrNrKUcmwqfCjlV5w4TCvg==',
		'wpknw7LDjsO5OwjCu8Onw5IxRUVGw4nDqA/DncO6dMKSP0k3B8OnQcKHwq3DiQ==',
		'wq7CiAfCiQRtw6LCusKhIMKNw4LDs8KNEcOHwpMxw6LCj8Kvwr3Cj1gwMMKZworDv8ONXnTCkSMoUcOyw7VqCg==',
		'HjXDlcORRcKpFRB3HwQETjPCh8OeRX3Ch1ZuwrImw7VzUSNPLD0BwrjDlMOewp7CpwPDlMOzwoXCtmPCi8KFw4A=', 'wqY5w6h+CQ==',
		'wpo1wpZSCg==', 'wrnCrhYuw7A=', 'YwfDrltj', 'w58Zw4jCm1U=', 'wrN2LsKA', 'wplwwq87w54=', 'XnjDhw==',
		'5ZuJ56+c5q+e56KT44Os', 'dl4xwojCtsK4w60jwqV0BTnDtcKK', 'DB8zwrjChQ==', 'LwnCi8OxUCU=', 'DwXCkBpvwod8w4w=',
		'fMKmeF4=', 'w6LCqsOeNw==', 'ZsOwGcO2', 'Y3nDh8KvwpU=', 'w4Faw4rDrA==', 'w6vCisKUwoF8w6fDjw==',
		'w6jCosOJPcOgH8Kcw4Q=', 'VnbDlMOD', 'c8O6w5zCisKnw4HDjy8=', 'w698w5XDj8O+', 'UsOrLsOFLA==',
		'5oq15aeH57qn5pyPTA==', 'wrzCuGXCgw==', 'wohddTvDmsOJw4Y=', 'wrgjw5bCkg==', 'w43Dlyc=', 'YjjCrcOZccKybcKv',
		'w4Mhw4Y=', 'XMKqw74=', 'w41IfMOxw6HDqA1fwo1CwonCqw==', 'wqoSw6LCscKU', 'w6XCgMKS', 'Ah7DosO9B1M2T8OT',
		'wqJXB8KCOCQ5a8Oc', 'SgfDmFVsGQPCj19ew7NF', 'eDfDr29WLgzCs2I=', 'w5RRw7HDi8OL', 'WVsVwpfCrg==', 'fSjDgXRk',
		'w67ChMK6wp9o', 'PQQ1woPClA==', 'GwzCjMOUTw==', 'fcKzw6VaeQ==', 'w6RoAnfCvg==', 'DjnCsMOrRg==',
		'w7PDuMKbw5bDlg==', 'w6bDrTPDlF0=', 'ZHPDtsOITw==', 'w6ojNMOo', 'bVohwrXCpMKiw604wqQ=', 'wqjDrMO/eMOT',
		'wpoGLlI4w6jCucOrVkFewpxJBBjDjcK0w69uJMONw5TCpMOFVUY=', 'w4zDqD3DgGM=', 'w47DtgZlRA==', 'w6N3McKFDg==',
		'bl4wwrTCpA==', 'XF/CiMK6w6Q=', 'NwoQwojCm8OyWhV3', 'RHfDp8OC',
		'woh7XsOX6K2k5rOn5aWZ6LSJ77+y6K+U5qCu5pyr57+l6LWn6Ya56K6b', 'ezPDvm5W', 'wqhPwrc=', '55e/5ouq44CM',
		'KhcBworCm8O0XhY=', '44Kt5L+O5oKu6I+r5Y2L5omf5YmY', 'wr4lw55mBcO/', 'w4zDmCXDjA==', 'c1PDhsKewqc=', 'woLCh8OU',
		'wpjCjAEGw5LDhcORM8OM', 'wpEkw5zCt8KS', 'BwoxwozCmw==', 'fMO+H8O2GGPDpCg=', 'wqQNGWUjw6rCs8OrKA==',
		'w67CugPDrXogwqLDrQ==', 'w7RSwoIoRsOy', 'bFYxwqw=', 'wqHDlsORasOn', 'QcKww5TChnI=',
		'w59awrIow7IiwqLCvjkaw449FVvCv8OVw4om', 'T1HDq8K5wpQ=', 'f8KFVF8f', 'TB3ChsO8', '5Zm256+t5qyy56OD44C0',
		'wrVTwqMT', 'wroRwpJjAg==', 'w6BZZsKjw5bCvB4=', 'wrZUwr8XwozDsg==', 'wr5JwooGUcOuwrU=',
		'LRLCvsOnw4zCkcOIw5zDunNww4bDkw==', 'dVUEwqLCsQ==', 'woTCq8OqdTM=', 'RBPClQ==', 'w7/DlRN1Yw==',
		'wqrDkMOnfsO5Rw==', 'w5tfbcOsw7bDkThFwpA=', 'wo94wrwy', 'VnHDosKzwqE=', 'wp9hwokAw5M=', 'w4puwqodXQ==',
		'w4vDocKrw77Dkw==', 'WsKmw47ChXQ=', 'wpMiw5V/Fg==', 'w7/DmxJy', 'eE7DrcOPUQ==', 'acOyAMO6AEHDtSgJX8K0',
		'wroDwo8=', 'wrs3w4lnKQ==', 'wp8bHEQgw7U=', 'wqJaC8KAFDQ=', 'JCPDpsOWEw==', 'A8KdUHDDuBU=', 'eMOyBsOLMw==',
		'w7/DkFfClRlvw7nCksK5', 'CBfDpcKKeg==', 'U8Kqw73CuQ==', 'w64lMcKwJA==', 'wqVdD8KVMw==', 'esOvw5PCnMK7',
		'wqB6DcKswqY=',
		'YMOlAMOjBRLCrn4hS8OgbhLDgiRRw5Nhw5XDqcOtGzbCvcO7w6Uqw4xBRMOoZcKUwq3CvMOgwqVqw5RJwp1Uw5zCo8O+wpAcWQvCiAvDjMOvw6w=',
		'UFrCusKcwpXCpSTDhxItZ8Kyw7gTwpXDrMO4wqEvwoLCp1kOcA53w6bCn0U5wroxO8KQw4HCvlEww5NRZjMWwovCrCAG',
		'w59TwpPDhcOnVcKPRsKJX0fCiVjCog==', 'SQzCm8KzWcOeUsKMwqPChAp/',
		'acKKw4dFfipaw4jCrBkBSk3DgcK+WRBawoZcbjzCkzJDUUovwpzDvMKffHY=', 'w7fDmMKpw7rDsg==', 'wq5Gwrgqwow=',
		'w5Z2wqQuw6c=', 'fQTCisOofw==', 'w5fCuQLDuUM=',
		'ShPClsOkCcOVD8KqwqjDlVdmwq4ZwrETCsKSDTlOLibDpj/DunJKfsOmw4fCs8KfwqrDkUoOe1EjVsO4dmnCpj7DqEhgwo/CpcK4wqfDhW/Cs8OkMjJJF8Otw67CuwHCj8KMdMO+CMOeUC4xwrAYw5HDhiEmVjtGw5XDssOEwqgFGWEvMwlzV8KOScOcwrlEHw3CtxLCqsKvH8Kjci7Ch2FYwpFfwqEjw4UJU8OOJ0fCsnLCnw0RPcOWwqBtwpV2wrXDk8KiworDp3vDoUJ6WDXCvsK9XifCvMOTNBwPHMKtw53CtxtKwo7Ci8ODfkp3My5tXcKxw7DCp2PDncKdwpV2wrXCu8K9fU3DnMKPwoDDvyTCkSnDkxbCncOZwrDCklbColZVwoZlcXRZNTZxTTPDs2gHHsOWSg4+W8Krw6nCjH7DrsKnw69Ew6PCmTgmw7rCgMO+RcORwqrDq2gSw6pmw6xSSsKzw6vDm8O2C8Ofw67CsMOUw4fDoWIJwqvCrMOSF8OLCQ3DnMK/w5rDpFJ8LsOWw79yw7bDhk/Du2/DpHnCgy7CmXnDh3k3w50dw7JFwr/DqMKQwozCscO3woUQasKpAl7ChARAw5gFw4zDnsKZwp06w77DkGDCljrDpQLCslJSB8Onw5TCrsOSQyPDq8KoXsK3a3BdwpJ3wpLDssOeJGjCgzrDjHc6QsOEw5Alw6PDmMKSLSTCnw/CnHhhHnTDuMK4wp1jw73Cj8KmRsKowpMWwp1mB8KBfklJwphYw6PDinJqwpHCt8OMBsK/OcO7wqbDmyTDoioHwqtzdAFzaXB6QiFUwr/DjMOFJMK4Fk/DpsOmwqrCuUPCgmfDn8OwHj3DiMOiwotHw79Awr8uwqgmw49ndMOkw4EmUMKuw77DtQNEwpHDuyMBwoLChmQrw555BcOGw5/DsWLDpcOqwqHClS0Cwrhzw44aC8KhwrfDum3CvcOrNSvDtBzDjcO+U1wKVcKiw7B/w55eEnvDuDVVEFfCpkpPw4Y2e8KMI8Kyw47CmyYNdsK4w6EEIzzDpitWw6tdw4QKVsKFw4APwrnDtsKEwqzCncK+w54wYD/ChsKfOcKKWcK4c2sUw7zCmcK1NmzDglXCrMKPZjjCosORAjLDksOOT8KXw5jCrz/DksKXG1vCvcOiNcKqw6vDrAILF0syBRcQwqd/AhDDrsK0w5MSwocqwqHDm0J5cCjDmsO5wpRLw5bCsEbDoB4hwp9DFcOxL2nCuMKmw6xDwqZZWxh/asOWWMKrw4dbw5HDo8K9X8OUwoBgHsKawo0uGcKoahkfH8KIUMKjw5PDncO8bsODcgJGw6RcByQEKcKgZGguw7YTSAscGFcXVW/CrsKmw7kURcOTQxYQw4BdGsKdAiZVKizDpMODwqzDt3nCgEZ4dsKka0o1FBfCvybCpzA7JVTDucKxw69ew4w5SBoAw48LIXDCpxkVw6hSAsKnw6J0MGUrKsOOwpMbw7EUw64JwrlswpkpGlhPQUbCgEHDgMOleRjCq1oEwqHDuMKpw7gQPHLDlsK1C8KSQcKVwqNZDcOXa8OQGDsZHMK+GWdSekwlccO5BsO9wptFRMOWZMOawoDDisOUZcKrM0zCrj/CssO2w5LCnVwIwrLDm8OEN8KpTcKFNMKUWi7DhnYjKjrCu8KIw7FVw4sLYsK8w59xwpRhLMK+w5NiHcOpEMKcwqUSX8KoVMO5ERQVZEJ6Hjhaw7bDpsKjGsOkwrvDhDDCgh3DvEjDsMO+w6pOBXvDrWDCv8K5OMKeK3YkPsOx',
		'w77CjMKGwoVf', 'wqfCiTcAw7A=', 'fmbDpMONbA==', 'WR/Cu8OyQg==', 'w4kdw4nDpsKF', 'R2TDhcOQc8KzJAtxflFCCQ==',
		'w6DDi0I=', 'w5w6w5PCilXDrMO9dkM=', 'w4tVasO7', 'VsKMw6DCkGc=', 'w4ogMsKNHw==', 'w5bCocOCDsO7',
		'YQ/ChMOJW8KbXcKGwrA=', 'w7vDmwpjaMOOXlk=', 'wp00w6pFGA==', 'w5shw4rChlU=', 'RnnDrQ==', 'wqAsNVgj',
		'w5YPEMKYLA==', 'RzHChsOFw4c=', 'wq1FP8KS', 'wp7CicOBdQQ=', 'w47ChMKDwpl8', 'wr9YwowCw6s=', 'QW7DjcODMQ==',
		'wr/CqWjCgGbCpCjCgsOkwoVmQ8O1ClFVw5N5V3bDnsK0AwJjw49yDMOQwpbDl8KZw41ybCgcQibCvcOmQcKgbn4FScOAbyHDl8OoNVjCrlVnVcOm',
		'w7vCpQHCpnlFwq3DsMKawo/DlsKK', 'c8K3ZVczwrHDv8KpDsOIEgfCmDglw7UNwpxkWsOzwofDm8O2w4cGfsOww5pzwrJsYQ==',
		'w6F5wpE=', 'QXPDr8OXf2jDj8KibX4=', 'wrZIDcKAcXANZ8OUB8Kpw7HDmMKhw47DhcOy', 'XGTDvcOUJw==', 'w6vCvsK/woRm',
		'GyXCtcK0YsOpf8OsZDnDmFQIw5LDtxXCoMKMNHDDji0cQCFtwrXCg8ORwpXCpMKyw5zDjSlkXWAfBiDDlDDCqTjCsmk=', 'c3/DncOyPA==',
		'UHjDhMObHcO+cjsxDwxTHiLChMKPGzHDkXk/wr1jw7UyAzBQYGsuw6nCt8O4w4nDpizCnsKow7vCon/DvcOHwooASHTCiVsIO8KBw5bCsQTCrMK+w4/Co1HCqXYVwrjCk3nCqMOyaC/CgWMmwoYQwp3DmsKAS8K2fsO6ITJfEMOcQ2TDh8O5w7gwEHPDiVUwEjBeQsKsFEBgGcO/OAPCq8OuwqRbwogww6d8IiwPwptswqpvwqXDtMKRw6Qcw5YPYgXDuRoDQkPDpsOMwqPCh3VSVMOWWcOMfcKNPcO6SA17MsK+w60cwoxwwqjDsGQXdMOKw6TDlldZW8KPG8Oiew7DmMO+wpRBwoZvw7zDq8OTYcKRw43ChcOdWGY4wp5iwqsoRMKfwo3Dt8KXwoV2wpx0wqjCpsO9w6V1Qwl8wqfCiWE7bC0Cw5LClAU8IhfChW3Di311byYLw7XCssKKw5vDvl1TI8OtwovCoQ==',
		'w6dRY8Otw6I=', 'wo0Vwq14Hw==', 'wqUww55gCQ==', 'w7l5wrUxw4o=', 'w6dYO1bClA==', 'anHDvcKB', 'Mw/DjsOJCg==',
		'dnHDqQ==', 'w5tOfMO3w73DggFKwoc=', 'w694ZsKi', 'eMOwBsOgEw==', 'w7YFw4zCgXk=', 'WB3CgMOuUQ==', 'w5F2woQoXQ==',
		'w7ZFZ8K0', 'woIdw5pRJQ==', 'wqnCg8OkQAo=', 'LhvCgQFl', 'wrw5w47Cn8K7', 'wpguP2gb', 'wqQzw4vCncKhw6w=',
		'a0wnwrXCksK+w5wjwq9HDy/DpA==', 'w49HwqAuw7gQwqTCo3IY', 'w5xDPMOQK8O1P8ODwp7Ckg==',
		'Ym/CucKQw6fCksOlwpfCoMKxASBVWQnDtD0EIsO9w4YAw7PDvMKoUsKmw6Efwr9rwroFFXwkw7oQw6PDssKhw5DDiA==', 'wp3CrFDChE8=',
		'WBHCuMKlw6LCqsOew4fDtis=', 'w7l2IMKEGA==', 'PSTDscKacw==', 'w4bDnUbClBo=',
		'RMKgw6HCqBgEwozCq2jCmRDDkhMnw7nCkMOKMFZJwoEJY8KoL8OOK8Ozw7nDrMOBw5EEwqjDrWY2wqvCucO9w6vDmWXDoSAdEcKCNgXCgWUGwr7Crj7Cr2ZDwpA1wpPDkA==',
		'w4dSPMKNO8Kgf8KHwpvCjXnCgTsMIMOqw6pzScKhW8KMw6zDvCwgwqQhwoZudMK3w43CpsOUw7DDq8OJwrTCgwTDpsKdOkXDgsOGwoHCiiJaKMOzPMOfUsKcwpdqMsOLE1xxw4LCt8K8wqHDq8KUdQ==',
		'G8KXT0HCpRfDj8K8w51O', 'w6bDkmnCrwY=', 'wp1swrsEwqI=', 'w4hdwqczw54=', 'GBLCmiVL', 'exnChsKwd8KfV8KDw6TCgg==',
		'wrxLM8K1Lw==', 'HxjCkwh0', 'w6kYw4nCgFA=', 'OwrDjcO7OA==', 'w7YlPQ==', 'Hi7Dl8OVKQ==', 'ZCHCmsOSw6o=',
		'wqElw6vClcKxw6E=', 'bVopwo/CrA==', 'UA3CmsOYXw==', 'U0LDqsOURA==', 'bU8uwq7CtQ==', 'e8Onw5o=',
		'w4FJQMOxw7fDgA==', 'wrljKsKlwoM=', 'eATCoMOhw5U=', 'eCLDoHRH', 'fcKxw5tgWQ==', 'woXCmR4K', 'wpkww6FCJw==',
		'woVxAMK3wqA=', 'wrt0DcKjwpk=', '5Zmx56ya5q+C56KN44C5', 'wpMbw7dcOMOvTMOVw5jDosOFczLCnA==', 'w7bDjAjCnxk=',
		'w5RbwrUsw651w6jDo3oHw48zdUvCnMOKwoooGS9lBsKSeMOFGUPDsMOqwoo=',
		'w5fDgcKaw6/DrsK/w4vCkMKPIDbDiiPDpSxoVDXDgmbDjCTCnCMhNcKEF8OTw7fChw==', 'wrlcH8KMwoU=', 'wpZ5K8KFJQ==',
		'd8Kqw5/CvmM=', 'a8OnLsOqFQ==', 'QxnCl8OtGcKRVMKBw7vCgg==',
		'cmrDusKFwrbDt2TChht4MsO+w6JPw5XCosO2w6A1wqTCpVUMekAzwqHCs3l0wqRhfMONwp3DpGo6wp1ea31Lw4LDuT9Ob3jCg8KWUWpTQMOaC8O4ZcKBV8OeJcKLZCvCgcOgSCLChA==',
		'w4Jeb8Ouw6PCngF8wpZMwoDCq8KPwrFafcKIwpzCvk3DmMOqVFnDtMK3FsOLwpAzwpZqckHCisOBcCYcwqggQcODZwTDu8O9w5MZwpI2YMOvwq4NYsKhw6LCtDhSKMKfw5HDixwWw5TDqSoXI3HDrcKGw77DrATDvgTDiMK5PsKuw4DDriXCssOyw5ZVGMOswo/DosKkF38AAR0uw7HDuSfDlcOuJl0zw5LCn3VDSMOCVRzDqzJpRHjDp8OcScKiwoYKwpsQGzxbODlAfsO7fD3ClsOjcXJCB8OxUMKBFMK2wqgTRGPCv25iwqQfGsKKwrbCncKHcAIWPUvDucKYIC1twqQjw5YAwq95w7MBb8OnWcO1wpjDj8KewqzCrRhzw5jCtMOKw5MAZX1BwqZhw5zCvBfCsF1Uwpx2ZUceMcKAWDVRHcKrEgNtw6/Chk/CiMOrw5Qrw4U2GMKAw684LkBfIMOCwojDvVYTLsO9bQNpDMKIw4nDjcKWW8Oew4ZZGDnDuMOrwqpvFyUBwppLwo8zbytRwpJowoYUwp9EcznCtcKFwow/Y8KHXsOjHxrCkxPCqMOJR0RUEsOkw59bMcO8Y8K8w4U7FcKYaTjDicKPwqXCkMOHJMOKVMKiw4vDglrDnsKGw5o+w5fDpMOzw6jCr8ONw6fCsFTDuSsJwpUnUh3DkgJFwoLDpgsjdE3CgX5pwqDCmQXDpMOYw5p4XcOcwpQwLcKbw6keDMO+w6PDrS7CvRDCnTxlwo7CosKEEcOQWcO5UUFPwoUUw71sJcKMw7bColc9acKvEHTDi8K3w4BuRHPCsMOgGQ==',
		'wqBpwro8w4s=', 'w4zDsQHDpHQ=', 'UhPDo2l+', 'BgDClyBV', 'TTHDhE9g', 'w4DDswlFcA==', 'w5nDmAXDiHM=',
		'wq7CjDsXw6Y=', 'w5jDkMKa', 'CxnDo8OFMQ==', 'woJ4woI2wqs=', 'XcOGMsOdOA==', 'w6Vuwq4ow5A=', 'RBPClcOYRsKC',
		'JxTCjQ==', 'w5xSOsKUJsO9OcOOwo4=', 'wog4LlcF', 'fjHDillY', 'wrpVL8KQwpk=', 'wpjCjcOdYgTCicORw7s=', 'Bh7ClSF+',
		'LxrCnsOn', 'w7RYwosKQMOo', 'YsKIR0E5', 'w4lcwqQuw44nwqbCvnM+w4QtPQ==', 'w4w4w7LDhcKhVE3CuMOtw5A=',
		'w4x3GnbCtA==', 'w402w7DCmUE=', 'wrQTJn48', 'w5ctL8K0OQ==', 'AxLClSNA', 'wpkgwpZIASYvf8Ok', 'wp3DscOkYMOG',
		'cmrDusKFwrbDt2TChhZyP8Kqwr0Uw5TCtcKhwqclwr3CohkKcRs1w67ConF4w6JrOsOHwpXDsGc=',
		'w51fwrEww7QswqbCuH8Sw4VmMlHCgMOS', 'IyzCr8OPbg==', 'U0/Cg8Kkw60=', 'IxnCmQFp', 'bmLCrMKxw5I=', 'w73CtcKvwqxQ',
		'woHCvic2w7M=', 'w6XDuiDDrlU=', 'NAjDosKbeA==', 'LBsGwq/Ckw==', 'w7QrN8Kw', 'H8KdREE=', 'an/DvMKGwqA=',
		'Z2jCqg==', 'SEXDpMOlPA==', 'wqQ/wrNoBA==', 'GAPCgwRIwo5zw4Uj', 'dsO4w4jCiMKd', 'JxTCjcODbTw=', 'JsKUdVHDvg==',
		'w4xbUMKow5A=', 'ZcOdw6zCh8KI', 'Jh7Dh8Onbyd3csO9wrR1HnU=', 'wqPDgMOf', 'wpRaKh3DlQ==',
		'w5RbwrUsw651w6jDo3sYwoYoKEvDgcOWw4BvCTZiSsKLZMOVDzLDvcOgwpACQ8Orwr3Dq3vDscKcw47Dvx83URYjwp4jw4RoF8O2wqQXw6c=',
		'wpjCiyM3w58=', 'c8ORw77Ch8KE',
		'w7LDmsKUw7bDscOpwoXCkMOWdGLCkCbDpQ92FTLDlCvChgTCoBl0OMO6HMOTw7TDjW0Aw4DCrF3DuUvDgMK5w5HDh2cVEsOWw4lpw6LDusKsVjjDjMKKw6RBwrzCtzbDlMOSwrViw4XDlcO/wp4bwrwLwo7CosK+wqrDsFzDjXXCmMOAbBQDw4snNsKaI8O8woPDmcOiw7k7b23Cs3ABYcONw6tCw557c8KEw7LCpMKUwrjDqMK3bg3CjxdZwq3Ds8KCIX0Iw6fCuwx1wpVnwpZIBjPDgsKF',
		'QmLDvsOXITPCjMOkc3TDjcKhwpbDvEM1wqTCl8OURMOIw5fDjmXDtXHCuMK/w6Jxw6rCsWrCicK4wpvDuMKhw5PCrMKUwrXCi8ORwqbCqyDCo0TDiCvDn3jDkBHCg3Vf',
		'UELCnMKKw5U=', 'w6vDgVE=', 'R8KHw77CuHE=', 'cQ3Cv8O+Tg==', 'UiPDgX5J', 'w5zku4Dku7TotZPljr8=', 'w5Y+w7fDksK8',
		'w4tSw53DpsOIWsKRDg==', 'IAwDwpbCvMO7VRw=', 'JRrCh8Oj', 'V2TDm8KMwos=', 'w7bCug/DjWYZ', 'wqbCgiYWw7I=',
		'wo3Crj8gw4U=', '5omq5aWB57qJ5p29w7E=', 'wovCmsOBaRPCtsO9w6wRYcOsw5E=', 'bFo2wqTCrsKyw5g=', 'w5/DmMKDNw==',
		'wr5kFsKOwqxOXQ==', 'wpzCjcOHZQ7Cn8O9', 'w77CtBzDqQ==', 'w7PCuMOPJMOnEMKXw44=', 'w7tDYMK6w5HCuU58',
		'woMXDFoiw6DCu8Og', 'w5BAwqY=', 'wofClxQqw47DkA==', 'ZkPDpsOlVA==', 'c23DgMKawqHCqA==',
		'wqFGw6JWw7XCpC/Dn0gRwoYnw7NKw6bCkS8F', 'w6505Y+R5bOs5aSS',
		'wr4IZBXDoQppdGnDisO+w5o9w6NQMsOYQ0fCkSTCs8Kqw49kwrHDrg3DtwHCqUA=',
		'wotKwqdpwqp7wqbDv3BPwpN7bBTDmcOZw4VyXDptAcOKc8KAH1vDtsK0w5EVHw==',
		'dsOsw5jDiMOfwpzDiHU7w4rClcKYdFIwwrbCrMKQMcKDw77CgGYYwobDs8K+f8OAw4cjwoo=', 'wqkj6biM6b+X',
		'ajTDqCULPzjDrzUtwpJKw57DjsOLWMK3IcKrF8OKw500MBxlWQ5wwpvChlA=',
		'wqhgw5l1L8O5CcOiwoTDssORdXXDkVlzw7FpwoU6dGzCohHDnV/Cl8Obw4oHw4LCjw==', 'w78V5p6p6L62', 'woVXfg0=',
		'w5nDmsKcw5rDvMOmwow=', 'bjzDug==', 'wq44w40=', 'w4Naw5LDvsOj', 'wofClxQ=', 'wo0xwpBFDjUn',
		'SBvCo8Ojw4jCoMOCw6bDmw==', 'wrVdwqIUwqA=', 'woAfHw==', 'aXTCosKLw73DjQ==', 'wpvDmsO7YMO8VsK4wrgs',
		'w61eJkfCuRg4', 'axPCncO2XcKVcsKs', 'WhnChMO4RsKDXQ==', 'eFYuwrPCpMKk', 'w6ZUNQ==', 'w6TDkQR2K8OkV0k/NQ==',
		'worCiAMDw5XDgcOZIcOcwqJew5PDpsKPw70VHcKhcUvCpVk7TWvDncKISMODw7zDjsORw4U=',
		'IR/Ci8O2b3UwSMOxw7V4FCMEwrbCiE00wr7DlzbCvibDocKcw5RgbV4UGsKIwphFwoVzwqzDhsOgDsKyGxQndQzDhDbCg8KFYMKVwo7Dsn3DrBvCmAw1w4DCn8OvwqnDicKpEHzDjgjDosOCUsOFw4vDj8KWw6cmwofDvcOUwrPCucOsN8KEwoZyYsKSwqk2wqUoYMKIBcOKLy7DlizDrMOYw6PCucK5JcOjJ8K+DMOkXD/DtsKaw4fCjMK6wojCunVzwotYwonDpGbDjMKAworCuMOiFhfCuBhqw6XCqHHDukR2GsK0w5LCpcKswpbDolI1w7VjE2HDisOtbGlywpzDnsO2dTfCmmfDsTLCocKhIcOGw6/ClAoww4LCrMKQUA/Co8K2wrIvUcOSwpPDusKwwrDCvEfDgytKD8KHRcK2w5HCvWRWN0JjwrLDhsOywrN/wpZtw7hUwpHCvHDDpWHDvUbCn8K/IcOCwqsXIGTCqcKkwrjCmEtkw5PCvTo+w4DDtsK9WRrDjsOCwp9ewrLDtHPDuXlPw6vDr8Kfwqhfw5TDjsKswq/CokNRwqjDmgIyw7lEw4TDh8KlPRRdXcO5woDDmMON',
		'wq9rwrk0w5M=', 'w73Dm8Kjw5XDuA==', 'wpjCnMO8cyM=',
		'w6JPJlPCq1Z2PWvDnMKnw4N7w6IWYcKYXhDCm3jCqMOywpkrw6HCuRvCoVbDtE8Ow4XCqQl8', 'aGrCjsKhw7k=',
		'w7rCmsKFwopAw7/DgwrDhMKkwrg=', 'w7lOIkbCqg==', 'woAfAVg4w64=', 'wqFywrsxwoc=', 'w5nDvCBgcQ==', 'e3AWwqrCjw==',
		'w54CW01+w73DpsO5JA==', 'w50Iw6DCpko=', 'R3/CpcKjw6U=', 'w4TDiXbCpBg=', 'w65YTMOYw6c=', 'w4Evw4zChg==',
		'V8KRw5LCtVM=', 'w41Pw4rDvcO1AcOTRMKodB3ClkvDvsKGccOdw651w6rDq1UBw5MQwo8yLXPDmMO7woBUw7lBwpnDhBzDvmLCr8O0w4A=',
		'w6HCm8KBwp9BwqjCjUvDjMKgwr5FSMOgwpp4bxwawrpFVUnDqS1hUMOew60Awo9CBB4=', 'w6p2wrEtw4o=', 'UcKhw5XCkGE=',
		'ZcOCw5fCp8Kj', 'woMbw5DCicK8', 'wpbDj8OlbcOe', 'WTLClcOSw4Q=',
		'McO/w5zChMOTwp/CjyxlwpzDi8ObLAsgw63Cs8KCbMOfw7LCkCZAw6/DtMO+LsKYw4o=',
		'bG7Co8KDw6DDgcKlw5bCi8KwXS0OQHfDrDBJJMOQw5J6w6LDvMK7GsOrw70SwqE4wohJEHoowr0Hw6nDssKxw7bDglNDPQ==',
		'w7U7eMKUwrhCQcKiJcOGw7PCtMKWw70mTsKmw7PDjsK/wr7DnUt4EzN3wonDkDvCh8KJX3PDtDHCgFPChAQ=',
		'wqDChlDCjxJ6w4DCncKjb8OSw4LDq8OSFcKIw50+w6jCjcK3w6/Cj2NtecKKw4TCrMKZHCLCtC41UsOSw74mDcOkwqwYw5RM', 'wqtgAcKD',
		'YsKmZ0g/', 'w7JIwpUpZQ==', 'w6bCiMKZwoJ8', 'XcKJw5JbWShWw5k=', 'wrkNJWUn', 'ZcOwAMOwHg==', 'f8KmYVgy',
		'Q3jDrsOCKg==', 'RhvCgMOQw4M=', 'w7FOwqkCU8Opw6Y=', 'woZvHsKgwq4=', 'woJdYA==',
		'w53DtzbDmj/CtC3lvq3lpY7jg6XkuqPkubHotr7lj5M=', 'w4Ygw4XChkM=', 'ZsKTw5RCWShWw5k=', 'wqPDhcOfw4UYwrjCiE7Ch8Oa',
		'wr7CrlDCn3LDt2k=', '44Kc5o2056Sf44OtFGfDv8Kfwqko5bSa5aeR5paB', '5Lqk5Lum6LaR5Y+e', 'w6XDikHCmQ8=',
		'w4HorqHphbbmlqTnmLflv47ojovljZHCt8O7w4RiMcKbBWzCvGjDlDl/I8KqDsKDD8Odw53DhgzDlcOdP8O6wp9gwpB9W8Knw7N6GTXDsT5XwpY3w5/CisOe',
		'woPCjAcfw4/CmMKXesOXwqhRwpLCosKRwrwRVcKvZkHCsAJ2WGbDksOOVcKGwrvCisK3woFsQcOewpIAFADDjGFW', 'w4ZVBsKSLMO/',
		'wo3Ch8OcbQjCnuW1quWmruaUqiDCpsKU', 'XgfCqcO6w6/CpMOcw4k=', 'w7o9w4TCkXXDqsO5dQ==',
		'wqXorrnphazmlZPnmYDlv57ojKPlj4ZZBinChx7Chw==', 'PQoSwqXCuA==', 'TDLCmcOLdg==', 'AgvDrcOmFg==', 'wpPCqGzCl2E=',
		'w7/CnMO5H8O+', 'w6jDsn/CqDQ=', 'w67ChsOuHcOc', 'w5vCgMKdwqBR', 'YFrDr8KBwqQ=', 'IQDDs8KuVw==', 'fsKocg==',
		'w5Vaw4zDvsOj', 'ZMKIw77CuX0=', 'eXHDqsKQ', 'PxTCgcOjcQU8YQ==', 'w6FFaMK0w7HCk0Zg', 'AgjCnMOScCU8dsKk',
		'wrw5w47Cn8K7w4/DkGc=', 'w4NJLw==', 'w59HOsKOLQ==', 'YXbDs8OYSw==', 'wpnDpsOAf8Oh', 'wqg6wqlrCg==',
		'w7PDnsKcw4vDmQ==', 'w6Zab8K4w6s=', 'w5RbwrUsw651w6jDo3cNw4JnNQzChcOYwooiBTQgBsKSfsOVExnCvcOkwoRZQ8OqwrU=',
		'XQvDvGxk', 'eT7CpsOSw6w=', 'b8OrHcOjWgjDpTQmV8OoNBrDgG5Xwo8=',
		'a2vCvcKMw73Di8Krw4zCq8K7DmERR0jDsHUKNcO3w5Nbwr7DqcKlXcOgw7xaw7gvw5xB',
		'w4hFZgfChsKawojCr2bCjMKzworCnMOnwrxqfG8FLMOYGcKZKcKxw5dBKsOUw70=', 'Z8K3w5Ztdg==',
		'TgnCnMO+QMKZV8KGw4TCg1hxwrRIw5NTRsOCKV4FST3DtznCrGMAKcOew5/DvcO+w6TClwskIlQtS8OLPyLDr2o=',
		'aVfDiMOzbCsrVsO4w7dzUyIfwrrCkEFiw6rCim7Dv2LCicOPw5V1OxNKRMOBw4RawoNlwozCmcKDcA==',
		'wrkIdsKiw7rCqnNwwrU2ZcKIwoQXwofCisO4w6jDuMODw60LZGJ7csOxIiEeKjMCX3lyw7ZYw50LwoHDuzIUw44=', 'w4Fdw53DicOE',
		'WnnDucOT', 'w40Aw6XCtFc=', 'wrfCjcOhRy0=', 'S8KiR3oW', 'w588FsKWGA==', 'w7XDpgR1', 'exXCvsO7w4Q=',
		'w6JjbMKEw6Y=', 'w61Ww63DlcOp', 'w63Dm8KUw5rDhw==', 'asKYw6F8dQ==', 'wpcvwroFHw==', 'w63DvsK+w6/Djw==',
		'XxDDgXJL', 'bBjDgXdQ', 'eMKVw4Rd', 'w5fDggRHQQ==', 'wrbCrMO0ZQc=', 'bQrCkcORfw==', 'RMOAw5fCuMKC', 'wo1dYxs=',
		'w73CgMKewopcw5nDhx0=', 'w75UOUbCtic8aw==', 'wprCh8OYYw/CsMO9w6Y=', 'w63CjsKBwo4=', 'X2XDr8OVG2fDhcKk',
		'wqo3w5bCn8Kcw6rDk3E=', 'wqB6wqwLw4U=', 'w7bDoETCiBY=', 'closwqDCtcK+', 'wpR2ZgrDmg==', 'worCicOHZw==',
		'w4NDJsKaPMOy', 'woMdPGMb', 'w6nCpQTDoWA=', 'YHLDkw==', 'w7XCv8OLIsObDQ==', 'w6vCuiTDiW4=', 'w5hOwrU9',
		'ahfCuMOBw6U=', 'KyXDoMKpUw==', 'wqw3w5HCmw==', 'w5o9w4TCkWjDo8O1Yl8qKcKIEg==', 'bMKbw4NI',
		'wpjCkBIdw5nDvcObOsORwqg=', 'w5pqI8KbKQ==', 'csOww5jCng==', 'KB/DisKoMW5/PsK5w71/BThPw73DkQxww6DDhi/Dpg==',
		'w4/CisOIFcOE', 'YT3CkMOeXg==', 'w7xEYMK9w6rCvEZq', 'Yn3Di8KRwoA=', 'w7PCuwvDpGEPwqLDpw==', 'woJ3wqs/w59Qwq1X',
		'wr4xw7HCgMKP', 'woBTahs=', 'Z23CvsKaw4A=', 'w7ZLccK1w5PCsVBt', 'w65aJkI=', 'wprCh8OYYw8=', 'alApwqLCrw==',
		'ZnTCqg==', 'wp1GdRfDlcONw4fCpXE=', 'w6bDhy9pYsOg', 'Ah7Dr8OrLEgST8ObFg==', 'ZsKbw5pM', 'wp5TLsKgwrM=',
		'eV4vwqLCksK1w5Ijwq8=', 'ZgfCqw==', 'w7ZcwogI', '6L+g6KKJ5ayV5ouM', '5aWN5YCK5p6Q54Gl5YSI5Lmw6KaH6Lyd6LSi5Liz',
		'w7nCtBzDq3w=', 'Rh3Cn8O4', 'fHfDoMKUwqnCoTI=', 'SCHDh1ha', 'w7gtN8KgBw==', 'MCzDp8OnJQ==', 'w4TDrgxAVg==',
		'w7s6KsK5IxXDvCnDjWPCvl0awpJsaFLCmcOncsKsW0BMwprDnxEiwpTDgMKBdmk=',
		'w5XDkcKPw6/DrcK+wo3Dr8KLNTzDlTXCtXEqVGzCiiHCkmnDg3dvP8OPAMOLw7XDmiZgw6TDpQrCpC/CssOdw7TDqiNLQcOuw5h6wq3Dh8KLNxDClcOGw4Bhwq3ConzCs8KMwr9Iw5/DtMKAw7hKw7AKwo/Ct8Onw77CozvDhW3CrcO0DwgYw4ohOcKab8KUwo/DqsOhw7l8KgrDpi5BM8ODw6EJwp0qLsOHwrXDssKbw47DtMKgdxHChUocw5rDk8OAYRVJw43DtVovwoZ+w4k8Q27CgMOQwqMYA8OMw7zCs8OnNMOew7nCh8K6wo9AcsOcaFsswrATw4fCiBd3wr/CmWJvw7ZvXcKWwprClsKWwpnClTTDn8KEw78XwoxuK3/Dni03G8OPwrpow6XChCTCgMK3w5UHNMK4Y8KSw4UGw7EBdMK6w4nDjm0rbxNWHmvCokrCpcK/b8O2F3ZGw7LDiMO2SjnDocKgWMKrw5jDqMKYDcKnw5jDkMKjHHnDkcK/Ul7Cp8Odw73Dv8Kpw4VjEMOfBT/Ds8Kow6BePwDDh8K/bsOzEMKKwrt9w47DvAfCqMOuPRHDkRp2JsKow5DCoMO2w7U=',
		'agTCvMOkw4jCpsOQw5jDtiFfwrnDqcKoIMKH', 'JMK7Ikdrwq7CqsKhVcObSVTDk2lqw75K', 'X8KAw7VxRg==', 'w7hnSsKLw4s=',
		'w45GwrI3', 'w7vCiMKfwppj', 'aV4rwrM=', 'OinDosOiAA==', 'w77CjsKcwps=', 'f8OwHcOn', 'f8Kbw55d', 'wpljEMKnNQ==',
		'wqk1w5HCk8Kjw63DgWfCosO4WQ==', 'wrw6M8K7dw==', 'wpBOwpMvwpI=', 'Q1vDr8Kmwos=', 'wqvDhcO4YsOh',
		'wpk8woVTCgIpfcO4', 'BBLDpMKvfMOgfcOn', 'bX/Dp8KB', 'YMOpw5TCiQ==', 'w4gFP8K5BA==', 'R8Kkw7DCqA==',
		'woQjwo0ZBg==', 'w4xVRMOxw7E=', '5aWv5YyM5Yq85Yqg56Gb44OCwr4=', 'IgnDoMKvV8OCf8OmZA==', 'wrZIwqIOwqvDsXfCiQE=',
		'wr8fwqYaLMK9', 'wph8wqY3w6RbwrxNLcKh',
		'AuS4veS5qOitp+KBruachOa2uuWLueS5juS9m+aVqee9mO+9s+ism+WEveazneWGi+S7lOa2geWIrOODgOKBoQ==', 'wpRYwqogwrQ=',
		'wqB5wrQhwqw=', 'XA7CjsOQw7A=', 'HRTDpg==', '5Z255p2N5Z6x6aGF5bqh5Lqs5omu5Yqy5LqH562C5qKh7724', 'wrpkPQ==',
		'6L6h6KC35ayN5oqf', '5Lqe5LiL6K2U4oK65pyM5reg5Yut5Lm35L205ped57ym77yq6K6b5YS95rGJ5YeL5Lu/5rSv5YmK44C64oCD',
		'w4kNw4PCsmo=', 'w7pYwoQD', 'wo8KJn0K', 'Y3nDj8K2wrM=', 'woY+w5dDPg==', 'wqLDp8OxeA==', 'HeS4pOS6oei3m+WMmQ==',
		'w4xVw5rDqMO+', 'w7QjOcK+BBfDsDg=', 'woJkP8KTwoVGXsKJ', 'wpBqesO1auKVouiMquW/ig==', 'cMKzXHcc', 'W8Kbw6FZeQ==',
		'wrjCmSUfw5I=', 'QMOOw7jCnMKJ', 'wqtkIsKVKw==', 'w7Z3wqQvdg==', 'wrZXEA==',
		'Ym/CucKQw6fCksOlwpfCo8KkCWAJBlXDvyAEIsO9w4YAw7vDvcOnXsOow6ARwrlswp1EGHc4wrEJ', 'wpFdwqknw4s=', 'ARrDs8O8Bw==',
		'w7RSwoI=', 'w5sxw6fDlg==', 'wo9rwqkkw6Nawq5L', 'BRbCnAg=', 'dsKmYVo=', 'wrNlO8KWwoJJVcKD', 'wr9TCcKV',
		'wrNlO8KWwoJJVcKDEMOSw6bDsw==', 'wo8bDl8=', 'c8Opw4nCnA==', 'wqwkw4TCjcKcw6rDk3E=', 'w501w7LDmcKKfkM=',
		'AeS7vuS6kOi0u+WPhA==', 'wqxSwrQCwr0=', 'w7BIw5vDv8OIWsKRDg==', 'AVTDrMKowoHil5HojIblvLs=',
		'w7xPwoQafcOuw67Cjw==', 'Kh8PwoQ=', 'wqjDlMOmeMOw', 'DxbChQw=', '55aw5oiK44O1', 'w4xbesO/', 'wo41wpBA',
		'w5E5w7DDnMKKakPCsg==', 'w6HDnQJtZ8OoXg==', 'woZ+EcK4Fg==', 'SFfDjcOhAA==',
		'w67Cv8OeJsOdRMOewo7DnsOuwprDjHnCssKlwp8lw7TCkhfCjsKtw7vChMK9w6QoTcKraRR/V8O8', 'w7cDw4DDpcKD', 'Z8Kuw7NMUw==',
		'f8O8w4nCjcKdwpXChm9jw47DmMKQbgAww77DtsKeaA==', 'w5tFPMK4MQ==', 'w64lw63Ct1w=',
		'w4wjwoVYUnFgdcOzdMOKZ8KKwrvDjMOqw5oTw5TDksKsWMONCRVVQsK9f0M=', 'cRzDocOrw48=',
		'wowhwopCGygpd8OUd8OKIsKTwq7DqMKlwpUDw5jDtMOoK8OLAjgSUsK3egcmADo2wpYFbcOHwo90YzjCkR/DrBk=',
		'NcKkwp/CiMKdw4rDmw5qwpbCk8Ofekh2w7zCt8KXasOXwqPDmSR9w5jDusO8acODw4Y7w412PQ7CpBfDu8O9wrs=', 'ZEPCmcKKw5Y=',
		'wqPCo8O4Tig=', 'w6wXw7PComE=', 'wpo7wpdV', 'wqFTFsKDOA==', 'woc6AXgV', 'w4RVacObw6HDlw==', 'ZcKzw7BOYA==',
		'wphtwro6w4RTwqFCMg==', 'ZsKOw69xXA==', 'RsOsw4fCusKf', 'NQDDtcK8', 'w5ViKcKJKQ==', 'OC7CvWEBJmzCpjg=',
		'w4zDhcKCw7bDqQ==', 'HBbCmBk=', 'aMKDdE87', 'KhjCnsO1Vgo=', 'LD01wofCmA==', 'bzPDuHw=', 'YsKgw6o=',
		'wq7CiE/Cklk=', 'WwjCk8OpQcKD', 'wrlxM8KWMA==', 'w4FPwqwqeA==',
		'Vn7DjsOFWsKzLFZ3VV9ICyvCjsOcS3jChxdpw7sww68yMzJCMg==', 'A8KXWVLDvg8=', 'w4kYKMKZDg==', 'ZMO+Ew==',
		'QWPDksOLTsK8LB9t', 'eX/DvMKRwonCpDjDnQ==', 'w4JjAlTCjg==', 'w7vCuxvDv3EZ', 'Yk7DmsOQBA==', 'wrIewokC',
		'bEbDp8K2woE=', 'wrjCjQcWw7k=', 'w5/DkVHChTI=', 'bcOjDMObIw==', 'wqQ5w4I=', '5b6J5aSk5omI5aa5', 'aifDtHh6',
		'LHrCrsKUw7vDmsKfw43Cq8KwXQ==', 'w7rCh8KUwp1Xw5HDjQDDiA==', 'w41pwqE9wpc=', 'woktw4DCkV/DgsOwLQ==', 'b2vDp8KR',
		'Xx3Cm8Op', 'wo9wwqY0w5BcwqELKMKwwovCiCPDlTVFw5zDm8OWDcKQw7rCiMK/w506ATfDicOt', 'YcOaF8OAOg==', 'YXfDrMOkGw==',
		'wpA5wo9DDQ==', 'SR/ChsO0QsKZTMKRw4TCg1g=', 'wrzCtAvDvHsZwpLDocOdwojChA==', 'w4zDncKPw63DuMOGwovDm8KG',
		'w5dBwqITw5M=', 'w5wxw6HDk8KIYl3Cow==', 'e8Otw5PCmsKaw4c=', 'wok1wpZFIyg1bQ==', 'ZBnCg8Oxw5A=',
		'WnnDucOOJmDDjMKl', 'w5jDjCLDhQ==', 'w4xAwrI1w6kmwqjCog==', 'w4Ygw4XChkPDhMOy', 'IQ7DssK0RsOof8Os',
		'w7lLPkrCuwk=', 'w5NCwo4lw6w=', '5bS657qZ56+x5ayD5oqV5p6N6aCt55uw5Lmt44Ke', 'w7bCsAbDr2AD',
		'V8Kkw7TCuWQPwpfCtGE=', 'Jx7ChMOhayY=', 'w5gxw77DksKXaEHCpcOs', 'wrBUwoQfwqE=', 'wq0/w5dgKcOp', 'wrBJwrkD',
		'wrh6FcKYwro=', 'wooCw4TCvMKa', 'wpTCn8OiawY=', '5Zyy5pyy5Z6+6aGt5bmW5Lug5oi15YqZ5Lux562W5qCe776e',
		'w7lewpEEQsOpw7zCmcKwwrU9', 'wqnDgRRvYsK4', 'McOpw5PCjsKZw4rDm30=', 'w41pwqcgw4NAwqFLJcOl', 'woMawopTLA==',
		'wrIFwoYSMsKwNsKSWcKaw4PCgsKtNcKcHjxzRT3Duz8nw74/w6E=', 'GMKTXkE=', 'wonChcObbA0=', 'NQHDr8OuEg==',
		'wqw/w4vCncKvw6zDnDHCiMO0BXQ4T8KRw5QEEcO3w4LCg0AwOcKIBsOhFjnCtsKxFw==', 'wqF2HcKLwrs=', 'w5shw7LCi1TDuw==',
		'w4JHIcKTCcO5JMOBwoHCkg==', 'w4NfRMKyw4o=', 'wqw/w4vCncKvw6zDnDHCiMO0BXQ4T8KRw5QEEcO3w4LCg1UnLsKoI8OgHA==',
		'CAXCnEJWwoh9w4YMRxHCgsONw4oQwoQtwrTDvsK3B8KCGcKywpcFwpFfwp7CvXVC', 'wp7CixYdw7XDjMOeOg==',
		'5Lm75LuB6L+I5Ziu5LqT56uk5pW35o+D', 'w7FXwpAjQA==', 'w4TDtyRyTA==', 'w597wos+w7Y=', 'ez3Dv2k=', 'woJJwo4mw78=',
		'S3XDvsOOJGDDl8KyUn/CnQ==', 'PG7Dp8Kbw7g=', 'e8Kfw5Rbcj1rw5XCqw==', 'enLCo8Kpw7nDjw==', 'McOmw5TCnsKFwpI=',
		'RhXCkcO2esKRVcKN', 'w4hRbQfDg8O6w4fCrTXDjcOtw4bCmMO/wpg+NCFKO8KNXsKeIsK7w4NaK8KI', 'w5zDriXDhn4=',
		'w6EKw4zCuVQ=', 'wod2wq8=', 'aWrDvMKcwqvCqiLDjw4=', 'w7bCqsOYJcOL', 'wpgxwpdUAzU=',
		'5Li55Li26K+34oOJ5p6z5rej5YqL5LiX5L625pe0572H776m6K2R5YSZ5rGJ5Yaf5LmC5ra65Yi144Kv4oKA',
		'jsejiami.yncofeJmQ.dvM6dISd=='
	];
(function(_0x13941f, _0x413164, _0x1788b8) {
	var _0x3ad233 = function(_0x4668fb, _0x21150d, _0x6c188, _0x15b7fc, _0x6d09a0) {
		_0x21150d = _0x21150d >> 0x8, _0x6d09a0 = 'po';
		var _0x27bd63 = 'shift',
			_0x1aef23 = 'push';
		if (_0x21150d < _0x4668fb) {
			while (--_0x4668fb) {
				_0x15b7fc = _0x13941f[_0x27bd63]();
				if (_0x21150d === _0x4668fb) {
					_0x21150d = _0x15b7fc;
					_0x6c188 = _0x13941f[_0x6d09a0 + 'p']();
				} else if (_0x21150d && _0x6c188['replace'](/[eynfeJQdMdISd=]/g, '') === _0x21150d) {
					_0x13941f[_0x1aef23](_0x15b7fc);
				}
			}
			_0x13941f[_0x1aef23](_0x13941f[_0x27bd63]());
		}
		return 0x7cc4d;
	};
	return _0x3ad233(++_0x413164, _0x1788b8) >> _0x413164 ^ _0x1788b8;
}(_0x3c1f, 0x1db, 0x1db00));
var _0x57e6 = function(_0x1727a3, _0x2ced20) {
	_0x1727a3 = ~~'0x' ['concat'](_0x1727a3);
	var _0x852064 = _0x3c1f[_0x1727a3];
	if (_0x57e6['DRHzTe'] === undefined) {
		(function() {
			var _0x4c52e1 = typeof window !== 'undefined' ? window : typeof process === 'object' &&
				typeof require === 'function' && typeof global === 'object' ? global : that;
			var _0x306410 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			_0x4c52e1['atob'] || (_0x4c52e1['atob'] = function(_0x535a52) {
				var _0x4c4057 = String(_0x535a52)['replace'](/=+$/, '');
				for (var _0x52b3d6 = 0x0, _0x324776, _0x492191, _0x5685a3 = 0x0, _0x6403c3 =
						''; _0x492191 = _0x4c4057['charAt'](_0x5685a3++); ~_0x492191 && (_0x324776 =
						_0x52b3d6 % 0x4 ? _0x324776 * 0x40 + _0x492191 : _0x492191, _0x52b3d6++ % 0x4) ?
					_0x6403c3 += String['fromCharCode'](0xff & _0x324776 >> (-0x2 * _0x52b3d6 & 0x6)) :
					0x0) {
					_0x492191 = _0x306410['indexOf'](_0x492191);
				}
				return _0x6403c3;
			});
		}());
		var _0x24b184 = function(_0x463697, _0x2ced20) {
			var _0x46e6d6 = [],
				_0x5b1b3f = 0x0,
				_0x3889be, _0x370d4b = '',
				_0x45210b = '';
			_0x463697 = atob(_0x463697);
			for (var _0x2b915c = 0x0, _0x2954c4 = _0x463697['length']; _0x2b915c < _0x2954c4; _0x2b915c++) {
				_0x45210b += '%' + ('00' + _0x463697['charCodeAt'](_0x2b915c)['toString'](0x10))['slice'](-0x2);
			}
			_0x463697 = decodeURIComponent(_0x45210b);
			for (var _0x397cd2 = 0x0; _0x397cd2 < 0x100; _0x397cd2++) {
				_0x46e6d6[_0x397cd2] = _0x397cd2;
			}
			for (_0x397cd2 = 0x0; _0x397cd2 < 0x100; _0x397cd2++) {
				_0x5b1b3f = (_0x5b1b3f + _0x46e6d6[_0x397cd2] + _0x2ced20['charCodeAt'](_0x397cd2 % _0x2ced20[
					'length'])) % 0x100;
				_0x3889be = _0x46e6d6[_0x397cd2];
				_0x46e6d6[_0x397cd2] = _0x46e6d6[_0x5b1b3f];
				_0x46e6d6[_0x5b1b3f] = _0x3889be;
			}
			_0x397cd2 = 0x0;
			_0x5b1b3f = 0x0;
			for (var _0xa32cad = 0x0; _0xa32cad < _0x463697['length']; _0xa32cad++) {
				_0x397cd2 = (_0x397cd2 + 0x1) % 0x100;
				_0x5b1b3f = (_0x5b1b3f + _0x46e6d6[_0x397cd2]) % 0x100;
				_0x3889be = _0x46e6d6[_0x397cd2];
				_0x46e6d6[_0x397cd2] = _0x46e6d6[_0x5b1b3f];
				_0x46e6d6[_0x5b1b3f] = _0x3889be;
				_0x370d4b += String['fromCharCode'](_0x463697['charCodeAt'](_0xa32cad) ^ _0x46e6d6[(_0x46e6d6[
					_0x397cd2] + _0x46e6d6[_0x5b1b3f]) % 0x100]);
			}
			return _0x370d4b;
		};
		_0x57e6['eHHJSA'] = _0x24b184;
		_0x57e6['jGaSBA'] = {};
		_0x57e6['DRHzTe'] = !![];
	}
	var _0x3000d6 = _0x57e6['jGaSBA'][_0x1727a3];
	if (_0x3000d6 === undefined) {
		if (_0x57e6['lgmwjX'] === undefined) {
			_0x57e6['lgmwjX'] = !![];
		}
		_0x852064 = _0x57e6['eHHJSA'](_0x852064, _0x2ced20);
		_0x57e6['jGaSBA'][_0x1727a3] = _0x852064;
	} else {
		_0x852064 = _0x3000d6;
	}
	return _0x852064;
};
const cp = $[_0x57e6('0', 'o[]7')]() ? require('child_process') : '';
const ACT_ID = _0x57e6('1', '8h&X');
const questionList = [{
	'q': '0c32c1c0e2284331beec6910dc07a948',
	'a': 'B:潘玮柏'
}, {
	'q': '3576e8750b0b4322977420622aff18a0',
	'a': _0x57e6('2', 'jveR')
}, {
	'q': _0x57e6('3', '@AL$'),
	'a': 'C:艾福杰尼'
}, {
	'q': _0x57e6('4', '3W3a'),
	'a': 'C:李雪琴'
}, {
	'q': 'a8e35c93ad79460d871f42a10bce68d4',
	'a': 'B:杜海涛'
}, {
	'q': _0x57e6('5', 'l#&3'),
	'a': _0x57e6('6', 'Cf^R')
}, {
	'q': _0x57e6('7', 'nqqN'),
	'a': 'B:张海宇'
}, {
	'q': _0x57e6('8', '(1U@'),
	'a': 'B:吴昕'
}, {
	'q': 'e5421dda894e4b43863aad4fd524fd9f',
	'a': _0x57e6('9', '3W3a')
}];
if ($['isNode']()) {
	Object[_0x57e6('a', '$B2C')](jdCookieNode)[_0x57e6('b', 's)5J')](_0x24a1be => {
		cookiesArr['push'](jdCookieNode[_0x24a1be]);
	});
	if (process[_0x57e6('c', 'nqqN')]['JD_DEBUG'] && process[_0x57e6('d', '(1U@')]['JD_DEBUG'] === _0x57e6('e', 'h844'))
		that[_0x57e6('f', '05!y')] = () => {};
} else {
	let cookiesData = $[_0x57e6('10', 'SLbp')](_0x57e6('11', 'HUuA')) || '[]';
	cookiesData = JSON[_0x57e6('12', '8h&X')](cookiesData);
	cookiesArr = cookiesData[_0x57e6('13', 'N7Dd')](_0x484734 => _0x484734[_0x57e6('14', '6[4L')]);
	cookiesArr['reverse']();
	cookiesArr['push'](...[$['getdata'](_0x57e6('15', 'ADX@')), $[_0x57e6('16', '@AL$')](_0x57e6('17', '2V(e'))]);
	cookiesArr[_0x57e6('18', '2V(e')]();
	cookiesArr = cookiesArr[_0x57e6('19', 'rFRA')](_0x44810e => !!_0x44810e);
}
$[_0x57e6('1a', '@AL$')]('脚本版本\x20v0.6\x0a更新时间:2021-03-30\x2017:13\x0a仓库：https://www.github.com/i-chenzhe/qx');
!(async () => {
	var _0x13f4ec = {
		'VYpqW': 'api.m.jd.com',
		'adLLV': 'application/x-www-form-urlencoded',
		'rJjZM': 'https://h5.m.jd.com',
		'KMusi': 'gzip,\x20deflate,\x20br',
		'NzqfK': _0x57e6('1b', 'OObj'),
		'RFYZe': _0x57e6('1c', '05!y'),
		'WBozI': _0x57e6('1d', 'E(c6'),
		'ZRWMf': _0x57e6('1e', 'Cf^R'),
		'dfcDB': function(_0x3cabb4) {
			return _0x3cabb4();
		},
		'ASTtt': function(_0x51c34b, _0x2ab1f8) {
			return _0x51c34b !== _0x2ab1f8;
		},
		'SaSzk': 'WzFWy',
		'LkrTD': _0x57e6('1f', 's)5J'),
		'oMaDa': 'zh-cn',
		'HmSXo': function(_0xdc4712, _0x1ac860) {
			return _0xdc4712 === _0x1ac860;
		},
		'RnzEZ': _0x57e6('20', 'KGCV'),
		'bbVUb': _0x57e6('21', '@AL$'),
		'ACRpW': 'application/json',
		'IAbCj': _0x57e6('22', '6[4L'),
		'xcEdE': _0x57e6('23', 'Ncw0'),
		'dRrCc': _0x57e6('24', '@AL$'),
		'vgTzZ': _0x57e6('25', 'N7Dd'),
		'mvszT': '├\x20当你收到这条通知说明你可能在使用【JD-FreeFuck】项目\x0a\x20\x20\x20\x20├\x20如果你并没有使用【JD-FreeFuck】项目也收到了这条消息请私聊我\x0a\x20\x20\x20\x20├\x20我不喜欢【JD-FreeFuck】搬运我脚本的行为\x0a\x20\x20\x20\x20├\x20建议更换运行环境\x0a\x20\x20\x20\x20├\x20lxk0301\x20docker部署方案:https://gitee.com/lxk0301/jd_docker\x20\x0a\x20\x20\x20\x20├\x20青龙\x20docker部署方案：https://t.me/c/1465257366/31\x20或\x20whyour/qinglong\x20请自行查找。\x0a\x20\x20\x20\x20└\x20不愿透露姓名的大佬的部署方案:\x20\x20nevinee/jd\x20请自行查找。\x0a\x0a\x20',
		'FbBFt': 'imUBy',
		'gTKid': '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取',
		'jupDQ': function(_0x13b91f, _0x12ec10) {
			return _0x13b91f < _0x12ec10;
		},
		'oglmN': 'uHAkl',
		'XJngG': function(_0x374650) {
			return _0x374650();
		},
		'TsJTk': function(_0x9109d2, _0x5c644e) {
			return _0x9109d2(_0x5c644e);
		},
		'MoLXb': function(_0x42749a, _0x27d4f8) {
			return _0x42749a + _0x27d4f8;
		},
		'QxDAe': function(_0x11103c) {
			return _0x11103c();
		},
		'KcdXo': function(_0x4e6317, _0x47ad1a) {
			return _0x4e6317 !== _0x47ad1a;
		},
		'ytpDM': _0x57e6('26', '8h&X'),
		'awgAx': _0x57e6('27', 'OObj'),
		'QfTEM': _0x57e6('28', 'rFRA'),
		'ncSRW': _0x57e6('29', 'N7Dd'),
		'qoLAz': function(_0x379289, _0x1264e7, _0x41aec3) {
			return _0x379289(_0x1264e7, _0x41aec3);
		},
		'isGYE': _0x57e6('2a', 'jveR'),
		'uLkfa': _0x57e6('2b', '6[4L'),
		'eNRHa': function(_0x8d9010) {
			return _0x8d9010();
		},
		'Mlpfo': function(_0x5c6157, _0x44c81f) {
			return _0x5c6157 !== _0x44c81f;
		},
		'IDtAx': 'vWpVd'
	};
	if (!cookiesArr[0x0]) {
		if (_0x13f4ec[_0x57e6('2c', '6vDj')](_0x13f4ec[_0x57e6('2d', '#7tl')], _0x13f4ec['FbBFt'])) {
			$['msg']($[_0x57e6('2e', 'jveR')], _0x13f4ec[_0x57e6('2f', 'vi&C')], _0x57e6('30', 'h844'), {
				'open-url': 'https://bean.m.jd.com/bean/signIndex.action'
			});
			return;
		} else {
			let _0xec315 = {
				'url': _0x57e6('31', 'Ncw0'),
				'headers': {
					'Host': _0x13f4ec[_0x57e6('32', '3W3a')],
					'Content-Type': _0x13f4ec[_0x57e6('33', 'vi&C')],
					'Origin': _0x13f4ec[_0x57e6('34', 'l#&3')],
					'Accept-Encoding': _0x13f4ec[_0x57e6('35', 'ddxz')],
					'Cookie': cookie,
					'Connection': _0x13f4ec[_0x57e6('36', 'ADX@')],
					'Accept': _0x13f4ec[_0x57e6('37', 'HUuA')],
					'User-Agent': _0x13f4ec['WBozI'],
					'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=' +
						actID + _0x57e6('38', 'l#&3'),
					'Accept-Language': 'zh-cn'
				},
				'body': _0x57e6('39', '6[4L') + actID + _0x57e6('3a', 'WJj*') + actsID + _0x57e6('3b',
					'6vDj')
			};
			return new Promise(_0x2d1c0d => {
				$['post'](_0xec315, (_0x59fe9c, _0x2a6e01, _0x30b6c0) => {
					if (_0x30b6c0) {
						$[_0x57e6('3c', '^Q[i')] = JSON[_0x57e6('3d', 'ooZO')](_0x30b6c0);
						_0x2d1c0d();
					};
				});
			});
		}
	}
	for (let _0x4d113d = 0x0; _0x13f4ec[_0x57e6('3e', '0bCp')](_0x4d113d, cookiesArr['length']); _0x4d113d++) {
		if (_0x13f4ec['ASTtt']('boBQQ', _0x13f4ec[_0x57e6('3f', 'Ncw0')])) {
			if (cookiesArr[_0x4d113d]) {
				await _0x13f4ec['XJngG'](getShareCode);
				cookie = cookiesArr[_0x4d113d];
				originCookie = cookiesArr[_0x4d113d];
				$[_0x57e6('40', 'wXU!')] = _0x13f4ec[_0x57e6('41', 'N7Dd')](decodeURIComponent, cookie[_0x57e6(
					'42', '#Dak')](/pt_pin=(.+?);/) && cookie[_0x57e6('43', 'ooZO')](/pt_pin=(.+?);/)[
					0x1]);
				$[_0x57e6('44', '9tUx')] = _0x13f4ec[_0x57e6('45', 'HUuA')](_0x4d113d, 0x1);
				$[_0x57e6('46', '0bCp')] = !![];
				$['nickName'] = '';
				await _0x13f4ec[_0x57e6('47', 'WJj*')](checkCookie);
				that[_0x57e6('48', '$B2C')](_0x57e6('49', 'qY7X') + $[_0x57e6('4a', 'jveR')] + '】' + ($[_0x57e6(
					'4b', 'wXU!')] || $['UserName']) + _0x57e6('4c', 'Ncw0'));
				if (!$[_0x57e6('4d', 'qY7X')]) {
					$['msg']($['name'], _0x57e6('4e', '6vDj'), _0x57e6('4f', 'wXU!') + $[_0x57e6('50',
						'6vDj')] + '\x20' + ($['nickName'] || $['UserName']) + _0x57e6('51', '(1U@'), {
						'open-url': _0x57e6('52', '05!y')
					});
					if ($[_0x57e6('53', 'wszE')]()) {
						await notify['sendNotify']($['name'] + _0x57e6('54', 'KGCV') + $[_0x57e6('55', 'HUuA')],
							'京东账号' + $['index'] + '\x20' + $[_0x57e6('56', 'jveR')] + _0x57e6('57', 'jveR'));
					}
					continue;
				}
				if (helpAuthor) {
					if (_0x13f4ec['KcdXo'](_0x13f4ec[_0x57e6('58', 'R0sR')], _0x57e6('59', '2V(e'))) {
						cookie = '' + cookie + ck[_0x57e6('5a', 'U^jz')](';')[0x0] + ';';
					} else {
						function _0x58f9a1() {
							var _0x1eb9fd = {
								'dVZTC': _0x13f4ec['ZRWMf'],
								'lrEZO': function(_0x3bf588) {
									return _0x13f4ec['dfcDB'](_0x3bf588);
								},
								'hMDKr': _0x57e6('5b', 'qY7X'),
								'HGETc': 'https://api.r2ray.com/jd.bargain/index'
							};
							return new Promise(_0x6fd91f => {
								var _0x5ec61a = {
									'TMgeJ': function(_0x4b6987, _0x545d9b) {
										return _0x4b6987 === _0x545d9b;
									},
									'Lptpx': _0x57e6('5c', 'a4Sx'),
									'dRBdR': _0x1eb9fd[_0x57e6('5d', '6vDj')],
									'VEFbf': function(_0x15ca52) {
										return _0x1eb9fd['lrEZO'](_0x15ca52);
									}
								};
								if (_0x1eb9fd[_0x57e6('5e', 'a4Sx')] !== _0x57e6('5f', 'Ncw0')) {
									$['get']({
										'url': _0x1eb9fd['HGETc']
									}, (_0x324295, _0x1388ad, _0x50c679) => {
										try {
											if (_0x50c679) {
												if (_0x5ec61a['Lptpx'] !== _0x5ec61a['dRBdR']) {
													$[_0x57e6('60', 'o[]7')] = JSON[_0x57e6(
														'61', '0p]7')](_0x50c679);
												} else {
													if (_0x324295) {
														that[_0x57e6('62', 'ooZO')]('' + JSON[
															'stringify'](_0x324295));
													} else {
														_0x50c679 = JSON[_0x57e6('63', 'h844')](
															_0x50c679);
														if (_0x5ec61a[_0x57e6('64', 'vi&C')](
																_0x50c679[_0x57e6('65',
																	'o[]7')], '0')) {
															$[_0x57e6('66', 'E(c6')] =
																_0x50c679[_0x57e6('67',
																	'BsQx')];
															cookie = cookie + _0x57e6('68',
																'E(c6') + $[_0x57e6('69',
																'ddxz')];
														}
													}
												}
											};
										} catch (_0x352778) {
											that[_0x57e6('6a', 'wszE')](_0x352778);
										} finally {
											_0x5ec61a['VEFbf'](_0x6fd91f);
										};
									});
								} else {
									if (data) {
										$['zData'] = JSON[_0x57e6('6b', 'wszE')](data);
									};
								}
							});
						}

						function _0x1caf2b(_0x2af0e1, _0xb3f55) {
							var _0x53aab3 = {
								'bNDWl': function(_0x37b1d2, _0x20917e) {
									return _0x13f4ec['ASTtt'](_0x37b1d2, _0x20917e);
								},
								'YeRAL': _0x13f4ec[_0x57e6('6c', 'EMMt')]
							};
							if (_0x13f4ec[_0x57e6('6d', 'ADX@')](_0x57e6('6e', 'SLbp'), _0x13f4ec[_0x57e6('6f',
									's)5J')])) {
								cookie = '' + cookie + sk[_0x57e6('70', 'BsQx')](';')[0x0] + ';';
							} else {
								let _0xb002c4 = {
									'url': _0x57e6('71', '3W3a'),
									'headers': {
										'Host': _0x13f4ec[_0x57e6('72', 'nqqN')],
										'Content-Type': 'application/x-www-form-urlencoded',
										'Origin': _0x13f4ec[_0x57e6('73', 'HUuA')],
										'Accept-Encoding': _0x57e6('74', '#Dak'),
										'Cookie': cookie,
										'Connection': _0x13f4ec['NzqfK'],
										'Accept': _0x57e6('75', '6[4L'),
										'User-Agent': 'jdapp;iPhone;9.4.0;14.3;;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;addressid/;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1',
										'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=' +
											_0x2af0e1 + _0x57e6('76', '$B2C'),
										'Accept-Language': _0x13f4ec[_0x57e6('77', 'wXU!')]
									},
									'body': _0x57e6('78', '2V(e') + _0x2af0e1 + _0x57e6('79', 'E(c6') +
										_0xb3f55 + _0x57e6('7a', 'BsQx')
								};
								return new Promise(_0x2f1da8 => {
									var _0x58ba71 = {
										'EvLCR': function(_0x4e0a13) {
											return _0x13f4ec[_0x57e6('7b', 'h844')](_0x4e0a13);
										}
									};
									$[_0x57e6('7c', '9tUx')](_0xb002c4, (_0x3f67e8, _0x1f9aee,
										_0x220fb7) => {
										if (_0x220fb7) {
											if (_0x53aab3[_0x57e6('7d', 'jveR')](_0x53aab3[
													_0x57e6('7e', 'KGCV')], _0x53aab3[
													_0x57e6('7f', 'ooZO')])) {
												if (_0x220fb7) {
													$['zRes'] = JSON[_0x57e6('61', '0p]7')](
														_0x220fb7);
													_0x58ba71[_0x57e6('80', 'X5oH')](_0x2f1da8);
												};
											} else {
												$[_0x57e6('81', 'OObj')] = JSON[_0x57e6('82',
													'HUuA')](_0x220fb7);
												_0x2f1da8();
											}
										};
									});
								});
							}
						}

						function _0x1f1e48(_0x4e8ddd, _0x2c5cda) {
							var _0x2e469b = {
								'RKPpR': function(_0xb5c21b, _0x25807b) {
									return _0xb5c21b !== _0x25807b;
								},
								'TBMox': _0x57e6('83', 'BsQx'),
								'gJMjc': function(_0x37bd1b) {
									return _0x37bd1b();
								}
							};
							if (_0x13f4ec[_0x57e6('84', 'h844')](_0x13f4ec[_0x57e6('85', 's)5J')], _0x13f4ec[
									'RnzEZ'])) {
								let _0x5891a0 = {
									'url': _0x13f4ec[_0x57e6('86', 'wXU!')],
									'headers': {
										'Content-Type': _0x13f4ec[_0x57e6('87', 'JqJw')]
									},
									'body': JSON['stringify']({
										'actID': _0x4e8ddd,
										'actsID': _0x2c5cda,
										'done': 0x1
									})
								};
								return new Promise(_0x3acd1d => {
									var _0x2763a1 = {
										'XveAG': function(_0xb85348, _0x4928f4) {
											return _0x2e469b[_0x57e6('88', 's)5J')](_0xb85348,
												_0x4928f4);
										},
										'EvcLK': _0x2e469b[_0x57e6('89', 'nqqN')],
										'SHjEl': function(_0x2e75dd) {
											return _0x2e469b[_0x57e6('8a', 'nqqN')](_0x2e75dd);
										}
									};
									$[_0x57e6('8b', 'wXU!')](_0x5891a0, (_0x4d9f02, _0x1391c1,
										_0x310c8a) => {
										if (_0x2763a1[_0x57e6('8c', 'OObj')](_0x57e6('8d',
												'KGCV'), _0x2763a1[_0x57e6('8e', '2V(e')])) {
											_0x2763a1[_0x57e6('8f', 'l#&3')](_0x3acd1d);
										} else {
											_0x310c8a = JSON['parse'](_0x310c8a);
											if (_0x310c8a[_0x57e6('90', '$B2C')] === '0') {
												$[_0x57e6('91', 'Ncw0')] = _0x310c8a[_0x57e6(
													'92', '@AL$')];
												cookie = cookie + 'IsvToken=' + $[_0x57e6('93',
													'KGCV')];
											}
										}
									});
								});
							} else {
								$['nickName'] = data[_0x57e6('94', 'Ncw0')][_0x57e6('95', '9tUx')][_0x57e6('96',
									'ddxz')]['nickname'];
							}
						}
						await _0x13f4ec['QxDAe'](_0x58f9a1);
						if (_0x13f4ec[_0x57e6('97', 'Cf^R')]($[_0x57e6('98', '6vDj')]['data'][_0x57e6('99',
								'rFRA')], 0x0)) {
							for (let _0x4d113d = 0x0; _0x4d113d < $[_0x57e6('9a', '$B2C')][_0x57e6('9b',
									'KGCV')][_0x57e6('9c', 'wszE')]; _0x4d113d++) {
								if (_0x13f4ec['awgAx'] !== _0x13f4ec['QfTEM']) {
									var _0x4ad142 = _0x13f4ec[_0x57e6('9d', 'N7Dd')][_0x57e6('9e', 'Kbl0')](
											'|'),
										_0x3f5f02 = 0x0;
									while (!![]) {
										switch (_0x4ad142[_0x3f5f02++]) {
											case '0':
												await $['wait'](0x5dc);
												continue;
											case '1':
												if ($[_0x57e6('9f', 'EMMt')] && $['Res'][_0x57e6('a0',
														'a4Sx')] === 0x4) {
													await _0x13f4ec['qoLAz'](_0x1f1e48, actID, actsID);
												}
												continue;
											case '2':
												await _0x13f4ec[_0x57e6('a1', 'Kbl0')](_0x1caf2b, actID,
													actsID);
												continue;
											case '3':
												actID = $[_0x57e6('60', 'o[]7')][_0x57e6('a2', '3W3a')][
													_0x4d113d
												][_0x57e6('a3', 'HUuA')];
												continue;
											case '4':
												actsID = $[_0x57e6('a4', '0p]7')][_0x57e6('a5', 'ddxz')][
													_0x4d113d
												]['actsID'];
												continue;
										}
										break;
									}
								} else {
									$[_0x57e6('a6', 'jveR')] = data[_0x57e6('a7', 'wXU!')][0x0][_0x57e6('a8',
										'05!y')];
								}
							};
						};
					}
				};
				if ($['isNode']()) {
					if (_0x13f4ec['KcdXo'](_0x13f4ec['isGYE'], _0x13f4ec[_0x57e6('a9', 'wszE')])) {
						cp[_0x57e6('aa', 'l#&3')](_0x57e6('ab', 'E(c6'), async function(_0x25e02c, _0x2f7eff,
							_0x11d898) {
							if (_0x13f4ec[_0x57e6('ac', 'a4Sx')] === _0x13f4ec[_0x57e6('ad',
									'2V(e')]) {
								if (_0x13f4ec['HmSXo'](_0x25e02c, null)) {
									if (_0x2f7eff[_0x57e6('ae', 'BsQx')](_0x13f4ec[_0x57e6('af',
											'o[]7')]) || _0x2f7eff[_0x57e6('b0', 'Kbl0')](_0x13f4ec[
											'dRrCc']) || _0x2f7eff[_0x57e6('b1', 'Cf^R')](_0x13f4ec[
											_0x57e6('b2', 'ddxz')])) {
										await notify['sendNotify']($[_0x57e6('b3', '$B2C')],
											_0x13f4ec[_0x57e6('b4', '6[4L')]);
									}
								}
							} else {
								$[_0x57e6('b5', 'BsQx')] = data[_0x57e6('b6', '@AL$')]['list'];
							}
						});
					} else {
						$[_0x57e6('b7', 'KGCV')] = data[_0x57e6('b8', 'rFRA')];
					}
				}
				await _0x13f4ec['eNRHa'](entertainment);
			}
		} else {
			that[_0x57e6('b9', '6[4L')]('' + JSON[_0x57e6('ba', '$B2C')](err));
		}
	}
	if (_0x13f4ec['Mlpfo'](message, '')) {
		if ($[_0x57e6('bb', 'OObj')]()) {
			await notify[_0x57e6('bc', 'U^jz')]($[_0x57e6('bd', 'wXU!')] + '运行完成', message);
		} else {
			if (_0x13f4ec[_0x57e6('be', 'WJj*')] !== _0x13f4ec['IDtAx']) {
				times = $[_0x57e6('bf', 'rFRA')];
			} else {
				await $[_0x57e6('c0', 'HUuA')]($[_0x57e6('c1', '0bCp')] + _0x57e6('c2', 'vi&C'), _0x57e6('c3',
					'vi&C'), message);
			}
		}
	}
})()[_0x57e6('c4', 'Kbl0')](_0x5d8351 => {
	$['log']('', '❌\x20' + $[_0x57e6('c5', '2V(e')] + ',\x20失败!\x20原因:\x20' + _0x5d8351 + '!', '');
})[_0x57e6('c6', 'o[]7')](() => {
	$['done']();
});
async function entertainment() {
	var _0x1e0bfc = {
		'rFKOY': 'DNIMZ',
		'QxrAr': _0x57e6('c7', 'nqqN'),
		'btILF': function(_0x18a0b9, _0xf0df60) {
			return _0x18a0b9 === _0xf0df60;
		},
		'SaVpn': _0x57e6('c8', 'X5oH'),
		'ZBapo': function(_0x5ace83) {
			return _0x5ace83();
		},
		'WLuHK': _0x57e6('c9', 'U^jz'),
		'BFIqh': _0x57e6('ca', 'OObj'),
		'HSSRG': 'api.m.jd.com',
		'oTDeD': 'application/x-www-form-urlencoded',
		'PJVas': 'keep-alive',
		'tctEy': _0x57e6('cb', 'X5oH'),
		'AkLTg': _0x57e6('cc', 's)5J'),
		'mIGgw': function(_0x205f4f) {
			return _0x205f4f();
		},
		'vzZyq': _0x57e6('cd', 'HUuA'),
		'rgjuQ': function(_0xfe5584) {
			return _0xfe5584();
		},
		'KRcmb': function(_0x509f79) {
			return _0x509f79();
		},
		'CueqB': function(_0x3b271d) {
			return _0x3b271d();
		},
		'NcUjH': function(_0x392ef4) {
			return _0x392ef4();
		},
		'gMskG': function(_0x533e35, _0x3a34ab, _0x1d2661) {
			return _0x533e35(_0x3a34ab, _0x1d2661);
		},
		'HQtWh': 'dingzhi/taskact/common/drawContent',
		'ROelN': function(_0x4e59a4, _0x55c4b7) {
			return _0x4e59a4(_0x55c4b7);
		},
		'hvZMI': function(_0x298197, _0x3fb27a) {
			return _0x298197 !== _0x3fb27a;
		},
		'mElgp': _0x57e6('ce', 'ooZO'),
		'QdzGq': function(_0x200856, _0x6fa5a5) {
			return _0x200856 !== _0x6fa5a5;
		},
		'eEdFi': _0x57e6('cf', 'wXU!'),
		'fCbQQ': function(_0x15d09e, _0x509fde) {
			return _0x15d09e > _0x509fde;
		},
		'MhlWr': _0x57e6('d0', 'BsQx'),
		'ntXXK': function(_0x35ebb6) {
			return _0x35ebb6();
		},
		'hCWfm': function(_0x494ca2, _0x249feb, _0x319877) {
			return _0x494ca2(_0x249feb, _0x319877);
		},
		'yUSbL': function(_0x151d74, _0x4f235d) {
			return _0x151d74 === _0x4f235d;
		}
	};
	$[_0x57e6('d1', '3W3a')] = ![];
	$['gameScore'] = 0x0;
	$['bean'] = 0x0;
	await _0x1e0bfc[_0x57e6('d2', 'Ncw0')](grantToken);
	await $[_0x57e6('d3', 'rFRA')](0x5dc);
	await _0x1e0bfc[_0x57e6('d4', 'U^jz')](getActCookie);
	await $[_0x57e6('d5', 'Ncw0')](0x5dc);
	await _0x1e0bfc['CueqB'](getActInfo);
	await $['wait'](0x5dc);
	await getMyPing();
	await $[_0x57e6('d6', '#Dak')](0x5dc);
	await _0x1e0bfc['NcUjH'](getUserInfo);
	await $[_0x57e6('d7', 'wXU!')](0x5dc);
	await _0x1e0bfc['gMskG'](getActContent, ![], $['userShareCode']);
	await _0x1e0bfc['gMskG'](doTask, _0x1e0bfc[_0x57e6('d8', '^Q[i')], _0x57e6('d9', 'ddxz') + ACT_ID + _0x57e6(
		'da', 'X5oH') + _0x1e0bfc['ROelN'](encodeURIComponent, $['secretPin']));
	if (!$['risk']) {
		if (_0x1e0bfc['hvZMI'](_0x57e6('db', '8h&X'), _0x57e6('dc', 'o[]7'))) {
			var _0x407663 = _0x1e0bfc['mElgp'][_0x57e6('dd', 'ADX@')]('|'),
				_0x394524 = 0x0;
			while (!![]) {
				switch (_0x407663[_0x394524++]) {
					case '0':
						await _0x1e0bfc['ROelN'](submitShareCode, {
							'share_code': $[_0x57e6('de', 'SLbp')],
							'pt_key': $[_0x57e6('df', '0p]7')]
						});
						continue;
					case '1':
						await $[_0x57e6('e0', 'o[]7')](0x5dc);
						continue;
					case '2':
						await $[_0x57e6('e1', 'l#&3')](0x5dc);
						continue;
					case '3':
						await _0x1e0bfc['NcUjH'](draw);
						continue;
					case '4':
						await _0x1e0bfc['NcUjH'](answer);
						continue;
					case '5':
						await _0x1e0bfc[_0x57e6('e2', 'X5oH')](getActContent, ![]);
						continue;
					case '6':
						await $[_0x57e6('e3', 'vi&C')](0x5dc);
						continue;
					case '7':
						await _0x1e0bfc[_0x57e6('e4', 'JqJw')](getActContent, $[_0x57e6('e5', '#7tl')]);
						continue;
					case '8':
						that['log'](_0x57e6('e6', 'ooZO') + $[_0x57e6('e7', '0p]7')] + '\x20】');
						continue;
				}
				break;
			}
		} else {
			that['log']('' + JSON[_0x57e6('e8', '8h&X')](err));
		}
	} else {
		if ($[_0x57e6('e9', 'JqJw')]()) {
			await notify[_0x57e6('ea', 'Cf^R')]($['name'] + '运行完成', '京东账号' + $['index'] + '\x20' + ($['nickName'] ||
				$['UserName']) + _0x57e6('eb', '#Dak'));
		} else {
			if (_0x1e0bfc[_0x57e6('ec', '8h&X')](_0x1e0bfc[_0x57e6('ed', '8h&X')], _0x57e6('ee', 'HUuA'))) {
				that[_0x57e6('ef', 'U^jz')](_0x57e6('f0', '0p]7') + tmp[0x0]['a']);
				options = tmp[0x0]['a'];
			} else {
				await $[_0x57e6('f1', 'WJj*')]($['name'] + _0x57e6('f2', 'U^jz'), _0x57e6('f3', 'EMMt'));
			}
		}
	}
	if (_0x1e0bfc[_0x57e6('f4', 'jveR')]($[_0x57e6('f5', '0bCp')], 0x0)) {
		if (_0x1e0bfc[_0x57e6('f6', 'N7Dd')](_0x57e6('f7', 'o[]7'), _0x1e0bfc[_0x57e6('f8', '(1U@')])) {
			$[_0x57e6('f9', 'ADX@')] = JSON['parse'](data);
			resolve();
		} else {
			message += _0x57e6('fa', 'l#&3') + $[_0x57e6('fb', 'h844')] + '\x20' + ($[_0x57e6('fc', 'X5oH')] || $[
				_0x57e6('fd', 'WJj*')]) + _0x57e6('fe', 'X5oH') + $['bean'] + '京豆';
		}
	}
	if (helpAuthor) {
		function _0x27854e() {
			var _0x2b168b = {
				'FTMeg': function(_0x4f22cc) {
					return _0x4f22cc();
				},
				'WFEag': function(_0xe30f71, _0x4a7ac6) {
					return _0xe30f71 !== _0x4a7ac6;
				},
				'zVFev': _0x1e0bfc['rFKOY'],
				'nJABB': _0x1e0bfc['QxrAr']
			};
			if (_0x1e0bfc[_0x57e6('ff', 'ooZO')](_0x1e0bfc[_0x57e6('100', 'wXU!')], _0x1e0bfc[_0x57e6('101',
					'05!y')])) {
				return new Promise(_0x16c6d5 => {
					if (_0x2b168b[_0x57e6('102', 'l#&3')](_0x2b168b[_0x57e6('103', '^Q[i')], _0x2b168b[
							_0x57e6('104', '0bCp')])) {
						$[_0x57e6('105', '^Q[i')]({
							'url': _0x57e6('106', '6[4L')
						}, (_0x3a49b3, _0x43c4db, _0x191846) => {
							try {
								if (_0x191846) {
									$[_0x57e6('107', 'Cf^R')] = JSON[_0x57e6('108', 'U^jz')](
										_0x191846);
								};
							} catch (_0x124ab2) {
								that[_0x57e6('109', '0bCp')](_0x124ab2);
							} finally {
								_0x2b168b['FTMeg'](_0x16c6d5);
							};
						});
					} else {
						message += '获得' + data[_0x57e6('10a', 'okJ[')][_0x57e6('10b', 'Cf^R')][_0x57e6(
							'10c', 'qzRw')] + '\x0a';
						that['log']('获得' + data[_0x57e6('10d', 'ooZO')][_0x57e6('10e', 'WJj*')][_0x57e6(
							'10f', '^Q[i')] + '\x0a');
						if (data[_0x57e6('a7', 'wXU!')][_0x57e6('110', 'WJj*')] === 0x6) {
							$[_0x57e6('111', 'N7Dd')] += data[_0x57e6('112', 'l#&3')][_0x57e6('113',
								'ddxz')][_0x57e6('114', 'okJ[')];
						} else {
							message += _0x57e6('115', 'nqqN') + $[_0x57e6('116', '8h&X')] + '\x20' + ($[
									'nickName'] || $[_0x57e6('117', 'h844')]) + _0x57e6('118', 'HUuA') +
								data['data'][_0x57e6('119', '0bCp')][_0x57e6('11a', 'R0sR')];
						}
					}
				});
			} else {
				data = JSON[_0x57e6('11b', 'ADX@')](data);
				if (data[_0x57e6('11c', 'qzRw')]) {
					that['log'](_0x57e6('11d', '0bCp') + data[_0x57e6('11e', '#7tl')]['nickname'] + '】信息获取成功');
					$['userId'] = data[_0x57e6('11f', 'SLbp')]['id'];
					$['pinImg'] = data['data']['yunMidImageUrl'];
					$[_0x57e6('120', 'okJ[')] = data[_0x57e6('11f', 'SLbp')][_0x57e6('121', 'OObj')];
				} else {
					that['log'](data);
				}
			}
		}

		function _0x4e25ff(_0x544a3b, _0x532c1b) {
			var _0x6d3156 = {
				'nXTjB': function(_0x56f327) {
					return _0x1e0bfc['ZBapo'](_0x56f327);
				},
				'MKKHI': _0x1e0bfc[_0x57e6('122', '^Q[i')]
			};
			if (_0x1e0bfc['BFIqh'] === _0x57e6('123', '9tUx')) {
				$['post'](opt, (_0x1207f6, _0x24fee4, _0x168074) => {
					resolve();
				});
			} else {
				let _0x4efb2d = {
					'url': _0x57e6('124', 'a4Sx'),
					'headers': {
						'Host': _0x1e0bfc[_0x57e6('125', 'okJ[')],
						'Content-Type': _0x1e0bfc[_0x57e6('126', 'wXU!')],
						'Origin': _0x57e6('127', 'l#&3'),
						'Accept-Encoding': 'gzip,\x20deflate,\x20br',
						'Cookie': cookie,
						'Connection': _0x1e0bfc['PJVas'],
						'Accept': _0x1e0bfc[_0x57e6('128', 'wszE')],
						'User-Agent': _0x1e0bfc[_0x57e6('129', 'jveR')],
						'Referer': 'https://h5.m.jd.com/babelDiy/Zeus/4ZK4ZpvoSreRB92RRo8bpJAQNoTq/index.html?serveId=wxe30973feca923229&actId=' +
							_0x544a3b + _0x57e6('12a', 'SLbp'),
						'Accept-Language': _0x57e6('12b', 'HUuA')
					},
					'body': _0x57e6('12c', 'SLbp') + _0x544a3b + _0x57e6('12d', 'l#&3') + _0x532c1b +
						',\x22userPic\x22:\x22\x22}&client=wh5&clientVersion=1.0.0'
				};
				return new Promise(_0x31b2f0 => {
					var _0xa8451f = {
						'jDnIY': function(_0x19ff84) {
							return _0x6d3156[_0x57e6('12e', '6[4L')](_0x19ff84);
						}
					};
					if (_0x6d3156[_0x57e6('12f', 'KGCV')] !== _0x57e6('130', 'jveR')) {
						$[_0x57e6('131', 'SLbp')](_0x4efb2d, (_0x31c529, _0x1fd84c, _0x33b375) => {
							if (_0x33b375) {
								$['zRes'] = JSON[_0x57e6('132', '^Q[i')](_0x33b375);
								_0xa8451f[_0x57e6('133', 'N7Dd')](_0x31b2f0);
							};
						});
					} else {
						$[_0x57e6('134', '#7tl')](e, resp);
					}
				});
			}
		}

		function _0x13152d(_0x2a29e0, _0x2de9de) {
			var _0x40617c = {
				'APDTT': function(_0x432c8d) {
					return _0x1e0bfc[_0x57e6('135', 'wXU!')](_0x432c8d);
				}
			};
			let _0x28ad1c = {
				'url': 'https://api.r2ray.com/jd.bargain/done',
				'headers': {
					'Content-Type': _0x1e0bfc['vzZyq']
				},
				'body': JSON[_0x57e6('136', 'Cf^R')]({
					'actID': _0x2a29e0,
					'actsID': _0x2de9de,
					'done': 0x1
				})
			};
			return new Promise(_0x1fcbf1 => {
				$['post'](_0x28ad1c, (_0x5b6ee4, _0x1a08a0, _0x4f2297) => {
					_0x40617c['APDTT'](_0x1fcbf1);
				});
			});
		}
		await _0x1e0bfc[_0x57e6('137', 'wXU!')](_0x27854e);
		if (_0x1e0bfc[_0x57e6('138', 'l#&3')]($['zData'][_0x57e6('139', '0p]7')]['length'], 0x0)) {
			for (let _0x56529e = 0x0; _0x56529e < $[_0x57e6('13a', 'wszE')]['data']['length']; _0x56529e++) {
				var _0xe01935 = _0x57e6('13b', 'nqqN')[_0x57e6('13c', 's)5J')]('|'),
					_0x38d362 = 0x0;
				while (!![]) {
					switch (_0xe01935[_0x38d362++]) {
						case '0':
							await $[_0x57e6('13d', 'qzRw')](0x5dc);
							continue;
						case '1':
							actsID = $[_0x57e6('13e', 'ooZO')][_0x57e6('10d', 'ooZO')][_0x56529e][_0x57e6('13f',
								'E(c6')];
							continue;
						case '2':
							await _0x1e0bfc[_0x57e6('140', 'R0sR')](_0x4e25ff, actID, actsID);
							continue;
						case '3':
							actID = $[_0x57e6('13a', 'wszE')][_0x57e6('141', 'nqqN')][_0x56529e]['actID'];
							continue;
						case '4':
							if ($[_0x57e6('142', 'vi&C')] && _0x1e0bfc[_0x57e6('143', 'qY7X')]($[_0x57e6('9f',
									'EMMt')][_0x57e6('144', '2V(e')], 0x4)) {
								await _0x1e0bfc[_0x57e6('145', '^Q[i')](_0x13152d, actID, actsID);
							}
							continue;
					}
					break;
				}
			};
		};
	};
}
async function draw() {
	var _0x3f749a = {
		'erxHU': function(_0x15c2d0) {
			return _0x15c2d0();
		},
		'JuLmt': function(_0x305995, _0x54cb6f) {
			return _0x305995 < _0x54cb6f;
		},
		'HXPwV': function(_0x1c4eeb, _0x2714e1) {
			return _0x1c4eeb === _0x2714e1;
		},
		'xlOyP': 'Rryfj',
		'SRrLD': _0x57e6('146', '0bCp'),
		'vXiCD': function(_0xffae13, _0x52769f) {
			return _0xffae13 !== _0x52769f;
		},
		'SutyE': 'ncFiz',
		'auxeI': _0x57e6('147', 'EMMt')
	};
	for (let _0x457d60 = 0x0; _0x3f749a['JuLmt'](_0x457d60, $['cardList'][_0x57e6('148', '3WPd')]); _0x457d60++) {
		if (_0x3f749a['HXPwV'](_0x3f749a['xlOyP'], _0x3f749a[_0x57e6('149', 'X5oH')])) {
			that[_0x57e6('14a', '#Dak')]('' + JSON[_0x57e6('14b', 'EMMt')](err));
		} else {
			const _0x3a8b77 = $[_0x57e6('14c', 'o[]7')][_0x457d60];
			if (_0x3f749a[_0x57e6('14d', '@AL$')](_0x3a8b77[_0x57e6('14e', 'Kbl0')], !![]) && _0x3f749a[_0x57e6(
					'14f', '9tUx')](_0x3a8b77[_0x57e6('150', 'JqJw')], ![])) {
				if (_0x3f749a[_0x57e6('151', 'o[]7')](_0x3f749a[_0x57e6('152', '05!y')], _0x3f749a[_0x57e6('153',
						'6vDj')])) {
					_0x3f749a[_0x57e6('154', '#Dak')](resolve);
				} else {
					that[_0x57e6('155', 'ddxz')](_0x57e6('156', 'Ncw0'));
					await doTask(_0x3f749a[_0x57e6('157', 'nqqN')], _0x57e6('d9', 'ddxz') + ACT_ID + _0x57e6('158',
						'6[4L') + $[_0x57e6('159', 'Ncw0')] + _0x57e6('15a', 'Cf^R') + encodeURIComponent($[
						'secretPin']) + _0x57e6('15b', 'jveR') + _0x3a8b77[_0x57e6('15c', 'o[]7')]);
					await $[_0x57e6('15d', '2V(e')](0x3e8);
				}
			}
		}
	}
}
async function answer() {
	var _0x3d9644 = {
		'KafCI': function(_0x350862, _0x32d841, _0x662f15) {
			return _0x350862(_0x32d841, _0x662f15);
		},
		'zmkbb': _0x57e6('15e', 'Cf^R'),
		'kncON': function(_0x1e7fc2, _0x4b5827) {
			return _0x1e7fc2(_0x4b5827);
		},
		'omOyq': function(_0x2b3882, _0x3e1344) {
			return _0x2b3882 === _0x3e1344;
		},
		'uhTxd': function(_0x897c03, _0xb08c68) {
			return _0x897c03 <= _0xb08c68;
		},
		'BTaFO': _0x57e6('15f', '#Dak'),
		'UfVBC': function(_0x252754, _0x5f2c6d) {
			return _0x252754(_0x5f2c6d);
		},
		'iNnrC': function(_0x567799, _0x298c74, _0x1b8a2b) {
			return _0x567799(_0x298c74, _0x1b8a2b);
		}
	};
	await _0x3d9644[_0x57e6('160', '9tUx')](doTask, _0x3d9644[_0x57e6('161', 'SLbp')], _0x57e6('162', '2V(e') +
		ACT_ID + _0x57e6('163', 'Kbl0') + $[_0x57e6('164', 's)5J')] + '&pin=' + _0x3d9644[_0x57e6('165',
			'3W3a')](encodeURIComponent, $['secretPin']));
	let _0x274461 = [0x0, 0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8];
	let _0x444f84 = [];
	for (let _0x48954b = 0x0; _0x48954b < $[_0x57e6('166', 'okJ[')][_0x57e6('167', 'l#&3')]; _0x48954b++) {
		const _0x2fbaf2 = $[_0x57e6('168', 'SLbp')][_0x48954b];
		if (_0x3d9644[_0x57e6('169', 'HUuA')](_0x2fbaf2[_0x57e6('16a', '9tUx')], 0x63)) {
			_0x444f84[_0x57e6('16b', ')QGk')](_0x2fbaf2);
		}
		if (_0x2fbaf2[_0x57e6('16c', '3W3a')] !== 0x63) {
			let _0x457baa = _0x274461[_0x57e6('16d', 'jveR')](_0x2fbaf2[_0x57e6('16e', '0p]7')]);
			_0x274461[_0x57e6('16f', '@AL$')](_0x457baa, 0x1);
		}
	}
	if (_0x3d9644[_0x57e6('170', '3W3a')](_0x444f84['length'], 0x0)) {
		that[_0x57e6('14a', '#Dak')](_0x57e6('171', 'ddxz'));
		return;
	}
	if (_0x444f84[_0x57e6('172', 'Kbl0')] < $[_0x57e6('173', 'vi&C')]) {
		times = _0x444f84[_0x57e6('174', 'E(c6')];
	} else {
		times = $[_0x57e6('175', 'okJ[')];
	}
	for (let _0x335dd9 = 0x0; _0x3d9644[_0x57e6('176', '8h&X')](_0x335dd9, times); _0x335dd9++) {
		let _0x2c1b7a = '';
		const _0xbccbd6 = questionList[_0x57e6('177', '(1U@')](_0x207849 => _0x207849['q'] === _0x444f84[_0x335dd9][
			_0x57e6('178', '8h&X')
		]);
		if (_0xbccbd6 && _0xbccbd6[0x0]) {
			if (_0x3d9644[_0x57e6('179', 'WJj*')](_0x3d9644[_0x57e6('17a', 'ddxz')], _0x57e6('17b', 'KGCV'))) {
				resolve();
			} else {
				that['log'](_0x57e6('17c', 'o[]7') + _0xbccbd6[0x0]['a']);
				_0x2c1b7a = _0xbccbd6[0x0]['a'];
			}
		}
		let _0xde5cd7 = _0x57e6('17d', '0bCp') + ACT_ID + '&actorUuid=' + $['shareCode'] + '&pin=' + _0x3d9644[
			'UfVBC'](encodeURIComponent, $['secretPin']) + _0x57e6('17e', 'OObj') + _0x444f84[_0x335dd9][
			_0x57e6('15c', 'o[]7')
		] + _0x57e6('17f', 'l#&3') + encodeURIComponent(_0x2c1b7a) + _0x57e6('180', 'Cf^R') + _0x274461[
			_0x335dd9];
		await _0x3d9644[_0x57e6('181', 'SLbp')](doTask, _0x57e6('182', 'JqJw'), _0xde5cd7);
		await $[_0x57e6('183', '3WPd')](0x5dc);
	}
}
async function getActContent(_0x21ff94 = !![], _0x3872d1 = '') {
	var _0x40d1dd = {
		'tWtkH': function(_0x3c5828, _0x1183cf) {
			return _0x3c5828 !== _0x1183cf;
		},
		'NDmZo': _0x57e6('184', 'KGCV'),
		'YTdgD': 'WXVAZ',
		'fKWBp': function(_0x507a75, _0x88c0de) {
			return _0x507a75 !== _0x88c0de;
		},
		'nUiOw': _0x57e6('185', 'U^jz'),
		'KtDRQ': function(_0x4c6b38, _0x505c26) {
			return _0x4c6b38 === _0x505c26;
		},
		'nTuXC': 'TIvKw',
		'CcjLT': function(_0x1fda43, _0x4a941c, _0x9de3a4) {
			return _0x1fda43(_0x4a941c, _0x9de3a4);
		},
		'fiOvH': _0x57e6('186', 'ddxz'),
		'DgMAl': _0x57e6('187', 'WJj*'),
		'ZMbij': _0x57e6('188', 'jveR'),
		'FtTes': _0x57e6('189', 'wszE'),
		'SpLiX': function(_0x5c0204, _0x179cbe) {
			return _0x5c0204(_0x179cbe);
		},
		'ZLtXr': function(_0x20f143, _0x285611) {
			return _0x20f143(_0x285611);
		},
		'nQDFG': function(_0x2396a4, _0x4fa446) {
			return _0x2396a4 + _0x4fa446;
		},
		'bUqCw': function(_0xc29d2c, _0x1b2206) {
			return _0xc29d2c !== _0x1b2206;
		},
		'HiTlc': _0x57e6('18a', 'BsQx'),
		'hndah': _0x57e6('18b', 'ddxz'),
		'quYzk': function(_0x21d1ef, _0x35bc16, _0x16201c) {
			return _0x21d1ef(_0x35bc16, _0x16201c);
		},
		'MgtfV': _0x57e6('18c', 'qzRw'),
		'xLPiw': function(_0x348059, _0x195b9c, _0x482d3b) {
			return _0x348059(_0x195b9c, _0x482d3b);
		},
		'ijuNt': function(_0x3f0ab5, _0x27cda1) {
			return _0x3f0ab5 === _0x27cda1;
		},
		'KCEtJ': _0x57e6('18d', '05!y'),
		'cTJbk': function(_0x317320) {
			return _0x317320();
		},
		'iPFuU': 'dingzhi/change/able/activityContent'
	};
	return new Promise(_0x57d1db => {
		var _0x15e5b3 = {
			'XqIxA': _0x57e6('18e', 'qY7X'),
			'LrMKm': function(_0x501db6, _0x5910cf) {
				return _0x40d1dd[_0x57e6('18f', '0bCp')](_0x501db6, _0x5910cf);
			},
			'bplpG': function(_0x21dc9b, _0x3cf380) {
				return _0x21dc9b === _0x3cf380;
			},
			'qPPgr': _0x40d1dd[_0x57e6('190', 'OObj')],
			'DkutD': function(_0xf31d52) {
				return _0x40d1dd[_0x57e6('191', '3W3a')](_0xf31d52);
			}
		};
		$[_0x57e6('192', 'nqqN')](taskPostUrl(_0x40d1dd[_0x57e6('193', 'Cf^R')], _0x57e6('194', '9tUx') +
			ACT_ID + _0x57e6('195', 'o[]7') + encodeURIComponent($[_0x57e6('196', 'wXU!')]) +
			'&pinImg=' + $[_0x57e6('197', '6[4L')] + _0x57e6('198', 'l#&3') + $[_0x57e6('199',
				'2V(e')] + _0x57e6('19a', '$B2C') + _0x3872d1), async (_0x2b2bb5, _0x14f6b4,
			_0x1d6e6c) => {
			if (_0x40d1dd[_0x57e6('19b', ')QGk')](_0x40d1dd[_0x57e6('19c', 'jveR')], _0x40d1dd[
					'YTdgD'])) {
				try {
					if (_0x2b2bb5) {
						that[_0x57e6('19d', 'Cf^R')]('' + JSON[_0x57e6('19e', 'o[]7')](
							_0x2b2bb5));
					} else {
						_0x1d6e6c = JSON[_0x57e6('19f', 'a4Sx')](_0x1d6e6c);
						if (_0x1d6e6c[_0x57e6('1a0', 'SLbp')] === ![]) {
							$['risk'] = !![];
							that[_0x57e6('1a', '@AL$')](_0x57e6('1a1', 'BsQx'));
							return;
						}
						$[_0x57e6('1a2', '@AL$')] = _0x1d6e6c[_0x57e6('1a3', 'R0sR')][_0x57e6(
							'1a4', 'Ncw0')];
						$[_0x57e6('1a5', 'U^jz')] = _0x1d6e6c['data'][_0x57e6('1a6', 'jveR')];
						$['addSku'] = _0x1d6e6c['data'][_0x57e6('1a7', 'X5oH')];
						$['mainActive'] = _0x1d6e6c['data'][_0x57e6('1a8', 'ADX@')];
						$[_0x57e6('1a9', 'HUuA')] = _0x1d6e6c[_0x57e6('1aa', 'HUuA')][_0x57e6(
							'1ab', '#7tl')];
						if (_0x1d6e6c[_0x57e6('1ac', 's)5J')][_0x57e6('bf', 'rFRA')] === 0x9) {
							if (_0x40d1dd[_0x57e6('1ad', '0p]7')](_0x40d1dd['nUiOw'], _0x40d1dd[
									_0x57e6('1ae', 'OObj')])) {
								$[_0x57e6('1af', 'Kbl0')](_0x15e5b3[_0x57e6('1b0', 's)5J')]);
							} else {
								$['doJob'] = ![];
								if (_0x40d1dd['KtDRQ'](_0x1d6e6c[_0x57e6('1b1', 'OObj')][
										'drawOrNo'
									], ![]) && _0x40d1dd[_0x57e6('1b2', '$B2C')](_0x1d6e6c[
											_0x57e6('9b', 'KGCV')][_0x57e6('1b3', 'E(c6')], !
										![])) {
									if (_0x40d1dd[_0x57e6('1b4', 'wXU!')] !== _0x57e6('1b5',
											'9tUx')) {
										that[_0x57e6('1b6', 'SLbp')](_0x57e6('1b7', '#7tl'));
										await _0x40d1dd[_0x57e6('1b8', '05!y')](doTask,
											_0x40d1dd[_0x57e6('1b9', '2V(e')], _0x57e6(
												'1ba', 'a4Sx') + ACT_ID + _0x57e6('1bb',
												'ooZO') + $[_0x57e6('1bc', '3W3a')] +
											_0x57e6('1bd', 'qY7X') + escape($[_0x57e6('1be',
												')QGk')]) + _0x57e6('1bf', '0p]7'));
									} else {
										_0x57d1db();
									}
								}
							}
						}
						if (_0x21ff94) {
							if (_0x40d1dd[_0x57e6('1c0', '05!y')](_0x57e6('1c1', 'R0sR'),
									_0x40d1dd[_0x57e6('1c2', 'X5oH')])) {
								for (let _0x49afe9 of [_0x40d1dd['ZMbij'], _0x40d1dd[_0x57e6(
										'1c3', 'EMMt')]]) {
									let _0x189d6a = _0x1d6e6c['data'][_0x49afe9];
									for (let _0x4e5a79 of _0x189d6a['settings']) {
										let _0x513621 = _0x57e6('1c4', ')QGk') + ACT_ID +
											'&actorUuid=' + $['shareCode'] + _0x57e6('1c5',
												'jveR') + _0x40d1dd['SpLiX'](encodeURIComponent,
												$[_0x57e6('1c6', 'okJ[')]) + _0x57e6('1c7',
												'9tUx') + _0x4e5a79[_0x57e6('1c8', 'HUuA')] +
											'&taskValue=' + _0x4e5a79[_0x57e6('1c9', '3WPd')];
										let _0x56f1f4 = _0x57e6('1ca', '8h&X') + _0x1d6e6c[
												_0x57e6('1cb', 'jveR')][_0x57e6('1cc',
												'2V(e')] + '&elementId=' + _0x40d1dd[_0x57e6(
												'1cd',
												'Kbl0')](encodeURIComponent, _0x40d1dd[_0x57e6(
												'1ce', 'qzRw')]('店铺', _0x4e5a79['value'])) +
											'&pageId=' + ACT_ID + '&pin=' + encodeURIComponent(
												$[_0x57e6('1cf', 's)5J')]);
										if (_0x4e5a79[_0x57e6('1d0', '(1U@')] === 0xc &&
											_0x4e5a79[_0x57e6('1d1', 'h844')] === 0x0) {
											if (_0x40d1dd[_0x57e6('1d2', '^Q[i')](_0x40d1dd[
													_0x57e6('1d3', 'wXU!')], _0x40d1dd[
													'HiTlc'])) {
												_0x1d6e6c = JSON[_0x57e6('61', '0p]7')](
													_0x1d6e6c);
												if (_0x15e5b3[_0x57e6('1d4', '0p]7')](_0x1d6e6c[
														'retcode'], _0x57e6('1d5', 'U^jz'))) {
													$['isLogin'] = ![];
													return;
												}
												if (_0x15e5b3[_0x57e6('1d6', 'Kbl0')](_0x1d6e6c[
														'retcode'], '0') && _0x1d6e6c['data'][
														_0x57e6('1d7', 'qzRw')
													](_0x15e5b3[_0x57e6('1d8', '$B2C')])) {
													$[_0x57e6('1d9', 'U^jz')] = _0x1d6e6c[
														_0x57e6('1da', 'o[]7')][_0x57e6(
														'1db', 'E(c6')][_0x57e6('1dc',
														')QGk')][_0x57e6('1dd', '#7tl')];
												}
											} else {
												that['log'](_0x57e6('1de', 'Cf^R') + _0x4e5a79[
													'name']);
												await _0x40d1dd[_0x57e6('1df', 'Cf^R')](doTask,
													_0x40d1dd['hndah'], _0x513621);
												await $[_0x57e6('1e0', '8h&X')](0x7d0);
												await _0x40d1dd['quYzk'](doTask, _0x40d1dd[
													'MgtfV'], _0x56f1f4);
											}
										} else if (_0x40d1dd['KtDRQ'](_0x4e5a79['status'],
												0x0)) {
											if (_0x40d1dd[_0x57e6('1e1', '2V(e')](_0x57e6('1e2',
													'qY7X'), _0x57e6('1e3', 'okJ['))) {
												that[_0x57e6('1e4', '3WPd')]('' + JSON[_0x57e6(
													'1e5', 'OObj')](_0x2b2bb5));
											} else {
												that['log']('浏览店铺\x20-\x20' + _0x4e5a79[_0x57e6(
													'1e6', 'wszE')]);
												await _0x40d1dd[_0x57e6('1e7', '2V(e')](doTask,
													'dingzhi/change/able/saveTask',
													_0x513621);
												await $[_0x57e6('1e8', 'ddxz')](0x7d0);
											}
										}
									}
									await $[_0x57e6('1e9', 'E(c6')](0x5dc);
								}
								await $[_0x57e6('1ea', 'a4Sx')](0x5dc);
								await _0x40d1dd[_0x57e6('1eb', 'X5oH')](doTask, _0x57e6('1ec',
										'OObj'), _0x57e6('1ed', 'qzRw') + ACT_ID + _0x57e6(
										'1bb', 'ooZO') + $['shareCode'] + _0x57e6('1ee',
										'vi&C') + _0x40d1dd['ZLtXr'](encodeURIComponent, $[
										_0x57e6('1c6', 'okJ[')]) + _0x57e6('1ef', 'wXU!') +
									$['addSku'][_0x57e6('1f0', 'okJ[')][0x0][_0x57e6('1f1',
										'jveR')] + '&taskValue=' + $[_0x57e6('1f2', '3WPd')]
									[_0x57e6('1f3', '6[4L')][0x0][_0x57e6('1f4', 'HUuA')]);
							} else {
								$[_0x57e6('1f5', 'U^jz')] += _0x1d6e6c['data']['gameScore'];
								if (_0x1d6e6c['data'][_0x57e6('1f6', 'JqJw')] !== 0x0) {
									that[_0x57e6('1f7', 'WJj*')](_0x57e6('1f8', 'X5oH'));
								}
							}
						}
					}
				} catch (_0x27aa85) {
					$[_0x57e6('1f9', 'SLbp')](_0x27aa85, _0x14f6b4);
				} finally {
					_0x40d1dd[_0x57e6('1fa', 's)5J')](_0x57d1db, _0x1d6e6c);
				}
			} else {
				_0x15e5b3['DkutD'](_0x57d1db);
			}
		});
	});
}

function doTask(_0x49500c, _0x3df4bf) {
	var _0x3d0d0e = {
		'hJWuU': function(_0x456716) {
			return _0x456716();
		},
		'WfgoV': _0x57e6('1fb', '05!y'),
		'qUtXE': 'application/x-www-form-urlencoded',
		'BIdzx': _0x57e6('1fc', 'jveR'),
		'vGDvy': _0x57e6('1fd', '0p]7'),
		'CBXhX': _0x57e6('1fe', 'h844'),
		'FLomk': _0x57e6('1ff', 'E(c6'),
		'oINRq': function(_0x3ce056, _0x4c35b7) {
			return _0x3ce056 === _0x4c35b7;
		},
		'XDskP': function(_0x29557d, _0x579d50) {
			return _0x29557d === _0x579d50;
		},
		'yZYXw': _0x57e6('200', 'rFRA'),
		'bWjwL': _0x57e6('201', 'wszE'),
		'IKcOd': function(_0x5598e7, _0x4b0f76) {
			return _0x5598e7 !== _0x4b0f76;
		},
		'SWnRY': _0x57e6('202', 'E(c6'),
		'lZYjO': _0x57e6('203', 'h844'),
		'NcbPF': function(_0x312e98, _0x4df174) {
			return _0x312e98 !== _0x4df174;
		},
		'hUbFP': 'right',
		'pWixn': function(_0x5884ef, _0x3e86e4) {
			return _0x5884ef === _0x3e86e4;
		},
		'HaQYp': _0x57e6('204', '2V(e'),
		'ygIZP': function(_0x2269ee, _0x3a1f02) {
			return _0x2269ee === _0x3a1f02;
		},
		'JGkBx': function(_0x3d59c2, _0x5852f4) {
			return _0x3d59c2 === _0x5852f4;
		},
		'MVgap': 'ZzZVZ',
		'HTyoY': _0x57e6('205', 'Cf^R'),
		'bDGKA': function(_0x36845c, _0x2ee7de) {
			return _0x36845c !== _0x2ee7de;
		},
		'wBBDo': _0x57e6('206', 'okJ['),
		'qjOFM': function(_0xcf4fba) {
			return _0xcf4fba();
		},
		'UKGVm': function(_0x19832b, _0x3ea52a, _0x1fdf08) {
			return _0x19832b(_0x3ea52a, _0x1fdf08);
		}
	};
	return new Promise(_0x29f193 => {
		var _0x2ad8de = {
			'TZYZp': _0x3d0d0e['HTyoY']
		};
		$[_0x57e6('207', 'HUuA')](_0x3d0d0e[_0x57e6('208', '8h&X')](taskPostUrl, _0x49500c, _0x3df4bf), (
			_0x2e43df, _0x471c55, _0x3d6459) => {
			var _0xbfbb49 = {
				'OpDbR': function(_0x769926) {
					return _0x3d0d0e[_0x57e6('209', '6vDj')](_0x769926);
				},
				'ZNWGY': function(_0x5b8fa1) {
					return _0x3d0d0e['hJWuU'](_0x5b8fa1);
				},
				'LuBVF': _0x3d0d0e['WfgoV'],
				'RfgeB': _0x3d0d0e[_0x57e6('20a', '(1U@')],
				'oPVCr': _0x57e6('20b', '@AL$'),
				'Atfen': 'application/json,\x20text/plain,\x20*/*',
				'xIKpF': _0x3d0d0e[_0x57e6('20c', '0bCp')],
				'VygeB': _0x3d0d0e[_0x57e6('20d', 'a4Sx')]
			};
			try {
				if (_0x2e43df) {
					that[_0x57e6('b9', '6[4L')]('' + JSON[_0x57e6('20e', 'ADX@')](_0x2e43df));
				} else {
					if (_0x3d6459) {
						_0x3d6459 = JSON[_0x57e6('20f', 'vi&C')](_0x3d6459);
						// if (_0x471c55[_0x3d0d0e[_0x57e6('210', 'Kbl0')]][_0x3d0d0e[_0x57e6('211',
						// 		'JqJw')]]) {
						// 	cookie = _0x471c55[_0x3d0d0e[_0x57e6('212', 'EMMt')]][_0x3d0d0e['FLomk']][
						// 		_0x57e6('213', 'jveR')
						// 	](';') + ';\x20' + originCookie;
						// }
						if (_0x3d0d0e['oINRq'](_0x3d6459['result'], !![])) {
							if (_0x3d0d0e[_0x57e6('214', '6[4L')](_0x3d0d0e[_0x57e6('215', 'Cf^R')],
									'XWCRv')) {
								_0xbfbb49['OpDbR'](_0x29f193);
							} else {
								if (_0x3d6459['data']['hasOwnProperty'](_0x3d0d0e[_0x57e6('216',
										'ooZO')])) {
									if (_0x3d0d0e[_0x57e6('217', 'U^jz')](_0x3d0d0e[_0x57e6('218',
											'EMMt')], _0x3d0d0e['lZYjO'])) {
										$[_0x57e6('175', 'okJ[')] += _0x3d6459[_0x57e6('219', 'BsQx')][
											'gameScore'
										];
										if (_0x3d0d0e[_0x57e6('21a', 'ooZO')](_0x3d6459[_0x57e6('21b',
												'#Dak')][_0x57e6('21c', 'EMMt')], 0x0)) {
											that[_0x57e6('6a', 'wszE')](_0x57e6('21d', '@AL$'));
										}
									} else {
										$['log'](_0x2ad8de[_0x57e6('21e', '#Dak')]);
									}
								}
								if (_0x3d6459['data'][_0x57e6('21f', '6vDj')](_0x57e6('220', 's)5J'))) {
									if (_0x57e6('221', '^Q[i') === _0x57e6('222', '6[4L')) {
										$['cardList'] = _0x3d6459[_0x57e6('223', '05!y')]['list'];
									} else {
										var _0x1bc1ec = {
											'moSjE': function(_0x226c7a) {
												return _0xbfbb49[_0x57e6('224', 'BsQx')](
													_0x226c7a);
											}
										};
										let _0x5ce27d = {
											'url': _0x57e6('225', 'wszE'),
											'headers': {
												'Host': _0xbfbb49[_0x57e6('226', '9tUx')],
												'Content-Type': _0xbfbb49[_0x57e6('227', 'BsQx')],
												'Origin': 'https://h5.m.jd.com',
												'Accept-Encoding': _0xbfbb49[_0x57e6('228',
													'qY7X')],
												'Cookie': cookie,
												'Connection': _0x57e6('229', 'wszE'),
												'Accept': _0xbfbb49[_0x57e6('22a', 'nqqN')],
												'User-Agent': _0x57e6('22b', 'qzRw'),
												'Referer': _0x57e6('22c', 'ADX@') + actID + _0x57e6(
													'22d', 'okJ['),
												'Accept-Language': _0xbfbb49['xIKpF']
											},
											'body': 'functionId=cutPriceByUser&body={\x22activityId\x22:\x22' +
												actID + _0x57e6('22e', '6vDj') + actsID + _0x57e6(
													'22f', 'EMMt')
										};
										return new Promise(_0x450197 => {
											var _0x19bea8 = {
												'RVeAL': function(_0x50135b) {
													return _0x1bc1ec[_0x57e6('230',
														'(1U@')](_0x50135b);
												}
											};
											$['post'](_0x5ce27d, (_0x4fca8c, _0x22c52c,
												_0x14d3b8) => {
												if (_0x14d3b8) {
													$['zRes'] = JSON[_0x57e6('231',
														'SLbp')](_0x14d3b8);
													_0x19bea8[_0x57e6('232', '05!y')](
														_0x450197);
												};
											});
										});
									}
								}
								if (_0x3d6459[_0x57e6('11f', 'SLbp')]['hasOwnProperty'](_0x3d0d0e[
										_0x57e6('233', 'nqqN')])) {
									if (_0x3d0d0e[_0x57e6('234', 'jveR')](_0x3d6459[_0x57e6('235',
											'WJj*')][_0x57e6('236', 'Cf^R')], !![])) {
										that[_0x57e6('237', 'EMMt')](_0x57e6('238', 'l#&3'));
									}
								}
								if (_0x3d6459['data'][_0x57e6('239', 'rFRA')](_0x3d0d0e[_0x57e6('23a',
										'R0sR')])) {
									if (_0x3d6459['data'][_0x57e6('23b', 'E(c6')] === !![]) {
										message += '获得' + _0x3d6459[_0x57e6('a7', 'wXU!')][_0x57e6(
											'23c', 'qzRw')][_0x57e6('23d', 'ooZO')] + '\x0a';
										that['log']('获得' + _0x3d6459[_0x57e6('23e', 'a4Sx')][_0x57e6(
											'23c', 'qzRw')][_0x57e6('23f', '#Dak')] + '\x0a');
										if (_0x3d0d0e[_0x57e6('240', 'o[]7')](_0x3d6459['data'][
												'drawInfoType'
											], 0x6)) {
											$['bean'] += _0x3d6459[_0x57e6('241', 'h844')]['drawInfo'][
												_0x57e6('242', 'Ncw0')
											];
										} else {
											message += '\x0a京东账号' + $['index'] + '\x20' + ($[_0x57e6(
													'243', 'a4Sx')] || $['UserName']) +
												'\x0a\x20\x20\x20\x20└获得' + _0x3d6459[_0x57e6('244',
													'EMMt')][_0x57e6('245', 'l#&3')]['name'];
										}
									} else {
										if (_0x3d0d0e[_0x57e6('246', 'h844')](_0x3d0d0e['MVgap'],
												_0x57e6('247', '#Dak'))) {
											that['log'](_0x57e6('248', '#Dak') + _0x3d6459[
												'errorMessage']);
										} else {
											Object[_0x57e6('249', 'qY7X')](jdCookieNode)[_0x57e6('24a',
												'$B2C')](_0x92ed36 => {
												cookiesArr[_0x57e6('24b', 'ddxz')](jdCookieNode[
													_0x92ed36]);
											});
											if (process['env']['JD_DEBUG'] && process[_0x57e6('24c',
													')QGk')][_0x57e6('24d', '2V(e')] === _0xbfbb49[
													'VygeB']) that[_0x57e6('24e', 'jveR')] = () => {};
										}
									}
								}
							}
						} else {
							that[_0x57e6('24f', 'vi&C')](_0x3d6459[_0x57e6('250', '#7tl')]);
						}
					} else {
						$['log'](_0x3d0d0e['HTyoY']);
					}
				}
			} catch (_0xc99ed7) {
				that.log(_0xc99ed7);
				if (_0x3d0d0e[_0x57e6('251', 'ddxz')]('dRyvD', _0x3d0d0e['wBBDo'])) {
					that[_0x57e6('252', 'Ncw0')](_0xc99ed7, _0x471c55);
				} else {
					$[_0x57e6('253', 'U^jz')] = _0x3d6459['data'][_0x57e6('254', '^Q[i')];
					cookie = _0x57e6('255', 'nqqN') + $[_0x57e6('256', 'nqqN')] + ';' + cookie;
				}
			} finally {
				_0x3d0d0e[_0x57e6('257', 'h844')](_0x29f193);
			}
		});
	});
}

function getUserInfo() {
	var _0x5e87da = {
		'uIRsn': _0x57e6('258', 'rFRA'),
		'SaEQW': 'zluxu',
		'nSPTf': _0x57e6('259', 'nqqN'),
		'EBZmY': function(_0x39b667, _0xa8a142) {
			return _0x39b667 === _0xa8a142;
		},
		'LMuIK': _0x57e6('25a', 'Ncw0'),
		'NTbyk': _0x57e6('25b', 'R0sR'),
		'VdVjo': _0x57e6('25c', 'E(c6'),
		'IGZWG': function(_0x39d6ff, _0x127d8f) {
			return _0x39d6ff(_0x127d8f);
		},
		'pYksF': function(_0x45ce7e, _0x1521fb, _0x56694c) {
			return _0x45ce7e(_0x1521fb, _0x56694c);
		}
	};
	return new Promise(_0x112d07 => {
		var _0xa11769 = {
			'dQlmU': _0x5e87da[_0x57e6('25d', 'wXU!')],
			'ABgcB': _0x5e87da['SaEQW'],
			'LQyxF': _0x5e87da[_0x57e6('25e', '@AL$')],
			'irbqv': function(_0x19c1ed, _0x4a2b19) {
				return _0x5e87da[_0x57e6('25f', 'E(c6')](_0x19c1ed, _0x4a2b19);
			},
			'FePsJ': _0x5e87da[_0x57e6('260', 's)5J')],
			'iMHkb': function(_0xb4c648, _0x2d2939) {
				return _0xb4c648 !== _0x2d2939;
			},
			'WivMV': _0x5e87da[_0x57e6('261', ')QGk')],
			'URERY': _0x5e87da[_0x57e6('262', 'EMMt')],
			'CtSmn': 'YryMG'
		};
		let _0x6a29bb = _0x57e6('263', 'X5oH') + _0x5e87da['IGZWG'](encodeURIComponent, $[_0x57e6('264',
			'rFRA')]);
		$['post'](_0x5e87da[_0x57e6('265', 'ADX@')](taskPostUrl, _0x57e6('266', 'N7Dd'), _0x6a29bb), async (
			_0x31a9dc, _0x1ea26b, _0x2923b7) => {
			if (_0xa11769[_0x57e6('267', ')QGk')] !== 'WwDnW') {
				try {
					if (_0xa11769[_0x57e6('268', 'OObj')] !== _0xa11769[_0x57e6('269', 'wszE')]) {
						if (_0x31a9dc) {
							that[_0x57e6('19d', 'Cf^R')]('' + JSON['stringify'](_0x31a9dc));
						} else {
							_0x2923b7 = JSON[_0x57e6('26a', 'rFRA')](_0x2923b7);
							if (_0x2923b7[_0x57e6('1b1', 'OObj')]) {
								if (_0xa11769['irbqv'](_0xa11769['FePsJ'], _0x57e6('26b',
										'6[4L'))) {
									if (_0x31a9dc) {
										that['log']('' + JSON[_0x57e6('26c', 'R0sR')](_0x31a9dc));
										that['log']($[_0x57e6('26d', '9tUx')] + _0x57e6('26e',
											'#7tl'));
									} else {
										_0x2923b7 = JSON[_0x57e6('26f', 'nqqN')](_0x2923b7);
										that['log'](_0x2923b7[_0x57e6('270', '8h&X')]);
									}
								} else {
									that['log'](_0x57e6('271', 'qY7X') + _0x2923b7[_0x57e6('1cb',
										'jveR')][_0x57e6('272', 'R0sR')] + _0x57e6('273',
										'3W3a'));
									$[_0x57e6('274', '(1U@')] = _0x2923b7[_0x57e6('275', ')QGk')][
										'id'
									];
									$['pinImg'] = _0x2923b7['data']['yunMidImageUrl'];
									$[_0x57e6('243', 'a4Sx')] = _0x2923b7[_0x57e6('1a3', 'R0sR')][
										'nickame'
									];
								}
							} else {
								if (_0xa11769[_0x57e6('276', 'o[]7')](_0xa11769['WivMV'], _0xa11769[
										'URERY'])) {
									that['log'](_0x2923b7);
								} else {
									that[_0x57e6('277', 'KGCV')]('' + JSON[_0x57e6('1e5', 'OObj')](
										_0x31a9dc));
								}
							}
						}
					} else {
						that['log']('' + JSON[_0x57e6('278', '05!y')](_0x31a9dc));
					}
				} catch (_0x1b021b) {
					if (_0x57e6('279', 'ddxz') !== _0xa11769[_0x57e6('27a', 'R0sR')]) {
						$[_0x57e6('27b', '#Dak')] = _0x2923b7['tokenKey'];
						cookie = cookie + _0x57e6('27c', 'N7Dd') + $[_0x57e6('27d', 'Kbl0')];
					} else {
						$[_0x57e6('27e', '0bCp')](_0x1b021b, _0x1ea26b);
					}
				} finally {
					_0x112d07(_0x2923b7);
				}
			} else {
				$[_0x57e6('27f', 'rFRA')] = !![];
				that[_0x57e6('6a', 'wszE')]('京东说‘本活动与你无缘，请关注其他活动。’');
				return;
			}
		});
	});
}

function getMyPing() {
	var _0x5282e7 = {
		'ocGaK': function(_0x4b4413, _0x4a6efe) {
			return _0x4b4413 === _0x4a6efe;
		},
		'fQjXe': function(_0x5f3f37, _0x405c3d) {
			return _0x5f3f37 !== _0x405c3d;
		},
		'jCYsR': _0x57e6('280', 'ADX@'),
		'LolFd': function(_0x5084d8) {
			return _0x5084d8();
		},
		'UOeLQ': _0x57e6('281', 'vi&C'),
		'HffzH': function(_0x4e4b4d, _0x1b04a3, _0x1e80b9) {
			return _0x4e4b4d(_0x1b04a3, _0x1e80b9);
		},
		'PEvBm': _0x57e6('282', '3W3a')
	};
	return new Promise(_0x409921 => {
		if (_0x5282e7['ocGaK'](_0x5282e7[_0x57e6('283', 'o[]7')], _0x57e6('284', 'ooZO'))) {
			if (_0x5282e7['ocGaK'](data[_0x57e6('285', '2V(e')]['right'], !![])) {
				that[_0x57e6('6a', 'wszE')](_0x57e6('286', ')QGk'));
			}
		} else {
			$[_0x57e6('287', '8h&X')](_0x5282e7['HffzH'](taskPostUrl, _0x5282e7[_0x57e6('288', 'SLbp')],
				_0x57e6('289', 'BsQx') + $[_0x57e6('28a', '8h&X')] + _0x57e6('28b', '0bCp') + $[
					'token'] + _0x57e6('28c', 'HUuA')), async (_0x55cf87, _0x3c075d, _0x1e21fb) => {
				try {
					if (_0x5282e7['fQjXe'](_0x57e6('28d', 'rFRA'), _0x5282e7[_0x57e6('28e',
							'KGCV')])) {
						if (_0x55cf87) {
							that[_0x57e6('28f', '2V(e')]('' + JSON['stringify'](_0x55cf87));
						} else {
							_0x1e21fb = JSON[_0x57e6('290', 'OObj')](_0x1e21fb);
							if (_0x1e21fb[_0x57e6('291', 'ADX@')]) {
								$[_0x57e6('292', '#7tl')] = _0x1e21fb[_0x57e6('293', 'Cf^R')][
									'secretPin'
								];
								cookie = 'AUTH_C_USER=' + $[_0x57e6('1cf', 's)5J')] + ';' + cookie;
							}
						}
					} else {
						_0x409921();
					}
				} catch (_0x578114) {
					$[_0x57e6('1f9', 'SLbp')](_0x578114, _0x3c075d);
				} finally {
					_0x5282e7[_0x57e6('294', 'o[]7')](_0x409921);
				}
			});
		}
	});
}

function getActInfo() {
	var _0x365171 = {
		'yfzND': _0x57e6('295', 'Cf^R'),
		'UXgYq': _0x57e6('296', '0bCp'),
		'pcrXE': function(_0x5dbec2, _0x444d7d) {
			return _0x5dbec2(_0x444d7d);
		},
		'YvdWH': function(_0x3b3638, _0x4de884) {
			return _0x3b3638 === _0x4de884;
		},
		'XtnkZ': function(_0x1012c9, _0x430b6f) {
			return _0x1012c9 !== _0x430b6f;
		},
		'dWxOA': _0x57e6('297', 's)5J'),
		'AeZmZ': _0x57e6('298', 'vi&C'),
		'JYMmq': 'dz/common/getSimpleActInfoVo'
	};
	return new Promise(_0x489318 => {
		if (_0x365171[_0x57e6('299', '(1U@')](_0x365171['dWxOA'], _0x365171['AeZmZ'])) {
			$[_0x57e6('29a', 'OObj')](taskPostUrl(_0x365171[_0x57e6('29b', 'EMMt')], _0x57e6('29c', '#Dak') +
				ACT_ID), async (_0xade0bb, _0x1647ed, _0x278202) => {
				try {
					if (_0xade0bb) {
						that[_0x57e6('29d', 'JqJw')]('' + JSON[_0x57e6('ba', '$B2C')](_0xade0bb));
					} else {
						_0x278202 = JSON[_0x57e6('29e', '(1U@')](_0x278202);
						if (_0x278202[_0x57e6('29f', 'N7Dd')]) {
							$[_0x57e6('2a0', '^Q[i')] = _0x278202[_0x57e6('235', 'WJj*')][
								'venderId'
							];
						}
					}
				} catch (_0x4159a1) {
					$['logErr'](_0x4159a1, _0x1647ed);
				} finally {
					if (_0x365171['yfzND'] === _0x365171[_0x57e6('2a1', 'U^jz')]) {
						$[_0x57e6('2a2', '3WPd')](e, _0x1647ed);
					} else {
						_0x365171[_0x57e6('2a3', '#Dak')](_0x489318, _0x278202);
					}
				}
			});
		} else {
			if (err) {
				that['log']('' + JSON[_0x57e6('2a4', '6vDj')](err));
			} else {
				data = JSON['parse'](data);
				if (_0x365171[_0x57e6('2a5', '0p]7')](data[_0x57e6('2a6', 'vi&C')], '0')) {
					$[_0x57e6('2a7', 'X5oH')] = data[_0x57e6('2a8', '^Q[i')];
				}
			}
		}
	});
}

function grantTokenKey() {
	var _0x480f81 = {
		'qcIov': 'qmzkb',
		'vMZQA': _0x57e6('2a9', 'l#&3'),
		'fIyLP': function(_0x511ca4, _0x44290a) {
			return _0x511ca4 === _0x44290a;
		},
		'PjhXU': 'SIiUD',
		'MRZio': function(_0x4ed763, _0x1346e7) {
			return _0x4ed763 !== _0x1346e7;
		},
		'LEJMf': 'Nqxet',
		'wcsjm': function(_0x17822a, _0x3542c4) {
			return _0x17822a === _0x3542c4;
		},
		'LqDoL': _0x57e6('2aa', 'WJj*'),
		'lnHCv': _0x57e6('2ab', '#Dak'),
		'HmGeo': '*/*',
		'kzhMI': 'keep-alive',
		'jYerz': _0x57e6('2ac', 'o[]7'),
		'UxxuK': _0x57e6('2ad', 'h844'),
		'MljqW': 'gzip,\x20deflate,\x20br'
	};
	let _0x3ad3ee = {
		'url': _0x480f81['lnHCv'],
		'headers': {
			'Host': _0x57e6('2ae', '2V(e'),
			'Content-Type': _0x57e6('2af', 'wXU!'),
			'Accept': _0x480f81[_0x57e6('2b0', 's)5J')],
			'Connection': _0x480f81[_0x57e6('2b1', '8h&X')],
			'Cookie': cookie,
			'User-Agent': _0x480f81[_0x57e6('2b2', '3W3a')],
			'Accept-Language': _0x480f81[_0x57e6('2b3', '2V(e')],
			'Accept-Encoding': _0x480f81[_0x57e6('2b4', 'Kbl0')]
		},
		'body': _0x57e6('2b5', '2V(e')
	};
	return new Promise(_0x82b6d => {
		var _0x1079a4 = {
			'VbQQT': function(_0x483a25, _0x32305f) {
				return _0x483a25 === _0x32305f;
			}
		};
		if (_0x480f81[_0x57e6('2b6', 'Ncw0')](_0x480f81[_0x57e6('2b7', '05!y')], _0x480f81[_0x57e6('2b8',
				'EMMt')])) {
			$[_0x57e6('131', 'SLbp')](_0x3ad3ee, (_0x50793f, _0x4fcc4b, _0x56e4ea) => {
				var _0x2a9358 = {
					'GkvvN': function(_0x15616d) {
						return _0x15616d();
					}
				};
				if (_0x480f81[_0x57e6('2b9', '2V(e')] === _0x480f81[_0x57e6('2ba', 'okJ[')]) {
					$[_0x57e6('2bb', 'EMMt')] = '';
				} else {
					try {
						if (_0x50793f) {
							that[_0x57e6('2bc', '6vDj')]('' + JSON[_0x57e6('2bd', 'jveR')](_0x50793f));
						} else {
							_0x56e4ea = JSON['parse'](_0x56e4ea);
							if (_0x480f81['fIyLP'](_0x56e4ea[_0x57e6('2be', '#7tl')], '0')) {
								if (_0x480f81[_0x57e6('2bf', 'vi&C')](_0x480f81[_0x57e6('2c0', 'X5oH')],
										_0x480f81[_0x57e6('2c1', 'a4Sx')])) {
									$['tokenKey'] = _0x56e4ea['tokenKey'];
									cookie = cookie + _0x57e6('2c2', '2V(e') + $[_0x57e6('2c3',
										'OObj')];
								} else {
									_0x56e4ea = JSON[_0x57e6('108', 'U^jz')](_0x56e4ea);
									if (_0x1079a4[_0x57e6('2c4', '(1U@')](_0x56e4ea['code'], '0')) {
										$['token'] = _0x56e4ea[_0x57e6('2c5', 'jveR')];
									}
								}
							}
						}
					} catch (_0x4ab68f) {
						that[_0x57e6('2c6', '9tUx')](_0x4ab68f, _0x4fcc4b);
					} finally {
						if (_0x480f81[_0x57e6('2c7', 'N7Dd')](_0x480f81[_0x57e6('2c8', 'X5oH')],
								_0x480f81[_0x57e6('2c9', 'HUuA')])) {
							if (_0x56e4ea) {
								$[_0x57e6('2ca', 'WJj*')] = JSON[_0x57e6('2cb', 'KGCV')](_0x56e4ea);
								_0x2a9358[_0x57e6('2cc', 'Ncw0')](_0x82b6d);
							};
						} else {
							_0x82b6d();
						}
					}
				}
			});
		} else {
			$['done']();
		}
	});
}

function grantToken() {
	var _0x1ba1cf = {
		'gpBIH': function(_0x5e0077, _0x22990a) {
			return _0x5e0077(_0x22990a);
		},
		'jPtlE': function(_0x57a48f, _0x533c9f) {
			return _0x57a48f > _0x533c9f;
		},
		'Okmsq': function(_0x292e51, _0x5ea180) {
			return _0x292e51 !== _0x5ea180;
		},
		'gAIYp': 'eFlVD',
		'nfetE': function(_0xe1bc2, _0x4d5552) {
			return _0xe1bc2 === _0x4d5552;
		},
		'EVtmW': _0x57e6('2cd', 'Cf^R'),
		'FPkfv': _0x57e6('2ce', '9tUx'),
		'jPeuU': 'tvCXo',
		'vrwsu': _0x57e6('2cf', 'qY7X'),
		'UdzTJ': _0x57e6('2d0', 'Kbl0'),
		'bQJkT': _0x57e6('2d1', 'ooZO'),
		'HUWdd': _0x57e6('2d2', '(1U@'),
		'gsoiA': _0x57e6('2d3', '9tUx'),
		'YiWUn': 'zh-Hans-CN;q=1',
		'UPwXF': _0x57e6('2d4', '^Q[i')
	};
	let _0x1ca08e = {
		'url': _0x1ba1cf[_0x57e6('2d5', '9tUx')],
		'headers': {
			'Host': _0x1ba1cf['UdzTJ'],
			'Content-Type': _0x1ba1cf[_0x57e6('2d6', 'Ncw0')],
			'Accept': _0x1ba1cf['HUWdd'],
			'Connection': _0x1ba1cf['gsoiA'],
			'Cookie': cookie,
			'User-Agent': _0x57e6('2d7', '0p]7'),
			'Accept-Language': _0x1ba1cf[_0x57e6('2d8', '9tUx')],
			'Accept-Encoding': _0x1ba1cf['UPwXF']
		},
		'body': _0x57e6('2d9', 'EMMt')
	};
	return new Promise(_0x1add14 => {
		var _0x4aaef4 = {
			'ElplC': function(_0x51d26f, _0x5478a2) {
				return _0x1ba1cf['gpBIH'](_0x51d26f, _0x5478a2);
			},
			'FiRqf': function(_0x17dba3, _0x34f8ee) {
				return _0x1ba1cf['jPtlE'](_0x17dba3, _0x34f8ee);
			},
			'jejky': function(_0x3a7f1e, _0x1ef547) {
				return _0x1ba1cf[_0x57e6('2da', '#7tl')](_0x3a7f1e, _0x1ef547);
			},
			'kXEjs': _0x1ba1cf[_0x57e6('2db', 'SLbp')],
			'IKaEi': function(_0x5707d2, _0x4eb02c) {
				return _0x1ba1cf[_0x57e6('2dc', '(1U@')](_0x5707d2, _0x4eb02c);
			},
			'GkWFk': _0x1ba1cf[_0x57e6('2dd', '3W3a')],
			'hkPLP': _0x1ba1cf['FPkfv'],
			'MGTnh': _0x1ba1cf['jPeuU'],
			'uPPYW': _0x57e6('2de', '@AL$'),
			'CfSJB': function(_0x266544) {
				return _0x266544();
			}
		};
		$[_0x57e6('2df', 'o[]7')](_0x1ca08e, (_0x5c645e, _0x46bcd0, _0x15baa0) => {
			var _0xf923aa = {
				'YKmbB': function(_0x2b48b0) {
					return _0x2b48b0();
				},
				'AHYRU': function(_0x5c7436, _0x340a58) {
					return _0x4aaef4['FiRqf'](_0x5c7436, _0x340a58);
				}
			};
			try {
				if (_0x5c645e) {
					if (_0x4aaef4['jejky'](_0x4aaef4['kXEjs'], _0x57e6('2e0', 'U^jz'))) {
						that[_0x57e6('2e1', 'o[]7')]('' + JSON[_0x57e6('2e2', '#7tl')](_0x5c645e));
					} else {
						$[_0x57e6('2e3', 'BsQx')] = JSON[_0x57e6('2e4', '#Dak')](_0x15baa0);
						_0xf923aa[_0x57e6('2e5', 'jveR')](_0x1add14);
					}
				} else {
					_0x15baa0 = JSON[_0x57e6('2e6', '2V(e')](_0x15baa0);
					if (_0x4aaef4[_0x57e6('2e7', '0bCp')](_0x15baa0[_0x57e6('2e8', 'BsQx')], '0')) {
						if (_0x4aaef4[_0x57e6('2e9', '(1U@')](_0x4aaef4[_0x57e6('2ea', 'KGCV')],
								_0x4aaef4['hkPLP'])) {
							_0x4aaef4[_0x57e6('2eb', 'qzRw')](_0x1add14, _0x15baa0);
						} else {
							$[_0x57e6('2ec', 'ddxz')] = _0x15baa0['token'];
						}
					}
				}
			} catch (_0x18ed23) {
				that['log'](_0x18ed23);
			} finally {
				if (_0x4aaef4['MGTnh'] === _0x4aaef4[_0x57e6('2ed', 'N7Dd')]) {
					_0x15baa0 = JSON['parse'](_0x15baa0);
					if (_0xf923aa['AHYRU'](_0x15baa0['data'][_0x57e6('2ee', 'ddxz')], 0x0)) {
						$[_0x57e6('2ef', 'rFRA')] = _0x15baa0[_0x57e6('275', ')QGk')][0x0][_0x57e6(
							'2f0', '3W3a')];
					} else {
						$['userShareCode'] = '';
					}
				} else {
					_0x4aaef4['CfSJB'](_0x1add14);
				}
			}
		});
	});
}

function getActCookie() {
	var _0x3ad3f4 = {
		'sekHm': _0x57e6('2f1', 'wszE'),
		'myWEr': _0x57e6('2f2', '6[4L'),
		'lcWBR': function(_0x5e3447, _0x559be9) {
			return _0x5e3447 !== _0x559be9;
		},
		'bEMlp': 'Pevpq',
		'tobeR': 'ydYre',
		'FVhck': _0x57e6('2f3', 'qY7X'),
		'uKlIN': function(_0x4ae588, _0x4f9acd) {
			return _0x4ae588 === _0x4f9acd;
		},
		'oUVZK': 'hHqbU',
		'xqhEk': 'headers',
		'aUJvd': _0x57e6('2f4', 'HUuA'),
		'jQjjU': _0x57e6('2f5', 'wszE'),
		'eJLDf': _0x57e6('2f6', '0p]7'),
		'eyZyZ': _0x57e6('2f7', '6vDj'),
		'hhGyW': 'RHxtb',
		'AAHvO': function(_0x53ddca) {
			return _0x53ddca();
		},
		'pFmvq': _0x57e6('2f8', 'vi&C'),
		'jvLSq': 'keep-alive',
		'XPkcg': 'jdapp;iPhone;9.3.8;14.3;network/wifi;ADID/;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone10,3;supportBestPay/0;appBuild/167538;jdSupportDarkMode/0;addressid/0;pv/1.12;apprpd/Babel_Native;ref/JDWebViewController;psq/11;ads/;psn/;jdv/0|;adk/;app_device/IOS;pap/JA2015_311210|9.3.8|IOS\x2014.3;Mozilla/5.0\x20(iPhone;\x20CPU\x20iPhone\x20OS\x2014_3\x20like\x20Mac\x20OS\x20X)\x20AppleWebKit/605.1.15\x20(KHTML,\x20like\x20Gecko)\x20Mobile/15E148;supportJDSHWK/1',
		'ayXBG': 'zh-Hans-CN;q=1',
		'trfoC': 'gzip,\x20deflate,\x20br'
	};
	let _0x26de52 = {
		'url': _0x57e6('2f9', 'wszE') + ACT_ID,
		'headers': {
			'Content-Type': _0x57e6('2fa', '3WPd'),
			'Accept': _0x3ad3f4['pFmvq'],
			'Connection': _0x3ad3f4[_0x57e6('2fb', '6vDj')],
			'Cookie': '' + cookie,
			'User-Agent': _0x3ad3f4[_0x57e6('2fc', '8h&X')],
			'Accept-Language': _0x3ad3f4['ayXBG'],
			'Accept-Encoding': _0x3ad3f4[_0x57e6('2fd', '3W3a')]
		}
	};
	return new Promise(_0xe997dc => {
		var _0x3f4645 = {
			'ccySz': function(_0x4516e8) {
				return _0x3ad3f4['AAHvO'](_0x4516e8);
			}
		};
		$['get'](_0x26de52, (_0x13567e, _0x296ebd, _0x102079) => {
			var _0x3b67bb = {
				'ybDxW': 'headers',
				'ntpDH': _0x3ad3f4[_0x57e6('2fe', 'qzRw')],
				'ubThS': _0x57e6('2ff', '2V(e'),
				'RfZVk': _0x3ad3f4[_0x57e6('300', '^Q[i')]
			};
			try {
				if (_0x3ad3f4['lcWBR'](_0x3ad3f4['bEMlp'], _0x3ad3f4[_0x57e6('301', 'qzRw')])) {
					if (_0x13567e) {
						if (_0x3ad3f4[_0x57e6('302', 'jveR')] === _0x57e6('303', 'U^jz')) {
							that[_0x57e6('304', 'X5oH')]('' + JSON[_0x57e6('2e2', '#7tl')](_0x13567e));
						} else {
							_0x3f4645['ccySz'](_0xe997dc);
						}
					} else {
						if (_0x3ad3f4['uKlIN'](_0x3ad3f4[_0x57e6('305', 'U^jz')], _0x3ad3f4[_0x57e6(
								'306', 'HUuA')])) {
							cookie = cookie + ';';
							if ($[_0x57e6('307', 'ddxz')]())
								for (let _0x483339 of _0x296ebd[_0x57e6('1fe', 'h844')][_0x3ad3f4[
										_0x57e6('308', 'rFRA')]]) {
									cookie = '' + cookie + _0x483339['split'](';')[0x0] + ';';
								} else {
									// for (let _0x1ecd27 of _0x296ebd[_0x3ad3f4[_0x57e6('309', '2V(e')]][
									// 		_0x3ad3f4[_0x57e6('30a', 'EMMt')]
									// 	][_0x57e6('dd', 'ADX@')](',')) {
									// 	cookie = '' + cookie + _0x1ecd27[_0x57e6('30b', 'rFRA')](';')[
									// 		0x0] + ';';
									// }
									for (let ck of _0x296ebd['cookies']) {
										cookie = `${cookie}; ${ck.split(";")[0]};`
									}
								}
						} else {
							that[_0x57e6('30c', 'l#&3')](e, _0x296ebd);
						}
					}
				} else {
					cookie = cookie + ';';
					if ($[_0x57e6('30d', '#7tl')]())
						for (let _0x669180 of _0x296ebd[_0x3b67bb['ybDxW']][_0x3b67bb[_0x57e6('30e',
								'WJj*')]]) {
							cookie = '' + cookie + _0x669180[_0x57e6('30f', 'HUuA')](';')[0x0] + ';';
						} else {
							for (let _0x1a0059 of _0x296ebd['headers'][_0x3b67bb['ubThS']][_0x57e6(
									'310', 'nqqN')](',')) {
								cookie = '' + cookie + _0x1a0059['split'](';')[0x0] + ';';
							}
						}
				}
			} catch (_0x4281bc) {
				if (_0x3ad3f4[_0x57e6('311', 'wXU!')](_0x3ad3f4['jQjjU'], _0x3ad3f4['eJLDf'])) {
					$['msg']($[_0x57e6('312', '05!y')], '【提示】请先获取京东账号一cookie\x0a直接使用NobyDa的京东签到获取',
						_0x3b67bb[_0x57e6('313', '(1U@')], {
							'open-url': _0x3b67bb[_0x57e6('314', 'WJj*')]
						});
					return;
				} else {
					that['log'](_0x4281bc);
				}
			} finally {
				if (_0x3ad3f4[_0x57e6('315', 'WJj*')](_0x3ad3f4['eyZyZ'], _0x3ad3f4['hhGyW'])) {
					_0xe997dc();
				} else {
					that['log'](_0x57e6('316', 'jveR'));
				}
			}
		});
	});
}

function taskPostUrl(_0x512692, _0x34c925) {
	var _0x45be14 = {
		'TVtwV': 'lzdz-isv.isvjcloud.com',
		'nKEmN': 'application/json',
		'ydopv': _0x57e6('317', '(1U@'),
		'GKOux': _0x57e6('318', '6vDj'),
		'GoFbT': 'application/x-www-form-urlencoded',
		'cvZyc': _0x57e6('319', '3W3a')
	};
	return {
		'url': _0x57e6('31a', 's)5J') + _0x512692,
		'headers': {
			'Host': _0x45be14['TVtwV'],
			'Accept': _0x45be14[_0x57e6('31b', 'WJj*')],
			'X-Requested-With': _0x45be14['ydopv'],
			'Accept-Language': _0x45be14[_0x57e6('31c', '^Q[i')],
			'Accept-Encoding': 'gzip,\x20deflate,\x20br',
			'Content-Type': _0x45be14[_0x57e6('31d', 'vi&C')],
			'Origin': _0x45be14[_0x57e6('31e', '#Dak')],
			'Connection': _0x57e6('31f', '2V(e'),
			'Referer': _0x57e6('320', 'o[]7') + ACT_ID,
			'Cookie': '' + cookie,
			'User-Agent': _0x57e6('321', '#7tl')
		},
		'body': _0x34c925
	};
}

function getShareCode() {
	var _0x51469b = {
		'oAtvn': function(_0x9e9847) {
			return _0x9e9847();
		},
		'dHPIB': function(_0x5dcd40, _0x19924e) {
			return _0x5dcd40 !== _0x19924e;
		},
		'mwfMs': function(_0x66148c, _0x265929) {
			return _0x66148c === _0x265929;
		},
		'FcHRS': function(_0x570eb5, _0x36af46) {
			return _0x570eb5 > _0x36af46;
		},
		'OGhCv': 'PBvDw',
		'EtHxZ': _0x57e6('322', 'Cf^R'),
		'cxJqs': function(_0x19c8c2, _0x4f74d9) {
			return _0x19c8c2(_0x4f74d9);
		}
	};
	return new Promise(_0x1370a3 => {
		var _0x421c8e = {
			'uUPjq': function(_0x4f27b3) {
				return _0x51469b['oAtvn'](_0x4f27b3);
			},
			'zbbJS': 'GDRQn',
			'UWFNN': function(_0x491169, _0x43c8de) {
				return _0x51469b[_0x57e6('323', ')QGk')](_0x491169, _0x43c8de);
			},
			'UQSAR': _0x57e6('324', 'nqqN'),
			'eFAfI': function(_0x47576f, _0x506b14) {
				return _0x51469b[_0x57e6('325', 'qzRw')](_0x47576f, _0x506b14);
			},
			'midLX': function(_0x21af52, _0x1182aa) {
				return _0x51469b[_0x57e6('326', 'nqqN')](_0x21af52, _0x1182aa);
			},
			'jyRRX': function(_0x32779d, _0x2e55cd) {
				return _0x32779d !== _0x2e55cd;
			},
			'NWuov': _0x51469b[_0x57e6('327', 'OObj')],
			'pORzc': _0x57e6('328', ')QGk'),
			'FLHUl': function(_0x272e95, _0x1dddf7) {
				return _0x51469b['dHPIB'](_0x272e95, _0x1dddf7);
			},
			'bxQzz': _0x51469b[_0x57e6('329', '05!y')],
			'YmIOp': function(_0x4e16df, _0x135173) {
				return _0x51469b['cxJqs'](_0x4e16df, _0x135173);
			}
		};
		$[_0x57e6('32a', 's)5J')]({
			'url': 'https://api.r2ray.com/jd.entertainment/index'
		}, (_0x30ff9f, _0x2bba08, _0x3e27e0) => {
			if (_0x421c8e[_0x57e6('32b', 'U^jz')] === _0x57e6('32c', '8h&X')) {
				try {
					if (_0x30ff9f) {
						if (_0x421c8e[_0x57e6('32d', '#Dak')](_0x57e6('32e', '3W3a'), _0x421c8e[
								'UQSAR'])) {
							$[_0x57e6('32f', '2V(e')](e, _0x2bba08);
						} else {
							that[_0x57e6('330', 'E(c6')]('' + JSON[_0x57e6('331', 'wszE')](_0x30ff9f));
						}
					} else {
						if (_0x421c8e[_0x57e6('332', 'N7Dd')](_0x57e6('333', 'nqqN'), _0x57e6('334',
								'WJj*'))) {
							_0x3e27e0 = JSON['parse'](_0x3e27e0);
							if (_0x3e27e0['result']) {
								$[_0x57e6('28a', '8h&X')] = _0x3e27e0['data'][_0x57e6('335', 'KGCV')];
							}
						} else {
							if (_0x3e27e0) {
								_0x3e27e0 = JSON[_0x57e6('61', '0p]7')](_0x3e27e0);
								if (_0x421c8e[_0x57e6('336', 'qzRw')](_0x3e27e0[_0x57e6('337', 'E(c6')][
										_0x57e6('338', '0bCp')
									], 0x0)) {
									if (_0x421c8e['jyRRX'](_0x421c8e['NWuov'], _0x421c8e[_0x57e6('339',
											'ooZO')])) {
										$[_0x57e6('33a', '3W3a')] = _0x3e27e0[_0x57e6('1ac', 's)5J')][
											0x0
										][_0x57e6('33b', 'okJ[')];
									} else {
										_0x1370a3();
									}
								} else {
									if (_0x421c8e[_0x57e6('33c', '@AL$')]('LpFkH', _0x421c8e[_0x57e6(
											'33d', 'jveR')])) {
										$['userShareCode'] = '';
									} else {
										_0x1370a3(_0x3e27e0);
									}
								}
							}
						}
					}
				} catch (_0x35323e) {
					$['logErr'](_0x35323e, _0x2bba08);
				} finally {
					_0x421c8e[_0x57e6('33e', 'N7Dd')](_0x1370a3, _0x3e27e0);
				}
			} else {
				_0x421c8e['uUPjq'](_0x1370a3);
			}
		});
	});
}

function submitShareCode(_0x14da10) {
	var _0x4eff35 = {
		'EDpkS': function(_0x228a6a) {
			return _0x228a6a();
		},
		'hWEIq': function(_0x354aee, _0x3e6c17) {
			return _0x354aee !== _0x3e6c17;
		},
		'YTNDy': _0x57e6('33f', 'X5oH'),
		'HnhlO': function(_0x26b2a2, _0xf1a5b2) {
			return _0x26b2a2 === _0xf1a5b2;
		},
		'dyaQF': _0x57e6('340', 'qzRw'),
		'utpnf': function(_0x2ae33f, _0x30f897) {
			return _0x2ae33f(_0x30f897);
		},
		'CeEne': 'application/json'
	};
	let _0x394b63 = {
		'url': 'https://api.r2ray.com/jd.entertainment/update',
		'headers': {
			'Content-Type': _0x4eff35['CeEne']
		},
		'body': JSON[_0x57e6('341', 'SLbp')](_0x14da10)
	};
	return new Promise(async _0x155a0c => {
		var _0x3f9ee0 = {
			'tZZCb': function(_0x3bd060) {
				return _0x4eff35[_0x57e6('342', 'ADX@')](_0x3bd060);
			},
			'bSnBn': _0x57e6('343', 'o[]7'),
			'NkWIk': _0x57e6('344', '3W3a'),
			'nWbsi': function(_0x2534de, _0x161ed3) {
				return _0x4eff35[_0x57e6('345', 'E(c6')](_0x2534de, _0x161ed3);
			},
			'jFTYO': _0x4eff35[_0x57e6('346', '6[4L')],
			'HJEqA': function(_0x4effc9, _0x5ad8c2) {
				return _0x4eff35[_0x57e6('347', 'qzRw')](_0x4effc9, _0x5ad8c2);
			},
			'eicFJ': _0x4eff35[_0x57e6('348', '6[4L')],
			'IfBdt': function(_0x4f965, _0x3e7e28) {
				return _0x4eff35['utpnf'](_0x4f965, _0x3e7e28);
			}
		};
		$['post'](_0x394b63, (_0x41bda3, _0x206734, _0x31e60c) => {
			var _0x23ed63 = {
				'vsEhA': function(_0x2f934c) {
					return _0x3f9ee0[_0x57e6('349', 'Ncw0')](_0x2f934c);
				}
			};
			try {
				if (_0x3f9ee0['nWbsi'](_0x3f9ee0[_0x57e6('34a', '05!y')], _0x57e6('34b', ')QGk'))) {
					if (_0x41bda3) {
						if (_0x3f9ee0['HJEqA'](_0x3f9ee0[_0x57e6('34c', '0p]7')], _0x57e6('34d',
								'R0sR'))) {
							that['log']('' + JSON['stringify'](_0x41bda3));
							that['log']($[_0x57e6('34e', 'X5oH')] + '\x20API请求失败，请检查网路重试');
						} else {
							$[_0x57e6('34f', '3WPd')](_0x394b63, (_0x459ec5, _0x3fdb26,
								_0x322174) => {
								_0x23ed63['vsEhA'](_0x155a0c);
							});
						}
					} else {
						_0x31e60c = JSON[_0x57e6('350', 'o[]7')](_0x31e60c);
						that[_0x57e6('62', 'ooZO')](_0x31e60c[_0x57e6('351', '6[4L')]);
					}
				} else {
					var _0x2d3986 = {
						'apuus': function(_0xcbf647) {
							return _0x3f9ee0['tZZCb'](_0xcbf647);
						}
					};
					let _0x47038a = {
						'url': _0x3f9ee0[_0x57e6('352', '9tUx')],
						'headers': {
							'Content-Type': _0x3f9ee0[_0x57e6('353', 'SLbp')]
						},
						'body': JSON[_0x57e6('354', 'qzRw')]({
							'actID': actID,
							'actsID': actsID,
							'done': 0x1
						})
					};
					return new Promise(_0x11104a => {
						$[_0x57e6('34f', '3WPd')](_0x47038a, (_0x102582, _0x17c645,
							_0x187f7a) => {
							_0x2d3986[_0x57e6('355', 'l#&3')](_0x11104a);
						});
					});
				}
			} catch (_0x51d335) {
				$[_0x57e6('356', 'E(c6')](_0x51d335, _0x206734);
			} finally {
				_0x3f9ee0[_0x57e6('357', '3WPd')](_0x155a0c, _0x31e60c);
			}
		});
	});
}

function checkCookie() {
	var _0x5958b1 = {
		'wBgdF': function(_0x2cabd5, _0x3d5f56) {
			return _0x2cabd5 !== _0x3d5f56;
		},
		'YqMcz': _0x57e6('358', 'BsQx'),
		'MzUyN': function(_0xab96cd, _0x149896) {
			return _0xab96cd !== _0x149896;
		},
		'FVqig': 'NmxJd',
		'fVLOy': _0x57e6('359', 'l#&3'),
		'NBiQh': '京东返回了空数据',
		'TTFGt': function(_0x34a4f8) {
			return _0x34a4f8();
		},
		'ssPXc': _0x57e6('35a', 'E(c6'),
		'dYCzj': _0x57e6('35b', 'Ncw0'),
		'kzTnk': _0x57e6('35c', '$B2C'),
		'ZYQjA': 'gzip,\x20deflate,\x20br'
	};
	const _0x272bfc = {
		'url': _0x57e6('35d', '3W3a'),
		'headers': {
			'Host': _0x5958b1[_0x57e6('35e', '05!y')],
			'Accept': _0x5958b1[_0x57e6('35f', 'l#&3')],
			'Connection': 'keep-alive',
			'Cookie': cookie,
			'User-Agent': _0x57e6('360', 's)5J'),
			'Accept-Language': _0x5958b1['kzTnk'],
			'Referer': _0x57e6('361', '9tUx'),
			'Accept-Encoding': _0x5958b1[_0x57e6('362', '6[4L')]
		}
	};
	return new Promise(_0x118364 => {
		$[_0x57e6('363', '6vDj')](_0x272bfc, (_0xc7fd8, _0x501143, _0x1ee216) => {
			if (_0x5958b1[_0x57e6('364', 'vi&C')](_0x5958b1[_0x57e6('365', '2V(e')], _0x5958b1[_0x57e6(
					'366', 'nqqN')])) {
				message += _0x57e6('367', 'JqJw') + $[_0x57e6('368', 'okJ[')] + '\x20' + ($[_0x57e6(
						'369', 'h844')] || $[_0x57e6('55', 'HUuA')]) + '\x0a\x20\x20\x20\x20└获得' +
					_0x1ee216[_0x57e6('11c', 'qzRw')][_0x57e6('36a', 'R0sR')][_0x57e6('36b', 'E(c6')];
			} else {
				try {
					if (_0xc7fd8) {
						if (_0x5958b1[_0x57e6('36c', 'o[]7')](_0x5958b1['FVqig'], 'MzvJi')) {
							$[_0x57e6('36d', 'Kbl0')](_0xc7fd8);
						} else {
							$['logErr'](e);
						}
					} else {
						if (_0x5958b1[_0x57e6('36e', '05!y')](_0x5958b1['fVLOy'], _0x5958b1[_0x57e6(
								'36f', '05!y')])) {
							that[_0x57e6('14a', '#Dak')](_0x57e6('370', 'WJj*') + _0x1ee216[_0x57e6(
								'371', 'KGCV')]);
						} else {
							if (_0x1ee216) {
								_0x1ee216 = JSON[_0x57e6('231', 'SLbp')](_0x1ee216);
								if (_0x1ee216[_0x57e6('372', 'rFRA')] === _0x57e6('373', 'KGCV')) {
									$[_0x57e6('374', 'WJj*')] = ![];
									return;
								}
								if (_0x1ee216[_0x57e6('375', 'KGCV')] === '0' && _0x1ee216[_0x57e6(
										'376', 'Kbl0')]['hasOwnProperty'](_0x57e6('377', 'a4Sx'))) {
									$[_0x57e6('378', 'BsQx')] = _0x1ee216[_0x57e6('139', '0p]7')][
										'userInfo'
									]['baseInfo'][_0x57e6('379', 'N7Dd')];
								}
							} else {
								$[_0x57e6('37a', '3W3a')](_0x5958b1['NBiQh']);
							}
						}
					}
				} catch (_0x390711) {
					$[_0x57e6('37b', '05!y')](_0x390711);
				} finally {
					_0x5958b1[_0x57e6('37c', 'EMMt')](_0x118364);
				}
			}
		});
	});
};
_0xodN = 'jsjiami.com.v6';
// prettier-ignore

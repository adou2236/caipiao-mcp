
interface Class {
  caipiaoid: string//彩票ID
  name: string	// 名称
  parentid: number//	上级ID
  nextopentime: string	//下期开奖时间
  nextbuyendtime: string	//下期截止购买时间
  lastissueno: string	//本期期号（已开奖的最新期号）
  nextissueno: string	//下期期号
}


interface Prize {
  prizename:	string	//奖项
  require:	string	//中奖条件
  num:	number	//中奖人数
  singlebonus:	string	//单注金额
}
interface Caipiao {
  caipiaoid: string //彩票ID
  issueno:	string	//期号
  number:	string	//彩票号码 红球
  refernumber:	string	//彩票剩余号码 蓝球
  opendate:	string	//开奖日期
  deadline:	string	//兑奖截止日期
  saleamount:	string	//销售额
  prize: Array<Prize> //中奖信息
}

type TYPE = "1" | "2" | "3" | undefined

interface Prize {
  prizename:	string	//奖项
  require:	string	//中奖条件
  num:	number	//中奖人数
  singlebonus:	string	//单注金额
}

interface Winning {
  caipiaoid: string //彩票ID
  winnumber: string // 当期中奖号码 红球
  winrefernumber: string // 当期中奖剩余号码 蓝球
  issueno:	string	//期号
  winstatus:	number	//中奖状态 0中奖 1未中奖
  list: Array<Prize>
  prizename:	string	//奖项名称
  require:	string	//奖项条件
  singlebonus:	string	//单注奖金
}

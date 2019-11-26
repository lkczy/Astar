let numMap = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
let lm = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"]
//数字转换为中文，仅支持2位以内数字
function Num2Chinese(num)
{ 
  var numstr = "" 
  if (num > 9)
    numstr = numMap[parseInt(num/10)] + numMap[num % 10]
  else
    numstr = numMap[num]
  return numstr
}

//段位罗马数字
function LuoMa(mlv,lv)
{ 
  return lm[mlv - lv]
}


export { 
  Num2Chinese,
  LuoMa
}
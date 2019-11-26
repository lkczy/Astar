//闯关模板相关配置

//猜明星
var CCY = { 
 subtype_money:4,//猜明星金币子类号
 subtype_jifen:3,//猜明星学分子类号 
 AppId:"wx63373c52b31009ff",
 PayKey:"guaguajiaoguaguajiaoguaguajiao12",
 shopIconArr : [1, 5, 3],
 title: '猜成语',
 NavigationBarFG: '#ffffff', //标题文字色
 NavigationBarBG: "#391c56",//标题背景色
 xieyi: 501
}
 


var CGCfgs = { "CCY":CCY }

function BuildConfig(ProjectID, version)
{
  var re = CGCfgs[ProjectID]  
  re.ProjectID = ProjectID
  re.ServerListUrl = `https://list.quwenyx.com/gameweb/${ProjectID}/Config${version}.xml`
  re.PubConfigUrl = `https://list.quwenyx.com/GameWeb/Pub/${ProjectID}_PubConfg.xml`
  return re
}
module.exports = { BuildConfig }

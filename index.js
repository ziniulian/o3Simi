// LZR 模块加载
require("lzr");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv",
	"LZR.HTML"
]);

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
});

// 需要用到的工具
var tools = {
	mUrl: LZR.HTML.domain,
	dm: null	// 数据库管理模块
};

// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// LOGO图片
srv.ro.get("/favicon.ico", function (req, res) {
	res.redirect(tools.mUrl + "/favicon.ico");
});

// srv.use("/Simi/", require("./Simi"));

// 记录访问信息到 dm 模块中
srv.ro.get("/myNam/", function (req, res, next) {
	var t = tools.dm.getTls();
	t.qryRo.db.add( req, res, next, null, {
		ip: t.utNode.getClientIp(req),
		tim: t.utTim.getTim()
	}, true );
});

// 返回服务名
srv.ro.get("/myNam/", function (req, res) {
	res.send("Simi");
});

// 公共样式
srv.ro.get("/base.css", function (req, res) {
	res.redirect(tools.mUrl + "css/common/base.css");
});

// 追踪器
srv.ro.get("/trace.js", function (req, res) {
	res.redirect(tools.mUrl + "/js/trace.js");
});

// 数据库管理模块
tools.dm = require("./DbMgr");
srv.use("/DbMgr/", tools.dm);

// 收尾处理
srv.use("*", function (req, res) {
	res.redirect(tools.mUrl + "/Err");
});

// 服务启动
srv.start();
console.log("LZRgu start " + srv.ip + ":" + srv.port);

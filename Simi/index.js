// 分类模块

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv.DataMgrSrv"
]);

var dms = new LZR.Node.Srv.DataMgrSrv();
dms.initDb (
	"test",
	"simi",
	process.env.OPENSHIFT_MONGODB_DB_URL ? process.env.OPENSHIFT_MONGODB_DB_URL : "mongodb://localhost:27017/test"
);

// 创建路由
var r = new LZR.Node.Router ({
	hd_web: "web",
	path: curPath
});

// 获取整个树结构
r.get("/srvAll", function (req, res, next) {
	res.json(dms.getRoot());
});

// 获取数据
r.get("/srvGet/:id/:typ?", function (req, res, next) {
	// typ 说明：
	// 0：普通的数据
	// 1：带子元素的数据
	// 2：带父元素的数据
	// 3：即带父元素也带子元素的数据
	dms.srvGet(req, res, next, req.params.id, req.params.typ);
});

// 新建数据
r.get("/srvNew/:nam/:par?", function (req, res, next) {
	dms.srvNew(req, res, next, {nam: req.params.nam}, req.params.par);
});

// 修改父类
r.get("/srvSp/:id/:pid?", function (req, res, next) {
	dms.srvSp(req, res, next, req.params.id, req.params.pid);
});

// 删除数据
r.get("/srvDel/:id", function (req, res, next) {
	dms.srvDel(req, res, next, req.params.id);
});

// 修改数据
r.get("/srvSet/:id/:nam", function (req, res, next) {
	dms.srvSet(req, res, next, {nam: req.params.nam}, req.params.id);
});

// // 初始化模板
// r.initTmp();

module.exports = r;

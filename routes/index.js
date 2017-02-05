var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tuanwu');//连接数据库
var moment = require('moment');
var sys_time = moment().format("YYYY-MM-DD-HH-mm-ss");
// var style1 = 'stylesheets/reset.css';
// var style2 = 'stylesheets/common.css';
// var style3 = 'stylesheets/iconfont.css';
// var style4 = 'stylesheets/swiper.min..css';
// var style5 = 'stylesheets/style.css';
/* GET home page. */

//首页新闻遍历
router.get('/', function(req, res, next) {
	var collection = db.get('news');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统'
		});
	});
});

router.get('/repair', function(req, res, next) {
		res.render('repair', {
			 title: '我要报修'
		});
	});

router.get('/service_opinion', function(req, res, next) {
		res.render('service_opinion', {
			 title: '服务|意见'
		});
	});

router.get('/department_teacher', function(req, res, next) {
		res.render('department_teacher', {
			 title: '团委老师'
		});
	});

router.get('/department_bgs', function(req, res, next) {
		res.render('department_bgs', {
			 title: '办公室'
		});
	});

router.get('/department_zzb', function(req, res, next) {
		res.render('department_zzb', {
			 title: '组织部'
		});
	});

router.get('/department_xcb', function(req, res, next) {
		res.render('department_xcb', {
			 title: '宣传部'
		});
	});

router.get('/department_jjb', function(req, res, next) {
		res.render('department_jjb', {
			 title: '纪检部'
		});
	});

router.get('/department_xxjsb', function(req, res, next) {
		res.render('department_xxjsb', {
			 title: '信息技术部'
		});
	});




router.get('/about_us', function(req, res, next) {
		res.render('about_us', {
			 title: '关于我们'
		});
	});
//新闻详情页
router.get('/news_page',function(req,res,next){
	var collection = db.get('news');
	var tmp1 = {"title":req.query.title};
	collection.find( tmp1,function(e,docs){
		res.render('news_page', {
			"list" : docs,
			title: "团务系统",
		});
	});
});

router.get('/post_news', function(req, res, next) {
		res.render('post_news', {
			 title: '新建新闻'
		});
	});

router.get('/submission', function(req, res, next) {
		res.render('submission', {
			text:'',
			 title: '我要投稿'
		});
	});

router.get('/success', function(req, res, next) {
		res.render('success', {
			text: '发送成功',
			title: "团务系统",
		});
	});


router.post('/submission',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var file = files.files[0];
		var fs = require("fs");
		fs.readFile(file.path,function(err,data){
			var path = "./public/files/"+file.originalFilename;
			var file_path = "/files/"+file.originalFilename;
			fs.writeFile(path,data,function(error){
				if(error) console.log(error);

				var collection = db.get('doc');
				time = sys_time;
				time = time.replace(/\-/g,""); 

				collection.insert({
					"name":fields.name[0],
					"contact":fields.contact[0],
					"title":fields.title[0],
					"info" :fields.info[0],
					"files":file_path,
					"time":time,
				},function(err,doc){
					if(err){
						res.send("新建失败，请检查数据库连接或查找其他问题");
					}
					else{

						res.render('success', {
							text: '投稿成功',
							title: "团务系统",
						});
					}
				});
			});
		});
	});
});

router.get('/opinion', function(req, res, next) {
		res.render('opinion', {
			 title: '意见建议'
		});
	});

router.post('/opinion',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		// var file = files.files[0];
		// var fs = require("fs");
		var collection = db.get('suggest');
			time = sys_time;
			time = time.replace(/\-/g,""); 

			collection.insert({
				"contact":fields.contact[0],
				"info" :fields.info[0],
				"time":time,
			},function(err,doc){
				if(err){
					res.send("新建失败，请检查数据库连接或查找其他问题");
				}
				else{
					res.render('success', {
						text: '发送成功',
						title: "团务系统",
					});
				}
			});
	});
});

//新建新闻
router.post('/post_news',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var img = files.images[0];
		var fs = require("fs");
		fs.readFile(img.path,function(err,data){
			var path = "./public/images/"+img.originalFilename;
			var img_path = "/images/"+img.originalFilename;
			fs.writeFile(path,data,function(error){
				if(error) console.log(error);

				var collection = db.get('news');
				time = fields.time[0];
				time = time.replace(/\-/g,""); 

				collection.insert({
					"title":fields.title[0],
					"info":fields.info[0],
					"urls":fields.urls[0],
					"images":img_path,
					"time":time,
				},function(err,doc){
					if(err){
						res.send("新建失败，请检查数据库连接或查找其他问题");
					}
					else{
						res.render('success', {
							text: '发表成功',
							title: "团务系统",
						});
					}
				});
			});
		});
	});
});

//删除新闻
router.get('/delete_news',function(req,res,next){
	var collection = db.get('news');
	var tmp1 = {"title":req.query.title};
	collection.remove( tmp1,function(e,docs){
		req.query.image
		var fs = require("fs");
		var path="public"+req.query.image;
		fs.unlink(path, function(){
			console.log("success");
		});
		res.render('success', {
			text: path,
			title: "团务系统",
		});
	});
});



//义务维修提交
router.post('/repair',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var collection = db.get('fix');
		collection.insert({
			"name":fields.name[0],
			"contact":fields.contact[0],
			"dorm":fields.dorm[0],
			"info":fields.info[0],
		},function (err, doc) {
            if (err) {
                res.send("报障失败");
            }
            else {
				res.render('success', {
					text: '报修成功',
					title: "团务系统",
				});
            }
        });
	});
});	

//义务维修信息遍历
router.get('/manage-fix', function(req, res, next) {
	var collection = db.get('fix');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统'
		});
	});
});

//投稿信息遍历
router.get('/manage-doc', function(req, res, next) {
	var collection = db.get('doc');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统'
		});
	});
});

//投稿获取
router.post('/doc',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var doc = files.doc[0];
		var fs = require("fs");
		fs.readFile(img.path,function(err,data){
			var path = "./public/doc/"+doc.originalFilename;
			var doc_path = "/doc/"+doc.originalFilename;
			fs.writeFile(path,data,function(error){
				if(error) console.log(error);

				var collection = db.get('doc');

				collection.insert({
					"title":fields.title[0],
					"contact":fields.contact[0],
					"doc":doc_path,
					"name":fields.name[0],
					"info":fields.info[0],
				}, function (err, doc) {
		            if (err) {
		                res.send("新建失败，请检查数据库连接或查找其他问题");
		            }
		            else {
						res.render('success', {
							text: '发表成功',
							title: "团务系统",
						});
            		}
        		});
			});
		});
	});
});


//显示成员
router.get('/person', function(req, res, next) {
	var collection = db.get('person');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统',
		});
	});
});

//成员详情页
router.get('/person_page',function(req,res,next){
	var collection = db.get('person');
	var tmp1 = {"name":req.query.name};
	collection.find( tmp1,function(e,docs){
		res.render('person_page', {
			"list" : docs,
			title: "团务系统",
		});
	});
});


//成员删除
router.get('/delete_person',function(req,res,next){
	var collection = db.get('person');
	var tmp1 = {"name":req.query.name};
	collection.remove( tmp1,function(e,docs){
		req.query.image
		var fs = require("fs");
		var path="public"+req.query.image;
		fs.unlink(path, function(){
			console.log("success");
		});
		res.render('success', {
			text: path,
			title: "团务系统",
		});
	});
});

//成员新建
router.post('/manage-person',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var img = files.images[0];
		var fs = require("fs");
		fs.readFile(img.path,function(err,data){
			var path = "./public/images/"+img.originalFilename;
			var img_path = "/images/"+img.originalFilename;
			fs.writeFile(path,data,function(error){
				if(error) console.log(error);

				var collection = db.get('person');

				collection.insert({
					"name":fields.name[0],
					"info":fields.info[0],
					"image":files.img[0],
					"type":fields.type[0],
				},function(err,doc){
					if(err){
						res.send("新建失败，请检查数据库连接或查找其他问题");
					}
					else{
						res.render('success', {
							text: '发表成功',
							title: "团务系统",
						});
					}
				});
			});
		});
	});
});

//意见新建
router.post('/manage-suggest',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		
		var collection = db.get('suggest');

		collection.insert({
			"contact":fields.contact[0],
			"info":fields.info[0],
		},function(err,doc){
			if(err){
				res.send("新建失败，请检查数据库连接或查找其他问题");
			}else {
				res.render('success', {
					text: '发表成功',
					title: "团务系统",
				});
			}
		});
	});
});

//显示意见建议
router.get('/manage_suggest', function(req, res, next) {
	var collection = db.get('suggest');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统'
		});
	});
});


//考勤上传
router.post('/attence_up',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var files = files.files[0];
		var fs = require("fs");
		fs.readFile(img.path,function(err,data){
			var path = "./public/files/excel/"+files.originalFilename;
			var img_path = "/files/excel/"+files.originalFilename;
			fs.writeFile(path,data,function(error){
				if(error) console.log(error);

				var collection = db.get('attence');

				collection.insert({
					"title":fields.title[0],
					"info":fields.info[0],
					"files":files.img[0],
				},function(err,doc){
					if(err){
						res.send("新建失败，请检查数据库连接或查找其他问题");
					}
					else{
						res.render('success', {
							text: '发表成功',
							title: "团务系统",
						});
					}
				});
			});
		});
	});
});

//考勤查看
router.get('/attence', function(req, res, next) {
	var collection = db.get('attence');
	collection.find({},{},function(err,docs){
		res.render('index', {
			"list" : docs,
			 title: '团务系统'
		});
	});
});

//登录管理员账号
router.post('/login',function(req,res){
	var from = new multiparty.Form();
	from.parse(req,function(err,fields,files){
		var md5 = crypto.createHash('md5');
		var password = md5.fields.password;
		var name = fields.name;

		var collection = db.get('users');
		var tmp1 =  {"name":name};
		var check = collection.find(tmp1);
		if (!check){
			res.render('success', {
				"text" : "登陆失败",
				 title: '团务系统'
			});
		}else if(password != check.password){
			res.render('success', {
				"text" : "登陆失败,密码不正确",
				 title: '团务系统'
			});
		}else{
			res.render('manage', {
				"text" : "登陆成功",
				 title: '团务系统'
			});
		}
	});
});


module.exports = router;
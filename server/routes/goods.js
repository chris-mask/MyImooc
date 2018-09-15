//node原生路由
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//加载模型表
var Goods = require('../models/goods');

//链接数据库  root:123456@
mongoose.connect('mongodb://127.0.0.1:27017/db_demo', {useNewUrlParser:true}, function(err){
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
});

mongoose.connection.on("connected", function () {
  console.log("MongoDB connect success")
});

mongoose.connection.on("error", function () {
  console.log("MongoDB connect fail")
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB connect disconnected")
});

//查询商品列表数据
router.get("/list", function (req, res, next) {
  //取分页参数
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));   //拿到当前一页多少条数据
  //价格筛选
  let priceLevel = req.param("priceLevel");
  //排序功能
  let sort = req.param("sort");
  let skip = (page - 1) * pageSize;

  var priceGt = '', priceLte = '';
  let params = {};
  //判断价格大小
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0':
        priceGt = 0;
        priceLte = 100;
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);    //skip默认跳过 x 条
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      });
    }
  });
});

// 加入购物车
router.post("/addCart", function (req, res, next) {
  var userId = '100000077', productId = req.body.productId;
  //获取模型
  var User = require('../models/user');
  User.findOne({userId: userId}, function (err, userDoc) {
    if (err) {
      res.json({
        //1代表报错
        status: "1",
        msg: err.message
      })
    } else {
      console.log("userDoc:" + userDoc);
      if (userDoc) {
        var goodsItem = '';
        userDoc.cartList.forEach(function (item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum ++;
          }
        });
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                //1代表报错
                status: "1",
                msg: err2.message
              })
            } else {
              //成功
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            }
          })
        } else {
          Goods.findOne({productId: productId}, function (err1, doc) {
            if (err1) {
              res.json({
                //1代表报错
                status: "1",
                msg: err1.message
              })
            } else {
              if (doc) {
                doc.productNum = 1;
                doc.checked = 1;
                userDoc.cartList.push(doc);
                userDoc.save(function (err2, doc2) {
                  if (err2) {
                    res.json({
                      //1代表报错
                      status: "1",
                      msg: err2.message
                    })
                  } else {
                    //成功
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }

      }
    }
  })
});
// router.post("/addCart", function (req,res,next) {
//   var userId = '100000077',productId = req.body.productId;
//   var User = require('../models/user');
//   User.findOne({userId:userId}, function (err,userDoc) {
//     if(err){
//       res.json({
//         status:"1",
//         msg:err.message
//       })
//     }else{
//       console.log("userDoc:"+userDoc);
//       if(userDoc){
//         var goodsItem = '';
//         userDoc.cartList.forEach(function (item) {
//           if(item.productId == productId){
//             goodsItem = item;
//             item.productNum ++;
//           }
//         });
//         if(goodsItem){
//           userDoc.save(function (err2,doc2) {
//             if(err2){
//               res.json({
//                 status:"1",
//                 msg:err2.message
//               })
//             }else{
//               res.json({
//                 status:'0',
//                 msg:'',
//                 result:'suc'
//               })
//             }
//           })
//         }else{
//           Goods.findOne({productId:productId}, function (err1,doc) {
//             if(err1){
//               res.json({
//                 status:"1",
//                 msg:err1.message
//               })
//             }else{
//               if(doc){
//                 doc.productNum = 1;
//                 doc.checked = 1;
//                 userDoc.cartList.push(doc);
//                 userDoc.save(function (err2,doc2) {
//                   if(err2){
//                     res.json({
//                       status:"1",
//                       msg:err2.message
//                     })
//                   }else{
//                     res.json({
//                       status:'0',
//                       msg:'',
//                       result:'suc'
//                     })
//                   }
//                 })
//               }
//             }
//           });
//         }
//       }
//     }
//   })
// });
module.exports = router;

require('zone.js/dist/zone-node');
require('reflect-metadata');
const express = require('express');

const bodyParser = require('body-parser');
var multer  = require('multer');
//var upload = multer({ dest: 'uploads/' });

// //Multer Storeage
// var storage =   multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, __dirname+'/uploads');
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.fieldname + '-' + Date.now());
//   }
// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, '/tmp/my-uploads');
    cb(null, './assets/img/products');
    cb(null, '../src/assets/img/products');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // modified here  or user file.mimetype
  }
});

// var upload = multer({ dest: 'uploads/', storage: storage });
var upload = multer({  storage: storage });


const { ngExpressEngine } = require('@nguniversal/express-engine');
// Import module map for lazy loading
const { provideModuleMap } = require('@nguniversal/module-map-ngfactory-loader');

// Import the AOT compiled factory for your AppServerModule.
// This import will change with the hash of your built server bundle.
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(`./dist-server/main.bundle`);

const app = express();
const port = 8000;
const baseUrl = `http://localhost:${port}`;


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));




const Sequelize = require('sequelize');
const sequelize = new Sequelize('shop', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false
  },

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const Product_types = sequelize.define('Product_types', {
    product_types_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    product_types_name: Sequelize.STRING,
  },
  {tableName: 'product_types'});


const Order_prod = sequelize.define('Order_prod', {
    order_prod_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    order_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER,
    order_prod_count: Sequelize.INTEGER,
    order_prod_price: Sequelize.INTEGER,
    order_prod_promo_price: Sequelize.INTEGER

  },
  {tableName: 'order_prod'});


const Order = sequelize.define('Order', {
    order_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    order_date: Sequelize.DATE,
    order_city: Sequelize.STRING,
    order_office: Sequelize.STRING,
    order_name_customer: Sequelize.STRING,
    order_famil_customer: Sequelize.STRING,
    order_phone_customer: Sequelize.STRING,
    order_email_customer: Sequelize.STRING,
    order_sum: Sequelize.INTEGER
  },
  {tableName: 'order'});

const OptionList = sequelize.define('Option_list', {
    option_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    option_name: Sequelize.STRING,
    option_category_type: Sequelize.INTEGER
  },
  {tableName: 'option_list'});

const Category = sequelize.define('Category', {
    category_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    category_name: Sequelize.STRING,
    category_url: Sequelize.STRING,
    parent_id: Sequelize.INTEGER,
    category_keywords_seo: Sequelize.STRING,
    category_description_seo: Sequelize.STRING

  },
  {tableName: 'category'});

const SubCategory = sequelize.define('Subcategory', {
    subcategory_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    subcategory_name: Sequelize.STRING,
    subcategory_url: Sequelize.STRING,
    subcategory_keywords_seo: Sequelize.STRING,
    subcategory_description_seo: Sequelize.STRING,
    category_id: Sequelize.INTEGER

  },
  {tableName: 'subcategory'});

const Product = sequelize.define('Product', {
    product_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    product_name: Sequelize.STRING,
    product_description: Sequelize.STRING,
    product_count: Sequelize.INTEGER,
    product_price: Sequelize.INTEGER,
    product_promo_price: Sequelize.INTEGER,
    product_keywords_seo: Sequelize.STRING,
    product_description_seo: Sequelize.STRING,
    product_manufacturer: Sequelize.STRING,
    product_type: Sequelize.INTEGER,
    subcategory_id:  Sequelize.INTEGER,
    product_available: Sequelize.BOOLEAN,
    product_status: Sequelize.STRING,
    product_date_add: Sequelize.DATE
  },
  {tableName: 'product'});

const ProductOptions = sequelize.define('product_option', {
    option_product_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: Sequelize.INTEGER,
    option_id: Sequelize.INTEGER,
    option_value: Sequelize.STRING,

  },
  {tableName: 'product_option'});


// Here we can connect countries and cities base on country code
//Product.ProductOptions =   Product.hasMany(ProductOptions,{as:'product_option',foreignKey: 'product_id'});
//ProductOptions.OptionList = ProductOptions.belongsTo(OptionList,{as:'option_name',foreignKey: 'option_id',targetKey: 'option_id'});
//Product.Category =    Product.belongsTo(Category,{as:'category',foreignKey: 'category_id', targetKey: 'category_id'});
//sequelize.sync();





// Set the engine
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));


//получить   категории по ид subcategory
app.get('/api/getCatByIdSubCat/:sub_category_id', function(req, res) {

  let sub_category_id = req.params.sub_category_id;
  // console.log(idProdType);

  sequelize.query(`SELECT * FROM shop.subcategory where subcategory_id=${sub_category_id}`,
    {  type: sequelize.QueryTypes.SELECT }, { model: SubCategory }).then(subcategory => {
    res.send(subcategory);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  подкатегории по ид категории
app.get('/api/getsubCategoriById/:category_id', function(req, res) {

  let category_id = req.params.category_id;
  // console.log(idProdType);

  sequelize.query(`SELECT * FROM shop.subcategory where category_id=${category_id}`,
    {  type: sequelize.QueryTypes.SELECT }, { model: SubCategory }).then(subcategories => {
    res.send(subcategories);

  }).catch(error =>{
    throw new Error(error);
  });

});


//получить  категории
app.get('/api/getCategories', function(req, res) {

  //let idProdType = req.params.idProdType;
  // c

  sequelize.query(`SELECT * FROM shop.category`,
    {  type: sequelize.QueryTypes.SELECT }, { model: Category }).then(categories => {
    res.send(categories);

  }).catch(error =>{
    throw new Error(error);
  });

});


//удалить товар
app.post('/api/deleteProd', function(req, res) {

  let product = req.body;
  let product_id = product.product_id;
  console.log(product_id);

  // sequelize.query(`SELECT * FROM shop.product left join shop.images using(product_id) where product.product_id=${product_id}`,{  type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
  //   res.send(products);
  // }).catch(error =>{
  //   throw new Error(error);
  // });
  return sequelize.transaction({isolationLevel: "SERIALIZABLE", autocommit: true}, transaction => {

    let promises = [];

    let delProd = sequelize.query(`DELETE FROM shop.product where product_id=${product_id}`,{type: sequelize.QueryTypes.DELETE, transaction: transaction});
    let delProd_options = sequelize.query(`DELETE FROM shop.product_option where product_id=${product_id}`,{type: sequelize.QueryTypes.DELETE, transaction: transaction});
    let delProd_imges = sequelize.query(`DELETE FROM shop.images where product_id=${product_id}`,{type: sequelize.QueryTypes.DELETE, transaction: transaction});

    promises.push(delProd);
    promises.push(delProd_options);
    promises.push(delProd_imges);


    return Promise.all(promises).then(function(res) {
      console.log(res);
    }).catch(error =>{
      throw new Error(error);
    });

    // your transactions
    }).then(result1 => {

      // transaction has been committed. Do something after the commit if required.
      let result = {
        status: 'ok',
        data: product
      };
      res.send(result);

    }).catch(err => {
      console.error(err);
      // do something with the err.
      let result = {
        status: 'error'
      };
      res.send(result);
    });
});


//изменить товар
app.post('/api/updateProd', upload.single('photo') , function(req, res) {

  let product = JSON.parse(req.body.data);

  return sequelize.transaction({isolationLevel: "SERIALIZABLE", autocommit: true}, transaction => {

                return sequelize.query(`UPDATE shop.product
                                      SET 
                                        product_name = '${product.product_name}',
                                        product_short_description = '${product.product_short_description}', 
                                        product_description = '${product.product_description}', 
                                        product_count = ${product.product_count}, 
                                        product_price = ${product.product_price}, 
                                        product_keywords_seo = '${product.product_keywords_seo}', 
                                        product_description_seo = '${product.product_description_seo}', 
                                        product_manufacturer = '${product.product_manufacturer}', 
                                        subcategory_id = ${product.subcategory_id}, 
                                        product_type = ${product.product_type}, 
                                        product_available = ${product.product_available}, 
                                        product_status = '${product.product_status}', 
                                        product_color = '${product.product_color}', 
                                        product_promo_price = ${product.product_promo_price}, 
                                        product_ispromo  = ${product.product_ispromo}
                                      where
                                            product_id=${product.product_id}`,
                    {type: sequelize.QueryTypes.UPDATE, transaction: transaction }).then(options => {
                      console.log(options);
                      console.log('Продукт изменен');

                          // удаление и обновление опций продукта
                          return sequelize.query(`DELETE FROM shop.product_option where product_id=${product.product_id}`,
                            {type: sequelize.QueryTypes.DELETE, transaction: transaction})
                            .then(options => {
                              console.log('Предыдущие опции удалены');


                                      let promises = [];

                                      for (productOpt of product.product_options) {
                                        let newPromise = sequelize.query(
                                                          `INSERT INTO shop.product_option(product_id, option_id, option_value) 
                                                              values ('${product.product_id}', '${productOpt.option_id}' , '${productOpt.value}')`,
                                                          { type: sequelize.QueryTypes.INSERT,  transaction: transaction }
                                                        );

                                        promises.push(newPromise);
                                      }
                                        // удаление и обновление картинки
                                        if (req.file) {
                                          let photo = req.file;
                                          let newPromiseFoImg =   sequelize.query(`DELETE FROM shop.images where product_id=${product.product_id}`,
                                                                  {type: sequelize.QueryTypes.DELETE, transaction: transaction}).then(options => {
                                                                  console.log('Предыдущие изображения удалены');
                                                                                return sequelize.query(
                                                                                  `INSERT INTO shop.images(product_id, images_mini, images_middle, images_large )
                                                                                    values ('${product.product_id}', 'assets/img/products/${photo.originalname}' , 'assets/img/products/${photo.originalname}', 'assets/img/products/${photo.originalname}')`,
                                                                                  { type: sequelize.QueryTypes.INSERT ,  transaction: transaction }
                                                                                );

                                                                });
                                          promises.push(newPromiseFoImg);
                                        }

                                    return Promise.all(promises).then(function(res) {
                                      console.log(res);
                                    }).catch(error =>{
                                        throw new Error(error);
                                      });

                            }).catch(error => {
                              // transaction.rollback();
                              throw new Error(error);
                            });


                  }).catch(error => {
                    throw new Error(error);
                  });


  // your transactions
    }).then(result1 => {
      //console.log(result);
      // transaction has been committed. Do something after the commit if required.
        let result = {
              status: 'ok'
            };
            res.send(result);
    }).catch(err => {
      console.error(err);
      // do something with the err.
        let result = {
              status: 'error'
            };
            res.send(result);
  });


});

//добавить товар
app.post('/api/addNewProd', upload.single('photo') , function(req, res) {

  if (!req.file){
    console.log('картинка не выбрана');
    return;
  }

  let photo =  req.file;
  let product = JSON.parse( req.body.data);


  // console.log(product);

  let formated_date = getCurrentDateTime();

  return sequelize.transaction({isolationLevel: "SERIALIZABLE", autocommit: true}, transaction => {

      return sequelize.query(
        `INSERT INTO shop.product(
                product_date_add, 
                product_name, 
                product_short_description, 
                product_description, 
                product_count, 
                product_price, 
                product_keywords_seo, 
                product_description_seo, 
                product_manufacturer, 
                subcategory_id, 
                product_type, 
                product_available, 
                product_status, 
                product_color, 
                product_promo_price, 
                product_ispromo ) 
        values ('${formated_date}', 
                :name, 
                :shortDesc, 
                :desc, 
                :count, 
                :price,
                :keywordsSeo, 
                :descrSeo,
                :manufact, 
                :subcatId, 
                :typeId, 
                :available, 
                :status, 
                :color, 
                :promoPrice, 
                :isPromo)`,
        {
          replacements: {
            name: product.product_name,
            shortDesc: product.product_short_description,
            desc: product.product_description,
            count: product.product_count,
            price: product.product_price,
            keywordsSeo: product.product_keywords_seo,
            descrSeo: product.product_description_seo,
            manufact: product.product_manufacturer,
            subcatId: product.subcategory_id,
            typeId: product.product_type,
            available: true,
            status: product.product_status,
            color: product.product_color,
            promoPrice: product.product_promo_price,
            isPromo: product.product_ispromo
            }
        },
        { type: sequelize.QueryTypes.INSERT, transaction: transaction },{ model: Product }
      ).then(function (prodInsertedId) {
        // console.log(prodInsertedId[0]);

          let promises = [];
          // добавление опций
          for (productOpt of product.product_options) {
            let newPromise = sequelize.query(
                            `INSERT INTO shop.product_option(product_id, option_id, option_value) 
                             values ('${prodInsertedId[0]}', '${productOpt.option_id}' , '${productOpt.value}')`,
                            { type: sequelize.QueryTypes.INSERT,  transaction: transaction }
                          );

            promises.push(newPromise);
          }


            // добавление картинки
            let newPromiseFoImg =   sequelize.query(
                                `INSERT INTO shop.images(product_id, images_mini, images_middle, images_large ) 
                                  values ('${prodInsertedId[0]}', 'assets/img/products/${photo.originalname}' , 'assets/img/products/${photo.originalname}', 'assets/img/products/${photo.originalname}')`,
                                { type: sequelize.QueryTypes.INSERT, transaction: transaction }
                              );
            promises.push(newPromiseFoImg);


          return Promise.all(promises).then(function(res) {
            console.log(res);
          }).catch(error =>{
            throw new Error(error);
          });

        // for (productOpt of product.product_options){
        //   sequelize.query(
        //     `INSERT INTO shop.product_option(product_id, option_id, option_value)
        //       values ('${prodInsertedId[0]}', '${productOpt.option_id}' , '${productOpt.value}')`,
        //     { type: sequelize.QueryTypes.INSERT }
        //   ).then(function (product_optionId) {
        //     // console.log(product_optionId[0]);
        //   }).catch(error =>{
        //     throw new Error(error);
        //   });
        // }
        //
        //
        //   sequelize.query(
        //     `INSERT INTO shop.images(product_id, images_mini, images_middle, images_large )
        //       values ('${prodInsertedId[0]}', 'assets/img/products/${photo.originalname}' , 'assets/img/products/${photo.originalname}', 'assets/img/products/${photo.originalname}')`,
        //     { type: sequelize.QueryTypes.INSERT }
        //   ).then(function (product_optionId) {
        //     // console.log(product_optionId[0]);
        //   }).catch(error =>{
        //     throw new Error(error);
        //   });


      }).catch(error =>{
        throw new Error(error);
      });

// your transactions
  }).then(result1 => {
    //console.log(result);
    // transaction has been committed. Do something after the commit if required.
    let result = {
      status: 'ok'
    };
    res.send(result);
  }).catch(err => {
    console.error(err);
    // do something with the err.
    let result = {
      status: 'error'
    };
    res.send(result);
  });

});


//получить  опции для добавленного продукта
app.get('/api/getOptionsByIdProd/:id_prod', function(req, res) {

  let id_prod = req.params.id_prod;
  // console.log(idProdType);

  sequelize.query(`SELECT * FROM shop.product_option where product_id=${id_prod}`,
    {  type: sequelize.QueryTypes.SELECT }, { model: ProductOptions }).then(options => {
    res.send(options);

  }).catch(error =>{
    throw new Error(error);
  });

});


//получить  опции для добавления продукта
app.get('/api/getOptionsByType/:idProdType', function(req, res) {

  let idProdType = req.params.idProdType;
   // console.log(idProdType);

  sequelize.query(`SELECT * FROM shop.option_list where option_category_type=${idProdType}`,
    {  type: sequelize.QueryTypes.SELECT }, { model: OptionList }).then(options => {
    res.send(options);

  }).catch(error =>{
    throw new Error(error);
  });

});


//получить  все продукты для поиска
app.get('/api/getProdsForSearch', function(req, res) {

  // let order_search = req.body.search;
  // console.log(order_search);

  sequelize.query(`SELECT * FROM shop.product`,
    {  type: sequelize.QueryTypes.SELECT }, { model: Product }).then(prods => {
    res.send(prods);

  }).catch(error =>{
    throw new Error(error);
  });

});



//получить получить записи(продукты) по типу
app.get('/api/getProdsByType/:type_prod', function(req, res) {

  let type_prod = req.params.type_prod;
  console.log(type_prod);

  sequelize.query(`SELECT * FROM shop.product inner join shop.product_types on product.product_type=product_types.product_types_id
                    WHERE  product_types.product_types_name='${type_prod}'
                    ORDER BY product.product_date_add DESC`
    ,{  type: sequelize.QueryTypes.SELECT }, { model: Product}).then(product_types => {
    res.send(product_types);

  }).catch(error =>{
    res.send(error);
    throw new Error(error);
  });

});

//получить получить последнии добавленные записи(продукты)
app.get('/api/getLastProds', function(req, res) {

  sequelize.query(`SELECT * FROM shop.product ORDER BY product.product_date_add DESC limit 50`
    ,{  type: sequelize.QueryTypes.SELECT }, { model: Product_types }).then(product_types => {
    res.send(product_types);

  }).catch(error =>{
    throw new Error(error);
  });

});



//получить типы продуктов
app.get('/api/getProdTypes', function(req, res) {

  sequelize.query(`SELECT * FROM shop.product_types`
    ,{  type: sequelize.QueryTypes.SELECT }, { model: Product_types }).then(product_types => {
    res.send(product_types);

  }).catch(error =>{
    throw new Error(error);
  });

});



//получить продукты заказа по ид заказа
app.get('/api/getOrderProds/:order_id', function(req, res) {

  let order_id = req.params.order_id;

  sequelize.query(`SELECT * FROM (shop.order_prod inner join shop.product on order_prod.product_id=product.product_id) inner join shop.images on images.product_id=product.product_id where order_prod.order_id=${order_id}`
    ,{  type: sequelize.QueryTypes.SELECT }, { model: Order_prod }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  заказ по ид
app.get('/api/getOrder/:order_id', function(req, res) {

  let order_id = req.params.order_id;

  sequelize.query(`SELECT * FROM shop.order where order_id=${order_id}`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});



//получить  заказы по ид для поиска
app.post('/api/getResSearch', function(req, res) {

  let order_search = req.body.search;
  // console.log(order_search);

  sequelize.query(`SELECT * FROM shop.order where CAST(order_id as SIGNED )  like '%${order_search}%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  заказы  по телефону для поиска
app.post('/api/getResSearchByPhone', function(req, res) {

  let phone = req.body.search;
  // console.log(order_search);

  sequelize.query(`SELECT * FROM shop.order where order_phone_customer  like '%${phone}%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  заказы отклоненные
app.get('/api/getRejectedOrder', function(req, res) {

  sequelize.query(`SELECT * FROM shop.order where order_status like '%Откланен%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  заказы завершенные
app.get('/api/getDoneOrder', function(req, res) {

  sequelize.query(`SELECT * FROM shop.order where order_status like '%Доставлен%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить  заказы в обработке
app.get('/api/getProcessingOrder', function(req, res) {

  sequelize.query(`SELECT * FROM shop.order where order_status like '%В обработке%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//получить новые заказы
app.get('/api/getNewOrder', function(req, res) {

  sequelize.query(`SELECT * FROM shop.order where order_status like '%Новый%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});


//получить все заказы
app.get('/api/getAllOrder', function(req, res) {

  sequelize.query(`SELECT * FROM shop.order ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
    res.send(orders);

  }).catch(error =>{
    throw new Error(error);
  });

});

//обновить заказ
app.post('/api/updateOrder', function(req, res) {
  let order = req.body;

  return sequelize.transaction({isolationLevel: "SERIALIZABLE", autocommit: true}, transaction => {

    return sequelize.query(`UPDATE shop.order
                                      SET 
                                        order_city = '${order.order_city}', 
                                        order_office = '${order.order_office}', 
                                        order_name_customer = '${order.order_name_customer}', 
                                        order_famil_customer = '${order.order_famil_customer}', 
                                        order_phone_customer = '${order.order_phone_customer}', 
                                        order_email_customer = '${order.order_email_customer}', 
                                        order_sum = ${order.order_sum}, 
                                        order_status = '${order.order_status}'
                                        
                                      where
                                            order_id=${order.order_id}`,
      {type: sequelize.QueryTypes.UPDATE, transaction: transaction }).then(options => {
      //console.log(products);

      // удаление и обновление продуктов заказа
        return sequelize.query(`DELETE FROM shop.order_prod where order_id=${order.order_id}`,
          {type: sequelize.QueryTypes.DELETE, transaction: transaction})
          .then(options => {

            // добавление продуктов заказа
            let promises = [];

            for (orderProduct of order.cart){
              let newPromice = sequelize.query(
                `INSERT INTO shop.order_prod(order_id, product_id, order_prod_count, order_prod_price, order_prod_promo_price) 
                  values ('${order.order_id}', '${orderProduct.product.product_id}' , '${orderProduct.count}', '${orderProduct.product.product_price}', '${orderProduct.product.product_promo_price}')`,
                { type: sequelize.QueryTypes.INSERT, transaction: transaction },{ model: Order_prod }
              );
              promises.push(newPromice);
            }

            return Promise.all(promises).then(function(res) {
              console.log(res);
            }).catch(error =>{
              throw new Error(error);
            });


          }).catch(error =>{
            throw new Error(error);
          });



    }).catch(error =>{
      throw new Error(error);
    });


    // your transactions
  }).then(result1 => {
    //console.log(result);
    // transaction has been committed. Do something after the commit if required.
    let result = {
      status: 'ok'
    };
    res.send(result);
  }).catch(err => {
    console.error(err);
    // do something with the err.
    let result = {
      status: 'error'
    };
    res.send(result);
  });


});

function getCurrentDateTime() {
  let now = new Date();
  let formated_date = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
    + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) +':'+ ('0' + now.getSeconds()).slice(-2);

  return formated_date;
}
//добавить заказ
app.post('/api/addOrder', function(req, res) {

   let order = req.body;

   let now = new Date();
   // let formated_date = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
   // + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) +':'+ ('0' + now.getSeconds()).slice(-2);
   let formated_date = getCurrentDateTime();

  // console.log(order);
  // sequelize.query(
  //   `INSERT INTO shop.order(order_date,order_city,order_office,order_name_customer,order_phone_customer,order_email_customer,order_sum, order_status)
  //   values ('${formated_date}', '${order.selectedCity}', '${order.selectedOffice}', '${order.name}', '${order.phone}', '${order.email}', '${order.allSumInCart}', 'Новый' )`,
  //   { type: sequelize.QueryTypes.INSERT },{ model: Order }
  return sequelize.transaction({isolationLevel: "SERIALIZABLE", autocommit: true}, transaction => {


          sequelize.query(
            `INSERT INTO shop.order(order_date, order_city, order_office, order_name_customer, order_famil_customer, order_phone_customer, order_email_customer, order_sum, order_status) 
            values ('${formated_date}', :selectedCity, :selectedOffice, :name, :famil, :phone, :email, :allSumInCart, 'Новый' )`,
            { replacements: { selectedCity: order.selectedCity,  selectedOffice: order.selectedOffice, name: order.name, famil: order.famil, phone: order.phone,  email: order.email, allSumInCart: order.allSumInCart }},
            { type: sequelize.QueryTypes.INSERT , transaction: transaction},{ model: Order }
          ).then(function (orderInsertId) {
            // console.log(orderInsertId[0]);

            let promises = [];

              for (orderProduct of order.cart){
                let newPromice = sequelize.query(
                  `INSERT INTO shop.order_prod(order_id, product_id, order_prod_count, order_prod_price, order_prod_promo_price) 
                  values ('${orderInsertId[0]}', '${orderProduct.product.product_id}' , '${orderProduct.count}', '${orderProduct.product.product_price}', '${orderProduct.product.product_promo_price}')`,
                  { type: sequelize.QueryTypes.INSERT , transaction: transaction },{ model: Order_prod }
                );
                promises.push(newPromice);
              }

            return Promise.all(promises).then(function(res) {
              console.log(res);
            }).catch(error =>{
              throw new Error(error);
            });

          }).catch(error =>{
            throw new Error(error);
          });

    // your transactions
  }).then(result1 => {
    //console.log(result);
    // transaction has been committed. Do something after the commit if required.
    let result = {
      status: 'ok'
    };
    res.send(result);
  }).catch(err => {
    console.error(err);
    // do something with the err.
    let result = {
      status: 'error'
    };
    res.send(result);
  });

});

//города новой почты
app.get('/api/getCities', function(req, res) {

  var request = require("request");

  var options = { method: 'POST',
    url: 'http://api.novaposhta.ua/v2.0/json/Address/getCities',
    headers:
      { 'Postman-Token': '19201ecf-f99f-08c3-7888-b11804a53fdc',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json' },
    body:
      { modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {},
        apiKey: '907d44787941d86081640f9bc504e5c0' },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    //console.log(body);
    //return body;
    res.send(body);
  });

});

//отделения новой почты
app.get('/api/getOffices/:city', function(req, res) {

  let category_url = req.params.city;

  var request = require("request");

  var options = { method: 'POST',
    url: 'http://api.novaposhta.ua/v2.0/json/Address/getWarehouses',
    headers:
      { 'Postman-Token': '9f0d13ab-ac46-152c-10b0-d28d44fb23d6',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json' },
    body:
      { modelName: 'AddressGeneral',
        calledMethod: 'getWarehouses',
        methodProperties: { CityName: category_url },
        apiKey: '907d44787941d86081640f9bc504e5c0' },
    json: true };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    res.send(body);
  });

});


//выборка из категориии
app.get('/api/getFromCategory/:category_name', function(req, res) {

  // let category_name = req.params.category_name;
  let category_url = req.params.category_name;
  //console.log(req.params.category_name);
  // sequelize.query(`SELECT * FROM ((shop.product inner join shop.subcategory on product.subcategory_id=subcategory.subcategory_id) inner join shop.category on subcategory.category_id=category.category_id)
  //                 inner join shop.images on images.product_id=product.product_id
  //                 where category.category_name= ? group by product.product_name`,{ replacements: [category_name], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
  sequelize.query(`SELECT * FROM (select * from((shop.product inner join shop.subcategory using (subcategory_id)) inner join shop.category using (category_id)) 
                  inner join shop.images using (product_id) GROUP BY product_name , IF(product_promo_price IS NULL,1,0), IF(product_promo_price = 0,1,0), product_promo_price  asc) as t
                  where category_url=? and product_status='Опубликован' group by product_name`,{ replacements: [category_url], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
    //console.log(products);

    res.send(products);

  }).catch(error =>{
    throw new Error(error);
  });


});



//выборка из подкатегории
app.get('/api/getFromSubCategory/:subcategory_name', function(req, res) {

  let subCategory_name = req.params.subcategory_name;// decodeURIComponent(req.params.product_type.toString());

  sequelize.query(`SELECT * FROM (select * from((shop.product inner join shop.subcategory using (subcategory_id)) inner join shop.category using (category_id)) 
                  inner join shop.images using (product_id) GROUP BY product_name , IF(product_promo_price IS NULL,1,0), IF(product_promo_price = 0,1,0), product_promo_price  asc) as t
                  where subcategory_name=? and product_status='Опубликован' group by product_name `,{ replacements: [subCategory_name], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {

    res.send(products);

  }).catch(error =>{
    throw new Error(error);
  });


});

//выборка одного продукта
app.get('/api/getItemProd/:prod_name', function(req, res) {

  let prod_name =req.params.prod_name;// decodeURIComponent(req.params.product_type.toString());

  sequelize.query(`SELECT * FROM ((shop.product  inner join shop.images on images.product_id=product.product_id) inner join shop.subcategory on product.subcategory_id=subcategory.subcategory_id)
                  inner join shop.category on subcategory.category_id=category.category_id where product.product_name=?`,
                { replacements: [prod_name], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {


    (function iterate(i) {

      //console.log( i + " фантик(ов) из 400");
      if (i < products.length) {

        sequelize.query(`SELECT * FROM shop.product_option inner join shop.option_list on product_option.option_id= option_list.option_id 
                  where product_id=${products[i].product_id}`,{ type: sequelize.QueryTypes.SELECT },{model: ProductOptions}).then(options => {

          products[i].product_options = options;
              //console.log(products[i]) ;
              return options;
            }).then((options) =>{iterate(i + 1);});

        //setTimeout(function() { iterate(i + 1); }, 10);
      }else {
        res.send(products);
      }

    })(0);



  }).catch(error =>{
    throw new Error(error);
  });


});

//выборка из подкатегории
app.get('/api/getAllProduct', function(req, res) {

  sequelize.query(`SELECT * FROM shop.product inner join shop.images on images.product_id=product.product_id`,{  type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
    res.send(products);
  }).catch(error =>{
    throw new Error(error);
  });


});

//продукт с картинками по ID
app.get('/api/getProdFromID/:prod_id', function(req, res) {

  let product_id =req.params.prod_id;

  sequelize.query(`SELECT * FROM shop.product inner join shop.images on images.product_id=product.product_id where product.product_id=${product_id}`,{  type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
    res.send(products);
  }).catch(error =>{
    throw new Error(error);
  });


});


//продукт по ID без картинок
app.get('/api/getProdFromIdNoImg/:prod_id', function(req, res) {

  let product_id =req.params.prod_id;

  sequelize.query(`SELECT * FROM shop.product left join shop.images using(product_id) where product.product_id=${product_id}`,{  type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
    res.send(products);
  }).catch(error =>{
    throw new Error(error);
  });


});




app.set('view engine', 'html');

app.set('views', './');
app.use('/', express.static('./', {index: false}));

app.get('*', (req, res) => {
  res.render('index', {req, res});
});

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});

require('zone.js/dist/zone-node');
require('reflect-metadata');
const express = require('express');

const bodyParser = require('body-parser');


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


const Order_prod = sequelize.define('Order_prod', {
    order_prod_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    order_id: Sequelize.INTEGER,
    product_id: Sequelize.INTEGER,
    order_prod_count: Sequelize.INTEGER,
    order_prod_price: Sequelize.INTEGER

  },
  {tableName: 'order_prod'});


const Order = sequelize.define('Order', {
    order_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    order_date: Sequelize.DATE,
    order_city: Sequelize.STRING,
    order_office: Sequelize.STRING,
    order_name_customer: Sequelize.STRING,
    order_phone_customer: Sequelize.STRING,
    order_email_customer: Sequelize.STRING,
    order_sum: Sequelize.INTEGER
  },
  {tableName: 'order'});

const OptionList = sequelize.define('Option_list', {
    option_id: { type: Sequelize.INTEGER, primaryKey: true , autoIncrement: true},
    option_name: Sequelize.STRING,
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
    product_type: Sequelize.STRING,
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

//получить  заказы для поиска
app.post('/api/getResSearch', function(req, res) {

  let order_search = req.body.search;
  console.log(order_search);

  sequelize.query(`SELECT * FROM shop.order where CAST(order_id as SIGNED )  like '%${order_search}%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
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

  sequelize.query(`SELECT * FROM shop.order where order_status like '%Доставлено%' ORDER BY order_date DESC`,{  type: sequelize.QueryTypes.SELECT }, { model: Order }).then(orders => {
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

//добавить заказ
app.post('/api/addOrder', function(req, res) {

   let order = req.body;

   let now = new Date();
   let formated_date = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
   + ' ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) +':'+ ('0' + now.getSeconds()).slice(-2);


  // console.log(order);
  // sequelize.query(
  //   `INSERT INTO shop.order(order_date,order_city,order_office,order_name_customer,order_phone_customer,order_email_customer,order_sum, order_status)
  //   values ('${formated_date}', '${order.selectedCity}', '${order.selectedOffice}', '${order.name}', '${order.phone}', '${order.email}', '${order.allSumInCart}', 'Новый' )`,
  //   { type: sequelize.QueryTypes.INSERT },{ model: Order }
  sequelize.query(
    `INSERT INTO shop.order(order_date,order_city,order_office,order_name_customer,order_phone_customer,order_email_customer,order_sum, order_status) 
    values ('${formated_date}', :selectedCity, :selectedOffice, :name, :phone, :email, :allSumInCart, 'Новый' )`,
    { replacements: { selectedCity: order.selectedCity,  selectedOffice: order.selectedOffice, name: order.name, phone: order.phone, email: order.email, allSumInCart: order.allSumInCart }},
    { type: sequelize.QueryTypes.INSERT },{ model: Order }
  ).then(function (orderInsertId) {
    // console.log(orderInsertId[0]);

      for (orderProduct of order.cart){
        sequelize.query(
          `INSERT INTO shop.order_prod(order_id, product_id, order_prod_count, order_prod_price) 
          values ('${orderInsertId[0]}', '${orderProduct.product.product_id}' , '${orderProduct.count}', '${orderProduct.product.product_price}')`,
          { type: sequelize.QueryTypes.INSERT }
        ).then(function (orderProdInsertId) {
          // console.log(orderProdInsertId);
          // let headers = new Headers();
          // headers.append('Content-Type', 'text/html; charset=utf-8');

        }).catch(error =>{
          // res.send('error');

          throw new Error(error);
        });
      }

    let result = {
      status: 'ok'
    };
    res.send(result);

  }).catch(error =>{
      let result = {
        status: 'error'
      };
      res.send(result);
    throw new Error(error);
  });

  // res.send(order);

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
  sequelize.query(`SELECT * FROM ((shop.product inner join shop.subcategory on product.subcategory_id=subcategory.subcategory_id) inner join shop.category on subcategory.category_id=category.category_id) 
                  inner join shop.images on images.product_id=product.product_id
                  where category.category_url= ? group by product.product_name`,{ replacements: [category_url], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {
    //console.log(products);

    res.send(products);

  }).catch(error =>{
    throw new Error(error);
  });


});



//выборка из подкатегории
app.get('/api/getFromSubCategory/:subcategory_name', function(req, res) {

  let subCategory_name = req.params.subcategory_name;// decodeURIComponent(req.params.product_type.toString());

  sequelize.query(`SELECT * FROM ((shop.product inner join shop.subcategory on product.subcategory_id=subcategory.subcategory_id) inner join shop.category on subcategory.category_id=category.category_id) 
                  inner join shop.images on images.product_id=product.product_id
                  where subcategory.subcategory_name=? group by product.product_name `,{ replacements: [subCategory_name], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {

    res.send(products);

  }).catch(error =>{
    throw new Error(error);
  });


});

//выборка одного продукта
app.get('/api/getItemProd/:prod_name', function(req, res) {

  let prod_name =req.params.prod_name;// decodeURIComponent(req.params.product_type.toString());

  sequelize.query(`SELECT * FROM ((shop.product  inner join shop.images on images.product_id=product.product_id) inner join shop.subcategory on product.subcategory_id=subcategory.subcategory_id)
                  inner join shop.category on subcategory.category_id=category.category_id where product.product_name=?`, { replacements: [prod_name], type: sequelize.QueryTypes.SELECT }, { model: Product }).then(products => {


    (function iterate(i) {

      //console.log( i + " фантик(ов) из 400");
      if (i < products.length) {

        sequelize.query(`SELECT * FROM shop.product_option inner join shop.option_list on product_option.option_id= option_list.option_id 
                  where product_id=${products[i].product_id}`,{model: OptionList}).then(options => {

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




app.set('view engine', 'html');

app.set('views', './');
app.use('/', express.static('./', {index: false}));

app.get('*', (req, res) => {
  res.render('index', {req, res});
});

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});

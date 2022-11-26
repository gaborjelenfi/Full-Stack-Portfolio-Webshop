<p align=center>
<img src="/images/mongodb.png" height="50px">
<img src="/images/expressjs.png" height="50px">
<img src="/images/react.png" height="50px">
<img src="/images/node.png" height="50px">
<img src="/images/graphql.png" height="50px">
<img src="/images/zustand.png" height="50px">
<img src="/images/stripe.png" height="50px">
<img src="/images/mailjet.png" height="50px">
</p>
  
# Full-Stack-Portfolio-Webshop

> This project is a Full Stack Portfolio Webshop based on MERN stack.
> Please regard that this is an **MVP**. This **SPA** represents some of my knowledge in web development. 
> I have been learning programming for a couple of years now. 
> I have started with **Frontend** technologies as a hobby but I decided to make one step forward in April 2022 and I have been started **Backend** technologies since then.\

#### For customer site -> **Live** **demo** [_https://tangerine-fenglisu-dd980d.netlify.app_](https://tangerine-fenglisu-dd980d.netlify.app/).
#### For admin site -> **Live** **demo** [_https://tangerine-fenglisu-dd980d.netlify.app/admin_](https://tangerine-fenglisu-dd980d.netlify.app/admin).

#### Usage datas:
- Create your own customer account at `Login/Create an Account`
- Demo customers:
  - email: **`customer@gmail.com`** && password: **`customer`**
- Demo admin user:
  - email: **`bond@superb.com`** && password: **`jamesbond`**
- For **Stripe** demo payment:
  - Card information: **`4242 4242 4242 4242`** (only this card number works in demo)
  - Date (MM / YY): **`02/25`** (any future date)
  - CVC: **`222`** (any 3 digits)

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Installation](#installation)
* [Features](#features)
* [Screenshots](#screenshots)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)


## General Information
- This app is furniture webshop where you can use filtering, create an account and demo pay by stripe.
- It has server side authentication and frontend side authorization. Input fields validation on both Backend and Frontend. More details below.
- This project purpose was to show what I can achieve and hopefully change my career path.
- I made this project only to my portfolio.

## Technologies Used
- Backend:
  - NodeJS
  - ExpressJS
  - GraphQL / REST API
  
- Database:
  - MondoDB / Mongoose

- Frontend:
  - ReactJS
  - Zustand
  - Axios
  
For the full list of dependencies check the package.json files at `/Backend` and at `/Frontend` please.

## Installation
You need to add your own API keys.
Install the dependencies to both **Backend** and **Frontend** and start them separately.
```sh
cd Backend
npm install
npm run start:dev
```
```sh
cd Frontend
npm install
npm start
```

## Features

### _Customer:_

- Every customers can:
  - view the products even with filter
  - add products to cart
  - edit cart
  - demo buy via **Stripe** (_After successful order, customers will get an email about the order_)

- Customers with registration can:
  - store and edit their addresses:
    - Billing address
    - Shipping address
  - select the stored addresses in the checkout section
  - edit their account data
  - check their recent orders
  
- customers without registration can:
  - create an account
  
### _Admin user:_

- Every admins can:
  - add new product to database
  - view the products and edit them
  - add new category and edit existing ones
  - add new manufacturer and edit existing ones
  - find a customer by email address and view their orders
  - find an order by order's ID
  - list every admin users and edit their own account data
  
- Main admin can:
  - create new admin user
  - edit every admin users' account data
  
_For demo purpose, no one can delete anything!_ \
If you install the project on your computer and you remove the `accessDenied()` method in any deletion file in mutation folder you can use that feature.\
Find those files at `Backend/graphql/mutation/`.\
But by default if you can delete something you actually just set the `isDeleted` field to true for that item in the database.

### _MongoDB:_

- Collection:
  - **furnitureWebshop**

- Documents:
  - admins
  - customers
  - furniturecategory
  - manufacturers
  - orders
  - products

<p align=center>
  <img src="/images/customer_db_document_example.png"><br />[Customer document example]
</p>

## Screenshots
<p align=center>
  <img src="/images/main_page.png"><br />[Main page screenshot]<br />
  <img src="/images/shopping_cart.png"><br />[Shopping cart screenshot]<br />
  <img src="/images/checkout.png"><br />[Checkout screenshot]<br />
  <img src="/images/create_account.png"><br />[Create account screenshot]<br />
</p>


## Room for Improvement

Room for improvement:
- Perfomance, loading speed improvement

To do:
- [x] Add a mailing system to inform customers by email
- [ ] Add 'Reset password' feature


## Acknowledgements
- This project was inspired by **ThemesGround**
- This project was based on a ThemesGround free template from themehunt.com (unfotunatly this site is not working anymore).
- Many thanks to my wife, me and [Ákos Paska](https://github.com/akospaska) for trust.

## Contact
Created by Gábor Jelenfi. gabor.jelenfi@gmail.com - feel free to contact me!


## License
**Copyright @ 2022 All rights reserved**


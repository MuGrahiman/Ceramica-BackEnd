├── /src                    
│   ├── /books
│   |   ├── book.controller.js
│   |   └── book.route.js
│   ├── /cart
│   |   ├── cart.controller.js
│   |   └── cart.route.js
│   ├── /orders
│   |   ├── order.controller.js
│   |   └── order.route.js
│   ├── /otp
│   |   ├── otp.controller.js
│   |   └── otp.route.js
│   ├── /users
│   |   ├── user.controller.js
│   |   └── user.route.js
│   ├── /admin
│   |   ├── admin.controller.js
│   |   └── admin.route.js
│   └── /inventory
│       ├── inventory.controller.js
│       └── inventory.route.js
├── /utilities             
|   ├── auth.js
|   └── mailer.js
├── /configs             
|   ├── db.config.js
|   └── env.config.js
├── /middlewares 
|   └── error.Middleware.js
├── app.js (Express app configuration)
├── server.js (Server and database setup)
├── index.js (Entry point)
└── package.json



## exports.createOrder= ~ paypalOrder

- **id**: `0Y7475767T9954316`
- **status**: `CREATED`
- **links**:
  - **rel**: `self`
    - **method**: `GET`
  - **rel**: `approve`
    - **method**: `GET`
  - **rel**: `update`
    - **method**: `PATCH`
  - **rel**: `capture`
    - **method**: `POST`



## create order output:(mongodb return)
- **userId**: `67a10278828f782e447c45d1`
- **addressId**: `67a99b690833f5dc1fcc29d3`
- **items**:
  - **productId**: `679fc22b491b3f3e7e50f29c`
  - **quantity**: `1`
  - **_id**: `67b996d19e980e75a2873c1b`
- **totalAmount**: `45`
- **paymentStatus**: `pending`
- **paymentId**: `0Y7475767T9954316`
- **status**: `processing`
- **_id**: `67b996d19e980e75a2873c1a`
- **createdAt**: `2025-02-22T09:20:17.580Z`
- **updatedAt**: `2025-02-22T09:20:17.580Z`
- **__v**: `0`




## On Approved output:(paypal return)
- **orderID**: `0Y7475767T9954316`
- **payerID**: `LM2UJ6M4XCXGU`
- **paymentID**: `0Y7475767T9954316`
- **billingToken**: `null`
- **facilitatorAccessToken**: `A21AAKQ4aL2tAlr-XXSAMWHxXYMkG_apm-XRvkzvZcsRiL9mDLMh6wnrJzmJz-ZwK22_MHwGppRhfZr3fDCbWfLLo5sV3X9zQ`
- **paymentSource**: `paypal`

## PayPalService ~ capturePayment ~ result

- **id**: `0Y7475767T9954316`
- **paymentSource**:
  - **paypal**:
    - **emailAddress**: `sb-47rxji37946259@personal.example.com`
    - **accountId**: `LM2UJ6M4XCXGU`
    - **accountStatus**: `VERIFIED`
    - **name**: `[Object]`
    - **address**: `[Object]`
- **payer**:
  - **emailAddress**: `sb-47rxji37946259@personal.example.com`
  - **payerId**: `LM2UJ6M4XCXGU`
  - **name**:
    - **givenName**: `John`
    - **surname**: `Doe`
  - **address**:
    - **countryCode**: `US`
- **purchaseUnits**:
  - **referenceId**: `default`
  - **shipping**: `[Object]`
  - **payments**: `[Object]`
- **status**: `COMPLETED`
- **links**:
  - **rel**: `self`
  - **method**: `GET`

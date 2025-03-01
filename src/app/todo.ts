// website:
// https://gebra-products-managemen-668af.web.app/

// D - todo: create a firestore user when sign up, and then create a user with more details such as haveing roles in there https://www.youtube.com/watch?v=qWy9ylc3f9U
// D - todo: setup privacy rule on each table, products: readonly if not login, else read & write if logged in
// D - todo: implement canload for customer and order
// D - todo: fetch with user id(customer is created by perticular user) and store document reference: https://chatgpt.com/c/67b1a8e1-7ddc-8007-b641-2b9d92c1247f
// D - todo: cannot update anythings that doesn't belong to the creator
// todo: translate into Chinese
// D - todo: sign up to insert english name
// D - todo: add decimal separator
// D -  todo: sort customer by first name in order dialog
// todo: update the order records if customer get updated - better do it using firebase function:
// exports.updateCustomerInProducts = functions.firestore
//     .document("customers/{customerId}")
//     .onUpdate(async (change, context) => {}

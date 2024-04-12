A webstore app (backend + frontend) made as a project work for https://fullstackopen.com/.

You can browse the store and make orders without logging in, but you can also register an account if you wish.
The app has Finnish and English as language selections, affecting all of the content. The layout is designed to suite both desktop and mobile phone screens.

The app is using Paytrail with its test credentials ( https://docs.paytrail.com/#/payment-method-providers?id=test-credentials ), so you can choose any payment method and finish the order without an actual transaction taking place.

For "Postipaketti" delivery method it uses Posti's pickup location API so the customer can choose a pickup location of their liking.

As a user with admin rights, you can add/edit/delete items and categories, browse/process/delete orders, browse/edit/delete users and edit settings such as webstore's/merchant's name/contact details, etc. 

As a user with operator rights, you can add items/categories (and edit/delete them, but only the ones that have been added by yourself), browse/process/delete orders, browse users and browse settings.

The app is currently running here: https://fullstack-open-project.onrender.com/

Work hours listing (in Finnish) can be found here: https://github.com/jslindgit/fullstack-project/blob/main/tuntikirjanpito.md

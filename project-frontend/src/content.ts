import { LangCode, LangContent } from './types/languageTypes';

export enum ContentID {
    adminAddNewCategory = 'ADMIN: Add New Category',
    adminEditcategory = 'ADMIN: Edit Category',
    adminPanelCategories = 'ADMIN: Categories',
    adminPanelHeader = 'ADMIN: Admin Panel header',
    adminPanelImages = 'ADMIN: Images',
    adminPanelItems = 'ADMIN: Items',
    adminPanelOrders = 'ADMIN: Orders',
    adminPanelSettings = 'ADMIN: Settings',
    adminPanelUsers = 'ADMIN: Users',
    backButtonDefault = 'BACK BUTTON: Default label',
    buttonAdd = 'BUTTON: Add',
    buttonCheckOut = 'BUTTON: Check out',
    buttonRemove = 'BUTTON: Remove',
    cartProduct = 'SHOPPING CART: Product',
    cartQuantity = 'SHOPPING CART: Quantity',
    cartSubtotal = 'SHOPPING CART: Subtotal',
    cartTotalPrice = 'SHOPPING CART: Total price',
    cartUnitPrice = 'SHOPPING CART: Unit price',
    checkOutChooseDeliveryMethod = 'CHECK OUT: Choose Delivery Method (header)',
    checkOutChoosePaymentMethod = 'CHECK OUT: Choose Payment Methdod (button)',
    checkOutCity = 'CHECK OUT: City',
    checkOutCountry = 'CHECK OUT: Country',
    checkOutCustomerContactInformation = 'CHECK OUT: Customer Contact Information (header)',
    checkOutFirstName = 'CHECK OUT: First name',
    checkOutHeader = 'CHECK OUT: Header',
    checkOutLastName = 'CHECK OUT: Last name',
    checkOutOrderInfo = 'CHECK OUT: Order Info (header)',
    checkOutOrganization = 'CHECK OUT: Organization',
    checkOutSelectCountry = 'CHECK OUT: Select a country',
    checkOutStreetAddress = 'CHECK OUT: Street address',
    checkOutZipCode = 'CHECK OUT: Zipcode',
    contactBusinessID = 'CONTACT: Business ID',
    contactEmail = 'CONTACT: E-mail',
    contactPhone = 'CONTACT: Phone',
    homeWelcome = 'HOME: Welcome text',
    itemsAddToShoppingCart = 'ITEMS: "Add to shopping cart" button',
    itemsAmount = 'ITEMS: Amount (to add to shopping cart)',
    itemsInStock = 'ITEMS: In stock',
    itemsSoldOut = 'ITEMS: Sold out',
    loginNoAccount = 'LOGIN: No account yet?',
    loginPassword = 'LOGIN: Password:',
    loginRegisterHere = 'LOGIN: Register here (link)',
    loginUsername = 'LOGIN: Username:',
    menuAccount = 'MENU: Account',
    menuAdmin = 'MENU: Admin (shown next to username if the user is an admin)',
    menuAdminSection = 'MENU: Admin (section)',
    menuHome = 'MENU: Home',
    menuInfo = 'MENU: Info',
    menuLogin = 'MENU: Login',
    menuLogout = 'MENU: Log out',
    menuProducts = 'MENU: Products',
    menuShoppingCart = 'MENU: Shopping Cart',
    miscDescription = 'MISC: Description',
    miscMerchant = 'MISC: Merchant',
    miscName = 'MISC: Name',
    notificationLoggedOut = 'NOTIFICATION: Logged out',
    orderCustomer = 'ORDER: Customer',
    orderDeliveryMethod = 'ORDER: Delivery Method',
    orderId = 'ORDER: Order ID',
    orderItems = 'ORDER: Items',
    orderPaymentMethod = 'ORDER: Payment method',
    orderStatus = 'ORDER: Status',
    orderTotalAmount = 'ORDER: Total Amount',
    statusCancelled = 'ORDER STATUS: Cancelled',
    statusCompleted = 'ORDER STATUS: Completed',
    statusDelivered = 'ORDER STATUS: Delivered',
    statusOnHold = 'ORDER STATUS: On hold',
    statusPending = 'ORDER STATUS: Pending',
    statusProcessing = 'ORDER STATUS: Processing',
    statusRefunded = 'ORDER STATUS: Refunded',
    statusShipped = 'ORDER STATUS: Shipped',
}

/*
    {
        id: ContentID,
        content: [
            { langCode: LangCode.EN, text: '' },
            { langCode: LangCode.FI, text: '' },
        ],
    },
*/

export const defaultLangContent: LangContent[] = [
    {
        id: ContentID.adminAddNewCategory,
        content: [
            { langCode: LangCode.EN, text: 'Add New Category' },
            { langCode: LangCode.FI, text: 'Lisää uusi kategoria' },
        ],
    },
    {
        id: ContentID.adminEditcategory,
        content: [
            { langCode: LangCode.EN, text: 'Edit Category' },
            { langCode: LangCode.FI, text: 'Muokkaa kategoriaa' },
        ],
    },
    {
        id: ContentID.adminPanelCategories,
        content: [
            { langCode: LangCode.EN, text: 'Categories' },
            { langCode: LangCode.FI, text: 'Kategoriat' },
        ],
    },
    {
        id: ContentID.adminPanelHeader,
        content: [
            { langCode: LangCode.EN, text: 'Admin Panel' },
            { langCode: LangCode.FI, text: 'Hallintapaneeli' },
        ],
    },
    {
        id: ContentID.adminPanelImages,
        content: [
            { langCode: LangCode.EN, text: 'Images' },
            { langCode: LangCode.FI, text: 'Kuvat' },
        ],
    },
    {
        id: ContentID.adminPanelItems,
        content: [
            { langCode: LangCode.EN, text: 'Products' },
            { langCode: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.adminPanelOrders,
        content: [
            { langCode: LangCode.EN, text: 'Orders' },
            { langCode: LangCode.FI, text: 'Tilaukset' },
        ],
    },
    {
        id: ContentID.adminPanelSettings,
        content: [
            { langCode: LangCode.EN, text: 'Settings' },
            { langCode: LangCode.FI, text: 'Asetukset' },
        ],
    },
    {
        id: ContentID.adminPanelUsers,
        content: [
            { langCode: LangCode.EN, text: 'Users' },
            { langCode: LangCode.FI, text: 'Käyttäjät' },
        ],
    },
    {
        id: ContentID.backButtonDefault,
        content: [
            { langCode: LangCode.EN, text: 'Go back' },
            { langCode: LangCode.FI, text: 'Takaisin' },
        ],
    },
    {
        id: ContentID.buttonAdd,
        content: [
            { langCode: LangCode.EN, text: 'Add' },
            { langCode: LangCode.FI, text: 'Lisää' },
        ],
    },
    {
        id: ContentID.buttonCheckOut,
        content: [
            { langCode: LangCode.EN, text: 'Check out' },
            { langCode: LangCode.FI, text: 'Kassalle' },
        ],
    },
    {
        id: ContentID.buttonRemove,
        content: [
            { langCode: LangCode.EN, text: 'Remove' },
            { langCode: LangCode.FI, text: 'Poista' },
        ],
    },
    {
        id: ContentID.cartProduct,
        content: [
            { langCode: LangCode.EN, text: 'Product' },
            { langCode: LangCode.FI, text: 'Tuote' },
        ],
    },
    {
        id: ContentID.cartQuantity,
        content: [
            { langCode: LangCode.EN, text: 'Quantity' },
            { langCode: LangCode.FI, text: 'Määrä' },
        ],
    },
    {
        id: ContentID.cartSubtotal,
        content: [
            { langCode: LangCode.EN, text: 'Subtotal' },
            { langCode: LangCode.FI, text: 'Välisumma' },
        ],
    },
    {
        id: ContentID.cartTotalPrice,
        content: [
            { langCode: LangCode.EN, text: 'Total price' },
            { langCode: LangCode.FI, text: 'Yhteensä' },
        ],
    },
    {
        id: ContentID.cartUnitPrice,
        content: [
            { langCode: LangCode.EN, text: 'Unit price' },
            { langCode: LangCode.FI, text: 'Hinta/kpl' },
        ],
    },
    {
        id: ContentID.checkOutChooseDeliveryMethod,
        content: [
            { langCode: LangCode.EN, text: 'Choose Delivery Method' },
            { langCode: LangCode.FI, text: 'Valitse toimitustapa' },
        ],
    },
    {
        id: ContentID.checkOutChoosePaymentMethod,
        content: [
            { langCode: LangCode.EN, text: 'Choose Payment Method' },
            { langCode: LangCode.FI, text: 'Valitse maksutapa' },
        ],
    },
    {
        id: ContentID.checkOutCity,
        content: [
            { langCode: LangCode.EN, text: 'City' },
            { langCode: LangCode.FI, text: 'Kaupunki' },
        ],
    },
    {
        id: ContentID.checkOutCountry,
        content: [
            { langCode: LangCode.EN, text: 'Country' },
            { langCode: LangCode.FI, text: 'Maa' },
        ],
    },
    {
        id: ContentID.checkOutCustomerContactInformation,
        content: [
            { langCode: LangCode.EN, text: 'Customer Contact Information' },
            { langCode: LangCode.FI, text: 'Tilaajan yhteystiedot' },
        ],
    },
    {
        id: ContentID.checkOutFirstName,
        content: [
            { langCode: LangCode.EN, text: 'First name' },
            { langCode: LangCode.FI, text: 'Etunimi' },
        ],
    },
    {
        id: ContentID.checkOutHeader,
        content: [
            { langCode: LangCode.EN, text: 'Check Out' },
            { langCode: LangCode.FI, text: 'Kassa' },
        ],
    },
    {
        id: ContentID.checkOutLastName,
        content: [
            { langCode: LangCode.EN, text: 'Last name' },
            { langCode: LangCode.FI, text: 'Sukunimi' },
        ],
    },
    {
        id: ContentID.checkOutOrderInfo,
        content: [
            { langCode: LangCode.EN, text: 'Order Info' },
            { langCode: LangCode.FI, text: 'Tilaus' },
        ],
    },
    {
        id: ContentID.checkOutOrganization,
        content: [
            { langCode: LangCode.EN, text: 'Organization' },
            { langCode: LangCode.FI, text: 'Organisaatio' },
        ],
    },
    {
        id: ContentID.checkOutSelectCountry,
        content: [
            { langCode: LangCode.EN, text: 'Select a country...' },
            { langCode: LangCode.FI, text: 'Valitse maa...' },
        ],
    },
    {
        id: ContentID.checkOutStreetAddress,
        content: [
            { langCode: LangCode.EN, text: 'Street address' },
            { langCode: LangCode.FI, text: 'Katuosoite' },
        ],
    },
    {
        id: ContentID.checkOutZipCode,
        content: [
            { langCode: LangCode.EN, text: 'Postal code' },
            { langCode: LangCode.FI, text: 'Postinumero' },
        ],
    },
    {
        id: ContentID.contactBusinessID,
        content: [
            { langCode: LangCode.EN, text: 'Business ID' },
            { langCode: LangCode.FI, text: 'Y-tunnus' },
        ],
    },
    {
        id: ContentID.contactEmail,
        content: [
            { langCode: LangCode.EN, text: 'E-mail' },
            { langCode: LangCode.FI, text: 'Sähköposti' },
        ],
    },
    {
        id: ContentID.contactPhone,
        content: [
            { langCode: LangCode.EN, text: 'Phone' },
            { langCode: LangCode.FI, text: 'Puhelin' },
        ],
    },
    {
        id: ContentID.homeWelcome,
        content: [
            { langCode: LangCode.EN, text: 'Welcome to Webstore' },
            { langCode: LangCode.FI, text: 'Tervetuloa Verkkokauppaan' },
        ],
    },
    {
        id: ContentID.itemsAddToShoppingCart,
        content: [
            { langCode: LangCode.EN, text: 'Add to shopping cart' },
            { langCode: LangCode.FI, text: 'Lisää ostoskoriin' },
        ],
    },
    {
        id: ContentID.itemsAmount,
        content: [
            { langCode: LangCode.EN, text: 'Amount' },
            { langCode: LangCode.FI, text: 'Määrä' },
        ],
    },
    {
        id: ContentID.itemsInStock,
        content: [
            { langCode: LangCode.EN, text: 'In stock' },
            { langCode: LangCode.FI, text: 'Varastossa' },
        ],
    },
    {
        id: ContentID.itemsSoldOut,
        content: [
            { langCode: LangCode.EN, text: 'Sold out' },
            { langCode: LangCode.FI, text: 'Loppu' },
        ],
    },
    {
        id: ContentID.loginNoAccount,
        content: [
            { langCode: LangCode.EN, text: 'No account yet?' },
            { langCode: LangCode.FI, text: 'Ei vielä käyttäjätiliä?' },
        ],
    },
    {
        id: ContentID.loginPassword,
        content: [
            { langCode: LangCode.EN, text: 'Password' },
            { langCode: LangCode.FI, text: 'Salasana' },
        ],
    },
    {
        id: ContentID.loginRegisterHere,
        content: [
            { langCode: LangCode.EN, text: 'Register here.' },
            { langCode: LangCode.FI, text: 'Rekisteröidy täällä.' },
        ],
    },
    {
        id: ContentID.loginUsername,
        content: [
            { langCode: LangCode.EN, text: 'Username' },
            { langCode: LangCode.FI, text: 'Käyttäjätunnus' },
        ],
    },
    {
        id: ContentID.menuAccount,
        content: [
            { langCode: LangCode.EN, text: 'Account' },
            { langCode: LangCode.FI, text: 'Tili' },
        ],
    },
    {
        id: ContentID.menuAdmin,
        content: [
            { langCode: LangCode.EN, text: 'Admin' },
            { langCode: LangCode.FI, text: 'Ylläpitäjä' },
        ],
    },
    {
        id: ContentID.menuAdminSection,
        content: [
            { langCode: LangCode.EN, text: 'Admin' },
            { langCode: LangCode.FI, text: 'Hallintapaneeli' },
        ],
    },
    {
        id: ContentID.menuHome,
        content: [
            { langCode: LangCode.EN, text: 'Home' },
            { langCode: LangCode.FI, text: 'Etusivu' },
        ],
    },
    {
        id: ContentID.menuInfo,
        content: [
            { langCode: LangCode.EN, text: 'Info' },
            { langCode: LangCode.FI, text: 'Info' },
        ],
    },
    {
        id: ContentID.menuLogin,
        content: [
            { langCode: LangCode.EN, text: 'Login' },
            { langCode: LangCode.FI, text: 'Kirjaudu' },
        ],
    },
    {
        id: ContentID.menuLogout,
        content: [
            { langCode: LangCode.EN, text: 'Logout' },
            { langCode: LangCode.FI, text: 'Kirjaudu ulos' },
        ],
    },
    {
        id: ContentID.menuProducts,
        content: [
            { langCode: LangCode.EN, text: 'Products' },
            { langCode: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.menuShoppingCart,
        content: [
            { langCode: LangCode.EN, text: 'Shopping Cart' },
            { langCode: LangCode.FI, text: 'Ostoskori' },
        ],
    },
    {
        id: ContentID.miscDescription,
        content: [
            { langCode: LangCode.EN, text: 'Description' },
            { langCode: LangCode.FI, text: 'Kuvaus' },
        ],
    },
    {
        id: ContentID.miscMerchant,
        content: [
            { langCode: LangCode.EN, text: 'Merchant' },
            { langCode: LangCode.FI, text: 'Kauppias' },
        ],
    },
    {
        id: ContentID.miscName,
        content: [
            { langCode: LangCode.EN, text: 'Name' },
            { langCode: LangCode.FI, text: 'Nimi' },
        ],
    },
    {
        id: ContentID.notificationLoggedOut,
        content: [
            { langCode: LangCode.EN, text: 'Logged out' },
            { langCode: LangCode.FI, text: 'Kirjauduit ulos' },
        ],
    },
    {
        id: ContentID.orderCustomer,
        content: [
            { langCode: LangCode.EN, text: 'Customer' },
            { langCode: LangCode.FI, text: 'Tilaaja' },
        ],
    },
    {
        id: ContentID.orderDeliveryMethod,
        content: [
            { langCode: LangCode.EN, text: 'Delivery method' },
            { langCode: LangCode.FI, text: 'Toimitustapa' },
        ],
    },
    {
        id: ContentID.orderId,
        content: [
            { langCode: LangCode.EN, text: 'Order ID' },
            { langCode: LangCode.FI, text: 'Tilausnumero' },
        ],
    },
    {
        id: ContentID.orderItems,
        content: [
            { langCode: LangCode.EN, text: 'Items' },
            { langCode: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.orderPaymentMethod,
        content: [
            { langCode: LangCode.EN, text: 'Payment method' },
            { langCode: LangCode.FI, text: 'Maksutapa' },
        ],
    },
    {
        id: ContentID.orderStatus,
        content: [
            { langCode: LangCode.EN, text: 'Status' },
            { langCode: LangCode.FI, text: 'Tila' },
        ],
    },
    {
        id: ContentID.orderTotalAmount,
        content: [
            { langCode: LangCode.EN, text: 'Total amount' },
            { langCode: LangCode.FI, text: 'Loppusumma' },
        ],
    },
    {
        id: ContentID.statusCancelled,
        content: [
            { langCode: LangCode.EN, text: 'Cancelled' },
            { langCode: LangCode.FI, text: 'Peruttu' },
        ],
    },
    {
        id: ContentID.statusCompleted,
        content: [
            { langCode: LangCode.EN, text: 'Completed' },
            { langCode: LangCode.FI, text: 'Valmis' },
        ],
    },
    {
        id: ContentID.statusDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Delivered' },
            { langCode: LangCode.FI, text: 'Toimitettu' },
        ],
    },
    {
        id: ContentID.statusPending,
        content: [
            { langCode: LangCode.EN, text: 'Pending payment' },
            { langCode: LangCode.FI, text: 'Odottaa maksua' },
        ],
    },
    {
        id: ContentID.statusProcessing,
        content: [
            { langCode: LangCode.EN, text: 'Processing' },
            { langCode: LangCode.FI, text: 'Käsittelyssä' },
        ],
    },
    {
        id: ContentID.statusRefunded,
        content: [
            { langCode: LangCode.EN, text: 'Refunded' },
            { langCode: LangCode.FI, text: 'Hyvitetty' },
        ],
    },
    {
        id: ContentID.statusShipped,
        content: [
            { langCode: LangCode.EN, text: 'Shipped' },
            { langCode: LangCode.FI, text: 'Lähetetty' },
        ],
    },
];

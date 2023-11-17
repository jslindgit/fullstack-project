import { LangCode } from './types/language';

export enum ContentID {
    adminPanelCategories = 'ADMIN: Categories',
    adminPanelHeader = 'ADMIN: Admin Panel header',
    adminPanelImages = 'ADMIN: Images',
    adminPanelItems = 'ADMIN: Items',
    adminPanelOrders = 'ADMIN: Orders',
    adminPanelSettings = 'ADMIN: Settings',
    adminPanelUsers = 'ADMIN: Users',
    backButtonDefault = 'BACK BUTTON: Default label',
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
    miscMerchant = 'MISC: Merchant',
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
            { lang: LangCode.EN, text: '' },
            { lang: LangCode.FI, text: '' },
        ],
    },
*/

export const defaultLangContent = [
    {
        id: ContentID.adminPanelCategories,
        content: [
            { lang: LangCode.EN, text: 'Categories' },
            { lang: LangCode.FI, text: 'Kategoriat' },
        ],
    },
    {
        id: ContentID.adminPanelHeader,
        content: [
            { lang: LangCode.EN, text: 'Admin Panel' },
            { lang: LangCode.FI, text: 'Hallintapaneeli' },
        ],
    },
    {
        id: ContentID.adminPanelImages,
        content: [
            { lang: LangCode.EN, text: 'Images' },
            { lang: LangCode.FI, text: 'Kuvat' },
        ],
    },
    {
        id: ContentID.adminPanelItems,
        content: [
            { lang: LangCode.EN, text: 'Products' },
            { lang: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.adminPanelOrders,
        content: [
            { lang: LangCode.EN, text: 'Orders' },
            { lang: LangCode.FI, text: 'Tilaukset' },
        ],
    },
    {
        id: ContentID.adminPanelSettings,
        content: [
            { lang: LangCode.EN, text: 'Settings' },
            { lang: LangCode.FI, text: 'Asetukset' },
        ],
    },
    {
        id: ContentID.adminPanelUsers,
        content: [
            { lang: LangCode.EN, text: 'Users' },
            { lang: LangCode.FI, text: 'Käyttäjät' },
        ],
    },
    {
        id: ContentID.backButtonDefault,
        content: [
            { lang: LangCode.EN, text: 'Go back' },
            { lang: LangCode.FI, text: 'Takaisin' },
        ],
    },
    {
        id: ContentID.buttonCheckOut,
        content: [
            { lang: LangCode.EN, text: 'Check out' },
            { lang: LangCode.FI, text: 'Kassalle' },
        ],
    },
    {
        id: ContentID.buttonRemove,
        content: [
            { lang: LangCode.EN, text: 'Remove' },
            { lang: LangCode.FI, text: 'Poista' },
        ],
    },
    {
        id: ContentID.cartProduct,
        content: [
            { lang: LangCode.EN, text: 'Product' },
            { lang: LangCode.FI, text: 'Tuote' },
        ],
    },
    {
        id: ContentID.cartQuantity,
        content: [
            { lang: LangCode.EN, text: 'Quantity' },
            { lang: LangCode.FI, text: 'Määrä' },
        ],
    },
    {
        id: ContentID.cartSubtotal,
        content: [
            { lang: LangCode.EN, text: 'Subtotal' },
            { lang: LangCode.FI, text: 'Välisumma' },
        ],
    },
    {
        id: ContentID.cartTotalPrice,
        content: [
            { lang: LangCode.EN, text: 'Total price' },
            { lang: LangCode.FI, text: 'Yhteensä' },
        ],
    },
    {
        id: ContentID.cartUnitPrice,
        content: [
            { lang: LangCode.EN, text: 'Unit price' },
            { lang: LangCode.FI, text: 'Hinta/kpl' },
        ],
    },
    {
        id: ContentID.checkOutChooseDeliveryMethod,
        content: [
            { lang: LangCode.EN, text: 'Choose Delivery Method' },
            { lang: LangCode.FI, text: 'Valitse toimitustapa' },
        ],
    },
    {
        id: ContentID.checkOutChoosePaymentMethod,
        content: [
            { lang: LangCode.EN, text: 'Choose Payment Method' },
            { lang: LangCode.FI, text: 'Valitse maksutapa' },
        ],
    },
    {
        id: ContentID.checkOutCity,
        content: [
            { lang: LangCode.EN, text: 'City' },
            { lang: LangCode.FI, text: 'Kaupunki' },
        ],
    },
    {
        id: ContentID.checkOutCountry,
        content: [
            { lang: LangCode.EN, text: 'Country' },
            { lang: LangCode.FI, text: 'Maa' },
        ],
    },
    {
        id: ContentID.checkOutCustomerContactInformation,
        content: [
            { lang: LangCode.EN, text: 'Customer Contact Information' },
            { lang: LangCode.FI, text: 'Tilaajan yhteystiedot' },
        ],
    },
    {
        id: ContentID.checkOutFirstName,
        content: [
            { lang: LangCode.EN, text: 'First name' },
            { lang: LangCode.FI, text: 'Etunimi' },
        ],
    },
    {
        id: ContentID.checkOutHeader,
        content: [
            { lang: LangCode.EN, text: 'Check Out' },
            { lang: LangCode.FI, text: 'Kassa' },
        ],
    },
    {
        id: ContentID.checkOutLastName,
        content: [
            { lang: LangCode.EN, text: 'Last name' },
            { lang: LangCode.FI, text: 'Sukunimi' },
        ],
    },
    {
        id: ContentID.checkOutOrderInfo,
        content: [
            { lang: LangCode.EN, text: 'Order Info' },
            { lang: LangCode.FI, text: 'Tilaus' },
        ],
    },
    {
        id: ContentID.checkOutOrganization,
        content: [
            { lang: LangCode.EN, text: 'Organization' },
            { lang: LangCode.FI, text: 'Organisaatio' },
        ],
    },
    {
        id: ContentID.checkOutSelectCountry,
        content: [
            { lang: LangCode.EN, text: 'Select a country...' },
            { lang: LangCode.FI, text: 'Valitse maa...' },
        ],
    },
    {
        id: ContentID.checkOutStreetAddress,
        content: [
            { lang: LangCode.EN, text: 'Street address' },
            { lang: LangCode.FI, text: 'Katuosoite' },
        ],
    },
    {
        id: ContentID.checkOutZipCode,
        content: [
            { lang: LangCode.EN, text: 'Postal code' },
            { lang: LangCode.FI, text: 'Postinumero' },
        ],
    },
    {
        id: ContentID.contactBusinessID,
        content: [
            { lang: LangCode.EN, text: 'Business ID' },
            { lang: LangCode.FI, text: 'Y-tunnus' },
        ],
    },
    {
        id: ContentID.contactEmail,
        content: [
            { lang: LangCode.EN, text: 'E-mail' },
            { lang: LangCode.FI, text: 'Sähköposti' },
        ],
    },
    {
        id: ContentID.contactPhone,
        content: [
            { lang: LangCode.EN, text: 'Phone' },
            { lang: LangCode.FI, text: 'Puhelin' },
        ],
    },
    {
        id: ContentID.homeWelcome,
        content: [
            { lang: LangCode.EN, text: 'Welcome to Webstore' },
            { lang: LangCode.FI, text: 'Tervetuloa Verkkokauppaan' },
        ],
    },
    {
        id: ContentID.itemsAddToShoppingCart,
        content: [
            { lang: LangCode.EN, text: 'Add to shopping cart' },
            { lang: LangCode.FI, text: 'Lisää ostoskoriin' },
        ],
    },
    {
        id: ContentID.itemsAmount,
        content: [
            { lang: LangCode.EN, text: 'Amount' },
            { lang: LangCode.FI, text: 'Määrä' },
        ],
    },
    {
        id: ContentID.itemsInStock,
        content: [
            { lang: LangCode.EN, text: 'In stock' },
            { lang: LangCode.FI, text: 'Varastossa' },
        ],
    },
    {
        id: ContentID.itemsSoldOut,
        content: [
            { lang: LangCode.EN, text: 'Sold out' },
            { lang: LangCode.FI, text: 'Loppu' },
        ],
    },
    {
        id: ContentID.loginNoAccount,
        content: [
            { lang: LangCode.EN, text: 'No account yet?' },
            { lang: LangCode.FI, text: 'Ei vielä käyttäjätiliä?' },
        ],
    },
    {
        id: ContentID.loginPassword,
        content: [
            { lang: LangCode.EN, text: 'Password' },
            { lang: LangCode.FI, text: 'Salasana' },
        ],
    },
    {
        id: ContentID.loginRegisterHere,
        content: [
            { lang: LangCode.EN, text: 'Register here.' },
            { lang: LangCode.FI, text: 'Rekisteröidy täällä.' },
        ],
    },
    {
        id: ContentID.loginUsername,
        content: [
            { lang: LangCode.EN, text: 'Username' },
            { lang: LangCode.FI, text: 'Käyttäjätunnus' },
        ],
    },
    {
        id: ContentID.menuAccount,
        content: [
            { lang: LangCode.EN, text: 'Account' },
            { lang: LangCode.FI, text: 'Tili' },
        ],
    },
    {
        id: ContentID.menuAdmin,
        content: [
            { lang: LangCode.EN, text: 'Admin' },
            { lang: LangCode.FI, text: 'Ylläpitäjä' },
        ],
    },
    {
        id: ContentID.menuAdminSection,
        content: [
            { lang: LangCode.EN, text: 'Admin' },
            { lang: LangCode.FI, text: 'Hallintapaneeli' },
        ],
    },
    {
        id: ContentID.menuHome,
        content: [
            { lang: LangCode.EN, text: 'Home' },
            { lang: LangCode.FI, text: 'Etusivu' },
        ],
    },
    {
        id: ContentID.menuInfo,
        content: [
            { lang: LangCode.EN, text: 'Info' },
            { lang: LangCode.FI, text: 'Info' },
        ],
    },
    {
        id: ContentID.menuLogin,
        content: [
            { lang: LangCode.EN, text: 'Login' },
            { lang: LangCode.FI, text: 'Kirjaudu' },
        ],
    },
    {
        id: ContentID.menuLogout,
        content: [
            { lang: LangCode.EN, text: 'Logout' },
            { lang: LangCode.FI, text: 'Kirjaudu ulos' },
        ],
    },
    {
        id: ContentID.menuProducts,
        content: [
            { lang: LangCode.EN, text: 'Products' },
            { lang: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.menuShoppingCart,
        content: [
            { lang: LangCode.EN, text: 'Shopping Cart' },
            { lang: LangCode.FI, text: 'Ostoskori' },
        ],
    },
    {
        id: ContentID.miscMerchant,
        content: [
            { lang: LangCode.EN, text: 'Merchant' },
            { lang: LangCode.FI, text: 'Kauppias' },
        ],
    },
    {
        id: ContentID.notificationLoggedOut,
        content: [
            { lang: LangCode.EN, text: 'Logged out' },
            { lang: LangCode.FI, text: 'Kirjauduit ulos' },
        ],
    },
    {
        id: ContentID.orderCustomer,
        content: [
            { lang: LangCode.EN, text: 'Customer' },
            { lang: LangCode.FI, text: 'Tilaaja' },
        ],
    },
    {
        id: ContentID.orderDeliveryMethod,
        content: [
            { lang: LangCode.EN, text: 'Delivery method' },
            { lang: LangCode.FI, text: 'Toimitustapa' },
        ],
    },
    {
        id: ContentID.orderId,
        content: [
            { lang: LangCode.EN, text: 'Order ID' },
            { lang: LangCode.FI, text: 'Tilausnumero' },
        ],
    },
    {
        id: ContentID.orderItems,
        content: [
            { lang: LangCode.EN, text: 'Items' },
            { lang: LangCode.FI, text: 'Tuotteet' },
        ],
    },
    {
        id: ContentID.orderPaymentMethod,
        content: [
            { lang: LangCode.EN, text: 'Payment method' },
            { lang: LangCode.FI, text: 'Maksutapa' },
        ],
    },
    {
        id: ContentID.orderStatus,
        content: [
            { lang: LangCode.EN, text: 'Status' },
            { lang: LangCode.FI, text: 'Tila' },
        ],
    },
    {
        id: ContentID.orderTotalAmount,
        content: [
            { lang: LangCode.EN, text: 'Total amount' },
            { lang: LangCode.FI, text: 'Loppusumma' },
        ],
    },
    {
        id: ContentID.statusCancelled,
        content: [
            { lang: LangCode.EN, text: 'Cancelled' },
            { lang: LangCode.FI, text: 'Peruttu' },
        ],
    },
    {
        id: ContentID.statusCompleted,
        content: [
            { lang: LangCode.EN, text: 'Completed' },
            { lang: LangCode.FI, text: 'Valmis' },
        ],
    },
    {
        id: ContentID.statusDelivered,
        content: [
            { lang: LangCode.EN, text: 'Delivered' },
            { lang: LangCode.FI, text: 'Toimitettu' },
        ],
    },
    {
        id: ContentID.statusPending,
        content: [
            { lang: LangCode.EN, text: 'Pending payment' },
            { lang: LangCode.FI, text: 'Odottaa maksua' },
        ],
    },
    {
        id: ContentID.statusProcessing,
        content: [
            { lang: LangCode.EN, text: 'Processing' },
            { lang: LangCode.FI, text: 'Käsittelyssä' },
        ],
    },
    {
        id: ContentID.statusRefunded,
        content: [
            { lang: LangCode.EN, text: 'Refunded' },
            { lang: LangCode.FI, text: 'Hyvitetty' },
        ],
    },
    {
        id: ContentID.statusShipped,
        content: [
            { lang: LangCode.EN, text: 'Shipped' },
            { lang: LangCode.FI, text: 'Lähetetty' },
        ],
    },
];

import { LangCode } from './types/language';

export enum ContentID {
    backButtonDefault = 'BACK BUTTON: Default label',
    buttonCheckOut = 'BUTTON: Check out',
    buttonRemove = 'BUTTON: Remove',
    cartProduct = 'SHOPPING CART: Product',
    cartQuantity = 'SHOPPING CART: Quantity',
    cartSubtotal = 'SHOPPING CART: Subtotal',
    cartTotalPrice = 'SHOPPING CART: Total price',
    cartUnitPrice = 'SHOPPING CART: Unit price',
    contactBusinessID = 'CONTACT: Business ID',
    contactEmail = 'CONTACT: E-mail',
    contactPhone = 'CONTACT: Phone',
    homeWelcome = 'HOME: Welcome text',
    itemsAddToShoppingCart = 'ITEMS: "Add to shopping cart" button',
    itemsAmount = 'ITEMS: Amount (to add to shopping cart)',
    itemsInStock = 'ITEMS: In stock',
    itemsSoldOut = 'ITEMS: Sold out',
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
            { lang: LangCode.FI, text: 'Ylläpito' },
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
];

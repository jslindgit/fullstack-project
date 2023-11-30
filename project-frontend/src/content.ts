import { LangCode, LangContent } from './types/languageTypes';

export enum ContentID {
    _NONE = '',
    accountAccountInfo = 'ACCOUNT: Account Information',
    accountChangePassword = 'ACCOUNT: Change Password',
    accountContactInfo = 'ACCOUNT: Contact Information',
    accountOrderHistory = 'ACCOUNT: Order History',
    accountPasswordCurrent = 'ACCOUNT: Current Password',
    accountPasswordNew = 'ACCOUNT: New Password',
    accountPasswordNewConfirm = 'ACCOUNT: Confirm New Password',
    accountUserId = 'ACCOUNT: Customer Number',
    adminAddNewCategory = 'ADMIN: Add New Category',
    adminAddNewItem = 'ADMIN: Add New Item',
    adminEditCategory = 'ADMIN: Edit Category (header)',
    adminEditItem = 'ADMIN: Edit Item (header)',
    adminImagesAlreadyContainsFile = 'ADMIN - IMAGES: "already contains" ("<category> already contains file <filename>" confirmation)',
    adminImagesDoYouWantToOverwrite = 'ADMIN - IMAGES: Do you want to over it? (confirmation)',
    adminImagesUploadNewImageToCategory = 'ADMIN - IMAGES: Upload new image to category',
    adminItemDescription = 'ADMIN: Item Description (when editing)',
    adminItemName = 'ADMIN: Item Name (when editing)',
    adminItemSelectedImages = 'ADMIN: Selected Images (when editing)',
    adminItemsDeleteItemConfirmation = 'ADMIN - ITEMS: Delete <item name>? (confirmation)',
    adminItemsNoProducts = 'ADMIN - ITEMS: No products in this category',
    adminItemsUncategorized = 'ADMIN - ITEMS: Uncategorized (category)',
    adminItemsUncategorizedDescription = 'ADMIN - ITEMS: Uncategorized (category) description',
    adminOrdersArchived = 'ADMIN - ORDERS: Archived',
    adminOrdersNoOrders = 'ADMIN - ORDERS: No orders',
    adminOrdersProcessing = 'ADMIN - ORDERS: Processing',
    adminOrdersRecentlyDelivered = 'ADMIN - ORDERS: Recently Delivered',
    adminPanelCategories = 'ADMIN: Categories',
    adminPanelHeader = 'ADMIN: Admin Panel header',
    adminPanelImages = 'ADMIN: Images',
    adminPanelItems = 'ADMIN: Items',
    adminPanelOrders = 'ADMIN: Orders',
    adminPanelSettings = 'ADMIN: Settings',
    adminPanelUsers = 'ADMIN: Users',
    adminUserInfoHeader = 'ADMIN: User Info (header)',
    backButtonDefault = 'BACK BUTTON: Default label',
    buttonAdd = 'BUTTON: Add',
    buttonCancel = 'BUTTON: Cancel',
    buttonCheckOut = 'BUTTON: Check out',
    buttonDisable = 'BUTTON: Disable (account)',
    buttonEdit = 'BUTTON: Edit',
    buttonEditCategoryDetails = 'BUTTON: Edit details of a Category (i.e. name and description)',
    buttonEditCategoryProducts = 'BUTTON: Edit Category products',
    buttonEnable = 'BUTTON: Enable (account)',
    buttonRemove = 'BUTTON: Remove',
    buttonSave = 'BUTTON: Save',
    buttonShowInfo = 'BUTTON: Show Info',
    buttonSubmit = 'BUTTON: Submit',
    buttonUpload = 'BUTTON: Upload',
    cartIsEmpty = 'SHOPPING CART: Shopping Cart is empty.',
    cartProduct = 'SHOPPING CART: Product',
    cartQuantity = 'SHOPPING CART: Quantity',
    cartSubtotal = 'SHOPPING CART: Subtotal',
    cartTotalPrice = 'SHOPPING CART: Total price',
    cartUnitPrice = 'SHOPPING CART: Unit price',
    checkOutChooseDeliveryMethod = 'CHECK OUT: Choose Delivery Method (header)',
    checkOutChoosePaymentMethod = 'CHECK OUT: Choose Payment Methdod (button)',
    checkOutCity = 'CHECK OUT: City',
    checkOutCountry = 'CHECK OUT: Country',
    checkOutCountryIsRequired = 'CHECK OUT: Country is required (validation error)',
    checkOutCustomerContactInformation = 'CHECK OUT: Customer Contact Information (header)',
    checkOutFirstName = 'CHECK OUT: First name',
    checkOutHeader = 'CHECK OUT: Header',
    checkOutIsRequired = 'CHECK OUT: <some information> is required (validation error)',
    checkOutLastName = 'CHECK OUT: Last name',
    checkOutOptional = 'CHECK OUT: optional (information field)',
    checkOutOrderInfo = 'CHECK OUT: Order Info (header)',
    checkOutOrganization = 'CHECK OUT: Organization',
    checkOutSelectCountry = 'CHECK OUT: Select a country',
    checkOutStreetAddress = 'CHECK OUT: Street address',
    checkOutZipCode = 'CHECK OUT: Zipcode',
    contactBusinessID = 'CONTACT: Business ID',
    contactEmail = 'CONTACT: E-mail',
    contactPhone = 'CONTACT: Phone',
    errorInvalidEmailAddress = 'ERROR: Invalid e-mail address',
    errorSomethingWentWrong = 'ERROR: Something went wrong',
    errorSomethingWentWrongTryAgainlater = 'ERROR: Something went wrong, please try again later',
    homeWelcome = 'HOME: Welcome text',
    itemsAddToShoppingCart = 'ITEMS: "Add to shopping cart" button',
    itemsAmount = 'ITEMS: Amount (to add to shopping cart)',
    itemsCategory = 'ITEMS: Category',
    itemsId = 'ITEMS: Item ID',
    itemsInStock = 'ITEMS: In stock',
    itemsItem = 'ITEMS: Item',
    itemsNoItemsInCategory = 'ITEMS: "No items in this category."',
    itemsPcs = 'ITEMS: pcs',
    itemsPrice = 'ITEMS: Price',
    itemsSoldOut = 'ITEMS: Sold out',
    loginInvalidUsernameOrPassword = 'LOGIN: Invalid username or password',
    loginLoggedInAs = 'LOGIN: Logged in as...',
    loginNewPasswordMisMatch = 'LOGIN: Please check the new password',
    loginNewPasswordTooShort = 'LOGIN: Password should be atleast x characters long',
    loginNoAccount = 'LOGIN: No account yet?',
    loginPassword = 'LOGIN: Password:',
    loginPasswordChangedSuccessfully = 'LOGIN: Password changed successfully.',
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
    miscDate = 'MISC: Date',
    miscDescription = 'MISC: Description',
    miscMerchant = 'MISC: Merchant',
    miscName = 'MISC: Name',
    miscRecycleBin = 'MISC: Recycle Bin',
    notificationLoggedOut = 'NOTIFICATION: Logged out',
    orderCustomer = 'ORDER: Customer',
    orderDeliveryMethod = 'ORDER: Delivery Method',
    orderId = 'ORDER: Order ID',
    orderItems = 'ORDER: Items',
    orderPaymentMethod = 'ORDER: Payment method',
    orderStatus = 'ORDER: Status',
    orderTotalAmount = 'ORDER: Total Amount',
    registerHeader = 'REGISTER: header',
    registerSuccess = 'REGISTER: Registration successful',
    statusCancelled = 'ORDER STATUS: Cancelled',
    statusCompleted = 'ORDER STATUS: Completed',
    statusDelivered = 'ORDER STATUS: Delivered',
    statusOnHold = 'ORDER STATUS: On hold',
    statusPending = 'ORDER STATUS: Pending',
    statusProcessing = 'ORDER STATUS: Processing',
    statusRefunded = 'ORDER STATUS: Refunded',
    statusShipped = 'ORDER STATUS: Shipped',
    userDisabled = 'USER: Disabled (banned)',
    userStatusCustomer = 'USER - STATUS: Customer',
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
        id: ContentID.accountAccountInfo,
        content: [
            { langCode: LangCode.EN, text: 'Basic Information' },
            { langCode: LangCode.FI, text: 'Perustiedot' },
        ],
    },
    {
        id: ContentID.accountChangePassword,
        content: [
            { langCode: LangCode.EN, text: 'Change password' },
            { langCode: LangCode.FI, text: 'Vaihda salasana' },
        ],
    },
    {
        id: ContentID.accountContactInfo,
        content: [
            { langCode: LangCode.EN, text: 'Contact Information' },
            { langCode: LangCode.FI, text: 'Yhteystiedot' },
        ],
    },
    {
        id: ContentID.accountOrderHistory,
        content: [
            { langCode: LangCode.EN, text: 'Order History' },
            { langCode: LangCode.FI, text: 'Tilaushistoria' },
        ],
    },
    {
        id: ContentID.accountPasswordCurrent,
        content: [
            { langCode: LangCode.EN, text: 'Current Password' },
            { langCode: LangCode.FI, text: 'Nykyinen salasana' },
        ],
    },
    {
        id: ContentID.accountPasswordNew,
        content: [
            { langCode: LangCode.EN, text: 'New Password' },
            { langCode: LangCode.FI, text: 'Uusi salasana' },
        ],
    },
    {
        id: ContentID.accountPasswordNewConfirm,
        content: [
            { langCode: LangCode.EN, text: 'Confirm New Password' },
            { langCode: LangCode.FI, text: 'Vahvista uusi salasana' },
        ],
    },
    {
        id: ContentID.accountUserId,
        content: [
            { langCode: LangCode.EN, text: 'Customer Number' },
            { langCode: LangCode.FI, text: 'Asiakasnumero' },
        ],
    },
    {
        id: ContentID.adminAddNewCategory,
        content: [
            { langCode: LangCode.EN, text: 'Add New Category' },
            { langCode: LangCode.FI, text: 'Uusi kategoria' },
        ],
    },
    {
        id: ContentID.adminAddNewItem,
        content: [
            { langCode: LangCode.EN, text: 'Add New Item' },
            { langCode: LangCode.FI, text: 'Uusi tuote' },
        ],
    },
    {
        id: ContentID.adminEditCategory,
        content: [
            { langCode: LangCode.EN, text: 'Edit Category' },
            { langCode: LangCode.FI, text: 'Muokkaa kategoriaa' },
        ],
    },
    {
        id: ContentID.adminEditItem,
        content: [
            { langCode: LangCode.EN, text: 'Edit Item' },
            { langCode: LangCode.FI, text: 'Muokkaa tuotetta' },
        ],
    },
    {
        id: ContentID.adminImagesAlreadyContainsFile,
        content: [
            { langCode: LangCode.EN, text: 'already contains file' },
            { langCode: LangCode.FI, text: 'sisältää jo tiedoston' },
        ],
    },
    {
        id: ContentID.adminImagesDoYouWantToOverwrite,
        content: [
            { langCode: LangCode.EN, text: 'Do you want to overwrite it?' },
            { langCode: LangCode.FI, text: 'Korvataanko se?' },
        ],
    },
    {
        id: ContentID.adminImagesUploadNewImageToCategory,
        content: [
            { langCode: LangCode.EN, text: 'Upload new image to category' },
            { langCode: LangCode.FI, text: 'Lataa uusi kuva kategoriaan' },
        ],
    },
    {
        id: ContentID.adminItemDescription,
        content: [
            { langCode: LangCode.EN, text: 'Item Description' },
            { langCode: LangCode.FI, text: 'Tuotteen kuvaus' },
        ],
    },
    {
        id: ContentID.adminItemName,
        content: [
            { langCode: LangCode.EN, text: 'Item Name' },
            { langCode: LangCode.FI, text: 'Tuotteen nimi' },
        ],
    },
    {
        id: ContentID.adminItemSelectedImages,
        content: [
            { langCode: LangCode.EN, text: 'Selected Images' },
            { langCode: LangCode.FI, text: 'Valitut kuvat' },
        ],
    },
    {
        id: ContentID.adminItemsDeleteItemConfirmation,
        content: [
            { langCode: LangCode.EN, text: 'Delete' },
            { langCode: LangCode.FI, text: 'Poistetaanko' },
        ],
    },
    {
        id: ContentID.adminItemsNoProducts,
        content: [
            { langCode: LangCode.EN, text: 'No items in this category.' },
            { langCode: LangCode.FI, text: 'Tässä kategoriassa ei ole tuotteita.' },
        ],
    },
    {
        id: ContentID.adminItemsUncategorized,
        content: [
            { langCode: LangCode.EN, text: 'Uncategorized' },
            { langCode: LangCode.FI, text: 'Kategorisoimattomat' },
        ],
    },
    {
        id: ContentID.adminItemsUncategorizedDescription,
        content: [
            { langCode: LangCode.EN, text: 'Items that do not currently belong to any category.' },
            { langCode: LangCode.FI, text: 'Tuotteet jotka eivät tällä hetkellä kuulu mihinkään tuotekategoriaan.' },
        ],
    },
    {
        id: ContentID.adminOrdersArchived,
        content: [
            { langCode: LangCode.EN, text: 'Archived' },
            { langCode: LangCode.FI, text: 'Arkistoidut' },
        ],
    },
    {
        id: ContentID.adminOrdersNoOrders,
        content: [
            { langCode: LangCode.EN, text: 'No orders' },
            { langCode: LangCode.FI, text: 'Ei tilauksia' },
        ],
    },
    {
        id: ContentID.adminOrdersProcessing,
        content: [
            { langCode: LangCode.EN, text: 'Processing' },
            { langCode: LangCode.FI, text: 'Käsittelyssä' },
        ],
    },
    {
        id: ContentID.adminOrdersRecentlyDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Recently Delivered' },
            { langCode: LangCode.FI, text: 'Hiljattain toimitetut' },
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
        id: ContentID.adminUserInfoHeader,
        content: [
            { langCode: LangCode.EN, text: 'User Info' },
            { langCode: LangCode.FI, text: 'Käyttäjän tiedot' },
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
        id: ContentID.buttonCancel,
        content: [
            { langCode: LangCode.EN, text: 'Cancel' },
            { langCode: LangCode.FI, text: 'Peruuta' },
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
        id: ContentID.buttonDisable,
        content: [
            { langCode: LangCode.EN, text: 'Suspend' },
            { langCode: LangCode.FI, text: 'Jäädytä' },
        ],
    },
    {
        id: ContentID.buttonEdit,
        content: [
            { langCode: LangCode.EN, text: 'Edit' },
            { langCode: LangCode.FI, text: 'Muokkaa' },
        ],
    },
    {
        id: ContentID.buttonEditCategoryDetails,
        content: [
            { langCode: LangCode.EN, text: 'Edit\nDetails' },
            { langCode: LangCode.FI, text: 'Muokkaa\nperustietoja' },
        ],
    },
    {
        id: ContentID.buttonEditCategoryProducts,
        content: [
            { langCode: LangCode.EN, text: 'Edit\nProducts' },
            { langCode: LangCode.FI, text: 'Muokkaa\ntuotteita' },
        ],
    },
    {
        id: ContentID.buttonEnable,
        content: [
            { langCode: LangCode.EN, text: 'Enable' },
            { langCode: LangCode.FI, text: 'Palauta' },
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
        id: ContentID.buttonSave,
        content: [
            { langCode: LangCode.EN, text: 'Save' },
            { langCode: LangCode.FI, text: 'Tallenna' },
        ],
    },
    {
        id: ContentID.buttonShowInfo,
        content: [
            { langCode: LangCode.EN, text: 'Info' },
            { langCode: LangCode.FI, text: 'Tiedot' },
        ],
    },
    {
        id: ContentID.buttonSubmit,
        content: [
            { langCode: LangCode.EN, text: 'Submit' },
            { langCode: LangCode.FI, text: 'Lähetä' },
        ],
    },
    {
        id: ContentID.buttonUpload,
        content: [
            { langCode: LangCode.EN, text: 'Upload' },
            { langCode: LangCode.FI, text: 'Lataa' },
        ],
    },
    {
        id: ContentID.cartIsEmpty,
        content: [
            { langCode: LangCode.EN, text: 'Shopping Cart is empty.' },
            { langCode: LangCode.FI, text: 'Ostoskorisi on tyhjä.' },
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
        id: ContentID.checkOutCountryIsRequired,
        content: [
            { langCode: LangCode.EN, text: 'Country is required' },
            { langCode: LangCode.FI, text: 'Maa tulee valita' },
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
        id: ContentID.checkOutIsRequired,
        content: [
            { langCode: LangCode.EN, text: 'is required' },
            { langCode: LangCode.FI, text: 'tulee täyttää' },
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
        id: ContentID.checkOutOptional,
        content: [
            { langCode: LangCode.EN, text: 'optional' },
            { langCode: LangCode.FI, text: 'valinnainen' },
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
        id: ContentID.errorInvalidEmailAddress,
        content: [
            { langCode: LangCode.EN, text: 'Invalid e-mail address' },
            { langCode: LangCode.FI, text: 'Virheellien sähköpostiosoite' },
        ],
    },
    {
        id: ContentID.errorSomethingWentWrong,
        content: [
            { langCode: LangCode.EN, text: 'Something went wrong' },
            { langCode: LangCode.FI, text: 'Jotain meni vikaan' },
        ],
    },
    {
        id: ContentID.errorSomethingWentWrongTryAgainlater,
        content: [
            { langCode: LangCode.EN, text: 'Something went wrong, please try again later' },
            { langCode: LangCode.FI, text: 'Jotain meni vikaan, yritä myöhemmin uudelleen' },
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
        id: ContentID.itemsCategory,
        content: [
            { langCode: LangCode.EN, text: 'Category' },
            { langCode: LangCode.FI, text: 'Kategoria' },
        ],
    },
    {
        id: ContentID.itemsId,
        content: [
            { langCode: LangCode.EN, text: 'Item ID' },
            { langCode: LangCode.FI, text: 'Tuotetunnus' },
        ],
    },
    {
        id: ContentID.itemsItem,
        content: [
            { langCode: LangCode.EN, text: 'Item' },
            { langCode: LangCode.FI, text: 'Tuote' },
        ],
    },
    {
        id: ContentID.itemsPcs,
        content: [
            { langCode: LangCode.EN, text: 'pcs' },
            { langCode: LangCode.FI, text: 'kpl' },
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
        id: ContentID.itemsNoItemsInCategory,
        content: [
            { langCode: LangCode.EN, text: 'It seems there are no products in this category yet.' },
            { langCode: LangCode.FI, text: 'Tässä kategoriassa ei näyttäisi vielä olevan tuotteita.' },
        ],
    },
    {
        id: ContentID.itemsPrice,
        content: [
            { langCode: LangCode.EN, text: 'Price' },
            { langCode: LangCode.FI, text: 'Hinta' },
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
        id: ContentID.loginInvalidUsernameOrPassword,
        content: [
            { langCode: LangCode.EN, text: 'Invalid username or password' },
            { langCode: LangCode.FI, text: 'Virheellinen käyttäjätunnus tai salasana' },
        ],
    },
    {
        id: ContentID.loginLoggedInAs,
        content: [
            { langCode: LangCode.EN, text: 'Logged in as' },
            { langCode: LangCode.FI, text: 'Kirjauduit sisään tunnuksella' },
        ],
    },
    {
        id: ContentID.loginNewPasswordMisMatch,
        content: [
            { langCode: LangCode.EN, text: 'New password does not match with the confirmation' },
            { langCode: LangCode.FI, text: 'Uusi salasana ei täsmää varmenteen kanssa' },
        ],
    },
    {
        id: ContentID.loginNewPasswordTooShort,
        content: [
            { langCode: LangCode.EN, text: 'Password should be atleast 10 characters long' },
            { langCode: LangCode.FI, text: 'Salasanen tulee olla vähintään 10 merkkiä pitkä' },
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
        id: ContentID.loginPasswordChangedSuccessfully,
        content: [
            { langCode: LangCode.EN, text: 'Password changed successfully' },
            { langCode: LangCode.FI, text: 'Salasanan vaihto onnistui' },
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
        id: ContentID.miscDate,
        content: [
            { langCode: LangCode.EN, text: 'Date' },
            { langCode: LangCode.FI, text: 'Pvm' },
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
        id: ContentID.miscRecycleBin,
        content: [
            { langCode: LangCode.EN, text: 'Recycle Bin' },
            { langCode: LangCode.FI, text: 'Roskakori' },
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
        id: ContentID.registerHeader,
        content: [
            { langCode: LangCode.EN, text: 'Register' },
            { langCode: LangCode.FI, text: 'Rekisteröidy' },
        ],
    },
    {
        id: ContentID.registerSuccess,
        content: [
            { langCode: LangCode.EN, text: 'Registered as' },
            { langCode: LangCode.FI, text: 'Rekisteröidyit käyttäjätunnuksella' },
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
    {
        id: ContentID.userDisabled,
        content: [
            { langCode: LangCode.EN, text: 'Account suspended' },
            { langCode: LangCode.FI, text: 'Tili jäädytetty' },
        ],
    },
    {
        id: ContentID.userStatusCustomer,
        content: [
            { langCode: LangCode.EN, text: 'Customer' },
            { langCode: LangCode.FI, text: 'Asiakas' },
        ],
    },
];

import { LangCode, LangContent } from './types/languageTypes';

export enum ContentID {
    _NONE = '',
    accountAccountInfo = 'ACCOUNT: Account Information',
    accountChangePassword = 'ACCOUNT: Change Password',
    accountContactInfo = 'ACCOUNT: Contact Information',
    accountDeleteAccount = 'ACCOUNT: Delete Account',
    accountDeleteAccountConfirm = 'ACCOUNT: Delete Account confirmation',
    accountOrderHistory = 'ACCOUNT: Order History',
    accountPasswordCurrent = 'ACCOUNT: Current Password',
    accountPasswordNew = 'ACCOUNT: New Password',
    accountPasswordNewConfirm = 'ACCOUNT: Confirm New Password',
    accountUserId = 'ACCOUNT: Customer Number',
    adminAddNewCategory = 'ADMIN: Add New Category',
    adminAddNewItem = 'ADMIN: Add New Item',
    adminDeleteCategory = 'ADMIN: Delete category <category name>? (confirmation)',
    adminEditCategory = 'ADMIN: Edit Category (header)',
    adminEditItem = 'ADMIN: Edit Item (header)',
    adminItemAddNewImage = 'ADMIN - ITEM EDIT: Add New Image',
    adminItemAddNewSize = 'ADMIN - ITEM EDIT: Add New Size (button)',
    adminItemDescription = 'ADMIN - ITEM EDIT: Item Description',
    adminItemImageAlreadyAdded = 'ADMIN - ITEM EDIT: Image already added for this item',
    adminItemName = 'ADMIN - ITEM EDIT: Item Name',
    adminItemNewItem = 'ADMIN - ITEM EDIT: (Edited Item:) New Item',
    adminItemNoImages = 'ADMIN - ITEM EDIT: No Images',
    adminItemOneSize = 'ADMIN - ITEM EDIT: One size (no size options)',
    adminItemSizes = 'ADMIN - ITEM EDIT: Sizes',
    adminItemToEdit = 'ADMIN - ITEM EDIT: Edited Item: (<Item name>/New Item)',
    adminItemUrlToImage = 'ADMIN - ITEM EDIT: URL to new image',
    adminItemsDeleteItemConfirmation = 'ADMIN - ITEMS: Delete item <item name>? (confirmation)',
    adminItemsNewItemAdded = 'ADMIN - ITEMS: New Item Added',
    adminItemsNoProducts = 'ADMIN - ITEMS: No products in this category',
    adminItemsUncategorized = 'ADMIN - ITEMS: Uncategorized (category)',
    adminItemsUncategorizedDescription = 'ADMIN - ITEMS: Uncategorized (category) description',
    adminOrdersCopiedToClipboard = 'ADMIN - ORDERS: <contact info> copied to clipboard',
    adminOrdersDeleteOrder = 'ADMIN - ORDERS: Delete order <number>? (confirmation)',
    adminOrdersDeleteOrderButton = 'ADMIN - ORDERS: Delete Order (button)',
    adminOrdersDelivered = 'ADMIN - ORDERS: Delivered',
    adminOrdersDeliveredDate = 'ADMIN - ORDERS: Delivered (date)',
    adminOrdersMarkAsDelivered = 'ADMIN - ORDERS: Mark as Delivered',
    adminOrdersMarkAsNotDelivered = 'ADMIN - ORDERS: Mark as Not Delivered',
    adminOrdersMoveBackFromRecycleBin = 'ADMIN - ORDERS: Move Back from Recycle Bin',
    adminOrdersMoveToRecycleBin = 'ADMIN - ORDERS: Move to Recycle Bin',
    adminOrdersNoOrders = 'ADMIN - ORDERS: No orders',
    adminOrdersNoOrdersInFolder = 'ADMIN - ORDERS: No orders in folder <foldername>',
    adminOrdersOrderWasMovedToFolder = 'ADMIN - ORDERS: <Order> was moved to folder (notification)',
    adminOrdersPrintedOut = 'ADMIN - ORDERS: Printed Out',
    adminOrdersPrintOrder = 'ADMIN - ORDERS: Print Order',
    adminOrdersProcessing = 'ADMIN - ORDERS: Processing',
    adminPanelCategories = 'ADMIN: Categories',
    adminPanelHeader = 'ADMIN: Admin Panel header',
    adminPanelImages = 'ADMIN: Images',
    adminPanelItems = 'ADMIN: Items',
    adminPanelOrders = 'ADMIN: Orders',
    adminPanelSettings = 'ADMIN: Settings',
    adminPanelUsers = 'ADMIN: Users',
    adminUserInfoChangeStatus = 'ADMIN - USER INFO: Change Status (button)',
    adminUserInfoDeleteAccount = 'ADMIN - USER INFO: Delete account? (confirmation)',
    adminUserInfoDeleteAccountButton = 'ADMIN - USER INFO: Delete Account (button)',
    adminUserInfoDisableAccount = 'ADMIN - USER INFO: Disable account? (confirmation)',
    adminUserInfoDisableAccountButton = 'ADMIN - USER INFO: Disable Account (button)',
    adminUserInfoEnableAccount = 'ADMIN - USER INFO: Enable account? (confirmation)',
    adminUserInfoEnableAccountButton = 'ADMIN - USER INFO: Enable Account (button)',
    adminUserInfoHeader = 'ADMIN - USER INFO: header',
    adminUserInfoSendMessage = 'ADMIN - USER INFO: Send Message (button)',
    adminYouCanOnlyDeleteItemsAddedByYou = 'ADMIN: You can only delete items you have added.',
    adminYouCanOnlyDeleteCategoriesAddedByYou = 'ADMIN - CATEGORIES: You can only delete categories you have added.',
    adminYouCanOnlyEditCategoriesAddedByYou = 'ADMIN - CATEGORIES: You can only edit categories you have added.',
    adminYouCanOnlyEditItemsAddedByYou = 'ADMIN: You can only edit items you have added.',
    backButtonDefault = 'BACK BUTTON: Default label',
    buttonAdd = 'BUTTON: Add',
    buttonAddItemToCategory = 'BUTTON: Add Item to Category <category name>',
    buttonCancel = 'BUTTON: Cancel',
    buttonCheckOut = 'BUTTON: Check out',
    buttonClear = 'BUTTON: Clear',
    buttonClose = 'BUTTON: Close',
    buttonDisable = 'BUTTON: Disable (account)',
    buttonEdit = 'BUTTON: Edit',
    buttonEditCategoryDetails = 'BUTTON: Edit details of a Category (i.e. name and description)',
    buttonEditCategoryProducts = 'BUTTON: Edit Category products',
    buttonEnable = 'BUTTON: Enable (account)',
    buttonOpen = 'BUTTON: Open',
    buttonRemove = 'BUTTON: Remove',
    buttonRestore = 'BUTTON: Restore',
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
    checkOutAbortPayment = 'CHECK OUT: Abort Payment (button)',
    checkOutBackToShop = 'CHECK OUT: Back to Shop (button)',
    checkOutChooseDeliveryMethod = 'CHECK OUT: Choose Delivery Method (header)',
    checkOutChoosePaymentMethod = 'CHECK OUT: Choose Payment Methdod (button)',
    checkoutChoosePickupLocation = 'CHECK OUT: Choose pickup location',
    checkOutCity = 'CHECK OUT: City',
    checkOutCountry = 'CHECK OUT: Country',
    checkOutCountryIsRequired = 'CHECK OUT: Country is required (validation error)',
    checkOutCustomerContactInformation = 'CHECK OUT: Customer Contact Information (header)',
    checkOutDataPrivacyNotice = 'CHECK OUT: Data Privacy Notice',
    checkOutEnterZipcode = 'CHECK OUT: Enter zipcode (pick-up location selection)',
    checkOutFillAutomatically = 'CHECK OUT: Fill automatically',
    checkOutFirstName = 'CHECK OUT: First name',
    checkOutHeader = 'CHECK OUT: Header',
    checkOutInvalidEmail = 'CHECK OUT: Invalid e-mail address',
    checkOutIsRequired = 'CHECK OUT: <some information> is required (validation error)',
    checkOutLastName = 'CHECK OUT: Last name',
    checkOutOptional = 'CHECK OUT: optional (information field)',
    checkOutOrderInfo = 'CHECK OUT: Order Info (header)',
    checkOutOrganization = 'CHECK OUT: Organization',
    checkOutPayee = 'CHECK OUT: Payee',
    checkOutPaymentDetails = 'CHECK Out: Payment Details',
    checkOutPleaseCheck = 'CHECK OUT: Please check the following (lacking information)',
    checkOutSafetyInformation = 'CHECK OUT: Safety Information',
    checkOutSelectCountry = 'CHECK OUT: Select a country',
    checkOutErrorWhenFetchingOrder = 'CHECK OUT: Invalid order. (error)',
    checkOutErrorSignatureMismatch = 'CHECK OUT: Signature mismatch. (error)',
    checkOutStreetAddress = 'CHECK OUT: Street address',
    checkOutThankYou = 'CHECK OUT: Thank you!',
    checkOutYourOrderHasBeenReceive = 'CHECK OUT: Your order has been received... etc',
    checkOutZipCode = 'CHECK OUT: Zipcode',
    contactBusinessID = 'CONTACT: Business ID',
    contactEmail = 'CONTACT: E-mail',
    contactPhone = 'CONTACT: Phone',
    contentStoreDescription = 'CONTENT: Store description',
    contentWelcome = 'CONTENT: Welcome',
    errorInvalidEmailAddress = 'ERROR: Invalid e-mail address',
    errorOccurred = 'ERROR: Error occurred',
    errorSomethingWentWrong = 'ERROR: Something went wrong',
    errorSomethingWentWrongTryAgainlater = 'ERROR: Something went wrong, please try again later',
    errorThisOperationRequiresAdminRights = 'This operation requires Admin rights.',
    itemsAddedToShoppingCart1 = 'ITEMS: "<item(s)> added to (shopping cart)" (notification)',
    itemsAddedToShoppingCart2 = 'ITEMS: "<item(s)> (added to) shopping cart" (notification)',
    itemsAddToShoppingCart = 'ITEMS: "Add to shopping cart" button',
    itemsAllCategories = 'ITEMS: All Categories (header)',
    itemsAmount = 'ITEMS: Amount (to add to shopping cart)',
    itemsCategory = 'ITEMS: Category',
    itemsFitsInLetter = 'ITEMS: How many fit in a letter',
    itemsId = 'ITEMS: Item ID',
    itemsInStock = 'ITEMS: In stock',
    itemsItem = 'ITEMS: Item',
    itemsLatestItems = 'ITEMS: Latest Items',
    itemsMaximumAmountOfItemAlreadyInShoppingCart1 = 'ITEMS: Maximum amount of (<item> already in Shopping Cart)',
    itemsMaximumAmountOfItemAlreadyInShoppingCart2 = 'ITEMS: (Maximum amount of <item>) already in Shopping Cart)',
    itemsNoItemsInCategory = 'ITEMS: "No items in this category."',
    itemsPcs = 'ITEMS: pcs',
    itemsPrice = 'ITEMS: Price',
    itemsSelectSize = 'ITEMS: Select size',
    itemsSize = 'ITEMS: Size',
    itemsSoldOut = 'ITEMS: Sold out',
    itemsTopSellers = 'ITEMS: Top Sellers',
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
    menuAdminSection = 'MENU: Admin (section)',
    menuHome = 'MENU: Home',
    menuInfo = 'MENU: Info',
    menuLogin = 'MENU: Login',
    menuLogout = 'MENU: Log out',
    menuProducts = 'MENU: Products',
    menuShoppingCart = 'MENU: Shopping Cart',
    misc404 = 'MISC: 404',
    miscAddress = 'MISC: Address',
    miscChange = 'MISC: Change',
    miscClickToChangeSortingOrder = 'MISC: Click to change sorting order',
    miscClickToSortByThis = 'MISC: Click to sort by this (column)',
    miscContent = 'MISC: Content',
    miscCopy = 'MISC: Copy',
    miscCurrent = 'MISC: Current',
    // prettier-ignore
    miscCustomers = 'MISC: Customer\'s',
    miscDate = 'MISC: Date',
    miscDays = 'MISC: days',
    miscDeleted = 'MISC: <item/category/etc> deleted',
    miscDeliveryCountries = 'MISC: Delivery Countries',
    miscDeliveryTime = 'MISC: Delivery time',
    miscDescription = 'MISC: Description',
    miscIs = 'MISC: is',
    miscLoading = 'MISC: Loading',
    miscLoggedInAs = 'MISC: You are logged in as...',
    miscMerchant = 'MISC: Merchant',
    miscName = 'MISC: Name',
    miscNet = 'MISC: NET (price without VAT)',
    miscNo = 'MISC: No',
    miscOr = 'MISC: or',
    miscOrder = 'MISC: Order',
    miscRecycleBin = 'MISC: Recycle Bin',
    miscSearch = 'MISC: Search',
    miscUnfortunatelly = 'MISC: unfortunatelly',
    miscUpdated = 'MISC: Updated',
    miscVAT = 'MISC: VAT (tax)',
    miscWebstore = 'MISC: Webstore',
    miscWithSearchWords = 'MISC: (No hits) with searchwords <search>',
    notificationLoggedOut = 'NOTIFICATION: Logged out',
    orderCustomer = 'ORDER: Customer',
    orderDeliveryCost = 'ORDER: Delivery Cost',
    orderDeliveryMethod = 'ORDER: Delivery Method',
    orderId = 'ORDER: Order ID',
    orderItems = 'ORDER: Items',
    orderPaymentMethod = 'ORDER: Payment method',
    orderStatus = 'ORDER: Status',
    orderStatusForAdminDelivered = 'ORDER STATUS FOR ADMIN: Delivered',
    orderStatusForAdminNew = 'ORDER STATUS FOR ADMIN: New',
    orderStatusForAdminPrinted = 'ORDER STATUS FOR ADMIN: Printed out',
    orderStatusForAdminRead = 'ORDER STATUS FOR ADMIN: Read',
    orderStatusForAdminRecycled = 'ORDER STATUS FOR ADMIN: Recycled (move to Recycle Bin)',
    orderTotalAmount = 'ORDER: Total Amount',
    registerHeader = 'REGISTER: header',
    registerPasswordConfirm = 'REGISTER: Confirm Password',
    registerSuccess = 'REGISTER: Registration successful',
    searchHits = 'SEARCH: <number> hits',
    // prettier-ignore
    searchItemsName = 'SEARCH: Search with item\'s name (placeholder for search field)',
    searchNoResults = 'SEARCH: No results with <search query>"',
    statusCancelled = 'ORDER STATUS: Cancelled',
    statusCompleted = 'ORDER STATUS: Completed',
    statusDelivered = 'ORDER STATUS: Delivered',
    statusOnHold = 'ORDER STATUS: On hold',
    statusPending = 'ORDER STATUS: Pending',
    statusProcessing = 'ORDER STATUS: Processing',
    statusRefunded = 'ORDER STATUS: Refunded',
    user = 'USER: User',
    userDisabled = 'USER: Disabled (banned)',
    userRegisteredDate = 'USER: Registered (date)',
    userStatusAdmin = 'USER - STATUS: Admin',
    userStatusCustomer = 'USER - STATUS: Customer',
    userStatusHeader = 'USER: Status (e.g. Admin)',
    userStatusOperator = 'USER - STATUS: Operator',
    userUpdated = 'USER: Account Updated (notification)',
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
        id: ContentID.accountDeleteAccount,
        content: [
            { langCode: LangCode.EN, text: 'Delete account' },
            { langCode: LangCode.FI, text: 'Poista käyttäjätili' },
        ],
    },
    {
        id: ContentID.accountDeleteAccountConfirm,
        content: [
            { langCode: LangCode.EN, text: 'Are you sure you want to delete your account?\r\n\r\nEnter your password to confirm:' },
            { langCode: LangCode.FI, text: 'Haluatko varmasti poistaa käyttäjätilisi?\r\n\r\nSyötä salasanasi vahvistaaksesi:' },
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
            { langCode: LangCode.FI, text: 'Lisää uusi tuote' },
        ],
    },
    {
        id: ContentID.adminDeleteCategory,
        content: [
            { langCode: LangCode.EN, text: 'Delete cateogry' },
            { langCode: LangCode.FI, text: 'Poistataanko kategoria' },
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
        id: ContentID.adminItemAddNewImage,
        content: [
            { langCode: LangCode.EN, text: 'Add New Image' },
            { langCode: LangCode.FI, text: 'Lisää uusi kuva' },
        ],
    },
    {
        id: ContentID.adminItemAddNewSize,
        content: [
            { langCode: LangCode.EN, text: 'Add new size' },
            { langCode: LangCode.FI, text: 'Lisää uusi koko' },
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
        id: ContentID.adminItemImageAlreadyAdded,
        content: [
            { langCode: LangCode.EN, text: 'This image has already been added for this item.' },
            { langCode: LangCode.FI, text: 'Tämä kuva on jo lisätty tuotteelle.' },
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
        id: ContentID.adminItemNewItem,
        content: [
            { langCode: LangCode.EN, text: 'New Item' },
            { langCode: LangCode.FI, text: 'Uusi tuote' },
        ],
    },
    {
        id: ContentID.adminItemNoImages,
        content: [
            { langCode: LangCode.EN, text: 'No images' },
            { langCode: LangCode.FI, text: 'Ei kuvia' },
        ],
    },
    {
        id: ContentID.adminItemOneSize,
        content: [
            { langCode: LangCode.EN, text: 'One size' },
            { langCode: LangCode.FI, text: 'Yksi koko' },
        ],
    },
    {
        id: ContentID.adminItemSizes,
        content: [
            { langCode: LangCode.EN, text: 'Sizes' },
            { langCode: LangCode.FI, text: 'Koot' },
        ],
    },
    {
        id: ContentID.adminItemToEdit,
        content: [
            { langCode: LangCode.EN, text: 'Edited Item' },
            { langCode: LangCode.FI, text: 'Muokattava tuote' },
        ],
    },
    {
        id: ContentID.adminItemUrlToImage,
        content: [
            { langCode: LangCode.EN, text: 'URL to image...' },
            { langCode: LangCode.FI, text: 'Kuvan osoite...' },
        ],
    },
    {
        id: ContentID.adminItemsDeleteItemConfirmation,
        content: [
            { langCode: LangCode.EN, text: 'Delete item' },
            { langCode: LangCode.FI, text: 'Poistetaanko tuote' },
        ],
    },
    {
        id: ContentID.adminItemsNewItemAdded,
        content: [
            { langCode: LangCode.EN, text: 'New item added' },
            { langCode: LangCode.FI, text: 'Uusi tuote lisättiin' },
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
        id: ContentID.adminOrdersCopiedToClipboard,
        content: [
            { langCode: LangCode.EN, text: 'copied to clipboard' },
            { langCode: LangCode.FI, text: 'kopioitiin leikepöydälle' },
        ],
    },
    {
        id: ContentID.adminOrdersDeleteOrder,
        content: [
            { langCode: LangCode.EN, text: 'Delete order number' },
            { langCode: LangCode.FI, text: 'Poistetaanko tilaus numero' },
        ],
    },
    {
        id: ContentID.adminOrdersDeleteOrderButton,
        content: [
            { langCode: LangCode.EN, text: 'Delete Order Permanently' },
            { langCode: LangCode.FI, text: 'Poista tilaus pysyvästi' },
        ],
    },
    {
        id: ContentID.adminOrdersDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Delivered' },
            { langCode: LangCode.FI, text: 'Toimitetut' },
        ],
    },
    {
        id: ContentID.adminOrdersDeliveredDate,
        content: [
            { langCode: LangCode.EN, text: 'Delivered' },
            { langCode: LangCode.FI, text: 'Toimitettu' },
        ],
    },
    {
        id: ContentID.adminOrdersMarkAsDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Mark as Delivered' },
            { langCode: LangCode.FI, text: 'Merkitse toimitetuksi' },
        ],
    },
    {
        id: ContentID.adminOrdersMarkAsNotDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Mark as Not Delivered' },
            { langCode: LangCode.FI, text: 'Merkitse toimittamattomaksi' },
        ],
    },
    {
        id: ContentID.adminOrdersMoveBackFromRecycleBin,
        content: [
            { langCode: LangCode.EN, text: 'Restore from Recycle Bin' },
            { langCode: LangCode.FI, text: 'Palauta roskakorista' },
        ],
    },
    {
        id: ContentID.adminOrdersMoveToRecycleBin,
        content: [
            { langCode: LangCode.EN, text: 'Move to Recycle Bin' },
            { langCode: LangCode.FI, text: 'Siirrä roskakoriin' },
        ],
    },
    {
        id: ContentID.adminOrdersNoOrders,
        content: [
            { langCode: LangCode.EN, text: 'No orders.' },
            { langCode: LangCode.FI, text: 'Ei tilauksia.' },
        ],
    },
    {
        id: ContentID.adminOrdersNoOrdersInFolder,
        content: [
            { langCode: LangCode.EN, text: 'No orders in folder ' },
            { langCode: LangCode.FI, text: 'Ei tilauksia kansiossa ' },
        ],
    },
    {
        id: ContentID.adminOrdersOrderWasMovedToFolder,
        content: [
            { langCode: LangCode.EN, text: 'was moved to folder' },
            { langCode: LangCode.FI, text: 'siirrettiin kansioon' },
        ],
    },
    {
        id: ContentID.adminOrdersPrintOrder,
        content: [
            { langCode: LangCode.EN, text: 'Print Order' },
            { langCode: LangCode.FI, text: 'Tulosta tilaus' },
        ],
    },
    {
        id: ContentID.adminOrdersPrintedOut,
        content: [
            { langCode: LangCode.EN, text: 'Printed Out' },
            { langCode: LangCode.FI, text: 'Tulostettu' },
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
        id: ContentID.adminUserInfoChangeStatus,
        content: [
            { langCode: LangCode.EN, text: 'Change Status' },
            { langCode: LangCode.FI, text: 'Muuta statusta' },
        ],
    },
    {
        id: ContentID.adminUserInfoDeleteAccount,
        content: [
            { langCode: LangCode.EN, text: 'Are you sure you want to permanently delete this account?' },
            { langCode: LangCode.FI, text: 'Haluatko varmasti poistaa tämän käyttäjätilin pysyvästi?' },
        ],
    },
    {
        id: ContentID.adminUserInfoDeleteAccountButton,
        content: [
            { langCode: LangCode.EN, text: 'Delete Account' },
            { langCode: LangCode.FI, text: 'Poista tili' },
        ],
    },
    {
        id: ContentID.adminUserInfoDisableAccount,
        content: [
            { langCode: LangCode.EN, text: 'Disable this account?' },
            { langCode: LangCode.FI, text: 'Jäädytetäänkö tämä käyttäjätili?' },
        ],
    },
    {
        id: ContentID.adminUserInfoDisableAccountButton,
        content: [
            { langCode: LangCode.EN, text: 'Disable Account' },
            { langCode: LangCode.FI, text: 'Jäädytä tili' },
        ],
    },
    {
        id: ContentID.adminUserInfoEnableAccount,
        content: [
            { langCode: LangCode.EN, text: 'Enable this account?' },
            { langCode: LangCode.FI, text: 'Palautetaanko tili käyttöön?' },
        ],
    },
    {
        id: ContentID.adminUserInfoEnableAccountButton,
        content: [
            { langCode: LangCode.EN, text: 'Enable Account' },
            { langCode: LangCode.FI, text: 'Palauta tili' },
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
        id: ContentID.adminUserInfoSendMessage,
        content: [
            { langCode: LangCode.EN, text: 'Send Message' },
            { langCode: LangCode.FI, text: 'Lähetä viesti' },
        ],
    },
    {
        id: ContentID.adminYouCanOnlyDeleteItemsAddedByYou,
        content: [
            { langCode: LangCode.EN, text: 'As an Operator, you can only delete items which you have added.' },
            { langCode: LangCode.FI, text: 'Ylläpitäjänä voit poistaa vain itse lisäämiäsi tuotteita.' },
        ],
    },
    {
        id: ContentID.adminYouCanOnlyDeleteCategoriesAddedByYou,
        content: [
            { langCode: LangCode.EN, text: 'As an Operator, you can only delete categories which you have added.' },
            { langCode: LangCode.FI, text: 'Ylläpitäjänä voit poistaa vain itse lisäämiäsi kategorioita.' },
        ],
    },
    {
        id: ContentID.adminYouCanOnlyEditCategoriesAddedByYou,
        content: [
            { langCode: LangCode.EN, text: 'As an Operator, you can only edit categories which you have added.' },
            { langCode: LangCode.FI, text: 'Ylläpitäjänä voit muokata vain itse lisäämiäsi kategorioita.' },
        ],
    },
    {
        id: ContentID.adminYouCanOnlyEditItemsAddedByYou,
        content: [
            { langCode: LangCode.EN, text: 'As an Operator, you can only edit items which you have added.' },
            { langCode: LangCode.FI, text: 'Ylläpitäjänä voit muokata vain itse lisäämiäsi tuotteita.' },
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
        id: ContentID.buttonAddItemToCategory,
        content: [
            { langCode: LangCode.EN, text: 'Add Item to Category' },
            { langCode: LangCode.FI, text: 'Lisää tuote kategoriaan' },
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
        id: ContentID.buttonClear,
        content: [
            { langCode: LangCode.EN, text: 'Clear' },
            { langCode: LangCode.FI, text: 'Tyhjennä' },
        ],
    },
    {
        id: ContentID.buttonClose,
        content: [
            { langCode: LangCode.EN, text: 'Close' },
            { langCode: LangCode.FI, text: 'Sulje' },
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
        id: ContentID.buttonOpen,
        content: [
            { langCode: LangCode.EN, text: 'Open' },
            { langCode: LangCode.FI, text: 'Avaa' },
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
        id: ContentID.buttonRestore,
        content: [
            { langCode: LangCode.EN, text: 'Restore' },
            { langCode: LangCode.FI, text: 'Palauta' },
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
            { langCode: LangCode.FI, text: 'Ostoskorissa ei ole tuotteita.' },
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
        id: ContentID.checkOutAbortPayment,
        content: [
            { langCode: LangCode.EN, text: 'Abort Payment' },
            { langCode: LangCode.FI, text: 'Keskeytä maksaminen' },
        ],
    },
    {
        id: ContentID.checkOutBackToShop,
        content: [
            { langCode: LangCode.EN, text: 'Back to Shop' },
            { langCode: LangCode.FI, text: 'Takaisin kauppaan' },
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
        id: ContentID.checkoutChoosePickupLocation,
        content: [
            { langCode: LangCode.EN, text: 'Choose pickup location' },
            { langCode: LangCode.FI, text: 'Valitse noutopiste' },
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
        id: ContentID.checkOutDataPrivacyNotice,
        content: [
            { langCode: LangCode.EN, text: 'Data Privacy Notice' },
            { langCode: LangCode.FI, text: 'Tietosuojaseloste' },
        ],
    },
    {
        id: ContentID.checkOutEnterZipcode,
        content: [
            { langCode: LangCode.EN, text: 'Enter zipcode' },
            { langCode: LangCode.FI, text: 'Syötä postinumero' },
        ],
    },
    {
        id: ContentID.checkOutFillAutomatically,
        content: [
            { langCode: LangCode.EN, text: 'Auto-fill' },
            { langCode: LangCode.FI, text: 'Täytä automaattisesti' },
        ],
    },
    {
        id: ContentID.checkOutErrorWhenFetchingOrder,
        content: [
            { langCode: LangCode.EN, text: 'Invalid order.\n\nPlease contact us:' },
            { langCode: LangCode.FI, text: 'Virheellinen tilaus.\n\nOtathan meihin yhteyttä:' },
        ],
    },
    {
        id: ContentID.checkOutErrorSignatureMismatch,
        content: [
            { langCode: LangCode.EN, text: 'Error: Signature mismatch.\n\nPlease contact us:' },
            { langCode: LangCode.FI, text: 'Virhe: Signature mismatch.\n\nOtathan meihin yhteyttä:' },
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
        id: ContentID.checkOutInvalidEmail,
        content: [
            { langCode: LangCode.EN, text: 'Invalid e-mail address' },
            { langCode: LangCode.FI, text: 'Virheellinen sähköpostiosoite' },
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
        id: ContentID.checkOutPayee,
        content: [
            { langCode: LangCode.EN, text: 'Payee' },
            { langCode: LangCode.FI, text: 'Maksun saaja' },
        ],
    },
    {
        id: ContentID.checkOutPaymentDetails,
        content: [
            { langCode: LangCode.EN, text: 'Payment Details' },
            { langCode: LangCode.FI, text: 'Maksun tiedot' },
        ],
    },
    {
        id: ContentID.checkOutPleaseCheck,
        content: [
            { langCode: LangCode.EN, text: 'Please check the following:' },
            { langCode: LangCode.FI, text: 'Tarkistathan seuraavat kohdat:' },
        ],
    },
    {
        id: ContentID.checkOutSafetyInformation,
        content: [
            { langCode: LangCode.EN, text: 'Safety Information' },
            { langCode: LangCode.FI, text: 'Tietoa turvallisuudesta' },
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
        id: ContentID.checkOutThankYou,
        content: [
            { langCode: LangCode.EN, text: 'Thank you!' },
            { langCode: LangCode.FI, text: 'Kiitos!' },
        ],
    },
    {
        id: ContentID.checkOutYourOrderHasBeenReceive,
        content: [
            {
                langCode: LangCode.EN,
                text: 'Your order has been received and is being processed for delivery.\n\nDelivery time for your order is approximately ',
            },
            { langCode: LangCode.FI, text: 'Tilauksenne on vastaanotettu.\n\nToimitusaika tilauksellenne on n. ' },
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
        id: ContentID.contentStoreDescription,
        content: [
            { langCode: LangCode.EN, text: 'Store description' },
            { langCode: LangCode.FI, text: 'Kaupan kuvaus' },
        ],
    },
    {
        id: ContentID.contentWelcome,
        content: [
            { langCode: LangCode.EN, text: 'Welcome' },
            { langCode: LangCode.FI, text: 'Tervetuloa' },
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
        id: ContentID.errorOccurred,
        content: [
            { langCode: LangCode.EN, text: 'Error occurred.' },
            { langCode: LangCode.FI, text: 'Tapahtui virhe.' },
        ],
    },
    {
        id: ContentID.errorSomethingWentWrong,
        content: [
            { langCode: LangCode.EN, text: 'Something went wrong.' },
            { langCode: LangCode.FI, text: 'Jotain meni vikaan.' },
        ],
    },
    {
        id: ContentID.errorSomethingWentWrongTryAgainlater,
        content: [
            { langCode: LangCode.EN, text: 'Something went wrong, please try again later.' },
            { langCode: LangCode.FI, text: 'Jotain meni vikaan, yritä myöhemmin uudelleen.' },
        ],
    },
    {
        id: ContentID.errorThisOperationRequiresAdminRights,
        content: [
            { langCode: LangCode.EN, text: 'This operation requires Admin rights.' },
            { langCode: LangCode.FI, text: 'Tämä toiminto vaatii pääkäyttäjän käyttöoikeudet.' },
        ],
    },
    {
        id: ContentID.itemsAddedToShoppingCart1,
        content: [
            { langCode: LangCode.EN, text: 'added to' },
            { langCode: LangCode.FI, text: 'lisättiin' },
        ],
    },
    {
        id: ContentID.itemsAddedToShoppingCart2,
        content: [
            { langCode: LangCode.EN, text: 'Shopping Cart' },
            { langCode: LangCode.FI, text: 'ostoskoriin' },
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
        id: ContentID.itemsAllCategories,
        content: [
            { langCode: LangCode.EN, text: 'All Categories' },
            { langCode: LangCode.FI, text: 'Tuotekategoriat' },
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
        id: ContentID.itemsFitsInLetter,
        content: [
            { langCode: LangCode.EN, text: 'How many fit in a letter' },
            { langCode: LangCode.FI, text: 'Kuinka monta mahtuu kirjeeseen' },
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
        id: ContentID.itemsLatestItems,
        content: [
            { langCode: LangCode.EN, text: 'Latest Items' },
            { langCode: LangCode.FI, text: 'Uusimmat tuotteet' },
        ],
    },
    {
        id: ContentID.itemsMaximumAmountOfItemAlreadyInShoppingCart1,
        content: [
            { langCode: LangCode.EN, text: 'Maximum amount of' },
            { langCode: LangCode.FI, text: 'Maksimimäärä tuotetta' },
        ],
    },
    {
        id: ContentID.itemsMaximumAmountOfItemAlreadyInShoppingCart2,
        content: [
            { langCode: LangCode.EN, text: 'is already in Shopping Cart.' },
            { langCode: LangCode.FI, text: 'on jo ostoskorissa.' },
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
        id: ContentID.itemsSelectSize,
        content: [
            { langCode: LangCode.EN, text: 'Select size' },
            { langCode: LangCode.FI, text: 'Valitse koko' },
        ],
    },
    {
        id: ContentID.itemsSize,
        content: [
            { langCode: LangCode.EN, text: 'Size' },
            { langCode: LangCode.FI, text: 'Koko' },
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
        id: ContentID.itemsTopSellers,
        content: [
            { langCode: LangCode.EN, text: 'Top Sellers' },
            { langCode: LangCode.FI, text: 'Myydyimmät tuotteet' },
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
            { langCode: LangCode.EN, text: 'Password confirmation does not match.' },
            { langCode: LangCode.FI, text: 'Salasanan vahvistus ei täsmää.' },
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
        id: ContentID.misc404,
        content: [
            { langCode: LangCode.EN, text: 'Page not found.' },
            { langCode: LangCode.FI, text: 'Sivua ei löytynyt.' },
        ],
    },
    {
        id: ContentID.miscAddress,
        content: [
            { langCode: LangCode.EN, text: 'Address' },
            { langCode: LangCode.FI, text: 'Osoite' },
        ],
    },
    {
        id: ContentID.miscChange,
        content: [
            { langCode: LangCode.EN, text: 'Change' },
            { langCode: LangCode.FI, text: 'Muuta' },
        ],
    },
    {
        id: ContentID.miscClickToChangeSortingOrder,
        content: [
            { langCode: LangCode.EN, text: 'Click to change sorting order' },
            { langCode: LangCode.FI, text: 'Klikkaa vaihtaaksesi järjestyksen suuntaa' },
        ],
    },
    {
        id: ContentID.miscClickToSortByThis,
        content: [
            { langCode: LangCode.EN, text: 'Click to sort by this' },
            { langCode: LangCode.FI, text: 'Klikkaa järjestääksesi tämän mukaan' },
        ],
    },
    {
        id: ContentID.miscContent,
        content: [
            { langCode: LangCode.EN, text: 'Content' },
            { langCode: LangCode.FI, text: 'Sisältö' },
        ],
    },
    {
        id: ContentID.miscCopy,
        content: [
            { langCode: LangCode.EN, text: 'Copy' },
            { langCode: LangCode.FI, text: 'Kopioi' },
        ],
    },
    {
        id: ContentID.miscCurrent,
        content: [
            { langCode: LangCode.EN, text: 'Current' },
            { langCode: LangCode.FI, text: 'Nykyinen' },
        ],
    },
    {
        id: ContentID.miscCustomers,
        content: [
            // prettier-ignore
            { langCode: LangCode.EN, text: 'Customer\'s' },
            { langCode: LangCode.FI, text: 'Tilaajan' },
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
        id: ContentID.miscDays,
        content: [
            { langCode: LangCode.EN, text: 'days' },
            { langCode: LangCode.FI, text: 'päivää' },
        ],
    },
    {
        id: ContentID.miscDeleted,
        content: [
            { langCode: LangCode.EN, text: 'deleted' },
            { langCode: LangCode.FI, text: 'poistettiin' },
        ],
    },
    {
        id: ContentID.miscDeliveryCountries,
        content: [
            { langCode: LangCode.EN, text: 'Delivery Countries' },
            { langCode: LangCode.FI, text: 'Toimitusmaat' },
        ],
    },
    {
        id: ContentID.miscDeliveryTime,
        content: [
            { langCode: LangCode.EN, text: 'Delivery time' },
            { langCode: LangCode.FI, text: 'Toimitusaika' },
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
        id: ContentID.miscIs,
        content: [
            { langCode: LangCode.EN, text: 'is' },
            { langCode: LangCode.FI, text: 'on' },
        ],
    },
    {
        id: ContentID.miscLoading,
        content: [
            { langCode: LangCode.EN, text: 'Loading...' },
            { langCode: LangCode.FI, text: 'Ladataan sisältöä...' },
        ],
    },
    {
        id: ContentID.miscLoggedInAs,
        content: [
            { langCode: LangCode.EN, text: 'You are logged in as ' },
            { langCode: LangCode.FI, text: 'Olet kirjautuneena sisään käyttäjätunnuksella ' },
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
        id: ContentID.miscNet,
        content: [
            { langCode: LangCode.EN, text: 'Net' },
            { langCode: LangCode.FI, text: 'Veroton' },
        ],
    },
    {
        id: ContentID.miscNo,
        content: [
            { langCode: LangCode.EN, text: 'No' },
            { langCode: LangCode.FI, text: 'Ei' },
        ],
    },
    {
        id: ContentID.miscOr,
        content: [
            { langCode: LangCode.EN, text: 'or' },
            { langCode: LangCode.FI, text: 'tai' },
        ],
    },
    {
        id: ContentID.miscOrder,
        content: [
            { langCode: LangCode.EN, text: 'Order' },
            { langCode: LangCode.FI, text: 'Tilaus' },
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
        id: ContentID.miscSearch,
        content: [
            { langCode: LangCode.EN, text: 'Search' },
            { langCode: LangCode.FI, text: 'Haku' },
        ],
    },
    {
        id: ContentID.miscUnfortunatelly,
        content: [
            { langCode: LangCode.EN, text: 'unfortunatelly' },
            { langCode: LangCode.FI, text: 'valitettavasti' },
        ],
    },
    {
        id: ContentID.miscUpdated,
        content: [
            { langCode: LangCode.EN, text: 'updated' },
            { langCode: LangCode.FI, text: 'päivitettiin' },
        ],
    },
    {
        id: ContentID.miscVAT,
        content: [
            { langCode: LangCode.EN, text: 'VAT' },
            { langCode: LangCode.FI, text: 'ALV' },
        ],
    },
    {
        id: ContentID.miscWebstore,
        content: [
            { langCode: LangCode.EN, text: 'Webstore' },
            { langCode: LangCode.FI, text: 'Verkkokauppa' },
        ],
    },
    {
        id: ContentID.miscWithSearchWords,
        content: [
            { langCode: LangCode.EN, text: 'with search words' },
            { langCode: LangCode.FI, text: 'hakusanoilla' },
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
        id: ContentID.orderDeliveryCost,
        content: [
            { langCode: LangCode.EN, text: 'Delivery Cost' },
            { langCode: LangCode.FI, text: 'Toimituskulut' },
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
        id: ContentID.orderStatusForAdminDelivered,
        content: [
            { langCode: LangCode.EN, text: 'Delivered' },
            { langCode: LangCode.FI, text: 'Toimitettu' },
        ],
    },
    {
        id: ContentID.orderStatusForAdminNew,
        content: [
            { langCode: LangCode.EN, text: 'New' },
            { langCode: LangCode.FI, text: 'Uusi' },
        ],
    },
    {
        id: ContentID.orderStatusForAdminPrinted,
        content: [
            { langCode: LangCode.EN, text: 'Printed' },
            { langCode: LangCode.FI, text: 'Tulostettu' },
        ],
    },
    {
        id: ContentID.orderStatusForAdminRead,
        content: [
            { langCode: LangCode.EN, text: 'Read' },
            { langCode: LangCode.FI, text: 'Luettu' },
        ],
    },
    {
        id: ContentID.orderStatusForAdminRecycled,
        content: [
            { langCode: LangCode.EN, text: 'Deleted' },
            { langCode: LangCode.FI, text: 'Poistettu' },
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
        id: ContentID.registerPasswordConfirm,
        content: [
            { langCode: LangCode.EN, text: 'Confirm Password' },
            { langCode: LangCode.FI, text: 'Vahvista salasana' },
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
        id: ContentID.searchHits,
        content: [
            { langCode: LangCode.EN, text: 'matches' },
            { langCode: LangCode.FI, text: 'osumaa' },
        ],
    },
    {
        id: ContentID.searchItemsName,
        content: [
            // prettier-ignore
            { langCode: LangCode.EN, text: 'Search with item\'s name...' },
            { langCode: LangCode.FI, text: 'Hae tuotteen nimellä...' },
        ],
    },
    {
        id: ContentID.searchNoResults,
        content: [
            { langCode: LangCode.EN, text: 'No results for' },
            { langCode: LangCode.FI, text: 'Ei tuloksia hakusanalla' },
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
        id: ContentID.user,
        content: [
            { langCode: LangCode.EN, text: 'User' },
            { langCode: LangCode.FI, text: 'Käyttäjä' },
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
        id: ContentID.userRegisteredDate,
        content: [
            { langCode: LangCode.EN, text: 'Registered:' },
            { langCode: LangCode.FI, text: 'Rekisteröity:' },
        ],
    },
    {
        id: ContentID.userStatusAdmin,
        content: [
            { langCode: LangCode.EN, text: 'Admin' },
            { langCode: LangCode.FI, text: 'Pääkäyttäjä' },
        ],
    },
    {
        id: ContentID.userStatusCustomer,
        content: [
            { langCode: LangCode.EN, text: 'Customer' },
            { langCode: LangCode.FI, text: 'Asiakas' },
        ],
    },
    {
        id: ContentID.userStatusHeader,
        content: [
            { langCode: LangCode.EN, text: 'Status' },
            { langCode: LangCode.FI, text: 'Status' },
        ],
    },
    {
        id: ContentID.userStatusOperator,
        content: [
            { langCode: LangCode.EN, text: 'Operator' },
            { langCode: LangCode.FI, text: 'Ylläpitäjä' },
        ],
    },
    {
        id: ContentID.userUpdated,
        content: [
            { langCode: LangCode.EN, text: 'Account Updated.' },
            { langCode: LangCode.FI, text: 'Käyttäjätili päivitettiin.' },
        ],
    },
];

export enum DeliveryName {
    NOUTO = 'Nouto',
    POSTI_EXPRESS = 'Posti Express-paketti',
    POSTI_KOTIPAKETTI = 'Posti Kotipaketti',
    POSTI_PAKETTI = 'Postipaketti',
    POSTI_PIKKUPAKETTI = 'Posti Pikkupaketti (Kirje)',
}

export interface DeliveryMethod {
    cost: number;
    description: string;
    name: string;
    notes: string;
}

export interface Order {
    id: number;
    createdAt: string;
    customerAddress: string;
    customerCity: string;
    customerCountry: string;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    customerOrganization?: string;
    customerPhone: string;
    customerZipCode: string;
    deliveryCost: number;
    deliveryMethod: DeliveryMethod | null;
    items: ShoppingItem[];
    language: 'FI' | 'EN' | 'SE';
    paymentMethod: string | null;
    status: OrderStatus;
    totalAmount: number;
}
export type NewOrder = Omit<Omit<Omit<Order, 'id'>, 'createdAt'>, 'totalAmount'>;

export enum OrderStatus {
    PENDING = 'Pending payment',
    PROCESSING = 'Processing',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
    REFUNDED = 'Refunded',
    ON_HOLD = 'On hold',
    COMPLETED = 'Completed',
}

export enum OrderValidationError {
    DeliveryMethodMissing = 'Choose a delivery method',
    InvalidEmailAddress = 'Invalid e-mail address',
    LackingRequiredCustomerInfo = 'Required customer information missing',
}

export interface PaytrailData {
    providers: PaytrailProvider[];
    terms: string;
}

export interface PaytrailProvider {
    name: string;
    url: string;
    svg: string;
    parameters: Array<{ name: string; value: string }>;
}

export interface PostiLocation {
    id: string;
    name: string;
    address: string;
}

export interface ShoppingCartStatus {
    items: number;
    totalAmount: number;
}

export interface ShoppingItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

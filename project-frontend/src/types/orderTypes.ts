export interface Contact {
    firstname: string;
    lastname: string;
    organization: string | null;
    address: string;
    zipcode: string;
    city: string;
    country: string;
    email: string;
    phone: string;
}

export interface DeliveryMethod {
    id: number;
    name: string;
    description: string;
    cost: number;
}

export interface Order {
    id: number;
    customer: Contact | null;
    recipient: Contact | null;
    items: ShoppingItem[];
    deliveryMethod: DeliveryMethod | null;
    paymentMethod: PaymentMethod | null;
    status: OrderStatus;
}
export type NewOrder = Omit<Order, 'id'>;

export enum OrderStatus {
    PENDING = 'Pending',
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

export interface PaymentMethod {
    id: number;
    name: string;
    description: string;
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

export interface ShoppingCartStatus {
    items: number;
    totalAmount: number;
}

export interface ShoppingItem {
    itemId: number;
    name: string;
    price: number;
    quantity: number;
}

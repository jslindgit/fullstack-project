import { LangText } from './languageTypes';

export enum DeliveryCode {
    INTERNATIONAL_POSTI_EXPRESS_BUSINESS_DAY,
    INTERNATIONAL_POSTI_PRIORITY_PARCEL,
    PICKUP,
    POSTI_EXPRESS,
    POSTI_KOTIPAKETTI,
    POSTI_PAKETTI,
    POSTI_PIKKUPAKETTI,
}

export interface DeliveryMethod {
    code: DeliveryCode;
    cost: number;
    descriptions: LangText[];
    names: LangText[];
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
    statusForAdmin: OrderStatusForAdmin;
    totalAmount: number;
    userId?: number;
}
export type NewOrder = Omit<Omit<Omit<Order, 'id'>, 'createdAt'>, 'totalAmount'>;

export enum OrderStatusForAdmin {
    NEW = 'New',
    READ = 'Read',
    SHIPPED = 'Shipped',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    COMPLETED = 'COMPLETED',
}

export enum OrderValidationError {
    DeliveryMethodMissing = 'Choose a delivery method',
    InvalidEmailAddress = 'Invalid e-mail address',
    LackingRequiredCustomerInfo = 'Required contact information missing',
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

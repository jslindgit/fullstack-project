import { Response } from './types';

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
    isLetter: boolean;
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
    deliveredDate?: Date;
    deliveryCost: number;
    deliveryMethod: DeliveryMethod | null;
    items: ShoppingItem[];
    language: 'FI' | 'EN' | 'SE';
    paymentMethod: string | null;
    printedOutDate?: Date;
    readDate?: Date;
    recycledDate?: Date;
    status: OrderStatus;
    totalAmount: number;
    userId?: number;
}
export type NewOrder = Omit<Omit<Omit<Order, 'id'>, 'createdAt'>, 'totalAmount'>;

export interface OrderResponse extends Response {
    order: Order | null;
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

export interface ShoppingItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
}

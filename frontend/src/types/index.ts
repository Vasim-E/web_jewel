export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    stock: number;
    images: string[];
    category: string;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
}

export interface Order {
    _id: string;
    user: User;
    orderItems: any[];
    shippingAddress: any;
    paymentMethod: string;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
}

export interface HeroSlide {
    _id: string;
    image: string;
    heading: string;
    subHeading: string;
    description: string;
    productCode: string;
    isActive: boolean;
    type: 'product' | 'coming_soon';
    productId?: string;
    createdAt: string;
}

export interface Category {
    _id: string;
    name: string;
    description?: string;
    image?: string;
}

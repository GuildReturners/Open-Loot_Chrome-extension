import { time } from "console";
import type { Key } from "react";

export interface Purchases {
    items: PurchasedItem[];
    pageSize: Number;
    currentPage: Number;
    totalPages: Number;
    totalItems: Number;
}

 export interface PurchasedItem {
    id: Key;
    price: Number;
    item : Item;
    status: string;
    createdBy: string;
    createdAt: string;
    completedBy: string;
}

 export interface Item {
    id: Key;
    userId: string;
    status: string;
    collection: string;
    optionName: string;
    archetypeId: string;
    name: string;
    description: string;
    imageUrl: string;
    tags: string[];
    rarity: string;
    issuedId: Number;
    maxIssuance: Number;
    game : {}
}
 interface Games {
    totalPages: number;
    items: [];
}


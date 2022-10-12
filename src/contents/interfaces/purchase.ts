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
    status: String;
    createdBy: String;
    createdAt: String;
    completedBy: String;
}

 export interface Item {
    id: Key;
    userId: String;
    status: String;
    collection: String;
    optionName: String;
    archetypeId: String;
    name: String;
    description: String;
    imageUrl: string;
    tags: String[];
    rarity: String;
    issuedId: Number;
    maxIssuance: Number;
    game : {}
}
 interface Games {
    totalPages: number;
    items: [];
}


import { time } from "console";
import type { Key } from "react";

export interface Orders {
    items: Order[];
    pageSize: Number;
    currentPage: Number;
    totalPages: Number;
    totalItems: Number;
}

 export interface Order {
    id: Key;
    price: Number;
    item : Item;
    status: string;
    createdBy: string;
    createdAt: string;
    completedBy: string;
    category:string;
    type:string;
} 

export interface Market {
    lowestPrice: Number;
    itemMetadata : Item;
    openOrdersCount: Number;
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
    sellableAt : Number;
} 

export interface ItemLocalStorage {
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
    category?: "Utility" | "Cosmetic";
    type?: "Weapons" |"Armor" |"Title" |"Space" |"Mystery box";
    obtentionMethod? : "Looted" | "Bought" | "Unknown";
    ownershipStatus? : "Owned" | "Sold"
    purchasedPrice?: Number;
    purchasedFrom? : string;
    purchasedDate? : string;
    soldPrice?: Number;
    soldTo? : string;
    soldDate? : string;
    marketFloorPrice? : Number;
    marketOpenOrdersCount? : Number;
}
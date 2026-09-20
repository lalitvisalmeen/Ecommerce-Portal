import { Product } from "../common/product";

export interface ProductPage {
    content: Product[];
    number : number;
    size : number;
    totalElements : number;
    totalPages : number;

}
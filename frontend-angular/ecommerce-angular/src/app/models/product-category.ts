import { ProductCategory } from "../common/product-category/product-category";

export interface CategoryPage{
    content: ProductCategory[];
    number : number;
    size : number;
    totalElements : number;
    totalPages : number;

}
// MODELS
export interface Product {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
}

// GET
export interface GetProductsResponse {
    data: Product[];
}

// POST
export interface PostProductRequest {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
}

export interface PostProductResponse {
    message: string;
    data: Product;
}

// PUT
export interface PutProductRequest {
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
}

export interface PutProductResponse {
    message: string;
    data: Product;
}

// DELETE
export interface DeleteProductResponse {
    message: string;
}
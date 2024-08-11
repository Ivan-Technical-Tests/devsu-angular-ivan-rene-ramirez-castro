import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductGateway } from '../product/gateway/product.gateway';
import { GetProductsResponse, PostProductRequest, PostProductResponse, PutProductRequest, PutProductResponse, DeleteProductResponse, Product } from '../product/product.model';

@Injectable({
    providedIn: 'root',
})
export class ProductUsecase {
    constructor(private productGateway: ProductGateway) {
    }

    getProducts(): Observable<GetProductsResponse> {
        return this.productGateway.getProducts();
    }

    getProduct(id: string): Observable<Product> {
        return this.productGateway.getProduct(id);
    }

    postProduct(request: PostProductRequest): Observable<PostProductResponse> {
        return this.productGateway.postProduct(request);
    }

    putProduct(id: string, request: PutProductRequest): Observable<PutProductResponse> {
        return this.productGateway.putProduct(id, request);
    }

    deleteProduct(id: string): Observable<DeleteProductResponse> {
        return this.productGateway.deleteProduct(id);
    }

    validateProduct(id: string): Observable<boolean> {
        return this.productGateway.validateProduct(id);
    }
}
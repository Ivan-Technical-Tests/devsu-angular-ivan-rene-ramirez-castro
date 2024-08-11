import { Injectable } from "@angular/core";
import { ProductGateway } from "../../../domain/models/product/gateway/product.gateway";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GetProductsResponse, PostProductRequest, PostProductResponse, PutProductRequest, PutProductResponse, DeleteProductResponse, Product } from "../../../domain/models/product/product.model";
import { ConfigService } from "../../config.service";

@Injectable({
    providedIn: 'root',
})
export class ProductApiService extends ProductGateway {
    private _url = `${this.config.apiUrl}/bp/products`;

    constructor(private http: HttpClient, private config: ConfigService) {
        super();
    }

    getProducts(): Observable<GetProductsResponse> {
        return this.http.get<GetProductsResponse>(this._url);
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this._url}/${id}`);
    }

    postProduct(request: PostProductRequest): Observable<PostProductResponse> {
        return this.http.post<PostProductResponse>(this._url, request);
    }

    putProduct(id: string, request: PutProductRequest): Observable<PutProductResponse> {
        return this.http.put<PutProductResponse>(`${this._url}/${id}`, request);
    }

    deleteProduct(id: string): Observable<DeleteProductResponse> {
        return this.http.delete<DeleteProductResponse>(`${this._url}/${id}`);
    }
}
import { Observable } from 'rxjs';
import {
    // GET
    Product,
    GetProductsResponse,
    // POST
    PostProductRequest,
    PostProductResponse,
    // PUT
    PutProductRequest,
    PutProductResponse,
    // DELETE
    DeleteProductResponse,
} from '../product.model';

export abstract class ProductGateway {

    // GET
    abstract getProduct(id: string): Observable<Product>;
    abstract getProducts(): Observable<GetProductsResponse>;

    // POST
    abstract postProduct(request: PostProductRequest): Observable<PostProductResponse>;

    // PUT
    abstract putProduct(id: string, request: PutProductRequest): Observable<PutProductResponse>;

    // DELETE
    abstract deleteProduct(id: string): Observable<DeleteProductResponse>;

}
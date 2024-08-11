import { of, Observable } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { ProductGateway } from './product.gateway';
import {
    Product,
    GetProductsResponse,
    PostProductRequest,
    PostProductResponse,
    PutProductRequest,
    PutProductResponse,
    DeleteProductResponse,
} from '../product.model';

// Clase MockProductGateway definida directamente en el archivo de prueba
class MockProductGateway extends ProductGateway {

    getProduct(id: string): Observable<Product> {
        return of({ id, name: 'Mock Product', description: '', logo: '', date_release: new Date(), date_revision: new Date() });
    }

    getProducts(): Observable<GetProductsResponse> {
        return of({ data: [] });
    }

    postProduct(request: PostProductRequest): Observable<PostProductResponse> {
        return of({ message: 'Product created', data: { ...request } });
    }

    putProduct(id: string, request: PutProductRequest): Observable<PutProductResponse> {
        return of({ message: 'Product updated', data: { id, ...request } });
    }

    deleteProduct(id: string): Observable<DeleteProductResponse> {
        return of({ message: 'Product deleted' });
    }

    validateProduct(id: string): Observable<boolean> {
        return of(true);
    }
}

// Pruebas unitarias para ProductGateway utilizando el MockProductGateway
describe('ProductGateway', () => {
    let gateway: MockProductGateway;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockProductGateway],
        });

        gateway = TestBed.inject(MockProductGateway);
    });

    it('should retrieve a product by ID', (done) => {
        const productId = '123';
        gateway.getProduct(productId).subscribe((product: Product) => {
            expect(product).toBeTruthy();
            expect(product.id).toBe(productId);
            done();
        });
    });

    it('should retrieve a list of products', (done) => {
        gateway.getProducts().subscribe((response) => {
            expect(response.data).toBeTruthy();
            expect(Array.isArray(response.data)).toBeTrue();
            done();
        });
    });

    it('should create a new product', (done) => {
        const request: PostProductRequest = {
            id: '123',
            name: 'Test Product',
            description: 'A product for testing',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };

        gateway.postProduct(request).subscribe((response) => {
            expect(response.message).toBe('Product created');
            expect(response.data.name).toBe(request.name);
            done();
        });
    });

    it('should update a product', (done) => {
        const productId = '123';
        const request: PostProductRequest = {
            id: productId,
            name: 'Updated Product',
            description: 'Updated description',
            logo: 'updated_logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };

        gateway.putProduct(productId, request).subscribe((response) => {
            expect(response.message).toBe('Product updated');
            expect(response.data.name).toBe(request.name);
            done();
        });
    });

    it('should delete a product by ID', (done) => {
        const productId = '123';
        gateway.deleteProduct(productId).subscribe((response) => {
            expect(response.message).toBe('Product deleted');
            done();
        });
    });

    it('should validate a product by ID', (done) => {
        const productId = '123';
        gateway.validateProduct(productId).subscribe((isValid) => {
            expect(isValid).toBeTrue();
            done();
        });
    });
});

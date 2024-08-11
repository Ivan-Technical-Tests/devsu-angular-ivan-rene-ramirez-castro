import { TestBed } from '@angular/core/testing';
import { ProductUsecase } from './product-usecase';
import { ProductGateway } from '../product/gateway/product.gateway';
import { of } from 'rxjs';
import {
    GetProductsResponse,
    PostProductRequest,
    PostProductResponse,
    PutProductRequest,
    PutProductResponse,
    DeleteProductResponse,
    Product
} from '../product/product.model';

class MockProductGateway implements ProductGateway {
    getProduct(id: string) {
        return of({ id, name: 'Mock Product', description: '', logo: '', date_release: new Date(), date_revision: new Date() });
    }

    getProducts() {
        return of({ data: [] });
    }

    postProduct(request: PostProductRequest) {
        return of({ message: 'Product created', data: { ...request } });
    }

    putProduct(id: string, request: PutProductRequest) {
        return of({ message: 'Product updated', data: { id, ...request } });
    }

    deleteProduct(id: string) {
        return of({ message: 'Product deleted' });
    }

    validateProduct(id: string) {
        return of(true);
    }
}

describe('ProductUsecase', () => {
    let usecase: ProductUsecase;
    let gateway: ProductGateway;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProductUsecase,
                { provide: ProductGateway, useClass: MockProductGateway }
            ]
        });

        usecase = TestBed.inject(ProductUsecase);
        gateway = TestBed.inject(ProductGateway);
    });

    it('should be created', () => {
        expect(usecase).toBeTruthy();
    });

    it('should retrieve products through the gateway', () => {
        const spy = spyOn(gateway, 'getProducts').and.callThrough();
        usecase.getProducts().subscribe((response) => {
            expect(spy).toHaveBeenCalled();
            expect(response.data).toEqual([]);
        });
    });

    it('should retrieve a single product through the gateway', () => {
        const productId = '123';
        const spy = spyOn(gateway, 'getProduct').and.callThrough();
        usecase.getProduct(productId).subscribe((product) => {
            expect(spy).toHaveBeenCalledWith(productId);
            expect(product.id).toBe(productId);
        });
    });

    it('should create a product through the gateway', () => {
        const request: PostProductRequest = {
            id: '123',
            name: 'Test Product',
            description: 'A product for testing',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };
        const spy = spyOn(gateway, 'postProduct').and.callThrough();
        usecase.postProduct(request).subscribe((response) => {
            expect(spy).toHaveBeenCalledWith(request);
            expect(response.message).toBe('Product created');
        });
    });

    it('should update a product through the gateway', () => {
        const productId = '123';
        const request: PutProductRequest = {
            name: 'Updated Product',
            description: 'Updated description',
            logo: 'updated_logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };
        const spy = spyOn(gateway, 'putProduct').and.callThrough();
        usecase.putProduct(productId, request).subscribe((response) => {
            expect(spy).toHaveBeenCalledWith(productId, request);
            expect(response.message).toBe('Product updated');
        });
    });

    it('should delete a product through the gateway', () => {
        const productId = '123';
        const spy = spyOn(gateway, 'deleteProduct').and.callThrough();
        usecase.deleteProduct(productId).subscribe((response) => {
            expect(spy).toHaveBeenCalledWith(productId);
            expect(response.message).toBe('Product deleted');
        });
    });

    it('should validate a product through the gateway', () => {
        const productId = '123';
        const spy = spyOn(gateway, 'validateProduct').and.callThrough();
        usecase.validateProduct(productId).subscribe((isValid) => {
            expect(spy).toHaveBeenCalledWith(productId);
            expect(isValid).toBeTrue();
        });
    });
});

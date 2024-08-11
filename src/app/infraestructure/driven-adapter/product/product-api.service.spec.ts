import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiService } from './product-api.service';
import { ConfigService } from '../../config.service';
import {
    GetProductsResponse,
    PostProductRequest,
    PostProductResponse,
    PutProductRequest,
    PutProductResponse,
    DeleteProductResponse,
    Product,
} from '../../../domain/models/product/product.model';

describe('ProductApiService', () => {
    let service: ProductApiService;
    let httpMock: HttpTestingController;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('ConfigService', ['apiUrl']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ProductApiService,
                { provide: ConfigService, useValue: spy }
            ],
        });

        service = TestBed.inject(ProductApiService);
        httpMock = TestBed.inject(HttpTestingController);
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;

    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve products (GET)', () => {
        const mockResponse: GetProductsResponse = { data: [] };

        service.getProducts().subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should retrieve a single product by ID (GET)', () => {
        const mockProduct: Product = {
            id: '123',
            name: 'Test Product',
            description: 'A product for testing',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };

        service.getProduct('123').subscribe((product) => {
            expect(product).toEqual(mockProduct);
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products/123`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProduct);
    });

    it('should create a product (POST)', () => {
        const mockRequest: PostProductRequest = {
            id: '123',
            name: 'Test Product',
            description: 'A product for testing',
            logo: 'logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };
        const mockResponse: PostProductResponse = {
            message: 'Product created',
            data: mockRequest,
        };

        service.postProduct(mockRequest).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRequest);
        req.flush(mockResponse);
    });

    it('should update a product (PUT)', () => {
        const mockRequest: PutProductRequest = {
            name: 'Updated Product',
            description: 'Updated description',
            logo: 'updated_logo.png',
            date_release: new Date(),
            date_revision: new Date(),
        };
        const mockResponse: PutProductResponse = {
            message: 'Product updated',
            data: {
                id: '123',
                ...mockRequest,
            },
        };

        service.putProduct('123', mockRequest).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products/123`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(mockRequest);
        req.flush(mockResponse);
    });

    it('should delete a product (DELETE)', () => {
        const mockResponse: DeleteProductResponse = { message: 'Product deleted' };

        service.deleteProduct('123').subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products/123`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });

    it('should validate a product (GET)', () => {
        service.validateProduct('123').subscribe((isValid) => {
            expect(isValid).toBeTrue();
        });

        const req = httpMock.expectOne(`${configServiceSpy.apiUrl}/bp/products/verification/123`);
        expect(req.request.method).toBe('GET');
        req.flush(true);
    });
});

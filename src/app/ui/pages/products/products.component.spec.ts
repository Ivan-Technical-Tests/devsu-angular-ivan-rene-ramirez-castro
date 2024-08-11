import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductsComponent } from './products.component';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { Product } from '../../../domain/models/product/product.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Importa CUSTOM_ELEMENTS_SCHEMA

describe('ProductsComponent', () => {
    let component: ProductsComponent;
    let fixture: ComponentFixture<ProductsComponent>;
    let productUsecaseSpy: jasmine.SpyObj<ProductUsecase>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const productUsecaseSpyObj = jasmine.createSpyObj('ProductUsecase', ['getProducts', 'deleteProduct']);
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [ProductsComponent],
            providers: [
                { provide: ProductUsecase, useValue: productUsecaseSpyObj },
                { provide: Router, useValue: routerSpyObj }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA] // Usa CUSTOM_ELEMENTS_SCHEMA
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsComponent);
        component = fixture.componentInstance;
        productUsecaseSpy = TestBed.inject(ProductUsecase) as jasmine.SpyObj<ProductUsecase>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load products on init', fakeAsync(() => {
        const mockProducts: Product[] = [
            { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
            { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
        ];

        productUsecaseSpy.getProducts.and.returnValue(of({ data: mockProducts }));
        fixture.detectChanges();

        tick(500);

        expect(component.loading).toBeFalse();
        expect(component.products.length).toBe(2);
        expect(component.filteredProducts.length).toBe(2);
        expect(component.paginatedProducts.length).toBe(2);
    }));

    it('should filter products based on search term', fakeAsync(() => {
        component.products = [
            { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() },
            { id: '2', name: 'Product 2', description: 'Desc 2', logo: 'logo2.png', date_release: new Date(), date_revision: new Date() }
        ];

        component.searchTerm = 'Product 1';
        component.filterProducts();

        expect(component.filteredProducts.length).toBe(1);
        expect(component.filteredProducts[0].name).toBe('Product 1');
    }));


    it('should navigate to add product page on add', () => {
        component.onAdd();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/add']);
    });

    it('should open delete modal with correct product', () => {
        const mockProduct: Product = { id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: new Date(), date_revision: new Date() };

        component.openDeleteModal(mockProduct);

        expect(component.productToDelete).toBe(mockProduct);
        expect(component.showDeleteModal).toBeTrue();
    });


    it('should navigate to edit product page on edit', () => {
        component.onEdit('1');

        expect(routerSpy.navigate).toHaveBeenCalledWith(['edit'], { queryParams: { id: '1' } });
    });
});

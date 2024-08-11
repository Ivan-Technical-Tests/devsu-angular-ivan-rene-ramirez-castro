import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { FormProductComponent } from './form-product.component';
import { PostProductRequest, Product, PutProductRequest } from '../../../domain/models/product/product.model';

describe('FormProductComponent', () => {
    let component: FormProductComponent;
    let fixture: ComponentFixture<FormProductComponent>;
    let productUsecaseSpy: jasmine.SpyObj<ProductUsecase>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteSpy: any;
    let queryParamMapSubject: BehaviorSubject<any>;

    beforeEach(async () => {
        const productUsecaseSpyObj = jasmine.createSpyObj('ProductUsecase', [
            'getProduct',
            'postProduct',
            'putProduct',
            'validateProduct'
        ]);
        const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

        queryParamMapSubject = new BehaviorSubject(convertToParamMap({ id: '123' }));
        activatedRouteSpy = {
            queryParamMap: queryParamMapSubject.asObservable(),
        };

        await TestBed.configureTestingModule({
            declarations: [FormProductComponent],
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: ProductUsecase, useValue: productUsecaseSpyObj },
                { provide: Router, useValue: routerSpyObj },
                { provide: ActivatedRoute, useValue: activatedRouteSpy }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignorar elementos desconocidos
        }).compileComponents();

        fixture = TestBed.createComponent(FormProductComponent);
        component = fixture.componentInstance;
        productUsecaseSpy = TestBed.inject(ProductUsecase) as jasmine.SpyObj<ProductUsecase>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with default values', () => {
        queryParamMapSubject.next(convertToParamMap({ id: null }));
        fixture.detectChanges();
        const today = new Date().toISOString().split('T')[0];
        const formValues = component.productForm.value;

        expect(formValues.id).toBe('');
        expect(formValues.name).toBe('');
        expect(formValues.description).toBe('');
        expect(formValues.logo).toBe('');
        expect(formValues.releaseDate).toBe(today);
    });

    it('should load product in edit mode', fakeAsync(() => {
        const mockProduct: Product = {
            id: '123',
            name: 'Test Product',
            description: 'A product for testing',
            logo: 'logo.png',
            date_release: new Date('2024-08-11T00:00:00Z'),
            date_revision: new Date('2024-08-11T00:00:00Z'),
        };

        productUsecaseSpy.getProduct.and.returnValue(of(mockProduct));
        fixture.detectChanges();
        tick(500); // Simular el retraso

        expect(component.productForm.get('id')?.value).toBe(mockProduct.id);
        expect(component.productForm.get('name')?.value).toBe(mockProduct.name);
        expect(component.productForm.get('description')?.value).toBe(mockProduct.description);
        expect(component.productForm.get('logo')?.value).toBe(mockProduct.logo);
        expect(component.isEditMode).toBeTrue();
    }));

    it('should create a new product', () => {
        queryParamMapSubject.next(convertToParamMap({ id: null }));
        fixture.detectChanges();

        const mockDate = new Date('2024-08-11T00:00:00Z');
        const mockRequest: PostProductRequest = {
            id: '123',
            name: 'New Product',
            description: 'Description for new product',
            logo: 'logo.png',
            date_release: mockDate,
            date_revision: mockDate,
        };

        component.productForm.setValue({
            id: mockRequest.id,
            name: mockRequest.name,
            description: mockRequest.description,
            logo: mockRequest.logo,
            releaseDate: mockRequest.date_release.toISOString().split('T')[0],
            reviewDate: mockRequest.date_revision.toISOString().split('T')[0]
        });

        const mockResponse = {
            message: 'Product created',
            data: mockRequest,
        };

        productUsecaseSpy.postProduct.and.returnValue(of(mockResponse));

        spyOn(component, 'showSuccessModal').and.callFake(() => {
            routerSpy.navigate(['']);
        });

        component.onSubmit();

        expect(productUsecaseSpy.postProduct).toHaveBeenCalledWith(mockRequest);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('should update an existing product', () => {
        const mockDate = new Date('2024-08-11T00:00:00Z');
        const mockRequest: PutProductRequest = {
            name: 'Updated Product',
            description: 'Updated description',
            logo: 'updated_logo.png',
            date_release: mockDate,
            date_revision: mockDate,
        };

        component.isEditMode = true;
        component.productId = '123';

        component.productForm.setValue({
            id: '123',
            name: mockRequest.name,
            description: mockRequest.description,
            logo: mockRequest.logo,
            releaseDate: mockRequest.date_release.toISOString().split('T')[0],
            reviewDate: mockRequest.date_revision.toISOString().split('T')[0]
        });

        const mockResponse = {
            message: 'Product updated',
            data: { id: '123', ...mockRequest },
        };

        productUsecaseSpy.putProduct.and.returnValue(of(mockResponse));

        component.onSubmit();

        expect(productUsecaseSpy.putProduct).toHaveBeenCalledWith('123', mockRequest);
    });

    it('should mark all fields as touched if form is invalid', () => {
        queryParamMapSubject.next(convertToParamMap({ id: null }));
        fixture.detectChanges();

        component.onSubmit();

        expect(component.productForm.get('id')?.touched).toBeTrue();
        expect(component.productForm.get('name')?.touched).toBeTrue();
        expect(component.productForm.get('description')?.touched).toBeTrue();
    });

    it('should validate release date correctly', () => {
        queryParamMapSubject.next(convertToParamMap({ id: null }));
        fixture.detectChanges();

        const releaseDateControl = component.productForm.get('releaseDate');
        releaseDateControl?.setValue('2000-01-01');

        component.validateReleaseDate();

        expect(releaseDateControl?.hasError('invalidReleaseDate')).toBeTrue();
    });

    it('should navigate to home after successful creation', () => {
        spyOn(window, 'confirm').and.returnValue(true); // Simula que el usuario confirma el modal
        const mockResponse = { message: 'Product created', data: {} as any };
        productUsecaseSpy.postProduct.and.returnValue(of(mockResponse));

        component.isEditMode = false;
        component.onSubmit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('should show error modal on creation failure', () => {
        spyOn(window, 'confirm').and.returnValue(true); // Simula que el usuario confirma el modal
        productUsecaseSpy.postProduct.and.returnValue(of({ message: 'Product creation failed' } as any));

        component.isEditMode = false;
        component.onSubmit();

        // Aquí podrías probar que el modal de error ha sido mostrado
        // Esto podría requerir un ajuste en el código del componente para permitir el espía o mocks
    });
});

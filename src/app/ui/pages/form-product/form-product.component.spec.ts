import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormProductComponent } from './form-product.component';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Importa el componente app-header si es parte de tu aplicación
import { HeaderComponent } from '../../shared/header/header.component';

describe('FormProductComponent', () => {
    let component: FormProductComponent;
    let fixture: ComponentFixture<FormProductComponent>;
    let productUsecaseMock: any;
    let routerMock: any;
    let routeMock: any;

    beforeEach(async () => {
        productUsecaseMock = jasmine.createSpyObj('ProductUsecase', ['getProduct', 'postProduct', 'putProduct', 'validateProduct']);
        routerMock = jasmine.createSpyObj('Router', ['navigate']);
        routeMock = { queryParamMap: of({ get: () => null }) };

        await TestBed.configureTestingModule({
            declarations: [FormProductComponent],
            imports: [ReactiveFormsModule],
            providers: [
                FormBuilder,
                { provide: ProductUsecase, useValue: productUsecaseMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: routeMock }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should invalidate the form when fields are empty', () => {
        component.productForm.controls['id'].setValue('');
        component.productForm.controls['name'].setValue('');
        component.productForm.controls['description'].setValue('');
        component.productForm.controls['logo'].setValue('');

        expect(component.productForm.valid).toBeFalse();
    });

    it('should validate the form when all fields are filled correctly', fakeAsync(() => {
        // Simula que el ID no existe
        productUsecaseMock.validateProduct.and.returnValue(of(false));

        component.productForm.controls['id'].setValue('123');
        component.productForm.controls['name'].setValue('Product Name');
        component.productForm.controls['description'].setValue('This is a description for the product.');
        component.productForm.controls['logo'].setValue('logo.png');
        component.productForm.controls['releaseDate'].setValue('2024-01-01');
        component.productForm.controls['reviewDate'].setValue('2025-01-01');

        // Ejecuta la validación asíncrona
        component.productForm.updateValueAndValidity();

        // Simula la espera para la validación asíncrona
        tick();

        expect(component.productForm.valid).toBe(true);
    }));

    it('should load product and patch form values when productId exists', fakeAsync(() => {

        const mockDateToday = new Date();

        const mockProduct = {
            id: '123',
            name: 'Product Name',
            description: 'This is a description for the product.',
            logo: 'logo.png',
            date_release: mockDateToday.toISOString().split('T')[0],
            date_revision: new Date(mockDateToday.setFullYear(mockDateToday.getFullYear() + 1)).toISOString().split('T')[0]
        };

        productUsecaseMock.validateProduct.and.returnValue(of(false));

        productUsecaseMock.getProduct.and.returnValue(of(mockProduct));

        component.loadProduct('123');

        // 1.1 segundos por el delay
        tick(1100);

        expect(component.productForm.get('id')?.value).toEqual(mockProduct.id);
        expect(component.productForm.get('name')?.value).toEqual(mockProduct.name);
        expect(component.productForm.get('description')?.value).toEqual(mockProduct.description);
        expect(component.productForm.get('logo')?.value).toEqual(mockProduct.logo);
        expect(component.productForm.get('releaseDate')?.value).toEqual(mockProduct.date_release);
        expect(component.productForm.get('reviewDate')?.value).toEqual(mockProduct.date_revision);
    }));

    it('should call createProduct when form is valid and is not in edit mode', fakeAsync(() => {
        spyOn(component, 'createProduct');
        component.isEditMode = false;

        productUsecaseMock.validateProduct.and.returnValue(of(false));

        component.productForm.controls['id'].setValue('123');
        component.productForm.controls['name'].setValue('Product Name');
        component.productForm.controls['description'].setValue('This is a description for the product.');
        component.productForm.controls['logo'].setValue('logo.png');
        component.productForm.controls['releaseDate'].setValue('2024-01-01');
        component.productForm.controls['reviewDate'].setValue('2025-01-01');

        tick();

        component.onSubmit();

        expect(component.createProduct).toHaveBeenCalled();
    }));


});

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { PostProductRequest, Product, PutProductRequest } from '../../../domain/models/product/product.model';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.css']
})
export class FormProductComponent implements OnInit {

  productForm: FormGroup;
  idExistsError: boolean = false;
  isEditMode: boolean = false;
  productId: string | null = null;
  loading: boolean = true;


  constructor(
    private fb: FormBuilder,
    private productUsecase: ProductUsecase,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date().toISOString().split('T')[0];

    this.productForm = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3)],
        asyncValidators: [this.validateIdNotTaken.bind(this)], // Validador asíncrono
        updateOn: 'change' // Ejecuta la validación asíncrona en cada cambio de valor
      }],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      releaseDate: [today, [Validators.required, this.validateReleaseDate.bind(this)]],
      reviewDate: [{ value: this.calculateReviewDate(new Date(today)), disabled: true }, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loading = true;
        this.loadProduct(this.productId);
      } else {
        this.loading = false;
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;

    // TODO: Quitar el delay y mostrar el skeleton de forma instantánea
    setTimeout(() => {

      this.productUsecase.getProduct(id).subscribe({
        next: (product: Product) => {
          this.productForm.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            releaseDate: new Date(product.date_release).toISOString().split('T')[0],
            reviewDate: new Date(product.date_revision).toISOString().split('T')[0]
          });

          this.productForm.get('id')?.disable();
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.showErrorModalGet();
        }
      });
    }, 500);

  }

  onSubmit(): void {
    if (this.productForm.valid) {
      if (this.isEditMode) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  createProduct(): void {
    const postProductRequest: PostProductRequest = {
      id: this.productForm.get('id')?.value,
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      logo: this.productForm.get('logo')?.value,
      date_release: new Date(this.productForm.get('releaseDate')?.value),
      date_revision: new Date(this.productForm.get('reviewDate')?.value),
    };
    this.productUsecase.postProduct(postProductRequest).subscribe({
      next: () => {
        this.showSuccessModal();
      },
      error: () => {
        this.showErrorModal();
      }
    });
  }

  updateProduct(): void {
    const putProductRequest: PutProductRequest = {
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      logo: this.productForm.get('logo')?.value,
      date_release: new Date(this.productForm.get('releaseDate')?.value),
      date_revision: new Date(this.productForm.get('reviewDate')?.value),
    };
    this.productUsecase.putProduct(this.productId!, putProductRequest).subscribe({
      next: () => {
        this.showSuccessModal();
      },
      error: () => {
        this.showErrorModal();
      }
    });
  }

  onReset(): void {
    const today = new Date().toISOString().split('T')[0];
    this.productForm.reset();
    this.idExistsError = false;

    this.productForm.patchValue({
      releaseDate: today,
      reviewDate: this.calculateReviewDate(new Date(today))
    });

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.productForm.get(field);
    return fieldControl ? fieldControl.invalid && (fieldControl.touched || fieldControl.dirty) : false;
  }

  validateReleaseDate() {

    if (!this.productForm) return;

    let releaseDate = new Date(this.productForm.get('releaseDate')?.value);
    let today = new Date();

    releaseDate.setHours(47, 59, 59, 0);

    if (releaseDate < today) {
      this.productForm.get('releaseDate')?.setErrors({ invalidReleaseDate: true });
    } else {
      this.productForm.get('releaseDate')?.setErrors(null);
      const reviewDate = this.calculateReviewDate(releaseDate);
      this.productForm.get('reviewDate')?.setValue(reviewDate);

    }
  }

  calculateReviewDate(releaseDate: Date): string {
    const review = new Date(releaseDate.setFullYear(releaseDate.getFullYear() + 1));
    review.setDate(review.getDate() - 1);
    return review.toISOString().split('T')[0];
  }

  validateIdNotTaken(control: any) {
    return new Promise((resolve) => {
      if (!control.value || this.isEditMode) {
        resolve(null);
      } else {
        this.productUsecase.validateProduct(control.value).subscribe({
          next: (exists) => {
            if (exists) {
              this.idExistsError = true;
              resolve({ idExists: true });
            } else {
              this.idExistsError = false;
              resolve(null);
            }
          },
          error: () => {
            resolve({ idExists: true });
          }
        });
      }
    });
  }

  showSuccessModal(): void {
    const message = this.isEditMode ? 'Producto actualizado exitosamente.' : 'Producto guardado exitosamente.';
    alert(`${message}`)
    this.router.navigate(['']);
  }

  showErrorModal(): void {
    const message = this.isEditMode ? 'Ocurrió un error al actualizar el producto.' : 'Ocurrió un error al guardar el producto.';
    alert(message);

  }

  showErrorModalGet(): void {
    const message = this.isEditMode ? 'El producto no existe.' : 'No se pudo cargar el producto.';
    alert(message);
    this.router.navigate(['']);
  }

}

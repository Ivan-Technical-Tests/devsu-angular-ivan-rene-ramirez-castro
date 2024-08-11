import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { PostProductRequest, Product, PutProductRequest } from '../../../domain/models/product/product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  idExistsError: boolean = false;
  isEditMode: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productUsecase: ProductUsecase,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'yyyy-MM-dd'

    this.productForm = this.fb.group({
      id: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]], // TODO: Validar que sea una URL válida
      releaseDate: [today, [Validators.required, this.validateDates.bind(this)]], // Fecha de liberación inicializada a hoy
      reviewDate: [today, [Validators.required, this.validateDates.bind(this)]]  // Fecha de revisión inicializada a hoy
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.productUsecase.getProduct(id).subscribe((product: Product) => {
      // TODO: Actualizar el formulario con los datos del producto

      this.productForm.patchValue({
        id: product.id,
        name: product.name,
        description: product.description,
        logo: product.logo,
        releaseDate: new Date(product.date_release).toISOString().split('T')[0],
        reviewDate: new Date(product.date_revision).toISOString().split('T')[0]
      });

      this.productForm.get('id')?.disable();  // Deshabilitar el campo ID en modo edición
    });
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
    this.productForm.reset();
    this.idExistsError = false;

    const today = new Date().toISOString().split('T')[0];
    this.productForm.patchValue({
      releaseDate: today,
      reviewDate: today
    });

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  isFieldInvalid(field: string): boolean {
    const fieldControl = this.productForm.get(field);
    return fieldControl ? fieldControl.invalid && (fieldControl.touched || fieldControl.dirty) : false;
  }

  validateDates() {
    const releaseDate = this.productForm?.get('releaseDate')?.value;
    const reviewDate = this.productForm?.get('reviewDate')?.value;

    if (!releaseDate || !reviewDate) return;

    if (releaseDate && reviewDate && reviewDate < releaseDate) {
      this.productForm.get('reviewDate')?.setErrors({ invalidReviewDate: true });
    } else {
      this.productForm.get('reviewDate')?.setErrors(null);
    }
  }

  validateIdNotTaken(control: any) {
    return new Promise((resolve) => {
      this.productUsecase.validateProduct(control.value).subscribe((exists) => {
        if (exists) {
          this.idExistsError = true;
          resolve({ idExists: true });
        } else {
          this.idExistsError = false;
          resolve(null);
        }
      });
    });
  }

  showSuccessModal(): void {
    const message = this.isEditMode ? 'Producto actualizado exitosamente.' : 'Producto guardado exitosamente.';
    if (confirm(`${message} ¿Deseas volver a la página de inicio?`)) {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['']);
    }
  }

  showErrorModal(): void {
    const message = this.isEditMode ? 'Ocurrió un error al actualizar el producto.' : 'Ocurrió un error al guardar el producto.';
    if (confirm(message)) {
      // Si el usuario cierra el modal o da clic en aceptar, no se realiza ninguna acción
    }
  }
}

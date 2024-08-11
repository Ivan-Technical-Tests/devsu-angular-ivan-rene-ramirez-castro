import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { PostProductRequest } from '../../../domain/models/product/product.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  idExistsError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productUsecase: ProductUsecase,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato 'yyyy-MM-dd'

    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3)], this.validateIdNotTaken.bind(this)],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?')]],
      releaseDate: [today, [Validators.required, this.validateDates.bind(this)]], // Fecha de liberación inicializada a hoy
      reviewDate: [today, [Validators.required, this.validateDates.bind(this)]]  // Fecha de revisión inicializada a hoy
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.productForm.valid) {
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
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.productForm.reset();
    this.idExistsError = false;

    const today = new Date().toISOString().split('T')[0];
    this.productForm.patchValue({
      releaseDate: today,
      reviewDate: today
    });
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
    if (confirm('Producto guardado exitosamente. ¿Deseas volver a la página de inicio?')) {
      this.router.navigate(['']);
    } else {
      this.router.navigate(['']);
    }
  }

  showErrorModal(): void {
    if (confirm('Ocurrió un error al guardar el producto. Por favor, inténtalo de nuevo.')) {
      // Si el usuario cierra el modal o da clic en aceptar, no se realiza ninguna acción
    }
  }
}

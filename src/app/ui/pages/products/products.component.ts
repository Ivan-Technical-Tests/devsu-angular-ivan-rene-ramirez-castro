import { Component, OnInit, HostListener } from '@angular/core';
import { ProductUsecase } from '../../../domain/models/usecases/product-usecase';
import { Product } from '../../../domain/models/product/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  constructor(private productUsecase: ProductUsecase) { }

  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 5;
  currentPage: number = 1;
  loading: boolean = true;
  activeDropdown: string | null = null;
  skeletonProducts = Array(5).fill({});

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    // esperar 1 segundo para mostrar el spinner
    setTimeout(() => {
      this.productUsecase.getProducts().subscribe({
        next: response => {
          this.loading = false;
          this.products = response.data;
          this.filteredProducts = this.products;
          this.updatePagination();
        },
        error: error => {
          console.log(error);
        }
      });
    }, 1000);
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  onAdd() {
    alert('Agregar nuevo producto');
  }

  onItemsPerPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPerPage = +selectElement.value;
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearchTermChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.filterProducts();
  }

  toggleTooltip(id: string) {
    const tooltip = document.getElementById(id);
    if (tooltip) {
      tooltip.classList.toggle('active');
    }
  }

  toggleDropdown(productId: string, event: MouseEvent) {
    event.stopPropagation();
    const dropdownId = `dropdown-${productId}`;
    const dropdown = document.getElementById(dropdownId);

    if (this.activeDropdown && this.activeDropdown !== dropdownId) {
      const previousDropdown = document.getElementById(this.activeDropdown);
      if (previousDropdown) {
        previousDropdown.classList.remove('show');
      }
    }

    if (dropdown) {
      dropdown.classList.toggle('show');
      this.activeDropdown = dropdown.classList.contains('show') ? dropdownId : null;

      // Check if the dropdown is going outside the table or behind the footer
      const rect = dropdown.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownContentHeight = dropdown.offsetHeight;
      const tableContainer = document.querySelector('.products__table-container');
      const tableBottom = tableContainer ? tableContainer.getBoundingClientRect().bottom : viewportHeight;

      if (rect.bottom > viewportHeight || (rect.bottom + dropdownContentHeight > tableBottom)) {
        dropdown.classList.add('upwards');
      } else {
        dropdown.classList.remove('upwards');
      }
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (this.activeDropdown) {
      const dropdown = document.getElementById(this.activeDropdown);
      if (dropdown && !dropdown.contains(event.target as Node)) {
        dropdown.classList.remove('show');
        this.activeDropdown = null;
      }
    }
  }

  onEdit(productId: string) {
    alert(`Editar producto con ID: ${productId}`);
    // Aquí iría la lógica para editar el producto
  }

  onDelete(productId: string) {
    const confirmed = confirm(`¿Estás seguro de que deseas eliminar el producto con ID: ${productId}?`);
    if (confirmed) {
      // Aquí iría la lógica para eliminar el producto
      alert(`Producto con ID: ${productId} eliminado`);
    }
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [RouterModule.forRoot([])], // Configura el enrutador para pruebas
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to home on navigateToHome call', () => {
        const navigateSpy = spyOn(router, 'navigate');

        component.navigateToHome();

        expect(navigateSpy).toHaveBeenCalledWith(['']);
    });

    it('should navigate to home on header click', () => {
        const navigateSpy = spyOn(component, 'navigateToHome');

        const headerElement = fixture.nativeElement.querySelector('.header');
        headerElement.click();

        expect(navigateSpy).toHaveBeenCalled();
    });
});

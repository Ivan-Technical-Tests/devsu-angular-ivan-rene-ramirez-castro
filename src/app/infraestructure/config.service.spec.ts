import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment.development';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ConfigService],
        });
        service = TestBed.inject(ConfigService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the API URL from environment', () => {
        const expectedApiUrl = environment.apiUrl;
        expect(service.apiUrl).toBe(expectedApiUrl);
    });
});

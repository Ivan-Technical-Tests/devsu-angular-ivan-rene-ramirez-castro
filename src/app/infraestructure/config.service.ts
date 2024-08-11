import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable()
export class ConfigService {
    public get apiUrl(): string {
        return environment.apiUrl;
    }
}

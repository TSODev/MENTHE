import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
    public intercept = (request: HttpRequest<any>, next: HttpHandler) => {
        return next.handle(request.clone({
            setHeaders: {
                accept: 'application/json',
                'accept-language': 'en',
                'content-type': 'application/json'
            },
            withCredentials: true
        }));
    }
}

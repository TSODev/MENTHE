import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Article } from '../_models/article';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class ArticleService {


    constructor(private http: HttpClient) { }

    getAllArticles() {
        console.log('Get All Articles');
        return this.http.get<Article[]>(environment.APIEndpoint + '/api/v1/articles')
            .pipe(map(resp => resp['articles'])) as Observable<Article[]>;
    }


    getArticleById(id: string) {
        return this.http.get<Article>(environment.APIEndpoint + '/api/v1/article/' + id)
        .pipe(map(resp => resp['article'])) as Observable<Article>;
    }

    update(article: Article) {
        return this.http.put(environment.APIEndpoint + '/api/v1/article/' + article.article_id, article);
    }

    delete(id: string) {
        return this.http.delete(environment.APIEndpoint + '/api/v1/article/' + id, {
            observe: 'response',
            responseType: 'text'
        })
        .pipe(map(response => {
            return response;
        }));
    }
}

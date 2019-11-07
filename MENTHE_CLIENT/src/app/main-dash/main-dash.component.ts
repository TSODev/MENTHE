import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Article } from '../_models/article';
import { ArticleService} from '../_services/article.service';
import { AlertService } from '../_services';

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})
export class MainDashComponent implements OnInit {

  articles: Article[];

  constructor(
    private articleService: ArticleService,
    private alert: AlertService,
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.articleService.getAllArticles().subscribe(
      articles => this.articles = articles
    );
  }
}

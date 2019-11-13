import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../_models/article';
import { ArticleService } from '../_services/article.service';
import { AlertService } from '../_services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})
export class MainDashComponent implements OnInit, OnDestroy {
  articles: Article[];
  subs = new SubSink();

  constructor(
    private articleService: ArticleService,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadArticles() {
    this.subs.add(
      this.articleService
        .getAllArticles()
        .subscribe(articles => (this.articles = articles))
    );
  }
}

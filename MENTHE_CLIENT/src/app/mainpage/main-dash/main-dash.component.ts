import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../../_models/article';
import { ArticleService } from '../../_services/article.service';
import { AlertService } from '../../_services';
import { Workflow } from '../../_models/workflow';
import { WorkflowService } from '../../_services/workflow.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dash',
  templateUrl: './main-dash.component.html',
  styleUrls: ['./main-dash.component.css']
})
export class MainDashComponent implements OnInit, OnDestroy {
  articles: Article[];
  workflows: Workflow[];
  subs = new SubSink();

  constructor(
    private articleService: ArticleService,
    private workflowService: WorkflowService,
    private route: Router,
    private alert: AlertService
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadArticles() {
    // this.subs.add(
    //   this.articleService
    //     .getAllArticles()
    //     .subscribe(articles => (this.articles = articles))
    // );

    this.subs.add(
      this.workflowService.getAllWorkflow().subscribe(
        workflows => this.workflows = workflows
      )
    );
  }

  editWorkflow(workflow: Workflow) {
    console.log("should edit wf id : ", workflow.workflow_id);
//    this.route.navigate('/workflowcreate',{queryParams: {workflow: workflow.workflow_id}});
  }

  deleteWorkflow(workflow: Workflow) {
    console.log("delete wf id : ", workflow.workflow_id);
  }
}

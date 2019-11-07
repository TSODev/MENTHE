import { Request, Response } from 'express';

import { db } from '../../services/articles.service';
import l from '../../../common/logger';

import { IArticle } from '../../models/articles.model';

export class articleControler {

    async allArticles(req: Request, res:Response){
        const articles = await db.findAllArticles();
        res.status(200).json({articles: articles});
    }

    async createArticle(req: Request, res: Response): Promise<void> {
        const article_data = req.body;
        l.debug('Create Article : ', article_data);
        try {
            const article = await db.createArticle(article_data);
            res.status(200).json({article: article});
        } catch (error) {
            res.status(500).json({error: "Article already exist in database"});
        }
    }

    async getArticle(req: Request, res: Response){
        l.debug("looking for article (id): ",req['articleId']);
        const article: IArticle = await db.findArticleById(req["articleId"].sub);
        if (article) {
            res.status(200).json({article: article});
        } else {
            res.sendStatus(204);
        }
    }

    async getArticleById(req: Request, res: Response){
        const id = req.params['id'];
        l.debug("looking for articleId: ", id);
        const article = await db.findArticleById(id);
        if (article) {
          res.status(200).json({article: article});
        } else {
          res.sendStatus(204);
        }
      }
 
      async deleteArticle(req: Request, res:Response){
        l.debug('Request for delete articleId:', req.params.id);
        const article = await db.deleteArticle(req.params.id)
          .catch(err => res.sendStatus(500));
        res.sendStatus(201);
      }
}

export default new articleControler();
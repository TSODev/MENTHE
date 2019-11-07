

import l from '../../common/logger';
import mongoose from 'mongoose';
import { Article, ArticleSchema, IArticle } from '../models/articles.model';


class InMongoDatabase {

    async createArticle(data: IArticle) {
        const articlePerId = await db.findArticleById(data.article_id)
           if (articlePerId) {
               const message = "This Article id already exist in database";
                l.error(message);
                throw new Error(message);
           } 
        const id = this.uuidv4();

        let article = new Article({
            article_id: id,
            domain: data.domain,
            company: data.company,
            title: data.title,
            image: data.image,
            content: data.content,
            createData: Date.now(),
            createBy: data.createDate,
            lastModifiedDate: Date.now(),
            lastModifiedBy: data.lastModifiedBy
        });
        l.debug(article);
        article.save();
        return article;
    }

   async findArticleById(articleId:string){
        return await Article.findOne({article_id: articleId});
    }

    async findAllArticles() {
        return await Article.find();
    }

    async deleteArticle(id: string) {
        l.debug('Deleting Article Id : ', id);
        return await Article.findOneAndDelete({article_id: id});
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }

}


export const db = new InMongoDatabase();



import { Model, Schema, Document, model } from 'mongoose';

export interface IArticle {
    article_id: string,
    domain: string,
    company: string,
    title: string,
    image: string,
    content: string,
    createDate: Date,
    createdBy: string,
    lastModifiedDate: Date,
    lastModifiedBy: string,
}

export interface IArticleModel extends IArticle, Document {}

export const ArticleSchema: Schema = new Schema({
    article_id: String,
    domain: String,
    company: String,
    title: String,
    image: String,
    content: String,
    createDate: Date,
    createdBy: String,
    lastModifiedDate: Date,
    lastModifiedBy: String
});


export const Article: Model<IArticleModel> = model<IArticleModel>("Article", ArticleSchema)
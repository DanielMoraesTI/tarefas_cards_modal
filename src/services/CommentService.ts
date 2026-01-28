import { Comment } from '../models/Comment.js';

export class CommentService {
    private comments: Comment[] = [];
    private nextId: number = 1;

    public addComment(taskId: number, userId: number, message: string): Comment {
        const newComment = new Comment(this.nextId++, taskId, userId, message);
        this.comments.push(newComment);
        return newComment;
    }

    public getComments(taskId: number): Comment[] {
        return this.comments.filter(c => (c as any).taskId === taskId);
    }

    public removeComment(commentId: number): void {
        this.comments = this.comments.filter(c => (c as any).id !== commentId);
        console.log(`Comentário ${commentId} removido com sucesso.`);
    }

    public deleteComment(commentId: number): void {
        this.removeComment(commentId);
    }
}
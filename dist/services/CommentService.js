import { Comment } from '../models/Comment.js';
export class CommentService {
    comments = [];
    nextId = 1;
    addComment(taskId, userId, message) {
        const newComment = new Comment(this.nextId++, taskId, userId, message);
        this.comments.push(newComment);
        return newComment;
    }
    getComments(taskId) {
        return this.comments.filter(c => c.taskId === taskId);
    }
    removeComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
        console.log(`Comentário ${commentId} removido com sucesso.`);
    }
    deleteComment(commentId) {
        this.removeComment(commentId);
    }
}

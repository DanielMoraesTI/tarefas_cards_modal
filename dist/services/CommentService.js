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
    /**
     * Remove um comentário da lista.
     * Alterado para 'removeComment' para coincidir com a chamada no renderTask.ts
     */
    removeComment(commentId) {
        this.comments = this.comments.filter(c => c.id !== commentId);
        console.log(`Comentário ${commentId} removido com sucesso.`);
    }
    // Mantive este caso queira usar em outros lugares do sistema
    deleteComment(commentId) {
        this.removeComment(commentId);
    }
}

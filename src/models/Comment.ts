import { BaseEntity } from './BaseEntity.js';

export class Comment extends BaseEntity {
    constructor(
        id: number,
        public taskId: number,
        public userId: number,
        public message: string
    ) {
        super(id);
    }
}
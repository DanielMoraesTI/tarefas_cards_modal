import { BaseEntity } from './BaseEntity.js';

export class Attachment extends BaseEntity {
    constructor(
        id: number,
        public taskId: number,
        public filename: string,
        public size: string,
        public url: string,
    ) {
        super(id);
    }
}
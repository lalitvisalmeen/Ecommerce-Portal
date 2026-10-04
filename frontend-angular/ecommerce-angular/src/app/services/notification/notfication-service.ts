import { Service, signal } from '@angular/core';

@Service()
export class NotficationService {

    message = signal<string>('');
    type = signal<'success' | 'danger'>('success');

    show(message: string, type: 'success' | 'danger') {
        this.message.set(message);
        this.type.set(type);
    }

    clear() {
        this.message.set('');
    }
}

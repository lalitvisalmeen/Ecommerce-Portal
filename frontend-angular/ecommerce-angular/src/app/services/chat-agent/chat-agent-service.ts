import { inject, Service } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ChatRequest } from '../../common/chat-agent/chat-request';
import { ChatMessage } from '../../models/chat-message';

@Service()
export class ChatAgentService {

    httpClient = inject(HttpClient);

    conversationId: string = crypto.randomUUID();

    private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    // we are encaspsulating subject, so that other services or component cannot do next on it. 
    messages$ = this.messagesSubject.asObservable();

    sendUserPromptToModel(chatRequest: ChatRequest): Observable<string> {

        let newMessage:ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: chatRequest.message
        }
        this.messagesSubject.next([
            ...this.messagesSubject.value,
            newMessage
        ])
        // use the tap and pipe to store the response to messagesSubject. So that when the component runs, it can identify the changes
        return this.httpClient.post<string>(`${environment.backendApiUrl}/chat`, chatRequest, { responseType: 'text' })
            .pipe(tap(response => {
                this.messagesSubject.next([
                    ...this.messagesSubject.value,
                    {
                        id: crypto.randomUUID(),
                        role: 'assistant',
                        content: response
                    }
                ])
            }));
    }

    resetConversation(): void{
        // reset the conversation id to new id
        this.conversationId = crypto.randomUUID();
        // clear the messages history
        this.messagesSubject.next([]);
    }
}

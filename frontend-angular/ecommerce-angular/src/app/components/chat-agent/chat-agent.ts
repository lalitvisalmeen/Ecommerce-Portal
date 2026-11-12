import { Component, DestroyRef, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ChatAgentService } from '../../services/chat-agent/chat-agent-service';
import { ChatRequest } from '../../common/chat-agent/chat-request';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../../models/chat-message';
import { Subject, switchMap, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment.development';

@Component({
  imports: [FormsModule],
  selector: 'app-chat-agent',
  styleUrl: './chat-agent.css',
  templateUrl: './chat-agent-new.html',
})
export class ChatAgent {
  private chatAgentService = inject(ChatAgentService);
  private destroyRef = inject(DestroyRef);
  private activity$ = new Subject<void>();

  private readonly INACTIVITY_TIMEOUT = environment.inactivityTimeout;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  userMessage = '';
  loading = false;
  errorMessage = signal<string>('');

  messages = signal<ChatMessage[]>([]);
  chatOpen = signal<boolean>(false);
  inactivityNotification = signal<string>('');


  suggestedQuestions = [
    'What products do you recommend?',
    'Show me some products under $50',
    'What is your return policy?'
  ];

  ngOnInit() {
    // subscribe to the service class messages$ to get the latest list of messages
    this.chatAgentService.messages$.subscribe((message) => {
      this.messages.set(message);
    });

    // we need to restart the new timer whenever user is making an activity within the chat bot.
    // also we are using takeUntilDestroyed to unsubscribe from an observable  when the component or service is destroyed
    this.activity$.pipe(
      switchMap(() => timer(this.INACTIVITY_TIMEOUT)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      console.log('Shopping assistant inactive for 15 minutes');
      // conversation is idle for 15 mins. so reset the conversation to new
      this.chatAgentService.resetConversation();
      this.inactivityNotification.set('Your conversation was cleared after 15 minutes of inactivity.');
      this.errorMessage.set('');

    });

  }

  sendMessage(message?: string): void {

    const prompt = (message ?? this.userMessage).trim();

    if (!prompt || this.loading) {
      return;
    }

    this.activity$.next();
    if(this.inactivityNotification()){
        this.inactivityNotification.set('');
    }
    this.userMessage = '';
    this.errorMessage.set('');
    this.loading = true;

    const chatRequest: ChatRequest = new ChatRequest(prompt, this.chatAgentService.conversationId);

    this.scrollToBottom();

    this.chatAgentService.sendUserPromptToModel(chatRequest)
      .subscribe({
        next: (response) => {
          console.log("got the response", response)
          this.activity$.next();
          this.loading = false;
          this.scrollToBottom();
        },

        error: (error) => {
          console.error('Chat request failed', error);
          this.errorMessage.set('Something went wrong. Please try again.');
          this.loading = false;
        }
      });
  }

  useSuggestion(question: string): void {
    this.sendMessage(question);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  handleEnter(event: KeyboardEvent): void {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key !== 'Enter' || keyboardEvent.shiftKey) {
      return;
    }

    keyboardEvent.preventDefault();
    this.sendMessage();
  }

  toggleChat() {
    // update will give the current signal value and arrow function takes that as the parameter
    // open is the currentvalue of chatOpen signal.
    this.chatOpen.update(open => !open);
  }
}




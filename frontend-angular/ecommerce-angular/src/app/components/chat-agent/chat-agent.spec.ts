import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAgent } from './chat-agent';

describe('ChatAgent', () => {
  let component: ChatAgent;
  let fixture: ComponentFixture<ChatAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatAgent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

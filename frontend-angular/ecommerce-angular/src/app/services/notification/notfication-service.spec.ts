import { TestBed } from '@angular/core/testing';
import { NotficationService } from './notfication-service';

describe('NotficationService', () => {
  let service: NotficationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotficationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

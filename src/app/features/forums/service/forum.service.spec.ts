import { TestBed } from '@angular/core/testing';

import { ForumsService } from './forum.service';

describe('ForumsService', () => {
  let service: ForumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

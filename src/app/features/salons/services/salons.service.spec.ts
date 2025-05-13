import { TestBed } from '@angular/core/testing';

import { SalonsService } from './salons.service';

describe('SalonsService', () => {
  let service: SalonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

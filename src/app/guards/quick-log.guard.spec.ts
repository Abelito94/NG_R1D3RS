import { TestBed } from '@angular/core/testing';

import { QuickLogGuard } from './quick-log.guard';

describe('QuickLogGuard', () => {
  let guard: QuickLogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QuickLogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMyTweetsComponent } from './home-my-tweets.component';

describe('HomeMyTweetsComponent', () => {
  let component: HomeMyTweetsComponent;
  let fixture: ComponentFixture<HomeMyTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeMyTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeMyTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

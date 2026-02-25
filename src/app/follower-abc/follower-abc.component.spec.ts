import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerABCComponent } from './follower-abc.component';

describe('FollowerABCComponent', () => {
  let component: FollowerABCComponent;
  let fixture: ComponentFixture<FollowerABCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowerABCComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerABCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

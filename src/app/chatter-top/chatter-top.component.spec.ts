import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatterTopComponent } from './chatter-top.component';

describe('ChatterTopComponent', () => {
  let component: ChatterTopComponent;
  let fixture: ComponentFixture<ChatterTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatterTopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatterTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

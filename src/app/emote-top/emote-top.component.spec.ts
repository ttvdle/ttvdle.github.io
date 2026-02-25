import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoteTopComponent } from './emote-top.component';

describe('EmoteTopComponent', () => {
  let component: EmoteTopComponent;
  let fixture: ComponentFixture<EmoteTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmoteTopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmoteTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

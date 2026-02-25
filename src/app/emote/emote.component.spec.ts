import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmoteComponent } from './emote.component';

describe('EmoteComponent', () => {
  let component: EmoteComponent;
  let fixture: ComponentFixture<EmoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelChoiceComponent } from './channel-choice.component';

describe('ChannelChoiceComponent', () => {
  let component: ChannelChoiceComponent;
  let fixture: ComponentFixture<ChannelChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelChoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

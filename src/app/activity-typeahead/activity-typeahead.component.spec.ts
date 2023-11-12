import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityTypeaheadComponent } from './activity-typeahead.component';

describe('ActivityTypeaheadComponent', () => {
  let component: ActivityTypeaheadComponent;
  let fixture: ComponentFixture<ActivityTypeaheadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityTypeaheadComponent]
    });
    fixture = TestBed.createComponent(ActivityTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

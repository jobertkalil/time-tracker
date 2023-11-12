import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHoursListComponent } from './user-hours-list.component';

describe('UserHoursListComponent', () => {
  let component: UserHoursListComponent;
  let fixture: ComponentFixture<UserHoursListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserHoursListComponent]
    });
    fixture = TestBed.createComponent(UserHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

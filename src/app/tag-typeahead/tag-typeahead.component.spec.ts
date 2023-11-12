import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagTypeaheadComponent } from './tag-typeahead.component';

describe('TagTypeaheadComponent', () => {
  let component: TagTypeaheadComponent;
  let fixture: ComponentFixture<TagTypeaheadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagTypeaheadComponent]
    });
    fixture = TestBed.createComponent(TagTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

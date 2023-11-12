import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTagsChartComponent } from './tags-chart.component';

describe('TopTagsChartComponent', () => {
  let component: TopTagsChartComponent;
  let fixture: ComponentFixture<TopTagsChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopTagsChartComponent],
    });
    fixture = TestBed.createComponent(TopTagsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoNewComponent } from './todo-new.component';

describe('TodoNewComponent', () => {
  let component: TodoNewComponent;
  let fixture: ComponentFixture<TodoNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'payme-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() onChange = new EventEmitter<boolean>();

  toggle(event: MouseEvent): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange.emit(this.checked);
    event.stopPropagation();
  }
}

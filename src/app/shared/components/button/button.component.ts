import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonSize, ButtonVariant } from '@core/enums/button.enum';

@Component({
  selector: 'payme-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = ButtonVariant.Primary;
  @Input() size: ButtonSize = ButtonSize.Medium;
  @Input() disabled: boolean = false;
}

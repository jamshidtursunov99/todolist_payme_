import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ButtonVariant } from '@core/enums/button.enum';

@Component({
  selector: 'payme-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  btnOutlinedVariant = ButtonVariant.Outlined;
}

import { Component, Input } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService, Size } from 'ngx-spinner';

@Component({
  selector: 'payme-spinner',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  @Input() loading = false;
  @Input() fullscreen = true;
  @Input() type = 'ball-clip-rotate';
  @Input() color = '#fff';
  @Input() bdColor = 'rgba(0, 0, 0, 0.2)';
  @Input() name = 'default';
  @Input() size: Size = 'medium';

  constructor(private spinner: NgxSpinnerService) {}

  public ngOnChanges(): void {
    this.updateSpinnerStatus();
  }

  private updateSpinnerStatus(): void {
    this.loading ? this.spinner.show(this.name) : this.spinner.hide(this.name);
  }
}

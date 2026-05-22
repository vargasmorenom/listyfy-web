import { Component, forwardRef, Input, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TendenciesService } from 'src/app/services/tendencies.service';
import { IonChip, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircle, pricetagOutline, addCircleOutline } from 'ionicons/icons';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonChip, IonIcon, IonLabel, TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label: string = 'newlist.tags';
  @ViewChild('inputEl') inputElRef?: ElementRef<HTMLInputElement>;

  selectedTags: string[] = [];
  inputValue = '';
  filteredSuggestions: string[] = [];
  showDropdown = false;
  private allTags: string[] = [];
  private destroy$ = new Subject<void>();
  readonly MAX_TAGS = 5;

  private onChange = (_value: string) => {};
  onTouched = () => {};

  focusInput() {
    this.inputElRef?.nativeElement?.focus();
  }

  constructor(private tendenciesService: TendenciesService, private elRef: ElementRef) {
    addIcons({ closeCircle, pricetagOutline, addCircleOutline });
  }

  ngOnInit() {
    this.tendenciesService
      .seachTendencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe((tags: any[]) => {
        this.allTags = tags.map((t) => t.name);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string): void {
    if (value) {
      this.selectedTags = value
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    } else {
      this.selectedTags = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput() {
    const query = this.inputValue.trim().toLowerCase();
    if (query.length > 0) {
      this.filteredSuggestions = this.allTags
        .filter((t) => t.toLowerCase().includes(query) && !this.selectedTags.includes(t))
        .slice(0, 6);
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
      this.filteredSuggestions = [];
    }
  }

  selectTag(tag: string) {
    if (this.selectedTags.length >= this.MAX_TAGS || this.selectedTags.includes(tag)) return;
    this.selectedTags = [...this.selectedTags, tag];
    this.inputValue = '';
    this.showDropdown = false;
    this.filteredSuggestions = [];
    this.emitValue();
  }

  createTag() {
    const tag = this.inputValue.trim();
    if (!tag || this.selectedTags.length >= this.MAX_TAGS || this.selectedTags.includes(tag)) return;
    this.selectedTags = [...this.selectedTags, tag];
    this.inputValue = '';
    this.showDropdown = false;
    this.filteredSuggestions = [];
    this.emitValue();
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
    this.emitValue();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      if (this.filteredSuggestions.length > 0) {
        this.selectTag(this.filteredSuggestions[0]);
      } else {
        this.createTag();
      }
    } else if (event.key === 'Backspace' && this.inputValue === '' && this.selectedTags.length > 0) {
      this.removeTag(this.selectedTags[this.selectedTags.length - 1]);
    }
  }

  private emitValue() {
    this.onChange(this.selectedTags.join(', '));
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}

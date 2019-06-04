import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Inicio2Page } from './inicio2.page';

describe('Inicio2Page', () => {
  let component: Inicio2Page;
  let fixture: ComponentFixture<Inicio2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Inicio2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Inicio2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

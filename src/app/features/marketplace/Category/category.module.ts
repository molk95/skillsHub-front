import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AddCategoryComponent } from './component/add-category/add-category.component';
import { UpdCatComponent } from './component/upd-cat/upd-cat.component';
import { CategoryListComponent } from './component/category-list/category-list.component';

@NgModule({
  declarations: [
    AddCategoryComponent,
    UpdCatComponent,
    CategoryListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    AddCategoryComponent,
    UpdCatComponent,
    CategoryListComponent
  ]
})
export class CategoryModule { }

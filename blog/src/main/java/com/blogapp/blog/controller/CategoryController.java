package com.blogapp.blog.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.blogapp.blog.entity.Category;
import com.blogapp.blog.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(
            CategoryService categoryService) {

        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(
            @RequestBody Category category) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    categoryService
                        .createCategory(category)
                );
    }

    @GetMapping
    public ResponseEntity<List<Category>>
            getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category>
            getCategoryById(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                categoryService
                        .getCategoryById(id)
        );
    }
}
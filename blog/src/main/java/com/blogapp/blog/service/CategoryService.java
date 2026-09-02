package com.blogapp.blog.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.blogapp.blog.entity.Category;
import com.blogapp.blog.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(
            CategoryRepository categoryRepository) {

        this.categoryRepository = categoryRepository;
    }

    // Get all categories

    public List<Category> getAllCategories() {

        return categoryRepository.findAll();
    }

    // Create category

    public Category createCategory(
            Category category) {

        if (categoryRepository
                .findByNameIgnoreCase(
                        category.getName()
                )
                .isPresent()) {

            throw new RuntimeException(
                    "Category already exists"
            );
        }

        return categoryRepository.save(category);
    }

    // Get category by ID

    public Category getCategoryById(Long id) {

        return categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Category not found with id: "
                                + id
                        )
                );
    }
}
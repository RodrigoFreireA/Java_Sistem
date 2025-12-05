package com.toylog.controller;

import com.toylog.domain.Product;
import com.toylog.dto.CreateProductRequest;
import com.toylog.dto.ProductDTO;
import com.toylog.repository.ProductRepository;
import com.toylog.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public ProductController(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody CreateProductRequest req) {
        Product p = new Product();
        p.setSku(req.sku);
        p.setName(req.name);
        p.setDescription(req.description);
        p.setCostPrice(req.costPrice);
        p.setSalePrice(req.salePrice);
        p.setStockQuantity(req.stockQuantity);
        p.setMinStockLevel(req.minStockLevel);
        p.setCategory(req.category);

        Product saved = productRepository.save(p);

        ProductDTO dto = toDTO(saved);
        return ResponseEntity.created(URI.create("/api/products/" + saved.getId())).body(dto);
    }

    @GetMapping
    public List<ProductDTO> listAll() {
        List<Product> list = productRepository.findAll();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/low-stock")
    public List<ProductDTO> lowStock() {
        List<Product> list = productRepository.findAll().stream()
                .filter(p -> p.getStockQuantity() < p.getMinStockLevel())
                .collect(Collectors.toList());
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @PostMapping("/{id}/decrease")
    public ResponseEntity<Void> decreaseStock(@PathVariable("id") java.util.UUID id,
                                              @RequestParam int quantity,
                                              @RequestParam(required = false, defaultValue = "system") String username) {
        productService.decreaseStock(id, quantity, username);
        return ResponseEntity.noContent().build();
    }

    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.id = p.getId();
        dto.sku = p.getSku();
        dto.name = p.getName();
        dto.description = p.getDescription();
        dto.costPrice = p.getCostPrice();
        dto.salePrice = p.getSalePrice();
        dto.stockQuantity = p.getStockQuantity();
        dto.minStockLevel = p.getMinStockLevel();
        dto.category = p.getCategory();
        return dto;
    }
}

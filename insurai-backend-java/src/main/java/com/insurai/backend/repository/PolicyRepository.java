package com.insurai.backend.repository;

import com.insurai.backend.model.Policy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findAllByOrderByCreatedAtDesc();
}

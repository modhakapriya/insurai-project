package com.insurai.backend.repository;

import com.insurai.backend.model.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, String> {
    List<Claim> findAllByOrderByCreatedAtDesc();
}

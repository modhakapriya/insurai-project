package com.insurai.backend.repository;

import com.insurai.backend.model.DocumentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<DocumentRecord, String> {
    List<DocumentRecord> findAllByOrderByCreatedAtDesc();
}

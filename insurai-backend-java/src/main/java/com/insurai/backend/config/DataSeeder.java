package com.insurai.backend.config;

import com.insurai.backend.model.Claim;
import com.insurai.backend.model.DocumentRecord;
import com.insurai.backend.model.Policy;
import com.insurai.backend.model.UserAccount;
import com.insurai.backend.repository.ClaimRepository;
import com.insurai.backend.repository.DocumentRepository;
import com.insurai.backend.repository.PolicyRepository;
import com.insurai.backend.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserAccountRepository userRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserAccountRepository userRepository,
                      PolicyRepository policyRepository,
                      ClaimRepository claimRepository,
                      DocumentRepository documentRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new UserAccount("u_admin", "admin@insurai.com", passwordEncoder.encode("admin123")));
        }

        if (policyRepository.count() == 0) {
            policyRepository.save(new Policy("POL-2026-CP2K", "priya", "Health Insurance", "34000", "45000", "Active", "4.4/10", "Standard"));
            policyRepository.save(new Policy("POL-2026-42YX", "priya", "Life Insurance", "45000", "34000", "Active", "3.8/10", "Standard"));
            policyRepository.save(new Policy("POL-2026-EW5V", "shruthi", "Health Insurance", "34000", "35000", "Active", "4.4/10", "Standard"));
            policyRepository.save(new Policy("POL-2026-MOZ1", "jhon", "Property Insurance", "56000", "23000", "Active", "5.5/10", "Review Required"));
        }

        if (claimRepository.count() == 0) {
            claimRepository.save(new Claim("CL-2024-2847", "Sarah Johnson", "Health", "$12,500", "Approved", "95%", "2026-02-28", "2-3 days"));
            claimRepository.save(new Claim("CL-2024-2848", "Michael Chen", "Auto", "$8,750", "Pending", "88%", "2026-03-05", "Under review"));
        }

        if (documentRepository.count() == 0) {
            documentRepository.save(new DocumentRecord("DOC-001", "medical_report_johnson.pdf", "Medical Record", "2.4 MB", "2026-03-07 09:23", "Processed", "98%"));
            documentRepository.save(new DocumentRecord("DOC-002", "accident_report_chen.jpg", "Accident Report", "1.8 MB", "2026-03-07 10:15", "Processing", "--"));
        }
    }
}

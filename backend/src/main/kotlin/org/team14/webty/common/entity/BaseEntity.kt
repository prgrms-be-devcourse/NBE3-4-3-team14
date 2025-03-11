package org.team14.webty.common.entity

import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.MappedSuperclass
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@EntityListeners(AuditingEntityListener::class)
@MappedSuperclass
open class BaseEntity {
    @CreatedDate
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false,
    )
    var createdAt: LocalDateTime? = null

    @LastModifiedDate
    @Column(name = "modified_at", nullable = false, columnDefinition = "datetime DEFAULT CURRENT_TIMESTAMP")
    var modifiedAt: LocalDateTime? = null
}
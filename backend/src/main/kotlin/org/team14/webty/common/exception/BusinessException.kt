package org.team14.webty.common.exception

class BusinessException(
    val errorCode: ErrorCode,
    message: String = errorCode.message
) : RuntimeException(message)
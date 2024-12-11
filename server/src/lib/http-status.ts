import type { Context } from 'hono'

// Enum for HTTP Status Codes
enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,

  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// Human-Readable Status Mapping (Static Map)
const statusMap = {
  // Success Responses
  success: {
    statusCode: HttpStatusCode.OK,
    message: 'Operation completed successfully',
    success: true,
  },
  created: {
    statusCode: HttpStatusCode.CREATED,
    message: 'Resource created successfully',
    success: true,
  },
  accepted: {
    statusCode: HttpStatusCode.ACCEPTED,
    message: 'Request accepted for processing',
    success: true,
  },
  no_content: {
    statusCode: HttpStatusCode.NO_CONTENT,
    message: 'No content to return',
    success: true,
  },

  // Client Error Responses
  bad_request: {
    statusCode: HttpStatusCode.BAD_REQUEST,
    message: 'Invalid request parameters',
    success: false,
  },
  unauthorized: {
    statusCode: HttpStatusCode.UNAUTHORIZED,
    message: 'Authentication required or credentials invalid',
    success: false,
  },
  forbidden: {
    statusCode: HttpStatusCode.FORBIDDEN,
    message: 'You do not have permission to access this resource',
    success: false,
  },
  not_found: {
    statusCode: HttpStatusCode.NOT_FOUND,
    message: 'Requested resource could not be found',
    success: false,
  },
  conflict: {
    statusCode: HttpStatusCode.CONFLICT,
    message: 'Request conflicts with current state of the resource',
    success: false,
  },

  // Server Error Responses
  server_error: {
    statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: 'An unexpected error occurred on the server',
    success: false,
  },
  bad_gateway: {
    statusCode: HttpStatusCode.BAD_GATEWAY,
    message: 'Invalid response from upstream server',
    success: false,
  },
  service_unavailable: {
    statusCode: HttpStatusCode.SERVICE_UNAVAILABLE,
    message: 'Service is temporarily unavailable',
    success: false,
  },
}

// Get Default Message for Status Code
function getDefaultMessageForCode(code: HttpStatusCode): string {
  switch (code) {
    case HttpStatusCode.OK: {
      return 'Operation successful'
    }
    case HttpStatusCode.CREATED: {
      return 'Resource created'
    }
    case HttpStatusCode.BAD_REQUEST: {
      return 'Invalid request'
    }
    case HttpStatusCode.UNAUTHORIZED: {
      return 'Authentication failed'
    }
    case HttpStatusCode.FORBIDDEN: {
      return 'Access denied'
    }
    case HttpStatusCode.NOT_FOUND: {
      return 'Resource not found'
    }
    case HttpStatusCode.INTERNAL_SERVER_ERROR: {
      return 'Server error'
    }
    default: {
      return 'Unexpected status'
    }
  }
}

// Custom Response Generator Function

function respondHandler(
  c: Context,
  type: keyof typeof statusMap,
  customMessage?: string,
  data?: unknown
) {
  const statusResponse = statusMap[type]

  return c.json(
    {
      status: statusResponse.statusCode,
      success: statusResponse.success,
      message: customMessage || statusResponse.message,
      data: data || null,
    },
    statusResponse.statusCode
  )
}

// Dynamic Status Code Handler Function
function customStatus(
  c: Context,
  statusCode: HttpStatusCode,
  message?: string,
  data?: unknown
) {
  const isSuccess = statusCode >= 200 && statusCode < 300

  return c.json(
    {
      status: statusCode,
      success: isSuccess,
      message: message || getDefaultMessageForCode(statusCode),
      data: data || null,
    },
    statusCode
  )
}

// Custom Error Handling Middleware Function
function errorMiddleware(error: Error, c: Context) {
  console.error('Unhandled Error:', error)

  return customStatus(
    c,
    HttpStatusCode.INTERNAL_SERVER_ERROR,
    'Unexpected server error occurred'
  )
}

// Export functions for use in other modules
export { customStatus, errorMiddleware, HttpStatusCode, respondHandler }

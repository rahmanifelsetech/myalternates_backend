# Client API Documentation

This document outlines the API endpoints, request payloads, and response structures for the application.

## Base URL
All endpoints are relative to the base URL (e.g., `http://localhost:3000/api` or as configured).

## Response Formats

### Single Response
Used for creating, updating, or retrieving a single item.
```json
{
  "statusCode": 200, // or 201
  "message": "Operation successful",
  "data": {
    // ... item object
  }
}
```

### Paginated Response
Used for list endpoints.
```json
{
  "statusCode": 200,
  "message": "Items retrieved successfully",
  "data": [
    // ... array of items
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Empty Response
Used for delete operations.
```json
{
  "statusCode": 200,
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "statusCode": 404, // or 400, 401, 403, 500
  "message": "Error message description",
  "error": "Not Found" // or Bad Request, etc.
}
```

---

## File Uploads / Multipart Form Data

For any endpoint that requires file uploads (e.g., logos, documents), the client must send the request with `Content-Type: multipart/form-data`. This means you'll use the `FormData` API in JavaScript.

**General Structure for File Uploads:**

```javascript
// Assuming 'fileInput' is your file input element (<input type="file" />)
const file = fileInput.files[0];

// All other non-file data (your DTO fields)
const otherData = {
  fieldName1: "value1",
  fieldName2: "value2",
  // ... any other fields
};

const formData = new FormData();

// Append the file(s) - the field name here must match the backend's @UploadedFile() decorator argument
if (file) {
  formData.append('fileFieldName', file); // e.g., 'logo' for AMC, 'document' for other uploads
}

// Append all other non-file fields
for (const key in otherData) {
  formData.append(key, otherData[key]);
}

// Send the formData using fetch or Axios
// IMPORTANT: Do NOT manually set 'Content-Type' header. The browser will handle it.
fetch('/your-api-endpoint', {
  method: 'POST', // or 'PUT'
  body: formData,
  headers: {
    'Authorization': 'Bearer YOUR_AUTH_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Backend Storage Structure:**

Files are stored in the `./storage` directory on the server, organized by `appType` and then `category`.

*   `appType`: This will typically be extracted from the authenticated user's `appType` (e.g., `admin`, `investor`, `distributor`).
*   `category`: This defines the specific type of upload (e.g., `amc-logos`, `investor-documents`, `scheme-docs`).

The URL returned by the backend for a saved file will reflect this structure, e.g., `/admin/amc-logos/amc-logo-123456789.png`.

---

## AMC Module

### 1. AMCs

#### Get All AMCs
- **Endpoint:** `GET /amcs`
- **Query Params:**
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `search` (string, optional) - Search by name or amcCode
  - `orderBy` (string, optional, default: 'createdAt')
  - `orderDirection` (string, optional: 'asc' | 'desc', default: 'desc')
- **Response:** Paginated Response containing AMC objects.

#### Get AMC by ID
- **Endpoint:** `GET /amcs/:id`
- **Response:** Single Response containing AMC object.
- **Errors:** 404 Not Found if ID does not exist.

#### Create AMC
- **Endpoint:** `POST /amcs`
- **Request Type:** `multipart/form-data` (Refer to the [File Uploads](#file-uploads--multipart-form-data) section for details.)
- **File Field Name:** `logo`
- **Body Fields:** All fields from `CreateAmcDto` (e.g., `name`, `amcCode`, `shortName`, `about`, `color`, `inceptionDate`, etc.) should be sent as form fields.
- **Response:** Single Response containing created AMC.

#### Update AMC
- **Endpoint:** `PUT /amcs/:id`
- **Request Type:** `multipart/form-data` (Refer to the [File Uploads](#file-uploads--multipart-form-data) section for details.)
- **File Field Name:** `logo`
- **Body Fields:** All fields from `UpdateAmcDto` you wish to update (e.g., `name`, `shortName`, `about`, `color`, etc.) should be sent as form fields.
- **Response:** Single Response containing updated AMC.
- **Errors:** 404 Not Found.

#### Delete AMC
- **Endpoint:** `DELETE /amcs/:id`
- **Response:** Empty Response.
- **Errors:** 404 Not Found.

---

## Authentication

### Sign-In with Password
- **Endpoint:** `POST /auth/signin/password`
- **Request Payload:**
  ```json
  {
    "identifier": "string", // Can be PAN, email, or phone
    "password": "string"
  }
  ```
- **Success Response:** `AuthResponse` (user object and access token)

### Sign-In with OTP

#### Step 1: Send OTP
- **Endpoint:** `POST /auth/otp/send`
- **Request Payload:**
  ```json
  {
    "identifier": "string" // Can be email or phone
  }
  ```
- **Success Response:** A success message indicating the OTP has been sent.

#### Step 2: Sign In with OTP
- **Endpoint:** `POST /auth/signin/otp`
- **Request Payload:**
  ```json
  {
    "identifier": "string", // The email or phone used in Step 1
    "otp": "string" // The 6-digit OTP entered by the user
  }
  ```
- **Success Response:** `AuthResponse` (user object and access token)

### Forgot Password

#### Step 1: Send Password Reset OTP
- **Endpoint:** `POST /auth/otp/send` (Same as sign-in OTP)
- **Request Payload:**
  ```json
  {
    "identifier": "string" // Email or phone
  }
  ```

#### Step 2: Verify Password Reset OTP
- **Endpoint:** `POST /auth/otp/verify`
- **Request Payload:**
  ```json
  {
    "identifier": "string",
    "otp": "string"
  }
  ```
- **Success Response:**
  ```json
  {
    "reset_token": "string"
  }
  ```

#### Step 3: Reset Password
- **Endpoint:** `POST /auth/reset-password`
- **Request Payload:**
  ```json
  {
    "reset_token": "string",
    "password": "string",
    "confirmPassword": "string"
  }
  ```
- **Success Response:** A confirmation message.

---

## File Uploads / Multipart Form Data

For any endpoint that requires file uploads (e.g., logos, documents), the client must send the request with `Content-Type: multipart/form-data`. This means you'll use the `FormData` API in JavaScript.

**General Structure for File Uploads:**

```javascript
// Assuming 'fileInput' is your file input element (<input type="file" />)
const file = fileInput.files[0];

// All other non-file data (your DTO fields)
const otherData = {
  fieldName1: "value1",
  fieldName2: "value2",
  // ... any other fields
};

const formData = new FormData();

// Append the file(s) - the field name here must match the backend's @UploadedFile() decorator argument
if (file) {
  formData.append('fileFieldName', file); // e.g., 'logo' for AMC, 'document' for other uploads
}

// Append all other non-file fields
for (const key in otherData) {
  formData.append(key, otherData[key]);
}

// Send the formData using fetch or Axios
// IMPORTANT: Do NOT manually set 'Content-Type' header. The browser will handle it.
fetch('/your-api-endpoint', {
  method: 'POST', // or 'PUT'
  body: formData,
  headers: {
    'Authorization': 'Bearer YOUR_AUTH_TOKEN'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

**Backend Storage Structure:**

Files are stored in the `./storage` directory on the server, organized by `appType` and then `category`.

*   `appType`: This will typically be extracted from the authenticated user's `appType` (e.g., `admin`, `investor`, `distributor`).
*   `category`: This defines the specific type of upload (e.g., `amc-logos`, `investor-documents`, `scheme-docs`).

The URL returned by the backend for a saved file will reflect this structure, e.g., `/storage/admin/amc-logos/images/2025/12/30/logo-1638230400000-123456789.png`.

**Viewing Uploaded Files:**

To view an uploaded file, you will need to construct the full URL by prepending the backend's base URL to the path returned by the API.

For example, if the API returns `/storage/admin/amc-logos/images/2025/12/30/logo-1638230400000-123456789.png` and your backend is running on `http://localhost:3000`, the full URL to the image would be:

`http://localhost:3000/storage/admin/amc-logos/images/2025/12/30/logo-1638230400000-123456789.png`

---

## AMC Module

### 1. AMCs

#### Get All AMCs
- **Endpoint:** `GET /amcs`
- **Query Params:**
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `search` (string, optional) - Search by name or amcCode
  - `orderBy` (string, optional, default: 'createdAt')
  - `orderDirection` (string, optional: 'asc' | 'desc', default: 'desc')
- **Response:** Paginated Response containing AMC objects.

#### Get AMC by ID
- **Endpoint:** `GET /amcs/:id`
- **Response:** Single Response containing AMC object.
- **Errors:** 404 Not Found if ID does not exist.

#### Create AMC
- **Endpoint:** `POST /amcs`
- **Request Type:** `multipart/form-data` (Refer to the [File Uploads](#file-uploads--multipart-form-data) section for details.)
- **File Field Name:** `logo`
- **Body Fields:** All fields from `CreateAmcDto` (e.g., `name`, `amcCode`, `shortName`, `about`, `color`, `inceptionDate`, etc.) should be sent as form fields.
- **Response:** Single Response containing created AMC.

#### Update AMC
- **Endpoint:** `PUT /amcs/:id`
- **Request Type:** `multipart/form-data` (Refer to the [File Uploads](#file-uploads--multipart-form-data) section for details.)
- **File Field Name:** `logo`
- **Body Fields:** All fields from `UpdateAmcDto` you wish to update (e.g., `name`, `shortName`, `about`, `color`, etc.) should be sent as form fields.
- **Response:** Single Response containing updated AMC.
- **Errors:** 404 Not Found.

#### Delete AMC
- **Endpoint:** `DELETE /amcs/:id`
- **Response:** Empty Response.
- **Errors:** 404 Not Found.

---

## Schemes Module

### 1. Schemes

#### Get All Schemes
- **Endpoint:** `GET /schemes`
- **Query Params:**
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `search` (string, optional) - Search by schemeName or schemeCode
  - `orderBy` (string, optional, default: 'createdAt')
  - `orderDirection` (string, optional: 'asc' | 'desc', default: 'desc')
- **Response:** Paginated Response containing Scheme objects.

#### Get Scheme by ID
- **Endpoint:** `GET /schemes/:id`
- **Response:** Single Response containing Scheme object.
- **Errors:** 404 Not Found if ID does not exist.

#### Create Scheme
- **Endpoint:** `POST /schemes`
- **Body Fields:** All fields from `CreateSchemeDto` (e.g., `amcId`, `productId`, `schemeCode`, `schemeName`, `aum`, etc.) should be sent as JSON.
- **Response:** Single Response containing created Scheme.

#### Update Scheme
- **Endpoint:** `PUT /schemes/:id`
- **Body Fields:** All fields from `UpdateSchemeDto` you wish to update (e.g., `schemeName`, `aum`, etc.) should be sent as JSON.
- **Response:** Single Response containing updated Scheme.
- **Errors:** 404 Not Found.

#### Delete Scheme
- **Endpoint:** `DELETE /schemes/:id`
- **Response:** Empty Response.
- **Errors:** 404 Not Found.

---

## Masters Module

### 1. Asset Classes

#### Get All Asset Classes
- **Endpoint:** `GET /masters/asset-classes`
- **Query Params:**
  - `page` (number, optional, default: 1)
  - `limit` (number, optional, default: 10)
  - `search` (string, optional) - Search by name
  - `orderBy` (string, optional, default: 'createdAt')
  - `orderDirection` (string, optional: 'asc' | 'desc', default: 'desc')
- **Response:** Paginated Response containing Asset Class objects.

#### Get Asset Class by ID
- **Endpoint:** `GET /masters/asset-classes/:id`
- **Response:** Single Response containing Asset Class object.
- **Errors:** 404 Not Found if ID does not exist.

#### Create Asset Class
- **Endpoint:** `POST /masters/asset-classes`
- **Body:**
  ```json
  {
    "name": "Equity"
    // other fields defined in schema
  }
  ```
- **Response:** Single Response containing created Asset Class.

#### Update Asset Class
- **Endpoint:** `PUT /masters/asset-classes/:id`
- **Body:**
  ```json
  {
    "name": "Updated Equity"
  }
  ```
- **Response:** Single Response containing updated Asset Class.
- **Errors:** 404 Not Found.

#### Delete Asset Class
- **Endpoint:** `DELETE /masters/asset-classes/:id`
- **Response:** Empty Response.
- **Errors:** 404 Not Found.

---

### 2. Benchmark Indices

#### Get All Benchmark Indices
- **Endpoint:** `GET /masters/benchmark-indices`
- **Query Params:** Same as Asset Classes.
- **Response:** Paginated Response containing Benchmark Index objects.

#### Get Benchmark Index by ID
- **Endpoint:** `GET /masters/benchmark-indices/:id`
- **Response:** Single Response containing Benchmark Index object.

#### Create Benchmark Index
- **Endpoint:** `POST /masters/benchmark-indices`
- **Body:**
  ```json
  {
    "name": "Nifty 50"
  }
  ```
- **Response:** Single Response containing created Benchmark Index.

#### Update Benchmark Index
- **Endpoint:** `PUT /masters/benchmark-indices/:id`
- **Body:**
  ```json
  {
    "name": "Nifty 50 Updated"
  }
  ```
- **Response:** Single Response containing updated Benchmark Index.

#### Delete Benchmark Index
- **Endpoint:** `DELETE /masters/benchmark-indices/:id`
- **Response:** Empty Response.

---

### 3. Fund Managers

#### Get All Fund Managers
- **Endpoint:** `GET /masters/fund-managers`
- **Query Params:** Same as Asset Classes.
- **Response:** Paginated Response containing Fund Manager objects.

#### Get Fund Manager by ID
- **Endpoint:** `GET /masters/fund-managers/:id`
- **Response:** Single Response containing Fund Manager object.

#### Create Fund Manager
- **Endpoint:** `POST /masters/fund-managers`
- **Body:**
  ```json
  {
    "name": "John Doe"
  }
  ```
- **Response:** Single Response containing created Fund Manager.

#### Update Fund Manager
- **Endpoint:** `PUT /masters/fund-managers/:id`
- **Body:**
  ```json
  {
    "name": "Jane Doe"
  }
  ```
- **Response:** Single Response containing updated Fund Manager.

#### Delete Fund Manager
- **Endpoint:** `DELETE /masters/fund-managers/:id`
- **Response:** Empty Response.

---

### 4. Categories

#### Get All Categories
- **Endpoint:** `GET /masters/categories`
- **Query Params:** Same as Asset Classes.
- **Response:** Paginated Response containing Category objects.

#### Get Category by ID
- **Endpoint:** `GET /masters/categories/:id`
- **Response:** Single Response containing Category object.

#### Create Category
- **Endpoint:** `POST /masters/categories`
- **Body:**
  ```json
  {
    "name": "Large Cap"
  }
  ```
- **Response:** Single Response containing created Category.

#### Update Category
- **Endpoint:** `PUT /masters/categories/:id`
- **Body:**
  ```json
  {
    "name": "Mid Cap"
  }
  ```
- **Response:** Single Response containing updated Category.

#### Delete Category
- **Endpoint:** `DELETE /masters/categories/:id`
- **Response:** Empty Response.

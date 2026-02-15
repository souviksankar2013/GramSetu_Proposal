# GramSetu Design Document

## Overview

GramSetu is a mobile-first AI-powered marketplace that revolutionizes rural-urban agricultural supply chains through intelligent community-based logistics. The system leverages hexagonal grid tessellation for geographic organization, machine learning for optimal Padosi Mitra selection, and comprehensive verification mechanisms to ensure trust and transparency in every transaction.

The platform operates on a serverless AWS architecture optimized for scalability, with Android as the primary mobile platform and future iOS expansion planned. The design emphasizes offline-first capabilities to handle rural connectivity challenges while providing real-time coordination for urban delivery networks.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GRAMSETU MOBILE APP                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐      │
│  │Farmer Login │    │Consumer     │    │  Padosi Mitra   │      │
│  │   Portal    │    │   Login     │    │     Role        │      │
│  │             │    │   Portal    │    │  (Consumer+)    │      │
│  └─────────────┘    └─────────────┘    └─────────────────┘      │
│                           (Android)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AWS CLOUD INFRASTRUCTURE                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │ API Gateway │◄──►│   Cognito    │    │      WAF        │    │
│  │             │    │ Role-Based   │    │   Security      │    │
│  │             │    │     Auth     │    │                 │    │
│  └─────────────┘    └──────────────┘    └─────────────────┘    │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              LAMBDA MICROSERVICES                       │   │
│  ├─────────────┬─────────────┬─────────────┬─────────────┤   │
│  │User Service │Product Svc  │Order Service│AI Selection │   │
│  │(Role Mgmt)  │(Catalog)    │(Groups)     │(Padosi AI)  │   │
│  ├─────────────┼─────────────┼─────────────┼─────────────┤   │
│  │Geo Service  │Payment Svc  │Verification │Notification │   │
│  │(Hex Grids)  │(Escrow)     │(Photos/OTP) │(Real-time)  │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┘   │
│           │                       │                           │
│           ▼                       ▼                           │
│  ┌─────────────────┐    ┌─────────────────────────────────┐   │
│  │   AI/ML LAYER   │    │        DATA STORAGE             │   │
│  ├─────────────────┤    ├─────────────────────────────────┤   │
│  │   SageMaker     │    │        DynamoDB                 │   │
│  │ (Padosi Mitra   │    │  (Users, Products, Orders,      │   │
│  │  Selection AI)  │    │   Groups, Trust Scores)         │   │
│  ├─────────────────┤    ├─────────────────────────────────┤   │
│  │  Rekognition    │    │           S3                    │   │
│  │ (Photo Verify   │    │  (Product Photos, Verification  │   │
│  │  & Quality)     │    │   Photos, Documents, Backups)   │   │
│  ├─────────────────┤    ├─────────────────────────────────┤   │
│  │ Location Service│    │         KMS                     │   │
│  │ (Hexagonal      │    │  (End-to-End Encryption)        │   │
│  │  Grid System)   │    │                                 │   │
│  └─────────────────┘    └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────┬─────────────────┬─────────────────────────────┤
│ Payment Gateway │   SNS/Pinpoint  │      Maps API               │
│ (Razorpay/UPI/  │  (Push Notifs,  │   (Geographic Data,         │
│  Paytm/Stripe)  │   SMS, Email)   │    Route Optimization)      │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

**Single App Architecture Principles:**
- **Unified Mobile Experience**: One app with role-based interfaces
- **Dynamic UI**: Interface adapts based on user role (Farmer/Consumer/Padosi Mitra)
- **Serverless Backend**: Lambda microservices for scalability
- **AI-Powered Matching**: Machine learning for optimal Padosi Mitra selection
- **Secure by Design**: End-to-end encryption and multi-factor verification
- **Offline-First**: Handles rural connectivity with sync capabilities

### Microservices Architecture

The system is decomposed into the following core services:

1. **User Management Service**: Authentication, profiles, and identity verification
2. **Product Catalog Service**: Farmer listings, inventory management, and search
3. **Order Management Service**: Order processing, group formation, and lifecycle management
4. **AI Selection Service**: Padosi Mitra selection algorithm and optimization
5. **Geographic Service**: Hexagonal grid management and location processing
6. **Payment Service**: Escrow management, transaction processing, and financial operations
7. **Verification Service**: Photo verification, OTP management, and trust scoring
8. **Notification Service**: Real-time messaging, push notifications, and communication
9. **Analytics Service**: Performance tracking, business intelligence, and reporting

## Components and Interfaces

### Mobile Application Components

#### Single App Architecture
GramSetu is a unified mobile application with role-based access control:

- **Farmer Interface**: Product listing, order management, earnings tracking
- **Consumer Interface**: Product browsing, ordering, group participation  
- **Padosi Mitra Role**: Additional interface for consumers who accept delivery responsibilities

#### Core Mobile Modules
- **Authentication Module**: Role-based login (Farmer/Consumer), Cognito integration, biometric login
- **Role Management Module**: Dynamic UI switching based on user role and current context
- **Camera Module**: Photo capture, compression, offline storage, batch upload
- **Location Module**: GPS tracking, hexagonal grid assignment, offline caching
- **Payment Module**: Gateway integration, offline transaction queuing, receipt management
- **Messaging Module**: In-app chat, group communication, push notification handling
- **Offline Sync Module**: Data synchronization, conflict resolution, background processing

#### User Interface Components by Role

**Farmer Dashboard:**
- Product management and listing creation
- Order tracking and fulfillment status
- Earnings overview and payment history
- Verification photo capture for handovers

**Consumer Marketplace:**
- Product browsing and search functionality
- Order placement and payment processing
- Group participation and communication
- Delivery tracking and confirmation

**Padosi Mitra Interface (Consumer Role Extension):**
- Task acceptance and management
- Route optimization and navigation
- Collection and delivery workflows
- Photo verification for all handovers
- Trust score and reward tracking

### Backend Service Interfaces

#### API Gateway Endpoints
```
/api/v1/auth/*          - Authentication and user management
/api/v1/products/*      - Product catalog operations
/api/v1/orders/*        - Order management and processing
/api/v1/groups/*        - Temporary group operations
/api/v1/selection/*     - Padosi Mitra selection
/api/v1/payments/*      - Payment and escrow operations
/api/v1/verification/*  - Photo and OTP verification
/api/v1/locations/*     - Geographic and routing services
/api/v1/notifications/* - Messaging and alerts
/api/v1/analytics/*     - Reporting and insights
```

#### Lambda Function Architecture
- **Stateless Functions**: Each service operation as independent Lambda
- **Event-Driven Processing**: DynamoDB streams, S3 triggers, scheduled events
- **Cold Start Optimization**: Provisioned concurrency for critical functions
- **Error Handling**: Dead letter queues, retry mechanisms, circuit breakers

## Data Models

### Core Entities

#### User Entity
```json
{
  "userId": "string (UUID)",
  "userType": "farmer | consumer",
  "profile": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "object",
    "identityVerified": "boolean",
    "documents": ["string"] // S3 URLs
  },
  "location": {
    "coordinates": [longitude, latitude],
    "hexagonalGridId": "string",
    "address": "string"
  },
  "trustScore": "number (0-100)",
  "vehicleInfo": {
    "hasVehicle": "boolean",
    "vehicleType": "string",
    "capacity": "number"
  },
  "pasodiMitraHistory": {
    "totalAssignments": "number",
    "completedAssignments": "number",
    "lastAssignmentDate": "timestamp",
    "averageRating": "number"
  },
  "preferences": "object",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Product Entity
```json
{
  "productId": "string (UUID)",
  "farmerId": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "images": ["string"], // S3 URLs
  "pricing": {
    "pricePerUnit": "number",
    "unit": "string (kg, piece, etc.)",
    "minimumOrder": "number"
  },
  "availability": {
    "quantity": "number",
    "harvestDate": "date",
    "expiryDate": "date",
    "availableFrom": "date",
    "availableUntil": "date"
  },
  "location": {
    "farmLocation": [longitude, latitude],
    "deliveryRadius": "number"
  },
  "quality": {
    "organic": "boolean",
    "certifications": ["string"],
    "ratings": "object"
  },
  "status": "active | inactive | sold_out",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Order Entity
```json
{
  "orderId": "string (UUID)",
  "consumerId": "string",
  "farmerId": "string",
  "productId": "string",
  "quantity": "number",
  "totalAmount": "number",
  "status": "pending | grouped | assigned | collected | in_transit | delivered | completed | cancelled",
  "hexagonalGridId": "string",
  "temporaryGroupId": "string",
  "paymentsDetails": {
    "paymentId": "string",
    "escrowStatus": "held | released | refunded",
    "transactionFee": "number"
  },
  "deliveryDetails": {
    "estimatedDelivery": "timestamp",
    "actualDelivery": "timestamp",
    "deliveryAddress": "object"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Temporary Group Entity
```json
{
  "groupId": "string (UUID)",
  "farmerId": "string",
  "hexagonalGridId": "string",
  "members": [{
    "userId": "string",
    "orderId": "string",
    "role": "member | padosi_mitra"
  }],
  "pasodiMitra": {
    "userId": "string",
    "selectionScore": "number",
    "acceptedAt": "timestamp",
    "verificationOTP": "string"
  },
  "status": "forming | active | collecting | delivering | completed | dissolved",
  "timeline": {
    "formationDeadline": "timestamp",
    "collectionTime": "timestamp",
    "deliveryWindow": "object"
  },
  "communication": {
    "chatChannelId": "string",
    "photos": ["string"] // S3 URLs
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### Hexagonal Grid Entity
```json
{
  "gridId": "string",
  "cityId": "string",
  "coordinates": {
    "center": [longitude, latitude],
    "vertices": [[longitude, latitude]],
    "bounds": "object"
  },
  "properties": {
    "populationDensity": "number",
    "averageDeliveryDistance": "number",
    "activeUsers": "number"
  },
  "statistics": {
    "totalOrders": "number",
    "successfulDeliveries": "number",
    "averageGroupSize": "number"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Database Design

#### DynamoDB Tables
- **Users**: Partition key: userId, GSI on hexagonalGridId, userType
- **Products**: Partition key: productId, GSI on farmerId, category, location
- **Orders**: Partition key: orderId, GSI on consumerId, farmerId, temporaryGroupId
- **TemporaryGroups**: Partition key: groupId, GSI on hexagonalGridId, farmerId
- **HexagonalGrids**: Partition key: gridId, GSI on cityId
- **Transactions**: Partition key: transactionId, GSI on orderId, userId
- **Verifications**: Partition key: verificationId, GSI on orderId, userId
- **TrustScores**: Partition key: userId, sort key: timestamp

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">rural-marketplace

### Property Reflection

After analyzing all acceptance criteria, I've identified several areas where properties can be consolidated to eliminate redundancy:

**Consolidation Opportunities:**
- Properties 1.1, 1.2, 1.4 can be combined into a comprehensive "Product listing completeness" property
- Properties 2.3, 5.3, 5.4 can be merged into a single "Payment escrow lifecycle" property  
- Properties 4.2, 4.3 can be combined into "OTP verification and photo capture" property
- Properties 6.1, 6.2, 6.4 can be consolidated into "Trust and security management" property
- Properties 9.1, 9.2 can be merged into "Delivery tracking completeness" property

**Final Property Set:**

Property 1: Product listing completeness
*For any* product listing creation or update, all required fields (details, pricing, availability, location) should be captured, images should be validated and stored securely, and interested consumers should be notified immediately
**Validates: Requirements 1.1, 1.2, 1.4**

Property 2: Inventory constraint preservation
*For any* product with available quantity X, the sum of all confirmed orders should never exceed X
**Validates: Requirements 1.3**

Property 3: Geographic delivery zone accuracy
*For any* farmer location, calculated delivery zones should only include areas within the specified reasonable distance
**Validates: Requirements 1.5**

Property 4: Search result geographic filtering
*For any* consumer search query, all returned products should be from farmers within the consumer's delivery range
**Validates: Requirements 2.1**

Property 5: Hexagonal grid assignment accuracy
*For any* consumer location, the assigned hexagonal grid should be the one containing that geographic coordinate
**Validates: Requirements 2.2**

Property 6: Payment escrow lifecycle
*For any* completed payment, funds should be held in escrow until delivery confirmation, then released to the farmer within 24 hours of all group members confirming receipt
**Validates: Requirements 2.3, 5.3, 5.4**

Property 7: Order timeline provision
*For any* placed order, an estimated delivery timeline should be calculated and provided to the consumer
**Validates: Requirements 2.4**

Property 8: Automatic group formation
*For any* set of consumers from the same hexagonal grid ordering from the same farmer, a temporary group should be created automatically
**Validates: Requirements 2.5**

Property 9: Padosi Mitra analysis completeness
*For any* temporary group formation, all group members should be analyzed and scored for Padosi Mitra suitability
**Validates: Requirements 3.1**

Property 10: Selection algorithm factor inclusion
*For any* Padosi Mitra selection calculation, all specified factors (vehicle availability, trust score, last selection date, geographic proximity, time availability) should be included in the scoring
**Validates: Requirements 3.2**

Property 11: Candidate ranking and presentation
*For any* Padosi Mitra selection, candidates should be ranked by suitability score and the top three options should be presented
**Validates: Requirements 3.3**

Property 12: Fallback selection mechanism
*For any* Padosi Mitra candidate decline, the system should automatically select the next highest-ranked available candidate
**Validates: Requirements 3.4**

Property 13: Group dissolution handling
*For any* temporary group where no member accepts the Padosi Mitra role, the group should be dissolved and orders processed individually
**Validates: Requirements 3.5**

Property 14: OTP verification and photo capture
*For any* Padosi Mitra assignment, unique instructions and OTP should be provided, both parties should verify the OTP before handover, and verification photos should be required from both parties after OTP confirmation
**Validates: Requirements 4.1, 4.2, 4.3**

Property 15: Delivery photo requirements
*For any* product delivery to group members, delivery confirmation photos should be required
**Validates: Requirements 4.4**

Property 16: Completion reward processing
*For any* completed Padosi Mitra assignment, trust score should be updated and agreed discount should be applied to their personal order
**Validates: Requirements 4.5**

Property 17: Real-time photo sharing
*For any* verification photo capture, photos should appear in the group communication channel immediately
**Validates: Requirements 5.1**

Property 18: Targeted delivery photo sharing
*For any* delivery photo capture, the photo should be shared with the correct recipient
**Validates: Requirements 5.2**

Property 19: Group participation choice
*For any* completed order cycle, group members should be given the choice to continue participation or exit
**Validates: Requirements 5.5**

Property 20: Trust and security management
*For any* new user registration, identity should be verified through government documentation, trust scores should consider all specified factors, and fraudulent activity should trigger account suspension
**Validates: Requirements 6.1, 6.2, 6.4**

Property 21: Dispute resolution process
*For any* dispute occurrence, a structured resolution process with evidence collection should be initiated
**Validates: Requirements 6.3**

Property 22: Insurance claim facilitation
*For any* insurance claim need, coverage should be facilitated for damaged or lost products during transport
**Validates: Requirements 6.5**

Property 23: Payment security and processing
*For any* payment processing, secure encrypted gateways should be used, and transparent published rates should be applied for transaction fees
**Validates: Requirements 7.1, 7.5**

Property 24: Escrow interest calculation
*For any* funds held in escrow, interest should be calculated and applied to cover operational costs
**Validates: Requirements 7.2**

Property 25: Payment dispute handling
*For any* payment dispute, relevant funds should be frozen until resolution, and refunds should be processed within 48 hours of approval
**Validates: Requirements 7.3, 7.4**

Property 26: Hexagonal grid generation
*For any* new city addition, optimal hexagonal grid tessellation should be generated based on population density with manageable delivery distances
**Validates: Requirements 8.1, 8.2**

Property 27: Location processing accuracy
*For any* user location processing, assignment to the correct hexagonal grid should occur automatically
**Validates: Requirements 8.3**

Property 28: Route optimization
*For any* delivery route calculation, paths should be optimized for efficiency within and between grids
**Validates: Requirements 8.4**

Property 29: Delivery tracking completeness
*For any* product handover or delivery, timestamp, location, GPS coordinates, and photo evidence should be captured and recorded
**Validates: Requirements 9.1, 9.2**

Property 30: Quality issue tracking and notification
*For any* reported quality issue, patterns should be tracked and relevant farmers should be notified
**Validates: Requirements 9.3**

Property 31: Delay notification system
*For any* delivery delay occurrence, all affected parties should be automatically notified
**Validates: Requirements 9.4**

Property 32: Analytics generation
*For any* system performance measurement, analytics on delivery success rates and user satisfaction should be generated
**Validates: Requirements 9.5**

## Error Handling

### Error Categories and Strategies

#### Network and Connectivity Errors
- **Offline Mode**: Queue operations locally with automatic sync when connectivity returns
- **Partial Connectivity**: Implement progressive data loading and compression
- **Timeout Handling**: Exponential backoff with circuit breaker patterns
- **Rural Connectivity**: SMS fallback for critical notifications

#### Payment and Financial Errors
- **Payment Gateway Failures**: Multiple gateway fallbacks with automatic retry
- **Escrow Management**: Automated reconciliation with manual override capabilities
- **Refund Processing**: Automated processing with exception handling for complex cases
- **Currency and Precision**: Decimal precision handling for financial calculations

#### AI and Selection Errors
- **No Suitable Padosi Mitra**: Fallback to individual delivery or group dissolution
- **Selection Algorithm Failures**: Manual override with admin intervention
- **Scoring Inconsistencies**: Audit trails and recalculation mechanisms
- **Geographic Processing**: Fallback to manual grid assignment

#### Verification and Trust Errors
- **Photo Upload Failures**: Offline storage with batch upload retry
- **OTP Verification Issues**: Regeneration and alternative verification methods
- **Identity Verification Failures**: Manual review process with admin approval
- **Trust Score Calculation**: Error logging with manual recalculation options

#### Data Consistency Errors
- **Concurrent Order Processing**: Optimistic locking with conflict resolution
- **Inventory Synchronization**: Event sourcing with eventual consistency
- **Group Formation Conflicts**: Atomic operations with rollback capabilities
- **Geographic Data Inconsistencies**: Data validation with correction workflows

### Error Recovery Mechanisms

#### Automatic Recovery
- **Retry Policies**: Exponential backoff for transient failures
- **Circuit Breakers**: Prevent cascade failures across services
- **Health Checks**: Automated service monitoring and restart
- **Data Repair**: Background processes for consistency maintenance

#### Manual Intervention
- **Admin Dashboard**: Real-time error monitoring and resolution tools
- **Escalation Procedures**: Automated escalation for critical failures
- **Customer Support**: Integrated ticketing system for user issues
- **Audit Trails**: Comprehensive logging for forensic analysis

## Testing Strategy

### Dual Testing Approach

The GramSetu system requires both unit testing and property-based testing to ensure comprehensive coverage and correctness validation.

#### Unit Testing Strategy
Unit tests will focus on specific examples, integration points, and edge cases:

- **Component Testing**: Individual service functionality with mocked dependencies
- **Integration Testing**: Service-to-service communication and data flow
- **API Testing**: Endpoint validation with various input scenarios
- **Mobile Testing**: UI components, offline functionality, and device-specific features
- **Edge Case Testing**: Boundary conditions, error scenarios, and exceptional flows

**Testing Framework**: Jest for backend services, Detox for mobile application testing

#### Property-Based Testing Strategy
Property-based tests will verify universal properties across all inputs using **fast-check** for JavaScript/TypeScript:

- **Minimum 100 iterations** per property test to ensure statistical confidence
- **Custom generators** for domain-specific data (locations, products, users)
- **Shrinking capabilities** to find minimal failing examples
- **Deterministic testing** with seed control for reproducible results

**Property Test Requirements**:
- Each property-based test MUST be tagged with: **Feature: rural-marketplace, Property {number}: {property_text}**
- Each correctness property MUST be implemented by a SINGLE property-based test
- Tests MUST reference the specific design document property they implement
- Generators MUST create realistic test data within valid system constraints

**Example Property Test Structure**:
```javascript
// **Feature: rural-marketplace, Property 2: Inventory constraint preservation**
test('inventory constraints are never violated', () => {
  fc.assert(fc.property(
    productGenerator(),
    ordersGenerator(),
    (product, orders) => {
      const totalOrdered = orders.reduce((sum, order) => sum + order.quantity, 0);
      return totalOrdered <= product.availableQuantity;
    }
  ), { numRuns: 100 });
});
```

#### Testing Infrastructure
- **AWS Device Farm**: Real device testing for mobile applications
- **Automated CI/CD**: CodeBuild integration with comprehensive test suites
- **Performance Testing**: Load testing for AI selection algorithms and geographic processing
- **Security Testing**: Penetration testing for payment and verification systems
- **Chaos Engineering**: Resilience testing for distributed system failures

#### Test Data Management
- **Synthetic Data Generation**: Realistic test data for all system entities
- **Privacy Compliance**: No production data in testing environments
- **Data Refresh**: Automated test data regeneration and cleanup
- **Geographic Test Data**: Comprehensive coverage of hexagonal grids and locations

### Quality Assurance Metrics
- **Code Coverage**: Minimum 80% for unit tests, 100% property coverage
- **Performance Benchmarks**: Response time and throughput requirements
- **Reliability Metrics**: Uptime, error rates, and recovery time objectives
- **User Experience Metrics**: App performance, offline capability, and usability scores
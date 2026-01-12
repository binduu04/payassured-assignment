## Database Schema

### Clients Table

```
id              SERIAL PRIMARY KEY
client_name     VARCHAR(255) NOT NULL
company_name    VARCHAR(255) NOT NULL
city            VARCHAR(100) NOT NULL
contact_person  VARCHAR(255) NOT NULL
phone           VARCHAR(20) NOT NULL
email           VARCHAR(255) NOT NULL UNIQUE
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Cases Table

```
id                      SERIAL PRIMARY KEY
client_id               INTEGER (FK to clients.id)
invoice_number          VARCHAR(100) UNIQUE
invoice_amount          DECIMAL(12, 2)
invoice_date            DATE
due_date                DATE
status                  VARCHAR(50) (New, In Follow-up, Partially Paid, Closed)
last_follow_up_notes    TEXT
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

## Sample Data

The schema includes sample clients and cases for testing purposes.

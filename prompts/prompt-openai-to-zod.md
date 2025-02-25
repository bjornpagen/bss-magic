i'm writing a transpiler from openapi schema to zod schema. below is a transpilation created by my code.

```input.json
{
  "openapi": "3.0.1",
  "info": {
    "title": "Account Management",
    "description": "Swagger for TMF666 Account Management API",
    "version": "5.0.0"
  },
  "servers": [
    {
      "url": "https://serverRoot"
    }
  ],
  "tags": [
    {
      "name": "partyAccount",
      "description": "Operations for PartyAccount Resource"
    },
    {
      "name": "billingAccount",
      "description": "Operations for BillingAccount Resource"
    },
    {
      "name": "settlementAccount",
      "description": "Operations for SettlementAccount Resource"
    },
    {
      "name": "financialAccount",
      "description": "Operations for FinancialAccount Resource"
    },
    {
      "name": "billFormat",
      "description": "Operations for BillFormat Resource"
    },
    {
      "name": "billPresentationMedia",
      "description": "Operations for BillPresentationMedia Resource"
    },
    {
      "name": "billingCycleSpecification",
      "description": "Operations for BillingCycleSpecification Resource"
    },
    {
      "name": "notification listener",
      "description": "Notifications for Resource Lifecycle and event notifications"
    },
    {
      "name": "events subscription",
      "description": "Endpoints to register and terminate an Event Listener"
    }
  ],
  "paths": {
    "/billingAccount/{id}": {
      "get": {
        "tags": [
          "billingAccount"
        ],
        "summary": "Retrieves a BillingAccount by ID",
        "description": "This operation retrieves a BillingAccount entity. Attribute selection enabled for all first level attributes.",
        "operationId": "retrieveBillingAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/Id"
          },
          {
            "$ref": "#/components/parameters/Fields"
          }
        ],
        "responses": {
          "200": {
            "$ref": "#/components/responses/200BillingAccount_Get"
          },
          "400": {
            "$ref": "#/components/responses/400"
          },
          "401": {
            "$ref": "#/components/responses/401"
          },
          "403": {
            "$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
          },
          "405": {
            "$ref": "#/components/responses/405"
          },
          "500": {
            "$ref": "#/components/responses/500"
          },
          "501": {
            "$ref": "#/components/responses/501"
          },
          "503": {
            "$ref": "#/components/responses/503"
          }
        }
      },
      "patch": {
        "tags": [
          "billingAccount"
        ],
        "summary": "Updates partially a BillingAccount",
        "description": "This operation updates partially a BillingAccount entity.",
        "operationId": "patchBillingAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/Id"
          },
          {
            "$ref": "#/components/parameters/Fields"
          }
        ],
        "requestBody": {
          "$ref": "#/components/requestBodies/BillingAccount_MVO"
        },
        "responses": {
          "200": {
            "$ref": "#/components/responses/200BillingAccount_Patch"
          },
          "202": {
            "description": "Accepted"
          },
          "400": {
            "$ref": "#/components/responses/400"
          },
          "401": {
            "$ref": "#/components/responses/401"
          },
          "403": {
            "$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
          },
          "405": {
            "$ref": "#/components/responses/405"
          },
          "409": {
            "$ref": "#/components/responses/409"
          },
          "500": {
            "$ref": "#/components/responses/500"
          },
          "501": {
            "$ref": "#/components/responses/501"
          },
          "503": {
            "$ref": "#/components/responses/503"
          }
        }
      },
      "delete": {
        "tags": [
          "billingAccount"
        ],
        "summary": "Deletes a BillingAccount",
        "description": "This operation deletes a BillingAccount entity.",
        "operationId": "deleteBillingAccount",
        "parameters": [
          {
            "$ref": "#/components/parameters/Id"
          }
        ],
        "responses": {
          "202": {
            "$ref": "#/components/responses/202"
          },
          "204": {
            "$ref": "#/components/responses/204"
          },
          "400": {
            "$ref": "#/components/responses/400"
          },
          "401": {
            "$ref": "#/components/responses/401"
          },
          "403": {
            "$ref": "#/components/responses/403"
          },
          "404": {
            "$ref": "#/components/responses/404"
          },
          "405": {
            "$ref": "#/components/responses/405"
          },
          "409": {
            "$ref": "#/components/responses/409"
          },
          "500": {
            "$ref": "#/components/responses/500"
          },
          "501": {
            "$ref": "#/components/responses/501"
          },
          "503": {
            "$ref": "#/components/responses/503"
          }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "Id": {
        "name": "id",
        "required": true,
        "schema": {
          "type": "string"
        },
        "in": "path",
        "description": "Identifier of the Resource"
      },
      "Fields": {
        "name": "fields",
        "in": "query",
        "description": "Comma-separated properties to be provided in response",
        "schema": {
          "type": "string"
        }
      }
    },
    "responses": {
      "202": {
        "description": "Accepted"
      },
      "204": {
        "description": "Deleted"
      },
      "400": {
        "description": "Bad Request",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "401": {
        "description": "Unauthorized",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "403": {
        "description": "Forbidden",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "404": {
        "description": "Not Found",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "405": {
        "description": "Method Not allowed",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "409": {
        "description": "Conflict",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "500": {
        "description": "Internal Server Error",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "501": {
        "description": "Not Implemented",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "503": {
        "description": "Service Unavailable",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/Error"
            }
          }
        }
      },
      "200BillingAccount_Get": {
        "description": "Success",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/BillingAccount"
            },
            "examples": {
              "BillingAccount_retrieve_example": {
                "$ref": "#/components/examples/BillingAccount_retrieve_example_response"
              }
            }
          }
        }
      },
      "200BillingAccount_Patch": {
        "description": "Success",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/BillingAccount"
            },
            "examples": {
              "BillingAccount_Update_example_Implied_Merge": {
                "$ref": "#/components/examples/BillingAccount_Update_example_Implied_Merge_response"
              }
            }
          },
          "application/merge-patch+json": {
            "schema": {
              "$ref": "#/components/schemas/BillingAccount"
            },
            "examples": {
              "BillingAccount_Update_example_Patch_Merge": {
                "$ref": "#/components/examples/BillingAccount_Update_example_Patch_Merge_response"
              }
            }
          },
          "application/json-patch+json": {
            "schema": {
              "oneOf": [
                {
                  "$ref": "#/components/schemas/BillingAccount"
                },
                {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/BillingAccount"
                  }
                },
                {
                  "type": "string",
                  "nullable": true
                }
              ]
            },
            "examples": {
              "BillingAccount_Update_example_JSON_Patch": {
                "$ref": "#/components/examples/BillingAccount_Update_example_JSON_Patch_response"
              }
            }
          },
          "application/json-patch-query+json": {
            "schema": {
              "oneOf": [
                {
                  "$ref": "#/components/schemas/BillingAccount"
                },
                {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/BillingAccount"
                  }
                },
                {
                  "type": "string",
                  "nullable": true
                }
              ]
            },
            "examples": {
              "BillingAccount_Update_example_JSON_Patch": {
                "$ref": "#/components/examples/BillingAccount_Update_example_JSON_Patch_response"
              }
            }
          }
        }
      }
    },
    "requestBodies": {
      "BillingAccount_MVO": {
        "description": "The BillingAccount to be patched",
        "content": {
          "application/json": {
            "schema": {
              "$ref": "#/components/schemas/BillingAccount_MVO"
            },
            "examples": {
              "BillingAccount_Update_example_Implied_Merge": {
                "$ref": "#/components/examples/BillingAccount_Update_example_Implied_Merge_request"
              }
            }
          },
          "application/merge-patch+json": {
            "schema": {
              "$ref": "#/components/schemas/BillingAccount_MVO"
            },
            "examples": {
              "BillingAccount_Update_example_Patch_Merge": {
                "$ref": "#/components/examples/BillingAccount_Update_example_Patch_Merge_request"
              }
            }
          },
          "application/json-patch+json": {
            "schema": {
              "$ref": "#/components/schemas/JsonPatchOperations"
            },
            "examples": {
              "BillingAccount_Update_example_JSON_Patch": {
                "$ref": "#/components/examples/BillingAccount_Update_example_JSON_Patch_request"
              }
            }
          },
          "application/json-patch-query+json": {
            "schema": {
              "$ref": "#/components/schemas/JsonPatchOperations"
            },
            "examples": {
              "BillingAccount_Update_example_JSON_Patch": {
                "$ref": "#/components/examples/BillingAccount_Update_example_JSON_Patch_request"
              }
            }
          }
        },
        "required": true
      }
    },
    "schemas": {
      "BillingAccount": {
        "allOf": [
          {
            "$ref": "#/components/schemas/PartyAccount"
          },
          {
            "type": "object",
            "description": "A party account used for billing purposes. It includes a description of the bill structure (frequency, presentation media, format and so on). It is a specialization of entity PartyAccount.",
            "properties": {
              "ratingType": {
                "type": "string",
                "description": "Indicates whether the account follows a specific payment option such as prepaid or postpaid"
              }
            }
          }
        ]
      },
      "Error": {
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Error": "#/components/schemas/Error"
          }
        },
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "required": [
              "code",
              "reason"
            ],
            "properties": {
              "code": {
                "type": "string",
                "description": "Application relevant detail, defined in the API or a common list."
              },
              "reason": {
                "type": "string",
                "description": "Explanation of the reason for the error which can be shown to a client user."
              },
              "message": {
                "type": "string",
                "description": "More details and corrective actions related to the error which can be shown to a client user."
              },
              "status": {
                "type": "string",
                "description": "HTTP Error code extension"
              },
              "referenceError": {
                "type": "string",
                "description": "URI of documentation describing the error."
              }
            }
          }
        ],
        "description": "Used when an API throws an Error, typically with a HTTP error response-code (3xx, 4xx, 5xx)"
      },
      "BillingAccount_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/PartyAccount_MVO"
          },
          {
            "type": "object",
            "description": "A party account used for billing purposes. It includes a description of the bill structure (frequency, presentation media, format and so on). It is a specialization of entity PartyAccount.",
            "properties": {
              "ratingType": {
                "type": "string",
                "description": "Indicates whether the account follows a specific payment option such as prepaid or postpaid"
              }
            }
          }
        ]
      },
      "JsonPatchOperations": {
        "description": "JSONPatch Operations document as defined by RFC 6902",
        "type": "array",
        "items": {
          "$ref": "#/components/schemas/JsonPatch"
        }
      },
      "PartyAccount": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Account"
          },
          {
            "type": "object",
            "description": "Account used for billing or for settlement purposes concerning a given party (an organization or an individual). It is a specialization of entity Account.",
            "properties": {
              "paymentStatus": {
                "type": "string",
                "description": "The condition of the account, such as due, paid, in arrears."
              },
              "billStructure": {
                "$ref": "#/components/schemas/BillStructure"
              },
              "paymentPlan": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/PaymentPlan"
                },
                "description": "A list of payment plans that are active or expired for the account, for example if the customer had difficulty in paying"
              },
              "financialAccount": {
                "$ref": "#/components/schemas/FinancialAccountRef"
              },
              "defaultPaymentMethod": {
                "$ref": "#/components/schemas/PaymentMethodRef"
              }
            }
          }
        ]
      },
      "Extensible": {
        "type": "object",
        "description": "Base Extensible schema for use in TMForum Open-APIs - When used for in a schema it means that the Entity described by the schema  MUST be extended with the @type",
        "properties": {
          "@type": {
            "type": "string",
            "description": "When sub-classing, this defines the sub-class Extensible name"
          },
          "@baseType": {
            "type": "string",
            "description": "When sub-classing, this defines the super-class"
          },
          "@schemaLocation": {
            "type": "string",
            "description": "A URI to a JSON-Schema file that defines additional attributes and relationships"
          }
        },
        "required": [
          "@type"
        ]
      },
      "PartyAccount_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Account_MVO"
          },
          {
            "type": "object",
            "description": "Account used for billing or for settlement purposes concerning a given party (an organization or an individual). It is a specialization of entity Account.",
            "properties": {
              "paymentStatus": {
                "type": "string",
                "description": "The condition of the account, such as due, paid, in arrears."
              },
              "billStructure": {
                "$ref": "#/components/schemas/BillStructure_MVO"
              },
              "paymentPlan": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/PaymentPlan_MVO"
                },
                "description": "A list of payment plans that are active or expired for the account, for example if the customer had difficulty in paying"
              },
              "financialAccount": {
                "$ref": "#/components/schemas/FinancialAccountRef_MVO"
              },
              "defaultPaymentMethod": {
                "$ref": "#/components/schemas/PaymentMethodRef_MVO"
              }
            }
          }
        ]
      },
      "JsonPatch": {
        "type": "object",
        "description": "A JSONPatch document as defined by RFC 6902",
        "required": [
          "op",
          "path"
        ],
        "properties": {
          "op": {
            "type": "string",
            "description": "The operation to be performed",
            "enum": [
              "add",
              "remove",
              "replace",
              "move",
              "copy",
              "test"
            ]
          },
          "path": {
            "type": "string",
            "description": "A JSON-Pointer"
          },
          "value": {
            "description": "The value to be used within the operations."
          },
          "from": {
            "type": "string",
            "description": "A string containing a JSON Pointer value."
          }
        }
      },
      "Account": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "Generic Account structure used to define commonalities between sub concepts of PartyAccount and Financial Account, or other type of account supported by the API.",
            "properties": {
              "creditLimit": {
                "$ref": "#/components/schemas/Money"
              },
              "description": {
                "type": "string",
                "description": "Detailed description of the account"
              },
              "lastUpdate": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time that the account was last updated"
              },
              "name": {
                "type": "string",
                "description": "Name of the account"
              },
              "state": {
                "type": "string",
                "description": "Contains the lifecycle state such as: Active, Closed, Suspended and so on."
              },
              "accountType": {
                "type": "string",
                "description": "A categorization of an account, such as individual, joint, and so forth, whose instances share some of the same characteristics. Note: for flexibility we use a String here but an implementation may use an enumeration with a limited list of valid values."
              },
              "relatedParty": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/RelatedPartyRefOrPartyRoleRef"
                },
                "description": "List of parties that have some relationship with the account, for example the customer to whom the account belongs"
              },
              "taxExemption": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TaxExemptionCertificate"
                },
                "description": "List of tax exemptions that can be applied when calculating charges levied to the account."
              },
              "contact": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/Contact"
                },
                "description": "List of people who could be contacted regarding the account, for example the accountant who authorizes payments"
              },
              "accountBalance": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/AccountBalance"
                },
                "description": "List of balances for the account, for example regular postpaid balance, deposit balance, write-off balance."
              },
              "accountRelationship": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/AccountRelationship"
                },
                "description": "List of balances related to the account. For example a list of billing accounts that contribute to a financial account"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Account": "#/components/schemas/Account",
            "PartyAccount": "#/components/schemas/PartyAccount",
            "SettlementAccount": "#/components/schemas/SettlementAccount",
            "BillingAccount": "#/components/schemas/BillingAccount",
            "FinancialAccount": "#/components/schemas/FinancialAccount"
          }
        }
      },
      "BillStructure": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "The structure of the bill for party accounts (billing or settlement).",
            "properties": {
              "presentationMedia": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/BillPresentationMediaRefOrValue"
                }
              },
              "format": {
                "$ref": "#/components/schemas/BillFormatRefOrValue"
              },
              "cycleSpecification": {
                "$ref": "#/components/schemas/BillingCycleSpecificationRefOrValue"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillStructure": "#/components/schemas/BillStructure"
          }
        }
      },
      "PaymentPlan": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Defines a plan for payment (when a party wants to spread his payments)",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the plan within list of the plans (for entities with list)"
              },
              "numberOfPayments": {
                "type": "integer",
                "description": "Number of payments used to spread the global payment"
              },
              "paymentFrequency": {
                "type": "string",
                "description": "Frequency of the payments, such as monthly and bimonthly"
              },
              "priority": {
                "type": "integer",
                "description": "Priority of the payment plan"
              },
              "status": {
                "type": "string",
                "description": "Status of the payment plan (effective, ineffective)"
              },
              "totalAmount": {
                "$ref": "#/components/schemas/Money"
              },
              "planType": {
                "type": "string",
                "description": "Type of payment plan"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "paymentMethod": {
                "$ref": "#/components/schemas/PaymentMethodRef"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PaymentPlan": "#/components/schemas/PaymentPlan"
          }
        }
      },
      "FinancialAccountRef": {
        "type": "object",
        "description": "AccountReceivable reference. An account of money owed by a party to another entity in exchange for goods or services that have been delivered or used. An account receivable aggregates the amounts of one or more party accounts (billing or settlement) owned by a given party.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "FinancialAccountRef": "#/components/schemas/FinancialAccountRef"
          }
        }
      },
      "PaymentMethodRef": {
        "type": "object",
        "description": "PaymentMethod reference. A payment method defines a specific mean of payment (e.g direct debit).",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PaymentMethodRef": "#/components/schemas/PaymentMethodRef"
          }
        }
      },
      "Account_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "Generic Account structure used to define commonalities between sub concepts of PartyAccount and Financial Account, or other type of account supported by the API.",
            "properties": {
              "creditLimit": {
                "$ref": "#/components/schemas/Money"
              },
              "description": {
                "type": "string",
                "description": "Detailed description of the account"
              },
              "lastUpdate": {
                "type": "string",
                "format": "date-time",
                "description": "The date and time that the account was last updated"
              },
              "name": {
                "type": "string",
                "description": "Name of the account"
              },
              "state": {
                "type": "string",
                "description": "Contains the lifecycle state such as: Active, Closed, Suspended and so on."
              },
              "accountType": {
                "type": "string",
                "description": "A categorization of an account, such as individual, joint, and so forth, whose instances share some of the same characteristics. Note: for flexibility we use a String here but an implementation may use an enumeration with a limited list of valid values."
              },
              "relatedParty": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/RelatedPartyRefOrPartyRoleRef_MVO"
                },
                "description": "List of parties that have some relationship with the account, for example the customer to whom the account belongs"
              },
              "taxExemption": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TaxExemptionCertificate_MVO"
                },
                "description": "List of tax exemptions that can be applied when calculating charges levied to the account."
              },
              "contact": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/Contact_MVO"
                },
                "description": "List of people who could be contacted regarding the account, for example the accountant who authorizes payments"
              },
              "accountBalance": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/AccountBalance_MVO"
                },
                "description": "List of balances for the account, for example regular postpaid balance, deposit balance, write-off balance."
              },
              "accountRelationship": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/AccountRelationship_MVO"
                },
                "description": "List of balances related to the account. For example a list of billing accounts that contribute to a financial account"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Account": "#/components/schemas/Account_MVO",
            "PartyAccount": "#/components/schemas/PartyAccount_MVO",
            "SettlementAccount": "#/components/schemas/SettlementAccount_MVO",
            "BillingAccount": "#/components/schemas/BillingAccount_MVO",
            "FinancialAccount": "#/components/schemas/FinancialAccount_MVO"
          }
        }
      },
      "BillStructure_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "The structure of the bill for party accounts (billing or settlement).",
            "properties": {
              "presentationMedia": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/BillPresentationMediaRefOrValue_MVO"
                }
              },
              "format": {
                "$ref": "#/components/schemas/BillFormatRefOrValue_MVO"
              },
              "cycleSpecification": {
                "$ref": "#/components/schemas/BillingCycleSpecificationRefOrValue_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillStructure": "#/components/schemas/BillStructure_MVO"
          }
        }
      },
      "PaymentPlan_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Defines a plan for payment (when a party wants to spread his payments)",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the plan within list of the plans (for entities with list)"
              },
              "numberOfPayments": {
                "type": "integer",
                "description": "Number of payments used to spread the global payment"
              },
              "paymentFrequency": {
                "type": "string",
                "description": "Frequency of the payments, such as monthly and bimonthly"
              },
              "priority": {
                "type": "integer",
                "description": "Priority of the payment plan"
              },
              "status": {
                "type": "string",
                "description": "Status of the payment plan (effective, ineffective)"
              },
              "totalAmount": {
                "$ref": "#/components/schemas/Money"
              },
              "planType": {
                "type": "string",
                "description": "Type of payment plan"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "paymentMethod": {
                "$ref": "#/components/schemas/PaymentMethodRef_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PaymentPlan": "#/components/schemas/PaymentPlan_MVO"
          }
        }
      },
      "FinancialAccountRef_MVO": {
        "type": "object",
        "description": "AccountReceivable reference. An account of money owed by a party to another entity in exchange for goods or services that have been delivered or used. An account receivable aggregates the amounts of one or more party accounts (billing or settlement) owned by a given party.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "FinancialAccountRef": "#/components/schemas/FinancialAccountRef_MVO"
          }
        }
      },
      "PaymentMethodRef_MVO": {
        "type": "object",
        "description": "PaymentMethod reference. A payment method defines a specific mean of payment (e.g direct debit).",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PaymentMethodRef": "#/components/schemas/PaymentMethodRef_MVO"
          }
        }
      },
      "Entity": {
        "type": "object",
        "description": "Base entity schema for use in TMForum Open-APIs. Property.",
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "$ref": "#/components/schemas/Addressable"
          }
        ]
      },
      "Money": {
        "type": "object",
        "description": "A base / value business entity used to represent money",
        "properties": {
          "unit": {
            "type": "string",
            "description": "Currency (ISO4217 norm uses 3 letters to define the currency)"
          },
          "value": {
            "type": "number",
            "format": "float",
            "description": "A signed floating point number, the meaning of the sign is according to the context of the API that uses this Data type"
          }
        }
      },
      "RelatedPartyRefOrPartyRoleRef": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "RelatedParty reference. A related party defines party or party role or its reference, linked to a specific entity",
            "properties": {
              "role": {
                "description": "Role played by the related party or party role in the context of the specific entity it is linked to. Such as 'initiator', 'customer',  'salesAgent', 'user'",
                "type": "string"
              },
              "partyOrPartyRole": {
                "$ref": "#/components/schemas/PartyRefOrPartyRoleRef"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "RelatedPartyRefOrPartyRoleRef": "#/components/schemas/RelatedPartyRefOrPartyRoleRef"
          }
        }
      },
      "TaxExemptionCertificate": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "A tax exemption certificate represents a tax exemption granted to a party (individual or organization) by a tax jurisdiction which may be a city, state, country,... An exemption has a certificate identifier (received from the jurisdiction that levied the tax) and a validity period. An exemption is per tax types and determines for each type of tax what portion of the tax is exempted (partial by percentage or complete) via the tax definition.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the tax exemption within list of the exemptions"
              },
              "taxDefinition": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TaxDefinition"
                },
                "description": "A list of taxes that are covered by the exemption, e.g. City Tax, State Tax. The definition would include the exemption (e.g. for a rate exemption 0% would be a full exemption, 5% could be a partial exemption if the actual rate was 10%)."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "certificateNumber": {
                "type": "string",
                "description": "Identifier of a document that shows proof of exemption from taxes for the taxing jurisdiction"
              },
              "issuingJurisdiction": {
                "type": "string",
                "description": "Name of the jurisdiction that issued the exemption",
                "example": "USA"
              },
              "reason": {
                "type": "string",
                "description": "Reason for the tax exemption"
              },
              "attachment": {
                "$ref": "#/components/schemas/AttachmentRefOrValue"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "TaxExemptionCertificate": "#/components/schemas/TaxExemptionCertificate"
          }
        }
      },
      "Contact": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "An individual or an organization used as a contact point for a given account and accessed via some contact medium.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the contact within list of the contacts (for entities with list)"
              },
              "contactName": {
                "type": "string",
                "description": "A displayable name for that contact"
              },
              "contactType": {
                "type": "string",
                "description": "Type of contact (primary, secondary...)"
              },
              "partyRoleType": {
                "type": "string",
                "description": "Identifies what kind of party role type is linked to the contact (a account manager...)"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "contactMedium": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/ContactMedium"
                },
                "description": "List of contact mediums for the contact, such as mobile phone number, email addreess, etc."
              },
              "relatedParty": {
                "$ref": "#/components/schemas/RelatedPartyRefOrPartyRoleRef"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Contact": "#/components/schemas/Contact"
          }
        }
      },
      "AccountBalance": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Balances linked to the account",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the balance within list of the balances (for entities with list)"
              },
              "amount": {
                "$ref": "#/components/schemas/Money"
              },
              "balanceType": {
                "type": "string",
                "description": "Type of the balance : deposit balance, disputed balance, loyalty balance, receivable balance..."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountBalance": "#/components/schemas/AccountBalance"
          }
        }
      },
      "AccountRelationship": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "Significant connection between accounts. For instance an aggregating account for a list of shop branches each having its own billing account.",
            "properties": {
              "relationshipType": {
                "type": "string",
                "description": "Type of relationship"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "account": {
                "$ref": "#/components/schemas/AccountRef"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountRelationship": "#/components/schemas/AccountRelationship"
          }
        }
      },
      "BillPresentationMediaRefOrValue": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillPresentationMedia entity and not the BillPresentationMediaRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillPresentationMedia"
          },
          {
            "$ref": "#/components/schemas/BillPresentationMediaRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMedia": "#/components/schemas/BillPresentationMedia",
            "BillPresentationMediaRef": "#/components/schemas/BillPresentationMediaRef"
          }
        }
      },
      "BillFormatRefOrValue": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillFormat entity and not the BillFormatRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillFormat"
          },
          {
            "$ref": "#/components/schemas/BillFormatRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormat": "#/components/schemas/BillFormat",
            "BillFormatRef": "#/components/schemas/BillFormatRef"
          }
        }
      },
      "BillingCycleSpecificationRefOrValue": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillingCycleSpecification entity and not the BillingCycleSpecificationRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillingCycleSpecification"
          },
          {
            "$ref": "#/components/schemas/BillingCycleSpecificationRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecification": "#/components/schemas/BillingCycleSpecification",
            "BillingCycleSpecificationRef": "#/components/schemas/BillingCycleSpecificationRef"
          }
        }
      },
      "TimePeriod": {
        "type": "object",
        "description": "A period of time, either as a deadline (endDateTime only) a startDateTime only, or both",
        "properties": {
          "startDateTime": {
            "description": "Start of the time period, using IETC-RFC-3339 format",
            "type": "string",
            "format": "date-time",
            "example": "1985-04-12T23:20:50.52Z"
          },
          "endDateTime": {
            "description": "End of the time period, using IETC-RFC-3339 format",
            "type": "string",
            "format": "date-time",
            "example": "1985-04-12T23:20:50.52Z"
          }
        }
      },
      "EntityRef": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "$ref": "#/components/schemas/Addressable"
          },
          {
            "type": "object",
            "description": "Entity reference schema to be use for all entityRef class.",
            "properties": {
              "id": {
                "type": "string",
                "description": "The identifier of the referred entity."
              },
              "href": {
                "type": "string",
                "description": "The URI of the referred entity."
              },
              "name": {
                "type": "string",
                "description": "Name of the referred entity."
              },
              "@referredType": {
                "type": "string",
                "description": "The actual type of the target instance when needed for disambiguation."
              }
            },
            "required": [
              "id"
            ]
          }
        ]
      },
      "Entity_MVO": {
        "type": "object",
        "description": "Base entity schema for use in TMForum Open-APIs. Property.",
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          }
        ]
      },
      "RelatedPartyRefOrPartyRoleRef_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "RelatedParty reference. A related party defines party or party role or its reference, linked to a specific entity",
            "properties": {
              "role": {
                "description": "Role played by the related party or party role in the context of the specific entity it is linked to. Such as 'initiator', 'customer',  'salesAgent', 'user'",
                "type": "string"
              },
              "partyOrPartyRole": {
                "$ref": "#/components/schemas/PartyRefOrPartyRoleRef_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "RelatedPartyRefOrPartyRoleRef": "#/components/schemas/RelatedPartyRefOrPartyRoleRef_MVO"
          }
        }
      },
      "TaxExemptionCertificate_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "A tax exemption certificate represents a tax exemption granted to a party (individual or organization) by a tax jurisdiction which may be a city, state, country,... An exemption has a certificate identifier (received from the jurisdiction that levied the tax) and a validity period. An exemption is per tax types and determines for each type of tax what portion of the tax is exempted (partial by percentage or complete) via the tax definition.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the tax exemption within list of the exemptions"
              },
              "taxDefinition": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/TaxDefinition_MVO"
                },
                "description": "A list of taxes that are covered by the exemption, e.g. City Tax, State Tax. The definition would include the exemption (e.g. for a rate exemption 0% would be a full exemption, 5% could be a partial exemption if the actual rate was 10%)."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "certificateNumber": {
                "type": "string",
                "description": "Identifier of a document that shows proof of exemption from taxes for the taxing jurisdiction"
              },
              "issuingJurisdiction": {
                "type": "string",
                "description": "Name of the jurisdiction that issued the exemption",
                "example": "USA"
              },
              "reason": {
                "type": "string",
                "description": "Reason for the tax exemption"
              },
              "attachment": {
                "$ref": "#/components/schemas/AttachmentRefOrValue_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "TaxExemptionCertificate": "#/components/schemas/TaxExemptionCertificate_MVO"
          }
        }
      },
      "Contact_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "An individual or an organization used as a contact point for a given account and accessed via some contact medium.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the contact within list of the contacts (for entities with list)"
              },
              "contactName": {
                "type": "string",
                "description": "A displayable name for that contact"
              },
              "contactType": {
                "type": "string",
                "description": "Type of contact (primary, secondary...)"
              },
              "partyRoleType": {
                "type": "string",
                "description": "Identifies what kind of party role type is linked to the contact (a account manager...)"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "contactMedium": {
                "type": "array",
                "items": {
                  "$ref": "#/components/schemas/ContactMedium_MVO"
                },
                "description": "List of contact mediums for the contact, such as mobile phone number, email addreess, etc."
              },
              "relatedParty": {
                "$ref": "#/components/schemas/RelatedPartyRefOrPartyRoleRef_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Contact": "#/components/schemas/Contact_MVO"
          }
        }
      },
      "AccountBalance_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Balances linked to the account",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier of the balance within list of the balances (for entities with list)"
              },
              "amount": {
                "$ref": "#/components/schemas/Money"
              },
              "balanceType": {
                "type": "string",
                "description": "Type of the balance : deposit balance, disputed balance, loyalty balance, receivable balance..."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountBalance": "#/components/schemas/AccountBalance_MVO"
          }
        }
      },
      "AccountRelationship_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "Significant connection between accounts. For instance an aggregating account for a list of shop branches each having its own billing account.",
            "properties": {
              "relationshipType": {
                "type": "string",
                "description": "Type of relationship"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "account": {
                "$ref": "#/components/schemas/AccountRef_MVO"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountRelationship": "#/components/schemas/AccountRelationship_MVO"
          }
        }
      },
      "BillPresentationMediaRefOrValue_MVO": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillPresentationMedia entity and not the BillPresentationMediaRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillPresentationMedia_MVO"
          },
          {
            "$ref": "#/components/schemas/BillPresentationMediaRef_MVO"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMedia": "#/components/schemas/BillPresentationMedia_MVO",
            "BillPresentationMediaRef": "#/components/schemas/BillPresentationMediaRef_MVO"
          }
        }
      },
      "BillFormatRefOrValue_MVO": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillFormat entity and not the BillFormatRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillFormat_MVO"
          },
          {
            "$ref": "#/components/schemas/BillFormatRef_MVO"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormat": "#/components/schemas/BillFormat_MVO",
            "BillFormatRef": "#/components/schemas/BillFormatRef_MVO"
          }
        }
      },
      "BillingCycleSpecificationRefOrValue_MVO": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillingCycleSpecification entity and not the BillingCycleSpecificationRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/BillingCycleSpecification_MVO"
          },
          {
            "$ref": "#/components/schemas/BillingCycleSpecificationRef_MVO"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecification": "#/components/schemas/BillingCycleSpecification_MVO",
            "BillingCycleSpecificationRef": "#/components/schemas/BillingCycleSpecificationRef_MVO"
          }
        }
      },
      "Addressable": {
        "type": "object",
        "description": "Base schema for adressable entities",
        "properties": {
          "href": {
            "type": "string",
            "description": "Hyperlink reference"
          },
          "id": {
            "type": "string",
            "description": "unique identifier"
          }
        }
      },
      "PartyRefOrPartyRoleRef": {
        "type": "object",
        "description": "",
        "oneOf": [
          {
            "$ref": "#/components/schemas/PartyRef"
          },
          {
            "$ref": "#/components/schemas/PartyRoleRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRef": "#/components/schemas/PartyRef",
            "PartyRoleRef": "#/components/schemas/PartyRoleRef"
          }
        }
      },
      "TaxDefinition": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Reference of a tax definition. A tax is levied by an authorized tax jurisdiction. For example, there are many different types of tax (Federal Tax levied by the US Government, State Tax levied by the State of California, City Tax levied by the City of Los Angeles, etc.).",
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique identifier of the tax."
              },
              "name": {
                "type": "string",
                "description": "Tax name."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "jurisdictionName": {
                "type": "string",
                "description": "Name of the jurisdiction that levies the tax",
                "example": "USA"
              },
              "jurisdictionLevel": {
                "type": "string",
                "description": "Level of the jurisdiction that levies the tax",
                "example": "Country"
              },
              "taxType": {
                "type": "string",
                "description": "Type of the tax.",
                "example": "VAT"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "TaxDefinition": "#/components/schemas/TaxDefinition"
          }
        }
      },
      "AttachmentRefOrValue": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the Attachment entity and not the AttachmentRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/Attachment"
          },
          {
            "$ref": "#/components/schemas/AttachmentRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Attachment": "#/components/schemas/Attachment",
            "AttachmentRef": "#/components/schemas/AttachmentRef"
          }
        }
      },
      "ContactMedium": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Indicates the contact medium that could be used to contact the party.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier for this contact medium."
              },
              "preferred": {
                "type": "boolean",
                "description": "If true, indicates that is the preferred contact medium"
              },
              "contactType": {
                "type": "string",
                "description": "Type of the contact medium to qualifiy it like pro email / personal email. This is not used to define the contact medium used."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "ContactMedium": "#/components/schemas/ContactMedium",
            "SocialContactMedium": "#/components/schemas/SocialContactMedium",
            "PhoneContactMedium": "#/components/schemas/PhoneContactMedium",
            "GeographicAddressContactMedium": "#/components/schemas/GeographicAddressContactMedium",
            "FaxContactMedium": "#/components/schemas/FaxContactMedium",
            "EmailContactMedium": "#/components/schemas/EmailContactMedium"
          }
        }
      },
      "AccountRef": {
        "type": "object",
        "description": "Account reference. A account may be a party account or a financial account.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountRef": "#/components/schemas/AccountRef"
          }
        }
      },
      "BillPresentationMedia": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "description": {
                "type": "string",
                "description": "An explanatory text describing this bill presentation media"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMedia": "#/components/schemas/BillPresentationMedia"
          }
        }
      },
      "BillPresentationMediaRef": {
        "type": "object",
        "description": "PresentationMedia reference. A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMediaRef": "#/components/schemas/BillPresentationMediaRef"
          }
        }
      },
      "BillFormat": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "A detailed description of the way in which a bill is presented.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "description": {
                "type": "string",
                "description": "An explanatory text for this bill format"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormat": "#/components/schemas/BillFormat"
          }
        }
      },
      "BillFormatRef": {
        "type": "object",
        "description": "BillFormat reference. A bill format is a description of the way in which a bill is presented.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormatRef": "#/components/schemas/BillFormatRef"
          }
        }
      },
      "BillingCycleSpecification": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "A detailed description of when to initiate a billing cycle and the various sub steps of a billing cycle.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "billingDateShift": {
                "type": "integer",
                "description": "An offset of a billing/settlement date. The offset is expressed as number of days with regard to the start of the billing/settlement period."
              },
              "billingPeriod": {
                "type": "string",
                "description": "A billing time period. It can be recurring, for example: week, month, quarter of year, year ."
              },
              "chargeDateOffset": {
                "type": "integer",
                "description": "An offset of a date through which charges previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "creditDateOffset": {
                "type": "integer",
                "description": "An offset of a date through which credits previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "description": {
                "type": "string",
                "description": "An explanation regarding this billing cycle specification"
              },
              "frequency": {
                "type": "string",
                "description": "Frequency of the billing cycle (monthly for instance)"
              },
              "mailingDateOffset": {
                "type": "integer",
                "description": "An offset of a customer bill mailing date. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "paymentDueDateOffset": {
                "type": "integer",
                "description": "An offset of a payment due date. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecification": "#/components/schemas/BillingCycleSpecification"
          }
        }
      },
      "BillingCycleSpecificationRef": {
        "type": "object",
        "description": "BillingCycleSpecification reference. A description of when to initiate a billing cycle and the various sub steps of a billing cycle.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecificationRef": "#/components/schemas/BillingCycleSpecificationRef"
          }
        }
      },
      "PartyRefOrPartyRoleRef_MVO": {
        "type": "object",
        "description": "",
        "oneOf": [
          {
            "$ref": "#/components/schemas/PartyRef_MVO"
          },
          {
            "$ref": "#/components/schemas/PartyRoleRef_MVO"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRef": "#/components/schemas/PartyRef_MVO",
            "PartyRoleRef": "#/components/schemas/PartyRoleRef_MVO"
          }
        }
      },
      "TaxDefinition_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Reference of a tax definition. A tax is levied by an authorized tax jurisdiction. For example, there are many different types of tax (Federal Tax levied by the US Government, State Tax levied by the State of California, City Tax levied by the City of Los Angeles, etc.).",
            "properties": {
              "id": {
                "type": "string",
                "description": "Unique identifier of the tax."
              },
              "name": {
                "type": "string",
                "description": "Tax name."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "jurisdictionName": {
                "type": "string",
                "description": "Name of the jurisdiction that levies the tax",
                "example": "USA"
              },
              "jurisdictionLevel": {
                "type": "string",
                "description": "Level of the jurisdiction that levies the tax",
                "example": "Country"
              },
              "taxType": {
                "type": "string",
                "description": "Type of the tax.",
                "example": "VAT"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "TaxDefinition": "#/components/schemas/TaxDefinition_MVO"
          }
        }
      },
      "AttachmentRefOrValue_MVO": {
        "type": "object",
        "description": "The polymorphic attributes @type, @schemaLocation & @referredType are related to the Attachment entity and not the AttachmentRefOrValue class itself",
        "oneOf": [
          {
            "$ref": "#/components/schemas/Attachment_MVO"
          },
          {
            "$ref": "#/components/schemas/AttachmentRef_MVO"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Attachment": "#/components/schemas/Attachment_MVO",
            "AttachmentRef": "#/components/schemas/AttachmentRef_MVO"
          }
        }
      },
      "ContactMedium_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Extensible"
          },
          {
            "type": "object",
            "description": "Indicates the contact medium that could be used to contact the party.",
            "properties": {
              "id": {
                "type": "string",
                "description": "Identifier for this contact medium."
              },
              "preferred": {
                "type": "boolean",
                "description": "If true, indicates that is the preferred contact medium"
              },
              "contactType": {
                "type": "string",
                "description": "Type of the contact medium to qualifiy it like pro email / personal email. This is not used to define the contact medium used."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "ContactMedium": "#/components/schemas/ContactMedium_MVO",
            "SocialContactMedium": "#/components/schemas/SocialContactMedium_MVO",
            "PhoneContactMedium": "#/components/schemas/PhoneContactMedium_MVO",
            "GeographicAddressContactMedium": "#/components/schemas/GeographicAddressContactMedium_MVO",
            "FaxContactMedium": "#/components/schemas/FaxContactMedium_MVO",
            "EmailContactMedium": "#/components/schemas/EmailContactMedium_MVO"
          }
        }
      },
      "AccountRef_MVO": {
        "type": "object",
        "description": "Account reference. A account may be a party account or a financial account.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AccountRef": "#/components/schemas/AccountRef_MVO"
          }
        }
      },
      "BillPresentationMedia_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "description": {
                "type": "string",
                "description": "An explanatory text describing this bill presentation media"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMedia": "#/components/schemas/BillPresentationMedia_MVO"
          }
        }
      },
      "BillPresentationMediaRef_MVO": {
        "type": "object",
        "description": "PresentationMedia reference. A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillPresentationMediaRef": "#/components/schemas/BillPresentationMediaRef_MVO"
          }
        }
      },
      "BillFormat_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "A detailed description of the way in which a bill is presented.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "description": {
                "type": "string",
                "description": "An explanatory text for this bill format"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormat": "#/components/schemas/BillFormat_MVO"
          }
        }
      },
      "BillFormatRef_MVO": {
        "type": "object",
        "description": "BillFormat reference. A bill format is a description of the way in which a bill is presented.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillFormatRef": "#/components/schemas/BillFormatRef_MVO"
          }
        }
      },
      "BillingCycleSpecification_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "A detailed description of when to initiate a billing cycle and the various sub steps of a billing cycle.",
            "properties": {
              "name": {
                "type": "string",
                "description": "A short descriptive name"
              },
              "billingDateShift": {
                "type": "integer",
                "description": "An offset of a billing/settlement date. The offset is expressed as number of days with regard to the start of the billing/settlement period."
              },
              "billingPeriod": {
                "type": "string",
                "description": "A billing time period. It can be recurring, for example: week, month, quarter of year, year ."
              },
              "chargeDateOffset": {
                "type": "integer",
                "description": "An offset of a date through which charges previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "creditDateOffset": {
                "type": "integer",
                "description": "An offset of a date through which credits previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "description": {
                "type": "string",
                "description": "An explanation regarding this billing cycle specification"
              },
              "frequency": {
                "type": "string",
                "description": "Frequency of the billing cycle (monthly for instance)"
              },
              "mailingDateOffset": {
                "type": "integer",
                "description": "An offset of a customer bill mailing date. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "paymentDueDateOffset": {
                "type": "integer",
                "description": "An offset of a payment due date. The offset is expressed as number of days with regard to the start of the BillingPeriod."
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecification": "#/components/schemas/BillingCycleSpecification_MVO"
          }
        }
      },
      "BillingCycleSpecificationRef_MVO": {
        "type": "object",
        "description": "BillingCycleSpecification reference. A description of when to initiate a billing cycle and the various sub steps of a billing cycle.",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "BillingCycleSpecificationRef": "#/components/schemas/BillingCycleSpecificationRef_MVO"
          }
        }
      },
      "PartyRef": {
        "type": "object",
        "description": "A Party reference",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRef": "#/components/schemas/PartyRef"
          }
        }
      },
      "PartyRoleRef": {
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          },
          {
            "type": "object",
            "description": "Party role reference. A party role represents the part played by a party in a given context.",
            "properties": {
              "partyId": {
                "type": "string",
                "description": "The identifier of the engaged party that is linked to the PartyRole object."
              },
              "partyName": {
                "type": "string",
                "description": "The name of the engaged party that is linked to the PartyRole object."
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRoleRef": "#/components/schemas/PartyRoleRef"
          }
        }
      },
      "Attachment": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity"
          },
          {
            "type": "object",
            "description": "Complements the description of an element (for instance a product) through video, pictures...",
            "properties": {
              "name": {
                "type": "string",
                "description": "The name of the attachment"
              },
              "description": {
                "type": "string",
                "description": "A narrative text describing the content of the attachment",
                "example": "Photograph of the Product"
              },
              "url": {
                "type": "string",
                "description": "Uniform Resource Locator, is a web page address (a subset of URI)",
                "example": "http://host/Content/4aafacbd-11ff-4dc8-b445-305f2215715f"
              },
              "content": {
                "type": "string",
                "format": "base64",
                "description": "The actual contents of the attachment object, if embedded, encoded as base64"
              },
              "size": {
                "$ref": "#/components/schemas/Quantity"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "attachmentType": {
                "type": "string",
                "description": "a business characterization of the purpose of the attachment, for example logo, instructionManual, contractCopy"
              },
              "mimeType": {
                "type": "string",
                "description": "a technical characterization of the attachment content format using IETF Mime Types"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Attachment": "#/components/schemas/Attachment"
          }
        }
      },
      "AttachmentRef": {
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          },
          {
            "type": "object",
            "description": "Attachment reference. An attachment complements the description of an element (for instance a product) through video, pictures",
            "properties": {
              "description": {
                "type": "string",
                "description": "A narrative text describing the content of the attachment"
              },
              "url": {
                "description": "Link to the attachment media/content",
                "type": "string"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AttachmentRef": "#/components/schemas/AttachmentRef"
          }
        }
      },
      "PartyRef_MVO": {
        "type": "object",
        "description": "A Party reference",
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRef": "#/components/schemas/PartyRef_MVO"
          }
        }
      },
      "PartyRoleRef_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          },
          {
            "type": "object",
            "description": "Party role reference. A party role represents the part played by a party in a given context.",
            "properties": {
              "partyId": {
                "type": "string",
                "description": "The identifier of the engaged party that is linked to the PartyRole object."
              },
              "partyName": {
                "type": "string",
                "description": "The name of the engaged party that is linked to the PartyRole object."
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "PartyRoleRef": "#/components/schemas/PartyRoleRef_MVO"
          }
        }
      },
      "Attachment_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/Entity_MVO"
          },
          {
            "type": "object",
            "description": "Complements the description of an element (for instance a product) through video, pictures...",
            "properties": {
              "name": {
                "type": "string",
                "description": "The name of the attachment"
              },
              "description": {
                "type": "string",
                "description": "A narrative text describing the content of the attachment",
                "example": "Photograph of the Product"
              },
              "url": {
                "type": "string",
                "description": "Uniform Resource Locator, is a web page address (a subset of URI)",
                "example": "http://host/Content/4aafacbd-11ff-4dc8-b445-305f2215715f"
              },
              "content": {
                "type": "string",
                "format": "base64",
                "description": "The actual contents of the attachment object, if embedded, encoded as base64"
              },
              "size": {
                "$ref": "#/components/schemas/Quantity"
              },
              "validFor": {
                "$ref": "#/components/schemas/TimePeriod"
              },
              "attachmentType": {
                "type": "string",
                "description": "a business characterization of the purpose of the attachment, for example logo, instructionManual, contractCopy"
              },
              "mimeType": {
                "type": "string",
                "description": "a technical characterization of the attachment content format using IETF Mime Types"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "Attachment": "#/components/schemas/Attachment_MVO"
          }
        }
      },
      "AttachmentRef_MVO": {
        "allOf": [
          {
            "$ref": "#/components/schemas/EntityRef"
          },
          {
            "type": "object",
            "description": "Attachment reference. An attachment complements the description of an element (for instance a product) through video, pictures",
            "properties": {
              "description": {
                "type": "string",
                "description": "A narrative text describing the content of the attachment"
              },
              "url": {
                "description": "Link to the attachment media/content",
                "type": "string"
              }
            }
          }
        ],
        "discriminator": {
          "propertyName": "@type",
          "mapping": {
            "AttachmentRef": "#/components/schemas/AttachmentRef_MVO"
          }
        }
      },
      "Quantity": {
        "type": "object",
        "description": "An amount in a given unit",
        "properties": {
          "amount": {
            "type": "number",
            "format": "float",
            "default": 1,
            "description": "Numeric value in a given unit"
          },
          "units": {
            "type": "string",
            "description": "Unit"
          }
        }
      }
    },
    "examples": {
      "BillingAccount_retrieve_example_response": {
        "value": {
          "@type": "BillingAccount",
          "paymentStatus": "In Arrears",
          "creditLimit": {
            "unit": "USD",
            "value": 10000
          },
          "description": "This  billing account ...",
          "href": "https://host:port/tmf-api/accountManagement/v5/bilingAccount/5430",
          "id": "5430",
          "lastModified": "2018-06-14T00:00:00.000Z",
          "name": "Home Account",
          "state": "Inactive",
          "accountType": "Business",
          "billStructure": {
            "@type": "BillStructure",
            "presentationMedia": [
              {
                "@type": "BillPresentationMedia",
                "href": "https://host:port/tmf-api/accountManagement/v5/billPresentationMedia/9968",
                "id": "9968",
                "name": "Post Mail"
              }
            ],
            "format": {
              "@type": "BillFormat",
              "href": "https://host:port/tmf-api/accountManagement/v5/billFormat/3555",
              "id": "3555",
              "name": "Detailed invoice"
            },
            "cycleSpecification": {
              "@type": "BillingCycleSpecification",
              "dateShift": 54,
              "frequency": "monthly",
              "href": "https://host:port/tmf-api/accountManagement/v5/billingCycleSpecification/3828",
              "id": "3828",
              "name": "Annual billing"
            }
          },
          "paymentPlan": [
            {
              "@type": "PaymentPlan",
              "numberOfPayments": 4,
              "paymentFrequency": "monthly",
              "priority": 1,
              "status": "Effective",
              "totalAmount": {
                "unit": "USD",
                "value": 100
              },
              "planType": "regular",
              "validFor": {
                "startDateTime": "2018-06-11T00:00:00.000Z",
                "endDateTime": "2019-01-10T00:00:00.000Z"
              },
              "paymentMethod": {
                "@type": "PaymentMethodRef",
                "href": "https://host:port/tmf-api/paymentMethods/v5/paymentMethod/2452",
                "id": "2452",
                "name": "professional payment"
              }
            }
          ],
          "financialAccount": {
            "@referredType": "FinancialAccount",
            "@type": "FinancialAccountRef",
            "href": "https://host:port/tmf-api/accountManagement/v5/financialAccount/2063",
            "id": "2063",
            "name": "Partnership account"
          },
          "defaultPaymentMethod": {
            "@type": "PaymentMethodRef",
            "href": "https://host:port/tmf-api/paymentMethods/v5/paymentMethod/3537",
            "id": "3537",
            "name": "family payment"
          },
          "relatedParty": [
            {
              "role": "service provider",
              "@type": "RelatedPartyRefOrRelatedPartyRoleRef",
              "partyOrPartyRole": {
                "@type": "PartyRefOrPartyRoleRef",
                "@referredType": "Organization",
                "href": "https://host:port/tmf-api/partyManagement/v5/organization/9947",
                "id": "9947",
                "name": "Richard Cole"
              }
            }
          ],
          "taxExemption": [
            {
              "@type": "TaxExemption",
              "id": "1",
              "certificateNumber": "45678909876",
              "issuingJurisdiction": "Prefecture",
              "reason": "Social",
              "taxDefinition": [
                {
                  "@type": "TaxDefinition",
                  "id": "96",
                  "name": "Value Added Tax",
                  "taxType": "federalVat"
                }
              ],
              "attachment": {
                "@type": "Attachment",
                "id": "1232455768567",
                "href": "https://host:port/tmf-api/document/v5/attachment/1232455768567",
                "attachmentType": "taxExemptionCertificate",
                "name": "TaxExemptionCertificate-12345.pdf",
                "description": "Electronic version of the tax exemption certificate",
                "mimeType": "application/pdf",
                "url": "http://host:port/DocumentManager/666/TaxExemptionCertificate-12345.pdf"
              },
              "validFor": {
                "startDateTime": "2018-06-13T00:00:00.000Z",
                "endDateTime": "2019-01-10T00:00:00.000Z"
              }
            }
          ],
          "contact": [
            {
              "@type": "Contact",
              "contactName": "Rachel Douglas",
              "contactType": "secondary",
              "partyRoleType": "Vendor",
              "validFor": {
                "startDateTime": "2018-06-17T00:00:00.000Z",
                "endDateTime": "2019-01-10T00:00:00.000Z"
              },
              "contactMedium": [
                {
                  "@type": "GeographicAddressContactMedium",
                  "preferred": true,
                  "mediumType": "PostalAddress",
                  "validFor": {
                    "startDateTime": "2018-06-14T00:00:00.000Z",
                    "endDateTime": "2019-01-10T00:00:00.000Z"
                  },
                  "city": "Paris",
                  "country": "France",
                  "postCode": "75014",
                  "street1": "15 Rue des Canards"
                }
              ],
              "relatedParty": {
                "role": "owner",
                "@type": "RelatedPartyRefOrRelatedPartyRoleRef",
                "partyOrPartyRole": {
                  "@type": "PartyRefOrPartyRoleRef",
                  "@referredType": "Organization",
                  "href": "https://host:port/tmf-api/partyManagement/v5/organization/9947",
                  "id": "9947",
                  "name": "Richard Cole"
                }
              }
            }
          ],
          "accountBalance": [
            {
              "@type": "AccountBalance",
              "amount": {
                "unit": "USD",
                "value": 58.33
              },
              "balanceType": "ReceivableBalance",
              "validFor": {
                "startDateTime": "2018-06-10T00:00:00.000Z",
                "endDateTime": "2019-01-10T00:00:00.000Z"
              }
            }
          ],
          "accountRelationship": [
            {
              "@type": "AccountRelationship",
              "relationshipType": "contains",
              "validFor": {
                "startDateTime": "2018-06-13T00:00:00.000Z",
                "endDateTime": "2019-01-10T00:00:00.000Z"
              },
              "account": {
                "@referredType": "BillingAccount",
                "@type": "AccountRef",
                "href": "https://host:port/tmf-api/accountManagement/v5/partyAccount/9327",
                "id": "9327",
                "name": "Paradise Account"
              }
            }
          ]
        },
        "description": "Here is an example of a response for retrieving a specific BillingAccount."
      },
      "BillingAccount_Update_example_Implied_Merge_request": {
        "value": {
          "@type": "BillingAccount",
          "name": "Richard Cole Account"
        },
        "description": "Here is an example of a request for updating a BillingAccount."
      },
      "BillingAccount_Update_example_Patch_Merge_request": {
        "value": {
          "@type": "BillingAccount",
          "name": "Richard Cole Account"
        },
        "description": "Here is an example of a request for updating a BillingAccount."
      },
      "BillingAccount_Update_example_JSON_Patch_request": {
        "value": {
          "path": "/contact/contactType?/contact.contactName=Rachel Douglas",
          "value": "primary",
          "op": "replace"
        },
        "description": "Here is an example of a request for updating a BillingAccount."
      },
      "BillingAccount_Update_example_Implied_Merge_response": {
        "value": {
          "@type": "BillingAccount",
          "href": "https://host:port/tmf-api/accountManagement/v5/billingAccount/5430",
          "id": "5430",
          "name": "Richard Cole Account",
          "relatedParty": [
            {
              "role": "service provider",
              "@type": "RelatedPartyRefOrPartyRoleRef",
              "partyOrPartyRole": {
                "@type": "PartyRefOrPartyRoleRef",
                "@referredType": "Organization",
                "id": "6838",
                "href": "https://host:port/tmf-api/partyManagement/v5/organization/6838",
                "name": "Richard Cole"
              }
            }
          ]
        },
        "description": "Here is an example of a response for updating a BillingAccount."
      },
      "BillingAccount_Update_example_Patch_Merge_response": {
        "value": {
          "@type": "BillingAccount",
          "href": "https://host:port/tmf-api/accountManagement/v5/billingAccount/5430",
          "id": "5430",
          "name": "Richard Cole Account",
          "relatedParty": [
            {
              "role": "service provider",
              "@type": "RelatedPartyRefOrPartyRoleRef",
              "partyOrPartyRole": {
                "@type": "PartyRefOrPartyRoleRef",
                "@referredType": "Organization",
                "id": "6838",
                "href": "https://host:port/tmf-api/partyManagement/v5/organization/6838",
                "name": "Richard Cole"
              }
            }
          ]
        },
        "description": "Here is an example of a response for updating a BillingAccount."
      },
      "BillingAccount_Update_example_JSON_Patch_response": {
        "value": {
          "@type": "BillingAccount",
          "href": "https://host:port/tmf-api/accountManagement/v5/billingAccount/5430",
          "id": "5430",
          "name": "Richard Cole Account",
          "contact": [
            {
              "@type": "Contact",
              "contactName": "Rachel Douglas",
              "contactType": "primary"
            }
          ]
        },
        "description": "Here is an example of a response for updating a BillingAccount."
      }
    }
  }
}
```

```output.ts
import { z } from "zod";
const billingAccountSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "creditLimit": z.lazy(() => moneySchema).optional(),
  "description": z.string().describe("Detailed description of the account").optional(),
  "lastUpdate": z.string().datetime().describe("The date and time that the account was last updated").optional(),
  "name": z.string().describe("Name of the account").optional(),
  "state": z.string().describe("Contains the lifecycle state such as: Active, Closed, Suspended and so on.").optional(),
  "accountType": z.string().describe("A categorization of an account, such as individual, joint, and so forth, whose instances share some of the same characteristics. Note: for flexibility we use a String here but an implementation may use an enumeration with a limited list of valid values.").optional(),
  "relatedParty": z.array(z.lazy(() => relatedPartyRefOrPartyRoleRefSchema)).describe("List of parties that have some relationship with the account, for example the customer to whom the account belongs").optional(),
  "taxExemption": z.array(z.lazy(() => taxExemptionCertificateSchema)).describe("List of tax exemptions that can be applied when calculating charges levied to the account.").optional(),
  "contact": z.array(z.lazy(() => contactSchema)).describe("List of people who could be contacted regarding the account, for example the accountant who authorizes payments").optional(),
  "accountBalance": z.array(z.lazy(() => accountBalanceSchema)).describe("List of balances for the account, for example regular postpaid balance, deposit balance, write-off balance.").optional(),
  "accountRelationship": z.array(z.lazy(() => accountRelationshipSchema)).describe("List of balances related to the account. For example a list of billing accounts that contribute to a financial account").optional(),
  "paymentStatus": z.string().describe("The condition of the account, such as due, paid, in arrears.").optional(),
  "billStructure": z.lazy(() => billStructureSchema).optional(),
  "paymentPlan": z.array(z.lazy(() => paymentPlanSchema)).describe("A list of payment plans that are active or expired for the account, for example if the customer had difficulty in paying").optional(),
  "financialAccount": z.lazy(() => financialAccountRefSchema).optional(),
  "defaultPaymentMethod": z.lazy(() => paymentMethodRefSchema).optional(),
  "ratingType": z.string().describe("Indicates whether the account follows a specific payment option such as prepaid or postpaid").optional()
});
const errorSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "code": z.string().describe("Application relevant detail, defined in the API or a common list."),
  "reason": z.string().describe("Explanation of the reason for the error which can be shown to a client user."),
  "message": z.string().describe("More details and corrective actions related to the error which can be shown to a client user.").optional(),
  "status": z.string().describe("HTTP Error code extension").optional(),
  "referenceError": z.string().describe("URI of documentation describing the error.").optional()
}).describe("Used when an API throws an Error, typically with a HTTP error response-code (3xx, 4xx, 5xx)");
const billingAccount_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "creditLimit": z.lazy(() => moneySchema).optional(),
  "description": z.string().describe("Detailed description of the account").optional(),
  "lastUpdate": z.string().datetime().describe("The date and time that the account was last updated").optional(),
  "name": z.string().describe("Name of the account").optional(),
  "state": z.string().describe("Contains the lifecycle state such as: Active, Closed, Suspended and so on.").optional(),
  "accountType": z.string().describe("A categorization of an account, such as individual, joint, and so forth, whose instances share some of the same characteristics. Note: for flexibility we use a String here but an implementation may use an enumeration with a limited list of valid values.").optional(),
  "relatedParty": z.array(z.lazy(() => relatedPartyRefOrPartyRoleRef_MVOSchema)).describe("List of parties that have some relationship with the account, for example the customer to whom the account belongs").optional(),
  "taxExemption": z.array(z.lazy(() => taxExemptionCertificate_MVOSchema)).describe("List of tax exemptions that can be applied when calculating charges levied to the account.").optional(),
  "contact": z.array(z.lazy(() => contact_MVOSchema)).describe("List of people who could be contacted regarding the account, for example the accountant who authorizes payments").optional(),
  "accountBalance": z.array(z.lazy(() => accountBalance_MVOSchema)).describe("List of balances for the account, for example regular postpaid balance, deposit balance, write-off balance.").optional(),
  "accountRelationship": z.array(z.lazy(() => accountRelationship_MVOSchema)).describe("List of balances related to the account. For example a list of billing accounts that contribute to a financial account").optional(),
  "paymentStatus": z.string().describe("The condition of the account, such as due, paid, in arrears.").optional(),
  "billStructure": z.lazy(() => billStructure_MVOSchema).optional(),
  "paymentPlan": z.array(z.lazy(() => paymentPlan_MVOSchema)).describe("A list of payment plans that are active or expired for the account, for example if the customer had difficulty in paying").optional(),
  "financialAccount": z.lazy(() => financialAccountRef_MVOSchema).optional(),
  "defaultPaymentMethod": z.lazy(() => paymentMethodRef_MVOSchema).optional(),
  "ratingType": z.string().describe("Indicates whether the account follows a specific payment option such as prepaid or postpaid").optional()
});
const jsonPatchOperationsSchema = z.array(z.lazy(() => jsonPatchSchema)).describe("JSONPatch Operations document as defined by RFC 6902");
const jsonPatchSchema = z.object({
  "op": z.enum(["add", "remove", "replace", "move", "copy", "test"]).describe("The operation to be performed"),
  "path": z.string().describe("A JSON-Pointer"),
  "value": z.any().describe("The value to be used within the operations.").optional(),
  "from": z.string().describe("A string containing a JSON Pointer value.").optional()
}).describe("A JSONPatch document as defined by RFC 6902");
const billStructureSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "presentationMedia": z.array(z.lazy(() => billPresentationMediaRefOrValueSchema)).optional(),
  "format": z.lazy(() => billFormatRefOrValueSchema).optional(),
  "cycleSpecification": z.lazy(() => billingCycleSpecificationRefOrValueSchema).optional()
});
const paymentPlanSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the plan within list of the plans (for entities with list)").optional(),
  "numberOfPayments": z.number().describe("Number of payments used to spread the global payment").optional(),
  "paymentFrequency": z.string().describe("Frequency of the payments, such as monthly and bimonthly").optional(),
  "priority": z.number().describe("Priority of the payment plan").optional(),
  "status": z.string().describe("Status of the payment plan (effective, ineffective)").optional(),
  "totalAmount": z.lazy(() => moneySchema).optional(),
  "planType": z.string().describe("Type of payment plan").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "paymentMethod": z.lazy(() => paymentMethodRefSchema).optional()
});
const financialAccountRefSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("AccountReceivable reference. An account of money owed by a party to another entity in exchange for goods or services that have been delivered or used. An account receivable aggregates the amounts of one or more party accounts (billing or settlement) owned by a given party.");
const paymentMethodRefSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("PaymentMethod reference. A payment method defines a specific mean of payment (e.g direct debit).");
const billStructure_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "presentationMedia": z.array(z.lazy(() => billPresentationMediaRefOrValue_MVOSchema)).optional(),
  "format": z.lazy(() => billFormatRefOrValue_MVOSchema).optional(),
  "cycleSpecification": z.lazy(() => billingCycleSpecificationRefOrValue_MVOSchema).optional()
});
const paymentPlan_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the plan within list of the plans (for entities with list)").optional(),
  "numberOfPayments": z.number().describe("Number of payments used to spread the global payment").optional(),
  "paymentFrequency": z.string().describe("Frequency of the payments, such as monthly and bimonthly").optional(),
  "priority": z.number().describe("Priority of the payment plan").optional(),
  "status": z.string().describe("Status of the payment plan (effective, ineffective)").optional(),
  "totalAmount": z.lazy(() => moneySchema).optional(),
  "planType": z.string().describe("Type of payment plan").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "paymentMethod": z.lazy(() => paymentMethodRef_MVOSchema).optional()
});
const financialAccountRef_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("AccountReceivable reference. An account of money owed by a party to another entity in exchange for goods or services that have been delivered or used. An account receivable aggregates the amounts of one or more party accounts (billing or settlement) owned by a given party.");
const paymentMethodRef_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("PaymentMethod reference. A payment method defines a specific mean of payment (e.g direct debit).");
const moneySchema = z.object({
  "unit": z.string().describe("Currency (ISO4217 norm uses 3 letters to define the currency)").optional(),
  "value": z.number().describe("A signed floating point number, the meaning of the sign is according to the context of the API that uses this Data type").optional()
}).describe("A base / value business entity used to represent money");
const relatedPartyRefOrPartyRoleRefSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "role": z.string().describe("Role played by the related party or party role in the context of the specific entity it is linked to. Such as 'initiator', 'customer',  'salesAgent', 'user'").optional(),
  "partyOrPartyRole": z.lazy(() => partyRefOrPartyRoleRefSchema).optional()
});
const taxExemptionCertificateSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the tax exemption within list of the exemptions").optional(),
  "taxDefinition": z.array(z.lazy(() => taxDefinitionSchema)).describe("A list of taxes that are covered by the exemption, e.g. City Tax, State Tax. The definition would include the exemption (e.g. for a rate exemption 0% would be a full exemption, 5% could be a partial exemption if the actual rate was 10%).").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "certificateNumber": z.string().describe("Identifier of a document that shows proof of exemption from taxes for the taxing jurisdiction").optional(),
  "issuingJurisdiction": z.string().describe("Name of the jurisdiction that issued the exemption").optional(),
  "reason": z.string().describe("Reason for the tax exemption").optional(),
  "attachment": z.lazy(() => attachmentRefOrValueSchema).optional()
});
const contactSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the contact within list of the contacts (for entities with list)").optional(),
  "contactName": z.string().describe("A displayable name for that contact").optional(),
  "contactType": z.string().describe("Type of contact (primary, secondary...)").optional(),
  "partyRoleType": z.string().describe("Identifies what kind of party role type is linked to the contact (a account manager...)").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "contactMedium": z.array(z.lazy(() => contactMediumSchema)).describe("List of contact mediums for the contact, such as mobile phone number, email addreess, etc.").optional(),
  "relatedParty": z.lazy(() => relatedPartyRefOrPartyRoleRefSchema).optional()
});
const accountBalanceSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the balance within list of the balances (for entities with list)").optional(),
  "amount": z.lazy(() => moneySchema).optional(),
  "balanceType": z.string().describe("Type of the balance : deposit balance, disputed balance, loyalty balance, receivable balance...").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
});
const accountRelationshipSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "relationshipType": z.string().describe("Type of relationship").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "account": z.lazy(() => accountRefSchema).optional()
});
const billPresentationMediaRefOrValueSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillPresentationMedia"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "description": z.string().describe("An explanatory text describing this bill presentation media").optional()
}), z.object({
  "@type": z.literal("BillPresentationMediaRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("PresentationMedia reference. A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillPresentationMedia entity and not the BillPresentationMediaRefOrValue class itself");
const billFormatRefOrValueSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillFormat"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "description": z.string().describe("An explanatory text for this bill format").optional()
}), z.object({
  "@type": z.literal("BillFormatRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("BillFormat reference. A bill format is a description of the way in which a bill is presented.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillFormat entity and not the BillFormatRefOrValue class itself");
const billingCycleSpecificationRefOrValueSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillingCycleSpecification"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "billingDateShift": z.number().describe("An offset of a billing/settlement date. The offset is expressed as number of days with regard to the start of the billing/settlement period.").optional(),
  "billingPeriod": z.string().describe("A billing time period. It can be recurring, for example: week, month, quarter of year, year .").optional(),
  "chargeDateOffset": z.number().describe("An offset of a date through which charges previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "creditDateOffset": z.number().describe("An offset of a date through which credits previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "description": z.string().describe("An explanation regarding this billing cycle specification").optional(),
  "frequency": z.string().describe("Frequency of the billing cycle (monthly for instance)").optional(),
  "mailingDateOffset": z.number().describe("An offset of a customer bill mailing date. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "paymentDueDateOffset": z.number().describe("An offset of a payment due date. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
}), z.object({
  "@type": z.literal("BillingCycleSpecificationRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("BillingCycleSpecification reference. A description of when to initiate a billing cycle and the various sub steps of a billing cycle.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillingCycleSpecification entity and not the BillingCycleSpecificationRefOrValue class itself");
const timePeriodSchema = z.object({
  "startDateTime": z.string().datetime().describe("Start of the time period, using IETC-RFC-3339 format").optional(),
  "endDateTime": z.string().datetime().describe("End of the time period, using IETC-RFC-3339 format").optional()
}).describe("A period of time, either as a deadline (endDateTime only) a startDateTime only, or both");
const relatedPartyRefOrPartyRoleRef_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "role": z.string().describe("Role played by the related party or party role in the context of the specific entity it is linked to. Such as 'initiator', 'customer',  'salesAgent', 'user'").optional(),
  "partyOrPartyRole": z.lazy(() => partyRefOrPartyRoleRef_MVOSchema).optional()
});
const taxExemptionCertificate_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the tax exemption within list of the exemptions").optional(),
  "taxDefinition": z.array(z.lazy(() => taxDefinition_MVOSchema)).describe("A list of taxes that are covered by the exemption, e.g. City Tax, State Tax. The definition would include the exemption (e.g. for a rate exemption 0% would be a full exemption, 5% could be a partial exemption if the actual rate was 10%).").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "certificateNumber": z.string().describe("Identifier of a document that shows proof of exemption from taxes for the taxing jurisdiction").optional(),
  "issuingJurisdiction": z.string().describe("Name of the jurisdiction that issued the exemption").optional(),
  "reason": z.string().describe("Reason for the tax exemption").optional(),
  "attachment": z.lazy(() => attachmentRefOrValue_MVOSchema).optional()
});
const contact_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the contact within list of the contacts (for entities with list)").optional(),
  "contactName": z.string().describe("A displayable name for that contact").optional(),
  "contactType": z.string().describe("Type of contact (primary, secondary...)").optional(),
  "partyRoleType": z.string().describe("Identifies what kind of party role type is linked to the contact (a account manager...)").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "contactMedium": z.array(z.lazy(() => contactMedium_MVOSchema)).describe("List of contact mediums for the contact, such as mobile phone number, email addreess, etc.").optional(),
  "relatedParty": z.lazy(() => relatedPartyRefOrPartyRoleRef_MVOSchema).optional()
});
const accountBalance_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier of the balance within list of the balances (for entities with list)").optional(),
  "amount": z.lazy(() => moneySchema).optional(),
  "balanceType": z.string().describe("Type of the balance : deposit balance, disputed balance, loyalty balance, receivable balance...").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
});
const accountRelationship_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "relationshipType": z.string().describe("Type of relationship").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "account": z.lazy(() => accountRef_MVOSchema).optional()
});
const billPresentationMediaRefOrValue_MVOSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillPresentationMedia"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "description": z.string().describe("An explanatory text describing this bill presentation media").optional()
}), z.object({
  "@type": z.literal("BillPresentationMediaRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("PresentationMedia reference. A mean of communicating a bill, supported by the associated bill format. For example, post mail, email, web page.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillPresentationMedia entity and not the BillPresentationMediaRefOrValue class itself");
const billFormatRefOrValue_MVOSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillFormat"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "description": z.string().describe("An explanatory text for this bill format").optional()
}), z.object({
  "@type": z.literal("BillFormatRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("BillFormat reference. A bill format is a description of the way in which a bill is presented.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillFormat entity and not the BillFormatRefOrValue class itself");
const billingCycleSpecificationRefOrValue_MVOSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("BillingCycleSpecification"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "name": z.string().describe("A short descriptive name").optional(),
  "billingDateShift": z.number().describe("An offset of a billing/settlement date. The offset is expressed as number of days with regard to the start of the billing/settlement period.").optional(),
  "billingPeriod": z.string().describe("A billing time period. It can be recurring, for example: week, month, quarter of year, year .").optional(),
  "chargeDateOffset": z.number().describe("An offset of a date through which charges previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "creditDateOffset": z.number().describe("An offset of a date through which credits previously received by the billing system will appear on the bill. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "description": z.string().describe("An explanation regarding this billing cycle specification").optional(),
  "frequency": z.string().describe("Frequency of the billing cycle (monthly for instance)").optional(),
  "mailingDateOffset": z.number().describe("An offset of a customer bill mailing date. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "paymentDueDateOffset": z.number().describe("An offset of a payment due date. The offset is expressed as number of days with regard to the start of the BillingPeriod.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
}), z.object({
  "@type": z.literal("BillingCycleSpecificationRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("BillingCycleSpecification reference. A description of when to initiate a billing cycle and the various sub steps of a billing cycle.")]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the BillingCycleSpecification entity and not the BillingCycleSpecificationRefOrValue class itself");
const partyRefOrPartyRoleRefSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("PartyRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("A Party reference"), z.object({
  "@type": z.literal("PartyRoleRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional(),
  "partyId": z.string().describe("The identifier of the engaged party that is linked to the PartyRole object.").optional(),
  "partyName": z.string().describe("The name of the engaged party that is linked to the PartyRole object.").optional()
})]);
const taxDefinitionSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Unique identifier of the tax.").optional(),
  "name": z.string().describe("Tax name.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "jurisdictionName": z.string().describe("Name of the jurisdiction that levies the tax").optional(),
  "jurisdictionLevel": z.string().describe("Level of the jurisdiction that levies the tax").optional(),
  "taxType": z.string().describe("Type of the tax.").optional()
});
const attachmentRefOrValueSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("Attachment"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("Hyperlink reference").optional(),
  "id": z.string().describe("unique identifier").optional(),
  "name": z.string().describe("The name of the attachment").optional(),
  "description": z.string().describe("A narrative text describing the content of the attachment").optional(),
  "url": z.string().describe("Uniform Resource Locator, is a web page address (a subset of URI)").optional(),
  "content": z.string().describe("The actual contents of the attachment object, if embedded, encoded as base64").optional(),
  "size": z.lazy(() => quantitySchema).optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "attachmentType": z.string().describe("a business characterization of the purpose of the attachment, for example logo, instructionManual, contractCopy").optional(),
  "mimeType": z.string().describe("a technical characterization of the attachment content format using IETF Mime Types").optional()
}), z.object({
  "@type": z.literal("AttachmentRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional(),
  "description": z.string().describe("A narrative text describing the content of the attachment").optional(),
  "url": z.string().describe("Link to the attachment media/content").optional()
})]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the Attachment entity and not the AttachmentRefOrValue class itself");
const contactMediumSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier for this contact medium.").optional(),
  "preferred": z.boolean().describe("If true, indicates that is the preferred contact medium").optional(),
  "contactType": z.string().describe("Type of the contact medium to qualifiy it like pro email / personal email. This is not used to define the contact medium used.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
});
const accountRefSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("Account reference. A account may be a party account or a financial account.");
const partyRefOrPartyRoleRef_MVOSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("PartyRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("A Party reference"), z.object({
  "@type": z.literal("PartyRoleRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional(),
  "partyId": z.string().describe("The identifier of the engaged party that is linked to the PartyRole object.").optional(),
  "partyName": z.string().describe("The name of the engaged party that is linked to the PartyRole object.").optional()
})]);
const taxDefinition_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Unique identifier of the tax.").optional(),
  "name": z.string().describe("Tax name.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "jurisdictionName": z.string().describe("Name of the jurisdiction that levies the tax").optional(),
  "jurisdictionLevel": z.string().describe("Level of the jurisdiction that levies the tax").optional(),
  "taxType": z.string().describe("Type of the tax.").optional()
});
const attachmentRefOrValue_MVOSchema = z.discriminatedUnion("@type", [z.object({
  "@type": z.literal("Attachment"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "name": z.string().describe("The name of the attachment").optional(),
  "description": z.string().describe("A narrative text describing the content of the attachment").optional(),
  "url": z.string().describe("Uniform Resource Locator, is a web page address (a subset of URI)").optional(),
  "content": z.string().describe("The actual contents of the attachment object, if embedded, encoded as base64").optional(),
  "size": z.lazy(() => quantitySchema).optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional(),
  "attachmentType": z.string().describe("a business characterization of the purpose of the attachment, for example logo, instructionManual, contractCopy").optional(),
  "mimeType": z.string().describe("a technical characterization of the attachment content format using IETF Mime Types").optional()
}), z.object({
  "@type": z.literal("AttachmentRef"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional(),
  "description": z.string().describe("A narrative text describing the content of the attachment").optional(),
  "url": z.string().describe("Link to the attachment media/content").optional()
})]).describe("The polymorphic attributes @type, @schemaLocation & @referredType are related to the Attachment entity and not the AttachmentRefOrValue class itself");
const contactMedium_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "id": z.string().describe("Identifier for this contact medium.").optional(),
  "preferred": z.boolean().describe("If true, indicates that is the preferred contact medium").optional(),
  "contactType": z.string().describe("Type of the contact medium to qualifiy it like pro email / personal email. This is not used to define the contact medium used.").optional(),
  "validFor": z.lazy(() => timePeriodSchema).optional()
});
const accountRef_MVOSchema = z.object({
  "@type": z.string().describe("When sub-classing, this defines the sub-class Extensible name"),
  "@baseType": z.string().describe("When sub-classing, this defines the super-class").optional(),
  "@schemaLocation": z.string().describe("A URI to a JSON-Schema file that defines additional attributes and relationships").optional(),
  "href": z.string().describe("The URI of the referred entity.").optional(),
  "id": z.string().describe("The identifier of the referred entity."),
  "name": z.string().describe("Name of the referred entity.").optional(),
  "@referredType": z.string().describe("The actual type of the target instance when needed for disambiguation.").optional()
}).describe("Account reference. A account may be a party account or a financial account.");
const quantitySchema = z.object({
  "amount": z.number().describe("Numeric value in a given unit").optional(),
  "units": z.string().describe("Unit").optional()
}).describe("An amount in a given unit");
export const getRequestSchema = z.object({
  method: z.literal("get"),
  path: z.object({
    "id": z.string().describe("Identifier of the Resource")
  }),
  query: z.object({
    "fields": z.string().describe("Comma-separated properties to be provided in response").optional()
  }),
  body: z.undefined().optional()
});
export const patchRequestSchema = z.object({
  method: z.literal("patch"),
  path: z.object({
    "id": z.string().describe("Identifier of the Resource")
  }),
  query: z.object({
    "fields": z.string().describe("Comma-separated properties to be provided in response").optional()
  }),
  body: z.union([z.lazy(() => billingAccount_MVOSchema), z.lazy(() => billingAccount_MVOSchema), z.lazy(() => jsonPatchOperationsSchema), z.lazy(() => jsonPatchOperationsSchema)])
});
export const deleteRequestSchema = z.object({
  method: z.literal("delete"),
  path: z.object({
    "id": z.string().describe("Identifier of the Resource")
  }),
  query: z.object({}).optional().default({}),
  body: z.undefined().optional()
});
export const getResponseSchema = z.union([z.object({
  status: z.literal(200),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => billingAccountSchema)
}), z.object({
  status: z.literal(400),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(401),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(403),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(404),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(405),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(500),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(501),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(503),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
})]);
export const patchResponseSchema = z.union([z.object({
  status: z.literal(200),
  headers: z.object({}).describe("Response headers"),
  body: z.union([z.lazy(() => billingAccountSchema), z.lazy(() => billingAccountSchema), z.any(), z.any()])
}), z.object({
  status: z.literal(202),
  headers: z.object({}).describe("Response headers"),
  body: z.undefined()
}), z.object({
  status: z.literal(400),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(401),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(403),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(404),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(405),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(409),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(500),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(501),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(503),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
})]);
export const deleteResponseSchema = z.union([z.object({
  status: z.literal(202),
  headers: z.object({}).describe("Response headers"),
  body: z.undefined()
}), z.object({
  status: z.literal(204),
  headers: z.object({}).describe("Response headers"),
  body: z.undefined()
}), z.object({
  status: z.literal(400),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(401),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(403),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(404),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(405),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(409),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(500),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(501),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
}), z.object({
  status: z.literal(503),
  headers: z.object({}).describe("Response headers"),
  body: z.lazy(() => errorSchema)
})]);
```

can you look very carefully at the input and output schemas, and make sure that everything is modelled exactly the same. pay close attention to any optional/required fields, or any data models that don't line up to be exactly the same. identify any possible bugs or possible improvements before this makes it into production.

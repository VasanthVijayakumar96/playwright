@api
Feature: Backend API health and endpoints

  # TC-API-001  GET /health returns 200 { status: "ok" } (P1, @smoke)
  @smoke @TC-API-001
  Scenario: TC-API-001 - GET /health returns HTTP 200 with body { status: "ok" }
    When I send a GET request to "/health"
    Then the response status should be 200
    And the response JSON should equal:
      """
      { "status": "ok" }
      """

  # BLOCKED — protected endpoint list not yet finalised
  @blocked @skip @TC-API-002
  Scenario: TC-API-002 - GET /api/food/list returns a list of food items (BLOCKED - endpoint list TBD)
    Given I navigate to "/"

  @blocked @skip @TC-API-003
  Scenario: TC-API-003 - POST /api/user/login with valid credentials returns a token (BLOCKED - endpoint list TBD)
    Given I navigate to "/"

  @blocked @skip @TC-AUTHZ-001
  Scenario: TC-AUTHZ-001 - Unauthenticated access to /myorders redirects to login (BLOCKED - route guard not implemented)
    Given I navigate to "/"

  @blocked @skip @TC-AUTHZ-002
  Scenario: TC-AUTHZ-002 - Authenticated access to /myorders loads the page (BLOCKED - route guard not implemented)
    Given I navigate to "/"

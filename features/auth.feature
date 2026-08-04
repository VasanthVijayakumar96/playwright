@auth
Feature: Authentication flows

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-001  /login page loads (P0, @smoke)
  # ─────────────────────────────────────────────────────────────────────────────
  @smoke @TC-AUTH-001
  Scenario: TC-AUTH-001 - Login page renders all required form elements
    Given I navigate to "/login"
    Then the login page form should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-002  /register page loads (P0, @smoke)
  # ─────────────────────────────────────────────────────────────────────────────
  @smoke @TC-AUTH-002
  Scenario: TC-AUTH-002 - Register page renders all required form elements
    Given I navigate to "/register"
    Then the register page form should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-003  Login success with returnTo redirect (P0)
  # Clicks Sign-in from / so returnTo is stored as "/"; verifies redirect back.
  # ─────────────────────────────────────────────────────────────────────────────
  @TC-AUTH-003
  Scenario: TC-AUTH-003 - Successful login redirects to the stored returnTo path
    Given I navigate to "/"
    When I click the navbar Sign in button
    And I login with valid credentials
    Then I should be redirected to "/"
    And localStorage "token" should be set
    And the navbar profile should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-007  Direct /login (no returnTo) redirects to / (P1)
  # ─────────────────────────────────────────────────────────────────────────────
  @TC-AUTH-007
  Scenario: TC-AUTH-007 - Login without a returnTo value defaults to redirecting to home
    Given I clear sessionStorage "returnTo"
    And I navigate to "/login"
    When I login with valid credentials
    Then I should be redirected to "/"
    And the navbar profile should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-009  Logout clears token and restores guest navbar (P0)
  # ─────────────────────────────────────────────────────────────────────────────
  @TC-AUTH-009
  Scenario: TC-AUTH-009 - Logout removes the auth token and shows Sign-in/Sign-up
    Given I am logged in via UI
    When I logout via navbar
    Then localStorage "token" should be cleared
    And the logged out navbar should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-AUTH-010  Refresh after login preserves auth state (P0)
  # ─────────────────────────────────────────────────────────────────────────────
  @TC-AUTH-010
  Scenario: TC-AUTH-010 - Page reload preserves the authenticated session
    Given I am logged in via UI
    When I reload the page
    Then the navbar profile should be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-SEC-001  Open redirect protection (P1)
  # sessionStorage returnTo is set to an external URL; login must stay on origin.
  # ─────────────────────────────────────────────────────────────────────────────
  @security @TC-SEC-001
  Scenario: TC-SEC-001 - External URL in returnTo is rejected and redirects to home
    Given I set sessionStorage "returnTo" to "https://evil.com"
    And I navigate to "/login"
    When I login with valid credentials
    Then I should remain on the application origin

  # ─────────────────────────────────────────────────────────────────────────────
  # PENDING — user creation repeatability issues; run manually only
  # ─────────────────────────────────────────────────────────────────────────────
  @skip @TC-AUTH-004
  Scenario: TC-AUTH-004 - Register a brand-new user successfully (PENDING - repeatability)
    Given I navigate to "/register"

  @skip @TC-AUTH-005
  Scenario: TC-AUTH-005 - Duplicate email registration shows an error (PENDING - repeatability)
    Given I navigate to "/register"

  @skip @TC-AUTH-006
  Scenario: TC-AUTH-006 - Invalid credentials show an error message (PENDING - PARTIAL)
    Given I navigate to "/login"

  @skip @TC-AUTH-008
  Scenario: TC-AUTH-008 - Register success redirects to returnTo path (PENDING - repeatability)
    Given I navigate to "/register"

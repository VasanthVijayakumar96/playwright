@auth
Feature: Authentication flows

  # TC-AUTH-001  /login page loads (P0, @smoke)
  @smoke @TC-AUTH-001
  Scenario: TC-AUTH-001 - Login page renders all required form elements
    Given I navigate to "/login"
    Then the login page form should be visible

  # TC-AUTH-002  /register page loads (P0, @smoke)
  @smoke @TC-AUTH-002
  Scenario: TC-AUTH-002 - Register page renders all required form elements
    Given I navigate to "/register"
    Then the register page form should be visible

  # TC-AUTH-003  Login success with returnTo=/cart redirect (P0, @smoke)
  @smoke @TC-AUTH-003
  Scenario: TC-AUTH-003 - Successful login redirects to the stored returnTo path
    Given I navigate to "/cart"
    When I click the navbar Sign in button
    And I login with valid credentials
    Then I should be redirected to "/cart"
    And localStorage "token" should be set
    And the navbar profile should be visible

  # TC-AUTH-007  Direct /login (no returnTo) redirects to / (P1)
  @TC-AUTH-007
  Scenario: TC-AUTH-007 - Login without a returnTo value defaults to redirecting to home
    Given I clear sessionStorage "returnTo"
    And I navigate to "/login"
    When I login with valid credentials
    Then I should be redirected to "/"
    And the navbar profile should be visible

  # TC-AUTH-009  Logout clears token and restores guest navbar (P0)
  @TC-AUTH-009
  Scenario: TC-AUTH-009 - Logout removes the auth token and shows Sign-in/Sign-up
    Given I am logged in via UI
    When I logout via navbar
    Then localStorage "token" should be cleared
    And the logged out navbar should be visible

  # TC-AUTH-010  Refresh after login preserves auth state (P0)
  @TC-AUTH-010
  Scenario: TC-AUTH-010 - Page reload preserves the authenticated session
    Given I am logged in via UI
    When I reload the page
    Then the navbar profile should be visible

  # TC-SEC-001  Open redirect protection (P1)
  @security @TC-SEC-001
  Scenario: TC-SEC-001 - External URL in returnTo is rejected and redirects to home
    Given I set sessionStorage "returnTo" to "https://evil.com"
    And I navigate to "/login"
    When I login with valid credentials
    Then I should remain on the application origin

  # TC-AUTH-NEG-001  Login: missing email shows validation (P1, @negative)
  @negative @TC-AUTH-NEG-001
  Scenario: TC-AUTH-NEG-001 - Login: submitting with empty email field does not navigate away
    Given I navigate to "/login"
    When I submit the login form with password filled but email empty
    Then the page URL should still be "/login"

  # TC-AUTH-NEG-002  Login: missing password shows validation (P1, @negative)
  @negative @TC-AUTH-NEG-002
  Scenario: TC-AUTH-NEG-002 - Login: submitting with empty password field does not navigate away
    Given I navigate to "/login"
    When I submit the login form with email filled but password empty
    Then the page URL should still be "/login"

  # TC-AUTH-NEG-003  Login: invalid credentials show error (P1, @negative)
  @negative @TC-AUTH-NEG-003
  Scenario: TC-AUTH-NEG-003 - Login: wrong password shows error toast and no token is stored
    Given I navigate to "/login"
    When I submit the login form with wrong credentials
    Then an error message should be visible
    And the page URL should still be "/login"
    And localStorage "token" should be cleared

  # TC-AUTH-NEG-004  Register: all fields empty shows validation (P1, @negative)
  @negative @TC-AUTH-NEG-004
  Scenario: TC-AUTH-NEG-004 - Register: submitting with all fields empty does not navigate away
    Given I navigate to "/register"
    When I submit the register form with all fields empty
    Then the page URL should still be "/register"

  # TC-AUTH-NEG-005  Register: invalid email format shows validation (P1, @negative)
  @negative @TC-AUTH-NEG-005
  Scenario: TC-AUTH-NEG-005 - Register: invalid email format does not navigate away
    Given I navigate to "/register"
    When I fill the register form with name and password but an invalid email
    Then the page URL should still be "/register"

  # TC-AUTH-004  Login with returnTo hash scrolls to anchor (P1, PARTIAL)
  @partial @TC-AUTH-004
  Scenario: TC-AUTH-004 - Login with returnTo hash navigates to hash anchor and scrolls explore-menu into view
    Given I navigate to "/#explore-menu"
    When I click the navbar Sign in button
    And I login with valid credentials
    Then the URL should contain "#explore-menu"
    And the element "#explore-menu" should be in the viewport

  # PENDING: user-creation repeatability issues; run manually only
  @skip @TC-AUTH-005
  Scenario: TC-AUTH-005 - Register success redirects to the stored returnTo path (PENDING - repeatability)
    Given I navigate to "/register"

  @skip @TC-AUTH-006
  Scenario: TC-AUTH-006 - Register success with returnTo hash navigates to hash anchor (PENDING - repeatability)
    Given I navigate to "/register"

  @skip @TC-AUTH-008
  Scenario: TC-AUTH-008 - Direct /register without returnTo redirects to home (PENDING - repeatability)
    Given I navigate to "/register"

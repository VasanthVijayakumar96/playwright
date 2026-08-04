@nav
Feature: Navigation and navbar behaviour

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-NAV-001  Navbar logged-out state (P0, @smoke)
  # ─────────────────────────────────────────────────────────────────────────────
  @smoke @TC-NAV-001
  Scenario: TC-NAV-001 - Logged-out user sees Sign-in and Sign-up and no profile dropdown
    Given I navigate to "/"
    Then the logged out navbar should be visible
    And the navbar profile should not be visible

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-NAV-002  Navbar CTAs navigate to correct pages without a modal (P0, @smoke)
  # The original app showed a popup modal; the new implementation navigates to
  # dedicated /login and /register pages (no modal overlay).
  # ─────────────────────────────────────────────────────────────────────────────
  @smoke @TC-NAV-002
  Scenario: TC-NAV-002 - Sign-in CTA navigates to /login without opening a modal
    Given I navigate to "/"
    When I click the navbar Sign in button
    Then the URL should end with "/login"

  @smoke @TC-NAV-002
  Scenario: TC-NAV-002 - Sign-up CTA navigates to /register without opening a modal
    Given I navigate to "/"
    When I click the navbar Sign up button
    Then the URL should end with "/register"

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-NAV-003  ScrollToHash scrolls to existing anchor (P1, @partial)
  # Navigates from /cart to /#explore-menu and verifies the element is on screen.
  # Marked @partial because the bounding-box check is a heuristic.
  # ─────────────────────────────────────────────────────────────────────────────
  @partial @TC-NAV-003
  Scenario: TC-NAV-003 - Navigating to /#explore-menu scrolls explore-menu into view
    Given I navigate to "/cart"
    When I navigate to "/#explore-menu"
    Then the element "#explore-menu" should be in the viewport

  # ─────────────────────────────────────────────────────────────────────────────
  # TC-NAV-004  ScrollToHash missing hash does not crash (P2)
  # ─────────────────────────────────────────────────────────────────────────────
  @TC-NAV-004
  Scenario: TC-NAV-004 - Navigating to a non-existent hash does not crash the page
    Given I navigate to "/#does-not-exist"
    Then the page should still render
    And there should be no fatal console errors

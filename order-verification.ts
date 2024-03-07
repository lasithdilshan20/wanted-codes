/**
To verify that elements are in ascending order based on their visible text in Cypress, you can leverage Cypress commands to fetch the elements, extract their texts, and then assert the order. This approach involves fetching all relevant <a> elements, storing their text contents in an array, and then comparing this array to a sorted version of itself to ensure it's in ascending order.

Here is how you can do it:

Fetch the Elements: Use a selector that matches both links. If these are the only two <a> tags under a specific part of the DOM, you can use a more generic selector; otherwise, adjust the selector to be more specific to match only the elements you're interested in.

Extract Texts and Verify Order: Iterate over the elements to extract their texts, then compare the extracted list to a sorted version of itself.
**/

describe('Link Order Verification', () => {
  it('should verify that links are in ascending order by their text', () => {
    cy.visit('/your-page-url'); // Navigate to the page where the elements are located

    // Fetch the elements and extract their texts
    cy.get('a[href^="/daily-snapshots/vehicle/"]') // Adjust this selector as needed
      .then($links => {
        const texts = $links.map((index, link) => Cypress.$(link).text()).get();

        // Clone and sort the texts array in ascending order
        const sortedTexts = [...texts].sort((a, b) => a.localeCompare(b));

        // Assert that the original array is in ascending order
        expect(texts).to.deep.equal(sortedTexts);
      });
  });
});

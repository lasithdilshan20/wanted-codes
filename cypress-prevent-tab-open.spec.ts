it('prevent cypress multiple tab openning',function() {
  cy.visit(basedurl)
  cy.get("button#clickAfteOpenTab").click()
  cy.window().then((win) => {
    win.location.href = "https://www.2nd_url.com"
  })

})

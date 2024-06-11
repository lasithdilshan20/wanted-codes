Cypress.Commands.add("loginViaApi", (username: string, password: string, page: string) => {
    const state = {
        user: {
            current: "",
            meta: {
                error: null,
                fetchingUserInfo: false,
                fetchingUserInfoError: null,
                isLoading: false,
                lastFetched: "now",
            },
        },
    }

    let body: string
    cy.request({
        method: "POST",
        url: Cypress.env("apiUrl") + "/auth?format=jwt",
        body: {
            referrer: "app.teletracnavman.com",
            username: username,
            password: password,
        },
    }).then((res) => {
        // state = JSON.parse('{"user": {"current": ""}}')
        res.body.auth.key = res.body.keys[0].accessToken
        state.user.current = res.body
        body = res.body
        window.localStorage.setItem("authToken", res.body.keys[0].accessToken)
    })

    cy.visit("/" + page, {
        onLoad(win) {
            interface AuthCookie {
                _A_TN360_: string
                path: string
                secure: boolean
                samesite: string
                [index: string]: string | boolean
            }
            }
            document.cookie = Object.keys(authCookie)
                .map((k) => k + "=" + String(authCookie[k]))
                .join(";")

            const cur = Date.now()
            const actionTime = cur / 1000
            win.localStorage.setItem("tokenTime", cur.toString())
            win.localStorage.removeItem("logout")
            win.localStorage.setItem("state", JSON.stringify(state))
            win.localStorage.setItem("userActionTime", actionTime.toString())
            win.localStorage.setItem("AutomationTest", "true")
            win.localStorage.setItem("auth_key", document.cookie)
        },
    }).then(() => {
        cy.visit("/" + page)
        cy.getLocalStorage("tokenTime").should("not.be.null")
        cy.getLocalStorage("AutomationTest").should("not.be.empty")
    })
    cy.get("[class*='Loading_Loading']", { timeout: 60000 }).should("not.exist")
})

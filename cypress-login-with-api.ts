Cypress.Commands.add("loginViaApiSession", (username: string, password: string, page: string) => {
    cy.session(
        [username, password],
        () => {
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
                url: "api.test.com/auth?format=jwt",
                body: {
                    referrer: "app.test.com", // nm
                    username: username, // m
                    password: password, //m
                },
            }).then((res) => {
                // state = JSON.parse('{"user": {"current": ""}}')
                res.body.auth.key = res.body.keys[0].accessToken
                state.user.current = res.body
                window.localStorage.setItem("authToken", 'Token token="' + res.body.keys[0].accessToken + '"')

                cy.visit("/" + page, {
                    onLoad(win) {
                        interface AuthCookie {
                            _A_TN360_: string
                            path: string
                            secure: boolean
                            samesite: string
                            [index: string]: string | boolean
                        }
                        // and before the page finishes loading
                        // set the state object in local storage
                        const authCookie: AuthCookie = {
                            _A_TN360_: window.btoa(JSON.stringify(body)),
                            path: "/",
                            secure: true,
                            samesite: "strict",
                        }
                        document.cookie = Object.keys(authCookie)
                            .map((k) => k + "=" + String(authCookie[k]))
                            .join(";")

                        const cur = Date.now()
                        const actionTime = cur / 1000
                        win.localStorage.setItem("tokenTime", cur.toString())
                        win.localStorage.removeItem("logout")
                        win.localStorage.setItem("state", JSON.stringify(state))
                        win.localStorage.setItem("userActionTime", Math.round(actionTime).toString())
                        win.localStorage.setItem("AutomationTest", "true")
                        win.localStorage.setItem("authToken", 'Token token="' + res.body.keys[0].accessToken + '"')
                        // cy.setCookie('auth_key', document.cookie)
                    },
                }).then(() => {
                    cy.visit("/" + page)
                })
            })
        },
        {
            validate() {
                cy.getLocalStorage("tokenTime").should("not.be.null")
                cy.getLocalStorage("AutomationTest").should("not.be.empty")
            },
        }
    )
    cy.visit("/" + page)
    cy.get("[class*='Loading_Loading']").should("not.exist")
})

    function checkUOMAPI(language: string) {
        const apiUrl = 'https://qa.api-au.xxxxxxx.com/v1/scorecard/users/summary';

        const payload = {
            companyId: 14825,
            startAt: '2023-11-03', // Set your desired start date
            endAt: '2023-11-04',   // Set your desired end date
        };
        const authToken = 'Token token="13c58cb1e89f4d52b89fea0b2def7e5c"'

        cy.request({
            method: 'POST',
            url: apiUrl,
            body: payload,
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
                language: language
            },
        }).then((response) => {
            cy.log(response.body.company.distanceUom)
            expect(response.body.company.distanceUom).to.equal('Kilometers');
        });
    }

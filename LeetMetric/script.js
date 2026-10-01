document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // DOM ELEMENTS
    // =========================

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");

    const statsContainer =
        document.querySelector(".stats-container");

    const easyProgressCircle =
        document.querySelector(".easy-progress");

    const mediumProgressCircle =
        document.querySelector(".medium-progress");

    const hardProgressCircle =
        document.querySelector(".hard-progress");

    const easyLabel =
        document.getElementById("easy-label");

    const mediumLabel =
        document.getElementById("medium-label");

    const hardLabel =
        document.getElementById("hard-label");

    const cardStatsContainer =
        document.querySelector(".stats-cards");


    // =========================
    // CHECK HTML ELEMENTS
    // =========================

    console.log("Easy circle:", easyProgressCircle);
    console.log("Medium circle:", mediumProgressCircle);
    console.log("Hard circle:", hardProgressCircle);
    console.log("Easy label:", easyLabel);
    console.log("Medium label:", mediumLabel);
    console.log("Hard label:", hardLabel);
    console.log("Cards:", cardStatsContainer);


    // =========================
    // VALIDATE USERNAME
    // =========================

    function validateUsername(username) {

        username = username.trim();

        if (username === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,50}$/;

        if (!regex.test(username)) {
            alert("Invalid Username");
            return false;
        }

        return true;
    }


    // =========================
    // FETCH USER DETAILS
    // =========================

    async function fetchUserDetails(username) {

        try {

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;


            const proxyUrl =
                "https://cors-anywhere.herokuapp.com/";

            const targetUrl =
                "https://leetcode.com/graphql/";


            const myHeaders = new Headers();

            myHeaders.append(
                "Content-Type",
                "application/json"
            );


            // =========================
            // GRAPHQL QUERY
            // =========================

            const graphql = JSON.stringify({

                query: `
                    query userSessionProgress($username: String!) {

                        allQuestionsCount {
                            difficulty
                            count
                        }

                        matchedUser(username: $username) {

                            submitStats {

                                acSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }

                                totalSubmissionNum {
                                    difficulty
                                    count
                                    submissions
                                }

                            }

                        }
                    }
                `,

                variables: {
                    username: username
                }

            });


            const requestOptions = {

                method: "POST",

                headers: myHeaders,

                body: graphql

            };


            // =========================
            // API REQUEST
            // =========================

            const response = await fetch(
                proxyUrl + targetUrl,
                requestOptions
            );


            if (!response.ok) {

                throw new Error(
                    `Unable to fetch user details (${response.status})`
                );

            }


            const parsedData =
                await response.json();


            console.log(
                "Logging data:",
                parsedData
            );


            // =========================
            // GRAPHQL ERROR
            // =========================

            if (parsedData.errors) {

                console.error(
                    "GraphQL Error:",
                    parsedData.errors
                );

                throw new Error(
                    parsedData.errors[0]?.message ||
                    "LeetCode API Error"
                );

            }


            // =========================
            // USER NOT FOUND
            // =========================

            if (
                !parsedData.data ||
                !parsedData.data.matchedUser
            ) {

                throw new Error(
                    "LeetCode username not found"
                );

            }


            // =========================
            // DISPLAY DATA
            // =========================

            displayUserData(parsedData);

        }

        catch (error) {

            console.error(
                "Error:",
                error
            );


            if (statsContainer) {

                statsContainer.innerHTML = `
                    <p>${error.message}</p>
                `;

            } else {

                alert(error.message);

            }

        }

        finally {

            searchButton.textContent = "Search";
            searchButton.disabled = false;

        }

    }


    // =========================
    // UPDATE PROGRESS
    // =========================

    function updateProgress(
        solved,
        total,
        label,
        circle
    ) {

        // Prevent null error
        if (!circle) {

            console.error(
                "Progress circle element not found."
            );

            return;

        }


        if (!label) {

            console.error(
                "Progress label element not found."
            );

            return;

        }


        let progressDegree = 0;


        if (total > 0) {

            progressDegree =
                (solved / total) * 100;

        }


        // Make sure value doesn't exceed 100
        progressDegree =
            Math.min(progressDegree, 100);


        circle.style.setProperty(
            "--progress-degree",
            `${progressDegree}%`
        );


        label.textContent =
            `${solved}/${total}`;

    }


    // =========================
    // DISPLAY USER DATA
    // =========================

    function displayUserData(parsedData) {

        const data =
            parsedData.data;


        const allQuestions =
            data.allQuestionsCount;


        const matchedUser =
            data.matchedUser;


        const submitStats =
            matchedUser.submitStats;


        // =========================
        // TOTAL QUESTIONS
        // =========================

        const totalEasyQues =
            allQuestions.find(
                item => item.difficulty === "Easy"
            )?.count || 0;


        const totalMediumQues =
            allQuestions.find(
                item => item.difficulty === "Medium"
            )?.count || 0;


        const totalHardQues =
            allQuestions.find(
                item => item.difficulty === "Hard"
            )?.count || 0;


        // =========================
        // SOLVED QUESTIONS
        // =========================

        const solvedTotalQues =
            submitStats.acSubmissionNum.find(
                item => item.difficulty === "All"
            )?.count || 0;


        const solvedTotalEasyQues =
            submitStats.acSubmissionNum.find(
                item => item.difficulty === "Easy"
            )?.count || 0;


        const solvedTotalMediumQues =
            submitStats.acSubmissionNum.find(
                item => item.difficulty === "Medium"
            )?.count || 0;


        const solvedTotalHardQues =
            submitStats.acSubmissionNum.find(
                item => item.difficulty === "Hard"
            )?.count || 0;


        console.log(
            "Total Solved:",
            solvedTotalQues
        );

        console.log(
            "Easy:",
            solvedTotalEasyQues
        );

        console.log(
            "Medium:",
            solvedTotalMediumQues
        );

        console.log(
            "Hard:",
            solvedTotalHardQues
        );


        // =========================
        // UPDATE CIRCLES
        // =========================

        updateProgress(
            solvedTotalEasyQues,
            totalEasyQues,
            easyLabel,
            easyProgressCircle
        );


        updateProgress(
            solvedTotalMediumQues,
            totalMediumQues,
            mediumLabel,
            mediumProgressCircle
        );


        updateProgress(
            solvedTotalHardQues,
            totalHardQues,
            hardLabel,
            hardProgressCircle
        );


        // =========================
        // SUBMISSIONS
        // =========================

        const totalSubmissionNum =
            submitStats.totalSubmissionNum;


        const overallSubmissions =
            totalSubmissionNum.find(
                item => item.difficulty === "All"
            )?.submissions || 0;


        const easySubmissions =
            totalSubmissionNum.find(
                item => item.difficulty === "Easy"
            )?.submissions || 0;


        const mediumSubmissions =
            totalSubmissionNum.find(
                item => item.difficulty === "Medium"
            )?.submissions || 0;


        const hardSubmissions =
            totalSubmissionNum.find(
                item => item.difficulty === "Hard"
            )?.submissions || 0;


        // =========================
        // CARD DATA
        // =========================

        const cardsData = [

            {
                label: "Overall Submissions",
                value: overallSubmissions
            },

            {
                label: "Overall Easy Submissions",
                value: easySubmissions
            },

            {
                label: "Overall Medium Submissions",
                value: mediumSubmissions
            },

            {
                label: "Overall Hard Submissions",
                value: hardSubmissions
            }

        ];


        console.log(
            "Card data:",
            cardsData
        );


        // =========================
        // DISPLAY CARDS
        // =========================

        if (!cardStatsContainer) {

            console.error(
                ".stats-cards element not found"
            );

            return;

        }


        cardStatsContainer.innerHTML =
            cardsData.map(function (data) {

                return `
                    <div class="card">

                        <h4>${data.label}</h4>

                        <p>${data.value}</p>

                    </div>
                `;

            }).join("");

    }


    // =========================
    // SEARCH BUTTON
    // =========================

    searchButton.addEventListener(
        "click",
        function () {

            const username =
                usernameInput.value.trim();


            console.log(
                "Logging username:",
                username
            );


            if (validateUsername(username)) {

                fetchUserDetails(username);

            }

        }
    );


    // =========================
    // ENTER KEY
    // =========================

    usernameInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchButton.click();

            }

        }
    );

});